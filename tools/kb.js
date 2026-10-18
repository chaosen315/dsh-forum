#!/usr/bin/env node
// forum-kb 交互工具（P2）：query / search / claim / answer / subscribe。
// 单一事实源 = kb.sqlite；每次写后重渲染该帖 md。提交到 git 由调用方负责。
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');
const { renderPost } = require('./render.js');
const schema = require('./schema.js');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'kb.sqlite');
const VALID_REL = new Set(['extends', 'supersedes', 'relates-to']);
// 排序档位（f0442aa0f3b3 P0，全部零新依赖）：缺省保持 id 序（向后兼容）；
// new=created_at；active=updated_at（所有写路径已维护）；top=answer 数+评论数。
const QUERY_SORTS = {
  default: 'p.id ASC',
  new: 'p.created_at DESC, p.id DESC',
  active: 'p.updated_at DESC, p.id DESC',
  top: `((SELECT COUNT(*) FROM replies ra WHERE ra.post_id = p.id AND ra.kind = 'answer') + (SELECT COUNT(*) FROM replies rc WHERE rc.post_id = p.id AND rc.kind = 'comment')) DESC, p.id ASC`,
};
// 帖子 id 形状（hash-post-id-and-forum-nav 定案）：小写 slug（人工显式指定，向后兼容）
// 或系统生成的十六进制哈希（≥12 位）——同一字符集，与 validate.js / Web 发帖表单三方对齐。
const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

function parseArgs(argv) {
  const args = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) { opts[key] = next; i++; }
      else opts[key] = true;
    } else {
      args.push(a);
    }
  }
  return { args, opts };
}

function openDb() {
  const db = new DatabaseSync(DB_PATH);
  // 并发写者等待锁而非立即 SQLITE_BUSY（D4：单宿主多 DSH 派活会话并发是常态面）。
  // 没有它，并发进程会在 schema.apply 的 DDL / 事务首语句上裸抛 BUSY 崩栈
  // （.build/verify-claim-cas.mjs 对照运行坐实）；5s 覆盖单笔短事务，真超时仍上抛 host。
  db.exec('PRAGMA busy_timeout = 5000');
  schema.apply(db); // 幂等：schema.sql 重放 + 存量库缺列迁移
  return db;
}

// body 双通道：调用方（host 服务/工具包）经 subprocess.spawn argv 传 body 时，
// Windows 下 argv→命令行字符串会损坏嵌入的双引号（且尾部截断）。故走 --body-b64
// （base64 仅含 A-Za-z0-9+/=，无引号/空白，argv 安全）。保留 --body 供人工 CLI
// 直用（不经 spawn argv，无此问题）。优先取 --body-b64。
function bodyOf(opts) {
  if (opts['body-b64'] !== undefined) {
    return Buffer.from(String(opts['body-b64']), 'base64').toString('utf8');
  }
  return opts.body;
}

function rerender(db, postId) {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) return;
  const file = path.join(ROOT, 'posts', `${postId}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPost(db, post));
}

function nextAnswerId(db, postId) {
  const rows = db.prepare(`SELECT id FROM replies WHERE post_id = ? AND kind = 'answer'`).all(postId);
  let max = 0;
  for (const r of rows) { const m = /^a(\d+)$/.exec(r.id); if (m) max = Math.max(max, parseInt(m[1], 10)); }
  return 'a' + (max + 1);
}

// --- 帖子 id（hash-post-id-and-forum-nav 目标 1）---
// 显式指定的 id 走 slug 校验（文件名安全 + 与 Web 表单/validate.js 同一字符集）；
// 缺省时系统生成哈希 id：sha256(title+author+body+熵) 取 12 hex（48 bit），碰撞时逐级加长。
function assertPostId(id) {
  if (!ID_RE.test(id)) {
    console.error(`✗ id 非法：${id}（应小写字母/数字开头，仅含小写字母/数字/连字符，≤80 字符）`);
    process.exit(2);
  }
}

function generatePostId(db, title, author, body) {
  const seed = [title, author, body, Date.now(), process.pid, Math.random()].join('\n');
  const digest = crypto.createHash('sha256').update(seed, 'utf8').digest('hex');
  for (const len of [12, 16, 24, 32, 64]) {
    const cand = digest.slice(0, len);
    if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(cand)) return cand;
  }
  for (let i = 2; ; i++) {
    const cand = `${digest.slice(0, 12)}-${i}`;
    if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(cand)) return cand;
  }
}

// --- 跨帖/跨文档引用索引（depends_on + 正文 [[token]]） ---
function parseDeps(raw) {
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
}

// 内联引用 token：[[target]] / [[target#anchor]]。target 含 '/' 或 '.md' → doc，否则 → post。
function extractTokens(body) {
  const out = [];
  const re = /\[\[([^\[\]#]+)(?:#([^\[\]]+))?\]\]/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const id = m[1].trim();
    const anchor = m[2] ? m[2].trim() : undefined;
    if (!id) continue;
    out.push({ kind: (id.includes('/') || id.endsWith('.md')) ? 'doc' : 'post', id, anchor });
  }
  return out;
}

// 反向索引：目标 `${kind}:${id}` -> 引用者列表（depends_on 结构引用 + 正文 [[token]] 内联引用）。
function collectRefs(db) {
  const index = new Map();
  const add = (kind, id, anchor, from, where) => {
    if (!id) return;
    const key = `${kind}:${id}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push({ from, anchor, where });
  };
  for (const p of db.prepare('SELECT * FROM posts ORDER BY id').all()) {
    for (const d of parseDeps(p.depends_on)) add(d.kind, d.id, d.anchor, p.id, 'depends_on');
    for (const r of db.prepare('SELECT id, body FROM replies WHERE post_id = ?').all(p.id)) {
      for (const t of extractTokens(r.body)) add(t.kind, t.id, t.anchor, p.id, r.id);
    }
  }
  return index;
}

