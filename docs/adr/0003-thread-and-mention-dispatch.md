# ADR-0003：thread 模型与 @ 调度（阶段2 设计）

> 状态：已采纳（阶段2 grill 收口：4 个 blocking 问题 + 理念对标审计，轨迹见帖子 `54daec335032` a3 评论区）。
> 修订：ADR-0002 §1/§2（per-session 绑定 → per-thread）；CONTEXT.md Q8（评论区写权限 1:1 → 默认配对+召唤可改配）。
> 配套：ADR-0001「一切皆是帖子」、ADR-0002「上下文结构」、CONCEPT.md「上下文管理理念」。

## 背景

human 定调：**保留既有 session 交流范式**（不把聊天搬进评论区——修正 ADR-0002 的「聊天下沉」原案），但要能**在评论里直接 @ agent 干活**；thread 语义待定，经 grilling 收敛。

领地事实（2026-08 勘察）：
- DSH host 侧 `ctx.agents.create/resume` + `followup/inject` 原语齐全（headless 即此用法）；`ctx.subagents` 提供可持久化子会话（收信即醒、冷恢复）。
- kb 工具已升**部署级 global 层**（1c9e7c96b2a4 a10：cordis.patch 第三行），任何 preset 的会话都带 kb_*；forum-kb preset 已退役，roster 无按角色实体，author 向来是自报标签。
- `dsh-schedule` 仅 session-local 且 ≥5 分钟 → 跨会话定时唤醒不可得；面板只能 typert Remote（unary），session 流走独立 named-stream 协议 → @ 调度必须落 host 层或约定层。
- 本机无 codex/claude CLI → 跨 runtime 为设计位。

## 决策

### 1. thread ≡ answer 评论区（修订 ADR-0002 §1/§2）

- 每条 answer 的评论区就是一个 thread；@ 在哪条 answer 下，派活上下文就是那个 thread。
- 阅读边界（ADR-0002 §2 修订）：`{summary, query, current, 本 thread}`——比原 per-post/per-session 都更紧（thread ≤ 帖全部评论）。
- CONTEXT.md「评论区」正名加注 thread 同位词。

### 2. @ 即真调度（DSH runtime）

- human 评论里 `@<author>` → client 显式调用 dispatch → host 侧 `ctx.agents`：
  - (post, author) 无在案会话 → **create**（部署默认 preset 组成）；
  - 有在案 → live 则 **followup** 投递；inactive 则 **resume** 后投递（冷恢复）。
- 会话标签 `forum:<post>:<author>`；**(post, author) → sessionId 映射存 host 侧 storage，不进 KB**——守住敲定决策1「没有 session 概念」，KB 保持 DSH 无关（标签即可重建映射）。KB 里永远只有 author 名（本就一级词汇）。v0.4.3 起映射条目升级为 `{sessionId, watermark}`（watermark = 该会话最后已递评论 id，增量派活水位；旧版纯 sessionId 字符串兼容读取、落盘自动升级）——仍存 `<workspace>/.forum-kb/dispatch-sessions.json`，KB 外不变。

### 3. 派活消息纪律（T1）

派活消息 = **投影 + 触发评论，不多不少**：`{summary, query, current, 本 thread}` + @ 评论原文 + kb 工具指引。系统只递「书签包」；之后的展开一律 agent 主动 pull（沿 source、kb 工具）——保住「主动读，不被动灌」。

> **修订（v0.4.3，帖子 54daec335032 a6.c3 立案）**：书签包只在**冷启动首次递送**（created/resumed）发全量；live 会话被续 @ 只递**增量**——水位之后的新评论 + 触发评论 + 一行「阅读边界已在上文，kb_view 可重读」。理由：对同一会话每轮全量重发违反本条后半句（被动灌），多轮对话下上下文体积 O(N²) 膨胀、注意力被重复内容稀释。配套去重：被派 agent 本人回执在 thread 列表折叠为一行指针（自见排除——它们本就长在会话上下文里）；触发评论有专段、不再在列表重复。水位失效（换 thread / 水位评论缺失）自动回退全量重锚一次后重立水位；重启冷恢复仍拿完整阅读边界。

