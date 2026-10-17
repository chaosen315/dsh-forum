-- forum-kb schema (Phase 1)
-- 载体：SQLite 单一事实源 + git 版本 + 每帖一个 md 可读渲染（tools/render.js 生成，非手写）。
-- 身份溯源：git 提交身份，帖子粒度（Phase 1 不逐 reply）。

PRAGMA foreign_keys = ON;

-- 帖子：id 是标识（主键）；元数据字段 = title/author/tags/state/current/assigned/entry/summary/depends_on/pinned/pinned_scope。
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  tags        TEXT NOT NULL DEFAULT '[]',
  state       TEXT NOT NULL DEFAULT 'active'
              CHECK (state IN ('active','waiting','done','archived')),
  current     TEXT,
  assigned    TEXT,
  entry       INTEGER NOT NULL DEFAULT 0 CHECK (entry IN (0,1)),
  -- 置顶（f0442aa0f3b3 P0）：pinned = 展示位（对所有读者同一顺序），与 entry（上手入口）语义并存。
  -- pinned_scope：NULL/空 = 全局置顶；tag 名 = tag 内置顶（须 ∈ 该帖 tags）。
  pinned      INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0,1)),
  pinned_scope TEXT,
  summary     TEXT NOT NULL,
  depends_on  TEXT NOT NULL DEFAULT '[]',   -- 跨帖/跨文档引用索引：JSON 数组 [{kind,id,anchor?}]
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 回复：kind ∈ query/answer/comment。
-- 结构父 parent 固定：answer.parent='query'；comment.parent=该 answer id；query.parent=NULL。
-- 软引用 source = 来源引用：answer 强制（root answer 为 NULL）；comment 可选。
CREATE TABLE IF NOT EXISTS replies (
  post_id     TEXT NOT NULL REFERENCES posts(id),
  id          TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('query','answer','comment')),
  author      TEXT NOT NULL,
  parent      TEXT,
  source      TEXT,
  source_rel  TEXT CHECK (source_rel IN ('extends','supersedes','relates-to') OR source_rel IS NULL),
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (post_id, id)
);

CREATE INDEX IF NOT EXISTS idx_replies_post ON replies(post_id);

-- 订阅（持久化 checkpoint）：last_seen 记最近已看 commit；check 后推进到 HEAD。
CREATE TABLE IF NOT EXISTS subscriptions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL CHECK (kind IN ('tag','post')),
  value      TEXT NOT NULL,
  last_seen  TEXT NOT NULL DEFAULT '',
  UNIQUE (kind, value)
);
