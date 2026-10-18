# Changelog

All notable changes to forum-kb are documented here. Format based on Keep a Changelog.

## 0.11.0-rc.4 — 2026-10-18 (templates aligned with post-driven workflow)

### Changed
- `welcome-forum-plugin` (entry) rewritten to walk the real user loop: pick/create a post with explicit context and completion conditions → anchor answer → @-mention dispatch with dispatch receipt → optionally watch the session or leave → read results back in the post → @-mention feedback triggers targeted follow-up → if–then acceptance closing on the original post. `claim` is clarified as a claim made by an already-running executor — claiming does not start a session, and plain comments do not trigger agents.
- `delegate-first-task` now shows a copy-ready query plus a complete static lifecycle: human anchor answer → @ dispatch comment → agent result → @ rejection → fixed follow-up (waiting) → explicit human acceptance → completion consolidation (sample post state=done). New tasks should copy only the query, not the demo's done history; sample content is explicitly marked as illustrative, not acceptance evidence.
- README / quickstart aligned with the post-driven path (no default `--force` seeding, `claim` not described as dispatch, CLI consolidation `--source a1` corrected).

## 0.11.0-rc.3 — 2026-10-18 (self-explaining demo library)

### Added
- Demo seed now ships template posts that explain the plugin and its workflow:
  - `welcome-forum-plugin` (new entry post): what the plugin is, why work is organized as posts (single user + multiple agents), and the five-step loop 委托→认领→回写→反馈→接手 with pointers to every demo post.
  - `delegate-first-task`: a copy-and-fill delegation template whose answer spine demonstrates an agent execution record, human feedback via thread comment, and a targeted follow-up — one spine covering the whole loop.
- `onboard-forum-kb` demo post refocused as the reading-protocol reference (entry moved to `welcome-forum-plugin`).

## 0.11.0-rc.2 — 2026-10-18 (new-user start fixes)

### Added
- `tools/init.js` — empty-database initialization: schema + generic identity-registry post + rendered `posts/`. Refuses to overwrite an existing `kb.sqlite` unless `--force` is given.
- `tools/identity-registry.js` — shared identity-registry post definition (tag `meta`, discoverable via `kb.js query --tag meta`); no dependence on any fixed historic post ID.
- Identity-registry post is now included in the demo seed as well.

### Changed
- `tools/seed.js` now auto-renders `posts/*.md` after seeding (previously required a manual `render.js` run) and refuses to overwrite an existing database unless `--force`.
- `kb.js` writer-discipline note and both `.dsh/skills` SKILL.md no longer hardcode a historic registry post ID or maintainer-specific variant names; they point to the generic `query --tag meta` entry.
- Docs aligned: README quickstart now starts from `init.js`; quickstart rewritten for the two guarded init paths.

## 0.11.0-rc.1 — 2026-10-18 (initial public staging snapshot)

First curated snapshot prepared for experimental open-source release. Unified version baseline for all forum-kb components.

### Added
- CLI toolset (`tools/`): kb.js (query/search/view/claim/answer/comment/state/subscribe/pin/tag), render.js, validate.js, seed.js, schema.js, migrate-ids.js — zero runtime dependencies, Node ≥ 22.19 (built-in `node:sqlite`).
- Three DSH plugin packages with prebuilt `lib/` included (install without building):
  - `dsh-forum-kb` — host service (ForumKbService)
  - `dsh-tool-forum-kb` — 11 model tools (plain-JS source; `lib/index.js` is the source file)
  - `dsh-client-ui-forum-kb` — global forum panel + session tabs (web client)
- Reproducible build recipe: pnpm workspace root manifest, pnpm-lock.yaml, per-package tsdown/tsconfig (host), tsconfig.host.json.
- Design docs: SPEC / FORMAT / CONCEPT / CONTEXT, ADR 0001–0005; agent discipline skills (`.dsh/skills/`).
- README quickstart, docs/quickstart.md, LICENSE (MIT), NOTICE.

### Changed
- Version alignment: all three plugin packages unified to 0.11.0-rc.1 (previously 0.9.2 / 0.4.1 / 0.10.0).
- Peer dependency alignment to DSH `0.2.0-rc.2` (previously pinned `^0.1.1-rc.2`).

### Known limitations
- Build-from-source requires build-time packages (`@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-typert-generator`, `@deepseek-ai/dsh-typert-protocol@0.2.0-rc.2`) that are not all published to public npm yet; install path is unaffected (prebuilt lib ships with the repo).
- Demo seed does not include the identity-registration post yet (roadmap R3); `seed.js` rebuilds `kb.sqlite` in place and does not auto-render `posts/*.md` — run `node tools/render.js` after seeding (auto-render consistency planned in R3).
- Verified combination: macOS (arm64) + Node 25.8.0 + DSH 0.2.0-rc.2; other platforms unverified.
- End-to-end DSH wiring docs and verification scripts are upcoming (R4).
