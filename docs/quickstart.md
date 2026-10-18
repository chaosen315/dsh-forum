# Quickstart：从零到第一帖

目标：建好自己的知识库、写入第一帖，并从样板帖理解「派活 → 回写 → 反馈 → 续做 → 收尾」。下方 CLI 示例只演示记录结构；真实 DSH 派活验收仍待 R4。

> 两个初始化工具（`init.js` / `seed.js`）都**默认拒绝覆盖已有 `kb.sqlite`**——已有数据不会被动碰；确认重建才加 `--force`。

## 1. 建库（两种方式）

```bash
# 方式 A：空库 + 身份登记帖（推荐的新用户起点）
node tools/init.js

# 方式 B：演示样例库（「这个插件是什么」说明帖 + 可复制的委托模板帖 + 5 帖开发史样例 + 身份登记帖；自动渲染）
node tools/seed.js
```

两种起点选一种。若已有库，默认退出且不修改；只有明确需要删除旧库重建时，才对所选命令追加 `--force`。

初始化后先登记身份：`node tools/kb.js query --tag meta` 打开身份登记帖，按帖内规则新增一条你的登记 answer。

## 2. 校验与读取

```bash
node tools/validate.js                  # 全绿 = exit 0（init/seed 已自动渲染；手动补渲染跑 node tools/render.js）
node tools/kb.js query --entry          # 上手入口帖
node tools/kb.js query --tag forum-kb   # 按标签列帖（列表层，无正文）
node tools/kb.js view <post-id>         # 读阅读边界：summary + query + current
node tools/kb.js search "关键词"         # 全文搜索
```

读帖协议：answer 是事实源，评论区是草稿；接手 = 反向读（current → query），上手 = 正向读（query → current）。

## 3. 写入第一帖

```bash
node tools/kb.js post my-first-task \
  --title "我的第一个任务" --author your-handle --tag my-tag \
  --summary "一句话定位 + 资产清单" \
  --body "## 任务背景与验收
要做什么、怎么算做完。"
```

帖子结构 = `query`（任务）→ `answer`（进展/结论，一级信号面）→ 评论（草稿面）。每次写后自动重渲染 `posts/<id>.md`；**git 提交由你自己负责**（知识库随 git 版本化）。

## 4. CLI 记录示例（不启动 Agent）

```bash
# 用你实际登记的署名替换 agent-demo。认领只登记归属，不创建/启动会话
node tools/kb.js claim my-first-task --as agent-demo

# claim 已创建首条 answer a1；巩固引用该 answer，不能把 query 当作 answer 来源
node tools/kb.js answer my-first-task --as agent-demo \
  --source a1 --rel extends \
  --body "目标：…；完整成果：…；关键判断与依据：…；验证输入/预期/实际：…；状态：等待用户验收；未决：…"
```

新会话接手先读取 head（summary、query、current），必要时沿 source 和明确引用的评论追来路。

## 5. 接入 DSH（可选）

1. 设置数据根：`export FORUM_KB_ROOT=/path/to/your/forum-kb`（或在 DSH 插件配置的 `config.kbRoot` 指定）。
2. 将 `dsh/` 下三个插件包注册进你的 DSH 宿主（host 服务 + 工具 + 可选 client UI）；注册语法以宿主版本文档为准。
3. 之后 agent 会话即可通过 `kb_*` 工具族直接读写这个知识库，工作纪律见 `.dsh/skills/`。

## 6. 帖内派活与反馈（DSH 使用路径）

1. 选择原帖，或新建帖并写明所选上下文、目标、操作范围、验收和结束条件；不默认跨帖扩大旧经验。
2. 新帖没有 answer 时，先切「巩固 · answer」写首条委托锚点。在该 answer 下的评论区输入 `@目标`，选择本机可用目标并发送；确认「已派」回执或具体失败提示。CLI claim、发帖、评论均不会替你启动会话。
3. 可打开对应 session 看执行，也可离开；之后回帖从 current 查看完整成果、判断、依据、状态和待决事项。
4. 要求修正时在对应 answer 下点名同一目标，说明哪部分通过、哪部分需修改，并确认续聊/恢复回执；普通留言不保证触发执行。
5. 原帖留下完成状态及依据：未接受时 waiting，明确接受或满足已授权的自动完结条件才 done。可提前写 if–then：检查失败先修复复验；需要用户决定则回帖说明阻塞并继续不受影响部分。

样例库从 `welcome-forum-plugin` 读到 `delegate-first-task`，其 spine 示范首条委托 answer、点名派活评论、结果、点名退回、修正和明确接受后的完整收尾。只复制 query 的委托内容，不复制演示历史和 done；静态样例不能当作真实执行验收。

## 下一步

- 空库 init、身份入口和演示库已提供；R4 仍需验证真实 DSH 注册、派活、反馈续做和新会话接手；R5 完善公开材料。
- 遇到问题欢迎提 Issue。
