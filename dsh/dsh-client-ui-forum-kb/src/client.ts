// @deepseek-ai/dsh-client-ui-forum-kb — client（浏览器半）：论坛面板。
// 注册到 conversation.view 的「论坛」tab（list 槽，session scope，一次渲染一个 tab）。
//
// v0.3（帖子 forum-kb-l3-comment-sink 阶段1，human 三条目标）：
// 1. 顶部子导航栏（sticky）：品牌 › 「列表」面包屑（返回列表按钮从帖子头卡迁入）› 上下文
//    （列表态=帖数，详情态=标题+状态徽章）；右端动作区（列表态「＋ 发帖」/详情态「⟳ 刷新」）
//    + BUILD 版本戳，为后续按钮预留扩展位。
// 2. 写面统一为单输入框 composer：角色名默认 user（localStorage 记忆），评论=草稿（默认
//    模式）与「巩固为 answer」用分段控件切换，目标 answer 以芯片明示，Ctrl+Enter 发送。
// 3. 定点写：每张 answer 卡新增「评论」（把 composer 草稿挂到该 answer 下）与「引用」
//    （composer 转 answer 模式，source=该 answer + 引文预填 + rel 默认 取代/延伸）；列表页
//    「＋ 发帖」表单（slug 自动清洗 + 必填校验）走既有 @Remote post 写链路。
//
// v0.4（帖子 forum-kb-l3-comment-sink 阶段2，ADR-0003）：@ 即真调度——评论正文里的
// @author 高亮 + 输入补全（thread 作者置首位 = 默认配对，人类召唤可改配）；发送评论后
// 显式调 remote.forumKb.dispatch（动作级门限，仅 GUI 发起），回执芯片显示
// 新会话/冷恢复/现存会话。派活语义在 host 服务（投影+触发评论，T1 纪律）。
//
// v0.5（帖子 hash-post-id-and-forum-nav）：更像论坛的三件事——
// 1. 顶栏真常驻：根布局改 flex 列（SubNav + 筛选行 = 固定区，列表/详情 = 独立滚动区），
//    滚动再久导航也不走丢（sticky 保留作外层滚动兜底）。
// 2. 列表筛选行：搜索框（host v0.5 的 FTS search 端点，缺席时回退本地子串过滤）+
//    tag/state 下拉 + ★entry 开关，可组合，实时生效。
// 3. 发帖 id 可留空：host createPost 省略 id → kb 侧生成哈希 id（12 hex），回执带 id
//    直接打开新帖；显式 slug 照旧（字符集校验对齐 kb.js/validate.js）。
//
// v0.5.1（帖子 forum-kb-l3-comment-sink，v0.4b 配套）：回执行 live=「现存会话·续聊」，
// 芯片提示增量语义——host 0.4.3 起 live 派活只递增量（水位后新评论+触发评论），多轮 @
// 续聊不再全量重发投影。BUILD 戳随版本换新（浏览器载入新 bundle 的判别标记）。
//
// v0.5.2（帖子 hash-post-id-and-forum-nav 追加）：answer/query/评论正文改 GitHub 风格
// markdown 渲染——marked（GFM 即默认：表格/任务清单/删除线/自动链接）+ DOMPurify 消毒。
// 选型记录：react-markdown/remark-gfm 首版曾打挂 loader——其 unified/vfile 生态顶层
// import node:* 内建模块，platform:'browser' 下 rolldown 留成外部 require，浏览器模块表
// 无此种子（与 zod 无关，zod 4.4.3 本身干净）；marked+dompurify 为零依赖纯浏览器库，
// 从根上避开该类风险。@mention 高亮与外链加固在消毒后的 DOM 文本节点上做；正文整段
// 单次渲染（不再按空行切分，围栏代码块里的空行不再被拆断）。构建后必跑
// 「无 require("node:*)」门禁。
//
// v0.6.0（帖子 434b349bae90，f0442aa0f3b3 P0 拆活，对标 Reddit/Discourse 三件套）：
// 1. 置顶区：列表顶部「📌 置顶」分组（全局在前、tag 内在后），行卡带 📌 徽标 + 琥珀左缘；
//    详情页头卡显示置顶徽标 + 一键 置顶/取消（global；tag 级走 CLI/tools）。数据 =
//    list() 的 pinned/pinnedScope（host 未重启时字段缺席 → 置顶区不出现，不白屏）。
// 2. 排序切换：筛选行加「排序: 默认/最新/活跃/热度」（new=createdAt / active=updatedAt /
//    top=answers+comments，客户端本地排序；host 未重启缺字段时退回 id 序）。
// 3. refs 反向索引面板：详情页头卡下方「REFS」卡——入向被引用（点行跳帖）+ 出向 depends_on
//    （post 可跳、doc 展示）。数据 = @Remote refs(id)（host 未重启时 typeof 探测缺席不渲染）。
//    Discourse back-links 同构（research-forum-parity §2.6：对标差距最小、收益最直接）。
//
// v0.2（帖子 forum-kb-web-ui）：读面 = remote.forumKb.view(id) 结构化投影（ADR-0002 §3），
// host 未带 view / 调用失败时回退 read(id) markdown 纯文本——面板任何时刻不白屏；
// normalizeView 容忍字段漂移。写面 b64 修复已并入。
//
// v0.7.0（帖子 c0b3317e45ac，ADR-0004 v2：@ 派活 × preset 对齐 × @ 实体引用）：
// 1. preset 二级选择（BQ3）：composer 的「将派活」芯片升级为可点——每 target 可展开二级
//    preset 菜单（数据 = dispatchInfo 的 presets 名册，标注 name/description/broken）；
//    选择作 dispatch 请求参数（targets {name, preset}），正文保持 @author 纯净。
//    解析链 = 显式选择 > config.presetRoutes > 部署默认；仅 create 生效（host 侧裁定）。
// 2. 发派前预览：mentions/presetSel 变化防抖拉 dispatchInfo 预览——三态 + 组成 + 模型 +
//    「选择仅对新建生效」提示，发送前可见可改（BQ2 附带：预览底座 = 同一端点）。
// 3. 头卡在案区：open(id) 并行拉 dispatchInfo({post}) 在案投影——「在案 @author · 续聊/冷」
//    芯片（title=sessionId+preset），事后可查证（透明度轻展示，KB 零变更）。
// 4. @ 实体引用（BQ1/BQ4）：词表 = 裸 @author（派活不变）+ @post:<id> / @file:<workspace
//    相对路径> / @tool:<名>（纯指针，永不派活——parseMentions 排除带前缀 token）。渲染：
//    answer/query/评论正文中高亮为格式化 token；@post 点击论坛内跳转；@file 点击经
//    openRef（host 解析 workspace 根 → OS 默认应用）；@tool 悬停显示描述。缺失引用降级普通文本。
// 5. 主输入框 @ 候选源（ADR-0004 决策4）：apply 里经 ctx.inputTriggers.register 注册
//    forum-kb @ source（帖子/工具/作者候选；@file 交由随部署的 ui-reference 统一源，不重复
//    建设）；选中以 ReferenceInsert 芯片入 draft，发送时 codec 展开指针文本（kb_view 自读
//    指引，不装内容——主动读不被动灌）。触发服务缺席时静默降级（不注册）。
//
// v0.8.0（帖子 d7427e6e7072，f0442aa0f3b3 P1 拆活：常用区 + 本地已读标记，零 schema）：
// 1. 常用区（research-forum-parity §2.3 v1 落法）：列表「📌 置顶」区之下新增「⭐ 常用」分组
//    ——成员 = 本地星标（localStorage forum-kb:stars，个人位）∪ dispatch 在案帖（@Remote
//    dispatchSessions 全量投影推导；host 未重启端点缺席时自动降级为仅星标，不白屏）。
//    置顶=制度位（对所有人同一顺序），常用=个人位（仅本浏览器）——语义分界对齐 Reddit
//    saved；置顶帖不重复进常用区。星标开关在列表行卡（☆/⭐）与详情头卡（☆ 常用/★ 已常用）；
//    常用区行带「在案 N」徽标（live 数进 title）。
// 2. 本地已读标记（§2.4 v1 落法）：localStorage forum-kb:reads 记 (post → 已见 answer/评论
//    计数水位)，打开详情页（view 投影成功）即落账；列表行卡对「看过且计数增长」的帖子标
//    「有新」蓝徽标——从没打开过的帖子不标（避免新装满屏噪声）。append-only 保证计数单调，
//    比较安全。subscriptions 工具级职责不动，v2 才考虑落库 reads 表。
//
// v0.9.0（帖子 619789961961，D1：@ 派活权限选择）：composer 双选升级「组成+权限」——
// ① target 芯片二级菜单追加「权限档」区（数据 = dispatchInfo 的 permissions 名册，
//    标注 sandbox/approval/description；缺省 = 部署默认档；permRoster 空 = 部署未挂
//    permission 面板，整区不出现）；② 选择作 dispatch 参数（targets {name, preset,
//    permission}），正文保持 @author 纯净；仅对新建生效（host 侧裁定，同 preset 原则）；
// ③ 发派前预览行追加权限显示（created = 将落地档；live/resumed = 「沿会话权限」）；
//    回执行芯片显示已落权限档。
//
// v0.8.1（434b349bae90 a4 巡查 hotfix 的补完）：client bundle 构建期内联 remote schema 副本
//（TYPERT_REMOTE = @deepseek-ai/dsh-forum-kb/remote 的构建期快照）——host 半 PostView 补
// pinned 后若只重启进程，浏览器仍用旧 schema parse 响应，pinned 在进 normalizeView 前被
// 客户端 stub 静默剥离（human 复测「仍看不到取消置顶」坐实）。本版源码零逻辑改动，仅随
// 重建换 BUILD 戳 + 内联修复后的 remote schema。教训：host schema 修复必须连跑 client
// 重建，BUILD 戳换新为证。
//
// 关键点：remote.forumKb 不在 dsh-api-remotes 的构建期挂载清单里，本面板自行 $mount
// @deepseek-ai/dsh-forum-kb/remote（tsdown 连同 zod 打进 bundle，运行期不 require
// forum-kb 模块）。$mount 走 callerCtx.effect，插件卸载时自动撤销挂载与面板注册。
import { TYPERT_REMOTE } from "@deepseek-ai/dsh-forum-kb/remote"
import React from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { createRefreshLoop } from "./refresh"

export const name = "@deepseek-ai/dsh-client-ui-forum-kb"

// 构建版本戳：子导航右端可见，用于确认浏览器加载的是哪次 bundle。
// 教训：tsdown 输出被过滤时可能假成功——bundle 未换新则描述符缺 view → 秒回退。
const BUILD = "v0.10.0-global-refresh"

// ---- 设计 token（与 context-composition.html 同源，保持视觉主题统一）----
const T = {
  bg: "#f9fafb", surface: "#ffffff", surface2: "#f5f5f5",
  border: "rgba(0,0,0,.10)", borderStrong: "rgba(0,0,0,.16)",
  text1: "#0f1115", text2: "#61666b", text3: "#81858c",
  brand: "#4176e6", brand2: "#5686fe", brandSoft: "rgba(65,118,230,.09)",
  green: "#22c55e", amber: "#f59e0b", gray: "#6b7280", grayL: "#9ca3af",
  blue: "#3b82f6", danger: "#b91c1c", dangerBg: "rgba(220,38,38,.06)", dangerBd: "rgba(220,38,38,.25)",
  shadow: "0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06)",
  sans: "-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
  mono: "'SF Mono','JetBrains Mono','Fira Code',Consolas,'Liberation Mono',Menlo,monospace",
}
const STATE_COLOR: Record<string, string> = { active: T.green, waiting: T.amber, done: T.gray, archived: T.grayL }
const REL_LABEL: Record<string, string> = { extends: "延伸自", supersedes: "取代自", "relates-to": "关联自" }
const REL_OPTS: Array<{ v: string; l: string }> = [
  { v: "supersedes", l: "取代" },
  { v: "extends", l: "延伸" },
  { v: "relates-to", l: "关联" },
]

// ---- 本地存储（v0.8.0 P1，零 schema）：星标 + 已读水位。浏览器本地位（human 单读者；
// composer 身份是写面身份，读面不按身份分桶）。坏数据按空对象处理；localStorage 缺席
//（隐私模式等）时写入静默失败，状态仍是会话内存态——功能可用性不受影响。 ----
function loadLocalMap(key: string): Record<string, any> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    const v = JSON.parse(raw)
    return v && typeof v === "object" && !Array.isArray(v) ? v : {}
  } catch { return {} }
}
function saveLocalMap(key: string, v: Record<string, any>): void {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* 无存储环境：仅会话内存态 */ }
}

