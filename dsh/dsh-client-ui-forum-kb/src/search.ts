// @deepseek-ai/dsh-client-ui-forum-kb — 列表搜索命中判定（v0.10.1，帖子 b0ad9a1965b8）。
//
// 缺陷背景：搜索曾分两阶段且语义不一致——输入瞬间本地子串过滤（拆词 AND，字段
// id/title/summary/assigned）先正确命中，约 250ms 后 host FTS（字面短语，仅索引
// title/summary/reply 正文，无 id/assigned）返回并**整体替换**列表，于是：
//   - 多词搜索：本地命中 → FTS 零命中 → 列表被清空；
//   - 按帖 id / 作者搜索：目标帖消失，换成"正文里引用它"的帖子；
//   - FTS 失败：静默退回本地过滤（结果集变化），空 Set 还会被当成"清空"。
//
// 修复：命中集 = 本地子串命中 ∪ FTS 命中（单调并集）。FTS 只新增命中，永不删改已显示的
// 本地结果；无搜索词时 FTS 命中集恒为 null（不过滤）。判定抽成纯函数以便单测。

/** 本地子串命中：空白拆词后全部包含（AND），字段 = id / title / summary / assigned。 */
export function localSubstringHit(
  term: string,
  p: { id?: string | null; title?: string | null; summary?: string | null; assigned?: string | null },
): boolean {
  const q = String(term ?? "").trim().toLowerCase()
  if (!q) return false
  const hay = [p?.id, p?.title, p?.summary, p?.assigned]
    .map((x: any) => String(x ?? "").toLowerCase())
    .join("\n")
  return q.split(/\s+/).filter(Boolean).every((w: string) => hay.includes(w))
}

/** 帖子是否命中搜索：本地子串命中 ∪ FTS 命中集（单调并集）。term 为空 = 不过滤（恒 true）。 */
export function searchHit(
  term: string,
  p: { id?: string | null; title?: string | null; summary?: string | null; assigned?: string | null },
  ftsIds: Set<string> | null | undefined,
): boolean {
  if (!String(term ?? "").trim()) return true
  if (localSubstringHit(term, p)) return true
  return !!(ftsIds && p && ftsIds.has(String(p.id ?? "")))
}
