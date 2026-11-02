# 发布 npm 包（trusted publishing / OIDC）

本仓库的 4 个 npm 包用 **npm trusted publishing（OIDC）** 发布，不走长期 token、不需要在 CI 里放凭据：

| 包 | 目录 | 角色 |
| --- | --- | --- |
| `dsh-forum-kb` | `dsh/dsh-forum-kb` | Host 服务 |
| `dsh-forum-tool` | `dsh/dsh-tool-forum-kb` | `kb_*` 模型工具 |
| `dsh-forum-ui` | `dsh/dsh-client-ui-forum-kb` | Web 论坛面板 |
| `dsh-forum` | `dsh/dsh-forum` | bundle：依赖上面三个，`dsh plugin add -w dsh-forum` 一条命令挂三行 |

发布流水线：`.github/workflows/publish-npm.yml`（`workflow_dispatch` 手动触发，OIDC + `--provenance`，顺序=三个实现包在前、bundle 最后）。

## 为什么不用 token / bypass-2FA

npm 已开始退场 2FA-bypass 凭据：2026-07-31 起不能再做账号/包管理，2027-01 起连直接 publish 也会被收回（[公告](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens/)）。官方给的迁移路径就是 trusted publishing（OIDC）或 staged publishing。本仓库采用前者。

## 一次性配置（需要 npm 账号交互式 2FA）

前置：npm 账号已开启 2FA（Account Settings → Two-factor authentication）。**发布、配置 trusted publisher 等敏感操作都要求账号级 2FA**；没开 2FA 时 `npm publish` 会返回 403 “Two-factor authentication or … bypass 2fa enabled is required”，且 token 创建页不会出现 bypass 选项。

在能交互输入 OTP 的终端（项目根目录）为四个包各配一次：

```bash
for pkg in dsh-forum-kb dsh-forum-tool dsh-forum-ui dsh-forum; do
  npm trust github "$pkg" --file publish-npm.yml --repo chaosen315/dsh-forum
done
```

（等价操作：npmjs.com → 包设置 → Trusted Publisher → GitHub Actions，填 owner/repo 与 workflow 文件名。）

**注意**：

- trusted publisher 配置在首次成功发布前是 unvalidated 状态，**48 小时内**必须完成一次发布，否则配置过期需要重建（[公告](https://github.blog/changelog/2026-10-02-unvalidated-npm-trusted-publishing-configurations-now-expire/)）。
- 配置里没有绑定 environment；如果以后加了 `environment`，workflow 的 job 也要加同名 `environment`。
- 若 `npm trust` 对尚未发布的包报 404（首次创建包的限制），先走一次 staged publishing 创建包（见下），或交互式 `npm publish` 完成首发，再配 trusted publisher。

## 发布一个新版本

1. 四个 `package.json` 的 `version` 同步改成同一版本（bundle 的 `dependencies` 精确钉住三个实现包版本）。
2. 本地检查：
   ```bash
   node scripts/verify-npm-release.mjs
   ```
   它会校验版本对齐、`files` 产物齐全、bundle patch 存在、以及四个 `<name>@<version>` 在 registry 上尚未发布。
3. 提交并推送 main。
4. 触发流水线：
   ```bash
   gh workflow run publish-npm.yml -R chaosen315/dsh-forum
   ```
   或 GitHub → Actions → publish-npm → Run workflow（可选 dist-tag，默认 `latest`）。

## 首次发布（包尚不存在时）

按 npm 的规则，包名第一次出现在 registry 需要一次「创建」。有两条路：

1. **trusted publisher 直接首发**（配好四个 trust 后直接跑 workflow；若 npm 允许为新包配置 trust，则一次搞定）。
2. **staged publishing 首发**：用本机已登录的 npm session（`npm login`）执行 `npm stage publish`，包进入 staged 队列后由维护者在 npm 网页上用 2FA 批准；包出现后再配 trusted publisher。staged publish 的 CLI 需要 npm ≥ 12（`npm i -g npm@12`）。

## 验收

发布后：

```bash
npm view dsh-forum version
npm view dsh-forum-kb version
dsh plugin --profile web add -w dsh-forum   # 在一个隔离 profile 里验证
```
