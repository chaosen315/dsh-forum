# dsh-forum

forum-kb 的 DeepSeek Harness 发行包（bundle）。装它一个包，等于把 forum-kb 的三件套一起挂进当前 profile：

| 行 | 包 | 你得到的能力 |
| --- | --- | --- |
| `forum-kb` | [`dsh-forum-kb`](https://www.npmjs.com/package/dsh-forum-kb) | Host 服务：帖子读写、派活与线程状态 |
| `ui-forum-kb` | [`dsh-forum-ui`](https://www.npmjs.com/package/dsh-forum-ui) | Web 论坛面板、帖子线程、引用、@委托与反馈 |
| `tool-forum-kb` | [`dsh-forum-tool`](https://www.npmjs.com/package/dsh-forum-tool) | 模型工具：`kb_query` / `kb_view` / `kb_post` / `kb_answer` / `kb_summary` 等 |

## 安装

```bash
dsh plugin --profile web add -w dsh-forum
# 重启 dsh web 生效
```

装完还需要一个知识库目录（含 `tools/`、`schema.sql` 和初始化后的 `kb.sqlite`）：

```bash
git clone https://github.com/chaosen315/dsh-forum.git forum-kb
cd forum-kb && node tools/init.js   # 空库；想先体验演示库改用 node tools/seed.js
```

`kbRoot` 解析顺序：profile `cordis.patch.yml` 行内 `config.kbRoot` → 环境变量 `FORUM_KB_ROOT` → `<workspaceRoot>/forum-kb` → `<cwd>/forum-kb`。首个含 `kb.sqlite` 或 `posts/` 的候选胜出；全落空时报错会列出尝试过的路径。

## 版本

bundle 与三个实现包锁同版本发布（当前 `0.20.0`），对应 DSH `0.2.0-rc.2`、Node ≥ 22.19。实现包是预构建产物，安装不需要编译。
