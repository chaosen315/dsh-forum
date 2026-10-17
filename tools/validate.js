// 格式 seam 校验器：对 kb.sqlite 跑不变量 + md 渲染一致性。
// CLI：node tools/validate.js   （通过 = exit 0，失败 = exit 1）
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { renderPost } = require('./render.js');
const schema = require('./schema.js');

const ROOT = path.resolve(__dirname, '..');
const db = new DatabaseSync(path.join(ROOT, 'kb.sqlite'));
schema.apply(db); // 幂等迁移后再读，保证存量库也有 pinned/pinned_scope 列

const errors = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };
const VALID_STATE = new Set(['active', 'waiting', 'done', 'archived']);
const VALID_REL = new Set(['extends', 'supersedes', 'relates-to']);
// id 形状（hash-post-id-and-forum-nav 定案）：小写 slug（存量/人工显式）或系统生成的
// 十六进制哈希（≥12 位）——同一字符集，与 tools/kb.js assertPostId / Web 发帖表单三方对齐。
const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

const posts = db.prepare('SELECT * FROM posts ORDER BY id').all();

// 0. id 形状合法（存量为 slug，新帖为哈希；同一字符集，md 文件名安全）
for (const p of posts) {
  ok(ID_RE.test(p.id), `post ${p.id}: id 形状非法（应 ^[a-z0-9][a-z0-9-]{0,79}$）`);
}

// 1. 8 字段合法（id 是主键，不在内）
for (const p of posts) {
  ok(p.title && p.title.trim() !== '', `post ${p.id}: title 为空`);
  ok(p.author && p.author.trim() !== '', `post ${p.id}: author 为空`);
  ok(p.summary && p.summary.trim() !== '', `post ${p.id}: summary 为空`);
  ok(VALID_STATE.has(p.state), `post ${p.id}: state 非法 (${p.state})`);
  ok(p.entry === 0 || p.entry === 1, `post ${p.id}: entry 非法 (${p.entry})`);
  let tags;
  try { tags = JSON.parse(p.tags); } catch { tags = null; }
  ok(Array.isArray(tags) && tags.every((t) => typeof t === 'string' && t.length > 0),
    `post ${p.id}: tags 非法 (${p.tags})`);
  // 置顶（f0442aa0f3b3 P0）：pinned ∈ {0,1}；置顶时 scope 为空（全局）或 ∈ 该帖 tags；
  // 未置顶不得残留 pinned_scope。
  ok(p.pinned === 0 || p.pinned === 1, `post ${p.id}: pinned 非法 (${p.pinned})`);
  const pscope = p.pinned_scope == null ? '' : String(p.pinned_scope).trim();
  if (p.pinned === 1) {
    ok(pscope === '' || (Array.isArray(tags) && tags.includes(pscope)),
      `post ${p.id}: pinned_scope 应为空（全局置顶）或帖子 tags 之一 (${p.pinned_scope})`);
  } else {
    ok(pscope === '', `post ${p.id}: 未置顶帖不应带 pinned_scope (${p.pinned_scope})`);
  }
}

// 1b. depends_on（跨帖/跨文档引用索引）合法 + 可解析（引用不悬空）
for (const p of posts) {
  let deps;
  try { deps = JSON.parse(p.depends_on); } catch { deps = null; }
  ok(Array.isArray(deps), `post ${p.id}: depends_on 非法（非 JSON 数组）`);
  if (!Array.isArray(deps)) continue;
  for (const d of deps) {
    const shapeOk = d && typeof d === 'object' && (d.kind === 'post' || d.kind === 'doc') &&
      typeof d.id === 'string' && d.id.length > 0;
    ok(shapeOk, `post ${p.id}: depends_on 元素非法 (${JSON.stringify(d)})`);
    if (!shapeOk) continue;
    if (d.kind === 'post') {
      const t = db.prepare('SELECT id FROM posts WHERE id = ?').get(d.id);
      ok(t, `post ${p.id}: depends_on 悬空——帖子不存在 (${d.id})`);
      if (t && d.anchor != null && d.anchor !== 'current') {
        const r = db.prepare('SELECT id FROM replies WHERE post_id = ? AND id = ? AND kind = ?').get(d.id, d.anchor, 'answer');
        ok(r, `post ${p.id}: depends_on 锚点不存在 (${d.id}#${d.anchor})`);
      }
    } else { // doc
      ok(fs.existsSync(path.join(ROOT, d.id)), `post ${p.id}: depends_on 悬空——文档不存在 (${d.id})`);
    }
  }
}

