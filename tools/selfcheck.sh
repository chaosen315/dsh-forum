#!/usr/bin/env bash
# forum-kb 自动验证入口：一条命令验证一次安装/快照是否健康。
# 用法：bash tools/selfcheck.sh [repo-root]  （缺省 = 本脚本所在仓库根）
# 全绿输出 SELFCHK PASS 并 exit 0；任何一步失败即 exit 非 0。
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ "${1:-}" != "" ] && ROOT="$1"
cd "$ROOT" || exit 1
fail() { echo "SELFCHK FAIL: $1"; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || fail "缺少命令：$1"; }

echo "== selfcheck @ $ROOT =="
need node
need git
need tar
need diff
NV=$(node -e "const[v]=process.versions.node.split('.').map(Number);console.log(v>=22?'ok':'old')")
[ "$NV" = "ok" ] || fail "Node >= 22.19（内置 node:sqlite）；当前 $(node --version)"

WORK=$(mktemp -d "${TMPDIR:-/tmp}/fkb-selfchk.XXXXXX") || fail "mktemp"
trap 'rm -rf "$WORK"' EXIT
git archive HEAD | tar xf - -C "$WORK" 2>/dev/null || cp -R "$ROOT"/. "$WORK"/ 2>/dev/null || true
[ -f "$WORK/tools/kb.js" ] || cp -R "$ROOT"/. "$WORK"/
[ -f "$WORK/tools/kb.js" ] || fail "无法构建测试副本"
# 自清理沙箱：目录里可能带着使用中的 kb.sqlite/posts（解包目录或正在使用的库），
# 不清掉会让 step 1 的 init 撞上覆盖保护而误报 FAIL（保护本身是对的）。
rm -f "$WORK/kb.sqlite"
rm -rf "$WORK/posts"
cd "$WORK" || exit 1

echo "-- 1. 空库 init（默认拒绝覆盖 + --force 重建）"
node tools/init.js >/dev/null || fail "init"
node tools/init.js >/dev/null 2>&1 && fail "init 未拒绝覆盖已有库"
node tools/init.js --force >/dev/null || fail "init --force"
node tools/validate.js >/dev/null || fail "init 后 validate"

echo "-- 2. 可选 demo（8 帖 + entry 唯一 + 身份入口）"
node tools/seed.js --force >/dev/null || fail "seed"
node tools/validate.js >/dev/null || fail "seed 后 validate"
node tools/kb.js query --entry --json 2>/dev/null | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);
if(j.length!==1||j[0].id!=='welcome-forum-plugin'){console.error('entry 异常');process.exit(1)}})" || fail "entry 唯一性"
node tools/kb.js query --tag meta --json 2>/dev/null | grep -q identity-registry || fail "身份入口不可发现"

echo "-- 3. 认领链回归（post→claim→steal→answer→summary→state；恰一 root）"
node tools/kb.js post selfchk-t --title t --author chk --tag x --summary s --body b >/dev/null || fail "post"
node tools/kb.js claim selfchk-t --as chk-human --body "锚点" >/dev/null || fail "claim"
node tools/kb.js claim selfchk-t --as chk-bot --steal a1 --body "接管" >/dev/null || fail "claim --steal"
node tools/kb.js answer selfchk-t --as chk-bot --source a1 --rel extends --body-b64 "$(printf '交付物' | base64)" >/dev/null || fail "answer"
node tools/kb.js summary selfchk-t --body-b64 "$(printf '自检帖：一句话定位' | base64)" >/dev/null || fail "summary"
node tools/kb.js state selfchk-t --state done >/dev/null || fail "state"
node tools/kb.js view selfchk-t --scope full --json 2>/dev/null | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);
const roots=j.answers.filter(a=>!a.source).length;
if(roots!==1){console.error('root 数='+roots);process.exit(1)}
if(j.current===null||j.state!=='done'){console.error('current/state 异常');process.exit(1)}})" || fail "认领链不变量"
node tools/validate.js >/dev/null || fail "认领链后 validate"

echo "-- 4. 渲染幂等 + 覆盖保护"
node tools/render.js >/dev/null && node tools/validate.js >/dev/null || fail "render 幂等"
node tools/seed.js >/dev/null 2>&1 && fail "seed 未拒绝覆盖已有库"

echo "SELFCHK PASS ($(node --version) @ $ROOT)"
