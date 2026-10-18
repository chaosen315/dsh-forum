// 载入演示样例 KB：1 tag「forum-kb」（插件说明 + 委托模板 + 5 帖开发史样例）+ 身份登记帖。
// 结束时自动渲染 posts/。默认拒绝覆盖已有 kb.sqlite；确认重建加 --force。要空库请用 tools/init.js。
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { renderAll } = require('./render.js');
const identityPost = require('./identity-registry.js');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'kb.sqlite');
const force = process.argv.includes('--force');
if (fs.existsSync(DB_PATH) && !force) {
  console.error(`✗ 已存在 ${DB_PATH}，seed 未做任何改动（seed 会重建整库）。载入样例请加 --force；要空库请用 node tools/init.js。`);
  process.exit(1);
}
if (fs.existsSync(DB_PATH)) fs.rmSync(DB_PATH);
const db = new DatabaseSync(DB_PATH);
db.exec(fs.readFileSync(path.join(ROOT, 'schema.sql'), 'utf8'));

const T = '2026-01-15 00:00:00'; // 固定时间戳，保证 seed 可复现（固定测试床）
const insertPost = db.prepare(
  `INSERT INTO posts (id, title, author, tags, state, current, assigned, entry, summary, depends_on, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertReply = db.prepare(
  `INSERT INTO replies (post_id, id, kind, author, parent, source, source_rel, body, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

function post(p) {
  insertPost.run(
    p.id, p.title, p.author, JSON.stringify(p.tags), p.state,
    p.current ?? null, p.assigned ?? null, p.entry ? 1 : 0, p.summary, JSON.stringify(p.depends_on ?? []), T, T
  );
  for (const r of p.replies) {
    insertReply.run(p.id, r.id, r.kind, r.author, r.parent ?? null, r.source ?? null, r.source_rel ?? null, r.body, T);
  }
}

post({
  id: 'onboard-forum-kb',
  title: '上手：forum-kb 是什么、怎么读、怎么接手',
  author: 'human',
  tags: ['forum-kb'],
  state: 'active',
  current: 'a2',
  assigned: null,
  entry: false, // entry 起点已移交 welcome-forum-plugin；本帖保留为「阅读协议」参考帖
  summary: 'forum-kb 的推荐上手起点。资产：流程[阅读协议：正向读=上手、反向读=接手] 决策[一切皆是帖子、载体=SQLite+git+md] 工件[SPEC.md/CONCEPT.md/CONTEXT.md/FORMAT.md/ADR-0001]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '帮我快速上手 forum-kb：它是什么、核心原则是什么、接手一个新任务前该读哪些文件、该怎么读。' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, body: 'forum-kb 是一个 git-native、论坛形式的任务知识库，唯一原语是「帖子」。核心原则见 ADR-0001「一切皆是帖子」：项目=标签、管理=帖子、监控=帖子。上手四样文件：SPEC.md（目标）、CONCEPT.md（决策轨迹）、CONTEXT.md（术语）、docs/adr/0001（核心原则）。阅读协议：正向读（query→current）=上手，反向读（current→query）=接手，默认跳过评论。' },
    { id: 'a2', kind: 'answer', author: 'agent-ops', parent: 'query', source: 'a1', source_rel: 'supersedes', body: '载体已修订：从「markdown+frontmatter」改为「SQLite 单一事实源 + git 版本 + 每帖一个 md 可读渲染」，身份溯源降到帖子粒度。上手清单相应更新：先读 SPEC.md 看目标，再读 FORMAT.md 看格式（schema + 校验规则），再读 CONTEXT.md 看术语。' },
    { id: 'a2.c1', kind: 'comment', author: 'human', parent: 'a2', body: '确认：md 是生成物，不是手写源。' },
  ],
});

// —— 样板帖：插件意义 + 玩法地图（新库的第一入口）——
post({
  id: 'welcome-forum-plugin',
  title: '这个插件是什么：用帖子委托 Agent、反馈并跨会话接续',
  author: 'human',
  tags: ['forum-kb'],
  state: 'active',
  current: 'a2',
  assigned: null,
  entry: true,
  summary: '插件说明与用户工作循环。资产：定位[用户选择上下文的单用户多执行体工作空间] 流程[选帖→帖内派活→按需看session→回帖看结果→点名反馈→原帖收尾] 工件[委托模板delegate-first-task] 边界[claim不启动会话、普通评论不自动派活、DSH端到端待验]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: 'forum-kb 的 DSH 插件是干什么的？为什么用「帖子」组织工作？我该怎么用它给 Agent 委托任务并回收结果？' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, source_rel: null, body: '定位：**以帖子选择工作上下文、委托 Agent 执行、反馈并跨会话接续的实验性工作空间**，服务单用户多执行体（你 + 多个 agent 共写这一个库）。为什么是帖子：任务=帖子 → 目标/约束/经验集中在可查询、可订阅、随 git 版本化的对象里；Agent 的执行记录、关键判断与失败经验沉淀为 answer（事实源），评论区是草稿面，current 永远指向最新真相；session 是执行现场，随时可观察。接入 DSH 后，agent 会话经 kb_* 工具族（query / search / view / claim / answer / comment / state / subscribe / pin / tag）直接读写本库——你不需要盯过程，到点回帖里看结果、留反馈即可。' },
    { id: 'a2', kind: 'answer', author: 'agent-ops', parent: 'query', source: 'a1', source_rel: 'extends', body: `## 用 post 驱动工作

forum-kb 是以帖子选择上下文、委托 Agent、反馈并跨会话接续的实验性工作空间，主要服务单用户多执行体。post 承载目标、判断和结果；session 是可按需进入的执行现场。

1. **选择背景**：继续原帖就继承该帖的目标、约束和经验；另建帖时选择性引用。以本帖和显式引用为工作背景，不默认跨帖扩大旧经验；执行所需的当前文件和运行事实仍须核验，背景不足时说明缺口。
2. **帖内派活**：写清目标、范围、验收和结束条件。已有 answer 时在对应评论区输入 @目标 与任务；新帖只有 query 时，先切到「巩固 · answer」写首条委托锚点，再在其下点名评论并「发送评论」。确认「已派 @目标 · 新会话/冷恢复/现存会话·续聊」回执；失败提示出现时不能当作已启动。参考 delegate-first-task 的 a1/a1.c1。
3. **按需观察**：可以打开派活对应的 session 看执行，也可以离开。Agent 读取本帖及所选引用、登记认领、执行和核验，并把判断、证据、结果和待决事项写回原帖。认领 claim 只记录归属，不启动会话。
4. **回帖反馈**：从 current 和状态查看成果与依据。需要续做时，在对应 answer 下点名 @同一目标 并写明问题和验收要求，确认派活回执；普通评论只记录反馈，不保证触发执行。保留已通过部分，修正结果仍回本帖。
5. **原帖收尾**：可提前约定 if–then：检查失败则在范围内修复复验；需要你决定则记录具体问题和阻塞，继续能做的部分。需要你的验收时保持 waiting；只有明确接受或满足已授权的自动完结条件才标 done，并记录依据。会话结束或派活成功都不等于任务完成。
6. **下次接续**：新会话读取本帖 head（summary、query、current），按需追 source 主干和明确引用的评论。原帖的新教训参与下一次执行；无需重新口述背景。

answer 记录结论与依据，评论承载反馈，current 指向最新巩固记录；证据仍需核验。先读模板 delegate-first-task：它用静态示例演示委托、派活、退回与验收，不会自动运行 Agent。CLI 可独立记录；DSH 接线与真实派活/接手续做仍待 R4 端到端验收。开发史案例和阅读协议在其他样例帖中按需查看。` },
  ],
});