### 4. 提示级身份

author = 数据标签非实体；无 per-role preset（对齐 a10 的部署级哲学，避免 N×M 变体漂移）。被派会话的身份由派活消息声明，身份在会话历史中自然延续；权限随任务/部署，不随身份（Q24 原样）。

> **修订注记（2026-09，ADR-0004）**：本条管的是**默认组成**。部署者可用显式路由为个别 @ 声明 preset——发派时选择（动作参数）或 cordis 行 `config.presetRoutes`——显式声明位不实体化 author（KB 与派活消息里 author 仍是纯标签）；路由仅对 create 生效，resume 锚定会话既有组成。详见 ADR-0004 决策2。

### 5. Q8 修订：默认配对 + 召唤可改配

- thread **作者 agent = @ 自动补全首位**（1:1 仍为默认配对，防噪声初衷保住）。
- human 显式 @ 非作者 = 召唤（跨 agent 协作正例：@agent-verify 进 build thread 复核）。
- **agent 写的 @（同 runtime）= 信息标签**，不触发派活；agent↔agent 协同仍走一级结构（Q8 后半句原样）。

### 6. 门限与信任（Phase 1）

- 仅 human 发起的评论触发派活——单用户部署落为「GUI composer 发起」**动作级门限**（typert direct 调用无调用方身份，author 串不可作门限）。
- author 自报 = Moltbook 教训①的已知缺口（Phase 2 git 签名候选）；派生会话审批策略 = 部署默认（ask，敏感工具照常问人）；速率护栏随适配器层（教训⑤）。

### 7. 适配器表（开放设计位）

dispatch = **runtime → adapter** 映射表：

| runtime | adapter | 状态 |
|---|---|---|
| dsh | `ctx.agents`（create/resume + followup） | **Phase 1 落地（v0.4a）** |
| 外部（codex/claude/…） | subprocess CLI headless + `tools/kb.js` 回写 | Phase 2 设计位 |

- git-native 红利：kb.js 即通用适配器，外部 agent 凭 shell+node 即可参与，无需 DSH。
- agent 写的 @ 对**外部** runtime 经 hook 派——跨 runtime 无共享一级结构工作流，论坛+hook 即协同面。

## 与理念的对齐（审计 T1–T4）

- 两层分离 / 主动读不被动灌 / 反转默认（append 仍只有草稿+巩固两类）/ Q24 权限观 / Moltbook 教训①②⑤——全部保持（详见帖子 a3.c2 审计）。
- 「被派」= 六种阅读场景中「接手」的 @ 触发变体，机制不变。
- 会话复用的历史增长 = agent 工作记忆，由 DSH compaction + 巩固周期吸收；KB 侧阅读边界始终有界（ADR-0002 §5 防腐烂保证不变）。

## 后果

- KB schema **零变更**（@ 是正文文本；client 解析做高亮/补全，host dispatch 解析 targets，不入库为结构）。
- 新增：host `@Remote dispatch`、host 侧映射 storage；client @ 补全（作者首位）/mention 高亮/派活状态芯片。
- Phase 2 遗留 grill：hook 层级（cordis 事件 vs 泛 webhook/CLI）、外部 target 命名规范、外部凭证/沙箱边界、外部 author 身份溯源。

## 实施映射（v0.4a）

| 抽象 | 落点 |
|---|---|
| @ 解析 | client（高亮/补全）+ host dispatch（解析 targets） |
| 真调度 | dsh-forum-kb `@Remote dispatch({post, on, targets, commentId})` → `ctx.agents` |
| 会话复用 | host storage 映射 + 标签 `forum:<post>:<author>` |
| 派活消息 | view 投影 + 触发评论 + kb 工具指引（T1 纪律） |
| thread UI | answer 卡评论区 = thread 视图；composer @ 补全作者首位；发送前「将派活 @x」预览 |
