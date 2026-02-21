# example-mcp-stdio

production-ready, learning-focused starter for MCP servers over STDIO using TypeScript SDK v2.

> part of a series: **stdio** (you are here) · [stateless](https://github.com/yigitkonur/example-mcp-stateless) · [stateful](https://github.com/yigitkonur/example-mcp-stateful) · [sse](https://github.com/yigitkonur/example-mcp-sse)

## what it does

- runs an MCP server that communicates exclusively over STDIO (stdin/stdout JSON-RPC, stderr for logs)
- ships two tools (`echo`, `sum_numbers`), two resources (`starter-checklist`, `starter-lesson`), and one prompt (`scaffold-plan`)
- loads features automatically from `src/features/` using a file-based registrar pattern
- includes a scaffold CLI to generate new tools, resources, and prompts from templates
- enforces quality with a full pipeline: typecheck, lint, format, build, smoke test

## quick start

```bash
git clone https://github.com/yigitkonur/example-mcp-stdio.git
cd example-mcp-stdio
npm ci
```

run in development mode:

```bash
npm run dev
```

or build and run:

```bash
npm run build && npm start
```

validate everything:

```bash
npm run pipeline
```

## scaffold cli

generate new feature modules with a single command:

```bash
node dist/index.js create tool my-tool
node dist/index.js create resource my-resource --uri my://resource
node dist/index.js create prompt my-prompt
```

generated files land in `src/features/<kind>/` and are picked up automatically on next server start.

full reference: [docs/03-scaffold-cli.md](docs/03-scaffold-cli.md)

## documentation

| doc | what it covers |
|-----|----------------|
| [docs/README.md](docs/README.md) | reading order and audience guide |
| [docs/01-getting-started.md](docs/01-getting-started.md) | prerequisites, install, first run, Docker |
| [docs/02-architecture.md](docs/02-architecture.md) | module layout, registrar pattern, STDIO transport model |
| [docs/03-scaffold-cli.md](docs/03-scaffold-cli.md) | serve and create commands, options, naming conventions |
| [docs/04-sdk-v2-notes.md](docs/04-sdk-v2-notes.md) | vendoring strategy, v2 patterns, migration notes |
| [docs/05-validation.md](docs/05-validation.md) | pipeline breakdown, smoke test, mcp-cli verification |

## sdk v2 context

this repo targets the TypeScript SDK v2 pre-release (`@modelcontextprotocol/server`). because v2 is not yet published to npm, the package is vendored as a tarball in `vendor/`. refresh it with `npm run vendor:sdk:update`. see [docs/04-sdk-v2-notes.md](docs/04-sdk-v2-notes.md) for details.

## license

MIT
