# Validation and Workflow

## Recommended local workflow

1. Generate new module with scaffold CLI.
2. Implement real logic and schemas.
3. Run full validation.
4. Connect via your MCP host and test end-to-end.

## Commands

```bash
npm run build
npm run smoke:stdio
npm run pipeline
```

## What smoke test checks

`scripts/smoke-stdio.mjs` validates protocol basics by running the built server and executing:

- `initialize`
- `notifications/initialized`
- `tools/list`
- `resources/list`
- `prompts/list`

If any of these fail, smoke test exits non-zero.

## Updating vendored SDK snapshot

Use this when you want to track upstream v2 changes:

```bash
npm run vendor:sdk:update
npm install
npm run pipeline
```
