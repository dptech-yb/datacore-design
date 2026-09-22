# DataCore Design agent guide

## Scope

This repository is a public, sanitized design-system reference for the DataCore main platform. It is not the DataCore production application and must not contain credentials, private URLs, user data, experiment data, or unredacted internal API payloads.

## Before changing a component

1. Identify the user task and the complete state set: default, loading, empty, error, disabled, and permission-limited where applicable.
2. Prefer semantic HTML and stable names/IDs over visual inference.
3. Keep examples synthetic and update both `public/component-registry.json` and `public/llms-full.txt` when the contract changes.
4. Run `npm run typecheck` and `npm run build` before committing.

## AI-readable contract

- `public/llms.txt` is the short navigation file for coding agents.
- `public/llms-full.txt` is the human/agent-readable design contract.
- `public/component-registry.json` is the machine-readable component index.

## GitHub Pages

The site uses hash navigation and a relative Vite base path. Keep it deployable under a project Pages URL; do not introduce server-only routing without a static fallback.
