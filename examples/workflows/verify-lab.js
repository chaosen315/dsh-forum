#!/usr/bin/env node
// Isolated integration checks. No network, DSH, model, or source KB writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '../..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'forum-workflows-'));
let checks = 0;
function check(name, fn) {
  fn();
  checks++;
  console.log(`PASS ${name}`);
}
function snapshot(dir) {
  const result = {};
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const key = path.relative(dir, full);
      if (entry.isSymbolicLink()) result[key] = `link:${fs.readlinkSync(full)}`;
      else if (entry.isDirectory()) { result[`${key}/`] = 'directory'; walk(full); }
      else result[key] = createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  }
  walk(dir);
  return result;
}
function run(file, args = [], cwd = scratch) {
  const result = spawnSync(process.execPath, [file, ...args], {
    cwd, encoding: 'utf8',
    env: { ...process.env, FORUM_KB_ROOT: path.join(scratch, 'source') },
    timeout: 30000,
  });
  if (result.error) throw result.error;
  return result;
}
function success(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

try {
  const source = path.join(scratch, 'source');
  fs.mkdirSync(source);
  fs.cpSync(path.join(ROOT, 'tools'), path.join(source, 'tools'), { recursive: true });
  fs.cpSync(__dirname, path.join(source, 'examples/workflows'), { recursive: true });
  for (const file of ['schema.sql', 'LICENSE']) fs.copyFileSync(path.join(ROOT, file), path.join(source, file));
  // A non-SQLite sentinel proves creation never opens or copies a source database.
  fs.writeFileSync(path.join(source, 'kb.sqlite'), 'PRIVATE-SOURCE-SENTINEL-NOT-A-DATABASE');
  fs.mkdirSync(path.join(source, 'posts'));
  fs.writeFileSync(path.join(source, 'posts', 'private.md'), 'PRIVATE-POST-SENTINEL');
  const before = snapshot(source);
  const create = path.join(source, 'examples/workflows/create-lab.js');
  const lab = path.join(scratch, '练习 lab');
  const cli = (...args) => success(run(path.join(lab, 'tools/kb.js'), args, lab));
  const view = (id, ...args) => JSON.parse(cli('view', id, '--scope', 'head', '--comments', 'none', ...args));
  const checker = (name) => run(path.join(lab, 'examples/workflows/check-result.js'), [name], lab);

  check('新目录、中文与空格路径、源库隔离', () => {
    assert.match(success(run(create, [lab])), /共 15 帖/);
    assert.match(success(run(path.join(lab, 'tools/validate.js'))), /15 帖/);
    assert.equal(fs.existsSync(path.join(lab, 'posts/private.md')), false);
    assert.equal(fs.existsSync(path.join(lab, '.git')), false);
    assert.equal(fs.existsSync(path.join(lab, 'AGENTS.md')), true);
    assert.deepEqual(snapshot(source), before);
  });
  check('全部候选、入口与盘点口径', () => {
    const all = JSON.parse(cli('query', '--json'));
    assert.equal(all.length, 15);
    assert.deepEqual(JSON.parse(cli('query', '--entry', '--json')).map((p) => p.id), ['lab-start']);
    const projects = JSON.parse(cli('query', '--tag', 'project-demo', '--json'));
    assert.deepEqual(projects.map((p) => p.id).sort(), ['project-copy', 'project-guide', 'project-links', 'project-platform']);
    assert.deepEqual(projects.reduce((counts, p) => ({ ...counts, [p.state]: (counts[p.state] || 0) + 1 }), {}),
      { done: 1, waiting: 2, active: 1 });
    assert.equal(JSON.parse(cli('query', '--tag', 'practice', '--json')).length, 10);
  });
  check('head、source主干、材料声明与引用', () => {
    const head = view('lab-handoff');
    assert.equal(head.scope, 'head');
    assert.equal(head.current, 'a2');
    assert.equal(head.answers.length, 1);
    assert.match(head.answers[0].body, /旧的全平台说法不再使用/);
    const spine = view('lab-handoff', '--scope', 'spine');
    assert.deepEqual(spine.answers.map((a) => [a.id, a.source]), [['a1', null], ['a2', 'a1']]);
    for (const p of JSON.parse(cli('query', '--json'))) {
      if (p.id === 'identity-registry') continue;
      const data = view(p.id);
      assert.match(data.query, /练习设定/);
      assert.match(data.answers[0].body, /未运行模型/);
    }
    // validate checks every depends_on target and answer anchor, including forward references.
    assert.match(success(run(path.join(lab, 'tools/validate.js'))), /校验通过/);
  });
  check('已有库、空目录、文件与符号链接均拒绝且无写入', () => {
    const empty = path.join(scratch, 'empty');
    const file = path.join(scratch, 'file');
    const link = path.join(scratch, 'linked-lab');
    const dangling = path.join(scratch, 'dangling');
    fs.mkdirSync(empty);
    fs.writeFileSync(file, 'keep');
    fs.symlinkSync(lab, link, 'dir');
    fs.symlinkSync(path.join(scratch, 'missing-target'), dangling, 'dir');
    const baseline = snapshot(scratch);
    for (const target of [lab, empty, file, link, dangling]) {
      assert.equal(run(create, [target]).status, 1);
      assert.deepEqual(snapshot(scratch), baseline);
    }
  });
  check('错误参数、源目录及缺少父目录不会产生新数据', () => {
    const baseline = snapshot(scratch);
    for (const args of [[], ['--force'], [lab, '--force'], ['   '], ['--unknown']]) {
      assert.equal(run(create, args).status, 2);
    }
    for (const target of [source, path.join(source, 'new-lab'), path.join(scratch, 'absent', 'lab')]) {
      assert.equal(run(create, [target]).status, 1);
    }
    assert.equal(run(create, ['--help']).status, 0);
    assert.deepEqual(snapshot(scratch), baseline);
  });
  check('三份未完成文件都不能通过验收', () => {
    for (const name of ['feedback', 'handoff', 'team']) assert.equal(checker(name).status, 1);
    assert.equal(checker('constructor').status, 2);
  });
  check('精确修正、保留通过行、CRLF与多余内容检查', () => {
    const feedback = path.join(lab, 'materials/feedback-note.txt');
    fs.writeFileSync(feedback, '便签盒：让零散想法有处可放。\n已验证 macOS；其他平台待验证。\n先试用，再决定是否保留。\n');
    assert.match(success(checker('feedback')), /PASS feedback[\s\S]*SHA-256: [a-f0-9]{64}/);
    const correct = fs.readFileSync(feedback);
    fs.writeFileSync(feedback, correct.toString().replace('零散想法', '灵感'));
    assert.equal(checker('feedback').status, 1);
    fs.writeFileSync(feedback, correct);
    fs.appendFileSync(feedback, '\n');
    assert.equal(checker('feedback').status, 1);
    fs.writeFileSync(feedback, correct);
    fs.writeFileSync(path.join(lab, 'materials/handoff-note.txt'),
      '便签盒：一份简单的入门说明。\r\n已验证 macOS；其他平台待验证。\r\n下一步：保存一条便签，再搜索它。\r\n');
    assert.match(success(checker('handoff')), /PASS handoff/);
    fs.writeFileSync(path.join(lab, 'materials/team-note.txt'),
      '便签盒：三步开始。\n适用范围：macOS 已验证；其他平台待验证。\n操作：保存一条便签，再搜索它。');
    assert.match(success(checker('team')), /PASS team/);
  });
  check('本地链接练习与离线升级快照确含所述问题', () => {
    const index = fs.readFileSync(path.join(lab, 'materials/project-index.md'), 'utf8');
    const links = [...index.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    assert.deepEqual(links, ['guide-old.md', 'feedback-note.txt']);
    assert.deepEqual(links.map((p) => fs.existsSync(path.join(lab, 'materials', p))), [false, true]);
    assert.ok(fs.existsSync(path.join(lab, 'materials/guide.md')));
    const data = JSON.parse(fs.readFileSync(path.join(lab, 'materials/upgrade-snapshot.json')));
    assert.equal(data.processAlive, true);
    assert.notEqual(data.uiVersion, data.runningVersion);
    assert.notEqual(data.serviceKbRoot, data.toolKbRoot);
    for (const field of ['buildRoot', 'kbRoot']) assert.equal(data.shadow[field], data.production[field]);
  });
  check('新结果回原帖后head与渲染仍一致', () => {
    const output = success(checker('feedback'));
    cli('answer', 'lab-feedback', '--as', 'human', '--source', 'a1', '--rel', 'extends',
      '--body-b64', Buffer.from(`验证脚本写入：文件已通过静态检查，未运行模型。\n${output}\n状态：等待验收。`).toString('base64'));
    assert.equal(view('lab-feedback').current, 'a2');
    assert.match(view('lab-feedback').answers[0].body, /PASS feedback/);
    assert.match(success(run(path.join(lab, 'tools/validate.js'))), /校验通过/);
    assert.deepEqual(snapshot(source), before);
  });
  console.log(`WORKFLOW LAB PASS (${checks} groups; no model/GUI execution)`);
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
