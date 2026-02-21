# getting started

## prerequisites

- Node.js >= 20 (repo uses 22 via `.nvmrc`)
- npm (ships with Node.js)
- git

## install

```bash
git clone https://github.com/yigitkonur/example-mcp-stdio.git
cd example-mcp-stdio
npm ci
```

## run the server

### development mode

```bash
npm run dev
```

uses `tsx` to run `src/index.ts serve` directly without a build step.

### production mode

```bash
npm run build
npm start
```

compiles TypeScript to `dist/`, then runs `node dist/index.js serve`.

## how STDIO transport works

```
client (stdin)  -->  [ server process ]  -->  client (stdout)
                          |
                          v
                     stderr (logs)
```

- **stdin**: the client writes JSON-RPC requests to the server's stdin
- **stdout**: the server writes JSON-RPC responses to stdout -- this channel is reserved exclusively for protocol messages
- **stderr**: all server logs, debug output, and diagnostics go to stderr

this separation is critical. any non-JSON-RPC output on stdout will break the protocol. use `ctx.mcpReq.log(...)` inside handlers, which routes to stderr via the SDK.

## Docker

build and run with Docker:

```bash
docker build -t mcp/example-mcp-stdio:latest .
```

or use docker-compose:

```bash
docker compose up --build
```

the container runs `node dist/index.js serve` as a non-root user. `stdin_open` and `tty` are set in `docker-compose.yml` to keep the STDIO channel open.

## quick verify

run the full validation pipeline to confirm everything works:

```bash
npm run pipeline
```

this runs clean, typecheck, lint, format check, build, and smoke test in sequence. if it passes, the server is ready.

## connecting to Claude Desktop or Cursor

add an entry to your MCP client config. for Claude Desktop, edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "example-mcp-stdio": {
      "command": "node",
      "args": ["/absolute/path/to/example-mcp-stdio/dist/index.js", "serve"]
    }
  }
}
```

for Cursor, add the same structure to your MCP server settings.

## next steps

- [02-architecture.md](02-architecture.md) to understand how the server is structured
- [03-scaffold-cli.md](03-scaffold-cli.md) to generate your first tool, resource, or prompt
