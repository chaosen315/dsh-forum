#!/usr/bin/env node
// tools/migrate-ids.js — 一次性迁移：历史 slug 帖 id → 确定性哈希 id。
// 背景：hash-post-id-and-forum-nav 定案「存量 slug 不迁移」，human 随后在自测帖
// f941e092ad73 a1 改判「修复历史 post 的 id 值」。本脚本执行该迁移。
//
// 哈希 = sha256(title + '\n' + author + '\n' + query_body) 取 12 hex（碰撞逐级加长），
// 与运行时 generatePostId 同字符集/同碰撞策略，区别仅在「去掉熵」——迁移要可复现、可复核。
// 波及面：posts.id、replies.post_id、depends_on(kind=post)、正文 [[token]]、summary 文本、
// subscriptions.value；重渲染 md（删旧 slug 文件、写新 hash 文件）。
//
// 用法：node tools/migrate-ids.js [--dry-run]
// 幂等：迁移后无 slug 帖，再跑为 no-op。
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { renderPost } = require('./render.js');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'kb.sqlite');
const POSTS_DIR = path.join(ROOT, 'posts');
const dryRun = process.argv.includes('--dry-run');

// 哈希 id：纯十六进制 ≥12 位。slug（含非 hex 字符或连字符）才需迁移。
const HASH_RE = /^[0-9a-f]{12,}$/;

function hashDigest(title, author, body) {
  return crypto.createHash('sha256').update([title, author, body].join('\n'), 'utf8').digest('hex');
}

function parseDeps(raw) { try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; } }

// 重写正文内联 [[token]]：只替换「恰好命中某旧 slug」的 id，语法示例（[[token]]/[[target]]…）原样保留。
function rewriteTokens(body, map) {
  return body.replace(/\[\[([^\[\]#]+)(#[^\[\]]+)?\]\]/g, (m, id, anchor) => {
    const key = id.trim();
    return map.has(key) ? `[[${map.get(key)}${anchor || ''}]]` : m;
  });
}

// 重写普通文本（summary）中的旧 slug → 新 id。
function rewriteText(text, map) {
  let out = text;
  for (const [old, neu] of map) out = out.split(old).join(neu);
  return out;
}

function main() {
  const db = new DatabaseSync(DB_PATH);
  const posts = db.prepare('SELECT * FROM posts ORDER BY id').all();
  const slugs = posts.filter((p) => !HASH_RE.test(p.id));
  if (!slugs.length) { console.log('（无 slug 帖，无需迁移）'); db.close(); return; }

  const used = new Set(posts.map((p) => p.id));
  const map = new Map(); // old -> new
  for (const p of slugs) {
    const q = db.prepare("SELECT body FROM replies WHERE post_id = ? AND kind = 'query'").get(p.id);
    const digest = hashDigest(p.title, p.author, q ? q.body : (p.summary || p.title));
    let cand = null;
    for (const len of [12, 16, 24, 32, 64]) {
      const c = digest.slice(0, len);
      if (!used.has(c)) { cand = c; break; }
    }
    if (!cand) {
      for (let i = 2; ; i++) {
        const c = `${digest.slice(0, 12)}-${i}`;
        if (!used.has(c)) { cand = c; break; }
      }
    }
    used.add(cand);
    map.set(p.id, cand);
  }

  console.log(`将迁移 ${slugs.length} 个 slug 帖（id → 哈希）：`);
  for (const [o, n] of map) console.log(`  ${o}  ->  ${n}`);

  if (dryRun) { console.log('（--dry-run，未落盘）'); db.close(); return; }

  db.exec('PRAGMA foreign_keys = OFF');
  db.exec('BEGIN');
  try {
    // 1. posts.id + replies.post_id（同步改名）
    const updReply = db.prepare('UPDATE replies SET post_id = ? WHERE post_id = ?');
    const updPost = db.prepare('UPDATE posts SET id = ? WHERE id = ?');
    for (const [old, neu] of map) { updReply.run(neu, old); updPost.run(neu, old); }

    // 2. depends_on（kind=post 的 id 改名）
    const selPost = db.prepare('SELECT id, depends_on FROM posts');
    const updDeps = db.prepare('UPDATE posts SET depends_on = ? WHERE id = ?');
    for (const p of selPost.all()) {
      const deps = parseDeps(p.depends_on);
      let changed = false;
      for (const d of deps) if (d.kind === 'post' && map.has(d.id)) { d.id = map.get(d.id); changed = true; }
      if (changed) updDeps.run(JSON.stringify(deps), p.id);
    }

    // 3. summary 文本（元数据可变）
    const updSummary = db.prepare('UPDATE posts SET summary = ? WHERE id = ?');
    for (const p of db.prepare('SELECT id, summary FROM posts').all()) {
      const s = rewriteText(p.summary, map);
      if (s !== p.summary) updSummary.run(s, p.id);
    }

    // 4. 正文内联 [[token]]（引用重写，保 referential integrity）
    const updBody = db.prepare('UPDATE replies SET body = ? WHERE post_id = ? AND id = ?');
    for (const r of db.prepare('SELECT post_id, id, body FROM replies').all()) {
      const b = rewriteTokens(r.body, map);
      if (b !== r.body) updBody.run(b, r.post_id, r.id);
    }

    // 5. subscriptions.value（post 订阅 checkpoint）
    const updSub = db.prepare("UPDATE subscriptions SET value = ? WHERE kind = 'post' AND value = ?");
    for (const [old, neu] of map) updSub.run(neu, old);

    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }

  // 6. 重渲染 md：删旧 slug 文件，写新 hash 文件
  const currentIds = new Set(db.prepare('SELECT id FROM posts').all().map((p) => p.id));
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    if (!currentIds.has(f.slice(0, -3))) { fs.rmSync(path.join(POSTS_DIR, f)); console.log(`  删旧渲染 ${f}`); }
  }
  for (const p of db.prepare('SELECT * FROM posts ORDER BY id').all()) {
    fs.writeFileSync(path.join(POSTS_DIR, `${p.id}.md`), renderPost(db, p));
  }

  console.log(`\n✓ 迁移完成：${slugs.length} 帖 slug → 哈希，md 已重渲染。`);
  console.log('  下一步：node tools/validate.js 复核；更新 .forum-kb/dispatch-sessions.json 的映射 key。');
  db.close();
}

main();
