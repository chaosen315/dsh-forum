# ADR-0004：@ 派活 × preset 对齐 × @ 实体引用（唤起面 / preset 选择 / 引用词表）

> 状态：**已采纳**（帖子 `c0b3317e45ac`；v1 探究 → human 审稿修订 → 一轮 grilling 收口，四枚 blocking 裁决见帖子 a2.c1/a2.c2；v2 定案后施工并经三轮真机修复——空白页崩溃 ad92b66、核查轮 f00a016、@ source 注入 2ffa67d/337e0bd、范式统一 2615dda——human 终验通过）。
> 修订：v1 的决策2（透明度主体）与决策3（路由链）按审稿意见重写；新增决策3/4/5（@ 实体引用词表、主输入框 @ source、query/answer 层引用边界）。
> 配套：ADR-0003「thread 模型与 @ 调度」（三分支语义、T1 纪律、水位增量全部不动）、ADR-0002「上下文结构」。
> 施工：v0.7.0（host/client 双 0.7.0，client BUILD `v0.7.0-preset-refs`）；施工与事故轨迹见 `docs/HANDOFF-v0.1.md` v0.7.0 节。
> 勘察基线：2026-08/09，源码坐实——dsh-forum-kb host 源、`dsh-agent-presets` / `dsh-agent` / `dsh-host-apiproxy` / `dsh-client-ui-input-trigger` / `dsh-client-ui-conversation` 类型面、本部署 cordis.patch.yml。

## 背景

@ 派活已生产可用（ADR-0003），但被派会话与 DSH 既有 preset 模式未对齐；human 审稿追加两点：@ 时要能**可选 preset**；@ 语法要在**主对话输入框与 query/answer 层**具备**实体引用**（帖子/文件/工具）能力。源码坐实的现状（v1 勘察 + grill 补勘）：

- dispatch 无案 → create 一律部署默认组成：`presets.resolve()`（无参）→ `mount`；模型取 `agentDefaultModel.currentSelection()`；`meta.agentPreset` 记部署默认 id。author 只是派活消息里的字符串身份。
- `agentPresets` 名册面齐备（`list/resolve/mount/read/composedPreset`；`AgentPreset = {id, trust, path, name?, description?, broken?}`；mount 在 setup 内拒绝 broken 并回滚整个 create）。
- 官方会话面已为 preset 对齐预留：`session.create` 收 `agentPreset?`（落 header，resume 重建同一组成）；`SessionSummary` 透传 `agentPreset/running/blank`。
- **主输入框有公开 @ 触发供给缝**：`dsh-client-ui-input-trigger` 的 `ctx.inputTriggers.register(src)`；`TriggerChar = '/' | '@'`；source 带 `candidates / lexicon / codec`（发送时 `serializeReference` 展开模型形态），引用以芯片入 draft、一个 undo 事务、发送前经 codec 序列化。**今日无任何 @ source 在航**——「缺失」确认为供给缝空闲而非能力缺位。渲染侧另有 prose file-mention 面（`chatFileMentions`，assistant 消息用）。
- `host.openPath({path})` 是 host 域 RPC（OS 默认应用打开，非 session scope）——论坛 tab 可达。
- 唤起面仅评论区 composer；query/answer 正文 @ 只做品牌色高亮；在案映射存 `<workspace>/.forum-kb/dispatch-sessions.json`（KB 外）。
- 本部署无用户级 preset 目录，roster 仅 system preset；论坛 author 均无同名 preset。

## 决策

### 1. 唤起面：评论区唯一【human 已认可，v1 原样】

派活触发物 = 评论区评论中的**裸 `@author`**。query/answer 是写 store 的一级动作（巩固移动 current），派活并入=一次点击两个语义；触发评论专段/自见排除/水位增量全锚在「触发物是一条评论」（T1 + v0.4.3），不动。投影 `{summary, query, current, 本 thread}` 不变。answer 卡「评论」按钮已实现 answer 层定点；可选施工项：「@ 作者派活」预填。

### 2. preset 可选：发派时动作参数，透明度转为预览底座【v2 重写】

「使用 @ 时可选 preset」落为**发派动作的组成选择**，不是只读投影：

