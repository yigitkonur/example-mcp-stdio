# example-mcp-stdio

A production-ready, learning-focused starter for building **MCP servers over STDIO** with the **TypeScript SDK v2 primitives**.

## Changelog Snapshot

### 2026-02-21: Major Rewrite For Upcoming TypeScript SDK v2

- Migrated from v1-style implementation to v2 primitives.
- Rebuilt architecture as modular feature registrars (`tools`, `resources`, `prompts`).
- Added built-in scaffold CLI (`serve`, `create tool|resource|prompt`).
- Added protocol-level stdio smoke test and vendor refresh workflow.

Full history: [CHANGELOG.md](CHANGELOG.md)

## Table of Contents

- [Project Scope](#project-scope)
- [SDK v2 Context](#sdk-v2-context)
- [Quick Start](#quick-start)
- [Scaffold Creator CLI](#scaffold-creator-cli)
- [Validation and Testing](#validation-and-testing)
- [Documentation](#documentation)
- [Repository Layout](#repository-layout)
- [License](#license)

## Project Scope

This project is intentionally focused on:

- **STDIO transport only**
- **MCP v2-style server APIs** (`registerTool`, `registerResource`, `registerPrompt`)
- **clear extensibility** via generated feature modules
- **reproducible testing** with both smoke tests and `mcp-cli`

## SDK v2 Context

As of **February 21, 2026**, the official TypeScript SDK `main` branch is v2 pre-release (pre-alpha).

Official references:

- SDK repository: <https://github.com/modelcontextprotocol/typescript-sdk>
- Server guide: <https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md>
- FAQ (v2 notes and transport guidance): <https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/faq.md>

### Dependency Strategy in This Repo

Because v2 distribution is still evolving, this repository vendors a server package snapshot:

- `vendor/modelcontextprotocol-server-2.0.0-alpha.0.tgz`

Refresh it with:

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

Run the server:

```bash
npm run dev
# or
npm run build && npm start
```

## Scaffold Creator CLI

Entrypoint: `src/index.ts`

### Command Summary

```bash
# Start server
node dist/index.js serve

# Generate modules
node dist/index.js create tool my-tool
node dist/index.js create resource my-resource --uri my://resource
node dist/index.js create prompt my-prompt
```

### Generated Paths

- Tool -> `src/features/tools/<name>.ts`
- Resource -> `src/features/resources/<name>.ts`
- Prompt -> `src/features/prompts/<name>.ts`

Full command/options reference: [docs/02-scaffold-cli.md](docs/02-scaffold-cli.md)

## Validation and Testing

### Built-in Validation

```bash
npm run typecheck
npm run lint:ci
npm run format:check
npm run build
npm run smoke:stdio
npm run pipeline
```

`smoke:stdio` verifies protocol initialization and primitive listing (`tools`, `resources`, `prompts`).

### mcp-cli Example

Create a local `mcp_servers.json`:

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

Run checks:

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter echo
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{"text":"hello"}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{"numbers":[1,2,3]}'
```

Detailed test workflow: [docs/03-validation-and-workflow.md](docs/03-validation-and-workflow.md)

## Documentation

Start here: [docs/README.md](docs/README.md)

- Architecture and v2 rationale: [docs/01-overview-and-v2.md](docs/01-overview-and-v2.md)
- Scaffold CLI reference: [docs/02-scaffold-cli.md](docs/02-scaffold-cli.md)
- Validation and release workflow: [docs/03-validation-and-workflow.md](docs/03-validation-and-workflow.md)

## Repository Layout

```text
src/
  index.ts
  cli/
  core/
  server/
  features/
scripts/
  smoke-stdio.mjs
  vendor-sdk-v2.mjs
docs/
  README.md
  01-overview-and-v2.md
  02-scaffold-cli.md
  03-validation-and-workflow.md
```

## License

MIT