function cmdQuery(opts) {
  const db = openDb();
  const sort = opts.sort == null ? 'default' : String(opts.sort);
  if (!QUERY_SORTS[sort]) { console.error(`✗ sort 非法：${sort}（应 default/new/active/top）`); process.exit(2); }
  const conds = [];
  const params = [];
  if (opts.tag) { conds.push('EXISTS (SELECT 1 FROM json_each(p.tags) WHERE value = ?)'); params.push(opts.tag); }
  if (opts.state) { conds.push('p.state = ?'); params.push(opts.state); }
  if (opts.assigned) { conds.push('p.assigned = ?'); params.push(opts.assigned); }
  if (opts.entry) { conds.push('p.entry = 1'); }
  if (opts.pinned) { conds.push('p.pinned = 1'); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  // --json 输出补 pinned/pinned_scope/时间/计数（f0442aa0f3b3 P0：置顶标记 + 排序数据通道）。
  const rows = db.prepare(`SELECT p.id, p.title, p.state, p.current, p.assigned, p.entry, p.summary, p.pinned, p.pinned_scope, p.created_at, p.updated_at,
      (SELECT COUNT(*) FROM replies ra WHERE ra.post_id = p.id AND ra.kind = 'answer') AS answers,
      (SELECT COUNT(*) FROM replies rc WHERE rc.post_id = p.id AND rc.kind = 'comment') AS comments
    FROM posts p ${where} ORDER BY ${QUERY_SORTS[sort]}`).all(...params);
  if (opts.json) { console.log(JSON.stringify(rows, null, 2)); return; }
  if (!rows.length) { console.log('（无匹配帖子）'); return; }
  for (const r of rows) {
    const pin = r.pinned ? `  📌${r.pinned_scope || 'global'}` : '';
    console.log(`[${r.state}] ${r.id}  assigned=${r.assigned ?? '-'}  current=${r.current ?? '-'}${r.entry ? '  ENTRY' : ''}${pin}`);
    console.log(`    ${r.summary}`);
  }
}

function rebuildFts(db) {
  db.exec(`DROP TABLE IF EXISTS posts_fts`);
  db.exec(`CREATE VIRTUAL TABLE posts_fts USING fts5(post_id UNINDEXED, title, summary, body, tokenize='trigram')`);
  const ins = db.prepare(`INSERT INTO posts_fts (post_id, title, summary, body) VALUES (?, ?, ?, ?)`);
  const posts = db.prepare(`SELECT * FROM posts ORDER BY id`).all();
  for (const p of posts) {
    const bodies = db.prepare(`SELECT body FROM replies WHERE post_id = ? ORDER BY rowid`).all(p.id).map((r) => r.body);
    ins.run(p.id, p.title, p.summary, bodies.join('\n'));
  }
}

function cmdSearch(rest, opts) {
  const term = rest[0];
  if (!term) { console.error('用法：kb search <关键词> [--json]'); process.exit(2); }
  const db = openDb();
  let rows;
  if ([...term].length < 3) {
    // trigram 最短 3 字；短词退回 LIKE
    const like = `%${term}%`;
    rows = db.prepare(`SELECT DISTINCT p.id, p.title, p.state, p.current, p.summary FROM posts p LEFT JOIN replies r ON r.post_id = p.id WHERE p.title LIKE ? OR p.summary LIKE ? OR r.body LIKE ? ORDER BY p.id`).all(like, like, like);
  } else {
    rebuildFts(db);
    const q = `"${term.replaceAll('"', '""')}"`;
    const ids = db.prepare(`SELECT post_id FROM posts_fts WHERE posts_fts MATCH ?`).all(q).map((r) => r.post_id);
    rows = ids.length
      ? db.prepare(`SELECT id, title, state, current, summary FROM posts WHERE id IN (${ids.map(() => '?').join(',')}) ORDER BY id`).all(...ids)
      : [];
  }
  if (opts.json) { console.log(JSON.stringify(rows)); return; }
  if (!rows.length) { console.log('（无匹配帖子）'); return; }
  for (const r of rows) console.log(`[${r.state}] ${r.id}  current=${r.current ?? '-'}  ${r.title}`);
}

function cmdClaim(rest, opts) {
  const postId = rest[0];
  const agent = opts.as;
  // --steal <answer-id>（D4 合并设计，接管判据对齐 167582fb21a8 a2 Q5）：抢认领他人持有的帖子。
  // 凭证 = 本帖既有 answer id（被抢理由 answer 或接管 answer），记入认领 answer 正文留审计链。
  const steal = opts.steal;
  if (!postId || !agent) { console.error('用法：kb claim <post-id> --as <agent> [--body "…"] [--steal <answer-id>]'); process.exit(2); }
  if (steal === true) { console.error('✗ --steal 必须带凭证 answer id（被抢理由或接管 answer）：kb claim <post> --as <agent> --steal <answer-id>'); process.exit(2); }
  const db = openDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  // 幂等自认领（Q1 定案保持）：skip 不新增 answer。读到的快照若已过期（skip 判定后帖子被他人
  // steal）无害——skip 不落任何写；本进程后续真实写动作会被事务内 CAS 拒绝。
  if (post.assigned === agent) {
    console.log(steal !== undefined
      ? `· ${postId} 已由 ${agent} 认领，跳过（--steal 仅对他人持有的帖子有意义，凭证未消费）`
      : `· ${postId} 已由 ${agent} 认领，跳过`);
    return;
  }
  // 抢认领前置：帖子必须确实被他人持有；凭证必须是本帖既有 answer（审计锚点）。
  let body = bodyOf(opts) || `认领：${agent} 接手此帖。起点：已按阅读协议反向读现状，下一步待补充。`;
  let casSql, casParams;
  if (steal !== undefined) {
    if (!post.assigned) { console.error(`✗ ${postId} 未被认领，无需 --steal，直接 claim 即可`); process.exit(1); }
    const cred = db.prepare(`SELECT id FROM replies WHERE post_id = ? AND id = ? AND kind = 'answer'`).get(postId, steal);
    if (!cred) { console.error(`✗ --steal 凭证非法：${steal}（须为本帖既有 answer id——被抢理由或接管 answer）`); process.exit(2); }
    body += `\n\n抢认领（steal 自 ${post.assigned}），凭证：answer ${steal}。`;
    // CAS：仅当 assigned 仍被「他人」持有时改写（NULL/自己 → 状态已变，拒绝走常规判定）
    casSql = `UPDATE posts SET assigned = ?, updated_at = datetime('now') WHERE id = ? AND assigned IS NOT NULL AND assigned != ?`;
    casParams = [agent, postId, agent];
  } else {
    // CAS（D4 修复核心）：assigned 条件进 UPDATE 本体，在事务内原子判定，消除 check-then-act
    //（TOCTOU）窗口——assigned 检查与写入合一，并发双 claim 仅恰一方 changes=1。
    // 语义：空位可认领（assigned IS NULL）或重入自己（幂等，防御与上方 skip 之间的并发间隙）。
    casSql = `UPDATE posts SET assigned = ?, updated_at = datetime('now') WHERE id = ? AND (assigned IS NULL OR assigned = ?)`;
    casParams = [agent, postId, agent];
  }

  db.exec('BEGIN IMMEDIATE'); // 取号前先持写锁：并发 claim 在事务入口排队，读到的必是已提交现状
  let id;
  try {
    // answer id 在事务内分配：取号本身也是 check-then-act，事务外取号会与并发写者撞 PK
    id = nextAnswerId(db, postId);
    const source = post.current || null;
    const rel = source ? 'relates-to' : null; // root answer 不允许有 source_rel
    db.prepare(`INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body) VALUES (?,?,?,?,?,?,?,?)`)
      .run(postId, id, 'answer', agent, 'query', source, rel, body);
    const r = db.prepare(casSql).run(...casParams);
    if (r.changes === 0) {
      // CAS 败：另一写者已先持帖。回滚整笔（含 answer 插入，不落孤儿），带事务内一致现状退出。
      const cur = db.prepare('SELECT assigned, current FROM posts WHERE id = ?').get(postId);
      db.exec('ROLLBACK');
      console.error(`✗ 认领失败：${postId} 已被 ${cur.assigned ?? '（无）'} 认领（并发判定 changes=0，未落任何写入；current=${cur.current ?? '-'}）。先反向读现状（kb view ${postId}），确需接管用 --steal <answer-id>（凭证=被抢理由/接管 answer）`);
      process.exit(1);
    }
    // current 推进到本条认领 answer（与 cmdAnswer 同语义：current=最新真相）。若停在 NULL，
    // 后续 claim/steal 会读到 current=NULL 再落一个 source=NULL 的 root，打裂「恰一 root」不变量
    //（R4 实测发现，见 CHANGELOG 0.20.0-rc.2）。
    db.prepare(`UPDATE posts SET current = ?, updated_at = datetime('now') WHERE id = ?`).run(id, postId);
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  rerender(db, postId);
  console.log(`✓ ${agent} 认领 ${postId}（新增 answer ${id}，assigned=${agent}${steal !== undefined ? `，steal 凭证 answer ${steal}` : ''}）`);
}

function cmdAnswer(rest, opts) {
  const postId = rest[0];
  const agent = opts.as;
  // 空串/空白 source 同义「未提供」：host 的 answer 端点对 root answer 恒传 --source ""，
  // 旧码把它落成 ''（非 NULL），validator 判「非 root」报 source 指向不存在。这里归一为 null。
  let source = opts.source ?? null;
  if (typeof source === 'string' && source.trim() === '') source = null;
  let rel = opts.rel;
  const body = bodyOf(opts);
  if (!postId || !agent || !body) { console.error('用法：kb answer <post-id> --as <agent> --source <reply-id> --rel <rel> --body "…"'); process.exit(2); }
  const db = openDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  const answers = db.prepare(`SELECT id FROM replies WHERE post_id = ? AND kind = 'answer' ORDER BY rowid`).all(postId);

  if (answers.length > 0 && !source) { console.error('✗ 非首条 answer 必须 --source 指向一条先前 reply'); process.exit(2); }
  if (source) {
    const src = db.prepare('SELECT id FROM replies WHERE post_id = ? AND id = ?').get(postId, source);
    if (!src) { console.error(`✗ source 不存在：${source}`); process.exit(2); }
    if (!rel) rel = 'extends';
    if (!VALID_REL.has(rel)) { console.error(`✗ rel 非法：${rel}（应 extends/supersedes/relates-to）`); process.exit(2); }
  } else {
    rel = null; // root answer
  }

  const id = nextAnswerId(db, postId);
  db.exec('BEGIN');
  try {
    db.prepare(`INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body) VALUES (?,?,?,?,?,?,?,?)`)
      .run(postId, id, 'answer', agent, 'query', source, rel, body);
    db.prepare(`UPDATE posts SET current = ?, updated_at = datetime('now') WHERE id = ?`).run(id, postId);
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  rerender(db, postId);
  console.log(`✓ ${agent} 新增 answer ${id}（${rel ?? 'root'} 自 ${source ?? 'query'}），current → ${id}`);
}

// --- post ---
// id 可省略：缺省由系统生成哈希 id（目标 = 帖子标识不再依赖人工命名的小写词组）。
// 显式传入 slug 向后兼容（字符集校验后照旧落库）。--json 直出 {id, tags, depends_on}
//（host 服务 createPost 解析 id 用；argv 安全通道 --body-b64 / --depends-on-b64 照旧）。
function cmdPost(rest, opts) {
  // 空串/缺省同义：旧版 host（createPost 尚无可选 id）会把 client 留空的 slug 以 "" 传下来
  // ——按「未提供」处理走哈希生成，升级过渡期（host 未重启）发帖也畅通。
  const explicitId = rest[0] || undefined;
  const { title, author, tag, summary } = opts;
  const body = bodyOf(opts);
  if (!title || !author || !tag || !summary || !body) {
    console.error('用法：kb post [id] --title "…" --author <谁> --tag <tag> --summary "…" --body "…" [--depends-on <json>] [--json]   # id 省略 = 自动生成哈希');
    process.exit(2);
  }
  if (explicitId != null) assertPostId(explicitId);
  const dependsRaw = opts['depends-on-b64'] !== undefined
    ? Buffer.from(String(opts['depends-on-b64']), 'base64').toString('utf8')
    : (opts['depends-on'] ?? '[]');
  let deps;
  try { deps = JSON.parse(dependsRaw); if (!Array.isArray(deps)) throw new Error('not array'); }
  catch { console.error('✗ --depends-on 须为 JSON 数组（元素 {kind,id,anchor?}）'); process.exit(2); }
  const db = openDb();
  const id = explicitId ?? generatePostId(db, title, author, body);
  if (explicitId != null && db.prepare('SELECT id FROM posts WHERE id = ?').get(id)) { console.error(`✗ 帖子已存在：${id}`); process.exit(1); }
  const tags = tag.split(',').map((s) => s.trim()).filter(Boolean);
  db.exec('BEGIN');
  try {
    db.prepare(`INSERT INTO posts (id, title, author, tags, state, current, assigned, entry, summary, depends_on)
      VALUES (?, ?, ?, ?, 'active', NULL, NULL, 0, ?, ?)`)
      .run(id, title, author, JSON.stringify(tags), summary, JSON.stringify(deps));
    db.prepare(`INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body)
      VALUES (?, 'query', 'query', ?, NULL, NULL, NULL, ?)`)
      .run(id, author, body);
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  rerender(db, id);
  if (opts.json) console.log(JSON.stringify({ id, tags, depends_on: deps }));
  else console.log(`✓ 创建帖子 ${id}（tags=${tags.join(',')}，depends_on=${deps.length}）`);
}

// --- comment ---
function cmdComment(rest, opts) {
  const postId = rest[0];
  const { as, on } = opts;
  const body = bodyOf(opts);
  if (!postId || !as || !on || !body) {
    console.error('用法：kb comment <post-id> --as <author> --on <answer-id> --body "…"');
    process.exit(2);
  }
  const db = openDb();
  const par = db.prepare(`SELECT id FROM replies WHERE post_id = ? AND id = ? AND kind = 'answer'`).get(postId, on);
  if (!par) { console.error(`✗ 目标 answer 不存在：${on}`); process.exit(1); }
  const n = db.prepare(`SELECT COUNT(*) AS n FROM replies WHERE post_id = ? AND kind = 'comment' AND parent = ?`).get(postId, on).n;
  const id = `${on}.c${n + 1}`;
  db.prepare(`INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body)
    VALUES (?, ?, 'comment', ?, ?, NULL, NULL, ?)`).run(postId, id, as, on, body);
  rerender(db, postId);
  console.log(`✓ ${as} 在 ${postId}/${on} 下新增评论 ${id}`);
}

// --- state ---
function cmdState(rest, opts) {
  const postId = rest[0];
  const state = opts.state;
  if (!postId || !state) { console.error('用法：kb state <post-id> --state <active|waiting|done|archived>'); process.exit(2); }
  if (!['active', 'waiting', 'done', 'archived'].includes(state)) { console.error(`✗ state 非法：${state}`); process.exit(2); }
  const db = openDb();
  if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  db.prepare(`UPDATE posts SET state = ?, updated_at = datetime('now') WHERE id = ?`).run(state, postId);
  rerender(db, postId);
  console.log(`✓ ${postId} state → ${state}`);
}

// --- entry（策展：设/取消 entry 标记）---
function cmdEntry(rest, opts) {
  const postId = rest[0];
  const val = opts.set;
  if (!postId || val === undefined) { console.error('用法：kb entry <post-id> --set <true|false|on|off>'); process.exit(2); }
  const entry = ['true', 'on', '1'].includes(String(val).toLowerCase()) ? 1 : 0;
  const db = openDb();
  if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  db.prepare(`UPDATE posts SET entry = ?, updated_at = datetime('now') WHERE id = ?`).run(entry, postId);
  rerender(db, postId);
  console.log(`✓ ${postId} entry → ${entry ? 'true' : 'false'}`);
}

// --- pin（策展：置顶；f0442aa0f3b3 P0）---
// pinned = 展示位（对所有读者同一顺序），与 entry（上手入口）并存。
// --scope 缺省或 'global' = 全局置顶（pinned_scope NULL）；tag 名 = tag 内置顶
//（硬校验该 tag ∈ 帖子 tags，防 validator 悬空）。off 同时清 pinned_scope。
function cmdPin(rest, opts) {
  const postId = rest[0];
  const val = opts.set;
  if (!postId || val === undefined) { console.error('用法：kb pin <post-id> --set <on|off> [--scope global|<tag>]'); process.exit(2); }
  const on = ['true', 'on', '1'].includes(String(val).toLowerCase());
  const rawScope = opts.scope == null ? '' : String(opts.scope).trim();
  const db = openDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  let scopeVal = null;
  if (on && rawScope && rawScope !== 'global') {
    const tags = JSON.parse(post.tags);
    if (!Array.isArray(tags) || !tags.includes(rawScope)) {
      console.error(`✗ scope 非法：${rawScope}（tag 内置顶要求该 tag ∈ 帖子 tags [${Array.isArray(tags) ? tags.join(', ') : ''}]）`);
      process.exit(2);
    }
    scopeVal = rawScope;
  }
  db.prepare(`UPDATE posts SET pinned = ?, pinned_scope = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(on ? 1 : 0, on ? scopeVal : null, postId);
  rerender(db, postId);
  console.log(`✓ ${postId} pinned → ${on ? (scopeVal ? '#' + scopeVal : 'global') : 'off'}`);
}

// --- tag（策展：帖子 tag 增删；d642cd83339d a8 定案：闭合 CLI 缺口）---
// tags 列是 JSON 字符串数组（validate.js 1 校验非空字符串元素）。--add / --remove 恰选其一；
// 幂等：已存在/不存在时跳过且不空碰 updated_at（对齐 cmdClaim 跳过语义）。
// --remove 硬校验不拆 pin：本帖 pinned=1 且 pinned_scope=被移 tag 时拒绝（防 validator
// 悬空，与 cmdPin 的 scope ∈ tags 同源约束），先 kb pin off 再移。tag 取 trim，拒空串与
// 含逗号值（逗号是 kb post --tag 的多值分隔符，避免造出隐性多值 tag）。
function cmdTag(rest, opts) {
  const postId = rest[0];
  const modes = [
    ['add', typeof opts.add === 'string' ? opts.add : undefined],
    ['remove', typeof opts.remove === 'string' ? opts.remove : undefined],
  ].filter(([, v]) => v !== undefined);
  if (!postId || modes.length !== 1) {
    console.error('用法：kb tag <post-id> --add <tag> | --remove <tag>   # 幂等；--remove 拒拆 pin 引用中的 tag');
    process.exit(2);
  }
  const [mode, rawTag] = modes[0];
  const tag = rawTag.trim();
  if (!tag) { console.error('✗ tag 不能为空'); process.exit(2); }
  if (tag.includes(',')) { console.error(`✗ tag 不应含逗号（多值请多次调用；逗号是 kb post --tag 的分隔符）：${tag}`); process.exit(2); }
  const db = openDb();
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  let tags;
  try { tags = JSON.parse(post.tags); } catch { tags = null; }
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) {
    console.error(`✗ 现有 tags 列非法（应为 JSON 字符串数组）：${post.tags}`);
    process.exit(1);
  }
  const has = tags.includes(tag);
  if (mode === 'add') {
    if (has) { console.log(`· ${postId} 已有 tag「${tag}」，跳过（tags=[${tags.join(', ')}]）`); return; }
    tags.push(tag);
  } else {
    if (!has) { console.log(`· ${postId} 无 tag「${tag}」，跳过（tags=[${tags.join(', ')}]）`); return; }
    const pscope = post.pinned === 1 ? (post.pinned_scope == null ? '' : String(post.pinned_scope).trim()) : '';
    if (pscope === tag) {
      console.error(`✗ 拒绝移除：tag「${tag}」正被本帖 pin 引用（pinned_scope）——先 kb pin ${postId} --set off 再移除`);
      process.exit(1);
    }
    tags = tags.filter((t) => t !== tag);
  }
  db.prepare(`UPDATE posts SET tags = ?, updated_at = datetime('now') WHERE id = ?`).run(JSON.stringify(tags), postId);
  rerender(db, postId);
  console.log(`✓ ${postId} tags ${mode === 'add' ? '+' : '-'}「${tag}」→ [${tags.join(', ')}]`);
  if (mode === 'remove' && post.entry === 1) {
    console.log(`· 注意：本帖是 entry 帖；确认 tag「${tag}」仍有其他 entry（必要时用 kb entry 迁移入口）`);
  }
}

// 单行不变量：render.js 把 summary 直接拼进 frontmatter 的 `summary: ` 一行，
// 内嵌 CR/LF 会造出伪字段、并让读侧 parseFm（host list 面 / 工具插件）丢掉后续元数据。
// 故这里硬拒换行而非静默折叠——summary 的写法约定本就是「一句话定位 + 资产清单」，
// 长内容属于 answer 正文。
// 幂等：同值与现值一致时跳过，不空碰 updated_at（对齐 cmdTag 跳过语义）。
function cmdSummary(rest, opts) {
  const postId = rest[0];
  const raw = bodyOf(opts);
  if (!postId || typeof raw !== 'string') {
    console.error('用法：kb summary <post-id> --body "…"（亦支持 --body-b64）');
    process.exit(2);
  }
  const body = raw.trim();
  if (!body) { console.error('✗ summary 不能为空（去首尾空白后为空）'); process.exit(2); }
  if (/[\r\n]/.test(body)) {
    console.error('✗ summary 必须单行（CR/LF 会破坏 frontmatter）：换行请改成「；」或空格，长内容写进 answer 正文');
    process.exit(2);
  }
  const db = openDb();
  const post = db.prepare('SELECT summary FROM posts WHERE id = ?').get(postId);
  if (!post) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  if (post.summary === body) { console.log(`· ${postId} summary 与现值一致，跳过（未碰 updated_at）`); return; }
  db.prepare(`UPDATE posts SET summary = ?, updated_at = datetime('now') WHERE id = ?`).run(body, postId);
  rerender(db, postId);
  console.log(`✓ ${postId} summary 已更新（${post.summary.length} → ${body.length} 字符）`);
}

// --- depends（策展：跨帖/跨文档引用索引 depends_on 的热更新）---
// 元数据（posts 9 字段）可变：query 层引用显性化无需回改 append-only 的 reply 正文。
// --set 整体替换；--add 追加（按 kind:id#anchor 去重）；--clear 清空。
// --set-b64 / --add-b64 走 argv 安全通道（同 --body-b64：Windows spawn argv 会损坏嵌入双引号）。
// 形状校验对齐 validate.js 1b：元素 {kind: post|doc, id, anchor?}；悬空校验仍归 validate.js。
function cmdDepends(rest, opts) {
  const postId = rest[0];
  const b64 = (v) => (v === undefined ? undefined : Buffer.from(String(v), 'base64').toString('utf8'));
  const modes = [
    ['set', opts.set !== undefined ? opts.set : b64(opts['set-b64'])],
    ['add', opts.add !== undefined ? opts.add : b64(opts['add-b64'])],
    ['clear', opts.clear ? '[]' : undefined],
  ].filter(([, raw]) => raw !== undefined);
  if (!postId || modes.length !== 1) {
    console.error('用法：kb depends <post-id> --set <json> | --add <json> | --clear（json 元素 {kind: post|doc, id, anchor?}；亦支持 --set-b64/--add-b64）');
    process.exit(2);
  }
  const [mode, raw] = modes[0];
  let deps;
  try { deps = JSON.parse(raw); } catch { deps = null; }
  const shape = (d) => Boolean(d) && typeof d === 'object' && !Array.isArray(d) &&
    (d.kind === 'post' || d.kind === 'doc') && typeof d.id === 'string' && d.id.length > 0 &&
    (d.anchor === undefined || typeof d.anchor === 'string');
  if (!Array.isArray(deps) || deps.some((d) => !shape(d))) {
    console.error(`✗ depends_on 须为 JSON 数组（元素 {kind: post|doc, id, anchor?}），得到：${raw}`);
    process.exit(2);
  }
  const db = openDb();
  if (!db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  if (mode === 'add') {
    const cur = parseDeps(db.prepare('SELECT depends_on FROM posts WHERE id = ?').get(postId).depends_on);
    const key = (d) => `${d.kind}:${d.id}#${d.anchor ?? ''}`;
    const seen = new Set(cur.map(key));
    for (const d of deps) if (!seen.has(key(d))) { cur.push(d); seen.add(key(d)); }
    deps = cur;
  }
  db.prepare(`UPDATE posts SET depends_on = ?, updated_at = datetime('now') WHERE id = ?`).run(JSON.stringify(deps), postId);
  rerender(db, postId);
  console.log(`✓ ${postId} depends_on ${mode} → ${JSON.stringify(deps)}`);
}

// --- subscribe（订阅持久化 checkpoint）---
function gitLog(range) {
  return execFileSync('git', ['log', '--format=@@%h%x09%s', '--name-only', range], { cwd: ROOT, encoding: 'utf8' });
}

function headCommit() {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function printChanged(range, ids) {
  let out;
  try { out = gitLog(range); }
  catch (e) { console.error(`✗ git log 失败：${e.message}`); process.exit(1); }
  let hit = 0;
  for (const block of out.split('@@')) {
    const lines = block.split('\n').map((s) => s.trim()).filter(Boolean);
    if (!lines.length) continue;
    const [commitLine, ...files] = lines;
    const touched = files.filter((f) => f.startsWith('posts/') && ids.has(path.basename(f, '.md')));
    if (touched.length) {
      hit++;
      console.log(commitLine);
      for (const t of touched) console.log(`    ${t}`);
    }
  }
  if (!hit) console.log('（无匹配帖子的变更）');
}

function cmdSubscribe(rest, opts) {
  const db = openDb();
  const sub = rest[0];
  if (sub === 'add' || sub === 'remove') {
    const kind = opts.tag ? 'tag' : (opts.post ? 'post' : null);
    const value = opts.tag || opts.post;
    if (!kind || !value) { console.error(`用法：kb subscribe ${sub} --tag X | --post <id>`); process.exit(2); }
    if (sub === 'add') { db.prepare(`INSERT INTO subscriptions (kind, value) VALUES (?, ?) ON CONFLICT(kind, value) DO NOTHING`).run(kind, value); console.log(`✓ 已订阅 ${kind}=${value}`); }
    else { db.prepare(`DELETE FROM subscriptions WHERE kind = ? AND value = ?`).run(kind, value); console.log(`✓ 已退订 ${kind}=${value}`); }
    return;
  }
  if (sub === 'list') {
    const rows = db.prepare(`SELECT id, kind, value, last_seen FROM subscriptions ORDER BY id`).all();
    if (!rows.length) { console.log('（无订阅）'); return; }
    for (const r of rows) console.log(`#${r.id} ${r.kind}=${r.value}  last_seen=${r.last_seen || '（从头）'}`);
    return;
  }
  if (sub === 'check') {
    const rows = db.prepare(`SELECT id, kind, value, last_seen FROM subscriptions ORDER BY id`).all();
    if (!rows.length) { console.log('（无订阅）'); return; }
    const head = headCommit();
    for (const r of rows) {
      const ids = new Set(r.kind === 'post'
        ? [r.value]
        : db.prepare(`SELECT id FROM posts WHERE EXISTS (SELECT 1 FROM json_each(posts.tags) WHERE value = ?) ORDER BY id`).all(r.value).map((p) => p.id));
      console.log(`—— 订阅 ${r.kind}=${r.value} ——`);
      printChanged(r.last_seen ? `${r.last_seen}..HEAD` : 'HEAD', ids);
      db.prepare(`UPDATE subscriptions SET last_seen = ? WHERE id = ?`).run(head, r.id);
    }
    return;
  }
  // 无子命令：临时查询（不持久化）
  let ids;
  if (opts.post) ids = new Set([opts.post]);
  else if (opts.tag) ids = new Set(db.prepare(`SELECT id FROM posts WHERE EXISTS (SELECT 1 FROM json_each(posts.tags) WHERE value = ?) ORDER BY id`).all(opts.tag).map((p) => p.id));
  else { console.error('用法：kb subscribe [add|check|list|remove] … 或 kb subscribe --tag X [--since <commit>]'); process.exit(2); }
  if (!ids.size) { console.log('（该订阅无匹配帖子）'); return; }
  printChanged(`${opts.since || 'HEAD~1'}..HEAD`, ids);
}

// --- view（结构化投影：ADR-0002 §3 阅读边界形状的渲染面，forum-kb-web-ui 读面 + kb_view 工具底座）---
// 只读，直出 JSON：post 元数据 + query + answers（source 软引用链 / 是否 current / 评论线程）。
// 数据取自 kb.sqlite 单一事实源（非 md 渲染物），client 经 host 服务 view() 消费。
// scope：head=阅读边界（summary+query+current 单条 answer）；spine=head+沿 source 反向链到 root；
// full=全部 answer。缺省 full（向后兼容：Web UI 的 forumKb.view() 无参调用行为不变）。
// comments：on=附 scope 内 answer 的评论线程；缺省 on（向后兼容）；none=草稿面零装载。
// agent 读帖走 kb_view 工具（--scope head --comments none），不 read posts/*.md 全文。
function cmdView(rest, opts) {
  const postId = rest[0];
  if (!postId) { console.error('用法：kb view <post-id> [--scope head|spine|full] [--comments on|none] [--json]'); process.exit(2); }
  const db = openDb();
  const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!p) { console.error(`✗ 帖子不存在：${postId}`); process.exit(1); }
  const scope = opts.scope == null ? 'full' : String(opts.scope);
  if (!['head', 'spine', 'full'].includes(scope)) { console.error(`✗ scope 非法：${scope}（应 head/spine/full）`); process.exit(2); }
  const withComments = opts.comments == null ? true : ['on', 'true', '1', 'yes'].includes(String(opts.comments).toLowerCase());
  const replies = db.prepare('SELECT rowid AS seq, * FROM replies WHERE post_id = ? ORDER BY seq').all(postId);
  const byId = new Map(replies.map((r) => [r.id, r]));
  const query = replies.find((r) => r.kind === 'query');
  let answers = replies.filter((r) => r.kind === 'answer');
  if (scope !== 'full') {
    const curRow = p.current != null ? byId.get(p.current) : null;
    if (scope === 'head') {
      answers = curRow && curRow.kind === 'answer' ? [curRow] : [];
    } else {
      // spine：从 current 沿 source 反向回溯到 root（仅 answer→answer 链，防环）
      const chain = [];
      const seen = new Set();
      let cur = curRow && curRow.kind === 'answer' ? curRow : null;
      while (cur && !seen.has(cur.id)) {
        seen.add(cur.id);
        chain.unshift(cur);
        const next = cur.source != null ? byId.get(cur.source) : null;
        cur = next && next.kind === 'answer' ? next : null;
      }
      answers = chain;
    }
  }
  const view = {
    id: p.id,
    title: p.title,
    author: p.author,
    tags: JSON.parse(p.tags),
    state: p.state,
    current: p.current ?? null,
    assigned: p.assigned ?? null,
    entry: p.entry ? 1 : 0,
    pinned: p.pinned ? 1 : 0,
    pinnedScope: p.pinned_scope ?? null,
    summary: p.summary ?? '',
    dependsOn: parseDeps(p.depends_on),
    query: query ? query.body : null,
    scope,
    answers: answers.map((a) => ({
      id: a.id,
      author: a.author,
      body: a.body,
      source: a.source ?? null,
      sourceRel: a.source_rel ?? null,
      current: p.current != null && p.current === a.id,
      comments: withComments
        ? replies.filter((r) => r.kind === 'comment' && r.parent === a.id).map((c) => ({
            id: c.id, author: c.author, body: c.body,
          }))
        : [],
    })),
  };
  console.log(JSON.stringify(view, null, opts.json ? 2 : undefined));
}

// --- refs（反向索引：谁引用了谁；--all 全图 dump；--json 单目标结构化输出供 host 服务消费）---
function cmdRefs(rest, opts) {
  const db = openDb();
  const index = collectRefs(db);
  if (opts.all) {
    if (!index.size) { console.log('（引用索引为空）'); return; }
    for (const [key, refs] of [...index.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      const sep = key.indexOf(':');
      console.log(`→ ${key.slice(0, sep)} ${key.slice(sep + 1)}`);
      for (const r of refs) console.log(`    from ${r.from}  (${r.where}${r.anchor ? ' #' + r.anchor : ''})`);
    }
    return;
  }
  const kind = opts.doc ? 'doc' : 'post';
  const id = opts.doc || rest[0];
  if (!id) { console.error('用法：kb refs <post-id> | --doc <path> | --all [--json 仅单目标]'); process.exit(2); }
  const titleOf = (pid) => { const p = db.prepare('SELECT title FROM posts WHERE id = ?').get(pid); return p ? p.title : null; };
  if (opts.json) {
    // 入向 = 谁引用本帖（from 帖子 id + 出处 where + 锚点）；出向 = 本帖 depends_on。
    // kind=post 的目标附 title（client 面板直接可读，免二次查询）。
    const inbound = (index.get(`${kind}:${id}`) || []).map((r) => ({
      from: r.from, where: r.where, anchor: r.anchor ?? null, title: kind === 'post' ? titleOf(r.from) : null,
    }));
    let outbound = [];
    if (kind === 'post') {
      const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
      if (!p) { console.error(`✗ 帖子不存在：${id}`); process.exit(1); }
      outbound = parseDeps(p.depends_on).map((d) => ({ kind: d.kind, id: d.id, anchor: d.anchor ?? null, title: d.kind === 'post' ? titleOf(d.id) : null }));
    }
    console.log(JSON.stringify({ id, kind, inbound, outbound }));
    return;
  }
  const inbound = index.get(`${kind}:${id}`) || [];
  console.log(`—— ${kind} ${id} ——`);
  if (kind === 'post') {
    const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!p) { console.error(`✗ 帖子不存在：${id}`); process.exit(1); }
    const outbound = parseDeps(p.depends_on);
    console.log(`出向 depends_on（${outbound.length}）：`);
    for (const d of outbound) console.log(`    ${d.kind} ${d.id}${d.anchor ? '#' + d.anchor : ''}`);
  }
  console.log(`入向被引用（${inbound.length}）：`);
  for (const r of inbound) console.log(`    from ${r.from}  (${r.where}${r.anchor ? ' #' + r.anchor : ''})`);
}

function usage() {
  console.log(`forum-kb 交互工具
  kb query  [--tag X] [--state S] [--assigned A] [--entry] [--pinned] [--sort default|new|active|top] [--json]
  kb search <关键词> [--json]
  kb view <post-id> [--scope head|spine|full] [--comments on|none] [--json]
  kb claim <post-id> --as <agent> [--body "…"] [--steal <answer-id>]   # --steal=抢认领，须带本帖既有 answer id 作凭证
  kb answer <post-id> --as <agent> --source <reply-id> --rel <rel> --body "…"
  kb post [id] --title "…" --author <谁> --tag <tag> --summary "…" --body "…" [--depends-on <json>] [--json]   # id 省略 = 自动生成哈希
  kb comment <post-id> --as <author> --on <answer-id> --body "…"
  kb state <post-id> --state <active|waiting|done|archived>
  kb entry <post-id> --set <true|false|on|off>
  kb pin <post-id> --set <on|off> [--scope global|<tag>]
  kb tag <post-id> --add <tag> | --remove <tag>   # 幂等增删 tag；--remove 拒拆 pin 引用中的 tag
  kb summary <post-id> --body "…"
  kb depends <post-id> --set <json> | --add <json> | --clear   # depends_on 热更新（--set-b64/--add-b64 argv 安全）
  kb refs <post-id> | --doc <path> | --all   # 加 --json 单目标结构化输出
  kb subscribe add --tag X | --post <id>
  kb subscribe check | list | remove`);
}

module.exports = {
  parseArgs, bodyOf, parseDeps, extractTokens, collectRefs,
  cmdQuery, cmdSearch, cmdView, cmdClaim, cmdAnswer, cmdPost,
  cmdComment, cmdState, cmdEntry, cmdPin, cmdTag, cmdSummary, cmdDepends, cmdSubscribe, cmdRefs,
};

// 写者身份提醒（7e41e79a0c6f 定案）：纯提示非校验——外部通道不做动作级门限，
// 靠每次 CLI 输出附带一行纪律，让任何执行体（含 trae-cn / olawork 等外部 runtime）
// 在读/写 kb 时意识到自己是有登记身份的写者。走 stderr：cmdView/query 等不带
// --json 时 stdout 也是机器解析的 JSON（DSH kb_view 工具不传 --json），尾注混入
// stdout 会破坏解析（9aeed36 回归）；stderr 在成功路径被所有消费方忽略，终端直跑
// 的外部执行体仍可见。
function printIdentityNote() {
  console.error(`ℹ 写者纪律：署名用登记名（agent-<host> / agent-<host>-<variant>，人用常用 handle；规则与本库名录见身份登记帖：node tools/kb.js query --tag meta）；写后自行 git commit；外部执行体勿动帖子元数据（state/pin/entry/assigned）。`);
}

if (require.main === module) {
  const { args, opts } = parseArgs(process.argv.slice(2));
  switch (args[0]) {
    case 'query': cmdQuery(opts); break;
    case 'search': cmdSearch(args.slice(1), opts); break;
    case 'view': cmdView(args.slice(1), opts); break;
    case 'claim': cmdClaim(args.slice(1), opts); break;
    case 'answer': cmdAnswer(args.slice(1), opts); break;
    case 'post': cmdPost(args.slice(1), opts); break;
    case 'comment': cmdComment(args.slice(1), opts); break;
    case 'state': cmdState(args.slice(1), opts); break;
    case 'entry': cmdEntry(args.slice(1), opts); break;
    case 'pin': cmdPin(args.slice(1), opts); break;
    case 'tag': cmdTag(args.slice(1), opts); break;
    case 'summary': cmdSummary(args.slice(1), opts); break;
    case 'depends': cmdDepends(args.slice(1), opts); break;
    case 'subscribe': cmdSubscribe(args.slice(1), opts); break;
    case 'refs': cmdRefs(args.slice(1), opts); break;
    default: usage(); process.exit(2);
  }
  if (args[0] !== undefined) printIdentityNote();
}
