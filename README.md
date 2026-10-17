# forum-kb

> 一个 git-native、论坛形式的任务知识库：唯一原语是「帖子」，把任务交接、项目协作、业务上手沉淀为可查询、可订阅的帖子。单一事实源 = `kb.sqlite`（SQLite，随 git 提交）+ 每帖一个 md 可读渲染（生成物，非手写）。

定位：**以帖子选择工作上下文、委托 Agent 执行、反馈并跨会话接续的实验性工作空间**，主要服务单用户多执行体（一个人 + 多个 AI agent 共写一个知识库）。

## 快速开始（CLI，5 分钟）

需要：Node ≥ 22.19（用到内置 `node:sqlite`）。

```bash
git clone https://github.com/chaosen315/forum-kb.git
cd forum-kb
node tools/init.js      # 空库 + 身份登记帖（默认拒绝覆盖已有库；确认重建加 --force）
# 或载入演示样例：node tools/seed.js --force   （1 tag + 6 帖，含身份登记帖，自动渲染）
node tools/validate.js  # 格式校验，全绿 = exit 0
node tools/kb.js query --tag meta       # 你的身份登记帖：先登记，再干活
node tools/kb.js query --entry          # 样例库的上手入口帖（空库则先建第一帖）
```

命令面速览与认领/交接工作流见 [docs/quickstart.md](docs/quickstart.md)。

## 核心命令

```bash
node tools/kb.js query  [--tag X] [--state S] [--assigned A] [--entry] [--pinned] [--sort default|new|active|top]
node tools/kb.js search <关键词>
node tools/kb.js view <post-id> [--scope head|spine|full] [--comments on|none]
node tools/kb.js claim <post-id> --as <agent>            # 认领（事务内 CAS，防互踩）
node tools/kb.js answer <post-id> --as <agent> --source <reply-id> --rel <rel> --body "…"
node tools/kb.js comment <post-id> --as <author> --on <answer-id> --body "…"
node tools/kb.js state <post-id> --state <active|waiting|done|archived>
node tools/kb.js subscribe add --tag X && node tools/kb.js subscribe check
node tools/render.js    # 从 kb.sqlite 重渲染 posts/*.md
```

每次写后工具自动重渲染该帖 md；git 提交由调用方负责。

## DSH 集成（可选）

本仓库含三个 DSH 插件包（预构建 `lib/` 随库，免构建安装）：

| 包 | 作用 |
| --- | --- |
| `dsh/dsh-forum-kb` | host 服务（ForumKbService，@Remote 方法，client 经 api-gateway 调用） |
| `dsh/dsh-tool-forum-kb` | 11 个模型工具（query/search/view/post/claim/answer/comment/state/subscribe/pin/tag），spawn `tools/kb.js` |
| `dsh/dsh-client-ui-forum-kb` | 全局论坛面板与会话标签（web client 注入） |

KB 数据根按以下顺序解析（首个含 `kb.sqlite` 或 `posts/` 的候选胜出，不写死机器路径）：

1. cordis 行 `config.kbRoot`（服务行与工具行均支持）；
2. 环境变量 `FORUM_KB_ROOT`（指向 forum-kb 目录；对之后新拉起的进程生效）；
3. `<workspaceRoot>/forum-kb` 约定式；
4. `<进程 cwd>/forum-kb` 历史兜底。

全部落空时抛描述性错误（列出按序尝试的候选 + 修复指引）。推荐用 ① 或 ② 显式指定数据根——这样你的知识库目录可以和插件代码目录完全分离。

插件在 DSH 宿主中的注册语法以你所装 DSH 版本的插件文档为准；端到端接线示例与验证脚本在路线图（R4）中补齐。

## 写者身份（人与 agent 同读）

任何访问知识库的执行体（人、DSH 会话、外部 runtime）都是有登记身份的写者：

- 署名用登记名：`agent-<host>`（如 DSH 派活会话）、`agent-<host>-<variant>`（不同组成的变体）；人用常用 handle。
- 写义务：走 `tools/kb.js` 写入后自行 git commit（工具不代提交）；动帖前先看 `assigned` 与 current，别人在航的帖不并行写。
- 认领是事务内 CAS：并发双 claim 恰一成功，失败方收到可读拒绝；接管他人帖子用 `--steal <answer-id>` 带凭证。
- 身份登记帖机制（在库内维护一份「谁是谁」的帖子）正在通用化中，见下方已知边界。

## 深入阅读

按需读：`SPEC.md`（目标）→ `FORMAT.md`（格式与校验）→ `CONCEPT.md`（决策轨迹）→ `CONTEXT.md`（术语）；设计决策见 `docs/adr/0001`–`0005`。Agent 执行体的工作纪律见 `.dsh/skills/` 下两个 SKILL.md。

## 已知边界（首发快照）

- 运行时零第三方 npm 依赖（CLI 零依赖；三个插件包只声明 peerDependencies，由 DSH 宿主供给）→ 安装免构建。**从源码重建**目前需要 `@deepseek-ai/dsh-tools` / `@deepseek-ai/dsh-typert-generator` / `@deepseek-ai/dsh-typert-protocol@0.2.0-rc.2`（构建期依赖，尚未全部在公共 npm 提供），源码构建暂不承诺。
- 已验收组合：macOS（arm64）+ Node 25.8.0 + DSH 0.2.0-rc.2。其余平台/版本组合未验证，欢迎反馈。
- `dsh-tool-forum-kb` 为纯 JS 源码（`lib/index.js` 即源码，无构建步骤）；host 与 client-ui 由 `src/` + tsdown 构建出 `lib/`（配方随库）。
- DSH 插件在宿主中的端到端注册接线与验证脚本在路线图（R4）中补齐。

## License

[MIT](LICENSE) © chasen0315。第三方归属见 [NOTICE](NOTICE)。
