# 六种工作，从帖子接着做

**先挑一件你今天就想做的事。** 这些用例改编自维护者日常使用 forum-kb 的流程；人物、项目、材料和历史记录均为重新编写的练习数据。

| 你遇到的情况 | 试这个用例 | 回来时应看到什么 |
| --- | --- | --- |
| 大部分结果通过，只想改一处 | [01 定向反馈](01-focused-feedback.md) | 保留通过部分，修订与验证回到同一帖 |
| 换了会话，甚至换了电脑 | [02 从当前结论接手](02-handoff.md) | 新 Agent 找到目标、现状、下一步并继续 |
| 几天没看项目，不知道先做哪件事 | [03 项目盘点](03-project-snapshot.md) | 全部候选任务、真实阻塞和可选下一步 |
| 上次做过类似操作，想借用经验 | [04 核验旧经验](04-reuse-experience.md) | 哪些仍适用、哪些已失效、这次的依据 |
| 调研看完了，想采纳其中一项 | [05 调研转执行](05-research-to-action.md) | 采纳的结论成为有范围、有验收的新任务 |
| 想交给几个 Agent 做，自己只看结果 | [06 拆分与独立复核](06-delegate-and-review.md) | 子帖有证据，主帖有总结果，退回能定向修正 |

第一次建议选 **01**。每篇都包含现成材料、可复制的话、反馈方法和验收标准；也可以把示例文件替换成自己的工作。

## 建一个独立练习库

以下新增用例在 **main**，不包含在原有 `v0.20.0` tag / Release 压缩包中。Node.js ≥ 22.19、Git 即可创建和阅读，无需模型。

在一个尚不存在 `forum-kb-examples`、`forum-kb-lab` 的父目录中运行：

```bash
git clone --branch main https://github.com/chaosen315/dsh-forum.git forum-kb-examples
cd forum-kb-examples
node examples/workflows/create-lab.js ../forum-kb-lab
cd ../forum-kb-lab
node tools/validate.js
node tools/kb.js query --tag practice --json
node tools/kb.js view lab-feedback --scope head --comments none
```

创建器只接受一个**尚不存在的目标目录**，父目录须已存在。已有空目录、已有知识库、符号链接、额外参数都会被拒绝；没有 `--force`。源仓库即使已有数据库，也不会被读取或复制。

创建后的目录：

```text
forum-kb-lab/
  kb.sqlite              15 帖：身份入口 + 14 条练习/材料帖
  posts/                 自动生成的可读副本
  materials/             7 份虚构输入材料
  examples/workflows/    六篇指南、创建器与验证脚本
  tools/ + schema.sql    独立运行 CLI 所需文件
  AGENTS.md              针对练习库的阅读、执行与回写约定
```

先在 `identity-registry` 登记自己的实际身份，再开始写入。`human` 是预置资料的署名；`@执行者`、`@复核者` 是指南中的角色占位符，请在 DSH 中选择本机真实可用目标。

要保存练习版本，可在练习目录执行 `git init`、`git add .`、`git commit -m "start workflow lab"`。生成库的 `.gitignore` 只忽略临时依赖和日志，会将数据库、材料和渲染结果一起纳入版本管理。之后每轮任务写完也应提交。

## 让 Agent 真正开始

把 DSH 的服务插件和工具插件 `kbRoot` 都指向刚生成的**绝对路径**，并让执行会话以该目录为工作区。接线方法见 [DSH 指南](https://github.com/chaosen315/dsh-forum/blob/main/docs/dsh-wiring.md)。已有常用库时，建议用独立 DSH profile 练习。

1. 打开对应任务帖。预置练习帖已有首条 answer，可直接在它下面派活；自己新建的帖先用「巩固 · answer」写一条委托锚点。
2. 将用例里的委托粘贴到评论框，输入 `@` 并选择真实目标后发送，确认「已派」回执。
3. 可以打开 session 看过程，也可以稍后回帖看 current。
4. 要修正时，在对应结果下再次点名，写清保留什么、改什么。确认续聊或恢复回执。
5. 结果和依据充分后明确接受；需要 Agent 收尾时再次点名。未接受时保留待验收状态。

CLI 的 `post`、`claim`、`comment` 只处理记录，不启动模型。没有 DSH 时，可把委托交给你正在使用的 Agent，并明确提供练习目录及 CLI 入口；这属于手动交接，不会出现 DSH 派活回执。

DSH 的 `kb_view` 默认读 head 且不加载评论；裸 CLI 为兼容界面，默认读 full 和评论。教程中的 CLI 命令显式加 `--scope head --comments none`，确保只读当前结论。

## 练习的边界

预置 answer 都标为“练习设定”，用来提供接手前的背景；其中的 `done` 只表示虚构项目中的既定状态。**它们不是某次真实模型执行或验收的证据。** 每次练习产生的新结果，应记录真实命令、实际输出和未验证项。

六篇可以独立使用。盘点的固定数量以初始库为准；反复练习建议创建另一个新目录。回退文件修改可使用自己保存的 Git 基线；帖子答复用追加更正保留来路。放弃整次练习时，只需将 DSH 切回原 `kbRoot` 并保留或移走练习目录，无需重建常用库。

维护者可在公开源码仓库复跑 `node examples/workflows/verify-lab.js`：覆盖新目录创建、覆盖拒绝、源库隔离、引用与主干、渲染一致性，以及用例 01/02/06 的文件验收器。脚本不调用模型；本批材料未逐篇重新跑 DSH 模型与 GUI，已有真实工作循环的验证范围见 [Demo](https://github.com/chaosen315/dsh-forum/blob/main/docs/demo.md)。
