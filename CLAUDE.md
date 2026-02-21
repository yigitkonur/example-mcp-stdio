# CLAUDE.md

## project

MCP TypeScript SDK v2 stdio-only starter with built-in scaffold CLI for tools, resources, and prompts.

## what's inside

- `src/index.ts` -- CLI entrypoint; dispatches `serve` (default) and `create` commands
- `src/server/create-server.ts` -- builds `McpServer`, registers all feature modules
- `src/server/run-stdio.ts` -- connects `StdioServerTransport`, handles SIGINT/SIGTERM shutdown
- `src/core/module-loader.ts` -- scans a feature directory, imports each file, calls `register(server)`
- `src/core/server-metadata.ts` -- server name, version, description, instructions
- `src/features/tools/echo.ts` -- `echo` tool (text in, echoed text + length out)
- `src/features/tools/sum-numbers.ts` -- `sum_numbers` tool (number array in, sum + count out)
- `src/features/resources/starter-checklist.ts` -- static resource at `starter://checklist`
- `src/features/resources/starter-lesson.ts` -- templated resource at `starter://lesson/{topic}`
- `src/features/prompts/scaffold-plan.ts` -- prompt with `feature` and optional `style` args
- `src/features/*/index.ts` -- barrel files that call `runRegistrarsFromDirectory`
- `src/cli/scaffold.ts` -- generates tool/resource/prompt files from templates
- `scripts/smoke-stdio.mjs` -- protocol-level smoke test (initialize, list primitives, verify names)
- `scripts/vendor-sdk-v2.mjs` -- clones SDK repo, packs server tarball into `vendor/`
- `Dockerfile` -- multi-stage build, node:22-slim
- `docker-compose.yml` -- stdio container with stdin_open + tty
- `.github/workflows/ci.yml` -- runs `npm run pipeline` on push/PR

## transport

stdio only. stdout = JSON-RPC. stderr = logs. no HTTP/SSE.

## sdk rules

- use `@modelcontextprotocol/server` from vendored tarball only
- use v2 registration APIs: `registerTool`, `registerResource`, `registerPrompt`
- use `ProtocolError` + `ProtocolErrorCode` for protocol errors
- use `ctx.mcpReq.log(...)` for logging inside handlers
- Zod v4 (`zod/v4`) for all schemas
- do not add v1-style `server.tool()` / `server.resource()` calls
- do not write to stdout directly; it is reserved for JSON-RPC

## commands

- `npm ci` -- install dependencies
- `npm run dev` -- run server in dev mode (tsx)
- `npm run dev:cli` -- run CLI entrypoint in dev mode
- `npm run build` -- clean + compile TypeScript
- `npm start` -- run built server
- `npm run typecheck` -- type-check without emitting
- `npm run lint` -- lint with auto-fix
- `npm run lint:ci` -- lint with zero warnings allowed
- `npm run format` -- format with Prettier
- `npm run format:check` -- check formatting
- `npm run pipeline` -- clean + check + build + smoke test
- `npm run smoke:stdio` -- protocol-level smoke test
- `npm run vendor:sdk:update` -- refresh vendored SDK tarball
- `npm run inspector` -- open MCP Inspector against built server
