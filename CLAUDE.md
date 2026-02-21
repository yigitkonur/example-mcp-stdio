# CLAUDE.md

Guidance for agents editing this repository.

## Project Snapshot

- Project type: MCP TypeScript SDK v2 (pre-release) **stdio-only** starter.
- Main entrypoint: `src/index.ts`.
- Runtime modes:
  - `serve` starts MCP server on stdio.
  - `create <tool|resource|prompt> <name>` scaffolds starter modules.

## Critical Constraints

- Keep transport strictly stdio; do not add HTTP/SSE server code here.
- `stdout` must remain protocol-only JSON-RPC (no debug prints).
- SDK usage must stay on v2 patterns (`registerTool`, `registerResource`, `registerPrompt`, `ProtocolError`, `ctx.mcpReq.*`).
- Zod v4 schemas only.

## Commands

- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build`
- Full validation: `npm run pipeline`
- Smoke test (JSON-RPC handshake): `npm run smoke:stdio`
- Refresh vendored SDK tarball: `npm run vendor:sdk:update`

## Code Layout

- `src/index.ts`: CLI command parsing and dispatch.
- `src/server/create-server.ts`: creates `McpServer` and registers capabilities.
- `src/server/run-stdio.ts`: `StdioServerTransport` connection + shutdown handling.
- `src/core/module-loader.ts`: dynamic `register()` loading for feature directories.
- `src/features/tools/*`: tool registrars.
- `src/features/resources/*`: resource registrars.
- `src/features/prompts/*`: prompt registrars.
- `scripts/smoke-stdio.mjs`: end-to-end stdio protocol smoke test.

## Editing Expectations

- Prefer minimal, readable modules.
- Avoid introducing extra abstraction layers unless they remove real duplication.
- Remove dead code and stale docs when touched.
- If behavior changes, update `README.md` and `CHANGELOG.md` in the same PR.