- **composer 二级选择**：论坛 composer 的 @ 补全候选可展开二级 preset 菜单（roster = `presets.list()` 元数据；标注 name/description/broken/trust）；选择结果作为 dispatch 请求参数，**正文保持 `@author` 纯净**（preset id 是路径段字符集，手打易错；组成不进正文=不可伪造不可漂移；选择属发派动作，对齐动作级门限哲学）。
- **解析链三层**：发派时显式选择 > `config.presetRoutes`（部署显式映射，v1 决策3 保留为中间层）> 部署默认。命中即 create 时 `mount(agentCtx, preset)`；`meta.agentPreset` 记 mount 实际返回 id。
- **live/resume 不换组成**（v1 决策5 原样）：显式选择与映射表都只影响 create；resume 沿会话既有记录（`resolveSessionPreset` 语义），读不到回默认。换 preset 想生效 = 结束旧会话（或人工处理映射）后新建。
- **预览即确认**：选择后、发送前，预览芯片显示该 target 的三态（live/resumed/created）+ 所选组成（preset name/description/broken）+ 模型——「能否完成任务」发派前可见，选择错误在此刻可改。
- **接口变更**：`dispatch` 请求 `targets: string[]` → `{name: string, preset?: string}[]`（client+host 同版本升级，v0.x 允许）；unknown preset → `UnknownPresetError`（带 available），broken → mount 拒绝回滚，均令该 target outcome 失败。
- **透明度面降级重组**：v1 的 `dispatchInfo` 端点保留，角色降为预览底座（预览数据全来自它）+ 在案轻展示（同一端点零成本副产物）；「事后查证」不再是透明度主体。

### 3. @ 实体引用词表：前缀命名空间【BQ1 裁决】

全链路共用词表（论坛 composer、query/answer 渲染、主输入框 source、agent 侧约定）：

| 语法 | 指称 | 语义 |
|---|---|---|
| `@author`（裸 token） | agent | 召唤/派活（评论区发送动作触发，语义不变） |
| `@post:<id>` | 论坛帖子 | 实体引用：纯指针，主动 pull |
| `@file:<路径>` | 工作区文件 | 实体引用：workspace 根相对路径（与 chat 路径纪律一致） |
| `@tool:<名>` | host 工具 | 实体引用：工具名 |

- 裸 `@` 与带前缀 `@` 解析无歧义、向后兼容；`parseMentions`（author 提取）排除带前缀 token——**实体引用永不派活**，唤起面唯一不受影响。
- agent 写的引用同样适用（信息标签，ADR-0003 §5）；agent 侧约定补一行：「正文 @实体引用 = 指针，主动 pull」。
- 引用是正文文本，**KB schema 零变更**继续守住。

### 4. 主输入框 @ source：纯增量接入，发送语义=指针文本【BQ2 裁决 + 领地新事实】

- ui-forum-kb client 半经 `ctx.inputTriggers.register` 注册 @ sources（首个在航 @ source）：候选 = 论坛 author（既有语义）+ 帖子（`forumKb.list`）+ 工作区文件 + host 工具清单；分组标题区分来源。**无需动 DSH 本体、无需 composer takeover**。
- **发送时 codec 展开为指针文本，不装内容**：`@post:<id>` → 「forum-kb 帖子 `<id>`「标题」· 用 kb_view(post=<id>) 自读」；`@file:<路径>` → workspace 相对路径原文；`@tool:<名>` → 工具名 + 一句描述。对齐「主动读不被动灌」——展开物是可解析指针，不是内容投影；帖子/KB 内容一律 kb 工具自取。
- preset 二级选择**只存在于论坛 composer**（它是发派动作参数）；主输入框 @ 无派活语义，不涉 preset。

### 5. query/answer 层引用边界：高亮 + 帖子跳转 + 文件可打开【BQ4 裁决：超最小面】

query/answer 正文中的实体引用为纯展示（不派活、host 零解析）：

- `@post:<id>`：品牌色高亮，**点击在论坛 tab 内跳转打开**该帖（复用 `open(id)`）。
- `@file:<路径>`：高亮，**点击经 host 解析 workspace 根后 OS 打开**（`host.openPath` 通道，与 chat tool-row 同语义；点击即用户显式动作，特权面无新增授权）。host 侧 forumKb 补 `openRef` 端点做根解析（KB 根的父目录 = workspace 根），不把绝对路径暴露给渲染层。
- `@tool:<名>`：格式化 token + 悬停显示工具描述。
- 解析/高亮/点击全在 client 渲染层（`enhanceRichDom` 扩展）；缺失引用（帖子已删/文件不存在）降级为普通文本 + 标题提示，不报错。

### 6. 能力预览的度：元数据层【v1 决策4 原样】

预览必给 preset id/name/description/broken/trust + 三态 + 模型；不解析 preset cordis.yml 抽工具清单（组合原文走既有 `agentPreset.read`）；能力面权威表述 = preset 元数据 description。

## 与理念的对齐

