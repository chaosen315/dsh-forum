// @deepseek-ai/dsh-tool-forum-kb
// host 半：注册 forum-kb 的 12 个模型工具（query/search/view/post/claim/answer/comment/state/subscribe/pin/tag/summary）。
// 提供工具、不提供服务 → 部署级 global 层 / agent preset 松散行均可，无需 isolate realm。
// 数据通路：全部走 `subprocess` spawn node 跑 tools/kb.js（Windows 无 bash）。读分两档：
// 列表层 kb_query/kb_search（无正文）与投影层 kb_view（scope=head 默认 = ADR-0002 §2 阅读边界，
// spine 沿 source 反向链，full 全量；评论默认零装载）。agent 读帖走 kb_view，不 read posts/*.md 全文
// （md 是给人类 diff 的生成物）。v0.4.0：kb_query 增 sort/pinned 参数、新增 kb_pin
//（置顶 pinned+pinned_scope、排序 --sort new/active/top）。
// v0.4.1：新增 kb_tag（tag 增删 CLI 闭合后的工具面透传，
// 幂等；--remove 拒拆 pinned_scope 引用中的 tag——约束在 tools/kb.js cmdTag）。
// v0.4.2：新增 kb_summary（CLI `kb summary` 子命令早已存在而工具面缺位；照抄 kb_state reg
// 模式 spawn 透传 `kb summary <post-id> --body-b64`，约束在 cmdSummary：整条替换 + rerender）。
import { defineTool } from '@deepseek-ai/dsh-tools'
import { existsSync } from 'node:fs'

const name = '@deepseek-ai/dsh-tool-forum-kb'

// body 经 subprocess.spawn argv 传给 tools/kb.js 时，Windows 下 argv→命令行字符串
// 会损坏嵌入的双引号（尾部截断）。改走 --body-b64（base64 仅含 A-Za-z0-9+/=，argv 安全）。
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64')
// 硬依赖 host 基座服务：`ctx.tools` 是属性访问，必须进 inject（否则 Loader 抛
// cannot get property "tools" without inject）；fs/subprocess 声明后 apply 等
// 三者就绪才跑，免去「未就绪 → 静默 return → 一行工具都不注册」的隐患。
const inject = ['fs', 'subprocess', 'tools']

