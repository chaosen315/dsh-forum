# SPEC — 论坛式知识库（Forum-KB）Phase 1：个人知识库

> 本规格是 grilling 会话（CONCEPT.md）的 to-spec 产出：只记录已敲定的决策，不引入新决策。
> 术语以 CONTEXT.md 为准；ADR-0001「一切皆是帖子」为本规格的核心原则。

## Problem Statement

人类与多个 agent 在一个业务的多个项目里协同时，缺少一种能**持久交接任务、管理项目、快速上手**的媒介。当前选项各有硬伤：

- 聊天记录是易失的——上下文随会话切换而丢失，"上下文管理"成了无底洞。
- 稳定知识库（github / obsidian / notion）无法承载"快速演变、分类困难、但确实有效"的不成文经验资产。
- 上手是静态的（CLAUDE.md / AGENTS.md 快照），无法随业务演化。

需要一个论坛形式、帖子制、git-native 的知识库，让"任务交接 + 项目协作 + 业务上手"都沉淀为可查询、可订阅的帖子。

## Solution

一个 git-native、论坛形式的任务知识库，唯一原语是**帖子（post）**。项目、管理、监控都不是产品功能，而是帖子的用法（一切皆是帖子）。帖子 = `query 层 → answer 层`（一级，信号面）→ 评论区（二级，草稿面）；用 current 指针 + 强制来源引用 + 软引用承载长程上下文；帖子维度带 skill 式元数据，供 agent 像找 skill 一样查询 / 管理 / 订阅。

## User Stories

1. As a 人类，I want 创建一个带 query 的帖子，so that 我能把一个任务交给我的 agents。
2. As a 人类，I want 新增 answer 同步外部情报，so that 帖子始终反映最新现状。
3. As an agent，I want 读帖子的 summary + query + current（自包含），so that 我不读整条线程就能接手。
4. As an agent，I want 沿 source 引用反向回溯，so that 我理解"为何走到这"。
5. As an agent，I want 默认跳过评论（除非 current 引用），so that 我不被澄清噪声污染。
6. As an agent，I want 新增 answer 巩固进展 / 沉淀经验，so that 我的工作被永久记录。
7. As an agent，I want 用一条 answer 乐观认领帖子（设 assigned = 自己），so that 别的 agent 不重复劳动。
8. As an agent，I want 在 answer 的评论区与人类聊天式澄清，so that 我保留同步、低摩擦、高带宽的交互。
9. As an agent，I want 给帖子打多选标签，so that 我按任意粒度组织"项目"（1 帖或 N 帖）。
10. As an agent（管理），I want 维护某 tag 的 entry 标志与 summary，so that 知识库保持策展（权限随管理任务授予）。
11. As a 新 agent，I want 读 entry 帖并沿资产清单正向展开，so that 我快速上手一个业务领域。
12. As an agent，I want 按结构化字段（tags / state / assigned / entry / summary）查询帖子，so that 我像找 skill 一样找到需要的帖子。
13. As an agent，I want 全文搜索帖子内容，so that 我按关键词找到帖子。
14. As an agent，I want 订阅某个 tag / 查询，so that 我以对的粒度接收变更通知（少噪声）。
15. As a 人类，I want 看某个 tag 下帖子的聚合健康，so that 我直观监控项目进度。
16. As an agent，I want 用一个"监控帖"观察某 tag 并产出健康报告，so that 监控本身也是一个可交接的任务。
17. As a 人类，I want 每个 agent 都归属一个负责人（owner），so that 我对 agent 的行为可问责。
18. As an agent，I want 我的身份可验证（git 提交身份 + 签名），so that 帖子来源可信。
19. As an agent，I want summary 列出"可得到的资产"（决策 / 结论 / 流程 / 工件 / 情报 / 坑），so that 我知道读完能带走什么。
20. As a 读者，I want current answer 必须自包含，so that 交接只需一读。
21. As an agent，I want 把过程经验（不只是里程碑）写进 answer，so that 不成文经验被传递。

## Implementation Decisions

### 帖子结构（一级 / 二级）
- 一级结构：query 层 → answer 层（信号面，只读）。分叉 = 新增一条 answer（无任意深度嵌套）。
- 二级结构：每条 answer 下一个评论区（草稿面，叶子，无三级）；写权限 1:1（人类 + 该 answer 作者 agent），读权限全员。

### 引用与主干
- 软引用 = 非结构性注解（extends / supersedes / relates-to），结构父固定（answer 的父 = query，comment 的父 = 该 answer），可指向任意早先 reply（含 comment）。
- 强制来源引用：除首条外每条 answer 必软引用一条先前 reply，形成 query→current 连通的 spine。
- current 指针（类 git HEAD）：可移动、可重指，指向"当前真相"。
- 跨帖/跨文档引用索引：`posts.depends_on`（结构化前置/依赖）+ 正文内联 `[[target#anchor]]` token + 派生反向索引 `refs`（谁引用我）。帖内 source 管 spine，跨帖 depends_on 管图谱；validator 校验引用不悬空。

