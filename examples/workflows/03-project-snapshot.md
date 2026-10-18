# 03 · 几天没看项目，先决定做哪件事

你回到一个有好几条任务的项目，想知道哪些已经交付、哪些在等你，以及现在可以继续什么。

准备：[建立练习库](README.md#建一个独立练习库)。`project-demo` 标签包含四条项目任务；盘点帖 `lab-inventory` 使用另一个标签，因此不会把自己的报告也计入项目任务。

## 先做盘点

在 `lab-inventory` 当前 answer 下点名：

```text
@执行者 请盘点 project-demo 标签下的全部帖子。
先 query 列出完整候选列表，再逐帖读取 head；需要来路时才追 spine。
本次授权背景就是该标签下的帖子及其明确引用，盘点结果写回本帖。

请逐项写：post ID、current、元数据 state、实际进度依据、阻塞、
可做的下一步、是否需要我决定，并核对总数。
waiting 请区分“已交付待验收”和“缺少决策暂不能继续”。
只交报告与建议，不认领项目任务、不改它们的内容和状态。
有状态与正文冲突则两者都列出，不替我猜。
```

Agent 可以在一个 answer 中给出结果。CLI 的候选列表：

```bash
node tools/kb.js query --tag project-demo --json
```

## 初始库的对照答案

| 帖子 | state | 从 current 读出的实际进度 | 合适的下一步 |
| --- | --- | --- | --- |
| `project-links` | active | 有委托锚点，尚未检查；不能凭 active 推断正在执行 | 检查指定的本地相对链接 |
| `project-guide` | waiting | 三行指引已交付，等用户验收 | 用户检查成果后决定 |
| `project-platform` | waiting | 等待用户决定是否扩展平台 | 先做平台范围决策 |
| `project-copy` | done | 练习设定中已接受标题 | 本轮不需继续 |

总计 **4 帖：active 1 / waiting 2 / done 1**。这是初始材料的答案；你做过任务或增删帖子后，报告应反映当时的真实快照，并写明盘点时间。元数据统计与“已交付/受阻/未开始”是两种不同口径。

## 选中一项，才开始改

在看到完整清单后，如果你决定先查链接，在 `project-links` 当前 answer 下发送：

```text
@执行者 我选择先处理本帖的链接检查。
请核对 materials/project-index.md 中的两个相对链接。
只允许修改这个文件，把不存在的 guide-old.md 改为已有的 guide.md；
其他内容保持不变。逐条列出解析后的路径和存在性，结果回本帖等待验收。
```

初始 `guide-old.md` 不存在，`feedback-note.txt` 存在；修改后两条路径都应存在。验收时从 `materials/project-index.md` 所在目录解析链接。已通过部分不必重做，盘点帖可追加一条指向这次结果的更新。

盘点是一张让你作决定的清单；读到某帖写着“建议修复”，本身不构成新的执行授权。回退只涉及索引文件中改动的一个链接，报告保留当时事实。

[下一篇：旧经验如何复用 →](04-reuse-experience.md) · [用例目录](README.md)
