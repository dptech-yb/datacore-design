# DataCore Design agent guide

## Scope

This repository is a public, sanitized design-system reference for the DataCore main platform. It is not the DataCore production application and must not contain credentials, private URLs, user data, experiment data, or unredacted internal API payloads.

## Architecture: single source of truth

`src/catalog/` is the single source of truth. Site navigation, component detail pages, the search index, and all three AI contract files are derived from it.

- `src/catalog/types.ts` — data model (`ComponentDoc`, `ArticleDoc`, `REQUIRED_STATES`).
- `src/catalog/components/*.ts` — component docs by category batch. Data files must stay runtime-import free (`import type` only) so the generator can bundle them for Node.
- `src/catalog/foundations.ts` / `patterns.ts` / `templates.ts` — article-style docs.
- `src/catalog/index.ts` — aggregation, nav model, search index.
- `src/previews/*.tsx` — live example previews keyed `<doc-id>/<example-id>`, merged in `src/previews/index.ts`.

## AI-readable contract (generated — never hand-edit)

- `public/llms.txt` is the short navigation file for coding agents.
- `public/llms-full.txt` is the human/agent-readable design contract.
- `public/component-registry.json` is the machine-readable component index.

All three are produced by `npm run generate` (`scripts/generate-ai-files.mjs`), which also validates catalog completeness (unique ids, full state coverage, basic + business examples, resolvable `related` ids). `npm run build` runs the generator first, so the contract can never drift from the pages.

## Before changing a component

1. Identify the user task and the complete state set: default, loading, empty, error, disabled, and permission-limited where applicable. Every `ComponentDoc.states` must answer all `REQUIRED_STATES`, marking non-applicable ones with `applicable: false` and a reason.
2. Prefer semantic HTML and stable names/IDs over visual inference.
3. Keep examples synthetic. Match the completeness of the `button` entry in `src/catalog/components/general.ts`.
4. Add or update previews in `src/previews/` for every example.
5. Run `npm run typecheck` and `npm run build` before committing.

## GitHub Pages

The site uses hash navigation (`#/components/button`) and a relative Vite base path. Keep it deployable under a project Pages URL; do not introduce server-only routing without a static fallback.
