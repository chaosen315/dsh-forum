// @deepseek-ai/dsh-forum-kb — host 平面：forumKb 服务（@Remote 方法，scope-less 直连）。
// client 经 api-gateway 调 remote.forumKb.*；这里是被调用方。
// 数据通路：读走 host `fs`（posts/*.md），写/搜索走 `subprocess` 直接 spawn node 跑 tools/kb.js（Windows 无 bash）。
//
// typert 构建要点（约束来自 @deepseek-ai/dsh-typert-generator 分析器）：
// - 类 JSDoc `@typert service forumKb`：生成 service model（key = forumKb）。
// - Remote 方法一律【不带】 agent/scope 参数 → direct 调用（进 TypertRemoteMap，
//   client 侧得到 remote.forumKb.list() … 直连面，无需 session 上下文）。
// - 边界类型从 ./types 导出（分析器要求非根子路径）。
// - `static inject`：fs/subprocess 是 host 基座服务；agents/agentPresets/agentDefaultModel
//   是 base/web 组合的会话治理服务（ADR-0003 @ 真调度的派出原语，用法对齐 dsh-headless
//   的 agent 创建 + dsh-host-apiproxy 的 session.create preset 组装路径）。
//
// v0.4.0（ADR-0003）：新增 @Remote dispatch —— @ 即真调度。human 在 thread 里 @<author>
// 发评论后，client 显式调 dispatch；host 侧 (post, author) → sessionId 映射（存
// <workspace>/.forum-kb/dispatch-sessions.json，【不进 KB】，守住「没有 session 概念」）
// 解析目标会话：live → followup 递消息；在案未活 → resume（冷恢复）；无案 → create
// （部署默认 preset 组成 + agentDefaultModel 选型）。派活消息（T1 纪律）= 投影
// {summary, query, current, 本 thread} + 触发评论 + kb 工具指引，不多不少——之后的
// 展开全靠被派 agent 主动 pull。
//
// v0.4.1：dispatch 后补 workspace.attachSession（对齐 dsh-host-apiproxy session.create 的
// 记账步骤），被派会话才出现在侧边栏 workspace 分组（否则永远落 Ungrouped，且重启不自愈——
// workspace bootstrap 仅首启跑）；cwd 改用 workspace.path 规范形，旧版为正斜杠写法漂移。
//
// v0.4.2：KB 根不再绑死单一 cwd 约定（从别处启动 dsh 就找不到知识库）。解析顺序（首个含
// kb.sqlite 或 posts/ 的候选胜出）：config.kbRoot（cordis 行）→ FORUM_KB_ROOT（环境变量）
// → <workspaceRoot>/forum-kb → <cwd>/forum-kb；全落空时报错携带候选与修复指引（分发友好）。
//
// v0.4.3（v0.4b，thread a6.c3 立案修复）：派活投影去重——多轮 @ 不再全量重发（O(N²) 膨胀）。
// - live（上下文里已有上次投影）只递增量：水位之后的新评论 + 触发评论 + 一行「kb_view 可重读」；
//   created/resumed（冷）仍发全量四段——重启后首 @ 不丢阅读边界。水位失效（换 thread/评论
//   找不到）自动回退全量重锚一次，随后水位重立。
// - 水位：映射条目升级 {post/author} → {sessionId, watermark}（最后已递评论 id；同一映射
//   文件，仍在 KB 之外）。旧格式纯 sessionId 字符串照读，落盘统一升级——向后兼容。
// - thread 渲染去重：触发评论不再在列表里重复出现（有专段）；被派 agent 本人回执折叠为
//   一行指针（自见排除——它们本就长在会话上下文里，重复最重）。
//
// v0.5.0（帖子 hash-post-id-and-forum-nav）：① createPost 的 id 改可选——省略时 kb 侧生成
// 哈希 id，走 `post --json` 解析出真实 id 填进 WriteResult.id（client 发帖后凭它打开新帖）；
// ② 新增 @Remote search（FTS，与 kb_search 同源：trigram + 短词 LIKE 回退），client 顶栏
// 搜索框消费；③ list() 补 tags 字段（client 顶栏 tag 筛选用）。
//
// v0.6.0（帖子 434b349bae90，f0442aa0f3b3 P0 拆活）：① list() 补 pinned/pinnedScope/
// createdAt/updatedAt/answers/comments——读面是 posts/*.md frontmatter（render.js v0.6 起
// 写入），客户端置顶区 / new·active·top 排序 / 计数徽标消费；② 新增 @Remote pin（置顶/
// 取消置顶，scope global|tag 透传 tools/kb.js）；③ 新增 @Remote refs（反向索引投影，
// `kb refs <id> --json` 同源，client 详情页 refs 面板消费）。
//
// v0.7.0（帖子 c0b3317e45ac，ADR-0004 v2：@ 派活 × preset 对齐 × @ 实体引用）：
// ① preset 三层解析链——发派时显式选择（dispatch 目标携带 preset）> cordis 行
//   config.presetRoutes（author 小写归一 → preset id，部署者声明位）> 部署默认；
//   仅对 create 生效，resume 锚定会话既有组成（dispatch-sessions 会话记录经
//   sessionPersistence readRaw 扫 agent-preset/selected 事件 / header 兜底；
//   ADR-0003 §4「身份在会话历史中自然延续」的行为修正：部署默认变更不再波及旧会话冷恢复）。
// ② @Remote dispatchInfo——派活面只读投影：presets 名册（composer 二级菜单）+
//   targets 形状的发派前预览（三态 + 组成 + 模型，"能否完成任务"发派前可见）+
//   {post} 形状的在案投影（事后查证）。不入库，KB schema 零变更。
// ③ @Remote toolIndex——host 工具清单（tools.schemas() 全局视图投影，主输入框 @ 候选源）。
// ④ @Remote openRef——@file 引用点击打开：workspace 根相对路径解析（禁越界）后经
//   `cmd /c start` 交 OS 默认应用（与 chat tool-row openFile 同语义；host.openPath 通道）。
// ⑤ dispatch targets 归一：string | {name, preset} 双形状照收（旧 client 兼容）；
//   meta.agentPreset 记实际挂载的 preset id（落 header，resume 重建免费获得）。
//
// v0.8.0（帖子 d7427e6e7072，f0442aa0f3b3 P1 拆活：常用区 + 本地已读标记，零 schema）：
// 新增 @Remote dispatchSessions——dispatch-sessions.json 的全量只读投影（行形状复用
// InCaseRow；免 agentPreset 重查询，常用区只需 post/author/live）。client 列表页
// 「⭐ 常用」区 = 本地星标 ∪ 本投影推导的在案帖（个人位）；host 未重启端点缺席时
// client 退化为仅星标，不白屏（v0.5 起的降级纪律）。KB schema 零变更。
//
// v0.9.0（帖子 619789961961，ADR-0004 决策2 延伸：@ 派活权限选择缺口——D1 权限作发派
// 动作参数）：① dispatch targets 归一收 `permission?`（与 preset 同形的可选动作参数）；
// ② create 落地：新建会话后经 permissionPresets.set(session, 档名) 追加 permission/preset
//   + sandbox/mode + approval/policy 事件（pinInitialPermission 先种部署默认，随后覆盖）——
//   两旋钮都是会话持久事件，resume 自动恢复会话原档，与「live/resume 不换组成」同原则：
//   显式权限选择仅对 create 生效；③ dispatchInfo 增权限档名册（permissions，composer 权限
//   菜单数据源）+ preview 行 permission 面（created = 将落地档：显式选择 > 部署默认；
//   live/resumed = null + 在案不改档提示）；④ permissionPresets 为可选依赖（ctx.get）：
//   部署未挂面板时名册为空、显式选择报错，缺省路径行为与 v0.8 完全一致。KB schema 零变更。
import { randomUUID } from "node:crypto"
import { existsSync } from "node:fs"
import { createUserMessage } from "@deepseek-ai/dsh-llm"
import { installModelSelection } from "@deepseek-ai/dsh-agent"
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol"
import type { AnswerView, CommentView, DispatchInfoResult, DispatchOutcome, DispatchPreviewRow, DispatchRequest, DispatchTarget, InCaseRow, ModelFace, OpenRefResult, PermissionFace, PostSummary, PostView, PresetFace, RefsView, SearchHit, ToolIndexEntry, WriteResult, PostRef } from "./types.js"

