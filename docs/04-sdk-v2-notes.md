# sdk v2 notes

## v2 packages used

this repo depends on a single SDK package:

| package | source | purpose |
|---------|--------|---------|
| `@modelcontextprotocol/server` | vendored tarball (`vendor/modelcontextprotocol-server-2.0.0-alpha.0.tgz`) | McpServer, StdioServerTransport, ResourceTemplate, ProtocolError, completable |

there is no separate `@modelcontextprotocol/sdk` import. the server package includes everything needed for STDIO transport.

## v2 registration APIs

the SDK v2 replaces the v1 chaining API with explicit registration methods:

| v1 pattern (removed) | v2 pattern (used here) |
|-----------------------|------------------------|
| `server.tool(name, schema, handler)` | `server.registerTool(name, metadata, handler)` |
| `server.resource(name, uri, handler)` | `server.registerResource(name, uri, metadata, handler)` |
| `server.prompt(name, schema, handler)` | `server.registerPrompt(name, metadata, handler)` |

other v2 patterns used in this repo:

- `ctx.mcpReq.log(level, message)` for structured logging inside handlers
- `ProtocolError` + `ProtocolErrorCode` for protocol-level error responses
- `completable(schema, completer)` for argument autocompletion in prompts
- `ResourceTemplate` for parameterized resource URIs
- `outputSchema` on tools for structured content validation
- `annotations` on tools (`readOnlyHint`, `idempotentHint`)

## vendoring strategy

the TypeScript SDK v2 is pre-release and not yet published to npm as a stable version. to avoid breakage from upstream changes, this repo vendors a packed tarball.

the dependency in `package.json`:

```json
"@modelcontextprotocol/server": "file:vendor/modelcontextprotocol-server-2.0.0-alpha.0.tgz"
```

### refreshing the vendored SDK

```bash
npm run vendor:sdk:update
```

this script (`scripts/vendor-sdk-v2.mjs`):

1. clones the official TypeScript SDK repository (shallow, depth 1)
2. runs `pnpm install` + `pnpm pack` on the `@modelcontextprotocol/server` package
3. copies the resulting `.tgz` into `vendor/`

after refreshing, run `npm install` to update `node_modules`, then `npm run pipeline` to verify nothing broke.

## migration checklist

when the SDK v2 reaches stable release on npm:

1. remove the `vendor/` directory
2. update `package.json` to reference the npm version: `"@modelcontextprotocol/server": "^2.0.0"`
3. run `npm install`
4. run `npm run pipeline` to verify
5. remove `scripts/vendor-sdk-v2.mjs` if vendoring is no longer needed
6. update this doc

## official references

- SDK repository: https://github.com/modelcontextprotocol/typescript-sdk
- server guide: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md
- FAQ (v2 notes): https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/faq.md
- MCP specification: https://spec.modelcontextprotocol.io