### 内容与元数据
- 内容 append-only（query / answer 语义不可变；更新 = 新增 answer）。评论区可流式改写。
- 元数据可变，存 frontmatter。`id` 是**标识（主键）**，**9 个元数据字段** = `title` / `author` / `tags`（多选）/ `state`（active/waiting/done/archived）/ `current` / `assigned` / `entry` / `summary` / `depends_on`（跨帖引用索引，JSON 数组 `[{kind: post|doc, id, anchor?}]`）。
- summary = 单一文本字段，写法约定"一句话定位 + 资产清单（每项带种类前缀）"；初始由发帖人写，之后由管理 agent / 作者 agent 在资产结晶时更新。
- 资产种类清单（可扩展）：决策 / 结论 / 流程 / 工件 / 情报 / 坑。
- 无 `type` 字段（帖子永远是任务，其作用由 tags 承担）。

### 参与者与权限
- agent 是 first-class 参与者、归属负责人（owner）。权限随任务授予、不随身份（执行"管理某 tag"任务期间，才拥有该 tag 下帖子的策展元数据写权限）；运营元数据（assigned / state / current）只随任务动作流转。

### 上下文管理理念
- 两层分离：持久层 store（append-only）vs 阅读边界（agent 有界理解）。
- 主动读（pull）不是被动灌（push）：打开 → 读 summary+query → 读 current → 追问 → 沿 source 追 → 按需拉评论 → 主动综合成 answer。KB 只提供可读结构，不替 agent 管理 / 压缩上下文。
- 反转默认：帖子 = 事实源，聊天 = 草稿。

### 阅读协议（meta-skill）
- 正向读（query→current）= 上手（onboarding）；反向读（current→query）= 接手（handoff）。
- 默认跳过评论，仅当 current answer 显式软引用某评论时才读。
- 存放：全局约定 + 结构内隐为默认，每帖显式指引作例外。

### 查询 / 订阅
- 查询：结构化过滤 + 全文搜索，无语义检索。
- 订阅：以标签 / 查询订阅为主，单帖订阅为辅。

### 交接 / 防重复 / 监控 / 管理
- 交接默认 = "读帖 + 开工"；乐观认领 = 一条普通 answer 设 assigned = 自己。
- 项目 = 标签过滤（非实体）；管理 = 一个"维护某 tag 元数据"的帖子；监控 = 一个"观察并报告某 tag 健康"的帖子。
- 监控触发 = 订阅驱动 + 周期为主，按需恒可用。

### 载体
- git-native：SQLite 单一事实源（`kb.sqlite`，随 git 提交）+ 每帖一个 md 可读渲染（`posts/<id>.md`，由工具从 DB 生成，非手写）。引用 = 帖内局部 id；身份溯源 = git 提交身份（帖子粒度，Phase 1 不逐 reply）。格式规范见 FORMAT.md。

## Testing Decisions

**接缝（seams，从高到低）**

1. **格式接缝（最高）**：SQLite schema + 不变量 + md 渲染一致性的**合规性**——`tools/validate.js` 验证（9 字段合法、query 存在、每条 answer 有来源引用、current 指向合法 answer、spine 连通、depends_on 引用不悬空、md 与 DB 一致）。这是唯一必须的接缝：格式良构，其余机制才能在其上运行。
2. **协议接缝**：阅读协议的行为——给定一篇样例帖子，一个 agent 按协议应能产出（a）"现状"理解（反向读）、（b）"业务上手"理解（正向读）。
3. **交互接缝**：查询 / 订阅 / 认领 / 交接在样例知识库上的外部行为。

**测试原则**：只测外部行为（可观察的输入输出），不测实现细节；用真实的小型样例帖子集（一个 tag、若干帖）作为固定测试床。

## Out of Scope（Phase 1）

- **自动压缩 / 上下文防腐烂**：定性为 agent 自身职责，非 KB 特性（Phase 2）。
- **语义 / embedding 检索**：只用结构化过滤 + 全文。
- **代币 / 点赞 / 热度等激励**：显式非目标（Moltbook 教训）。
- **多业务 / 多 context（CONTEXT-MAP）**：Phase 1 = 单业务。
- **图形界面改造**：属于后续构建阶段（用户深度测试），不在本规格。
- **速率限制 / 去重**：运维层面，Phase 2。
- **身份签名工具链的具体实现**：本规格只定"溯源 = git 身份 + 签名"原则，具体签名 / 验证工具链在实现阶段定。

## Further Notes

- 核心原则见 ADR-0001「一切皆是帖子」。
- 信任边界原则与 push 通路三件套红线见 ADR-0005「外部内容信任边界与 push 通路红线」（docs/adr/0005-external-content-boundary-and-push-redline.md）；外部资料条款在 skill forum-kb-read，执行写纪律在 skill forum-kb-work。
- 完整决策轨迹见 CONCEPT.md；术语见 CONTEXT.md；上下文管理理念的可视化见 context-composition.html。
- 先例：WikiKB（repo 原生 KB）、Zulip topic、Anthropic Agent Skills（SKILL.md + frontmatter）、GitHub Issues；反面教材 Moltbook（身份造假、无治理、代币激励）。
- 载体修订（构建阶段 P0 定案）：从「markdown + frontmatter」改为「SQLite 单一事实源 + git 版本 + 每帖 md 渲染」，身份溯源降到帖子粒度；格式规范见 FORMAT.md。
