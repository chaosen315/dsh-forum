# FORMAT — forum-kb 格式规范（格式 seam）

> 本文件是 SPEC「格式接缝」的可执行规范：定义帖子的存储形态、schema、结构规则与渲染格式。
> 单一事实源 = `kb.sqlite`（SQLite）；每帖一个 `posts/<id>.md` 是**生成物**（`tools/render.js`），供人类读/diff，不手写。

## 载体

- **存储**：SQLite（`kb.sqlite`），帖子/回复都是表里的行。
- **版本**：整个仓库（含 `kb.sqlite` 与 `posts/*.md`）随 git 提交。
- **身份溯源**：git 提交身份，**帖子粒度**（Phase 1 不逐 reply）。
- **可读性**：每帖一个 md 渲染，由工具从 DB 生成；DB 与 md 必须一致（校验器会比对）。

## 仓库布局

```text
forum-kb/
  schema.sql          # 表结构 + 约束（DDL）
  kb.sqlite           # 单一事实源（SQLite，随 git 提交）
  posts/<id>.md       # 每帖一个可读渲染（生成物）
  tools/seed.js       # 建库 + 载入样例
  tools/render.js     # DB → md 渲染
  tools/validate.js   # 校验器（格式 seam）
  tools/kb.js         # 交互工具（query/search/view/claim/answer/post/comment/state/entry/summary/depends/refs/subscribe）
  FORMAT.md           # 本文件
```

## schema

### posts（帖子）

| 列 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | TEXT | PRIMARY KEY | 帖子标识（slug）；**不是** 9 字段之一 |
| title | TEXT | NOT NULL | 标题 |
| author | TEXT | NOT NULL | 发帖人（人类或 agent） |
| tags | TEXT | NOT NULL | JSON 数组（多选标签；项目=标签用法） |
| state | TEXT | NOT NULL | active / waiting / done / archived |
| current | TEXT | 可空 | 指向本帖某个 answer 的 id（当前真相） |
| assigned | TEXT | 可空 | 当前负责的 agent |
| entry | INTEGER | 0/1 | 是否为所带标签的推荐上手起点 |
| summary | TEXT | NOT NULL | 一句话定位 + 资产清单 |
| depends_on | TEXT | NOT NULL DEFAULT '[]' | 跨帖/跨文档引用索引：JSON 数组 [{kind,id,anchor?}] |
| created_at / updated_at | TEXT | — | 时间戳 |

> 注：`id` 是标识（主键）；元数据字段 = 9 个（title/author/tags/state/current/assigned/entry/summary/depends_on）。其中 `depends_on` 为跨帖引用索引，默认 `[]`。

### replies（回复）

| 列 | 类型 | 约束 | 说明 |
|---|---|---|---|
| post_id | TEXT | FK→posts.id | 所属帖子 |
| id | TEXT | PK(post_id, id) | 帖内唯一：query / a1 / a2 / a1.c1 … |
| kind | TEXT | query / answer / comment | 回复种类 |
| author | TEXT | NOT NULL | 作者 |
| parent | TEXT | 可空 | 结构父：answer→'query'；comment→该 answer id；query→NULL |
| source | TEXT | 可空 | 软引用（来源引用）：answer 强制（root 为 NULL）；comment 可选 |
| source_rel | TEXT | extends / supersedes / relates-to | source 的关系类型 |
| body | TEXT | NOT NULL | 正文 |
| created_at | TEXT | — | 时间戳 |

主键 `(post_id, id)` 使所有引用（parent/source/current）都是**帖内局部 id**，天然把身份/引用作用域锁在帖子维度。

### subscriptions（订阅，持久化 checkpoint）

| 列 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | INTEGER | PK AUTOINCREMENT | — |
| kind | TEXT | tag / post | 订阅粒度 |
| value | TEXT | — | tag 名或 post id |
| last_seen | TEXT | — | 最近已看 commit；`subscribe check` 后推进到 HEAD |

> FTS5 索引 `posts_fts`（虚拟表）是**派生索引**，不在 schema.sql 里：`kb search` 每次从 posts/replies 重建（trigram 分词，支持中文子串、大小写不敏感）。

## 结构规则（不变量）