// body 经 subprocess.spawn argv 传给 tools/kb.js 时，Windows 下 argv→命令行字符串
// 会损坏嵌入的双引号（尾部截断）。改走 --body-b64（base64 仅含 A-Za-z0-9+/=，argv 安全）。
function b64(s: string): string {
  return Buffer.from(s, "utf8").toString("base64")
}

// 派活映射条目（v0.4.3）：sessionId + 水位（该会话最后已递评论 id）。旧版（≤0.4.2）条目为
// 纯 sessionId 字符串——读取兼容（entrySession），落盘统一升级为新形状（saveMap）。
interface DispatchMapEntry {
  sessionId: string
  watermark?: string | null
}

/** 条目取 sessionId（兼容旧格式纯字符串）。 */
function entrySession(e: DispatchMapEntry | string | undefined): string | undefined {
  if (!e) return undefined
  return typeof e === "string" ? e : e.sessionId
}

/** 条目取水位（旧格式/缺失 = null：增量基线不可知，live 首轮按「全 thread 未递、本人回执除外」处理）。 */
function entryWatermark(e: DispatchMapEntry | string | undefined): string | null {
  return e && typeof e === "object" ? (e.watermark ?? null) : null
}

/** 剥离 undefined 值的键（浅层）。typert 网关在 schema 校验后还有 assertJsonValue：
 *  「undefined 值」不是 JSON-safe——schema 会放行 optional 字段的 undefined，但 JSON 安全
 *  检查直接抛 "business result failed boundary validation"（重启后核查轮坐实，dispatchInfo
 *  三路全炸的共同元素 = 每路都带的名册行 `name: row.name` 这类「键恒存在、值可 undefined」
 *  写法）。可空语义一律用 null（对齐 inCase 的 agentPreset/watermark），键缺失用本函数。 */
function compact<T extends Record<string, any>>(o: T): T {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(o)) {
    if (v !== undefined) out[k] = v
  }
  return out as T
}

// KB 数据根候选（分发友好：不写死机器路径），按优先级：
// 1. cordis 行 config.kbRoot —— 部署显式指定（profiles/<profile>/cordis.patch.yml 的 forum-kb 行）
// 2. 环境变量 FORUM_KB_ROOT —— 进程级显式指定
// 3. <sandboxPolicy.workspaceRoot>/forum-kb —— 部署约定：从含 forum-kb 的目录启动 dsh
// 4. <process.cwd()>/forum-kb —— 历史兜底
function kbRootCandidates(ctx: any, config: any): string[] {
  const norm = (p: string) => p.replace(/\\/g, "/")
  const out: string[] = []
  const cfgRoot = config && typeof config.kbRoot === "string" ? config.kbRoot.trim() : ""
  if (cfgRoot) out.push(norm(cfgRoot))
  const envRoot = process.env.FORUM_KB_ROOT
  if (envRoot && envRoot.trim()) out.push(norm(envRoot.trim()))
  const sp = ctx.get("sandboxPolicy")
  if (sp && sp.workspaceRoot) out.push(norm(String(sp.workspaceRoot)) + "/forum-kb")
  out.push(norm(process.cwd()) + "/forum-kb")
  return out
}

function resolveKbRoot(ctx: any, config: any): { root: string; tried: string[]; found: boolean } {
  const tried = kbRootCandidates(ctx, config)
  for (const c of tried) {
    if (existsSync(c + "/kb.sqlite") || existsSync(c + "/posts")) return { root: c, tried, found: true }
  }
  return { root: tried[0], tried, found: false }
}

/**
 * forum-kb host 服务（`ctx.forumKb`）：kb.sqlite 单一事实源 + 每帖 md 渲染的读写面。
 * @typert service forumKb
 */
export class ForumKbService extends TypertRemoteService {
  static inject = ["fs", "subprocess", "agents", "agentPresets", "agentDefaultModel", "workspaceRegistry"]

  private fs: any
  private subprocess: any
  private agents: any
  private presets: any
  private defaultModel: any
  private workspaces: any
  private kb: string
  private mapFile: string
  private kbTried: string[]
  private kbFound: boolean
  /** @author → preset id 显式映射（cordis 行 config.presetRoutes；键小写归一）。
   *  解析链中间层：发派显式选择 > 本表 > 部署默认（ADR-0004 决策2）。 */
  private routes: Record<string, string>
  /** 可选会话持久化（resume 组成锚定读会话记录用）；缺席 = 回退部署默认（行为同 v0.6）。 */
  private persistence: any
  /** 可选工具注册表（toolIndex 投影用）；缺席 = 空清单。 */
  private toolsReg: any
  /** 可选权限档服务（v0.9.0，部署 base 组合的 `permission` 行；缺席 = 权限选择不可用，
   *  显式选择报错、缺省路径照旧部署默认）。 */
  private perms: any

