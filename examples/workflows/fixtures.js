// Synthetic starting points only. No private KB export, model runs, or real acceptance records.
const doc = (id) => ({ kind: 'doc', id });
const post = (id, anchor = 'current') => ({ kind: 'post', id, anchor });
const guide = (file) => doc(`examples/workflows/${file}.md`);
const material = (file) => doc(`materials/${file}`);

module.exports = [
  {
    id: 'lab-feedback', title: '练习 01：只修发布说明第二行',
    summary: '练习起点。流程[定向反馈→修正→同帖验收] 工件[materials/feedback-note.txt]',
    query: '第一、三行已接受；只将第二行改为“已验证 macOS；其他平台待验证。”。只写 materials/feedback-note.txt 和本帖，运行 node examples/workflows/check-result.js feedback，回帖等待验收。实际执行由用户另行点名触发。',
    answers: ['三行初稿位于 materials/feedback-note.txt；第二行目前夸大平台支持。尚未执行修订。请按指南发出委托。'],
    deps: [material('feedback-note.txt'), guide('01-focused-feedback')],
  },
  {
    id: 'lab-handoff', title: '练习 02：新会话接手续写入门说明',
    summary: '练习起点。结论[前两行已接受，macOS范围已更正] 下一步[只补第三行操作]',
    query: '完成 materials/handoff-note.txt 的三行便签盒入门说明。当前前两行已接受；第三行应为“下一步：保存一条便签，再搜索它。”。运行 node examples/workflows/check-result.js handoff；成果与依据回本帖待验收。实际执行由用户另行点名触发。',
    answers: [
      '早期草稿曾写“全平台可用”。这是旧判断，尚无平台依据；当时还未补使用步骤。',
      '目标：完成三行入门说明。现状：materials/handoff-note.txt 的前两行已经接受，第二行已更正为“已验证 macOS；其他平台待验证。”；旧的全平台说法不再使用。下一步：只补第三行“下一步：保存一条便签，再搜索它。”，运行 handoff 检查，回本帖列出完整成果及实际输出，等待用户验收。证据入口：该文件；平台结论属于本练习给定条件，非实际产品验收。',
    ],
    deps: [material('handoff-note.txt'), guide('02-handoff')],
  },
  {
    id: 'project-links', title: '便签项目：检查材料索引链接', tag: 'project-demo',
    summary: '练习设定：有锚点但尚未执行。工件[materials/project-index.md] 下一步[检查两个相对链接]',
    query: '检查 materials/project-index.md 中的两个本地相对链接，修复不存在的指引路径。实际执行前等待用户从盘点结果中选择本任务。范围仅此文件和本帖。',
    answers: ['委托锚点：尚未检查链接，没有执行者在运行。需用户选择本任务后，再检查 guide-old.md 与 feedback-note.txt 是否存在。'],
    deps: [material('project-index.md'), material('guide.md')],
  },
  {
    id: 'project-guide', title: '便签项目：验收入门指引', tag: 'project-demo', state: 'waiting',
    summary: '练习设定：指引已交付，等待用户验收。工件[materials/guide.md]',
    query: '交付三行入门指引，说明新建、保存与搜索。由用户验收措辞。',
    answers: ['成果：materials/guide.md 已提供三行指引。当前等待用户检查措辞，尚未接受。不是缺少实现，也不是授权自动标记完成；下一步是用户验收。'],
    deps: [material('guide.md')],
  },
  {
    id: 'project-platform', title: '便签项目：是否扩展平台', tag: 'project-demo', state: 'waiting',
    summary: '练习设定：等待平台范围决策，尚不能继续。待决[是否纳入其他平台]',
    query: '是否将便签盒的入门材料扩展到其他平台？需用户先决定本轮范围。',
    answers: ['当前仅把 macOS 作为已验证范围。是否支持更多平台、用什么条件验收都未决定；缺少范围决策，无法继续写支持承诺。下一步：用户决定是否另开平台验证任务。'],
  },
  {
    id: 'project-copy', title: '便签项目：标题已接受', tag: 'project-demo', state: 'done',
    summary: '练习设定：标题已接受。结论[便签盒：让零散想法有处可放。]',
    query: '确定入门材料的标题，保持短小、明确。',
    answers: ['最终标题：“便签盒：让零散想法有处可放。”。本虚构项目设定中，用户已逐字检查并明确接受这一标题，因此状态为 done。没有待处理项。本记录不是模型执行证据。'],
  },
  {
    id: 'lab-inventory', title: '练习 03：盘点便签项目',
    summary: '练习起点。范围[project-demo四帖] 产物[候选列表、进度、阻塞与下一步]',
    query: '只读盘点 project-demo 全部候选帖子：ID/current/state/实际进度/阻塞/下一步/待决。结果回本帖，不修改被盘点帖子。实际执行由用户另行点名触发。',
    answers: ['初始盘点尚未执行。project-demo 标签有四条任务，先 query 后逐帖读 head。等待验收与等待决策要分别说明；结果回本帖供用户选下一项。'],
    deps: ['project-links', 'project-guide', 'project-platform', 'project-copy'].map((id) => post(id)).concat(guide('03-project-snapshot')),
  },
  {
    id: 'lab-upgrade-history', title: '材料：一次升级检查的更正',
    summary: '练习材料。结论[进程存活不能证明升级成功] 流程[核对版本、读写同库、四类目录隔离]',
    query: '一次旧升级留下了什么经验？这里只提供虚构历史，供新任务核验适用性。',
    answers: [
      '旧观察：包文件变成 2.0，进程还活着，所以当时草率地认为升级成功。',
      '更正：进程存活只是一条观察；磁盘文件、运行后端、浏览器前端可能来自不同版本。新任务应核对实际版本、页面与工具是否访问同一知识库，并分别隔离 home、安装目录、构建产物、数据目录。旧路径和旧版本号不能直接当作下一次的输入。没有真实操作链路验证，不能判升级完成。',
    ],
  },
  {
    id: 'lab-upgrade', title: '练习 04：旧经验在这次是否适用',
    summary: '练习起点。材料[旧升级更正+离线快照] 产物[适用条件与阻断点]',
    query: '依据 [[lab-upgrade-history]] 和 materials/upgrade-snapshot.json，只做离线核对与报告，列出字段证据和继续前所缺证据。不改配置、不安装或停止进程；实际执行由用户另行点名触发。',
    answers: ['尚未核对本次模拟快照。参考历史帖当前更正，不采用早期“进程活着就算成功”的判断。结果回本帖，明确报告只适用于练习输入。'],
    deps: [post('lab-upgrade-history'), material('upgrade-snapshot.json'), guide('04-reuse-experience')],
  },
  {
    id: 'lab-research', title: '练习 05：选择一种工作交接办法',
    summary: '练习起点。材料[三种虚构交接方案] 产物[取舍→独立执行帖→来源摘要]',
    query: '按 materials/options.md 的给定事实比较三种交接方案。要求离线、仅选定帖、来源可追溯。先建议，再等用户决定；不因调研内容自行生成交接包。',
    answers: ['尚未比较方案。先形成可决定的结论；用户采纳后再建立执行帖并引用采纳的 answer。示例来源 project-guide、project-copy 只有在执行委托选定后才需读取。'],
    deps: [material('options.md'), guide('05-research-to-action')],
  },
  {
    id: 'lab-team-write', title: '练习 06 子任务：写作',
    summary: '练习起点。范围[只写team-note.txt] 验收[三行精确匹配]',
    query: '只改 materials/team-note.txt：第一行保留“便签盒：三步开始。”；第二行“适用范围：macOS 已验证；其他平台待验证。”；第三行“操作：保存一条便签，再搜索它。”。运行 node examples/workflows/check-result.js team。成果、实际输出与文件 SHA-256 回本帖。实际执行等主帖委派或用户点名。',
    answers: ['尚未执行；由写作方独占文件修改。复核者只读成品，不共同改文件。结果应回本帖，并交由主帖 [[lab-team]] 汇总。'],
    deps: [material('team-note.txt'), post('lab-team')],
  },
  {
    id: 'lab-team-review', title: '练习 06 子任务：独立复核',
    summary: '练习起点。前置[写作方提交] 验收[独立复跑+所验文件指纹]',
    query: '写作方提交后，读 [[lab-team-write]] current 和 materials/team-note.txt，独立运行 node examples/workflows/check-result.js team。记录真实输出、文件 SHA-256、是否通过。失败只给具体退回项，不改成品或检查器。结果回本帖与 [[lab-team]]。实际执行等主帖委派或用户点名。',
    answers: ['前置未满足：写作方尚未提交。不能以预置材料、委派成功或任务板状态替代实测。等待真实成品后再独立检查。'],
    deps: [post('lab-team-write'), post('lab-team'), material('team-note.txt')],
  },
  {
    id: 'lab-team', title: '练习 06：写作与复核回到主帖',
    summary: '练习起点。子帖[lab-team-write、lab-team-review] 产物[总结果、证据与待决]',
    query: '组织 [[lab-team-write]] 写作和 [[lab-team-review]] 独立复核。范围是三个帖子、materials/team-note.txt 与指定检查器；具体团队委派权限由用户在触发评论中给定。写作先于复核，失败最多两次修复复验；超出则说明阻塞。主帖汇总最终文件、来源 answer、指纹、实际输出与未决，等用户验收。',
    answers: ['两个子帖已备好委托锚点，但没有启动会话。请按指南点名负责人；无 Team 时由用户逐帖派活。主帖负责汇总当前成果和验收依据；子任务提交不等于整项工作已接受。'],
    deps: [post('lab-team-write'), post('lab-team-review'), material('team-note.txt'), guide('06-delegate-and-review')],
  },
  {
    id: 'lab-start', title: '练习入口：挑一件事交给 Agent',
    summary: '六种工作练习入口。流程[定向反馈、接手、盘点、旧经验、调研执行、分工复核]',
    entry: true,
    query: '我可以怎样用帖子组织日常工作？从六种练习挑一个，用真实委托触发，结果回原帖。',
    answers: ['入口文档：examples/workflows/README.md。第一次从 [[lab-feedback]] 开始；换会话读 [[lab-handoff]]；盘点选 [[lab-inventory]]；经验复用选 [[lab-upgrade]]；调研转执行选 [[lab-research]]；团队分工选 [[lab-team]]。所有既有记录都是虚构练习设定，不是已执行证明。先登记实际身份，配置练习目录，再按指南点名并确认回执。'],
    deps: ['lab-feedback', 'lab-handoff', 'lab-inventory', 'lab-upgrade', 'lab-research', 'lab-team'].map((id) => post(id)).concat(guide('README')),
  },
];