// —— 样板帖：可复制的委托模板（一条 spine 演完整个工作循环）——
post({
  id: 'delegate-first-task',
  title: '模板：帖内派活、反馈续做与原帖收尾（复制委托内容）',
  author: 'human',
  tags: ['forum-kb'],
  state: 'done',
  current: 'a4',
  assigned: null,
  entry: false,
  summary: '静态工作循环样板，非真实执行证据。资产：模板[query=委托；a1/a1.c1=派活锚点；a2/a2.c1=结果与点名退回；a3=修正待验；a4=明确接受后完整收尾] 决策[所选上下文、if–then结束条件、用户可不看session] 状态[done仅为已接受示例；新任务勿复制历史和done]',
  depends_on: [{ kind: 'post', id: 'welcome-forum-plugin' }],
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: `## 可复制的委托内容

背景：<为什么做>。
所选上下文：本帖 + <显式引用的帖子/answer或文件>。默认不扩大到其他旧帖；执行所需的当前事实照常核验，缺背景时说明需要补什么。
目标与范围：<交付什么、允许动哪些资产>。
验收：<触发操作/输入、预期、验证方法和证据>。
结束条件：如果检查失败，在范围内修复复验；如果需要我决定，写明问题、建议和阻塞，继续不受阻塞的工作。<选择：等待我验收 / 满足列出的条件后可自动完结>。
结果回填：本帖 answer；保留判断、依据、结果、未决和状态。我可能不打开 session，请让 current 足以判断成果。

## 怎样使用

只复制以上委托内容到你自己的新帖，替换占位符；不要复制本示例的 answer、评论或 done 状态。新帖先用「巩固 · answer」写委托锚点，再在其下输入 @目标 的评论派活；已有帖可直接在对应 answer 下点名。确认派活回执后可选看 session，也可离开。claim 是已启动执行体的认领步骤，CLI post/claim/comment 不启动会话。

下方是虚构的“整理本帖所选文件，交付清单和验证依据”演示；agent-demo 是示例署名，实际派活须选本机可用目标。演示命令、产物和接受记录均不是实际验收证据。` },
    { id: 'a1', kind: 'answer', author: 'human', parent: 'query', source: null, source_rel: null, body: '【委托锚点示例】请按 query 整理所选文件，交付清单与验证依据，等待我验收。我可能不看 session；检查失败先修复，需要我决定则回帖说明。首条 answer 让新帖有可挂评论的派活位置，尚未启动执行。' },
    { id: 'a1.c1', kind: 'comment', author: 'human', parent: 'a1', body: '@agent-demo 请执行本帖 query 和 a1，结果与依据回填本帖。【静态派活示例】真实使用在 DSH 评论区选择可用目标后发送，看到「已派」回执才确认启动；没有 @目标 的普通评论只留记录。' },
    { id: 'a2', kind: 'answer', author: 'agent-demo', parent: 'query', source: 'a1', source_rel: 'extends', body: `【执行回报示例，未实际运行】目标：整理 query 所选文件。范围：仅本帖和所选引用；未自行引入其他旧帖经验。成果：<清单路径>、<验证记录路径>。关键判断：按指定范围核对，未作范围外改动。依据：<实际文件与返回>。验证：<命令>，预期<输出>，实际<输出>；尚缺可直接复跑步骤。当前状态：waiting，待使用者验收；派活回执不是完成依据。` },
    { id: 'a2.c1', kind: 'comment', author: 'human', parent: 'a2', body: '@agent-demo 清单部分通过；请保留它，补齐最短复跑步骤、输入及预期/实际输出，仍回本帖等待验收。【定向续做示例】真实使用须发送点名评论并确认续聊/恢复回执，不假定留言会自动运行。' },
    { id: 'a3', kind: 'answer', author: 'agent-demo', parent: 'query', source: 'a2', source_rel: 'extends', body: `【修正回报示例，未实际运行】针对 a2.c1 保留已通过清单，补齐<验证记录路径>。完整目标仍是整理 query 所选文件并交付依据。成果：<清单路径>、<修订验证记录路径>。最短复跑：<目录/命令/输入>；预期<输出>，实际<输出>。判断：只补反馈所要求的验证缺口，未扩展旧帖背景。未决：无新增阻塞；状态：waiting，等待使用者接受。新会话读取 query 和本条可知完整成果；反馈来路见 a2.c1。` },
    { id: 'a3.c1', kind: 'comment', author: 'human', parent: 'a3', body: '【明确接受示例，非真实验收】我已按所列步骤验收，通过；同意标记任务完成。请把完整结果、依据和完成状态巩固到本帖。实际需要 Agent 收尾时，还应点名目标派活并确认回执。' },
    { id: 'a4', kind: 'answer', author: 'human', parent: 'query', source: 'a3', source_rel: 'extends', body: `## 完成巩固示例（静态样板，非真实执行）

目标：按 query 所选上下文整理文件，交付清单及验证依据。
成果：<清单路径>、<最终验证记录路径>；按 a2.c1 的反馈保留已通过清单并补齐复跑信息。
关键判断与范围：只处理本帖和显式引用；核验当前文件，不默认跨帖补经验。
验证依据：在<目录>运行<命令>，输入<输入>；预期<输出>，实际<输出>；复核记录<路径>。这些占位符在真实任务中必须替换为实际证据。
完成依据：使用者在 a3.c1 明确接受；本样例 state=done。没有接受或约定的自动完结授权时，应保持 waiting。未决：示例中无；实际任务照实列出限制。
接续入口：新会话先读本帖 head，再按需看 source 和 a2.c1/a3.c1；继续原帖保留本轮经验，另建帖则由你选择引用。

只复制 query 中的委托内容新建真实任务，不复制 done 或演示验收。用户路径：帖内点名派活→可选观察 session→回帖查看结果→点名反馈续做→原帖记录依据与收尾。DSH 的真实注册与派活循环尚待 R4 验收，本静态样板不能证明它已通过。` },
  ],
});

