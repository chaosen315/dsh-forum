// schema 应用与存量库列迁移（三方共用：kb.js / validate.js / render.js）。
// schema.sql 全部幂等语句（CREATE … IF NOT EXISTS），每次打开重放：新库建全量，老库 no-op。
// 列迁移：CREATE TABLE IF NOT EXISTS 不会给已存在的表加列（f0442aa0f3b3 P0 置顶 pinned/pinned_scope），
// 故按 PRAGMA table_info 探测、缺列才 ALTER TABLE ADD COLUMN（带常量 DEFAULT，存量行安全）。
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');

function apply(db) {
  db.exec(fs.readFileSync(path.join(ROOT, 'schema.sql'), 'utf8'));
  const cols = new Set(db.prepare('PRAGMA table_info(posts)').all().map((r) => r.name));
  if (!cols.has('pinned')) db.exec(`ALTER TABLE posts ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0`);
  if (!cols.has('pinned_scope')) db.exec(`ALTER TABLE posts ADD COLUMN pinned_scope TEXT`);
}

module.exports = { apply };
