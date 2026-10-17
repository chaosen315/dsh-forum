# Changelog

All notable changes to forum-kb are documented here. Format based on Keep a Changelog.

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
