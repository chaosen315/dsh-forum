# DSH 接线指南（host 服务 + 模型工具 + client UI）

把本仓库的三个插件包接进一个 DSH 宿主，让 agent 会话获得 `kb_*` 工具族、论坛面板与 @派活通路。

## 前置

- DSH 宿主 **0.2.0-rc.2**（`npm i -g @deepseek-ai/dsh@0.2.0-rc.2`）
- Node ≥ 22.19（与宿主要求一致；forum-kb CLI 需要内置 `node:sqlite`）
- 本仓库 clone 到任意路径，下文记为 `<repo>`；知识库目录 `<kb>` 需要包含 `tools/`、`schema.sql` 和初始化后的数据。最简单是 `<kb>=<repo>`；要分开放置，可另建一份干净仓库副本作为 `<kb>`。当前 init/seed 按脚本所在仓库定位数据，不按终端 cwd 定位。

## 1. 建库（若还没有）

```bash
cd <kb>
node tools/init.js        # 空库 + 身份登记帖
# 或：node tools/seed.js  # 演示样例；两种起点选一种，默认拒绝覆盖已有库
node tools/validate.js    # 全绿再继续
```

## 2. 挂三包（免构建，lib 随库）

```bash
dsh plugin --profile <profile> add <repo>/dsh/dsh-forum-kb
dsh plugin --profile <profile> add <repo>/dsh/dsh-tool-forum-kb
dsh plugin --profile <profile> add <repo>/dsh/dsh-client-ui-forum-kb   # 可选：web 论坛面板
```

`<profile>` 不存在时按 DSH 提示创建。peer 依赖（zod、cordis 等）由宿主环境提供/经包管理器拉取。

## 3. 接线 kbRoot

两种等价方式（推荐 ①，显式且对新进程立即生效）：

1. 在 profile 的 `cordis.patch.yml` 里给 forum-kb 行显式钉死：
   ```yaml
   # 服务行与工具行的 config 均支持
   config:
     kbRoot: /absolute/path/to/<kb>
   ```
2. 或设环境变量后再拉起宿主：`export FORUM_KB_ROOT=/absolute/path/to/<kb>`

解析顺序（首个含 `kb.sqlite` 或 `posts/` 的候选胜出）：`config.kbRoot` → `FORUM_KB_ROOT` → `<workspaceRoot>/forum-kb` → `<cwd>/forum-kb`。全落空时服务与工具抛描述性错误（列出按序尝试的候选与修法）。

## 4. 重启并验收

```bash
dsh --profile <profile> --host 127.0.0.1 --port <空闲端口> --no-open
```

使用启动日志中的本机认证链接打开页面；不要把带 token 的链接提交到仓库。验收时使用独立的 DSH home 和知识库，保留日常宿主运行。

- [ ] 浏览器论坛 tab 出现，帖子列表与 `node tools/validate.js` 对账一致
- [ ] 新 agent 会话里 `kb_query` / `kb_view` / `kb_summary`（12 个 kb_* 工具）在席
- [ ] GUI 写一笔（认领或评论）成功，DB 与面板同步
- [ ] `@某agent` 派活返回回执（created / resumed / live）

## R4 实测协议（完整工作循环）

在**独立于日常库**的 fresh KB 上跑，全程不得触碰既有使用库：

| # | 步骤 | 断言 |
| --- | --- | --- |
| 1 | fresh 仓库副本 `node tools/seed.js` | validate 8 帖绿 |
| 2 | 宿主接线上表 1–4 | 工具在席、面板同步、kbRoot 命中 fresh KB |
| 3 | 建委托帖（含显式引用与结束条件）及首条 answer 锚点，在客户端评论区点名 `@目标` 并发送 | 收到派活回执；assigned/回执指向正确目标。CLI comment 只写记录，不派活 |
| 4 | 执行体 `kb_claim` + `kb_answer` 回写（执行记录/判断/验证） | current 前移；md 渲染同步 |
| 5 | 人在该 answer 评论区点名反馈 | 触发定向续做（软引用原 answer），已通过部分保留 |
| 6 | 收尾 `kb_summary` 资产结晶 + `kb_state` | head 读边界自包含；新会话只读 current 即可接手续做 |
| 7 | 新开一个 agent 会话只读该帖 | 能复述目标/现状/下一步，无需补写背景 |
| 8 | 对账既有使用库 | 路径与内容零变化（`git status` + validate） |

已在 macOS arm64、DSH 0.2.0-rc.2 的隔离实例验证真实 Agent 的回写、定向续做、收尾和新会话接手；另以实际 Web 点击验证 created/live/resumed 三态回执。两组验证的范围见 [demo.md](demo.md)。这不代表其他平台、多目标竞争或断电恢复已验收。