  constructor(ctx: any, config: any = {}) {
    super(ctx, "forumKb")
    this.fs = ctx.get("fs")
    this.subprocess = ctx.get("subprocess")
    this.agents = ctx.get("agents")
    this.presets = ctx.get("agentPresets")
    this.defaultModel = ctx.get("agentDefaultModel")
    this.workspaces = ctx.get("workspaceRegistry")
    this.persistence = ctx.get("sessionPersistence")
    this.toolsReg = ctx.get("tools")
    this.perms = ctx.get("permissionPresets")
    const routes: Record<string, string> = {}
    const raw = config && typeof config.presetRoutes === "object" && config.presetRoutes ? config.presetRoutes : {}
    for (const [k, v] of Object.entries(raw)) {
      const key = String(k).trim().toLowerCase()
      if (key && typeof v === "string" && v.trim()) routes[key] = v.trim()
    }
    this.routes = routes
    const resolved = resolveKbRoot(ctx, config)
    this.kb = resolved.root
    this.kbTried = resolved.tried
    this.kbFound = resolved.found
    // (post, author) → sessionId 映射：host 侧 storage，KB 之外（ADR-0003 决策2）——
    // 取 KB 根的同级 <root>/.forum-kb/，跟着解析结果走。
    this.mapFile = this.kb.replace(/\/forum-kb$/, "") + "/.forum-kb/dispatch-sessions.json"
  }

  /** 路由表查询（author 小写归一；未命中 = undefined → 上层落部署默认）。 */
  private routeOf(target: string): string | undefined {
    return this.routes[String(target ?? "").trim().toLowerCase()]
  }

  /** KB 数据根缺失的报错（分发友好）：携带解析候选与两条修复路径。 */
  private kbUnavailableError(): Error {
    return new Error(
      "forum-kb 数据目录未找到（按序尝试：" + this.kbTried.join(" → ") +
        "）。修复任一即可：① cordis.patch.yml 的 forum-kb 行加 config.kbRoot，或设环境变量 FORUM_KB_ROOT，" +
        "指向 forum-kb 目录（须含 kb.sqlite 与 posts/）；② 从 forum-kb 所在目录启动 dsh。",
    )
  }

  private parseFm(text: string) {
    const out: Record<string, string> = {}
    const lines = text.split("\n")
    if (lines[0] !== "---") return out
    for (let i = 1; i < lines.length && lines[i] !== "---"; i++) {
      const idx = lines[i].indexOf(":")
      if (idx > 0) out[lines[i].slice(0, idx).trim()] = lines[i].slice(idx + 1).trim()
    }
    return out
  }

  private async runKb(args: string[]): Promise<string> {
    if (!this.kbFound) throw this.kbUnavailableError()
    const nodePath = await this.subprocess.resolveExecutable("node")
    const handle = this.subprocess.spawn({
      argv: [nodePath, "tools/kb.js"].concat(args),
      cwd: this.kb,
      stdio: { stdin: "ignore", stdout: { maxBytes: 500000 }, stderr: { maxBytes: 500000 } },
      graceMs: 5000,
    })
    const outcome = await handle.done
    const text = handle.collected.stdout ? handle.collected.stdout.readFrom(0).text : ""
    const err = handle.collected.stderr ? handle.collected.stderr.readFrom(0).text : ""
    if (outcome.exitCode !== 0) throw new Error(err || text || ("exit " + outcome.exitCode))
    return text
  }