for (const p of posts) {
  const replies = db
    .prepare('SELECT rowid AS seq, * FROM replies WHERE post_id = ? ORDER BY seq')
    .all(p.id);
  const byId = new Map(replies.map((r) => [r.id, r]));

  // 2. query 存在（每帖恰一个）
  const queries = replies.filter((r) => r.kind === 'query');
  ok(queries.length === 1, `post ${p.id}: 应有恰一个 query reply，实际 ${queries.length}`);

  const answers = replies.filter((r) => r.kind === 'answer');
  const comments = replies.filter((r) => r.kind === 'comment');
  const roots = answers.filter((a) => a.source == null);

  // 4. current 合法
  if (p.current != null && p.current !== '') {
    const cur = byId.get(p.current);
    ok(cur && cur.kind === 'answer', `post ${p.id}: current 指向非法 answer (${p.current})`);
  }

  // 3. 来源引用：answers>0 时恰一个 root；其余 answer source 指向同帖更早 reply
  if (answers.length > 0) {
    ok(roots.length === 1, `post ${p.id}: 应有恰一个 root answer（source=NULL），实际 ${roots.length}`);
  }
  for (const a of answers) {
    if (a.source != null) {
      const src = byId.get(a.source);
      ok(src && src.id !== a.id, `post ${p.id}/${a.id}: source 指向不存在的 reply (${a.source})`);
      if (src) ok(src.seq < a.seq, `post ${p.id}/${a.id}: source 未指向更早 reply (${a.source})`);
      ok(VALID_REL.has(a.source_rel), `post ${p.id}/${a.id}: source_rel 非法 (${a.source_rel})`);
    } else {
      ok(a.source_rel == null, `post ${p.id}/${a.id}: root answer 不应有 source_rel`);
    }
    ok(a.parent === 'query', `post ${p.id}/${a.id}: answer 结构父应为 query，实际 (${a.parent})`);
  }

  // comment 结构父指向 answer
  for (const c of comments) {
    const par = byId.get(c.parent);
    ok(par && par.kind === 'answer', `post ${p.id}/${c.id}: comment 结构父应指向 answer，实际 (${c.parent})`);
  }

  // 5. spine 连通：每个 answer 沿 source 回溯终止于唯一 root；无环
  if (answers.length > 0 && roots.length === 1) {
    const rootId = roots[0].id;
    for (const a of answers) {
      const seen = new Set();
      let cur = a;
      let broken = false;
      while (true) {
        if (seen.has(cur.id)) {
          errors.push(`post ${p.id}: source 链存在环（经过 ${cur.id}）`);
          broken = true;
          break;
        }
        seen.add(cur.id);
        if (cur.source == null) {
          if (cur.id !== rootId) errors.push(`post ${p.id}/${a.id}: source 链未终止于唯一 root answer（止于 ${cur.id}）`);
          break;
        }
        const next = byId.get(cur.source);
        if (!next) { errors.push(`post ${p.id}/${a.id}: source 链断裂（${cur.source} 不存在）`); broken = true; break; }
        cur = next;
      }
      if (broken) continue;
    }
  } else if (answers.length === 0) {
    ok(p.current == null || p.current === '', `post ${p.id}: 无 answer 但 current 非空 (${p.current})`);
  }
}

// md 渲染一致性
const postsDir = path.join(ROOT, 'posts');
for (const p of posts) {
  const file = path.join(postsDir, `${p.id}.md`);
  if (!fs.existsSync(file)) {
    errors.push(`post ${p.id}: 缺渲染文件 ${file}（请跑 node tools/render.js）`);
    continue;
  }
  const onDisk = fs.readFileSync(file, 'utf8');
  const expected = renderPost(db, p);
  if (onDisk !== expected) errors.push(`post ${p.id}: md 渲染与 DB 不一致（请重跑 node tools/render.js）`);
}

if (errors.length) {
  console.error(`✗ 校验失败：${errors.length} 项问题`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
} else {
  console.log(`✓ 校验通过：${posts.length} 帖，格式 seam 全部良构`);
}
