// 从 kb.sqlite 生成每帖一个 md 可读渲染。DB 是唯一事实源，md 是生成物。
// CLI：node tools/render.js
// 也可被 validate.js 引用（renderPost）做 md 一致性比对。
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const schema = require('./schema.js');

const REL_LABEL = { extends: '延伸自', supersedes: '取代自', 'relates-to': '关联自' };

function parseDeps(raw) {
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
}

function renderPost(db, post) {
  const replies = db
    .prepare('SELECT rowid AS seq, * FROM replies WHERE post_id = ? ORDER BY seq')
    .all(post.id);
  // 计数进 frontmatter：host list() 的读面就是 posts/*.md，客户端 top 排序与
  // 列表徽标直接消费（f0442aa0f3b3 P0 排序）。所有写路径都经 kb.js rerender，计数不漂移；
  // 直改 DB 不重渲染会被 validate.js 的 md 一致性比对抓出。
  const answersCount = replies.filter((r) => r.kind === 'answer').length;
  const commentsCount = replies.filter((r) => r.kind === 'comment').length;
  const lines = [];
  lines.push('---');
  lines.push(`id: ${post.id}`);
  lines.push(`title: ${post.title}`);
  lines.push(`author: ${post.author}`);
  lines.push(`tags: [${JSON.parse(post.tags).join(', ')}]`);
  lines.push(`state: ${post.state}`);
  lines.push(`current: ${post.current ?? ''}`);
  lines.push(`assigned: ${post.assigned ?? ''}`);
  lines.push(`entry: ${post.entry ? 'true' : 'false'}`);
  lines.push(`pinned: ${post.pinned ? 'true' : 'false'}`);
  if (post.pinned) lines.push(`pinned_scope: ${post.pinned_scope ?? ''}`);
  lines.push(`created_at: ${post.created_at ?? ''}`);
  lines.push(`updated_at: ${post.updated_at ?? ''}`);
  lines.push(`answers: ${answersCount}`);
  lines.push(`comments: ${commentsCount}`);
  lines.push(`summary: ${post.summary}`);
  const deps = parseDeps(post.depends_on);
  if (deps.length) lines.push(`depends_on: ${JSON.stringify(deps)}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${post.title}`);
  lines.push('');

  const meta = [`状态：${post.state}`];
  if (post.assigned) meta.push(`负责：${post.assigned}`);
  if (post.current) meta.push(`当前：${post.current}`);
  if (post.pinned) meta.push(`置顶：${post.pinned_scope ? '#' + post.pinned_scope : '全局'}`);
  lines.push(`> ${meta.join(' · ')}`);
  lines.push('');

  const query = replies.find((r) => r.kind === 'query');
  if (query) {
    lines.push('## Query');
    lines.push('');
    lines.push(query.body.trim());
    lines.push('');
  }

  for (const a of replies.filter((r) => r.kind === 'answer')) {
    const isCurrent = post.current === a.id;
    lines.push(`## Answer ${a.id}${isCurrent ? '（current）' : ''}`);
    lines.push('');
    if (a.source) {
      const rel = REL_LABEL[a.source_rel] ?? '关联自';
      lines.push(`> ${rel} \`${a.source}\``);
      lines.push('');
    }
    lines.push(a.body.trim());
    lines.push('');

    const comments = replies.filter((r) => r.kind === 'comment' && r.parent === a.id);
    if (comments.length) {
      lines.push('### 评论区');
      lines.push('');
      for (const c of comments) {
        lines.push(`**${c.author}**：${c.body.trim()}`);
        lines.push('');
      }
    }
  }
  return lines.join('\n').trimEnd() + '\n';
}

function renderAll(db, postsDir) {
  fs.mkdirSync(postsDir, { recursive: true });
  const posts = db.prepare('SELECT * FROM posts ORDER BY id').all();
  const written = [];
  for (const p of posts) {
    const file = path.join(postsDir, `${p.id}.md`);
    fs.writeFileSync(file, renderPost(db, p));
    written.push(file);
  }
  return written;
}

module.exports = { renderPost, renderAll };

if (require.main === module) {
  const ROOT = path.resolve(__dirname, '..');
  const db = new DatabaseSync(path.join(ROOT, 'kb.sqlite'));
  schema.apply(db);
  const files = renderAll(db, path.join(ROOT, 'posts'));
  console.log(`rendered ${files.length} posts`);
  for (const f of files) console.log('  ' + f);
}
