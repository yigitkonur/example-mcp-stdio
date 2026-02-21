# scaffold CLI

the CLI has two commands: `serve` and `create`. the entrypoint is `src/index.ts`.

## serve

starts the STDIO MCP server. this is the default command.

```bash
# development
npm run dev

# production
npm run build && npm start

# explicit
node dist/index.js serve
```

## create

generates a new tool, resource, or prompt file from a built-in template.

```bash
node dist/index.js create <tool|resource|prompt> <name> [options]
```

### options

| option | description | applies to |
|--------|-------------|------------|
| `--uri <value>` | URI or URI template for the resource | resource only |
| `--project <path>` | target project root (default: cwd) | all |
| `--force` | overwrite if file already exists | all |

### examples

```bash
# generate a tool
node dist/index.js create tool invoice-parser

# generate a resource with a custom URI
node dist/index.js create resource policy-doc --uri policy://doc

# generate a prompt
node dist/index.js create prompt review-coach

# generate into a different project
node dist/index.js create tool fetcher --project /path/to/other-project

# overwrite an existing file
node dist/index.js create tool echo --force
```

in development mode, use `npm run dev:cli` instead of `node dist/index.js`:

```bash
npx tsx src/index.ts create tool invoice-parser
```

## generated file paths

| kind | output path |
|------|-------------|
| tool | `src/features/tools/<name>.ts` |
| resource | `src/features/resources/<name>.ts` |
| prompt | `src/features/prompts/<name>.ts` |

## post-generation checklist

after generating a file:

1. replace the placeholder `description` with a real one
2. replace the placeholder `inputSchema` / `argsSchema` with your domain schema
3. implement the actual handler logic
4. run `npm run pipeline` to validate

no barrel file edits needed -- the auto-loader picks up new files automatically.

## naming conventions

- names are normalized to kebab-case (e.g., `invoiceParser` becomes `invoice-parser`)
- the file name and the registered primitive name are the same kebab-case string
- for tools, the registered name uses underscores in MCP (e.g., file `my-tool.ts` registers as `my-tool`)
- resource URIs default to `<name>://example` if `--uri` is not provided

## next steps

- [02-architecture.md](02-architecture.md) to understand how generated files are auto-loaded
- [05-validation.md](05-validation.md) to verify your new feature works
