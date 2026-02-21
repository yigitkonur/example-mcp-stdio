# Validation and Workflow

## Local Quality Gate

Use the full pipeline before opening a PR or pushing release-related changes:

```bash
npm run pipeline
```

Pipeline includes:

- clean build artifacts
- type checking
- lint checks
- format checks
- build
- stdio smoke test

## mcp-cli Verification Flow

After build, verify live behavior using `mcp-cli`.

1. Connection + inventory

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter
```

2. Inspect tool schemas

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter echo
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json info starter sum_numbers
```

3. Happy-path calls

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{"text":"hello"}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{"numbers":[1,2,3]}'
```

4. Invalid-input behavior

```bash
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter echo '{}'
MCP_NO_DAEMON=1 mcp-cli -c mcp_servers.json call starter sum_numbers '{}'
```

## Non-Tool Primitive Verification

For prompts/resources/completions, use protocol-level calls (or inspector/client integration tests) to validate:

- `resources/list`
- `resources/templates/list`
- `resources/read`
- `prompts/list`
- `prompts/get`
- `completion/complete`

## Release Checklist

1. Run `npm run vendor:sdk:update` if SDK snapshot should be refreshed.
2. Run `npm install` to sync lockfile.
3. Run `npm run pipeline`.
4. Verify docs (`README.md`, `docs/`, `CHANGELOG.md`) reflect the current behavior.
