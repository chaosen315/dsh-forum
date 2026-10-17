import assert from 'node:assert/strict'
import { createRefreshLoop } from '../src/refresh.ts'

// Exercise an actual pending read, navigation, hidden tab and teardown without
// wall-clock sleeps. Timer cadence is tested by the browser acceptance script.
let visible = true
let calls = 0
const commits = []
const pending = []
const loop = createRefreshLoop({
  visible: () => visible,
  read: valid => {
    const call = ++calls
    return new Promise(resolve => pending.push(() => {
      if (valid()) commits.push(call)
      resolve()
    }))
  },
})
const settle = () => new Promise(resolve => setImmediate(resolve))
void loop.request(false)
await loop.request(false)
assert.equal(calls, 1, 'slow timer reads must not overlap or queue')
loop.invalidate()
await loop.request()
await loop.request()
assert.equal(calls, 1, 'explicit requests coalesce while pending')
pending.shift()()
await settle()
assert.deepEqual(commits, [], 'late navigation response must not commit')
assert.equal(calls, 2)
pending.shift()()
await settle()
assert.deepEqual(commits, [2])
visible = false
await loop.request()
assert.equal(calls, 2, 'hidden panels do not read')
visible = true
void loop.request()
loop.dispose()
pending.shift()()
await settle()
await loop.request()
assert.equal(calls, 3)
assert.deepEqual(commits, [2], 'unmounted panel ignores pending response')

let attempts = 0
const failures = []
const recovery = createRefreshLoop({
  visible: () => true,
  read: async () => { if (++attempts === 1) throw new Error('offline') },
  onError: e => failures.push(e.message),
})
await recovery.request()
await recovery.request()
recovery.dispose()
assert.deepEqual(failures, ['offline'])
assert.equal(attempts, 2, 'failed read releases single-flight latch')
console.log('PASS: slow reads, coalescing, stale navigation, hidden/resume, disposal, failure recovery')
