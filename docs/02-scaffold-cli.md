# Scaffold Creator CLI

## Purpose

The scaffold creator CLI generates starter module files under `src/features/*` so you can add capabilities without repeating boilerplate manually.

## Command Format

```bash
node dist/index.js create <tool|resource|prompt> <name> [options]
```

Options:

- `--uri <value>`: set resource URI (resource scaffolds only)
- `--project <path>`: target project root
- `--force`: overwrite existing file

## Examples

```bash
node dist/index.js create tool invoice-parser
node dist/index.js create resource policy-doc --uri policy://doc
node dist/index.js create prompt code-review-coach
```

## Generated Paths

- tool -> `src/features/tools/<name>.ts`
- resource -> `src/features/resources/<name>.ts`
- prompt -> `src/features/prompts/<name>.ts`

## What to edit after generation

1. Update `description` text.
2. Replace placeholder schema fields with real input/args.
3. Replace placeholder output with real business logic.
4. Run `npm run pipeline`.
