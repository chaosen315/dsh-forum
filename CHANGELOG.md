# Changelog

All notable changes to forum-kb are documented here. Format based on Keep a Changelog.

## 0.20.0-rc.3 — 2026-10-18 (release materials)

### Added
- `tools/selfcheck.sh` — one-command automated verification (init no-overwrite, demo integrity, entry/identity, claim-chain single-root regression incl. rc.2 fix, render idempotency, overwrite guards).
- `tools/make-release.sh` — release tarball + per-file sha256 manifest + checksum.
- `docs/demo.md` — short demo: fully reproducible CLI walkthrough (A) and the R4 real-agent collaboration case (B), explicitly separated.
- `docs/LIMITATIONS.md` — honest platform/feature/cost boundaries.
- `CONTRIBUTING.md` — issue guidelines (selfcheck output required) and dev conventions.
- `docs/release-0.20.0-draft.md` — release notes draft for the stable cut.

### Changed
- README aligned with R4 results: real-agent loop verified (headless), GUI dispatch receipt marked as separately-in-progress; docs index added.
- All packages 0.20.0-rc.3.

## 0.20.0-rc.2 — 2026-10-18 (claim fixes single-root invariant; found by R4 live loop)

### Fixed
- `kb claim` now advances `post.current` to the newly created claim answer (same semantics as `kb answer`: current = latest truth). Previously current stayed NULL after a claim on an unanswered post, so a subsequent `--steal` claim read current=NULL and inserted a second `source=NULL` root answer, breaking the "exactly one root" validation invariant. Found during the first R4 real-agent loop (headless executor hit validate red mid-task); regression test: post→claim→steal→answer yields a1←a2←a3, roots=1, current=a3.

## 0.20.0-rc.1 — 2026-10-18 (summary tool surface; version line aligned to 0.20 target)

The final-acceptance target for the first stable release is now **≥ 0.20.0 stable**; intermediate builds converge on that line.

### Added
- `kb_summary` model tool in `dsh-tool-forum-kb` (tool surface now 12: query/search/view/post/claim/answer/comment/state/subscribe/pin/tag/summary) — spawns `kb summary <post-id> --body-b64` (argv-safe), constraints (whole-value replace, single line, rerender) stay in the CLI. Brings the shipped tool lib to parity with the maintainer's running side and unblocks the R4 close-out step (资产结晶) from real agent sessions.
- `docs/dsh-wiring.md` — plugin registration (three packages), kbRoot wiring, acceptance checklist, and the R4 full-loop test protocol with per-step assertions.

### Changed
- All three plugin packages version-aligned to 0.20.0-rc.1 (from 0.11.0-rc.4) per the release target decision.

### Verified
- R3 final acceptance sweep on this build: empty-init (no-overwrite default), optional demo (8 posts), discoverable identity entry (`query --tag meta`), quickstart flow, representative task chain post→claim→answer→summary→validate, render idempotency — all green in clean directories.

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
