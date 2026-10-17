// @deepseek-ai/dsh-forum-kb — 公共边界类型。
// typert 分析器要求：Remote 边界类型必须从【非根】公共子路径导出，否则
// `Remote boundary type ... must be exported from a public non-root type subpath`。
// 故独立成 ./types（package.json exports["./types"] → lib/types.js ← src/types.ts）。

/** 帖子列表项（阅读边界的 summary 层：list() 返回）。tags 自 v0.5.0（client 顶栏筛选用）；
 *  pinned/pinnedScope/createdAt/updatedAt/answers/comments 自 v0.6.0（f0442aa0f3b3 P0：
 *  客户端置顶区 / new·active·top 排序 / 计数徽标消费；数据源 = render.js 写进 md frontmatter）。 */
export interface PostSummary {
  id: string
  title: string
  state: string
  current: string | null
  assigned: string | null
  entry: number
  summary: string
  tags?: string[]
  pinned?: number
  pinnedScope?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  answers?: number
  comments?: number
}

/** 一次写操作（claim / answer / comment / state / post）的结果。
 *  id 仅 createPost 返回：req.id 省略时为系统生成的哈希 id。 */
export interface WriteResult {
  ok: boolean
  text?: string
  error?: string
  id?: string
}

/** FTS 搜索命中（search() 返回；kb.js search --json 行，summary 供客户端渲染）。 */
export interface SearchHit {
  id: string
  title: string
  state: string
  current: string | null
  summary: string
}

/** 跨帖/跨文档引用（posts.depends_on 元素；kind ∈ post|doc）。 */
export interface PostRef {
  kind: string
  id: string
  anchor?: string
}

/** answer 下评论（二级草稿面，view 投影内嵌于所属 answer）。 */
export interface CommentView {
  id: string
  author: string
  body: string
}

/** 单条 answer 视图（view 投影：一级信号面 + source 软引用链 + 是否 current + 评论线程）。 */
export interface AnswerView {
  id: string
  author: string
  body: string
  source: string | null
  sourceRel: string | null
  current: boolean
  comments: CommentView[]
}

/** 整帖结构化投影（view() 返回）：post 元数据 + query + answers。
 *  形状对齐 ADR-0002 §3 阅读边界的渲染面；由 tools/kb.js view 直出 JSON。
 *  pinned/pinnedScope 自 v0.8.0 hotfix（434b349bae90 a4 巡查立案）：P0 只给 PostSummary
 *  补了置顶字段、漏了 PostView——typert 网关按 schema 剥离未知键，详情页 view 投影恒无
 *  pinned，客户端头卡恒判「未置顶」→ 取消置顶按钮永远发 set:"on"，GUI 无法取消。
 *  optional 双向兼容旧 CLI 输出（同 PostSummary 写法）。 */
export interface PostView {
  id: string
  title: string
  author: string
  tags: string[]
  state: string
  current: string | null
  assigned: string | null
  entry: number
  summary: string
  pinned?: number
  pinnedScope?: string | null
  dependsOn?: PostRef[]
  query: string | null
  answers: AnswerView[]
}

/** 派活目标（v0.7.0，ADR-0004）：name = @ 的 author；preset = 发派时显式选择的组成
 *  （composer 二级菜单产物，动作参数不进正文）。缺省走 config.presetRoutes → 部署默认。
 *  旧版纯 string 目标照收（dispatch 内部归一）。仅对 create 生效；live/resume 不换组成。 */
export interface DispatchTarget {
  name: string
  preset?: string
  /** v0.9.0：发派时显式选择的权限档（permissionPresets 名册键，如 read-only /
   *  workspace-write / danger-full-access）。动作参数不进正文；仅 create 生效——
   *  live/resume 沿会话既有权限档（sandbox/mode、approval/policy 是会话持久事件）。
   *  缺省 = 部署默认档（现行为，permission 面板 pinInitialPermission 的种子）。 */
  permission?: string
}

/** 派活请求（@ 调度，ADR-0003）：human 发出含 @ 的评论后由 client 显式调用。
 *  targets = 评论正文里解析出的 @author 列表（门限在 client：动作级，仅 GUI 发起）。
 *  v0.7.0 起元素可为 DispatchTarget（带显式 preset 选择）。 */
