# 上下文结构：聊天下沉后 agent 读什么

> 状态：已采纳（方向 B 的架构决策）。配套：ADR-0001「一切皆是帖子」、CONCEPT.md「上下文管理理念」。
> **修订注记（2026-08）**：§1/§2 的 per-session 绑定已被 **ADR-0003** 修订为 per-thread（thread ≡ answer 评论区，会话自由复用）；§3 投影形状原样存活（thread 字段改为取本 answer 评论区）；§4/§5 不变。

## 背景

方向 B：DSH 本身就是论坛，聊天下沉到帖子的评论区。这是「反转默认」的落实，也是最容易重新引入 context rot 的地方——**如果 agent 聊天时被迫读整条 store，聊天下沉只是把腐烂从聊天窗搬进评论区，范式就失败了**。

本 ADR 钉死：聊天下沉后，agent 的上下文**怎么装、装多少、什么时候清**。

## 决策

### 1. session ↔ 帖子映射

- 一个 DSH session 绑定到一个帖子的**评论区**。
- session 的「当前真相」= 该帖的 `current` answer。
- session 里的来回，默认是**草稿**（评论）；只有主动写 answer 才是**巩固**（进 store）。

### 2. 阅读边界（agent 此刻的上下文）

agent 进入/回到一个帖子，上下文只装四样（有界）：

1. `summary` —— 一句话定位 + 资产清单。
2. `query` —— 任务定义。
3. `current` answer —— 现状 / 关键决策 / 下一步（自包含，交接入口）。
4. **当前草稿线程** —— 本 session 的评论来回（可滚动、可丢弃）。

**绝不默认装载**：全部 answer 历史、全部评论历史、store 全量。

### 3. 投影（host 镜像给 client 的读）

host 的 projection 形状 = 阅读边界，不多不少：

```json
{
  "postId": "35cc1ea0fbf0",
  "summary": "进行中。资产：流程[…] 决策[…]",
  "query": "实现 forum-kb 的格式校验器……",
  "current": { "id": "a2", "body": "spine 连通算法：……" },
  "thread": [ { "author": "human", "body": "……" } ]
}
```

- `thread` 只含当前 session 的评论（有界）。
- 沿 `source` 回溯 = **显式动作**（按需拉某条历史 answer），不是默认装载。

### 4. 巩固（写 = 主动综合内化）

- agent 聊够了，把 thread 综合成一条 answer，写回 store，移 `current`。
- 之后阅读边界回到 `{ summary, query, current(new) }`，thread 清空（草稿可弃）。
- 纯澄清留在评论区；有价值的东西进 answer（呼应 Q32：经验进一级结构）。

### 5. 防腐烂保证

- **阅读边界有界**：只装四样，规模 O(1) + 当前 thread，不随帖子历史增长。
- **主动读（pull）**：历史 answer / 评论按需拉，系统不灌（push）。
- **压缩是 agent 自己的事**（呼应 SPEC Q33）：KB 只提供可读结构，不替 agent 装载 / 压缩上下文。

## 后果

- **交接** = 读 `{ summary, query, current }` 三样即可（current 自包含）。
- **上手** = 读 entry 帖 + 沿资产清单展开。
- **监控** = 只读各帖 `summary + current`（不陷全文）。
- 上下文规模不随 store 增长，长线程不腐烂——这是「反转默认」能成立的结构性原因。

## 实现映射（供 L3 参考）

| 抽象 | DSH 落点 |
|---|---|
| 阅读边界 | projection（session projection unit，`useProjection` 读） |
| 巩固 / 认领 / 评论 | Remote service（`ctx.remote.forumKb.*`，经 api-gateway 写） |
| store | `kb.sqlite`（host 文件系统） |
| 草稿线程 | session 评论（有界，随 session） |
