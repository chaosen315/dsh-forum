# 演示：从零到一次真实协作

两段演示，边界不同，不要混同：**A 是任何人可复现的样例试跑**（不需要 LLM）；**B 是真实 agent 协作案例**（需要 DSH 宿主与模型，记录于 v0.20.0-rc.2 时的实测）。样例试跑不等同于协作验收。

想先看界面，可回 [README 截图导览](../README.md)，或查看[高清图与素材说明](media/README.md)。导览来自实际插件界面、使用演示数据，并非 B 段测试的录像。

## A. CLI 演示（无需模型，逐条可复现）

```bash
git clone --branch v0.20.0-rc.3 https://github.com/chaosen315/forum-kb.git
cd forum-kb
bash tools/selfcheck.sh              # 一键自检（init/seed/认领链/渲染幂等/覆盖保护）
node tools/seed.js                   # 在新副本初始化演示库；已有库则拒绝覆盖
node tools/validate.js
node tools/kb.js query --entry       # ① 上手入口帖：插件是什么、玩法五步
node tools/kb.js view delegate-first-task --scope full --comments on
#   ② 模板帖：一条 answer spine 演完 委托→点名→执行→退回→修正→接受→收尾
node tools/kb.js post my-task --title "我的第一单" --author me --tag demo \
  --summary "一句话定位" --body "背景/要做什么/结束条件/约束"
node tools/kb.js claim my-task --as me --body "锚点"          # ③ 认领（恰一 root 由 claim 建立）
node tools/kb.js answer my-task --as me --source a1 --rel extends --body "执行记录：…（验证方式：…）"
node tools/kb.js summary my-task --body "资产结晶：一句话定位 + 资产清单"
node tools/kb.js view my-task                        # ④ head 提供目标与当前答复，必要时追溯主干
```

以上命令只写入和读取演示记录。`claim` 不启动会话，`comment` 也不会单靠正文中的 @ 调度模型。

## B. 真实协作案例（R4 实测，2026-10-18，v0.20.0-rc.2）

在**独立 lab 库 + 隔离 DSH home** 用真实 LLM agent 跑完整工作循环（接线见 [dsh-wiring.md](dsh-wiring.md)，协议八步含逐步断言）：

| 轮 | 谁 | 做了什么 |
| --- | --- | --- |
| 委托 | 人 | `kb post` 委托帖（目标/引用/结束条件/约束）→ `kb claim` 锚点 → 评论区 `@执行体` 点名派活 |
| 执行 | agent（真实模型） | `kb_view` 读全帖 → `kb_claim --steal a1` 接管 → `kb_answer` 交付（逐行字数程序化自检）→ 派活回执 |
| 反馈 | 人 | 评论区点名退回第 2 行（其余行通过、保留） |
| 续做 | agent（真实模型） | 只改退回行 → 交付 a4 → 回执 → `kb_summary` 资产结晶 + `kb_state done` |
| 接手 | 全新会话（真实模型） | 只读 head 一次 → 三行简报（目标/现状/下一步），与事实一致 |

实测中抓到并修复了一个真实缺陷（`kb claim` 不推进 `current` 导致双 root，见 CHANGELOG 0.20.0-rc.2）——协作回路在工作，且能抓住回归。

**依赖与成本**：B 需要 DSH 宿主 0.2.0-rc.2 与可用的模型提供方（agent 会话产生正常 LLM 用量）；A 无任何外部依赖。

### Web 界面的派活与续做

在另一组隔离 GUI 验证中，通过实际客户端发送点名评论，得到以下结果；未用 mock 响应或直接调用派活接口代替点击。

| 操作 | 页面结果 | 核对结果 |
| --- | --- | --- |
| 首次在帖内点名 | `已派 · 新会话` | created；模型读取、认领并回写正确任务 |
| 对同一目标反馈，只退回第二行 | `已派 · 现存会话·续聊` | live；会话 ID 保持，仅第二行变化 |
| 重启独立宿主后再次点名 | `已派 · 冷恢复` | resumed；恢复同一会话，保留修正后的结果 |

这组 GUI 验证覆盖三态回执、反馈与冷恢复；上表 B 段的 headless 验证另覆盖 summary/state 收尾与全新会话读取 head。`live` 表示会话在内存中存在，不等于模型当时正在生成。验收组合为 macOS arm64 + DSH 0.2.0-rc.2，其他边界见 [LIMITATIONS](LIMITATIONS.md)。

## 自检

```bash
bash tools/selfcheck.sh        # 任何环境 30 秒内给出 PASS/FAIL
bash tools/make-release.sh     # 发布包 + 文件清单 + sha256（R5/R6 用）
```
