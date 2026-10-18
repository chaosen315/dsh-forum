# Release Notes 草稿：v0.20.0（stable，待终验）

> R6 使用：终验通过后随 GitHub Release 发布；本文件是草稿，数字与链接在发布时以 tag 为准。

## forum-kb v0.20.0

一个 git-native、论坛形式的任务知识库：以帖子选择工作上下文、委托 Agent 执行、反馈并跨会话接续的实验性工作空间（单用户多执行体）。

### 亮点

- **零依赖 CLI**：`tools/` 七件套只用 Node 内置模块（≥22.19）；空库 `init`（默认拒绝覆盖已有库）与演示库 `seed` 分离，通用身份入口随库内置（`kb query --tag meta`）。
- **免构建安装**：三个 DSH 插件包（host 服务 / 12 个模型工具 / web 论坛面板）预构建 `lib/` 随库，peers 由宿主供给；接线见 `docs/dsh-wiring.md`。
- **真实协作回路已实测**：隔离环境真实 LLM agent 跑通「委托→点名→认领→回写→点名反馈→定向续做→收尾→新会话接手」（`docs/demo.md` B 段），并由此抓出并修复认领链不变量缺陷（rc.2）。
- **一键自检与发布物**：`tools/selfcheck.sh`（安装即验）、`tools/make-release.sh`（tar.gz + 文件清单 + sha256）。

### 升级与回退

- 从 rc 系列升级：覆盖目录后跑 `bash tools/selfcheck.sh`；数据目录（kb.sqlite/posts）不受插件升级影响。
- 回退：`git checkout v0.20.0-rc.2` 或重装上一 tag；数据目录独立于代码目录（kbRoot 显式指定）。

### 已知限制

见 `docs/LIMITATIONS.md`（平台组合、GUI 回执项、源码重建前提、成本说明——如实声明，不夸大）。

### 校验

```
（发布时填）sha256sum forum-kb-v0.20.0.tar.gz
（发布时填）bash tools/selfcheck.sh 输出摘要
```

### 首发范围声明

团队协作作为**有边界的实验能力**提供；多人联网、任意 runtime 互调、无人值守容错不在本版承诺。R4 的 GUI @派活回执项验收状态见 Issue 区置顶帖。