export interface DispatchRequest {
  post: string
  /** 承载触发评论的 answer id（thread 所在）。 */
  on: string
  targets: Array<string | DispatchTarget>
  /** 触发者身份（composer 身份，通常 "user"）。 */
  author: string
  /** 触发评论原文。 */
  body: string
}

/** 单个目标的派活结果（dispatch() 逐 target 返回，不抛——错误进 error 字段）。 */
export interface DispatchOutcome {
  target: string
  ok: boolean
  sessionId?: string
  /** live = 递给在案活会话；resumed = 冷恢复后递；created = 新建会话。 */
  action?: "created" | "resumed" | "live"
  /** v0.9.0：created 时实际落地的权限档名（仅当发派请求显式选择且 permission 面板在席）。 */
  permission?: string
  error?: string
}

/** 入向被引用条目（refs() 返回；kb.js refs --json 行）。from = 引用方帖子 id。 */
export interface RefHit {
  from: string
  /** 出处：depends_on 或承载 [[token]] 的 reply id。 */
  where: string
  anchor?: string | null
  title?: string | null
}

/** 出向 depends_on 条目（refs() 返回；kind ∈ post|doc）。 */
export interface DepRef {
  kind: string
  id: string
  anchor?: string | null
  title?: string | null
}

/** 反向引用投影（refs() 返回，v0.6.0 P0）：client 详情页 refs 面板直接消费。 */
export interface RefsView {
  id: string
  kind: string
  inbound: RefHit[]
  outbound: DepRef[]
}

// ---- v0.7.0（ADR-0004 v2）：preset 三层解析 + 派活面投影 + @ 实体引用支撑 ----

/** preset 名册面（presets.list() 元数据投影；broken = 不可挂载原因，缺省可挂）。 */
export interface PresetFace {
  id: string
  name?: string
  description?: string
  broken?: string
  trust?: string
}

/** 模型选型面（agentDefaultModel.currentSelection()；将新建会话的模型）。 */
export interface ModelFace {
  provider: string
  model: string
  reasoningEffort?: string
}

/** 权限档名册面（v0.9.0，permissionPresets 投影）：name = 档位键（dispatch permission
 *  参数取值）；sandbox/approval = 该档落地的两个旋钮（预览透明）；description 供 UI 提示。 */
export interface PermissionFace {
  name: string
  sandbox?: string
  approval?: string
  description?: string
}

/** 发派前预览行（dispatchInfo 的 targets 形状逐 target 返回）。
 *  route = 组成来源：selection（发派显式选择）> routes（config.presetRoutes）> default（部署默认）；
 *  preset = 该 target 将运行/沿用 的组成面；model 仅 created 有意义；
 *  permission = 将运行/沿用的权限档面（v0.9.0；null = 沿会话既有档或部署未挂 permission 面板）。 */
export interface DispatchPreviewRow {
  target: string
  action: "live" | "resumed" | "created"
  route: "selection" | "routes" | "default"
  preset: PresetFace | null
  model?: ModelFace
  permission?: PermissionFace | null
  sessionId?: string
  /** 在案目标不换组成等提示（显式选择/路由仅对新建生效）。 */
  note?: string
}

/** 在案投影行（dispatchInfo 的 {post} 形状）：(post, author) → 会话的只读快照。
 *  v0.8.0 起亦是 dispatchSessions()（全量投影，列表页常用区数据源）的行形状——
 *  该端点不做 agentPreset 回查，agentPreset 恒 null（语义=未查，非「无组成」）。 */
export interface InCaseRow {
  post: string
  author: string
  sessionId: string
  live: boolean
  agentPreset?: string | null
  watermark?: string | null
}

/** 派活面投影（@Remote dispatchInfo 返回）：一次调用同时供 preset 二级菜单（presets）、
 *  发派前预览（preview）与头卡在案区（inCase）消费——只读、无副作用、不入库。 */
export interface DispatchInfoResult {
  presets: PresetFace[]
  /** 权限档名册（v0.9.0；composer 权限菜单数据源）。部署未挂 permission 面板时为空数组。 */
  permissions?: PermissionFace[]
  preview?: DispatchPreviewRow[]
  inCase?: InCaseRow[]
}

/** host 工具清单行（toolIndex() 返回；主输入框 @tool 候选源）。 */
export interface ToolIndexEntry {
  name: string
  description?: string
}

/** openRef() 结果：@file 引用点击打开（workspace 根解析后交 OS 默认应用）。 */
export interface OpenRefResult {
  ok: boolean
  path?: string
  error?: string
}
