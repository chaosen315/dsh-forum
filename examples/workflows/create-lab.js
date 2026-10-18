#!/usr/bin/env node
// Build a new, standalone practice KB using only checked-in public fixtures.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const fixtures = require('./fixtures.js');

const ROOT = path.resolve(__dirname, '../..');
const HELP = '用法：node examples/workflows/create-lab.js <尚不存在的目录>\n父目录须已存在；拒绝覆盖；不读取源库数据；没有 --force。';
const b64 = (value) => Buffer.from(value, 'utf8').toString('base64');

function buildLab(destination) {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 19)) throw new Error('需要 Node.js ≥ 22.19');
  const target = path.resolve(destination);
  // Resolve the existing parent; mkdir without recursive atomically refuses every existing target.
  const parent = fs.realpathSync(path.dirname(target));
  const source = fs.realpathSync(ROOT);
  const relative = path.relative(source, parent);
  const outsideSource = relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  if (!outsideSource) throw new Error('练习目录应放在源仓库外，例如 ../forum-kb-lab');
  const lab = path.join(parent, path.basename(target));
  fs.mkdirSync(lab);
  try {
    const copy = (from, to = from) => {
      fs.mkdirSync(path.dirname(path.join(lab, to)), { recursive: true });
      fs.copyFileSync(path.join(ROOT, from), path.join(lab, to));
    };
    // Deliberately do not copy kb.sqlite, posts/, .git, user config, or installed plugins.
    for (const file of ['kb.js', 'init.js', 'schema.js', 'render.js', 'validate.js', 'identity-registry.js']) {
      copy(`tools/${file}`);
    }
    copy('schema.sql');
    copy('LICENSE');
    copy('examples/workflows/lab-agent-guide.md', 'AGENTS.md');
    fs.cpSync(__dirname, path.join(lab, 'examples/workflows'), { recursive: true });
    fs.cpSync(path.join(__dirname, 'materials'), path.join(lab, 'materials'), { recursive: true });
    fs.writeFileSync(path.join(lab, '.gitignore'), 'node_modules/\n*.log\n.DS_Store\n');
    fs.writeFileSync(path.join(lab, 'README.md'),
      '# forum-kb 独立练习库\n\n从 [六种用例](examples/workflows/README.md) 开始。所有预置记录为虚构设定。\n\n运行 `node tools/validate.js`，然后 `node tools/kb.js view lab-start --scope head --comments none`。\n\n首次操作先读 [Agent 约定](AGENTS.md)。当前目录就是 kbRoot。\n');
    const run = (file, args = []) => execFileSync(process.execPath, [path.join(lab, 'tools', file), ...args],
      { cwd: lab, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const cli = (...args) => run('kb.js', args);
    run('init.js');
    // Two passes: create every post first, then attach cross references and history.
    for (const p of fixtures) {
      cli('post', p.id, '--title', p.title, '--author', 'human', '--tag', p.tag || 'practice',
        '--summary', p.summary, '--body-b64', b64(`【练习设定：虚构输入，非真实执行记录】\n\n${p.query}`));
    }
    for (const p of fixtures) {
      for (const [index, answer] of p.answers.entries()) {
        cli('answer', p.id, '--as', 'human',
          ...(index ? ['--source', `a${index}`, '--rel', 'extends'] : []),
          '--body-b64', b64(`【练习设定：预置背景，未运行模型】\n\n${answer}`));
      }
      if (p.deps) cli('depends', p.id, '--set-b64', b64(JSON.stringify(p.deps)));
      if (p.state) cli('state', p.id, '--state', p.state);
      if (p.entry) cli('entry', p.id, '--set', 'true');
    }
    const validation = run('validate.js').trim();
    return { lab, validation, count: fixtures.length + 1 };
  } catch (error) {
    // Keep partial output for diagnosis. Never delete a caller-supplied directory recursively.
    throw new Error(`创建未完成，已保留本次新目录 ${lab}；查看原因后可另选新目录重试。\n${error.message}`);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log(HELP);
  } else if (args.length !== 1 || args[0].startsWith('-') || !args[0].trim()) {
    console.error(HELP);
    process.exitCode = 2;
  } else {
    try {
      const result = buildLab(args[0]);
      console.log(`${result.validation}\n已创建独立练习库：${result.lab}\n共 ${result.count} 帖；入口 lab-start。未启动模型。\n下一步：进入该目录，运行 node tools/kb.js view lab-start --scope head --comments none`);
    } catch (error) {
      console.error(`✗ ${error.message}`);
      process.exitCode = 1;
    }
  }
}

module.exports = { buildLab };
