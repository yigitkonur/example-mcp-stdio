# validation

## pipeline breakdown

```bash
npm run pipeline
```

this runs the following steps in sequence:

| step | command | what it checks |
|------|---------|----------------|
| clean | `rimraf dist .tsbuildinfo` | removes stale build artifacts |
| typecheck | `tsc --noEmit` | TypeScript type safety (strict mode) |
| lint | `eslint . --max-warnings=0` | code quality, no-floating-promises, consistent imports |
| format | `prettier --check .` | formatting consistency |
| build | `tsc -p tsconfig.json` | compiles to `dist/` |
| smoke | `node scripts/smoke-stdio.mjs` | protocol-level STDIO verification |

if any step fails, the pipeline stops. fix the issue and re-run.

## smoke test details

`npm run smoke:stdio` runs `scripts/smoke-stdio.mjs`, which:

1. spawns `node dist/index.js serve` as a child process with piped stdin/stdout/stderr
2. sends an `initialize` request with `LATEST_PROTOCOL_VERSION`
3. sends a `notifications/initialized` notification
4. calls `tools/list` and verifies `echo` and `sum_numbers` are present
5. calls `resources/list` and verifies `starter://checklist` is present
6. calls `prompts/list` and verifies `scaffold-plan` is present
7. sends SIGINT to shut down the server

the test communicates over raw JSON-RPC on stdin/stdout, exactly as a real MCP client would. stderr output from the server is expected and ignored.

## mcp-cli verification

for interactive verification beyond the smoke test, use `mcp-cli`.

create a `mcp_servers.json` file:

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

### server info and inventory

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter
```

### tool schema inspection

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter echo
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter sum_numbers
```

### tool calls (happy path)

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{"text":"hello"}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{"numbers":[1,2,3]}'
```

### tool calls (invalid input)

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{}'
```

these should return Zod validation errors.

## primitive-level checks

for resources and prompts, use protocol-level methods (via inspector or custom client):

| method | what to verify |
|--------|---------------|
| `resources/list` | returns `starter-checklist` and `starter-lesson` entries |
| `resources/templates/list` | returns `starter://lesson/{topic}` template |
| `resources/read` with `starter://checklist` | returns checklist JSON |
| `resources/read` with `starter://lesson/tools` | returns lesson JSON for the tools topic |
| `prompts/list` | returns `scaffold-plan` |
| `prompts/get` with `feature` arg | returns implementation plan messages |
| `completion/complete` on `scaffold-plan` style arg | returns `minimal`, `production`, `experimental` |

the MCP Inspector is also available:

```bash
npm run inspector
```

## release checklist

before merging or publishing:

1. run `npm run vendor:sdk:update` if the SDK snapshot should be refreshed
2. run `npm install` to sync the lockfile
3. run `npm run pipeline` -- all steps must pass
4. verify that `README.md`, `docs/`, and `CHANGELOG.md` reflect current behavior
5. confirm CI passes on the PR