  /** 帖子列表（summary 层：不装正文，阅读边界原则）。v0.5.0 起带 tags（client 顶栏筛选）；
   *  v0.6.0 起带 pinned/pinnedScope/createdAt/updatedAt/answers/comments（置顶区/排序/徽标）。 */
  @Remote("list")
  async list(): Promise<PostSummary[]> {
    if (!this.kbFound) throw this.kbUnavailableError()
    const dir = await this.fs.resolve(this.kb + "/posts")
    const entries = await this.fs.listDir(dir)
    const posts: PostSummary[] = []
    for (const e of entries) {
      if (e.type !== "file" || !e.name.endsWith(".md")) continue
      const text = await this.fs.readText(e.target)
      const fm = this.parseFm(text)
      // frontmatter tags 行由 render 写成 `[a, b]`（非严格 JSON，空格容忍）——先试 JSON 再退括号剥离
      let tags: string[] = []
      try {
        const v = JSON.parse(fm.tags ?? "[]")
        if (Array.isArray(v)) tags = v.map(String)
      } catch {
        tags = String(fm.tags ?? "").replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean)
      }
      posts.push({
        id: e.name.slice(0, -3),
        title: fm.title || e.name,
        state: fm.state || "",
        current: fm.current || null,
        assigned: fm.assigned || null,
        entry: fm.entry === "true" ? 1 : 0,
        pinned: fm.pinned === "true" ? 1 : 0,
        pinnedScope: fm.pinned_scope ? fm.pinned_scope : null,
        createdAt: fm.created_at || null,
        updatedAt: fm.updated_at || null,
        answers: Number(fm.answers ?? 0) || 0,
        comments: Number(fm.comments ?? 0) || 0,
        summary: fm.summary || "",
        tags,
      })
    }
    posts.sort((a, b) => (a.id < b.id ? -1 : 1))
    return posts
  }

  /** 读整帖 md（显式动作：展开某帖，非默认装载）。 */
  @Remote("read")
  async read(id: string): Promise<{ id: string; markdown: string }> {
    if (!this.kbFound) throw this.kbUnavailableError()
    const t = await this.fs.resolve(this.kb + "/posts/" + id + ".md")
    return { id, markdown: await this.fs.readText(t) }
  }

  /** 整帖结构化投影（forum-kb-web-ui 读面升级）：post 元数据 + query + answers
   *  （source 软引用链 / 是否 current / 每条 answer 的评论线程），形状对齐 ADR-0002 §3。
   *  与写路径同通路：spawn node tools/kb.js view <id>（SQLite 单一事实源，非 md 渲染物）。 */
  @Remote("view")
  async view(id: string): Promise<PostView> {
    const text = await this.runKb(["view", id])
    try {
      return JSON.parse(text) as PostView
    } catch {
      throw new Error("kb view 返回非 JSON: " + text.slice(0, 200))
    }
  }

  /** FTS 搜索（v0.5.0，client 顶栏搜索框消费）：与 kb_search 同源——≥3 字走 trigram
   *  FTS5，短词自动 LIKE 回退。term 缺失/空白返回空数组；返回行带 summary 供列表渲染。 */
  @Remote("search")
  async search(req: { term: string }): Promise<SearchHit[]> {
    const term = String((req && req.term) ?? "").trim()
    if (!term) return []
    const text = await this.runKb(["search", term, "--json"])
    try {
      const rows = JSON.parse(text)
      return Array.isArray(rows) ? (rows as SearchHit[]) : []
    } catch {
      throw new Error("kb search 返回非 JSON: " + text.slice(0, 200))
    }
  }

  /** 乐观认领（设 assigned = 自己）。 */
  @Remote("claim")
  async claim(req: { post: string; as: string }): Promise<WriteResult> {
    return this.write(["claim", req.post, "--as", req.as])
  }

  /** 新增 answer（交接/巩固），并移动 current。 */
  @Remote("answer")
  async answer(req: { post: string; as: string; source: string; rel: string; body: string }): Promise<WriteResult> {
    return this.write(["answer", req.post, "--as", req.as, "--source", req.source, "--rel", req.rel, "--body-b64", b64(req.body)])
  }

  /** 在某 answer 评论区新增评论（草稿面）。 */
  @Remote("comment")
  async comment(req: { post: string; as: string; on: string; body: string }): Promise<WriteResult> {
    return this.write(["comment", req.post, "--as", req.as, "--on", req.on, "--body-b64", b64(req.body)])
  }

  /** 修改帖子状态（active/waiting/done/archived）。 */
  @Remote("state")
  async setState(req: { post: string; state: string }): Promise<WriteResult> {
    return this.write(["state", req.post, "--state", req.state])
  }

  /** 置顶/取消置顶（v0.6.0 P0）。set on|off；scope 缺省 = global（全局置顶），tag 名 = tag 内置顶。 */
  @Remote("pin")
  async pin(req: { post: string; set: string; scope?: string }): Promise<WriteResult> {
    const args = ["pin", req.post, "--set", req.set]
    if (req.scope) args.push("--scope", req.scope)
    return this.write(args)
  }

  /** 反向引用投影（v0.6.0 P0，详情页 refs 面板消费）：入向被引用 + 出向 depends_on，
   *  与 `kb refs <id> --json` 同源（tools/kb.js collectRefs 双通道：depends_on + [[token]]）。 */
  @Remote("refs")
  async refs(req: { id: string }): Promise<RefsView> {
    const text = await this.runKb(["refs", req.id, "--json"])
    try {
      return JSON.parse(text) as RefsView
    } catch {
      throw new Error("kb refs 返回非 JSON: " + text.slice(0, 200))
    }
  }

  /** 全量在案会话投影（v0.8.0 P1，client 列表页「⭐ 常用」区数据源）：dispatch-sessions.json
   *  的只读快照，行形状复用 InCaseRow。与 dispatchInfo({post}) 的区别：不按帖过滤、不做
   *  agentPreset 回查（常用区只需 post/author/live，省每行一次 sessionPersistence 读）。
   *  agentPreset 恒 null（JSON-safe，语义=未查而非无）。键坏行（无 "/" 或空 sessionId）跳过。 */
  @Remote("dispatchSessions")
  async dispatchSessions(): Promise<InCaseRow[]> {
    const map = await this.loadMap()
    const rows: InCaseRow[] = []
    for (const [key, entry] of Object.entries(map)) {
      const slash = key.indexOf("/")
      if (slash <= 0) continue
      const sessionId = entrySession(entry)
      if (!sessionId) continue
      rows.push({
        post: key.slice(0, slash),
        author: key.slice(slash + 1),
        sessionId,
        live: !!(this.agents && this.agents.get(sessionId)),
        agentPreset: null,
        watermark: entryWatermark(entry),
      })
    }
    return rows
  }

  /** 派活面投影（v0.7.0，ADR-0004，只读无副作用不入库）：
   *  - 带 targets：发派前预览——逐 target 三态 + 组成面（解析链可视化）+ 模型（仅 created）
   *    + 「选择仅对新建生效」提示；preset 面 broken 提前暴露，发派前可改。
   *  - 不带 targets：{post} 在案投影 + 全量 preset 名册（composer 二级菜单数据源一次带走）。 */
  @Remote("dispatchInfo")
  async dispatchInfo(req: { post?: string; on?: string; targets?: Array<string | DispatchTarget> }): Promise<DispatchInfoResult> {
    const roster: PresetFace[] = await this.presets.list().then((rows: any[]) =>
      (rows || []).map((r: any) => compact({ id: r.id, name: r.name, description: r.description, broken: r.broken, trust: r.trust })),
    ).catch(() => [] as PresetFace[])
    const result: DispatchInfoResult = { presets: roster, permissions: this.permRoster() }
    const post = String((req && req.post) ?? "")
    const rawTargets = req ? req.targets : undefined
    const targetList: Array<string | DispatchTarget> = Array.isArray(rawTargets) ? rawTargets : []
    if (targetList.length) {
      if (!post) throw new Error("dispatchInfo 预览需要 post")
      const map = await this.loadMap()
      let model: ModelFace | undefined
      try {
        const s = this.defaultModel ? this.defaultModel.currentSelection() : null
        if (s) model = compact({ provider: String(s.provider ?? ""), model: String(s.model ?? ""), reasoningEffort: (s as any).reasoningEffort })
      } catch { /* 选型缺席则不显示模型 */ }
      const preview: DispatchPreviewRow[] = []
      for (const t of targetList) {
        const name = typeof t === "string" ? t : String((t && (t as DispatchTarget).name) ?? "")
        if (!name) continue
        const chosen = typeof t === "object" && t && typeof (t as DispatchTarget).preset === "string" && (t as DispatchTarget).preset!.trim() ? (t as DispatchTarget).preset!.trim() : undefined
        const route = this.routeOf(name)
        const known = entrySession(map[post + "/" + name])
        const liveAgent = known && this.agents ? this.agents.get(known) : undefined
        const action: "live" | "resumed" | "created" = liveAgent ? "live" : known ? "resumed" : "created"
        let preset: PresetFace | null = null
        let note: string | undefined
        if (action === "live") {
          let livePreset: string | undefined
          try { if (liveAgent && this.presets.composedPreset) livePreset = this.presets.composedPreset((liveAgent as any).ctx ?? liveAgent) } catch { /* 组成读取失败则回会话记录 */ }
          preset = await this.presetFace(livePreset ?? (known ? await this.recordedPreset(known) : null) ?? route ?? undefined)
          if (chosen || route) note = "在案目标不换组成：显式选择/路由仅对新建生效"
        } else if (action === "resumed") {
          preset = await this.presetFace(known ? await this.recordedPreset(known) : null)
          if (chosen || route) note = chosen ? "该目标在案：冷恢复沿用原组成，所选 preset 仅对新建生效" : "该目标在案：冷恢复沿用原组成，presetRoutes 路由仅对新建生效"
        } else {
          preset = await this.presetFace(chosen ?? route ?? (await this.presets.resolve()).id)
        }
        // 权限档面（v0.9.0）：created = 将落地档（显式选择 > 部署默认）；live/resumed =
        // null（沿会话既有档——sandbox/mode、approval/policy 是会话持久事件，不改）。
        const chosenPerm = typeof t === "object" && t && typeof (t as DispatchTarget).permission === "string" && (t as DispatchTarget).permission!.trim() ? (t as DispatchTarget).permission!.trim() : undefined
        let permission: PermissionFace | null = null
        if (action === "created" && this.perms) {
          const pn = chosenPerm ?? (typeof this.perms.defaultPreset === "string" ? this.perms.defaultPreset : "")
          permission = pn ? this.permissionFace(pn) : null
        }
        else if (action !== "created" && chosenPerm && this.perms) note = (note ? note + "；" : "") + "该目标在案：权限沿会话既有档，所选权限仅对新建生效"
        const row: DispatchPreviewRow = { target: name, action, route: chosen ? "selection" : route ? "routes" : "default", preset, permission }
        if (action === "created" && model) row.model = model
        if (known) row.sessionId = known
        if (note) row.note = note
        preview.push(compact(row))
      }
      result.preview = preview
    } else if (post) {
      const map = await this.loadMap()
      const rows: InCaseRow[] = []
      for (const [key, entry] of Object.entries(map)) {
        const slash = key.indexOf("/")
        if (slash <= 0) continue
        const rowPost = key.slice(0, slash)
        if (rowPost !== post) continue
        const sessionId = entrySession(entry)
        if (!sessionId) continue
        const liveAgent = this.agents ? this.agents.get(sessionId) : undefined
        let agentPreset: string | null | undefined
        if (liveAgent) { try { if (this.presets.composedPreset) agentPreset = this.presets.composedPreset((liveAgent as any).ctx ?? liveAgent) } catch { /* 回会话记录 */ } }
        if (!agentPreset) agentPreset = await this.recordedPreset(sessionId)
        rows.push({ post: rowPost, author: key.slice(slash + 1), sessionId, live: !!liveAgent, agentPreset: agentPreset ?? null, watermark: entryWatermark(entry) })
      }
      result.inCase = rows
    }
    return result
  }

  /** host 工具清单（v0.7.0，主输入框 @tool 候选源）：tools.schemas() 全局视图投影，
   *  只取 name/description（模型面白名单字段），描述截断 240 字。注册表缺席 → 空清单。 */
  @Remote("toolIndex")
  async toolIndex(): Promise<ToolIndexEntry[]> {
    if (!this.toolsReg || typeof this.toolsReg.schemas !== "function") return []
    try {
      const rows = this.toolsReg.schemas()
      return (Array.isArray(rows) ? rows : [])
        .map((r: any) => compact({ name: String((r && r.name) ?? ""), description: r && typeof r.description === "string" ? r.description.slice(0, 240) : undefined }))
        .filter((r: ToolIndexEntry) => r.name)
        .sort((a: ToolIndexEntry, b: ToolIndexEntry) => (a.name < b.name ? -1 : 1))
    } catch { return [] }
  }

  /** @file 引用点击打开（v0.7.0，ADR-0004）：workspace 根相对路径 → OS 默认应用。
   *  根 = KB 根的父目录（与 dispatch cwd 同源）；`..` 越界拒绝。打开通道 = explorer.exe：
   *  自检修缺——原用 `cmd /c start forum-kb <abs>`，但 start 把首个【未加引号】token 当命令
   *  执行（实测 "cannot find the file forum-kb"），成功路径必挂；explorer.exe <file|dir> 走
   *  shell 关联打开（与双击同义），且退出码成功也常为 1 → 存在性前置校验，退出码不判失败。 */
  @Remote("openRef")
  async openRef(req: { path: string }): Promise<OpenRefResult> {
    const root = this.kb.replace(/\/forum-kb$/, "")
    const rel = String((req && req.path) ?? "").trim().replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "")
    if (!rel) return { ok: false, error: "路径为空" }
    const segs: string[] = []
    for (const seg of rel.split("/")) {
      if (!seg || seg === ".") continue
      if (seg === "..") {
        if (!segs.length) return { ok: false, error: "路径越界 workspace 根：" + rel }
        segs.pop()
        continue
      }
      segs.push(seg)
    }
    if (!segs.length) return { ok: false, error: "路径为空" }
    const abs = root + "/" + segs.join("/")
    if (!existsSync(abs)) return { ok: false, error: "文件不存在：" + abs }
    try {
      const exe = await this.subprocess.resolveExecutable("explorer")
      const handle = this.subprocess.spawn({
        argv: [exe, abs],
        stdio: { stdin: "ignore", stdout: { maxBytes: 10000 }, stderr: { maxBytes: 10000 } },
        graceMs: 5000,
      })
      await handle.done
      // explorer.exe 退出码不可靠（成功常返 1）：存在性已前置校验，退出码不判失败。
      return { ok: true, path: abs }
    } catch (e) {
      return { ok: false, error: String((e && (e as Error).message) || e) }
    }
  }

  /** 会话既有组成（ADR-0004 决策2/5）：读持久化记录的最新 preset——自尾向前扫
   *  agent-preset/selected 事件（blank 期换配有记录），缺省回 header 的创建时值。
   *  readRaw 不支持/读失败 → null（调用方回退部署默认）。只读，不触发恢复。 */
  private async recordedPreset(sessionId: string): Promise<string | null> {
    const p = this.persistence
    if (!p || typeof p.readRaw !== "function") return null
    try {
      const raw = await p.readRaw(sessionId)
      if (!raw || typeof raw.content !== "string") return null
      const lines = raw.content.split("\n")
      const pick = (ev: any): string | undefined => {
        const data = ev && typeof ev.data === "object" && ev.data ? ev.data : ev
        const v = data ? data.agentPreset : undefined
        return typeof v === "string" && v ? v : undefined
      }
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].indexOf("agent-preset/selected") < 0) continue
        try {
          const ev = JSON.parse(lines[i])
          // 直接命中（信封 {type, seq, data:{agentPreset}}）；否则可能是 chunk 打包行
          //（packChunkRuns 把多个事件塞进 events 数组）——自尾扫数组内成员。
          const direct = pick(ev)
          if (direct) return direct
          if (ev && Array.isArray(ev.events)) {
            for (let j = ev.events.length - 1; j >= 0; j--) {
              const inner = ev.events[j]
              if (inner && typeof inner === "object" && String(inner.type ?? "").indexOf("agent-preset/selected") >= 0) {
                const v = pick(inner)
                if (v) return v
              }
            }
          }
        } catch { /* 坏行跳过 */ }
      }
      let header: any = raw.header
      if (!header && lines.length) { try { header = JSON.parse(lines[0]) } catch { /* 首行非 JSON */ } }
      const hp = header && typeof header === "object" ? header.agentPreset : undefined
      return typeof hp === "string" && hp ? hp : null
    } catch { return null }
  }

  /** 权限档面（v0.9.0）：档名 → {name, sandbox, approval, description}。未知档名给
   *  description 标错以便预览诚实标红；permissionPresets 缺席返回 null。 */
  private permissionFace(name: string): PermissionFace | null {
    if (!this.perms || typeof this.perms.resolve !== "function") return null
    try {
      const spec = this.perms.resolve(name)
      return compact({
        name,
        sandbox: spec && typeof spec.sandbox === "string" ? spec.sandbox : undefined,
        approval: spec && typeof spec.approval === "string" ? spec.approval : undefined,
        description: spec && typeof spec.description === "string" ? spec.description : undefined,
      })
    } catch (e) {
      return { name, description: "未知权限档：" + String((e && (e as Error).message) || e) }
    }
  }

  /** 权限档名册（v0.9.0，composer 权限菜单数据源）：permissionPresets 名表投影，
   *  带两旋钮值（sandbox/approval）供预览透明。服务缺席 → 空数组（client 菜单不出现权限区）。
   *  v0.9.2 勘误：`names` 在 PermissionPresetService 上是 getter（返回 string[]）不是方法——
   *  初版用 `typeof names !== "function"` 当守卫恒真 → 名册恒空、权限区永不出现（真机复测坐实）。 */
  private permRoster(): PermissionFace[] {
    if (!this.perms) return []
    try {
      const raw = (this.perms as any).names
      const list: string[] = typeof raw === "function" ? raw.call(this.perms) : Array.isArray(raw) ? raw : []
      const out: PermissionFace[] = []
      for (const n of list) {
        const face = this.permissionFace(String(n))
        if (face) out.push(face)
      }
      return out
    } catch { return [] }
  }

  /** preset 名册面（按 id 查元数据；未知 id 给 broken 面以便预览诚实标红）。 */
  private async presetFace(id: string | null | undefined): Promise<PresetFace | null> {    if (!id) return null
    try {
      const roster = await this.presets.list()
      const row = (roster || []).find((r: any) => r && r.id === id)
      if (!row) return { id, broken: "未知 preset id（名册无此行）" }
      return compact({ id: row.id, name: row.name, description: row.description, broken: row.broken, trust: row.trust })
    } catch {
      return { id, broken: "名册读取失败" }
    }
  }

  /** 新建帖子（发起任务）。v0.5.0：id 改可选——省略时 kb 侧生成哈希 id（帖子标识不再
   *  依赖人工命名 slug）；走 `post --json` 并把生成的 id 填进 WriteResult.id。
   *  dependsOn 为跨帖引用索引（可选）。 */
  @Remote("post")
  async createPost(req: { id?: string; title: string; author: string; tag: string; summary: string; body: string; dependsOn?: PostRef[] }): Promise<WriteResult> {
    const args = ["post"]
    const explicitId = String((req.id ?? "")).trim()
    if (explicitId) args.push(explicitId)
    args.push("--title", req.title, "--author", req.author, "--tag", req.tag, "--summary", req.summary, "--body-b64", b64(req.body), "--json")
    if (req.dependsOn && req.dependsOn.length) args.push("--depends-on-b64", b64(JSON.stringify(req.dependsOn)))
    const r = await this.write(args)
    if (r.ok && r.text) {
      try {
        const parsed = JSON.parse(r.text)
        if (parsed && typeof parsed.id === "string") r.id = parsed.id
      } catch { /* 解析失败不致命：text 仍含 ✓ 行 */ }
    }
    return r
  }

  /** 派活（@ 调度，ADR-0003 + ADR-0004 v0.7.0）：把触发评论递给各 @target 的会话。
   *  解析顺序：映射在案且 live → followup（live，v0.4.3 起只递增量）；在案未活 → resume
   *  （冷恢复，组成锚会话既有记录，发全量阅读边界）；无案 → create（组成 = 目标显式选择 >
   *  config.presetRoutes > 部署默认；模型 = 部署默认选型，发全量）。
   *  targets 元素 string（旧版）或 {name, preset}（v0.7.0 显式选择）双形状照收。
   *  逐 target 出结果，不抛。 */
  @Remote("dispatch")
  async dispatch(req: DispatchRequest): Promise<DispatchOutcome[]> {
    const view = await this.view(req.post)
    const answer: AnswerView | undefined = view.answers.find((a) => a.id === req.on)
    if (!answer) throw new Error("thread 所在 answer 不存在：" + req.on)
    if (!this.agents) throw new Error("agents 服务不可用（host 组合缺会话治理平面）")
    const targets: DispatchTarget[] = (Array.isArray(req.targets) ? req.targets : [])
      .map((t): DispatchTarget => {
        if (typeof t === "string") return { name: t }
        const name = String((t && (t as DispatchTarget).name) ?? "")
        const preset = t && typeof (t as DispatchTarget).preset === "string" ? (t as DispatchTarget).preset!.trim() : ""
        const permission = t && typeof (t as DispatchTarget).permission === "string" ? (t as DispatchTarget).permission!.trim() : ""
        return { name, preset: preset || undefined, permission: permission || undefined }
      })
      .filter((t) => t.name)
    const map = await this.loadMap()
    const outcomes: DispatchOutcome[] = []
    for (const target of targets) {
      outcomes.push(await this.dispatchOne(target, req, view, answer, map))
    }
    try {
      await this.saveMap(map)
    } catch {
      /* 映射写盘失败不回滚派活：最坏后果是下次冷恢复变新建。 */
    }
    return outcomes
  }

  private async dispatchOne(target: DispatchTarget, req: DispatchRequest, view: PostView, answer: AnswerView, map: Record<string, DispatchMapEntry | string>): Promise<DispatchOutcome> {
    const name = target.name
    const key = req.post + "/" + name
    try {
      // 权限选择前置校验（v0.9.0）：显式选档但部署未挂 permissionPresets → 快速失败，
      // 不创建会话（避免「会话建了但权限没落实」的半态）。
      if (target.permission && !(this.perms && typeof this.perms.set === "function")) {
        return { target: name, ok: false, error: "permissionPresets 服务不可用（部署未挂 permission 面板），无法落实所选权限档：" + target.permission }
      }
      const selection = this.defaultModel ? this.defaultModel.currentSelection() : null
      const agentOptions = selection ? { provider: selection.provider, model: selection.model } : undefined
      // 组成解析（ADR-0004 v0.7.0，仅 create 生效）：目标显式选择 > 路由表 > 部署默认。
      const chosen = target.preset ?? this.routeOf(name)
      const entry = map[key]
      const known = entrySession(entry)
      const watermark = entryWatermark(entry)
      const cwdCandidate = this.kb.replace(/\/forum-kb$/, "")
      let agent = known ? this.agents.get(known) : undefined
      let action: "created" | "resumed" | "live" = "live"
      let sessionId = known
      let presetId: string | undefined
      let appliedPermission: string | undefined
      if (!agent && known) {
        // 冷恢复组成锚定（ADR-0004 决策2/5）：沿会话既有记录（header/最新 selected 事件），
        // 显式选择与路由表均不参与——「身份在会话历史中自然延续」；读不到回部署默认
        //（resumePresetId = undefined → mount 走部署默认，行为与 v0.6 一致）。
        const resumePresetId = (await this.recordedPreset(known)) ?? undefined
        const handle = await this.agents.resume({
          resumeSessionId: known,
          agentOptions,
          setup: async (agentCtx: any) => {
            if (selection) installModelSelection(agentCtx, { current: selection, assembled: void 0 })
            const mounted = await this.presets.mount(agentCtx, resumePresetId)
            presetId = mounted && typeof mounted.id === "string" ? mounted.id : resumePresetId
          },
        })
        agent = handle.agent
        sessionId = known
        action = "resumed"
      }
      if (!agent) {
        // 无案新建：presetId 先解析——meta.agentPreset 记实际值（落 header，后续 resume
        // 重建同一组成），setup 内按同一 id mount（broken preset 在此拒绝并回滚整个 create）。
        presetId = chosen ?? (await this.presets.resolve()).id
        sessionId = "session-" + randomUUID()
        const handle = await this.agents.create({
          sessionId,
          agentOptions,
          meta: { cwd: await this.canonicalCwd(cwdCandidate), agentPreset: presetId },
          setup: async (agentCtx: any) => {
            if (selection) installModelSelection(agentCtx, { current: selection, assembled: void 0 })
            await this.presets.mount(agentCtx, presetId)
          },
        })
        agent = handle.agent
        action = "created"
        // 权限落地（v0.9.0）：pinInitialPermission 已在 session/created 种部署默认档，
        // 此处显式选择时追加覆盖事件（permission/preset + sandbox/mode + approval/policy）。
        // 两旋钮均为会话持久事件 → 之后 resume 自动恢复该档。失败 = outcome 失败（会话已在，
        // error 里带 sessionId 供人工处理——静默吞掉比失败更危险：调用方以为在受权限内运行）。
        if (target.permission) {
          const session = (agent as any).session ?? (this.agents.get(sessionId as string) as any)?.session ?? undefined
          this.perms.set(session, target.permission)
          appliedPermission = target.permission
        }
      }
      // 侧栏归属记账（v0.4.1 修复）：官方 session.create 路径在创建后 workspace.attachSession
      // 把会话记入 workspace 名册；dispatch 直调 agents.create/resume 绕开了它 → 会话只落
      // 侧边栏 Ungrouped，且重启不自愈（workspace bootstrap 仅首启跑）。三态都补，幂等。
      await this.attachWorkspace(sessionId as string, cwdCandidate)
      // 增量判定（v0.4.3）：live 且水位可信 → 增量消息；冷（created/resumed）或水位失效
      // （换 thread / 水位评论不存在）→ 全量重锚。三态判定与 sessionId 解析不动（③④不回归）。
      const comments = answer.comments
      const wmIdx = watermark ? comments.findIndex((c) => c.id === watermark) : -1
      const mode: "full" | "incremental" = action === "live" && (!watermark || wmIdx >= 0) ? "incremental" : "full"
      const message = createUserMessage({
        content: [{ type: "text", text: this.dispatchMessage(name, req, view, answer, { mode, watermark, wmIdx }) }],
        source: { kind: "user" },
      })
      const queued = agent.followup(message)
      if (queued && typeof queued.catch === "function") queued.catch(() => {})
      // 水位前移到本 thread 最新评论（触发评论已随消息递到，视为已读底）；三态都记——
      // 冷恢复之后的首个 live 轮即可增量。本轮 thread 为空且无旧水位时保持 null（下次全量）。
      map[key] = { sessionId: sessionId as string, watermark: comments.length ? comments[comments.length - 1].id : (watermark ?? null) }
      return compact({ target: name, ok: true, sessionId, action, permission: appliedPermission })
    } catch (e) {
      return { target: name, ok: false, error: String((e && (e as Error).message) || e) }
    }
  }

  /** workspace.path 规范形（realpath 后反斜杠写法）：旧版直接传正斜杠 cwd，与名册/其它会话写法漂移。 */
  private async canonicalCwd(cwdCandidate: string): Promise<string> {
    if (!this.workspaces) return cwdCandidate
    try {
      const workspace = await this.workspaces.resolveByPath(cwdCandidate)
      if (workspace) return workspace.path as string
    } catch { /* resolve 失败按原样返回 */ }
    return cwdCandidate
  }

  /** 会话归属记账：workspace.attachSession 幂等；resolveByPath/attach 失败不回滚派活
   *  （最坏后果 = 会话落在侧边栏 Ungrouped）。 */
  private async attachWorkspace(sessionId: string, cwdCandidate: string): Promise<void> {
    if (!this.workspaces) return
    try {
      const workspace = await this.workspaces.resolveByPath(cwdCandidate)
      if (workspace) await workspace.attachSession(sessionId)
    } catch { /* 同上 */ }
  }

  /** 派活消息（T1 纪律，v0.4.3 增量修订）：
   *  - full（created/resumed 冷启动、或水位失效重锚）：投影 {summary, query, current, 本 thread}
   *    + 触发评论 + kb 工具指引；thread 列表跳过触发评论（有专段）、本人回执折叠为一行指针。
   *  - incremental（live 续聊）：只递水位之后的新评论 + 触发评论 + 一行重读指引——投影与
   *    已递评论不重发，之后的展开仍靠 agent 主动 pull。 */
  private dispatchMessage(target: string, req: DispatchRequest, view: PostView, answer: AnswerView, opts: { mode: "full" | "incremental"; watermark: string | null; wmIdx: number }): string {
    const comments = answer.comments
    // 触发评论识别：client 先写评论后 dispatch，正文原样透传——按 author+body 匹配（缺失时仅少一次去重，不出错）。
    const isTrigger = (c: CommentView) => c.author === req.author && c.body === req.body
    const isSelf = (c: CommentView) => c.author.toLowerCase() === target.toLowerCase()
    if (opts.mode === "incremental") {
      const fresh = comments.slice(opts.wmIdx >= 0 ? opts.wmIdx + 1 : 0).filter((c) => !isTrigger(c) && !isSelf(c))
      const baseline = opts.wmIdx >= 0
        ? `水位 ${opts.watermark} 之后`
        : "旧版映射无水位：全 thread 均按未递处理（本人回执与触发评论除外），下轮起恢复增量"
      return [
        `[forum-kb 派活·续] 你在帖子「${view.title}」（${view.id}）的 thread ${req.on} 下再次被 @${target} 点名。`,
        `本条只递增量（${baseline}）——阅读边界 {summary, query, current} 与此前已递评论已在你上下文，需要时 kb_view（post=${view.id}）重读全文。`,
        "",
        `## 本轮新增（${fresh.length} 条）`,
        fresh.length ? fresh.map((c) => `- ${c.id} · ${c.author}：${c.body}`).join("\n") : "（除触发评论外无新增——本次 @ 即续聊信号）",
        "",
        "## 触发评论",
        req.author + "：" + req.body,
        "",
        `（工作约定同首轮：身份 ${target}；kb_comment 回本 thread（post=${view.id}, on=${req.on}，草稿面）；有可复用资产再 kb_answer 巩固（source=${view.current ?? req.on}）。）`,
      ].join("\n")
    }
    const lines: string[] = []
    for (const c of comments) {
      if (isTrigger(c)) continue // 触发评论在下方专段，列表不重复
      if (isSelf(c)) {
        lines.push(`- ${c.id} · ${c.author}：（本人回执，折叠——kb_view 可读全文）`)
        continue
      }
      lines.push(`- ${c.id} · ${c.author}：${c.body}`)
    }
    const thread = lines.length ? lines.join("\n") : "（本 thread 暂无其他评论）"
    const cur = view.answers.find((a) => a.id === view.current)
    return [
      `[forum-kb 派活] 你在帖子「${view.title}」（${view.id}）的 thread ${req.on} 下被 @${target} 点名。`,
      "",
      "## 阅读边界（之后的展开靠你主动 pull：kb_view 可沿 source 追来路、kb_search/kb_query 找别的帖子）",
      "- summary：" + view.summary,
      "- query：" + (view.query ?? ""),
      `- current ${view.current ?? "-"}：${cur ? cur.body : "（暂无）"}`,
      `- 本 thread（${req.on} 评论区，${comments.length} 条）：`,
      thread,
      "",
      "## 触发评论",
      req.author + "：" + req.body,
      "",
      "## 工作约定（ADR-0003）",
      "- 身份：" + target + "（写 KB 时 author/`as` 用它）",
      `- 进展与结论先回本 thread：kb_comment（post=${view.id}, on=${req.on}，草稿面）；有可复用资产再 kb_answer 巩固（source=${view.current ?? req.on}，会移动 current）。`,
      "- human 会在此 thread 多轮 @ 你续聊：后续派活只递增量（新增评论 + 触发评论），投影与已递评论不重发；历史上下文留在你会话里，丢失背景时 kb_view 重读。",
      "- 只在本 thread 汇报，不要另开帖子；读多少、读到哪由你自己决定。",
    ].join("\n")
  }

  private async loadMap(): Promise<Record<string, DispatchMapEntry | string>> {
    try {
      const t = await this.fs.resolve(this.mapFile)
      const raw = JSON.parse(await this.fs.readText(t))
      return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
    } catch {
      return {}
    }
  }

  private async saveMap(map: Record<string, DispatchMapEntry | string>): Promise<void> {
    // 落盘统一升级：旧格式纯 sessionId 字符串 → {sessionId, watermark: null}（可读可升的验收点）。
    const norm: Record<string, DispatchMapEntry> = {}
    for (const [k, v] of Object.entries(map)) {
      const sessionId = entrySession(v)
      if (sessionId) norm[k] = { sessionId, watermark: entryWatermark(v) ?? null }
    }
    const t = await this.fs.resolve(this.mapFile)
    await this.fs.writeText(t, JSON.stringify(norm, null, 2))
  }

  private async write(args: string[]): Promise<WriteResult> {
    try {
      const text = await this.runKb(args)
      return { ok: true, text }
    } catch (e) {
      return { ok: false, error: String((e && (e as Error).message) || e) }
    }
  }
}

// Cordis Loader 实例化 default 导出的 Service 类（同 dsh-goal：`GoalService as default`）。
export default ForumKbService
