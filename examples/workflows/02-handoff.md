# 02 · 换一个会话，继续同一件事

你中断了一项工作。几天后换了会话，甚至换了电脑，只想说“接着做”，而不用重讲项目历史。

准备：[建立练习库](README.md#建一个独立练习库)，查看 `lab-handoff`。它有两条历史 answer：`a1` 留下早期草稿，`a2` 更正了平台范围并说明下一步。当前文件是 [handoff-note.txt](materials/handoff-note.txt)。

## 把入口交给全新会话

在 DSH 新建一个会话，或使用另一个可用目标，交给它：

```text
请在我指定的 forum-kb-lab 目录接手 lab-handoff，继续完成剩余工作。
我不再补充前一会话的背景，已有目标和判断以本帖为入口。
先用 kb_view 读本帖 head；CLI 等价命令是：
node tools/kb.js view lab-handoff --scope head --comments none

先用三句话说明目标、当前成果、下一步，再按帖内范围继续执行。
上下文是本帖和它明确引用的文件；
需要判断历史为何变化时再读 spine，缺少材料则列出缺口。

按帖内验收方法检查，将完整成果、实际输出和未决事项回本帖，等待我验收。
检查失败可在已定文件范围内修复复验。
```

明确告诉 Agent 练习目录的实际绝对路径；路径是本机参数，不需要抄前一台电脑的用户名和目录。

如果通过帖内 `@` 派活，确认回执是**新会话**。点名同一目标可能续聊或冷恢复已有 session；这能测试续做，但不能证明一个空白会话已独立找回背景。

## 你应看到什么

开始执行前，三句话应包含：

| 项目 | 正确理解 |
| --- | --- |
| 目标 | 完成三行便签盒入门说明 |
| 当前成果 | 前两行已经接受；只声明 macOS 已验证 |
| 下一步 | 将第三行改成可操作的一步，并核验后回原帖 |

运行 `node examples/workflows/check-result.js handoff`，初始应失败，完成后应输出 `PASS handoff`。若新 Agent 又宣称“全平台可用”，它采用了旧结论，或没有核验 current。

最后用 `node tools/kb.js view lab-handoff --scope head --comments none` 检查：仅看 query 和最新 answer，应足以知道完整成果、依据及是否仍等你验收。新 answer 的 `source` 应接到当时的当前答复，保留更正来路；不必把全部旧会话搬进帖子。

## 真正换电脑时

停止旧目录的写入，将完整练习目录或受控仓库快照带到新电脑，保留数据库、tools、schema 和材料；重新指定 DSH 服务与工具的同一个 `kbRoot`。先跑 `node tools/validate.js`，再分别从 UI 与 Agent 工具读取 `lab-handoff`，确认 current 一致后继续。

这一步练习的是**已有记录的可接续性**；复制文件不等于跨机同步或并发合并。若接机失败，保留原目录快照，先恢复原机接线。跨操作系统部署仍须按 [支持范围](https://github.com/chaosen315/dsh-forum/blob/main/docs/LIMITATIONS.md) 单独验证。

[下一篇：盘点项目 →](03-project-snapshot.md) · [用例目录](README.md)
