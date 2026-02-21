reference MCP server over STDIO transport. uses a calculator theme to demonstrate every major SDK feature — tools, resources, prompts, streaming progress, input elicitation, autocompletion — in a single well-commented codebase. designed to be spawned as a child process by any MCP host (Claude Desktop, Cursor, VS Code, etc.).

```bash
npx -y calculator-stdio-server
```

[![node](https://img.shields.io/badge/node-20+-93450a.svg?style=flat-square)](https://nodejs.org/)
[![MCP SDK](https://img.shields.io/badge/MCP_SDK-1.0+-93450a.svg?style=flat-square)](https://modelcontextprotocol.io/)
[![license](https://img.shields.io/badge/license-MIT-grey.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> also available as: [stateful HTTP](https://github.com/yigitkonur/example-mcp-server-streamable-http) | [stateless HTTP](https://github.com/yigitkonur/example-mcp-server-streamable-http-stateless) | [SSE](https://github.com/yigitkonur/example-mcp-server-sse)

---

## what it covers

this isn't meant to be a useful calculator. it's a reference for building MCP servers. every pattern the SDK supports is implemented here with inline comments explaining why.

- **8 tools** — basic arithmetic, batch operations, factorials/logs/combinations, progress streaming, interactive elicitation, formula lookup, assistant stubs, maintenance mode simulation
- **4 resources** — static JSON (`calculator://constants`, `formulas://library`), dynamic URI templates with autocompletion (`calculator://history/{id}`), live stats (`calculator://stats`)
- **3 prompts** — all with `completable()` argument autocompletion: explain a calculation, generate practice problems, tutoring session
- **streaming progress** — `notifications/progress` at configurable intervals
- **input elicitation** — `server.elicitInput()` for interactive follow-up when a problem is ambiguous (e.g. "area of rectangle" with no dimensions)
- **structured output** — tools return both `content` (text) and `structuredContent` (typed Zod schemas)
- **error handling** — all errors are `McpError` instances with proper JSON-RPC error codes, no raw exceptions leak to transport

## install

```bash
# from npm
npx -y calculator-stdio-server

# from source
git clone https://github.com/yigitkonur/example-mcp-server-stdio.git
cd example-mcp-server-stdio
npm ci && npm run build
node dist/server.js
```

### docker

```bash
docker compose up
```

builds a two-stage image: compiles TypeScript in the builder stage, copies only `dist/` and production deps to the runner. runs as non-root `node` user. `stdin_open` and `tty` are set in compose for STDIO transport.

### dev

```bash
npm run dev          # runs TypeScript directly via tsx, no build step
npm run inspector    # launches MCP Inspector UI connected to source
```

## how STDIO transport works

the server reads JSON-RPC 2.0 messages from `stdin` and writes responses to `stdout`. all logging goes to `stderr` — writing anything else to `stdout` would corrupt the protocol. the parent process (your MCP host) spawns this as a child process and communicates over the pipe.

```
MCP host (Claude Desktop, Cursor, etc.)
    │
    ├── stdin  → JSON-RPC requests  → server
    └── stdout ← JSON-RPC responses ← server
                 stderr → logs (never touches stdout)
```

state is entirely in-process memory. history capped at 50 entries (circular buffer). everything resets when the process exits — intentional for STDIO's process-isolation model.

## tools

| tool | what it demonstrates |
|:---|:---|
| `calculate` | basic arithmetic with optional streaming progress notifications |
| `batch_calculate` | array input (up to 100), per-item error isolation, discriminated union output |
| `advanced_calculate` | factorial, log (natural + base-n), C(n,k), P(n,k) with conditional required params |
| `demo_progress` | 5 progress notifications at 500ms intervals, no input params |
| `solve_math_problem` | detects ambiguous problems, uses `elicitInput()` to request missing dimensions |
| `explain_formula` | simple informational tool pattern |
| `calculator_assistant` | context-aware help with optional context interpolation |
| `maintenance_mode` | simulated tool lifecycle management (enable/disable pattern) |

## resources

| URI | type | notes |
|:---|:---|:---|
| `calculator://constants` | static | six math constants (pi, e, phi, sqrt2, ln2, ln10) as JSON |
| `calculator://history/{calculationId}` | dynamic | URI template with list handler, ID autocompletion, per-entry lookup |
| `calculator://stats` | dynamic | live uptime and request count |
| `formulas://library` | static | five formulas (quadratic, pythagorean, circle area, compound interest, distance) |

## prompts

| prompt | arguments | autocompletion |
|:---|:---|:---|
| `explain-calculation` | `expression`, `level?` | level: elementary/intermediate/advanced |
| `generate-problems` | `difficulty?`, `count?`, `operations?` | difficulty + operations filtered by prefix |
| `calculator-tutor` | `topic`, `level?` | topic: 6 suggestions, level: 3 options |

all prompt arguments use the `completable()` wrapper from the SDK, which provides async prefix-filtered suggestions to the client.

## configuration

| env var | default | description |
|:---|:---|:---|
| `SAMPLE_TOOL_NAME` | — | if set, registers a dynamic tool with this name (demonstrates runtime-configurable tools) |
| `--debug` | off | pass as CLI arg to enable debug-level logging to stderr |
| `--help` | — | prints usage to stderr and exits |

## project structure

```
src/
  server.ts    — all server logic: tools, resources, prompts, main()
  types.ts     — constants, static data, logger, HistoryEntry interface
```

two files. `types.ts` is data-only (no business logic, no Zod schemas). `server.ts` is everything else. the `createCalculatorServer()` factory is exported so tests can instantiate without auto-starting.

## quality gate

```bash
npm run pipeline     # clean → typecheck → lint:fix → lint:ci → format → build
npm run smoke:stdio  # spawns server, waits 900ms, sends SIGINT, checks exit code
npm run all          # pipeline + smoke
```

CI runs on every push to `main` and all PRs: typecheck, lint (zero warnings), format check, build.

## error handling

follows the MCP protocol contract: all errors thrown from handlers are `McpError` instances with proper `ErrorCode` values. the SDK serializes these as JSON-RPC error objects. business logic errors (division by zero, missing params) use `InvalidParams`. infrastructure errors use `InternalError`. raw JS exceptions never reach the transport.

process-level: `SIGINT`/`SIGTERM` trigger graceful shutdown (exit 0). uncaught exceptions and unhandled rejections log to stderr and exit 70 (`EX_SOFTWARE` from BSD `sysexits.h`).

## license

MIT
