// 空库初始化：schema + 通用身份登记帖 + 渲染 posts/。
// 默认拒绝覆盖已有 kb.sqlite；确认重建加 --force（旧库将被删除）。
// 用法：node tools/init.js [--force]
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const schema = require('./schema.js');
const { renderAll } = require('./render.js');
const identityPost = require('./identity-registry.js');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'kb.sqlite');
const force = process.argv.includes('--force');

if (fs.existsSync(DB_PATH) && !force) {
  console.error(`✗ 已存在 ${DB_PATH}，未做任何改动。确认重建请加 --force（旧库将被删除）；只想载入演示样例见 tools/seed.js。`);
  process.exit(1);
}
if (fs.existsSync(DB_PATH)) fs.rmSync(DB_PATH);

const db = new DatabaseSync(DB_PATH);
schema.apply(db);

const T = new Date().toISOString().slice(0, 19).replace('T', ' ');
const insertPost = db.prepare(
  `INSERT INTO posts (id, title, author, tags, state, current, assigned, entry, summary, depends_on, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertReply = db.prepare(
  `INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const p = identityPost(T);
insertPost.run(
  p.id, p.title, p.author, JSON.stringify(p.tags), p.state,
  p.current ?? null, p.assigned ?? null, p.entry ? 1 : 0, p.summary, JSON.stringify(p.depends_on ?? []), T, T
);
for (const r of p.replies) {
  insertReply.run(p.id, r.id, r.kind, r.author, r.parent ?? null, r.source ?? null, r.source_rel ?? null, r.body, T);
}

renderAll(db, path.join(ROOT, 'posts'));
console.log('initialized kb.sqlite：schema + 身份登记帖 identity-registry（1 帖，posts/ 已渲染）');
console.log('下一步：node tools/kb.js query --tag meta    # 查看/登记你的身份');
console.log('然后：  node tools/kb.js post my-first-task …  # 创建你的第一帖（见 docs/quickstart.md）');
