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
  summary: '插件说明 + 玩法地图。资产：定位[单用户多执行体的任务工作空间] 流程[委托→认领→回写→反馈→定向续做→接手] 工件[模板帖 delegate-first-task；案例 spec-to-phase1/build-validator/monitor-forum-kb/curate-forum-kb] 决策[answer=事实源、评论区=草稿面、current=最新真相]',
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: 'forum-kb 的 DSH 插件是干什么的？为什么用「帖子」组织工作？我该怎么用它给 Agent 委托任务并回收结果？' },
    { id: 'a1', kind: 'answer', author: 'agent-ops', parent: 'query', source: null, source_rel: null, body: '定位：**以帖子选择工作上下文、委托 Agent 执行、反馈并跨会话接续的实验性工作空间**，服务单用户多执行体（你 + 多个 agent 共写这一个库）。为什么是帖子：任务=帖子 → 目标/约束/经验集中在可查询、可订阅、随 git 版本化的对象里；Agent 的执行记录、关键判断与失败经验沉淀为 answer（事实源），评论区是草稿面，current 永远指向最新真相；session 是执行现场，随时可观察。接入 DSH 后，agent 会话经 kb_* 工具族（query / search / view / claim / answer / comment / state / subscribe / pin / tag）直接读写本库——你不需要盯过程，到点回帖里看结果、留反馈即可。' },
    { id: 'a2', kind: 'answer', author: 'agent-ops', parent: 'query', source: 'a1', source_rel: 'extends', body: '玩法五步：①**委托**——`node tools/kb.js post <id> --title … --body …` 发任务帖（背景/引用/验收写清楚，见模板帖）；②**执行**——agent 认领（claim 是事务内 CAS，防互踩）后干活，把执行记录写进 answer；③**回写**——结果与依据回到原帖，current 前移；④**反馈**——你在对应 answer 的评论区留言，agent 定向续做（软引用前一条，不推翻已通过部分）；⑤**接手**——新会话只读该帖 current 即可续做，需要来路时沿 source 反向追。下一步：复制模板帖 `delegate-first-task` 发你的第一单；真实案例看 spec-to-phase1（已完成拆解）、build-validator（进行中执行与校验）、monitor-forum-kb / curate-forum-kb（监控与管理玩法）；阅读协议（正向读=上手、反向读=接手）见 onboard-forum-kb。' },
  ],
});

// —— 样板帖：可复制的委托模板（一条 spine 演完整个工作循环）——
post({
  id: 'delegate-first-task',
  title: '模板：委托 Agent 做一单任务（复制本帖改内容即用）',
  author: 'human',
  tags: ['forum-kb'],
  state: 'active',
  current: 'a2',
  assigned: null,
  entry: false,
  summary: '可复制委托模板。资产：模板[query=委托格式占位符；a1=Agent执行记录样子；a1.c1=评论区反馈样子；a2=定向续做样子] 流程[一条spine演完委托→认领→回写→反馈→续做→接手]',
  depends_on: [{ kind: 'post', id: 'welcome-forum-plugin' }],
  replies: [
    { id: 'query', kind: 'query', author: 'human', body: '【委托模板】背景：<为什么做这件事，一两句>。引用：<需要继承的帖子或文件，如 [[某帖id]] / 路径>。要做什么：<具体任务与范围>。验收：<什么算做完、怎么验证>。约束：<不许动什么、边界在哪>。结果回填：本帖 answer。把尖括号占位符换成你的内容，本帖就是一个真实任务帖；然后用 `node tools/kb.js claim <本帖id> --as <agent>` 交给执行体（DSH 内也可直接 @ 某个 agent 点名）。' },
    { id: 'a1', kind: 'answer', author: 'agent-demo', parent: 'query', source: null, source_rel: null, body: '【Agent 执行记录的样子】已完成 <任务第一步>。关键判断：<为什么这么做>。直接依据：<文件/帖/命令输出>。验证方式：<命令 + 预期输出，已复跑>。未决：<卡点或需要使用者决定的事>。（真实执行体署名用登记名 agent-<host>；此处 agent-demo 仅为演示。）' },
    { id: 'a1.c1', kind: 'comment', author: 'human', parent: 'a1', body: '【人的反馈写在评论区（草稿面）】<哪里不符合预期、要补什么、优先级如何>。agent 会针对评论定向续做，不推翻已通过的部分。' },
    { id: 'a2', kind: 'answer', author: 'agent-demo', parent: 'query', source: 'a1', source_rel: 'extends', body: '【定向续做的样子】针对 a1.c1 的反馈：<改了什么、为什么这么改>。已保留 a1 中通过的部分；复跑验证：<命令 + 实际结果>。current 现在指向本条 = 最新真相；新会话接手只需读本帖 current，需要来路时沿 source 反向追。' },
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
