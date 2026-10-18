#!/usr/bin/env node
// File-level exercise checks only. Does not check post write-back or invoke a model.
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const ROOT = path.resolve(__dirname, '../..');
const expected = {
  feedback: [
    '便签盒：让零散想法有处可放。',
    '已验证 macOS；其他平台待验证。',
    '先试用，再决定是否保留。',
  ],
  handoff: [
    '便签盒：一份简单的入门说明。',
    '已验证 macOS；其他平台待验证。',
    '下一步：保存一条便签，再搜索它。',
  ],
  team: [
    '便签盒：三步开始。',
    '适用范围：macOS 已验证；其他平台待验证。',
    '操作：保存一条便签，再搜索它。',
  ],
};

const args = process.argv.slice(2);
if (args.length !== 1 || !Object.hasOwn(expected, args[0])) {
  console.error('用法：在练习库运行 node examples/workflows/check-result.js feedback|handoff|team');
  process.exitCode = 2;
} else {
  const exercise = args[0];
  const file = path.join(ROOT, 'materials', `${exercise}-note.txt`);
  try {
    const bytes = fs.readFileSync(file);
    // Allow platform line endings and one optional final newline; no other whitespace changes.
    const text = bytes.toString('utf8').replace(/\r\n/g, '\n').replace(/\n$/, '');
    const lines = text.split('\n');
    const errors = [];
    if (lines.length !== 3) errors.push(`预期恰好 3 行，实际 ${lines.length} 行`);
    for (let i = 0; i < 3; i++) {
      if (lines[i] !== expected[exercise][i]) errors.push(`第 ${i + 1} 行不符：预期 ${JSON.stringify(expected[exercise][i])}；实际 ${JSON.stringify(lines[i])}`);
    }
    if (errors.length) {
      console.error(`FAIL ${exercise}\n${errors.join('\n')}`);
      process.exitCode = 1;
    } else {
      console.log(`PASS ${exercise}\n文件：materials/${exercise}-note.txt\nSHA-256: ${createHash('sha256').update(bytes).digest('hex')}`);
    }
  } catch (error) {
    console.error(`FAIL ${exercise}: ${error.message}\n请先创建独立练习库，并在其中执行。`);
    process.exitCode = 1;
  }
}
