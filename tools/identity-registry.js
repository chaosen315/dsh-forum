// 通用身份登记帖定义（init.js / seed.js 共用）。
// 设计：不依赖任何固定历史帖 ID——登记帖由 init/seed 在新库里创建，
// 定位方式：node tools/kb.js query --tag meta
module.exports = function identityPost(T) {
  return {
    id: 'identity-registry',
    title: '身份登记：谁在写这个库',
    author: 'human',
    tags: ['meta'],
    state: 'active',
    current: 'a1',
    entry: false,
    summary: '本库写者身份的唯一登记入口。资产：流程[署名规则 agent-<host> / agent-<host>-<variant>；人用常用 handle] 决策[登记=在本帖新增 answer]',
    replies: [
      { id: 'query', kind: 'query', author: 'human', body: '登记本库的写者身份：署名规则是什么、谁是库主、有哪些 agent 执行体在写、如何新增登记。' },
      { id: 'a1', kind: 'answer', author: 'human', parent: 'query', source: null, source_rel: null, body: '署名规则：人用常用 handle；agent 用登记名 `agent-<host>`（DSH 派活会话）或 `agent-<host>-<variant>`（同宿主不同组成的变体，如不同 CLI）。权限随任务授予，不随名字。登记方式：在本帖新增一条 answer（author=你的登记名），写明宿主/变体、职责范围与开始日期。库主请在下方追加自己的登记。定位本帖：`node tools/kb.js query --tag meta`。' },
    ],
  };
};