// ---- 数据归一：view() 投影 → 渲染模型（容错字段漂移，双侧并行施工）----
function normalizeView(v: any) {
  const current = v.current ?? null
  const answers = (Array.isArray(v.answers) ? v.answers : []).map((a: any) => ({
    id: String(a.id ?? ""),
    author: String(a.author ?? ""),
    body: String(a.body ?? ""),
    source: a.source ?? null,
    sourceRel: a.sourceRel ?? a.source_rel ?? null,
    current: typeof a.current === "boolean" ? a.current : current != null && a.id === current,
    comments: (Array.isArray(a.comments) ? a.comments : []).map((c: any) => ({
      id: String(c.id ?? ""), author: String(c.author ?? ""), body: String(c.body ?? ""),
    })),
  }))
  return {
    id: String(v.id ?? ""), title: String(v.title ?? ""), author: String(v.author ?? ""),
    tags: Array.isArray(v.tags) ? v.tags.map(String) : [],
    state: String(v.state ?? ""), current,
    assigned: v.assigned ?? null, entry: !!v.entry,
    pinned: !!v.pinned, pinnedScope: v.pinnedScope ?? v.pinned_scope ?? null,
    summary: String(v.summary ?? ""), query: String(v.query ?? ""),
    answers,
  }
}

function paras(t: string): string[] {
  return String(t ?? "").trim().split(/\n{2,}/).filter((s: string) => s.trim().length > 0)
}

// ---- 原子组件 ----
function StateBadge(state: string) {
  return React.createElement("span", {
    style: { display: "inline-flex", alignItems: "center", gap: 5, padding: "1px 8px", borderRadius: 6, background: T.surface2, border: `1px solid ${T.border}`, fontFamily: T.mono, fontSize: 11, color: T.text2, whiteSpace: "nowrap" },
  },
    React.createElement("span", { style: { width: 7, height: 7, borderRadius: 7, background: STATE_COLOR[state] || T.grayL, flex: "none" } }),
    state || "-",
  )
}

function MonoChip(text: string, brand?: boolean, title?: string) {
  return React.createElement("span", {
    title,
    style: { fontFamily: T.mono, fontSize: 11, padding: "1px 7px", borderRadius: 6, whiteSpace: "nowrap", background: brand ? T.brand : T.surface2, color: brand ? "#fff" : T.text2, border: brand ? `1px solid ${T.brand2}` : `1px solid ${T.border}` },
  }, text)
}

function Card(children: any, extraStyle?: any, key?: string) {
  return React.createElement("div", {
    key,
    style: Object.assign({ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow }, extraStyle || {}),
  }, children)
}

function Para(p: string, i: number) {
  return RichText(p, { whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, color: T.text1, marginTop: i === 0 ? 0 : 8 }, "p" + i)
}

function SectionLabel(text: string, color?: string) {
  return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, fontFamily: T.mono, fontSize: 11, color: color || T.text3, letterSpacing: ".04em" } },
    React.createElement("span", { style: { width: 7, height: 7, borderRadius: 7, background: color || T.text3, flex: "none" } }),
    text,
  )
}

function ghostBtn(extra?: any) {
  return Object.assign({ padding: "3px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text2, cursor: "pointer", fontSize: 12, flex: "none" }, extra || {})
}

// ---- 顶部导航栏（v0.3 目标3，v0.5 改常驻）：品牌 › 面包屑 › 上下文 ‖ 动作区 + BUILD 戳 ----
// v0.5：根布局改 flex 列，导航不在滚动流里（真常驻）；sticky 保留作外层滚动的兜底。
function SubNav(props: { inDetail: boolean; title?: string; state?: string; shown: number | null; count: number | null; busy: boolean; onBack: () => void; onNew: () => void; onRefresh: () => void }) {
  return React.createElement("div", {
    style: { position: "sticky", top: 0, zIndex: 10, flex: "0 0 auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,.96)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${T.border}`, flexWrap: "nowrap" },
  },
    React.createElement("span", { style: { fontFamily: T.mono, fontSize: 12.5, fontWeight: 700, color: T.brand, letterSpacing: ".02em", flex: "none" } }, "forum-kb"),
    React.createElement("span", { style: { color: T.grayL, flex: "none" } }, "›"),
    props.inDetail
      ? React.createElement("button", { key: "back", onClick: props.onBack, style: ghostBtn({ padding: "2px 9px" }), title: "返回帖子列表" }, "列表")
      : React.createElement("span", { style: { fontFamily: T.mono, fontSize: 11, color: T.text3, flex: "none" }, title: "可见/全部" }, (props.count == null ? "…" : (props.shown == null ? props.count : `${props.shown}/${props.count}`) + " 帖")),
    props.inDetail
      ? React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: "1 1 auto", overflow: "hidden" } },
          React.createElement("span", { style: { color: T.grayL, flex: "none" } }, "›"),
          React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: T.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, props.title || ""),
          props.state ? StateBadge(props.state) : null,
        )
      : React.createElement("span", { style: { flex: "1 1 auto" } }),
    React.createElement("button", { onClick: props.onRefresh, disabled: props.busy, style: ghostBtn(), title: "同步帖子列表和当前详情" }, "⟳ 刷新"),
    !props.inDetail
      ? React.createElement("button", { onClick: props.onNew, style: ghostBtn({ color: T.brand, borderColor: T.brand2, fontWeight: 600 }), title: "发起新帖" }, "＋ 发帖") : null,
    React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3, opacity: 0.7, flex: "none" } }, BUILD),
  )
}

// ---- 列表筛选行（v0.5：搜索 + tag/state/entry 组合筛选，论坛标配）----
// 仅列表页显示，与导航同属固定区（不随内容滚动）。搜索走 host FTS search 端点；
// 端点缺席（host 未升级）时回退本地子串过滤——行为对齐 v0.2 的 view→read 回退模式。
const selectStyle = { padding: "4px 7px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text2, fontSize: 12, fontFamily: T.sans, outline: "none", flex: "none" as const }

function FilterBar(props: {
  q: string; onQ: (v: string) => void;
  fState: string; onState: (v: string) => void;
  fTag: string; onTag: (v: string) => void;
  tags: string[];
  fEntry: boolean; onEntry: (v: boolean) => void;
  fSort: string; onSort: (v: string) => void;
  searching: boolean; ftsAvailable: boolean; hasTerm: boolean;
}) {
  return React.createElement("div", {
    style: { flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: T.surface, borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" },
  },
    React.createElement("input", {
      value: props.q, onChange: (e: any) => props.onQ(String(e.target.value || "")),
      placeholder: "搜索帖子（标题 / 摘要 / 正文…）",
      title: props.ftsAvailable ? "走 host FTS（与 kb_search 同源）；回车即时生效" : "host 未升级，本地过滤（标题/摘要/id）",
      style: { flex: "1 1 200px", minWidth: 160, maxWidth: 320, padding: "4px 9px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 12.5, background: T.surface, color: T.text1, outline: "none", fontFamily: T.sans },
    }),
    React.createElement("select", { value: props.fState, onChange: (e: any) => props.onState(e.target.value), style: selectStyle, title: "按状态筛选" },
      React.createElement("option", { value: "all" }, "全部状态"),
      ["active", "waiting", "done", "archived"].map((s) => React.createElement("option", { key: s, value: s }, s)),
    ),
    React.createElement("select", { value: props.fTag, onChange: (e: any) => props.onTag(e.target.value), style: selectStyle, title: "按标签筛选" },
      React.createElement("option", { value: "all" }, "全部标签"),
      props.tags.map((t: string) => React.createElement("option", { key: t, value: t }, "#" + t)),
    ),
    React.createElement("select", { value: props.fSort, onChange: (e: any) => props.onSort(e.target.value), style: selectStyle, title: "排序（客户端本地）：最新=created_at · 活跃=updated_at · 热度=answer+评论数；host 未重启缺字段时退回 id 序" },
      React.createElement("option", { value: "default" }, "排序: 默认"),
      React.createElement("option", { value: "new" }, "最新"),
      React.createElement("option", { value: "active" }, "活跃"),
      React.createElement("option", { value: "top" }, "热度"),
    ),
    React.createElement("button", {
      onClick: () => props.onEntry(!props.fEntry),
      title: "只看 entry 上手帖",
      style: { padding: "4px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer", flex: "none", border: `1px solid ${props.fEntry ? T.brand2 : T.border}`, background: props.fEntry ? T.brandSoft : T.surface, color: props.fEntry ? T.brand : T.text2, fontWeight: props.fEntry ? 600 : 400 },
    }, "★ 仅 entry"),
    props.hasTerm
      ? React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, flex: "none" } },
          props.searching
            ? React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10.5, color: T.text3 } }, "搜索中…")
            : props.ftsAvailable
              ? MonoChip("FTS", true, "host FTS 搜索（kb_search 同源）")
              : MonoChip("本地过滤", false, "host 无 search 端点（未重启），本地子串过滤"),
        )
      : null,
  )
}

function AnswerCard(a: any, actions?: { onComment: (id: string) => void; onQuote: (a: any) => void }) {
  const kids: any[] = a.comments || []
  return Card([
    React.createElement("div", { key: "head", style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
      MonoChip(a.id, !!a.current, a.current ? "current · 当前真相" : "answer"),
      React.createElement("span", { style: { fontSize: 12, color: T.text2 } }, a.author),
      a.source ? MonoChip(`${REL_LABEL[a.sourceRel] ?? "关联自"} ${a.source}`, false, "source 软引用") : null,
      a.current ? React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.brand } }, "current") : null,
      actions ? React.createElement("span", { style: { marginLeft: "auto", display: "inline-flex", gap: 6 } },
        React.createElement("button", { onClick: () => actions!.onComment(a.id), style: ghostBtn({ fontSize: 11, padding: "2px 8px" }), title: `在 ${a.id} 下写评论（草稿）` }, "评论"),
        React.createElement("button", { onClick: () => actions!.onQuote(a), style: ghostBtn({ fontSize: 11, padding: "2px 8px" }), title: `引用 ${a.id} 写新 answer（巩固）` }, "引用"),
      ) : null,
    ),
    RichText(a.body, { fontSize: 13, lineHeight: 1.6, color: T.text1, marginTop: 8 }),
    kids.length ? React.createElement("div", { key: "comments", style: { marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` } },
      SectionLabel(`评论区 · ${kids.length}`, T.amber),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 6 } },
        kids.map((c: any) => React.createElement("div", { key: c.id, style: { background: T.surface2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.amber}`, borderRadius: 8, padding: "7px 10px" } },
          React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } },
            React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: T.text1 } }, c.author),
            React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3 } }, c.id),
          ),
          RichText(c.body, { fontSize: 12.5, lineHeight: 1.55, color: T.text2, marginTop: 2 }, c.id),
        ))),
    ) : null,
  ], { padding: "12px 14px", borderLeft: a.current ? `3px solid ${T.brand}` : "3px solid transparent" })
}

function QueryCard(text: string) {
  return Card([
    SectionLabel("QUERY", T.blue),
    RichText(text, { fontSize: 13, lineHeight: 1.6, color: T.text1, marginTop: 8 }),
  ], { padding: "12px 14px", borderLeft: `3px solid ${T.blue}` })
}

