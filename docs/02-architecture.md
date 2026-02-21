# architecture

## module layout

```
src/
  index.ts                          CLI entrypoint (serve / create dispatch)
  server/
    create-server.ts                builds McpServer, registers all features
    run-stdio.ts                    StdioServerTransport + shutdown handling
  core/
    module-loader.ts                auto-loader for feature directories
    server-metadata.ts              server name, version, instructions
  cli/
    scaffold.ts                     create tool|resource|prompt generator
  features/
    tools/
      index.ts                      barrel -- calls runRegistrarsFromDirectory
      echo.ts                       echo tool
      sum-numbers.ts                sum_numbers tool
    resources/
      index.ts                      barrel -- calls runRegistrarsFromDirectory
      starter-checklist.ts          static resource (starter://checklist)
      starter-lesson.ts             templated resource (starter://lesson/{topic})
    prompts/
      index.ts                      barrel -- calls runRegistrarsFromDirectory
      scaffold-plan.ts              scaffold-plan prompt
scripts/
  smoke-stdio.mjs                   protocol-level smoke test
  vendor-sdk-v2.mjs                 SDK tarball refresh script
vendor/
  modelcontextprotocol-server-2.0.0-alpha.0.tgz
```

## the feature registrar pattern

every feature is a standalone file that exports a `register(server: McpServer)` function. registration happens automatically at startup through this flow:

1. `create-server.ts` calls `registerTools(server)`, `registerResources(server)`, and `registerPrompts(server)`
2. each of those barrel files (`features/tools/index.ts`, etc.) calls `runRegistrarsFromDirectory`
3. `module-loader.ts` scans the directory for all `.ts`/`.js` files (excluding `index.ts`/`index.js`), imports them in alphabetical order, and calls `register(server)` on each

to add a new feature, drop a file in the right directory with an exported `register` function. the server picks it up automatically -- no manual wiring needed.

### what a registrar looks like

tool example (`echo.ts`):

```typescript
import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const inputSchema = z.object({
  text: z.string().min(1).describe('Text to echo back.'),
});

export function register(server: McpServer): void {
  server.registerTool('echo', {
    title: 'Echo',
    description: 'Return the provided text and its length.',
    inputSchema,
  }, async ({ text }, ctx) => {
    await ctx.mcpReq.log('info', `echo called with ${text.length} characters`);
    return {
      content: [{ type: 'text', text }],
    };
  });
}
```

resource and prompt registrars follow the same `register(server)` convention using `server.registerResource` and `server.registerPrompt`.

## STDIO transport model

```
client (stdin)  -->  [ server process ]  -->  client (stdout)
                          |
                          v
                     stderr (logs)
```

| channel | purpose | rule |
|---------|---------|------|
| stdin   | JSON-RPC requests from client | server reads |
| stdout  | JSON-RPC responses to client | protocol only -- never write anything else here |
| stderr  | logs, diagnostics, errors | all non-protocol output goes here |

`run-stdio.ts` creates a `StdioServerTransport` instance and connects it to the `McpServer`. shutdown is handled by listening for SIGINT and SIGTERM, then calling `server.close()`.

the process runs in isolation -- one server per process, one transport per server. there is no multiplexing, no HTTP, and no SSE in this repo.

## CLI dispatch model

`src/index.ts` parses `process.argv` and dispatches to one of two modes:

| command | what it does |
|---------|-------------|
| `serve` (default) | starts the STDIO MCP server |
| `create <kind> <name> [options]` | generates a new feature file from a template |

`serve` calls `runStdioServer()` which blocks until the process is terminated. `create` calls `createArtifact()` and exits after writing the file.

## design rationale

- **file-based auto-loading** over manual registration lists: adding a feature is one file, not two edits
- **separate transport wiring** from server creation: `create-server.ts` builds the capability graph, `run-stdio.ts` handles the transport -- this makes testing or swapping transports straightforward
- **vendored SDK** over npm dependency: v2 is pre-release, so pinning a local tarball avoids breakage from upstream changes
- **strict stderr discipline**: the most common STDIO server bug is accidental stdout pollution -- this repo enforces the separation at every level

## next steps

- [03-scaffold-cli.md](03-scaffold-cli.md) for the full CLI reference
- [04-sdk-v2-notes.md](04-sdk-v2-notes.md) for SDK versioning details