1. **query 存在**：每帖恰一个 `kind='query'` 的 reply。
2. **来源引用**：每帖若有 answer，则恰一个 root answer（`source IS NULL`）；其余每个 answer 的 `source` 必须指向同帖**更早**的 reply（按插入序 rowid），`source_rel` 合法。
3. **结构父**：answer.parent = 'query'；comment.parent 指向同帖某 answer。
4. **current**：指向同帖某个 `kind='answer'` 的 reply；无 answer 时为空。
5. **spine 连通**：从任意 answer 沿 `source` 回溯，最终到达唯一 root answer；无环。
6. **append-only（约定）**：reply 只 INSERT，不 UPDATE/DELETE；元数据（posts 9 字段）可变。
7. **跨帖引用可解析**：`posts.depends_on` 为 JSON 数组，元素 `{kind: post|doc, id, anchor?}`；kind=post 时 id 必须存在、anchor（若有）须为该帖 answer；kind=doc 时 id 须为仓库内存在的文件路径。正文内联引用 `[[target]]` / `[[target#anchor]]`（target 含 '/' 或 '.md' → doc，否则 → post）为软注解，反查索引一并收录。

## 跨帖引用索引（depends_on + refs）

- **结构化前置**：`posts.depends_on`（JSON 数组）承载跨帖/跨文档引用；`[[target#anchor]]` 为正文内联软注解。帖内 `source` 管 spine，跨帖 `depends_on` 管图谱。
- **反向索引（派生）**：`kb refs` 从 `depends_on` + 全库正文 `[[token]]` 双向提取，回答「谁引用我」；`kb refs --all` dump 全图。与 FTS5 互补：FTS5 前向搜内容，refs 反向搜引用。
- **热更新**：`kb depends <post-id> --set|--add|--clear` 可对既有帖增改 depends_on——元数据（9 字段）可变，query 正文 append-only 不回改；写后即重渲染该帖 md，悬空校验归 validator ⑦。
- **校验**：validator 对 `depends_on` 做形状 + 悬空校验（post id 必须存在、doc 路径必须存在）。

## 渲染格式（posts/<id>.md）

由 `tools/render.js` 生成：

```markdown
---
id / title / author / tags / state / current / assigned / entry / summary / depends_on（非空时）
---

# <title>

> 状态：… · 负责：… · 当前：…

## Query
<body>

## Answer a1
> 取代自 `a1`（仅当有 source）
<body>

### 评论区
**author**：<body>
```

- 标记 `（current）` 打在 current 指向的 answer 上。
- 评论按所属 answer 归入其 `### 评论区`。
- md 的 frontmatter 仅供人类阅读；**机器事实源是 DB**（frontmatter 的 YAML 边界情况不影响机器语义）。
- **agent 读帖走 `kb_view`，勿 read md 全文**：结构化投影是 agent 的唯一读帖入口——`scope=head`（默认）= ADR-0002 §2 阅读边界 `{summary, query, current}`；`scope=spine` = head + 沿 source 反向链到 root；评论默认零装载（`--comments on` 才附）。md 渲染物定位 = 供人读 / diff，不作为 agent 的读路径。

## 校验器（tools/validate.js）

检查：① 9 字段合法；② 每帖恰一个 query；③ answer 来源引用规则；④ current 合法；⑤ spine 连通；⑥ md 渲染与 DB 一致；⑦ depends_on 合法且引用不悬空。通过 = exit 0。

## 运行

```bash
node tools/seed.js      # 建库 + 载入样例
node tools/render.js    # 生成 posts/*.md
node tools/validate.js  # 校验（全绿 = exit 0）
node tools/kb.js query --tag X      # 结构化查询（列表层，无正文）
node tools/kb.js search <关键词>     # 全文搜索（FTS5 trigram，短词退回 LIKE）
node tools/kb.js view <post-id> [--scope head|spine|full] [--comments on|none]  # 结构化投影（head=阅读边界；缺省 full+comments，向后兼容 Web UI）
node tools/kb.js claim <id> --as A  # 乐观认领
node tools/kb.js answer <id> --as A --source a2 --rel supersedes --body "…"  # 交接/巩固
node tools/kb.js state <id> --state done   # 状态流转
node tools/kb.js subscribe add --tag X     # 订阅（持久化）
node tools/kb.js refs <id>                 # 反向索引（谁引用该帖/文档）
node tools/kb.js refs --all                 # 全图 dump
node tools/kb.js depends <post-id> --set <json> | --add <json> | --clear  # depends_on 热更新（--set-b64/--add-b64 argv 安全）
node tools/kb.js subscribe check           # 查新变更并推进 checkpoint
node tools/kb.js subscribe list            # 列出订阅
```