function PostHeader(post: any, pinAction?: { onPin: () => void } | null, inCase?: any[] | null, starAction?: { starred: boolean; onToggle: () => void } | null) {
  const pinScopeLabel = post.pinnedScope ? "#" + post.pinnedScope : "全局"
  return Card([
    React.createElement("div", { key: "row1", style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
      React.createElement("span", { style: { fontSize: 14.5, fontWeight: 600, color: T.text1 } }, post.title),
      StateBadge(post.state),
      post.entry ? MonoChip("★ entry", true, "推荐上手起点") : null,
      post.pinned ? React.createElement("span", { title: post.pinnedScope ? "tag 内置顶（对同一 tag 的读者置顶）" : "全局置顶（对所有读者置顶）", style: { fontFamily: T.mono, fontSize: 11, padding: "1px 7px", borderRadius: 6, whiteSpace: "nowrap", background: "rgba(245,158,11,.12)", color: T.amber, border: "1px solid rgba(245,158,11,.4)" } }, `📌 ${pinScopeLabel}`) : null,
      pinAction ? React.createElement("button", { onClick: pinAction.onPin, style: ghostBtn({ fontSize: 11, padding: "2px 8px", marginLeft: "auto" }), title: post.pinned ? "取消置顶（off 同时清 scope）" : "全局置顶（tag 级置顶走 CLI：kb pin --scope <tag>）" }, post.pinned ? "取消置顶" : "📌 置顶") : null,
      // 本地星标（v0.8.0 P1）：详情页开关与列表行卡同一状态源（forum-kb:stars）。
      starAction ? React.createElement("button", { onClick: starAction.onToggle, style: ghostBtn({ fontSize: 11, padding: "2px 8px", color: starAction.starred ? T.amber : T.text2, fontWeight: starAction.starred ? 600 : 400 }), title: starAction.starred ? "取消常用（本地星标，仅本浏览器）" : "标为常用（本地星标，仅本浏览器；列表页「⭐ 常用」区可见）" }, starAction.starred ? "★ 已常用" : "☆ 常用") : null,
    ),
    React.createElement("div", { key: "row2", style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 } },
      MonoChip(post.id, false, "帖子 id"),
      post.author ? React.createElement("span", { style: { fontSize: 12, color: T.text3 } }, "发起 " + post.author) : null,
      post.assigned ? React.createElement("span", { style: { fontSize: 12, color: T.text3 } }, "负责 " + post.assigned) : null,
      post.current ? MonoChip("current " + post.current, false, "当前真相指针") : null,
      ...(post.tags || []).map((tg: string) => MonoChip("#" + tg)),
      // 在案区（v0.7.0 ADR-0004）：该帖 (post, author) → 会话映射的只读投影（dispatchInfo
      // {post} 形状），事后可查证「续聊还是冷恢复」。host 未升级时端点缺席 → 区不出现。
      ...(inCase || []).map((r: any) => React.createElement("span", {
        key: "ic" + r.author,
        title: `在案会话 ${r.sessionId}${r.agentPreset ? " · preset " + r.agentPreset : ""}（${r.live ? "活会话：@ 即增量续聊" : "冷会话：@ 触发冷恢复"}）`,
        style: { fontFamily: T.mono, fontSize: 11, padding: "1px 7px", borderRadius: 6, whiteSpace: "nowrap", background: r.live ? T.brandSoft : T.surface2, color: r.live ? T.brand : T.text2, border: `1px solid ${r.live ? T.brand2 : T.border}` },
      }, `在案 @${r.author} · ${r.live ? "续聊" : "冷"}`)),
    ),
    post.summary ? React.createElement("div", { key: "sum", style: { marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` } },
      SectionLabel("SUMMARY"),
      React.createElement("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12.5, lineHeight: 1.55, color: T.text2, marginTop: 6 } }, post.summary),
    ) : null,
  ], { padding: "12px 14px" })
}

// 引用预填：markdown blockquote，源 answer 一目了然（巩固时 source=该 answer）。
function quoteOf(a: any) {
  const lines = String(a.body || "").split("\n").map((l: string) => "> " + l).join("\n")
  return `> 引用 ${a.id} · ${a.author}：\n${lines}\n\n`
}

// ---- refs 反向索引面板（v0.6.0 P0，Discourse back-links 同构）----
// 入向 = 谁引用本帖（depends_on / [[token]] 双通道，点行跳帖）；出向 = 本帖 depends_on
//（post 可跳、doc 只展示）。数据 = @Remote refs(id)（kb refs --json 同源）。
function RefsPanel(data: any, onOpen: (id: string) => void) {
  const inbound = Array.isArray(data.inbound) ? data.inbound : []
  const outbound = Array.isArray(data.outbound) ? data.outbound : []
  if (!inbound.length && !outbound.length) return null
  const rowStyle = { display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface2, flexWrap: "wrap" } as any
  const inboundRows = inbound.map((r: any, i: number) => React.createElement("div", {
    key: "i" + i, onClick: () => onOpen(String(r.from)), style: Object.assign({}, rowStyle, { cursor: "pointer" }),
    title: "跳转到引用方帖子",
  },
    MonoChip(String(r.from), false, "引用方帖子 id"),
    React.createElement("span", { style: { fontSize: 12, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 340 } }, String(r.title ?? "")),
    MonoChip(String(r.where ?? ""), false, r.where === "depends_on" ? "结构化引用（depends_on）" : "正文 [[token]] 内联引用"),
    r.anchor ? MonoChip("#" + r.anchor, false, "锚点") : null,
  ))
  const outboundRows = outbound.map((d: any, i: number) => {
    const isPost = d.kind === "post"
    return React.createElement("div", {
      key: "o" + i, onClick: isPost ? () => onOpen(String(d.id)) : undefined,
      style: Object.assign({}, rowStyle, { cursor: isPost ? "pointer" : "default" }),
      title: isPost ? "跳转到被依赖帖子" : "文档引用（仓库相对路径）",
    },
      MonoChip(isPost ? "post" : "doc", false, "引用类型"),
      MonoChip(String(d.id), false, isPost ? "帖子 id" : "文档路径"),
      React.createElement("span", { style: { fontSize: 12, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 340 } }, String(d.title ?? "")),
      d.anchor ? MonoChip("#" + d.anchor, false, "锚点") : null,
    )
  })
  return Card([
    SectionLabel(`REFS · 被引用 ${inbound.length} · 出向 ${outbound.length}`, T.blue),
    inbound.length ? React.createElement("div", { key: "in", style: { marginTop: 8 } },
      React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10.5, color: T.text3, marginBottom: 4 } }, "入向（谁引用本帖）"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } }, inboundRows),
    ) : null,
    outbound.length ? React.createElement("div", { key: "out", style: { marginTop: inbound.length ? 10 : 8 } },
      React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10.5, color: T.text3, marginBottom: 4 } }, "出向（本帖 depends_on）"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } }, outboundRows),
    ) : null,
  ], { padding: "12px 14px", marginTop: 10, borderLeft: `3px solid ${T.blue}` })
}

// ---- @ mention + @ 实体引用（ADR-0003 / ADR-0004 v0.7.0）----
// 裸 @author = 派活候选；@post:<id> / @file:<workspace 相对路径> / @tool:<名> = 实体引用
//（纯指针，渲染层高亮+点击，永不派活）。
// 排除用【命名空间限定】负向先行 @(?!(?:post|file|tool):)——自检修缺：初版用 (?![\w:-])
// 会把 "@author: 文本"（ASCII 冒号）也误排除出派活解析，降级 ADR-0003 既有行为；
// 限定到三个保留前缀后，"@agent: x" 照常派活，"@post:x" 只算引用。
function parseMentions(text: string): string[] {
  const out: string[] = []
  for (const m of String(text || "").matchAll(/@(?!(?:post|file|tool):)([a-z0-9][a-z0-9_-]{0,63})/gi)) {
    const t = m[1].toLowerCase()
    if (!out.includes(t)) out.push(t)
  }
  return out
}
// 拆分/成对高亮：分支一 = 裸 mention（同一命名空间限定，@post: 不会截出 "@post"）；
// 分支二 = 实体引用（charset 收窄到路径安全字符，正文标点/空白自然截断）。
const MENTION_SPLIT = /(@(?!(?:post|file|tool):)[a-z0-9][a-z0-9_-]{0,63}|@(?:post|file|tool):[A-Za-z0-9_\-./\\]+)/gi
const MENTION_TOKEN = /^@[a-z0-9][a-z0-9_-]{0,63}$/i
const REF_TOKEN = /^@(post|file|tool):([A-Za-z0-9_\-./\\]+)$/i
const REF_STYLE: Record<string, string> = {
  post: `color:${T.brand};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.brand2};cursor:pointer`,
  file: `color:${T.green};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.green};cursor:pointer`,
  tool: `color:${T.amber};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.amber}`,
}
const REF_TITLE: Record<string, string> = {
  post: "点击在论坛内打开该帖子",
  file: "点击用系统默认应用打开（workspace 相对路径）",
  tool: "host 工具",
}

// ---- markdown 渲染（v0.5.2：answer/query/评论正文走 GitHub 风格渲染）----
// marked（GFM 默认开启）+ DOMPurify 消毒 → HTML 字符串。二者均为零依赖纯浏览器库
//（react-markdown 的 unified/vfile 生态顶层 import node:*，browser 构建会打挂 loader，
// 故弃用——见头部选型记录）。@mention 高亮与外链加固在消毒后的 DOM 文本节点上做
//（不碰 code 内容与属性值），派活解析仍走 parseMentions，显示层与解析层分离。
// ⚠️ 依赖纪律：本包 platform:'browser' 不 polyfill node 内建——增删依赖后必须跑
// 「产物无 require("node:*)」门禁；zod 已精确锁版 4.4.3 勿改回 ^。
function enhanceRichDom(root: Document): void {
  const mentionStyle = `color:${T.brand};font-family:${T.mono};font-weight:600`
  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || ""
      const parts = text.split(MENTION_SPLIT)
      if (parts.length > 1) {
        const frag = document.createDocumentFragment()
        for (const p of parts) {
          if (!p) continue
          if (MENTION_TOKEN.test(p)) {
            const span = document.createElement("span")
            span.className = "kbd-mention"
            span.setAttribute("style", mentionStyle)
            span.textContent = p
            frag.appendChild(span)
            continue
          }
          const ref = REF_TOKEN.exec(p)
          if (ref) {
            const kind = ref[1].toLowerCase()
            const span = document.createElement("span")
            span.className = "kbd-ref"
            span.setAttribute("data-ref-kind", kind)
            span.setAttribute("data-ref-value", ref[2])
            span.setAttribute("style", REF_STYLE[kind] || mentionStyle)
            span.setAttribute("title", ((REF_TITLE[kind] || "") + " · " + p).replace(/^ · /, ""))
            span.textContent = p
            frag.appendChild(span)
            continue
          }
          frag.appendChild(document.createTextNode(p))
        }
        node.parentNode?.replaceChild(frag, node)
        return
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (el.tagName === "A") {
        const href = el.getAttribute("href") || ""
        if (href.startsWith("http")) {
          el.setAttribute("target", "_blank")
          el.setAttribute("rel", "noopener noreferrer")
        }
        ;(el as HTMLElement).style.color = T.brand
      }
    }
    Array.from(node.childNodes).forEach(walk)
  }
  walk(root.body || root.documentElement)
}

// md → 消毒并加固后的 HTML。breaks:true 保留 KB 正文的单换行语义（对齐旧 pre-wrap 观感）。
function richHtml(text: string): string {
  const raw = marked.parse(String(text ?? ""), { gfm: true, breaks: true, async: false })
  const clean = DOMPurify.sanitize(raw)
  const doc = new DOMParser().parseFromString(`<div id="r">${clean}</div>`, "text/html")
  enhanceRichDom(doc)
  const el = doc.getElementById("r")
  return el ? el.innerHTML : clean
}

// md 块级样式：作用域 .kbd-md，与 DSH token 同源，不污染面板其它部分（含 GFM 表格/任务清单）。
const MD_CSS = [
  ".kbd-md p{margin:0 0 6px}.kbd-md p:last-child{margin-bottom:0}",
  ".kbd-md h1,.kbd-md h2,.kbd-md h3,.kbd-md h4,.kbd-md h5,.kbd-md h6{margin:10px 0 4px;font-weight:600;color:#0f1115;line-height:1.35}",
  ".kbd-md h1{font-size:16px}.kbd-md h2{font-size:14.5px}.kbd-md h3{font-size:13.5px}.kbd-md h4{font-size:13px}.kbd-md h5{font-size:12.5px}.kbd-md h6{font-size:12px;color:#61666b}",
  ".kbd-md ul,.kbd-md ol{margin:0 0 6px;padding-left:20px}.kbd-md li{margin:2px 0;line-height:1.55}",
  ".kbd-md li>input[type=checkbox]{margin-right:4px;vertical-align:-1px}",
  ".kbd-md pre{margin:6px 0;padding:8px 10px;background:#f5f5f5;border:1px solid rgba(0,0,0,.10);border-radius:8px;overflow-x:auto}",
  ".kbd-md code{font-family:'SF Mono','JetBrains Mono','Fira Code',Consolas,Menlo,monospace;font-size:12px;background:rgba(0,0,0,.05);padding:1px 4px;border-radius:4px}",
  ".kbd-md pre code{background:transparent;padding:0;font-size:12px}",
  ".kbd-md blockquote{margin:6px 0;padding:4px 10px;border-left:3px solid rgba(65,118,230,.4);color:#61666b}",
  ".kbd-md a{color:#4176e6}.kbd-md hr{border:none;border-top:1px solid rgba(0,0,0,.10);margin:8px 0}",
  ".kbd-md strong{font-weight:600}",
  ".kbd-md table{border-collapse:collapse;margin:6px 0;display:block;overflow-x:auto;max-width:100%}",
  ".kbd-md th,.kbd-md td{border:1px solid rgba(0,0,0,.12);padding:4px 10px;font-size:12.5px}",
  ".kbd-md th{background:#f5f5f5;font-weight:600}",
].join("")

// 实体引用点击（委托）：post → 论坛内跳转；file → openRef（host 解析 workspace 根 → OS
// 默认应用）；tool → 仅悬停提示（无点击动作）。处理器由 ForumView 挂入（拿到 open + forumKb）。
function handleRefClick(e: any, onRef: (kind: string, value: string) => void): void {
  const t = e && e.target
  const node = t && typeof t.closest === "function" ? t.closest(".kbd-ref") : null
  if (!node) return
  const kind = node.getAttribute("data-ref-kind")
  const value = node.getAttribute("data-ref-value")
  if (kind && value) { e.preventDefault(); onRef(kind, value) }
}

// 正文渲染：GitHub 风格 markdown（marked + DOMPurify）；@token 高亮与实体引用已并入 DOM 加固层。
function RichText(text: string, style: any, key?: string) {
  return React.createElement("div", {
    key,
    className: "kbd-md",
    style: Object.assign({ wordBreak: "break-word" }, style || {}),
    dangerouslySetInnerHTML: { __html: richHtml(text) },
  })
}

// ---- MentionTextarea（v0.7.1 统一组件）：论坛内所有需要 @ 补全的正文输入框共用一个实现 ----
// 范式与主输入框触发菜单一致：分段（作者/论坛帖子/host 工具）+ token+描述行卡 + 键盘导航。
// 数据源由调用方按场景装配（sources 分段可插拔：composer=作者+帖子+工具；发帖 query 同款）；
// 插入语义 = 写入完整 token 文本（@author 派活候选 / @post:<id> / @tool:<名> 实体引用——
// 渲染层统一可点击）。后续任何正文输入框要 @ 能力，直接 <MentionTextarea sources={…}/> 装配，
// 不再各自适配。
function MentionTextarea(props: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  style?: any
  inputRef?: any
  sources: Array<{ section: string; startsWithOnly?: boolean; items: Array<{ token: string; desc: string }> }>
  onCtrlEnter?: () => void
}) {
  const [mention, setMention] = React.useState<{ start: number; query: string; index: number } | null>(null)
  const innerRef = React.useRef<any>(null)
  const ref = props.inputRef || innerRef
  // 外部改写 value（发送后清空、引用预填）时收起候选。
  React.useEffect(() => {
    setMention((m: any) => (m && m.start > props.value.length ? null : m))
  }, [props.value])
  const onChange = (e: any) => {
    const v = e.target.value
    props.onChange(v)
    const caret = e.target.selectionStart == null ? v.length : e.target.selectionStart
    const m = /(?:^|\s)@([a-z0-9_-]*)$/i.exec(v.slice(0, caret))
    setMention(m ? { start: caret - m[1].length - 1, query: m[1].toLowerCase(), index: 0 } : null)
  }
  const q = mention ? mention.query.toLowerCase() : ""
  const cand: Array<{ token: string; label: string; desc: string; section: string }> = []
  for (const src of props.sources || []) {
    for (const it of src.items || []) {
      const token = String((it && it.token) ?? "")
      const desc = String((it && it.desc) ?? "")
      if (q && (src.startsWithOnly ? !token.startsWith(q) : !(token.toLowerCase().startsWith(q) || desc.toLowerCase().includes(q)))) continue
      cand.push({ token, label: "@" + token, desc, section: src.section })
    }
  }
  if (cand.length > 30) cand.length = 30
  const pick = (token: string) => {
    if (!mention) return
    const v = props.value
    props.onChange(v.slice(0, mention.start) + "@" + token + " " + v.slice(mention.start + 1 + mention.query.length))
    setMention(null)
    setTimeout(() => { try { if (ref.current) ref.current.focus() } catch { /* 已卸载 */ } }, 30)
  }
  return React.createElement(React.Fragment, null,
    React.createElement("textarea", {
      ref, value: props.value, rows: props.rows ?? 3,
      onChange,
      onBlur: () => { setTimeout(() => setMention(null), 150) },
      onKeyDown: (e: any) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); if (props.onCtrlEnter) props.onCtrlEnter(); return }
        if (mention && cand.length) {
          if (e.key === "ArrowDown") { e.preventDefault(); setMention({ ...mention, index: (mention.index + 1) % cand.length }); return }
          if (e.key === "ArrowUp") { e.preventDefault(); setMention({ ...mention, index: (mention.index - 1 + cand.length) % cand.length }); return }
          if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); pick(cand[mention.index].token); return }
          if (e.key === "Escape") { setMention(null); return }
        }
      },
      placeholder: props.placeholder,
      style: props.style,
    }),
    mention && cand.length ? React.createElement("div", { style: { marginBottom: 6, border: `1px solid ${T.border}`, borderRadius: 10, background: T.surface, maxHeight: 240, overflowY: "auto", boxShadow: T.shadow } },
      cand.map((c, i: number) => {
        const showHeader = i === 0 || cand[i - 1].section !== c.section
        return React.createElement(React.Fragment, { key: c.section + ":" + c.token },
          showHeader ? React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3, padding: "7px 10px 2px", letterSpacing: ".04em" } }, c.section) : null,
          React.createElement("div", {
            onClick: () => pick(c.token),
            style: { display: "flex", alignItems: "baseline", gap: 8, padding: "5px 10px", cursor: "pointer", background: i === mention.index ? T.brandSoft : "transparent", borderLeft: i === mention.index ? `2px solid ${T.brand}` : "2px solid transparent" },
            title: c.desc,
          },
            React.createElement("span", { style: { fontFamily: T.mono, fontSize: 11.5, fontWeight: 600, color: i === mention.index ? T.brand : T.text1, whiteSpace: "nowrap" } }, c.label),
            c.desc ? React.createElement("span", { style: { fontSize: 11.5, color: T.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, c.desc) : null,
          ),
        )
      }),
    ) : null,
  )
}

// ---- 主视图 ----
function ForumView(props: { forumKb: any }) {
  const { forumKb } = props
  const [posts, setPosts] = React.useState<any[] | null>(null)
  const [sel, setSel] = React.useState<string | null>(null)
  const [detail, setDetail] = React.useState<any>(null) // {kind:'view',post} | {kind:'md',markdown}
  const [err, setErr] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [syncErr, setSyncErr] = React.useState<string | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const loopRef = React.useRef<ReturnType<typeof createRefreshLoop> | null>(null)
  const readRef = React.useRef<(valid: () => boolean) => Promise<void>>(async () => {})
  const draftAnchor = React.useRef<{ post: string; current: string | null } | null>(null)
  const mounted = React.useRef(false)

  // ---- 列表筛选/搜索（v0.5：论坛标配，全部可组合）----
  // 命名注意：fId/fTag 等已被发帖表单占用，筛选态用 flt 前缀。
  const [q, setQ] = React.useState("")
  const [fltState, setFltState] = React.useState("all")
  const [fltTag, setFltTag] = React.useState("all")
  const [fltEntry, setFltEntry] = React.useState(false)
  const [fltSort, setFltSort] = React.useState("default") // v0.6.0：default|new|active|top（客户端本地排序）
  const [ftsIds, setFtsIds] = React.useState<Set<string> | null>(null) // FTS 命中集（null=未启用）
  const [searching, setSearching] = React.useState(false)
  const [refsData, setRefsData] = React.useState<any>(null) // v0.6.0：详情页反向索引面板数据
  const [refsErr, setRefsErr] = React.useState<string | null>(null)
  // v0.7.0（ADR-0004）：派活面投影 + preset 二级选择（动作参数，不进正文）。
  const [inCase, setInCase] = React.useState<any[] | null>(null) // 头卡在案区（dispatchInfo {post}）
  const [presetSel, setPresetSel] = React.useState<Record<string, string>>({}) // target → presetId
  const [presetMenuFor, setPresetMenuFor] = React.useState<string | null>(null) // 打开二级菜单的 target
  const [infoData, setInfoData] = React.useState<any>(null) // dispatchInfo 最近返回（preview）
  const [roster, setRoster] = React.useState<any[]>([]) // preset 名册缓存（菜单/标签；核查轮 #1：点芯片时名册可能还没到，独立缓存 + 点击即拉）
  const [permSel, setPermSel] = React.useState<Record<string, string>>({}) // v0.9.0：target → 权限档名（动作参数，不进正文）
  const [permRoster, setPermRoster] = React.useState<any[]>([]) // v0.9.0：权限档名册缓存（权限菜单数据源；空 = 部署未挂 permission 面板，菜单不出现权限区）
  const [toolsCache, setToolsCache] = React.useState<any[]>([]) // toolIndex 缓存（composer @tool 候选；核查轮 #3）
  // v0.8.0 P1：常用区（本地星标 ∪ dispatch 在案推导）与已读水位（有新标记），全浏览器本地位。
  const [stars, setStars] = React.useState<Record<string, number>>(() => loadLocalMap("forum-kb:stars") as Record<string, number>)
  const [reads, setReads] = React.useState<Record<string, any>>(() => loadLocalMap("forum-kb:reads"))
  const [sessIdx, setSessIdx] = React.useState<Record<string, { n: number; live: number; authors: string[] }> | null>(null)
  const dispatchInfoAvailable = typeof forumKb.dispatchInfo === "function"
  const ftsAvailable = typeof forumKb.search === "function"
  const pinAvailable = typeof forumKb.pin === "function"
  const term = q.trim()

  // 搜索变更使旧批次失效；同一同步循环刷新 FTS，外部新内容也能进入搜索结果。
  React.useEffect(() => {
    setFtsIds(null)
    setSearching(!!term && ftsAvailable)
    loopRef.current?.invalidate()
    const t = setTimeout(() => void loopRef.current?.request(), 250)
    return () => clearTimeout(t)
  }, [term, ftsAvailable])

  const allTags = React.useMemo(() => {
    const s = new Set<string>()
    for (const p of posts || []) for (const t of (Array.isArray(p.tags) ? p.tags : []) as string[]) s.add(t)
    return [...s].sort()
  }, [posts])

  // 可见帖子：state/tag/entry 恒过滤；搜索词命中集（FTS）或本地子串（标题/摘要/id/负责）过滤。
  const ql = term.toLowerCase()
  const visible = (posts || []).filter((p: any) => {
    if (fltState !== "all" && p.state !== fltState) return false
    if (fltTag !== "all" && !(Array.isArray(p.tags) ? p.tags : []).includes(fltTag)) return false
    if (fltEntry && !p.entry) return false
    if (ftsIds) return ftsIds.has(p.id)
    if (ql) {
      const hay = [p.id, p.title, p.summary, p.assigned].map((x: any) => String(x ?? "").toLowerCase()).join("\n")
      return ql.split(/\s+/).every((w: string) => hay.includes(w))
    }
    return true
  })

  // v0.6.0 排序（客户端本地，与 kb query --sort 同语义）：host 未重启缺字段时
  // some() 探测不过 → 自然退回 id 序，不白屏。置顶分区：全局在前、tag 内在后。
  const num = (x: any) => (Number(x) || 0)
  const sortedVisible = (() => {
    const arr = [...visible]
    if (fltSort === "new" && arr.some((p: any) => p.createdAt)) arr.sort((a: any, b: any) => (String(a.createdAt ?? "") < String(b.createdAt ?? "") ? 1 : -1))
    else if (fltSort === "active" && arr.some((p: any) => p.updatedAt)) arr.sort((a: any, b: any) => (String(a.updatedAt ?? "") < String(b.updatedAt ?? "") ? 1 : -1))
    else if (fltSort === "top" && arr.some((p: any) => p.answers != null)) arr.sort((a: any, b: any) => (num(b.answers) + num(b.comments)) - (num(a.answers) + num(a.comments)))
    return arr
  })()
  const pinnedPosts = sortedVisible.filter((p: any) => p.pinned).sort((a: any, b: any) => ((a.pinnedScope ? 1 : 0) - (b.pinnedScope ? 1 : 0)))
  const normalPosts = sortedVisible.filter((p: any) => !p.pinned)

  // v0.8.0 P1 常用区：本地星标 ∪ dispatch 在案帖（端点缺席 = 仅星标）。置顶帖已在置顶区
  //（制度位），不重复进常用区；星标行在前（新标优先），其余按 updatedAt 降序，总量截 12。
  // 「有新」= 看过（reads 有水位）且当前 answer+评论计数 > 水位；从未打开过的不标。
  const sessOf = (id: string) => (sessIdx && sessIdx[id]) || null
  const isNewPost = (p: any) => {
    const r = reads[p.id]
    return !!r && (num(p.answers) + num(p.comments)) > (Number(r.a) || 0) + (Number(r.c) || 0)
  }
  const freqPosts = sortedVisible
    .filter((p: any) => !p.pinned && (stars[p.id] || sessOf(p.id)))
    .sort((a: any, b: any) => {
      const sa = Number(stars[a.id]) || 0
      const sb = Number(stars[b.id]) || 0
      if ((sa > 0) !== (sb > 0)) return sa > 0 ? -1 : 1
      if (sa && sb && sa !== sb) return sb - sa
      return String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")) || (a.id < b.id ? -1 : 1)
    })
  if (freqPosts.length > 12) freqPosts.length = 12
  const freqIds = new Set(freqPosts.map((p: any) => p.id))
  const listPosts = normalPosts.filter((p: any) => !freqIds.has(p.id))

  // composer：单输入框（v0.3 目标2）。角色默认 user；评论=草稿（默认），巩固=answer。
  const [role, setRole] = React.useState<string>(() => {
    try { return localStorage.getItem("forum-kb:role") || "user" } catch { return "user" }
  })
  React.useEffect(() => { try { localStorage.setItem("forum-kb:role", role) } catch {} }, [role])
  const [mode, setMode] = React.useState<"comment" | "answer">("comment")
  const [target, setTarget] = React.useState<string | null>(null) // 评论目标 answer（null=current）
  const [source, setSource] = React.useState<string | null>(null) // answer 源（null=current；无 current=root）
  const [rel, setRel] = React.useState("supersedes")
  const [text, setText] = React.useState("")
  const taRef = React.useRef<any>(null)
  // @ 补全交互（mention 弹层状态）自 v0.7.1 起内聚在 MentionTextarea 组件里；
  // 这里只保留派活回执状态。
  const [dispatching, setDispatching] = React.useState(false)
  const [dispatchOut, setDispatchOut] = React.useState<any[] | null>(null)

  // 发帖表单（v0.3 目标1，列表页）
  const [composing, setComposing] = React.useState(false)
  const [fId, setFId] = React.useState("")
  const [fTitle, setFTitle] = React.useState("")
  const [fTag, setFTag] = React.useState("forum-kb")
  const [fSummary, setFSummary] = React.useState("")
  const [fBody, setFBody] = React.useState("")

  React.useEffect(() => {
    mounted.current = true
    const loop = createRefreshLoop({
      read: (valid) => readRef.current(valid),
      visible: () => document.visibilityState !== "hidden" && !!rootRef.current?.getClientRects().length,
      onError: (error) => setSyncErr(String(error)),
    })
    loopRef.current = loop
    const wake = () => { void loop.request() }
    window.addEventListener("focus", wake)
    document.addEventListener("visibilitychange", wake)
    wake()
    return () => {
      mounted.current = false
      loop.dispose()
      window.removeEventListener("focus", wake)
      document.removeEventListener("visibilitychange", wake)
      loopRef.current = null
    }
  }, [forumKb])

  // @tool 候选缓存（v0.7.0 核查轮 #3：composer @ 补全的实体引用段需要工具清单）。
  React.useEffect(() => {
    if (typeof forumKb.toolIndex !== "function") return
    Promise.resolve(forumKb.toolIndex()).then((r: any) => {
      if (r && r.ok === false) throw new Error(r.error && r.error.message)
      const v = r && r.value ? r.value : r
      if (mounted.current) setToolsCache(Array.isArray(v) ? v : [])
    }).catch(() => { if (mounted.current) setToolsCache([]) })
  }, [])

  // 星标/已读水位落盘（v0.8.0 P1）：变更即写 localStorage（缺席静默，内存态兜底）。
  React.useEffect(() => { saveLocalMap("forum-kb:stars", stars) }, [stars])
  React.useEffect(() => { saveLocalMap("forum-kb:reads", reads) }, [reads])

  // dispatch 在案全量投影（v0.8.0 P1 常用区数据源）：按帖聚合 {n: 会话数, live: 活会话数,
  // authors}。端点缺席（host 未重启，typeof 探测）→ sessIdx 恒 null，常用区退化为仅星标；
  // 端点在但失败同此——任何情况不白屏（v0.5 起降级纪律）。
  function updateSessions(v: any) {
      const idx: Record<string, { n: number; live: number; authors: string[] }> = {}
      for (const row of Array.isArray(v) ? v : []) {
        const pid = String((row && row.post) ?? "")
        if (!pid) continue
        const cur = idx[pid] || { n: 0, live: 0, authors: [] as string[] }
        cur.n += 1
        if (row.live) cur.live += 1
        const a = String((row && row.author) ?? "").toLowerCase()
        if (a && !cur.authors.includes(a)) cur.authors.push(a)
        idx[pid] = cur
      }
    setSessIdx(idx)
  }

  // 实体引用点击（v0.7.0）：post → 论坛内跳转；file → openRef（host 解析 → OS 默认应用）；
  // tool → 悬停已带描述，无点击动作。处理器属于当前面板，多个入口不会互相覆盖。
  function onRef(kind: string, value: string) {
      if (kind === "post" && value) open(value)
      else if (kind === "file" && value && typeof forumKb.openRef === "function") {
        Promise.resolve(forumKb.openRef({ path: value })).then((r: any) => {
          const v = r && r.value ? r.value : r
          if (v && v.ok === false) setErr("打开文件失败：" + (v.error ?? "?"))
        }).catch((e: any) => setErr("打开文件失败：" + String((e && e.message) || e)))
      }
  }

  // 发派前预览（v0.7.0 ADR-0004）：mentions/presetSel 变化防抖拉 dispatchInfo 预览——
  // 三态 + 组成 + 模型，「能否完成任务」发送前可见可改；route 字段把解析链可视化。
  const activeMentions = React.useMemo(() => parseMentions(text), [text])
  const presetSig = activeMentions.map((t) => t + "=" + (presetSel[t] || "") + "/" + (permSel[t] || "")).join(",")
  const inView = !!detail && detail.kind === "view"
  const viewCurrent = inView ? currentOf() : null
  const previewGen = React.useRef(0)
  React.useEffect(() => {
    if (!activeMentions.length || !sel || !dispatchInfoAvailable || !inView) { setInfoData((d: any) => (d && d.preview ? null : d)); return }
    const on = target || viewCurrent
    const gen = ++previewGen.current
    const t = setTimeout(() => {
      Promise.resolve(forumKb.dispatchInfo({ post: sel, on, targets: activeMentions.map((m) => ({ name: m, preset: presetSel[m] || undefined, permission: permSel[m] || undefined })) })).then((r: any) => {
        if (gen !== previewGen.current) return // 旧响应晚到：不覆盖新预览（自检修缺）
        if (r && r.ok === false) throw new Error(r.error && r.error.message)
        const v = r && r.value ? r.value : r
        setInfoData(v && typeof v === "object" ? v : null)
        if (v && Array.isArray(v.presets) && v.presets.length) setRoster(v.presets)
        if (v && Array.isArray(v.permissions)) setPermRoster(v.permissions)
      }).catch(() => { if (gen === previewGen.current) setInfoData(null) })
    }, 300)
    return () => { clearTimeout(t); previewGen.current += 1 }
  }, [activeMentions, presetSig, sel, target, dispatchInfoAvailable, inView, viewCurrent])

  // 结构化投影优先；host 没挂 view 或调用失败 → 回退 read() markdown，并把
  // view 失败原因透传到回退卡。换帖时重置 composer 的定点目标（防串帖脏引用）。
  function open(id: string) {
    loopRef.current?.invalidate()
    draftAnchor.current = null
    setSel(id); setDetail(null); setErr(null)
    setTarget(null); setSource(null); setRel("supersedes")
    setDispatchOut(null); setDispatching(false)
    setRefsData(null); setRefsErr(null)
    setInCase(null); setPresetSel({}); setPermSel({}); setPresetMenuFor(null); setInfoData(null)
  }
  React.useEffect(() => { void loopRef.current?.request() }, [sel])

  // 数据更新不走 open()：保持 DOM、滚动位置和所有编辑状态。
  readRef.current = async (valid) => {
    if (busy) return
    const errors: string[] = []
    const unwrap = (r: any) => {
      if (r?.ok === false) throw new Error(r.error?.message || String(r.error))
      return r?.value ?? r
    }
    const run = async (label: string, work: () => Promise<void>) => {
      try { await work() } catch (e: any) { errors.push(label + "：" + String(e?.message || e)) }
    }
    await Promise.all([
      run("列表", async () => {
        const v = unwrap(await forumKb.list())
        if (!Array.isArray(v)) throw new Error("列表返回格式错误")
        if (valid()) setPosts(v)
      }),
      run("搜索", async () => {
        if (!term || !ftsAvailable) return
        try {
          const rows = unwrap(await forumKb.search({ term }))
          if (!Array.isArray(rows)) throw new Error("搜索返回格式错误")
          if (valid()) setFtsIds(new Set(rows.map((x: any) => String(x.id))))
        } catch (error) {
          if (valid()) setFtsIds(null)
          throw error
        } finally { if (valid()) setSearching(false) }
      }),
      run("在案", async () => {
        if (typeof forumKb.dispatchSessions !== "function") return
        const v = unwrap(await forumKb.dispatchSessions())
        if (valid()) updateSessions(v)
      }),
      run("详情", async () => {
        if (!sel) return
        try {
          if (typeof forumKb.view !== "function") throw new Error("view 端点缺席")
          const v = unwrap(await forumKb.view(sel))
          if (!v?.id || v.id !== sel) throw new Error("view 返回的帖子不匹配")
          const nv = normalizeView(v)
          if (valid()) {
            setDetail({ kind: "view", post: nv })
            recordRead(sel, nv.answers.length, nv.answers.reduce((n: number, a: any) => n + a.comments.length, 0))
          }
        } catch (error) {
          // 已有成功数据时保留；仅首次加载或旧 host 才回退 markdown。
          if (detail) throw error
          const v = unwrap(await forumKb.read(sel))
          if (valid()) setDetail({ kind: "md", markdown: v?.markdown || "", viewError: String(error) })
        }
      }),
      run("引用", async () => {
        if (!sel || typeof forumKb.refs !== "function") return
        const v = unwrap(await forumKb.refs({ id: sel }))
        if (valid()) { setRefsData(v); setRefsErr(null) }
      }),
      run("派活信息", async () => {
        if (!sel || !dispatchInfoAvailable) return
        const v = unwrap(await forumKb.dispatchInfo({ post: sel }))
        if (valid()) {
          setInCase(Array.isArray(v?.inCase) ? v.inCase : [])
          if (Array.isArray(v?.presets)) setRoster(v.presets)
          if (Array.isArray(v?.permissions)) setPermRoster(v.permissions)
        }
      }),
    ])
    if (valid()) setSyncErr(errors.length ? "同步失败，将自动重试。" + errors.join("；") : null)
  }

  function currentOf(): string | null {
    if (draftAnchor.current?.post === sel) return draftAnchor.current.current
    if (detail && detail.kind === "view" && detail.post.current) return detail.post.current
    if (!sel || !posts) return null
    const p = posts.find((x: any) => x.id === sel)
    return p && p.current ? p.current : null
  }
  function assignedOf(): string | null {
    if (detail && detail.kind === "view") return detail.post.assigned ?? null
    if (!sel || !posts) return null
    const p = posts.find((x: any) => x.id === sel)
    return p ? (p.assigned ?? null) : null
  }

  function call(method: string, args: any) {
    loopRef.current?.invalidate()
    setBusy(true); setErr(null)
    return Promise.resolve(forumKb[method](args)).then((r: any) => {
      setBusy(false)
      if (r && r.ok === false) { setErr(r.error && r.error.message); return r }
      // 写后由 busy effect 用最新状态同步，不重置 composer 或引用关系。
      return r
    }).catch((e: any) => { setBusy(false); setErr(String(e)); return null })
  }
  React.useEffect(() => { if (!busy) void loopRef.current?.request() }, [busy])

  const focusTa = () => { setTimeout(() => { try { if (taRef.current) taRef.current.focus() } catch {} }, 30) }

  // 定点动作（v0.3 目标1）：answer 卡 → composer 定向
  const onAnswerComment = (id: string) => { setMode("comment"); setTarget(id); focusTa() }
  const onAnswerQuote = (a: any) => {
    setMode("answer"); setSource(a.id); setRel(a.current ? "supersedes" : "extends")
    if (sel && !draftAnchor.current) draftAnchor.current = { post: sel, current: currentOf() }
    setText((t: string) => quoteOf(a) + t); focusTa()
  }

  const doClaim = () => call("claim", { post: sel, as: role })
  // 置顶/取消置顶（v0.6.0 P0）：GUI 一键走 global scope；tag 级置顶属策展动作，走 CLI/tools。
  const doPin = () => {
    if (!sel) return
    const p = (posts || []).find((x: any) => x.id === sel)
    const pinnedNow = detail && detail.kind === "view" ? !!detail.post.pinned : !!(p && p.pinned)
    return call("pin", { post: sel, set: pinnedNow ? "off" : "on" })
  }
  // 本地星标（v0.8.0 P1 常用区）：☆/⭐ 切换，浏览器本地位（对齐 Reddit saved 的个人性；
  // 与置顶互补——置顶对所有人，星标对自己）。
  const toggleStar = (id: string) => {
    if (!id) return
    setStars((s: any) => { const n = { ...s }; if (n[id]) delete n[id]; else n[id] = Date.now(); return n })
  }
  // 已读落账（v0.8.0 P1）：view 投影成功时由 open() 调用；reads 水位驱动列表「有新」徽标。
  const recordRead = (id: string, answers: number, comments: number) => {
    if (!id) return
    setReads((r: any) => ({ ...r, [id]: { a: answers, c: comments, at: new Date().toISOString() } }))
  }
  const doComment = async () => {
    const on = target || currentOf()
    if (!on) { setErr("暂无可挂评论的 answer——先用「巩固」发出首条 answer"); return }
    if (!text.trim()) { setErr("评论内容为空"); return }
    const bodyText = text
    const targets = parseMentions(bodyText)
    const r = await call("comment", { post: sel, as: role, on, body: bodyText })
    if (r && r.ok !== false) {
      draftAnchor.current = null
      setText(""); setTarget(null); setPresetSel({}); setPermSel({}); setPresetMenuFor(null)
      // @ 即派活（ADR-0003）：仅 GUI 发起（动作级门限）；view 投影在案才派（回退模式无投影）。
      // v0.7.0：targets 携带每目标显式 preset（composer 二级选择；仅对新建生效，host 侧裁定）。
      // v0.9.0：targets 再携带每目标显式 permission（权限档；同仅对新建生效）。
      if (targets.length && detail && detail.kind === "view" && typeof forumKb.dispatch === "function") {
        setDispatching(true); setDispatchOut(null)
        try {
          const dr = await Promise.resolve(forumKb.dispatch({ post: sel, on, targets: targets.map((t: string) => ({ name: t, preset: presetSel[t] || undefined, permission: permSel[t] || undefined })), author: role, body: bodyText }))
          const v = dr && dr.value ? dr.value : dr
          setDispatchOut(Array.isArray(v) ? v : [{ target: "?", ok: false, error: "dispatch 返回异常" }])
        } catch (e: any) {
          setDispatchOut([{ target: "?", ok: false, error: String((e && e.message) || e) }])
        } finally { setDispatching(false) }
        // 派活落账后在案区即时刷新（核查轮 #2：不用重开帖子就能看到「在案 @x」芯片）。
        if (typeof forumKb.dispatchInfo === "function") {
          Promise.resolve(forumKb.dispatchInfo({ post: sel })).then((r2: any) => {
            const v2 = r2 && r2.value ? r2.value : r2
            if (v2 && Array.isArray(v2.inCase)) setInCase(v2.inCase)
          }).catch(() => {})
        }
      } else if (targets.length && typeof forumKb.dispatch !== "function") {
        setDispatchOut([{ target: targets[0], ok: false, error: "bundle 描述符无 dispatch（host 未升级或浏览器是旧构建）" }])
      }
    }
  }
  const doAnswer = async () => {
    if (!text.trim()) { setErr("answer 正文为空"); return }
    const hasAnswers = !!(detail && detail.kind === "view" ? detail.post.answers.length : currentOf())
    const src = source || currentOf()
    if (hasAnswers && !src) { setErr("无 source（非首条 answer 必须指向一条先前 reply）"); return }
    const r = await call("answer", { post: sel, as: role, source: src || "", rel: src ? rel : "extends", body: text })
    if (r && r.ok !== false) { draftAnchor.current = null; setText(""); setSource(null); setRel("supersedes") }
  }
  const doCreatePost = async () => {
    const explicit = fId.trim()
    // v0.5：id 可留空 → host 走 kb 哈希生成；填了则校验 slug 字符集（与 kb.js/validate.js 对齐）。
    if (explicit && !/^[a-z0-9][a-z0-9-]*$/.test(explicit)) { setErr("slug 非法：小写字母/数字/连字符，且以字母或数字开头（或留空自动生成哈希 id）"); return }
    if (!fTitle.trim() || !fTag.trim() || !fSummary.trim() || !fBody.trim()) { setErr("title / tag / summary / query 正文均必填"); return }
    const r = await call("post", { id: explicit, title: fTitle, author: role, tag: fTag, summary: fSummary, body: fBody })
    if (r && r.ok !== false) {
      const val = r && r.value ? r.value : r
      const fromText = (val && typeof val.text === "string" ? (val.text.match(/✓ 创建帖子 (\S+)/) || [])[1] : "") || ""
      const newId = String((val && val.id) || explicit || fromText || "")
      setComposing(false); setFId(""); setFTitle(""); setFTag("forum-kb"); setFSummary(""); setFBody("")
      if (newId) open(newId)
    }
  }

  // ---- 样式 ----
  // v0.5 常驻布局：根 = flex 列（导航 + 筛选行固定），内容区独立滚动——滚动再久顶栏也不走丢。
  const wrap = { display: "flex", flexDirection: "column" as const, height: "100%", minHeight: 0, background: T.bg, color: T.text1, fontFamily: T.sans }
  const scroll = { flex: "1 1 auto", minHeight: 0, overflowY: "auto" as const, padding: "12px 16px 16px", boxSizing: "border-box" as const }
  const errBar = err ? React.createElement("div", { style: { background: T.dangerBg, border: `1px solid ${T.dangerBd}`, color: T.danger, borderRadius: 8, padding: "7px 10px", fontSize: 12, marginBottom: 10 } }, String(err)) : null
  const inp = { padding: "7px 9px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13, width: "100%", boxSizing: "border-box" as const, marginBottom: 8, background: T.surface, color: T.text1, fontFamily: T.sans, outline: "none" }
  const btn = { padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.brand2}`, background: T.brand, color: "#fff", cursor: busy ? "default" : "pointer", fontSize: 12.5, opacity: busy ? 0.6 : 1, flex: "none" as const }

  // ---- 列表页（v0.6.0 置顶分区 + v0.8.0 常用区/星标开关/有新/在案徽标；行卡复用）----
  const postRow = (p: any, pinnedRow: boolean, freq?: { starred: boolean; sess: { n: number; live: number; authors: string[] } | null } | null) => React.createElement("div", {
    key: p.id, onClick: () => open(p.id),
    style: { padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 6, background: sel === p.id ? T.brandSoft : T.surface, border: `1px solid ${sel === p.id ? T.brand : T.border}`, borderLeft: pinnedRow ? `3px solid ${T.amber}` : (freq && freq.starred ? `3px solid ${T.amber}` : undefined), boxShadow: sel === p.id ? T.shadow : "none" },
  },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      StateBadge(p.state),
      p.entry ? React.createElement("span", { style: { color: T.brand, fontSize: 12 }, title: "entry 上手入口" }, "★") : null,
      p.pinned ? React.createElement("span", { style: { color: T.amber, fontSize: 12 }, title: p.pinnedScope ? "tag 内置顶 #" + p.pinnedScope : "全局置顶" }, "📌") : null,
      React.createElement("span", { style: { fontWeight: 600, fontSize: 13.5, color: T.text1 } }, p.title),
      // 有新（v0.8.0 P1）：看过且有新楼层（append-only 计数 > 本地水位）；从未打开不标。
      isNewPost(p) ? React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, padding: "1px 6px", borderRadius: 6, background: T.blue, color: "#fff", flex: "none" }, title: "上次打开后有新回复" }, "有新") : null,
      React.createElement("span", { style: { flex: "1 1 auto" } }),
      // 在案徽标（v0.8.0 P1，host dispatchSessions 端点在位才出现）：该帖已有派活会话。
      freq && freq.sess ? React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.text2, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 6, padding: "1px 6px", flex: "none" }, title: "在案 " + freq.sess.n + " 个派活会话（" + freq.sess.authors.map((a: string) => "@" + a).join(" ") + "）" + (freq.sess.live ? " · " + freq.sess.live + " 活" : " · 冷：@ 触发冷恢复") }, "在案 " + freq.sess.n) : null,
      // 星标开关（v0.8.0 P1）：本地常用位，stopPropagation 不触发打开帖子。
      React.createElement("button", {
        onClick: (e: any) => { e.stopPropagation(); toggleStar(p.id) },
        title: (freq && freq.starred) ? "取消常用（本地星标，仅本浏览器）" : "标为常用（本地星标，仅本浏览器）",
        style: { border: "none", background: "transparent", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: "0 2px", color: (freq && freq.starred) ? T.amber : T.grayL, flex: "none" },
      }, (freq && freq.starred) ? "⭐" : "☆"),
    ),
    React.createElement("div", { style: { fontFamily: T.mono, fontSize: 11, color: T.text3, marginTop: 4 } },
      [p.assigned ? "负责 " + p.assigned : null, p.current ? "current " + p.current : null, p.answers != null ? `${p.answers}a·${p.comments}c` : null, p.pinned ? "📌" + (p.pinnedScope || "global") : null, p.id].filter(Boolean).join(" · ")),
    p.summary ? React.createElement("div", { style: { fontSize: 12, color: T.text2, marginTop: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" } }, p.summary) : null,
  )

  const listEl = React.createElement("div", null,
    posts === null ? React.createElement("div", { style: { color: T.text3, fontSize: 13 } }, "加载中…")
      : composing ? newPostForm()
        : posts.length === 0 ? React.createElement("div", { style: { color: T.text3, fontSize: 13 } }, "（无帖子）")
          : visible.length === 0 ? React.createElement("div", { style: { color: T.text3, fontSize: 13 } }, "（无匹配——调整搜索词或筛选条件）")
            : React.createElement("div", null,
                pinnedPosts.length ? React.createElement("div", { style: { marginBottom: 10 } },
                  SectionLabel(`📌 置顶 · ${pinnedPosts.length}`, T.amber),
                  React.createElement("div", { style: { marginTop: 6 } }, pinnedPosts.map((p: any) => postRow(p, true, { starred: !!stars[p.id], sess: sessOf(p.id) }))),
                ) : null,
                // 常用区（v0.8.0 P1）：个人位（本地星标 ∪ 在案推导），与制度位（📌 置顶）分层。
                freqPosts.length ? React.createElement("div", { style: { marginBottom: 10 } },
                  SectionLabel(`⭐ 常用 · ${freqPosts.length}`, T.green),
                  React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3, marginTop: 3 } }, sessIdx ? "本地星标 + dispatch 在案推导（仅本浏览器可见）" : "本地星标（host 未重启，暂无在案推导）"),
                  React.createElement("div", { style: { marginTop: 6 } }, freqPosts.map((p: any) => postRow(p, false, { starred: !!stars[p.id], sess: sessOf(p.id) }))),
                ) : null,
                listPosts.map((p: any) => postRow(p, false, { starred: !!stars[p.id], sess: sessOf(p.id) })),
              ),
  )

  // ---- 发帖表单（v0.3 目标1：用户也能发帖）----
  function newPostForm() {
    return Card([
      SectionLabel("发起新帖", T.brand),
      React.createElement("div", { key: "slug", style: { display: "flex", gap: 8, marginTop: 10 } },
        React.createElement("input", { value: fId, onChange: (e: any) => setFId(String(e.target.value || "").toLowerCase().replace(/[^a-z0-9-]/g, "-")), placeholder: "slug（可留空 = 自动生成哈希 id）", title: "留空由系统生成 12 位哈希 id；填写则用小写字母/数字/连字符", style: Object.assign({}, inp, { fontFamily: T.mono, flex: "1 1 40%" }) }),
        React.createElement("input", { value: fTag, onChange: (e: any) => setFTag(e.target.value), placeholder: "tag", style: Object.assign({}, inp, { flex: "1 1 20%" }) }),
      ),
      React.createElement("input", { key: "title", value: fTitle, onChange: (e: any) => setFTitle(e.target.value), placeholder: "标题", style: inp }),
      React.createElement("input", { key: "summary", value: fSummary, onChange: (e: any) => setFSummary(e.target.value), placeholder: "summary：一句话定位 + 资产清单", style: inp }),
      // 发帖 query 也走 MentionTextarea 统一组件（v0.7.1）：发起任务时即可 @ 帖子/工具/作者
      // 引用与召唤——与 composer 同一实现，后续新输入框直接装配本组件，不再重复适配。
      React.createElement(MentionTextarea, {
        key: "body",
        value: fBody, onChange: setFBody, rows: 5,
        sources: (() => {
          const authorSet: string[] = []
          for (const p of posts || []) {
            for (const a of [p.author, p.assigned]) {
              const s = String(a ?? "").toLowerCase()
              if (s && s !== "user" && s !== role.toLowerCase() && !authorSet.includes(s)) authorSet.push(s)
            }
          }
          return [
            { section: "作者", startsWithOnly: true, items: authorSet.map((s: string) => ({ token: s, desc: "召唤该 agent（到帖子评论区 @ 它）" })) },
            { section: "论坛帖子", items: (posts || []).map((p: any) => ({ token: "post:" + String(p.id ?? ""), desc: String(p.title ?? "") || "帖子" })) },
            { section: "host 工具", items: toolsCache.map((t: any) => ({ token: "tool:" + String(t.name ?? ""), desc: String(t.description ?? "host 工具") })) },
          ]
        })(),
        onCtrlEnter: doCreatePost,
        placeholder: "query 正文（任务定义 · 可 @post:<id> / @tool:<名> / @作者 引用与召唤）",
        style: Object.assign({}, inp, { resize: "vertical" as const }),
      }),
      React.createElement("div", { key: "foot", style: { display: "flex", gap: 8, justifyContent: "flex-end" } },
        React.createElement("button", { onClick: () => { setComposing(false); setErr(null) }, style: ghostBtn() }, "取消"),
        React.createElement("button", { onClick: doCreatePost, disabled: busy, style: btn }, "发布"),
      ),
      React.createElement("div", { key: "hint", style: { fontFamily: T.mono, fontSize: 10.5, color: T.text3, marginTop: 8 } }, `author = ${role}（身份可在下方 composer 修改）· slug 留空 = 发布后自动获得哈希 id 并直接打开新帖`),
    ], { padding: "12px 14px" })
  }

  // ---- 单输入框 composer（v0.3 目标2 + v0.4 @ 补全/派活预览）----
  function composer(p: { currentId: string | null; assigned: string | null; hasAnswers: boolean }) {
    const on = target || p.currentId
    const src = source || p.currentId
    const isComment = mode === "comment"
    const submit = isComment ? doComment : doAnswer
    const disabled = busy || !text.trim() || (isComment && !p.hasAnswers)
    const mentionsInText = parseMentions(text)
    // @ 补全候选：thread 作者（answer 作者）置首位（ADR-0003 默认配对），其余按出现序；
    // 排除自己（role）与字面 "user"（不 summon 自己/人类标签）。
    const seen: string[] = []
    const push = (x: any) => { const s = String(x ?? "").toLowerCase(); if (s && s !== "user" && s !== role.toLowerCase() && !seen.includes(s)) seen.push(s) }
    if (detail && detail.kind === "view") {
      push(detail.post.assigned); push(detail.post.author)
      for (const a of detail.post.answers) { push(a.author); for (const c of a.comments) push(c.author) }
    }
    const threadAuthor = String((detail && detail.kind === "view" ? (detail.post.answers.find((a: any) => a.id === on) || {}).author : "") || "").toLowerCase()
    const ordered = threadAuthor && seen.includes(threadAuthor) ? [threadAuthor, ...seen.filter((s) => s !== threadAuthor)] : seen
    // @ 补全交互（v0.7.1）内聚在 MentionTextarea 统一组件；这里只装配数据源（分段可插拔）。
    const composerSources = [
      { section: "作者", startsWithOnly: true, items: ordered.map((s: string) => ({ token: s, desc: s === threadAuthor ? "thread 作者（默认配对）· 派活候选" : "召唤该 agent（派活候选）" })) },
      { section: "论坛帖子", items: (posts || []).map((p: any) => ({ token: "post:" + String(p.id ?? ""), desc: String(p.title ?? "") || "帖子" })) },
      { section: "host 工具", items: toolsCache.map((t: any) => ({ token: "tool:" + String(t.name ?? ""), desc: String(t.description ?? "host 工具") })) },
    ]
    const modeBtn = (m: "comment" | "answer", label: string) => React.createElement("button", {
      onClick: () => setMode(m),
      style: { padding: "3px 10px", fontSize: 12, border: "none", cursor: "pointer", background: mode === m ? T.brandSoft : "transparent", color: mode === m ? T.brand : T.text3, fontWeight: mode === m ? 600 : 400 },
    }, label)
    const clearChip = (doClear: () => void) => React.createElement("button", { onClick: doClear, style: ghostBtn({ fontSize: 10, padding: "1px 6px", color: T.text3 }), title: "恢复默认目标" }, "✕")
    // preset 二级菜单（v0.7.0 ADR-0004）：composer 的 @ 芯片可展开选组成——动作参数不进正文。
    // 数据 = dispatchInfo 的 presets 名册（name/description/broken/trust）；broken 行禁选。
    const menuRow = (active: boolean, broken?: string) => ({ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 7, cursor: broken ? "not-allowed" : "pointer", fontSize: 12, color: broken ? T.text3 : active ? T.brand : T.text1, background: active ? T.brandSoft : "transparent", opacity: broken ? 0.6 : 1 })
    const presetMenu = (t: string) => {
      const menuDivider = (label: string) => React.createElement("div", {
        key: label, style: { fontFamily: T.mono, fontSize: 10, color: T.text3, padding: "6px 8px 2px", borderTop: `1px solid ${T.border}`, marginTop: 4 },
      }, label)
      return React.createElement("div", {
        style: { position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 30, minWidth: 280, maxHeight: 300, overflowY: "auto", background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 10, boxShadow: T.shadow, padding: 6 },
      },
        React.createElement("div", {
          key: "__default", onClick: () => { setPresetSel((s: any) => { const n = { ...s }; delete n[t]; return n }); setPresetMenuFor(null) },
          style: menuRow(!presetSel[t]),
          title: "解析链：发派选择 > config.presetRoutes > 部署默认",
        }, (!presetSel[t] ? "✓ " : "") + "部署默认（按解析链）"),
        ...roster.map((pr: any) => React.createElement("div", {
          key: pr.id,
          onClick: pr.broken ? undefined : () => { setPresetSel((s: any) => ({ ...s, [t]: pr.id })); setPresetMenuFor(null) },
          style: menuRow(presetSel[t] === pr.id, pr.broken),
          title: (pr.description ? pr.description + " · " : "") + (pr.broken ? "不可挂载：" + pr.broken : "trust " + (pr.trust ?? "?")) + " · id " + pr.id,
        }, (presetSel[t] === pr.id ? "✓ " : "") + (pr.name || pr.id) + (pr.broken ? "（broken）" : ""))),
        // 权限档区（v0.9.0，D1）：组成+权限双选同菜单；缺省 = 部署默认档；仅对新建生效。
        // permRoster 空 = 部署未挂 permission 面板，整区不出现（降级纪律）。
        ...(permRoster.length ? [
          menuDivider("── 权限档（仅新建生效；缺省 = 部署默认）"),
          React.createElement("div", {
            key: "__perm_default", onClick: () => { setPermSel((s: any) => { const n = { ...s }; delete n[t]; return n }); setPresetMenuFor(null) },
            style: menuRow(!permSel[t]),
            title: "不显式选档：新会话吃部署默认权限面（现行为）",
          }, (!permSel[t] ? "✓ " : "") + "部署默认档"),
          ...permRoster.map((pm: any) => React.createElement("div", {
            key: "perm" + pm.name,
            onClick: () => { setPermSel((s: any) => ({ ...s, [t]: pm.name })); setPresetMenuFor(null) },
            style: menuRow(permSel[t] === pm.name),
            title: (pm.description ? pm.description + " · " : "") + [pm.sandbox ? "sandbox " + pm.sandbox : null, pm.approval ? "approval " + pm.approval : null].filter(Boolean).join(" · "),
          }, (permSel[t] === pm.name ? "✓ " : "") + (pm.name || "?") + (pm.sandbox || pm.approval ? `（${[pm.sandbox, pm.approval].filter(Boolean).join(" + ")}）` : ""))),
        ] : []),
      )
    }
    return Card([
      React.createElement("div", { key: "head", style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 } },
        SectionLabel("撰写", T.brand),
        React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 } },
          React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10.5, color: T.text3 } }, "身份"),
          React.createElement("input", { value: role, onChange: (e: any) => setRole(e.target.value), style: { fontFamily: T.mono, fontSize: 12, padding: "2px 8px", width: 110, borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface2, color: T.text1, outline: "none" }, title: "发帖/认领/评论/巩固的作者名" }),
        ),
        p.assigned === role
          ? MonoChip("已认领 " + p.assigned, true, "assigned = 当前身份")
          : React.createElement("button", { onClick: doClaim, disabled: busy, style: ghostBtn({ fontSize: 11, padding: "2px 8px" }), title: "乐观认领：assigned = 当前身份" }, "认领此帖"),
        React.createElement("span", { style: { marginLeft: "auto", display: "inline-flex", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", flex: "none" } },
          modeBtn("comment", "评论 · 草稿"), modeBtn("answer", "巩固 · answer"),
        ),
      ),
      isComment && !p.hasAnswers
        ? React.createElement("div", { key: "noans", style: { fontFamily: T.mono, fontSize: 11, color: T.amber, marginBottom: 8 } }, "暂无 answer——切到「巩固」发出首条 answer 后，评论（草稿）才可用。")
        : null,
      React.createElement(MentionTextarea, {
        value: text, onChange: (value: string) => {
          if (value && sel && !draftAnchor.current) draftAnchor.current = { post: sel, current: currentOf() }
          if (!value) draftAnchor.current = null
          setText(value)
        }, rows: 3, inputRef: taRef,
        sources: composerSources,
        onCtrlEnter: () => { if (!disabled) submit() },
        placeholder: isComment
          ? (p.hasAnswers ? `评论（草稿）→ 挂在 ${on} 下 · @agent 派活 · Ctrl+Enter 发送` : "暂无 answer 可评论")
          : `answer 正文（巩固 → current 移到新 answer）${src ? " · 源 " + src : " · 首条（root）"} · Ctrl+Enter 发送`,
        style: Object.assign({}, inp, { resize: "vertical" as const, marginBottom: 6 }),
      }),
      React.createElement("div", { key: "act", style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
        isComment
          ? React.createElement(React.Fragment, null,
              MonoChip(`→ 草稿 · 挂在 ${on || "?"}`, false, "评论目标 answer"),
              target ? clearChip(() => setTarget(null)) : null,
              // 派活目标芯片（v0.7.0）：可点开二级菜单选 preset——选择作为 dispatch 参数，
              // 正文保持 @author 纯净；「默认组成」= 解析链（选择 > config.presetRoutes > 默认）。
              // ⚠️ 条件展开的空分支必须是 [] 不能是 null——数组展开 ...null 直接 TypeError
              //（重启后详情页整页空白的根因；其余三处展开均 `|| []` 形状，见自检 grep）。
              ...(mentionsInText.length ? mentionsInText.map((t: string) => React.createElement("span", { key: "tg" + t, style: { display: "inline-flex", position: "relative" } },
                React.createElement("button", {
                  onClick: () => {
                    setPresetMenuFor(presetMenuFor === t ? null : t)
                    // 核查轮 #1：菜单先开、名册可能还没到（预览防抖 300ms）→ 点开即补拉一次。
                    // v0.9.1：补拉同时缓存权限档名册（否则权限区要等预览防抖才出现，点开瞬时不可见）。
                    if ((!roster.length || !permRoster.length) && dispatchInfoAvailable && sel) {
                      Promise.resolve(forumKb.dispatchInfo({ post: sel })).then((r: any) => {
                        const v = r && r.value ? r.value : r
                        if (v && Array.isArray(v.presets) && v.presets.length) setRoster(v.presets)
                        if (v && Array.isArray(v.permissions)) setPermRoster(v.permissions)
                      }).catch(() => {})
                    }
                  },
                  style: { fontFamily: T.mono, fontSize: 11, padding: "1px 7px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", background: T.brand, color: "#fff", border: `1px solid ${T.brand2}` },
                  title: "发派组成 + 权限（点击选；解析链 = 选择 > 路由表 > 部署默认；权限档缺省 = 部署默认；均仅对新建生效）",
                }, "@" + t + " · " + (presetSel[t] ? presetLabelOf(presetSel[t]) : "默认组成") + (permSel[t] ? " · " + permSel[t] : "")),
                presetMenuFor === t ? presetMenu(t) : null,
              )) : []),
            )
          : React.createElement(React.Fragment, null,
              MonoChip(src ? `→ answer · 源 ${src}` : "→ answer · 首条（root）", false, "新 answer 的 source 软引用"),
              source ? clearChip(() => { setSource(null); setRel("supersedes") }) : null,
              src ? REL_OPTS.map((o) => React.createElement("button", {
                key: o.v, onClick: () => setRel(o.v),
                title: REL_LABEL[o.v] + " " + src,
                style: { fontFamily: T.mono, fontSize: 10.5, padding: "1px 7px", borderRadius: 6, cursor: "pointer", border: `1px solid ${rel === o.v ? T.brand2 : T.border}`, background: rel === o.v ? T.brandSoft : T.surface, color: rel === o.v ? T.brand : T.text3 },
              }, o.l)) : null,
            ),
        React.createElement("span", { style: { flex: "1 1 auto" } }),
        React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3, marginRight: 4 } }, isComment ? "评论不入 current" : "巩固会移动 current"),
        React.createElement("button", { onClick: submit, disabled, style: Object.assign({}, btn, { opacity: disabled ? 0.5 : 1 }) }, isComment ? "发送评论" : "巩固为 answer"),
      ),
    ], { padding: "12px 14px", marginTop: 12 })
  }

  // preset 名显示（v0.7.0）：id → 名册 name（名册未到位时回退 id 本身）。
  const presetLabelOf = (id: string) => {
    const row = roster.find((x: any) => x.id === id)
    return (row && row.name) || id
  }

  // 发派前预览行（v0.7.0 ADR-0004）：dispatchInfo preview 逐 target 三态 + 组成 + 模型；
  // broken 标红；「在案不换组成」类提示进 title。
  // v0.9.3 对齐（真机复测立案）：芯片显示「你选的值」，预览显示 host 解析的「将生效值」——
  // 在案目标选择仅对新建生效，两处读起来不一致。修法 = 同行并陈：在案行把本地选择标注
  // 「仅新建生效」，并明确「现存沿原组成/原档」，芯片与预览不再各说各话。
  const dangerChipStyle = { fontFamily: T.mono, fontSize: 11, color: T.danger, background: T.dangerBg, border: `1px solid ${T.dangerBd}`, borderRadius: 6, padding: "2px 8px" }
  const previewLine = infoData && Array.isArray(infoData.preview) && infoData.preview.length
    ? React.createElement("div", { style: { marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" } },
        React.createElement("span", { style: { fontFamily: T.mono, fontSize: 10, color: T.text3 } }, "发派前预览"),
        ...infoData.preview.map((r: any, i: number) => {
          const actionLabel = r.action === "created" ? "新会话" : r.action === "resumed" ? "冷恢复" : "现存·续聊"
          const inCase = r.action !== "created"
          const selPreset = presetSel[r.target]
          const selPerm = permSel[r.target]
          const presetLabel = r.preset ? ((r.preset.name || r.preset.id) + (r.preset.broken ? " · broken" : "")) : "?"
          const presetTag = inCase && (r.route === "selection" || selPreset) ? `${presetLabel}（现存沿原组成）` : presetLabel
          const modelLabel = r.model && r.model.provider ? ` · ${r.model.provider}/${r.model.model}` : ""
          const permLabel = inCase
            ? (selPerm ? ` · 权限 ${selPerm}（仅新建生效·现存沿原档）` : (r.permission && r.permission.name ? ` · 权限 ${r.permission.name}` : " · 沿会话权限"))
            : (r.permission && r.permission.name ? ` · 权限 ${r.permission.name}` : "")
          const label = `@${r.target} · ${actionLabel} · ${r.route === "selection" ? "选定 " : r.route === "routes" ? "路由 " : ""}${presetTag}${modelLabel}${permLabel}`
          const tip = (r.note ? r.note + " · " : "") + [r.preset && r.preset.description ? r.preset.description : "发派组成预览", r.permission && r.permission.description ? r.permission.description : null].filter(Boolean).join(" · ")
          if (r.preset && r.preset.broken) return React.createElement("span", { key: i, style: dangerChipStyle, title: tip }, label)
          return MonoChip(label, false, tip)
        }),
      )
    : null

  // ---- 派活回执行（dispatch 之后显示在 composer 下）----
  const dispatchLine = dispatching || (dispatchOut && dispatchOut.length)
    ? React.createElement("div", { style: { marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" } },
        dispatching ? React.createElement("span", { style: { fontFamily: T.mono, fontSize: 11, color: T.text3 } }, "派活中…") : null,
        ...(dispatchOut || []).map((o: any, i: number) => o.ok
          ? MonoChip(`已派 @${o.target} · ${o.action === "created" ? "新会话" : o.action === "resumed" ? "冷恢复" : "现存会话·续聊"}${o.permission ? " · 权限 " + o.permission : ""}`, true, "sessionId " + (o.sessionId ?? "") + (o.action === "live" ? "（增量派活：只递新评论 + 触发评论）" : "") + (o.permission ? "（已落权限档 " + o.permission + "）" : ""))
          : React.createElement("span", { key: i, style: { fontFamily: T.mono, fontSize: 11, color: T.danger, background: T.dangerBg, border: `1px solid ${T.dangerBd}`, borderRadius: 6, padding: "2px 8px" } }, `@${o.target} 派活失败：${o.error ?? "?"}`)),
      )
    : null

  // ---- 组装 ----
  let body: any = null
  if (sel === null) body = listEl
  else if (detail === null) body = React.createElement("div", { style: { color: T.text3, fontSize: 13 } }, "加载中…")
  else if (detail.kind === "view") {
    const post = detail.post
    body = React.createElement("div", null,
      PostHeader(post, pinAvailable ? { onPin: doPin } : null, inCase, { starred: !!stars[post.id], onToggle: () => toggleStar(post.id) }),
      refsData ? RefsPanel(refsData, open)
        : refsErr ? React.createElement("div", { style: { marginTop: 10, fontFamily: T.mono, fontSize: 11, color: T.text3, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 9px" } }, "refs 面板加载失败：" + refsErr)
          : null,
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 } },
        post.query ? QueryCard(post.query) : null,
        ...post.answers.map((a: any) => AnswerCard(a, { onComment: onAnswerComment, onQuote: onAnswerQuote })),
        post.answers.length === 0 ? React.createElement("div", { style: { color: T.text3, fontSize: 13 } }, "（暂无 answer）") : null,
      ),
      composer({ currentId: currentOf(), assigned: post.assigned, hasAnswers: post.answers.length > 0 }),
      previewLine,
      dispatchLine,
    )
  } else {
    const cur = currentOf()
    body = React.createElement("div", null,
      Card([
        SectionLabel("markdown 回退", T.grayL),
        detail.viewError ? React.createElement("div", { key: "verr", style: { marginTop: 6, padding: "6px 9px", borderRadius: 8, background: T.dangerBg, border: `1px solid ${T.dangerBd}`, color: T.danger, fontSize: 12, fontFamily: T.mono, wordBreak: "break-word" } }, "view 失败原因：" + detail.viewError) : null,
        React.createElement("div", { key: "md", style: { whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13, lineHeight: 1.6, color: T.text1, marginTop: 8 } }, detail.markdown),
      ], { padding: "12px 14px" }),
      composer({ currentId: cur, assigned: assignedOf(), hasAnswers: cur != null }),
    )
  }

  return React.createElement("div", { style: wrap, ref: rootRef, "data-forum-kb": BUILD, onClick: (e: any) => handleRefClick(e, onRef) },
    React.createElement("style", { key: "md-css" }, MD_CSS),
    SubNav({
      inDetail: sel !== null,
      title: detail && detail.kind === "view" ? detail.post.title : (posts || []).find((x: any) => x.id === sel)?.title,
      state: detail && detail.kind === "view" ? detail.post.state : undefined,
      shown: visible.length,
      count: posts ? posts.length : null,
      busy,
      onBack: () => { loopRef.current?.invalidate(); setSel(null); setDetail(null); setErr(null) },
      onNew: () => { setComposing(true); setErr(null) },
      onRefresh: () => { void loopRef.current?.request() },
    }),
    sel === null ? FilterBar({
      q, onQ: setQ,
      fState: fltState, onState: setFltState,
      fTag: fltTag, onTag: setFltTag,
      tags: allTags,
      fEntry: fltEntry, onEntry: setFltEntry,
      fSort: fltSort, onSort: setFltSort,
      searching,
      ftsAvailable,
      hasTerm: !!term,
    }) : null,
    React.createElement("div", { style: { minHeight: 20, padding: "2px 16px", fontSize: 11, color: syncErr ? T.danger : T.text3 }, role: "status" }, syncErr || "页面可见时每 5 秒自动同步"),
    React.createElement("div", { style: { ...scroll, overflowAnchor: "none" } }, errBar, body),
  )
}

// 硬依赖 slots + remote + inputTriggers；remote.forumKb 由本插件 apply 里自行 $mount 后
// ctx.get 取用——不能写进 inject（挂载前无人提供，会永远 waiting）。
// inputTriggers（核查轮 #4 终修）：client loader 与 host 侧同样执行 inject 契约——未声明时
// ctx.get 直接抛 `cannot get property "inputTriggers" without inject`（human 控制台日志坐实），
// 重试多少次都过不了这道门。该服务随部署 web 组合必有（InputBar 触发管线 = ui-input-trigger
// 提供），进 inject 让 apply 等它就绪再跑；package.json 的 dsh.client.inject 同步补载入序。
// retry 循环保留作兜底：inject 就绪后首轮即命中，服务异常缺席时降级并告警。
export const inject = ["slots", "remote", "inputTriggers"]

export function apply(ctx: any) {
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(TYPERT_REMOTE)
    const forumKb = ctx.get("remote.forumKb")
    if (forumKb === undefined) return dispose
    const unregister = ctx.slots.inject("conversation.view", () => ctx.slots.register(
      { name: "conversation.view", id: "forum-kb", order: 20, label: "论坛" },
      () => React.createElement(ForumView, { forumKb }),
    ))
    const unregisterMain = ctx.slots.inject("main", () => ctx.slots.register(
      { name: "main", key: "forum-kb" },
      () => React.createElement(ForumView, { forumKb }),
    ))
    const unregisterSidebar = ctx.slots.inject("sidebar.panellist", () => ctx.slots.register(
      { name: "sidebar.panellist", id: "forum-kb", order: 20, label: "论坛" },
      ({ size = 20 }: any) => React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, "aria-hidden": true },
        React.createElement("path", { d: "M4 4h16v12H9l-5 4V4zM8 8h8M8 12h6" })),
    ))
    // 主输入框 @ 候选源（v0.7.0 ADR-0004 决策4）：纯增量注册到 input-trigger 管线。
    // 核查轮 #4：初版 apply 时 ctx.get("inputTriggers") 一次性探测——若本插件先于
    // ui-input-trigger 提供服务，注册被静默跳过且不再重试。改为短周期重试（10s×500ms），
    // 命中/缺席都有 console 日志可观测；永不阻塞面板挂载（不进 module inject）。
    let unregisterSource: any
    let retryTimer: any = null
    let attempts = 0
    let disposed = false
    const tryRegisterSource = () => {
      if (disposed) return
      try {
        const triggers = (ctx as any).inputTriggers ?? ctx.get("inputTriggers")
        // 核查轮 #4 终修之二：契约面是 registerSource（contract.d.ts："sources see
        // registerSource alone"）——初版想当然写 register，恒 undefined → 误报「服务缺席」。
        const registerFn = triggers && typeof triggers.registerSource === "function"
          ? triggers.registerSource.bind(triggers)
          : triggers && typeof triggers.register === "function"
            ? triggers.register.bind(triggers)
            : undefined
        if (registerFn) {
          unregisterSource = registerForumRefSource(registerFn, forumKb)
          try { console.info("[forum-kb] 主输入框 @ 候选源已注册（forum-kb 分组：帖子/工具/作者；@file 走随部署的统一引用源）") } catch { /* 无 console 环境 */ }
          return
        }
        if (triggers) {
          // 服务在、形状不符：打印实际键位便于对契约，不再盲目重试。
          try { console.warn("[forum-kb] inputTriggers 形状不符（期待 registerSource）——实际键：" + Object.keys(triggers).join(",")) } catch { /* 同上 */ }
          return
        }
        if (attempts < 20) { attempts += 1; retryTimer = setTimeout(tryRegisterSource, 500); return }
        try { console.warn("[forum-kb] inputTriggers 服务缺席——主输入框 @ 候选未注册（论坛功能不受影响）") } catch { /* 同上 */ }
      } catch (e) {
        try { console.warn("[forum-kb] @ source 注册异常", e) } catch { /* 同上 */ }
      }
    }
    tryRegisterSource()
    return () => {
      disposed = true
      try { if (retryTimer) clearTimeout(retryTimer) } catch { /* 已清理 */ }
      try { if (typeof unregisterSource === "function") unregisterSource() } catch { /* 已随管线清理 */ }
      if (typeof unregister === "function") unregister()
      if (typeof unregisterMain === "function") unregisterMain()
      if (typeof unregisterSidebar === "function") unregisterSidebar()
      return dispose()
    }
  }, "forum-kb: mount remote.forumKb + register conversation.view")
}

