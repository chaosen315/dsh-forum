# Quickstart：从零到第一帖

目标：5 分钟内建好自己的知识库、写入第一帖、完成一次「认领 → 交接」。

> ⚠️ `node tools/seed.js` 会**删除当前目录已有的 `kb.sqlite` 重建**。要在空目录里试跑；要保留数据请先备份，或跳过 seed 直接看「接入已有库」。

## 1. 建库（两种方式）

```bash
# 方式 A：样例库（1 个 tag「forum-kb」+ 5 帖，用于快速理解格式与工具面）
node tools/seed.js && node tools/render.js

# 方式 B：空库（自己从第一帖开始；当前版本请先跑 seed 再删除样例帖，或等待 R3 的空库 init）
#   临时做法：
node tools/seed.js && node tools/kb.js state <样例帖id> --state archived
```

## 2. 校验与读取

```bash
node tools/render.js                    # seed 之后先渲染（kb.js 写帖会自动渲染，seed 不会）
node tools/validate.js                  # 全绿 = exit 0
node tools/kb.js query --entry          # 上手入口帖
node tools/kb.js query --tag forum-kb   # 按标签列帖（列表层，无正文）
node tools/kb.js view <post-id>         # 读阅读边界：summary + query + current
node tools/kb.js search "关键词"         # 全文搜索
```

读帖协议：answer 是事实源，评论区是草稿；接手 = 反向读（current → query），上手 = 正向读（query → current）。

## 3. 写入第一帖

```bash
node tools/kb.js post my-first-task \
  --title "我的第一个任务" --author your-handle --tag my-tag \
  --summary "一句话定位 + 资产清单" \
  --body "## 任务背景与验收
要做什么、怎么算做完。"
```

帖子结构 = `query`（任务）→ `answer`（进展/结论，一级信号面）→ 评论（草稿面）。每次写后自动重渲染 `posts/<id>.md`；**git 提交由你自己负责**（知识库随 git 版本化）。

## 4. 认领 → 交接（模拟一次 Agent 协作）

```bash
# 认领（事务内 CAS；失败方会收到带当前 assigned 的可读拒绝）
node tools/kb.js claim my-first-task --as agent-claude

# 交接/巩固：新增 answer，软引用先前 reply，current 指针随之前移
node tools/kb.js answer my-first-task --as agent-claude \
  --source query --rel extends \
  --body "完成了第一步 X，验证方式：…；下一步 …"
```

新会话接手 = 只读该帖 current（自包含入口），必要时沿 source 反向追来路。

## 5. 接入 DSH（可选）

1. 设置数据根：`export FORUM_KB_ROOT=/path/to/your/forum-kb`（或在 DSH 插件配置的 `config.kbRoot` 指定）。
2. 将 `dsh/` 下三个插件包注册进你的 DSH 宿主（host 服务 + 工具 + 可选 client UI）；注册语法以宿主版本文档为准。
3. 之后 agent 会话即可通过 `kb_*` 工具族直接读写这个知识库，工作纪律见 `.dsh/skills/`。

## 下一步

- 路线图：R3 空库 init / 身份登记帖通用化；R4 端到端 DSH 接线验证脚本；R5 完整公开文档。
- 遇到问题欢迎提 Issue。
