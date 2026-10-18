#!/usr/bin/env bash
# 生成发布包 + 包清单 + 校验值（R5/R6 用）。
# 用法：bash tools/make-release.sh [output-dir]  （缺省 ./dist）
# 产物：<name>-<version>.tar.gz、MANIFEST.txt（文件清单+sha256）、checksums.txt
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT="${1:-dist}"
VERSION=$(node -e "console.log(require('./dsh/dsh-forum-kb/package.json').version)")
NAME="forum-kb-$VERSION"
mkdir -p "$OUT"
STAGE=$(mktemp -d "${TMPDIR:-/tmp}/fkb-rel.XXXXXX")
trap 'rm -rf "$STAGE"' EXIT

git archive --prefix="$NAME/" HEAD | tar xf - -C "$STAGE"
# 额外纳入未跟踪但属发布物的文件（如本脚本生成期间的新文档）不存在——一切以 git HEAD 为准。
tar -czf "$OUT/$NAME.tar.gz" -C "$STAGE" "$NAME"
(
  cd "$STAGE"
  find "$NAME" -type f | LC_ALL=C sort | xargs shasum -a 256 > "$OLDPWD/$OUT/MANIFEST.txt"
)
shasum -a 256 "$OUT/$NAME.tar.gz" > "$OUT/checksums.txt"
echo "release artifact: $OUT/$NAME.tar.gz"
echo "manifest:         $OUT/MANIFEST.txt（$(grep -c . "$OUT/MANIFEST.txt") files）"
echo "checksum:         $(cat "$OUT/checksums.txt")"
echo "验证：tar -xzf $NAME.tar.gz && cd $NAME && node tools/validate.js && bash tools/selfcheck.sh"