// ---- 主输入框 @ 候选源（v0.7.0 ADR-0004 决策4）----
// 注册到 dsh-client-ui-input-trigger 管线（trigger '@'，source name 'forum-kb'）：候选 =
// 论坛帖子 / host 工具 / 论坛作者（@file 由随部署的 ui-reference 统一源提供，不重复建设）。
// 选中 = ReferenceInsert 芯片入 draft；发送时 codec 展开指针文本——帖子带 kb_view 自读指引，
// 不装内容（主动读不被动灌）。菜单插入的引用走 occurrence + codec；手打裸 token 不展开
//（无 occurrence），语义仍是普通文本。registerFn = 服务契约面 registerSource（bind 后传入）。
function registerForumRefSource(registerFn: (src: any) => (() => void) | undefined, forumKb: any): (() => void) | undefined {
  const cache: { posts: any[]; tools: any[]; at: number } = { posts: [], tools: [], at: 0 }
  const refresh = async () => {
    try {
      const rows = await Promise.resolve(forumKb.list()).then((r: any) => { const v = r && r.value ? r.value : r; return Array.isArray(v) ? v : [] })
      const tools = typeof forumKb.toolIndex === "function"
        ? await Promise.resolve(forumKb.toolIndex()).then((r: any) => { const v = r && r.value ? r.value : r; return Array.isArray(v) ? v : [] }).catch(() => [])
        : []
      cache.posts = rows; cache.tools = tools; cache.at = Date.now()
    } catch { /* 数据缺席 = 候选为空，不影响聊天 */ }
  }
  void refresh()
  const iv: any = typeof setInterval === "function" ? setInterval(() => { void refresh() }, 120000) : undefined
  const source = {
    trigger: "@",
    name: "forum-kb",
    order: 20,
    showGroupTitle: true,
    async candidates(_session: any, req: any) {
      // 自检修缺：stale 时 await 而非 fire-and-forget——初版首敲 @ 菜单必为空（缓存未热）。
      if (Date.now() - cache.at > 60000) await refresh()
      const q = String((req && req.query) ?? "").toLowerCase()
      const match = (s: string) => !q || s.toLowerCase().includes(q)
      const out: any[] = []
      for (const p of cache.posts) {
        if (match(p.id) || match(String(p.title ?? ""))) {
          out.push({ name: "post:" + p.id, description: String(p.title ?? "") + (p.summary ? " — " + String(p.summary).slice(0, 60) : ""), section: "论坛帖子", value: "@post:" + p.id })
        }
      }
      for (const t of cache.tools) {
        if (match(t.name)) out.push({ name: "tool:" + t.name, description: t.description || "host 工具", section: "host 工具", value: "@tool:" + t.name })
      }
      const authors: string[] = []
      for (const p of cache.posts) {
        for (const a of [p.author, p.assigned]) {
          const s = String(a ?? "").toLowerCase()
          if (s && s !== "user" && !authors.includes(s)) authors.push(s)
        }
      }
      for (const a of authors) {
        if (match(a)) out.push({ name: a, description: "论坛作者（召唤/派活在帖子评论区 @ 它）", section: "论坛作者", value: "@" + a })
      }
      return out.slice(0, 12)
    },
    onPick(pick: any) {
      const value = String((pick && pick.candidate && pick.candidate.value) ?? "")
      if (!value) return undefined
      return { insert: { source: "forum-kb", ref: value, label: value, clipboardText: value } }
    },
    codec: {
      clipboardText(ref: string) { return String(ref ?? "") },
      async serialize(ref: string) {
        const s = String(ref ?? "")
        const m = /^@post:(.+)$/.exec(s)
        if (m) {
          let title = ""
          try {
            const v = await Promise.resolve(forumKb.view(m[1])).then((r: any) => (r && r.value ? r.value : r))
            title = v && v.title ? `「${v.title}」` : ""
          } catch { /* 标题缺席不阻塞发送 */ }
          return `forum-kb 帖子 ${m[1]}${title} · 需要详情时用 kb_view（post=${m[1]}）自读`
        }
        const t = /^@tool:(.+)$/.exec(s)
        if (t) {
          const row = cache.tools.find((x: any) => x.name === t[1])
          return `host 工具 ${t[1]}${row && row.description ? "：" + row.description : ""}`
        }
        const a = /^@([a-z0-9][a-z0-9_-]{0,63})$/i.exec(s)
        if (a) return `论坛作者 ${a[1]}（召唤/派活：到相关帖子的评论区 @ 它）`
        return s
      },
    },
  }
  const off = registerFn(source)
  return () => {
    if (typeof iv === "number" || typeof iv === "object") { try { clearInterval(iv) } catch { /* 已清理 */ } }
    if (typeof off === "function") off()
  }
}