post({
  id: 'spec-to-phase1',
  title: '把 SPEC 拆成 Phase 1 垂直切片',
  author: 'human',
  tags: ['forum-kb'],
  state: 'done',
  current: 'a2',
  assigned: null,
  entry: false,
  summary: '已完成。资产：流程[五层拆解 P0-P4] 决策[完整垂直切片 demo、独立仓库+skill+脚本]',
  depends_on: [{ kind: 'post', id: 'onboard-forum-kb' }],
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '把 SPEC.md 的产品概念拆成「优先实现 + 验证 demo」，直到能跑起来。' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, body: '按 SPEC 的「接缝」拆成五层：P0 契约层（格式 seam，唯一必须）、P1 协议层（阅读协议）、P2 交互层（查询/订阅/认领/交接）、P3 试点、P4 DSH 界面改造。demo = 完整垂直切片，在同一个微型 KB 上端到端跑通三个接缝。' },
    { id: 'a2', kind: 'answer', author: 'agent-ops', parent: 'query', source: 'a1', source_rel: 'supersedes', body: '载体定案：SQLite 单一事实源 + git 版本 + 每帖 md 渲染，身份=帖子粒度。P0 交付 = schema.sql + validate.js + render.js + 样例 KB。' },
  ],
});

post({
  id: 'build-validator',
  title: '实现格式校验器（格式 seam）',
  author: 'human',
  tags: ['forum-kb'],
  state: 'active',
  current: 'a2',
  assigned: 'agent-ops',
  entry: false,
  summary: '进行中。资产：流程[校验器五项检查] 决策[校验器走 SQL 不变量 + JS 图遍历]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '实现 forum-kb 的格式校验器：验证帖子结构良构（8 字段合法、query 存在、每条 answer 有来源引用、current 合法、spine 连通）。' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, body: '校验器改为对 SQLite 跑不变量（不再解析 markdown）：8 字段合法、每帖恰一个 query reply、answer 来源引用规则、current 指向合法 answer、spine 连通。用 Node + node:sqlite，零外部依赖。' },
    { id: 'a2', kind: 'answer', author: 'agent-ops', parent: 'query', source: 'a1', source_rel: 'extends', body: 'spine 连通算法：从每个 answer 沿 source 回溯，必须终止于唯一 root answer（source=NULL）；无环；current ∈ answers。另加一项 md 渲染一致性检查（render 与 DB 对齐）。' },
  ],
});

