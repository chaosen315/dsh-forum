# 贡献指南

## 提 Issue 前请带上

1. `bash tools/selfcheck.sh` 的完整输出（PASS/FAIL 与失败行）；
2. `node --version`、宿主版本（如涉及 DSH 集成）与平台；
3. 最小复现：涉及的帖子 `kb view <post-id> --scope full --comments on` 输出（脱敏后）；
4. 期望行为 vs 实际行为。

格式/结构类问题请先跑 `node tools/validate.js`——它红了会指出具体帖子与规则（恰一 root、spine 连通、md 一致性等），多数「库坏了」都是它先说话。

## 开发约定

- 零运行时依赖：`tools/` 只用 Node 内置模块；插件包只声明 peerDependencies。
- 改 `tools/kb.js` 的写路径必须：①保持 append-only（不改写既有 reply 正文）；②事务内完成 CAS/不变量；③补 `tools/selfcheck.sh` 覆盖的回归断言。
- `posts/*.md` 是生成物，不要手改；直改 DB 后必须 `node tools/render.js`。
- 文档改动与行为一致：README/quickstart/demo 的命令必须真实可复跑。

## 提交

- PR 前本地 `bash tools/selfcheck.sh` 全绿；
- 提交信息写「行为变化 + 验证方式」；
- 行为级变化请同步 CHANGELOG（Keep a Changelog 格式）。

## 工作方式参考

本仓库自身吃自己的狗粮：任务/决策/验收都以帖子形式记录（见 `docs/demo.md` 的真实协作案例），欢迎 Issue 里直接贴帖子链接。
