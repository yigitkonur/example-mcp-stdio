# MCP STDIO v2 Learning Starter

## Changelog (Latest First)

### 2026-02-21: Major Rewrite For Upcoming TypeScript SDK v2

- Full migration from v1-style implementation to MCP SDK v2 primitives.
- New stdio-first starter architecture (tools/resources/prompts split by feature modules).
- New built-in scaffold creator CLI (`serve`, `create tool`, `create resource`, `create prompt`).
- New end-to-end stdio JSON-RPC smoke test.
- New vendored SDK update workflow for reproducible pre-release installs.

Full details: `CHANGELOG.md`

## What This Project Is

This repository is a **learning-first boilerplate** for building MCP servers with:

- **TypeScript SDK v2 primitives**
- **STDIO transport only**
- **modular feature structure** that scales
- **scaffold CLI** to generate starter modules quickly

## MCP SDK v2 Status (Important)

As of **February 21, 2026**, the official TypeScript SDK `main` branch is v2 pre-release (pre-alpha).

Official references:

- SDK repository: <https://github.com/modelcontextprotocol/typescript-sdk>
- Server guide: <https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md>
- FAQ (v2 notes, SSE removal): <https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/faq.md>

Practical implications:

- v2 APIs may still evolve before stable release.
- Server-side SSE transport is not part of v2 server package direction.
- Node 20+, ESM, and Zod v4 are required for this starter.

## Dependency Strategy Used Here

Because v2 publishing/distribution is still in-progress, this project uses a vendored package tarball for reproducibility:

- `vendor/modelcontextprotocol-server-2.0.0-alpha.0.tgz`

Refresh vendor snapshot:

```bash
npm run vendor:sdk:update
```

## Quick Start

```bash
git clone https://github.com/yigitkonur/example-mcp-stdio.git
cd example-mcp-stdio
npm ci
npm run pipeline
```

Run server:

```bash
npm run dev
# or
npm run build && npm start
```

## Scaffold Creator CLI

Main entrypoint: `src/index.ts`

### Commands

```bash
# Start stdio MCP server
node dist/index.js serve

# Create a new tool module
node dist/index.js create tool my-tool

# Create a new resource module (with URI)
node dist/index.js create resource my-resource --uri my://resource

# Create a new prompt module
node dist/index.js create prompt my-prompt
```

### Verified behavior

The scaffold creator was re-tested during this doc rewrite on **2026-02-21** with all three artifact types:

- `create tool docs-tool`
- `create resource docs-resource --uri docs://resource`
- `create prompt docs-prompt`

Resulting structure produced exactly as expected:

```text
src/features/tools/<name>.ts
src/features/resources/<name>.ts
src/features/prompts/<name>.ts
```

## Project Structure

```text
src/
  index.ts
  core/
    module-loader.ts
    server-metadata.ts
  server/
    create-server.ts
    run-stdio.ts
  features/
    tools/
      index.ts
      echo.ts
      sum-numbers.ts
    resources/
      index.ts
      starter-checklist.ts
      starter-lesson.ts
    prompts/
      index.ts
      scaffold-plan.ts
scripts/
  smoke-stdio.mjs
  vendor-sdk-v2.mjs
docs/
  01-overview-and-v2.md
  02-scaffold-cli.md
  03-validation-and-workflow.md
```

## Validation Commands

```bash
npm run typecheck
npm run lint:ci
npm run format:check
npm run build
npm run smoke:stdio
npm run pipeline
```

`smoke:stdio` performs a real protocol handshake (`initialize`, `notifications/initialized`, list calls).

## mcp-cli Verification

Example `mcp_servers.json` (project root):

```json
{
  "mcpServers": {
    "starter": {
      "command": "node",
      "args": ["./dist/index.js"]
    }
  }
}
```

Run verification:

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter echo
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{"text":"hello"}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{"numbers":[1,2,3]}'
```

After modifying code, always use `MCP_NO_DAEMON=1` to avoid stale daemon cache.

## Documentation Index

- `docs/01-overview-and-v2.md`
- `docs/02-scaffold-cli.md`
- `docs/03-validation-and-workflow.md`
- `CHANGELOG.md`

## License

MIT
