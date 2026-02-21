# Overview and MCP SDK v2

## Purpose

This starter provides a practical baseline for building MCP servers that are:

- easy to understand
- easy to extend
- strict about protocol-safe stdio behavior

## Architecture Summary

The server is assembled from feature registrars:

- `src/features/tools/*`
- `src/features/resources/*`
- `src/features/prompts/*`

`src/server/create-server.ts` builds a single `McpServer` instance and loads these registrars via `src/core/module-loader.ts`.

## Why This Structure

- Adding features is file-based and predictable.
- Shared concerns (metadata, loader, transport bootstrap) stay isolated.
- Generated artifacts from the scaffold CLI fit the same structure.

## MCP SDK v2 Patterns Used

- `registerTool(...)`
- `registerResource(...)`
- `registerPrompt(...)`
- handler context via `ctx` (`ctx.mcpReq.log(...)`)
- protocol errors via `ProtocolError` + `ProtocolErrorCode`

## v2 Pre-release Constraints

As of **February 21, 2026**, TypeScript SDK v2 is still pre-release.

Implications:

- API behavior can change before stable release.
- You should pin SDK source explicitly.
- Migration notes and verification should remain part of normal workflow.

This repo uses a vendored tarball (`vendor/modelcontextprotocol-server-2.0.0-alpha.0.tgz`) and includes a refresh script (`npm run vendor:sdk:update`).

## Transport Scope

This starter is **stdio-only** by design:

- `stdout` is reserved for MCP JSON-RPC messages.
- logs/errors go to `stderr`.
- HTTP/SSE server transport wiring is intentionally not part of this codebase.
