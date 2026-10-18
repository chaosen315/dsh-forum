import assert from 'node:assert/strict'
import { localSubstringHit, searchHit } from '../src/search.ts'

// 缺陷 b0ad9a1965b8 的回归：搜索命中 = 本地子串 ∪ FTS，FTS 只新增、不得清空本地结果。
const post = { id: '7c4c129682b9', title: '解冻 D1：写入者身份可验证', summary: '签名面与信任边界', assigned: 'agent-mac' }
const other = { id: 'aaaa11112222', title: '其它帖子', summary: '论坛搜索相关', assigned: 'agent-build' }

// 1) 本地子串：id / title / summary / assigned 四个字段都算命中
assert.equal(localSubstringHit('7c4c129682b9', post), true, 'id 命中')
assert.equal(localSubstringHit('写入者身份', post), true, 'title 命中')
assert.equal(localSubstringHit('签名面', post), true, 'summary 命中')
assert.equal(localSubstringHit('agent-mac', post), true, 'assigned 命中')
assert.equal(localSubstringHit('AGENT-MAC', post), true, '大小写不敏感')
assert.equal(localSubstringHit('不存在的词', post), false, '未命中')

// 2) 多词 = 空白拆词 AND（此前多词被 FTS 当字面短语而清零，是主缺陷）
assert.equal(localSubstringHit('论坛 搜索', other), true, '两词分散在 title/summary 也可')
assert.equal(localSubstringHit('论坛 搜索', post), false, '缺任一关键词不命中')

// 3) 无搜索词 = 不过滤（无论 FTS 命中集为空/为 null）
assert.equal(searchHit('', post, null), true, '空词不过滤')
assert.equal(searchHit('  ', post, new Set()), true, '空白词不过滤')

// 4) FTS 只新增：本地未命中但 FTS 命中正文 → 显示
assert.equal(searchHit('正文里的词', post, new Set([post.id])), true, 'FTS 新增命中')
assert.equal(searchHit('正文里的词', post, new Set([other.id])), false, 'FTS 无此帖则不命中')

// 5) 核心修复：FTS 空集/失败（null）不得清空本地正确命中
assert.equal(searchHit('7c4c129682b9', post, new Set()), true, 'FTS 零命中不覆盖本地命中')
assert.equal(searchHit('7c4c129682b9', post, null), true, 'FTS 未启用/失败时保留本地命中')
assert.equal(searchHit('论坛 搜索', other, new Set()), true, '多词本地命中 + FTS 零命中')
// 6) 反向：本地未命中且 FTS 也未命中 → 不显示
assert.equal(searchHit('完全无关', post, new Set()), false, '两边都不命中')
// 7) 单调性：FTS 集合只增不减时，命中集不会缩小
const terms = ['7c4c129682b9', '论坛 搜索', '签名面', 'agent-mac']
for (const t of terms) {
  const before = searchHit(t, post, null)
  const after = searchHit(t, post, new Set([post.id]))
  const afterEmpty = searchHit(t, post, new Set())
  assert.ok(!(before && !after) && !(before && !afterEmpty), 'FTS 到达后不得丢失本地命中: ' + t)
}
console.log('PASS: search union (16 assertions)')