function apply(ctx, config = {}) {
  const fs = ctx.fs
  const subprocess = ctx.subprocess

  // KB 根解析（与 dsh-forum-kb 同序，首个含 kb.sqlite 或 posts/ 的候选胜出，分发友好不写死路径）：
  // config.kbRoot（工具行）→ FORUM_KB_ROOT 环境变量 → <workspaceRoot>/forum-kb → <cwd>/forum-kb。
  const norm = (p) => String(p).replace(/\\/g, '/')
  const candidates = []
  const cfgRoot = config && typeof config.kbRoot === 'string' ? config.kbRoot.trim() : ''
  if (cfgRoot) candidates.push(norm(cfgRoot))
  const envRoot = process.env.FORUM_KB_ROOT
  if (envRoot && envRoot.trim()) candidates.push(norm(envRoot.trim()))
  const sp = ctx.get('sandboxPolicy')
  if (sp && sp.workspaceRoot) candidates.push(norm(sp.workspaceRoot) + '/forum-kb')
  candidates.push(norm(process.cwd()) + '/forum-kb')
  const kbExists = (p) => existsSync(p + '/kb.sqlite') || existsSync(p + '/posts')
  const KB = candidates.find(kbExists) || candidates[candidates.length - 1]
  const kbMissing = !candidates.some(kbExists)
  const kbGuide = 'forum-kb 数据目录未找到（按序尝试：' + candidates.join(' → ') +
    '）。修复任一即可：① 环境变量 FORUM_KB_ROOT（或工具行 config.kbRoot）指向 forum-kb 目录（须含 kb.sqlite 与 posts/）；② 从 forum-kb 所在目录启动 dsh。'

  function parseFm(text) {
    const out = {}
    const lines = text.split('\n')
    if (lines[0] !== '---') return out
    for (let i = 1; i < lines.length && lines[i] !== '---'; i++) {
      const idx = lines[i].indexOf(':')
      if (idx > 0) out[lines[i].slice(0, idx).trim()] = lines[i].slice(idx + 1).trim()
    }
    return out
  }

  async function listPosts() {
    if (kbMissing) throw new Error(kbGuide)
    const dir = await fs.resolve(KB + '/posts')
    const entries = await fs.listDir(dir)
    const posts = []
    for (const e of entries) {
      if (e.type !== 'file' || !e.name.endsWith('.md')) continue
      const text = await fs.readText(e.target)
      const fm = parseFm(text)
      posts.push({
        id: e.name.slice(0, -3),
        title: fm.title || e.name,
        state: fm.state || '',
        current: fm.current || null,
        assigned: fm.assigned || null,
        entry: fm.entry === 'true' ? 1 : 0,
        pinned: fm.pinned === 'true' ? 1 : 0,
        pinnedScope: fm.pinned_scope || null,
        summary: fm.summary || '',
      })
    }
    posts.sort((a, b) => (a.id < b.id ? -1 : 1))
    return posts
  }

  async function runKb(args) {
    if (kbMissing) throw new Error(kbGuide)
    let nodePath
    try { nodePath = await subprocess.resolveExecutable('node') }
    catch (e) { throw new Error('resolve node: ' + (e && e.message)) }
    let handle
    try {
      handle = subprocess.spawn({
        argv: [nodePath, 'tools/kb.js'].concat(args),
        cwd: KB,
        stdio: { stdin: 'ignore', stdout: { maxBytes: 500000 }, stderr: { maxBytes: 500000 } },
        graceMs: 5000,
      })
    } catch (e) { throw new Error('spawn: ' + (e && e.message)) }
    const outcome = await handle.done
    const text = handle.collected.stdout ? handle.collected.stdout.readFrom(0).text : ''
    const err = handle.collected.stderr ? handle.collected.stderr.readFrom(0).text : ''
    if (outcome.exitCode !== 0) throw new Error(err || text || ('exit ' + outcome.exitCode))
    return text
  }

  function textOutput() {
    return { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] }
  }
  function reg(n, description, parameters, build) {
    ctx.tools.register(defineTool({
      name: n, description, parameters,
      output: textOutput(),
      async execute(args) { return runKb(build(args)) },
    }))
  }

  reg('kb_query', '查询 forum-kb 帖子（结构化过滤，返回帖子列表文本）。', {
    tag: { type: 'string', description: '按标签过滤' },
    state: { type: 'string', description: 'active | waiting | done | archived' },
    assigned: { type: 'string', description: '按负责 agent 过滤' },
    entry: { type: 'boolean', description: '只看 entry 上手帖' },
    pinned: { type: 'boolean', description: '只看置顶帖' },
    sort: { type: 'string', description: '排序：default（id 序，缺省）| new（创建新→旧）| active（更新新→旧）| top（answer+评论多→少）' },
  }, (a) => {
    const o = ['query']
    if (a.tag) o.push('--tag', a.tag)
    if (a.state) o.push('--state', a.state)
    if (a.assigned) o.push('--assigned', a.assigned)
    if (a.entry) o.push('--entry')
    if (a.pinned) o.push('--pinned')
    if (a.sort) o.push('--sort', a.sort)
    return o
  })

  reg('kb_search', '全文搜索 forum-kb 帖子内容（FTS5）。', {
    term: { type: 'string', required: true, description: '搜索关键词' },
  }, (a) => ['search', a.term])

  reg('kb_view', '读一个帖子的结构化投影（只读，读帖唯一入口，勿 read posts/*.md 全文）。回 post 元数据 + query + answers（source 软引用链 / current 标记）。scope=head（默认）只装阅读边界 summary+query+current 单条 answer；scope=spine 追加沿 source 反向链到 root（追问「为何走到这」时的显式动作）；scope=full 全部 answer（兜底/对账）。评论默认零装载（草稿面），comments=on 才附 scope 内 answer 的评论线程——仅当 current 正文显式引用了某条评论。', {
    post: { type: 'string', required: true, description: '帖子 id（slug 或哈希）' },
    scope: { type: 'string', description: 'head（默认）| spine | full' },
    comments: { type: 'string', description: 'none（默认）| on：附 scope 内 answer 的评论线程' },
  }, (a) => ['view', a.post, '--scope', a.scope || 'head', '--comments', a.comments || 'none'])

  reg('kb_post', '在 forum-kb 新建一个帖子（发起任务）。id 可省略：缺省由系统生成哈希 id（12 位 hex，创建结果的 ✓ 行里可见），帖子标识不再依赖人工命名的小写词组。', {
    id: { type: 'string', description: '帖子 slug（可省略 = 自动生成哈希 id）' },
    title: { type: 'string', required: true },
    author: { type: 'string', required: true },
    tag: { type: 'string', required: true },
    summary: { type: 'string', required: true, description: '一句话定位 + 资产清单' },
    body: { type: 'string', required: true, description: 'query 正文' },
    depends_on: { type: 'string', description: '可选：跨帖引用索引，JSON 数组字符串 [{kind:"post"|"doc",id,anchor?}]' },
  }, (a) => {
    const o = ['post']
    if (a.id) o.push(a.id)
    o.push('--title', a.title, '--author', a.author, '--tag', a.tag, '--summary', a.summary, '--body-b64', b64(a.body))
    if (a.depends_on) o.push('--depends-on-b64', b64(a.depends_on))
    return o
  })

  reg('kb_claim', '乐观认领一个帖子（设 assigned=自己）。', {
    post: { type: 'string', required: true },
    as: { type: 'string', required: true, description: '认领的 agent 名' },
    body: { type: 'string', description: '可选认领说明' },
  }, (a) => { const o = ['claim', a.post, '--as', a.as]; if (a.body) o.push('--body-b64', b64(a.body)); return o })

  reg('kb_answer', '给帖子新增一条 answer（交接/巩固），并移动 current。', {
    post: { type: 'string', required: true },
    as: { type: 'string', required: true },
    source: { type: 'string', required: true, description: '软引用的先前 reply id' },
    rel: { type: 'string', required: true, description: 'extends | supersedes | relates-to' },
    body: { type: 'string', required: true },
  }, (a) => ['answer', a.post, '--as', a.as, '--source', a.source, '--rel', a.rel, '--body-b64', b64(a.body)])

  reg('kb_comment', '在帖子的某 answer 评论区新增一条评论。', {
    post: { type: 'string', required: true },
    as: { type: 'string', required: true },
    on: { type: 'string', required: true, description: '目标 answer id' },
    body: { type: 'string', required: true },
  }, (a) => ['comment', a.post, '--as', a.as, '--on', a.on, '--body-b64', b64(a.body)])

  reg('kb_state', '修改帖子状态（active/waiting/done/archived）。', {
    post: { type: 'string', required: true },
    state: { type: 'string', required: true },
  }, (a) => ['state', a.post, '--state', a.state])

  reg('kb_pin', '置顶/取消置顶（pinned=展示位，与 entry 上手入口并存）。scope 缺省=global 全局置顶；tag 名=tag 内置顶（须为该帖 tags 之一）。', {
    post: { type: 'string', required: true },
    set: { type: 'string', required: true, description: 'on | off' },
    scope: { type: 'string', description: 'global（缺省）| tag 名' },
  }, (a) => { const o = ['pin', a.post, '--set', a.set]; if (a.scope) o.push('--scope', a.scope); return o })

  reg('kb_tag', '增删帖子的 tag（幂等：已存在/不存在跳过）。--remove 若该 tag 正被本帖 pin 的 scoped 置顶引用会拒绝，需先 kb pin off 再移。二参恰选其一。', {
    post: { type: 'string', required: true },
    add: { type: 'string', description: '要添加的 tag（与 remove 二选一）' },
    remove: { type: 'string', description: '要移除的 tag（与 add 二选一）' },
  }, (a) => {
    const o = ['tag', a.post]
    if (a.add) o.push('--add', a.add)
    if (a.remove) o.push('--remove', a.remove)
    return o
  })

  reg('kb_summary', '更新帖子 summary（整条替换，非追加；必须单行——CR/LF 会破坏 frontmatter，CLI 直接拒绝；同值幂等跳过）。用途：收尾「资产结晶」（summary = 一句话定位 + 资产清单）、策展校准过时入口。纪律：改他人帖 summary 前先 kb_comment 说明理由再动手；summary 是 head 阅读边界的一部分，更新后接手者首读即见。', {
    post: { type: 'string', required: true },
    summary: { type: 'string', required: true, description: '新 summary 全文（整条替换）' },
  }, (a) => ['summary', a.post, '--body-b64', b64(a.summary)])

  reg('kb_subscribe', '订阅管理（add/check/list/remove）或临时查询变更。', {
    sub: { type: 'string', required: true, description: 'add | check | list | remove' },
    tag: { type: 'string' },
    post: { type: 'string' },
  }, (a) => { const o = ['subscribe', a.sub]; if (a.tag) o.push('--tag', a.tag); if (a.post) o.push('--post', a.post); return o })
}

export { apply, inject, name }