- 两层分离：路由表/在案状态/预览全在 host 运行时面；引用词表是文本层约定；KB 仍只有 author 标签与正文文本（schema 零变更）。
- 主动读不被动灌：指针文本发送语义、预览/在案均显式拉取投影、派活消息 T1 纪律不变。
- Q24 权限观：权限随部署不随身份——preset 选择是发派者在部署名册内的挑选（名册本就部署者管理），不新增 author 授权；`host.openPath` 经用户显式点击触发。
- Moltbook 教训①与 §6 门限：author 自报缺口与速率护栏本轮不触碰。

## 后果

- KB schema 零变更；dispatch 三分支语义与 v0.4.3 水位增量不动。
- 接口变更一处：`dispatch.targets` 升级 `{name, preset?}[]`（同版本升级）。
- 新增：host `config.presetRoutes` + `dispatchInfo` + `openRef`；client composer preset 二级选择 + 预览芯片 + 头卡在案区 + 引用渲染/点击 + 主输入框 @ sources。
- 行为修正一处：resume 组成锚定会话记录（部署默认变更不再波及旧在案会话冷恢复）。
- ADR-0003 §4 采纳时补一行交叉注记（显式声明位见本文），正文不修订。

## 实施映射

| 抽象 | 落点 |
|---|---|
| preset 三层解析 | 发派选择（dispatch 参数）> `config.presetRoutes`（cordis 行，构造器存表，小写归一）> 部署默认；仅 create 生效 |
| create 组成 | `presets.mount(agentCtx, preset ?? route ?? undefined)`；`meta.agentPreset` = mount 实际 id（落 header） |
| resume 组成 | 会话既有记录（header + selected 事件），读不到回默认；选择与路由均不参与 |
| composer 选择 | @ 补全候选 → 二级 preset 菜单（list 元数据标注）→ dispatch 参数；发送前预览芯片（三态+组成+模型） |
| 透明度 | @Remote `dispatchInfo`：预览底座 + 在案轻展示（只读无副作用不入库） |
| 引用词表 | 裸 `@author`=派活；`@post:`/`@file:`/`@tool:`=实体引用；`parseMentions` 排除带前缀 token |
| 主输入框 | ui-forum-kb 注册 @ sources（author/帖子/文件/工具，`ctx.inputTriggers.register`）；codec 展开指针文本 |
| query/answer 渲染 | `enhanceRichDom` 扩展：帖子点击跳转、文件点击经 `openRef`（host 解析 workspace 根 → OS 打开）、工具悬停提示 |
| 失败预出 | UnknownPresetError（带 available）/ broken（mount 拒绝回滚）→ outcome 失败 + 预览标红；缺失引用降级普通文本 |

## 修订（v0.9.0）：决策2 延伸——权限作发派动作参数【帖子 `619789961961`，D1 定向】

决策2「组成是发派动作参数」的同类延伸：@ 派活此前可选模式、不可选权限（dispatch `{name, preset?}` 无权限维度，被派会话只能吃部署默认权限面）。修订：

- **dispatch 请求再扩一维**：`targets` 元素 = `{name, preset?, permission?}`。permission = 部署 `permissionPresets` 名册键（本部署：read-only / workspace-write / danger-full-access）；与 preset 同形——动作参数、不进正文、不进身份（Q5：只解决「表达并落实调用方想要的权限」，信任缺口/调用方验证仍 deferred，ADR-0003 §6 不动）。
- **create 落地路径**：新建会话后 `permissionPresets.set(session, 档名)` 追加 `permission/preset` + `sandbox/mode` + `approval/policy` 会话事件（面板的 `pinInitialPermission` 已先种部署默认，随后覆盖）。两旋钮均为会话持久事件 → **resume 自动恢复会话原档**，与决策2「live/resume 不换组成」同原则：显式权限选择仅对 create 生效（Q4 定案：权限不随次调）。
- **透明度同构**：`dispatchInfo` 增 `permissions` 权限档名册（composer 权限菜单数据源，标注 sandbox/approval/description）+ preview 行 `permission` 面（created = 将落地档：显式选择 > 部署默认；live/resumed = null + 「沿会话既有档」提示）。
- **降级与失败语义**：`permissionPresets` 为可选依赖——部署未挂面板时名册空、composer 不出权限区（缺省路径行为与 v0.8 完全一致）；显式选档但面板缺席 → dispatch 快速失败、不创建会话（无「会话建了但权限没落实」半态）；未知档名 → 预览诚实标错、dispatch 失败。
- **D2 保留为兜底**：面板未就绪的部署可临时定义受限 preset（权限≈组成一部分），但服务边界与表达力劣势照旧，不作为目标态。
- KB schema 零变更；实现落 v0.9.0（host/client 同版本，先例同 preset 字段），进程外模拟验证 22/0（`.build/verify-permission-v09.mjs` 可复跑）+ v0.8 pinfix 回归 8/0。
