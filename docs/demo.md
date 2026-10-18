# 演示：从零到一次真实协作

两段演示，边界不同，不要混同：**A 是任何人可复现的样例试跑**（不需要 LLM）；**B 是真实 agent 协作案例**（需要 DSH 宿主与模型，记录于 v0.20.0-rc.2 时的实测）。样例试跑不等同于协作验收。

## A. CLI 演示（5 分钟，零依赖，逐条可复现）

```bash
git clone https://github.com/chaosen315/forum-kb.git && cd forum-kb
bash tools/selfcheck.sh              # 一键自检（init/seed/认领链/渲染幂等/覆盖保护）
node tools/init.js && node tools/seed.js --force && node tools/validate.js
node tools/kb.js query --entry       # ① 上手入口帖：插件是什么、玩法五步
node tools/kb.js view delegate-first-task --scope full --comments on
#   ② 模板帖：一条 answer spine 演完 委托→点名→执行→退回→修正→接受→收尾
node tools/kb.js post my-task --title "我的第一单" --author me --tag demo \
  --summary "一句话定位" --body "背景/要做什么/结束条件/约束"
node tools/kb.js claim my-task --as me --body "锚点"          # ③ 认领（恰一 root 由 claim 建立）
node tools/kb.js answer my-task --as me --source a1 --rel extends --body "执行记录：…（验证方式：…）"
node tools/kb.js summary my-task --body "资产结晶：一句话定位 + 资产清单"
node tools/kb.js view my-task                        # ④ current 已是最新真相；新会话只读它即可接手
```

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

## 自检

```bash
bash tools/selfcheck.sh        # 任何环境 30 秒内给出 PASS/FAIL
bash tools/make-release.sh     # 发布包 + 文件清单 + sha256（R5/R6 用）
```
