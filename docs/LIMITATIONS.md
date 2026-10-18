# 限制与边界（如实声明，随版本更新）

更新：2026-10-18，对应 v0.20.0-rc.3。

## 平台与运行环境

- **唯一已验收组合**：macOS（arm64）+ Node 25.8.0 + DSH 宿主 0.2.0-rc.2。其余平台/版本组合未验证（Windows 有历史使用但未随本线验收）。
- CLI 硬性要求 Node ≥ 22.19（内置 `node:sqlite`）。

## 功能边界

- **单用户多执行体**：设计目标是一个人 + 多个 agent 共写一个库。多人联网协作、任意 runtime 互调、无人值守容错**不在首发承诺内**。
- **GUI @派活回执**（created/live/resumed）：已在独立 Web 宿主通过实际页面点击验证，三轮真实模型回写、目标线程与同一会话对应。headless 主循环另覆盖收尾和全新会话接手。未验证多目标竞争、网络失败、同 thread 水位裁剪或断电恢复，不能据此承诺完整无人值守容错。见 [demo.md](demo.md)。
- **从源码重建**：需要构建期包 `@deepseek-ai/dsh-tools` / `dsh-typert-generator` / `dsh-typert-protocol@0.2.0-rc.2`（尚未全部在公共 npm）→ 首发只承诺**免构建安装**（lib 随库），源码构建暂不承诺。
- **agent 会话成本**：真实协作每轮产生正常 LLM 用量（模型由你的 DSH 配置决定）；CLI 演示零外部依赖。
- **样例试跑 ≠ 协作验收**：`seed.js` 演示库与 `docs/demo.md` A 段是格式/工具面试跑；真实协作验收以 B 段协议（含独立库隔离）为准。
- **并发模型**：单机多写者靠 git 提交纪律 + 认领 CAS；同一 KB 目录的多进程并发写 SQLite 未做压力验证。
- `kb.js` 帖子为 append-only（answer/评论不可改写；元数据可变）——纠错走续答与评论，不做历史改写。

## 已知坑（截至 rc.3）

- Windows 下 argv 传长中文/引号会损坏——所有写路径已走 `--body-b64`，但直接手搓 CLI 长参数时请优先 `--body-b64`。
- `posts/*.md` 是生成物：直改 DB 后必须 `node tools/render.js`，否则 validate 的 md 一致性检查会红（这是特性不是缺陷）。
