# Changelog

## Unreleased

### Documentation Rebuild For v2 Starter

- Reorganized all docs for professional structure and cross-link navigation.
- Added `docs/README.md` as the documentation entrypoint.
- Rewrote `README.md` with table of contents and clearer sections for scope, SDK context, CLI usage, and validation.
- Standardized `docs/01`, `docs/02`, and `docs/03` formatting and content boundaries.

## 2.0.0 - 2026-02-21

### Major Rewrite For Upcoming TypeScript SDK v2

- Replaced legacy v1 calculator implementation with a clean stdio-first MCP v2 starter architecture.
- Migrated SDK usage to v2 primitives (`@modelcontextprotocol/server`, `registerTool`, `registerResource`, `registerPrompt`, `ProtocolError`).
- Added built-in starter CLI:
  - `serve`
  - `create tool <name>`
  - `create resource <name>`
  - `create prompt <name>`
- Added modular auto-loader for feature registrars under `src/features/*`.
- Rewrote documentation into a learning-first v2 guide and documented pre-release limitations.
- Added real JSON-RPC stdio smoke test (`scripts/smoke-stdio.mjs`) for initialization + listing primitives.
- Updated CI to run full pipeline including smoke validation.
- Added vendored SDK update workflow (`scripts/vendor-sdk-v2.mjs`) for reproducible pre-release installs.
- Removed outdated v1 server files and stale project guidance.