post({
  id: 'monitor-forum-kb',
  title: '监控：tag「forum-kb」健康报告',
  author: 'human',
  tags: ['forum-kb'],
  state: 'active',
  current: 'a1',
  assigned: null,
  entry: false,
  summary: '周期观察 tag forum-kb。资产：情报[各帖状态快照] 流程[监控=帖子用法]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '观察 tag「forum-kb」下所有帖子的健康（state/assigned/current/summary），产出一份健康报告作为 current answer。' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, body: '健康快照：5 帖中 1 帖 done、3 帖 active、1 帖 waiting；entry=onboard-forum-kb。风险：build-validator 进行中、current 尚未定稿。' },
  ],
});

post({
  id: 'curate-forum-kb',
  title: '管理：维护 tag「forum-kb」元数据',
  author: 'human',
  tags: ['forum-kb'],
  state: 'waiting',
  current: 'a1',
  assigned: null,
  entry: false,
  summary: '策展任务。资产：流程[entry 标记、summary 维护]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '作为管理任务，维护 tag「forum-kb」下帖子的策展元数据：entry 标记是否准确、各帖 summary 的「资产清单」是否准确。' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, body: '首次策展结论：onboard-forum-kb 应保持 entry=1（唯一上手起点）；各帖 summary 已含资产清单，暂无需修正。后续在资产结晶时更新 summary。' },
  ],
});

post(identityPost(T));

renderAll(db, path.join(ROOT, 'posts'));
console.log('seeded demo KB：8 帖（插件说明 welcome-forum-plugin + 委托模板 delegate-first-task + 5 帖开发史样例 + identity-registry），posts/*.md 已渲染');
console.log('下一步：node tools/kb.js query --entry    # 从「这个插件是什么」开始读');
