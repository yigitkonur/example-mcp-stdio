# Scaffold Creator CLI

## Goal

Generate starter modules for tools, resources, and prompts with consistent structure and low friction.

## Command

```bash
node dist/index.js create <tool|resource|prompt> <name> [options]
```

## Options

- `--uri <value>`: resource URI value/template (resource scaffolds only)
- `--project <path>`: write into another project root
- `--force`: overwrite an existing generated file

## Examples

```bash
node dist/index.js create tool invoice-parser
node dist/index.js create resource policy-doc --uri policy://doc
node dist/index.js create prompt review-coach
```

## Generated Files

- tool -> `src/features/tools/<name>.ts`
- resource -> `src/features/resources/<name>.ts`
- prompt -> `src/features/prompts/<name>.ts`

## Post-Generation Checklist

1. Replace placeholder descriptions.
2. Replace placeholder schemas with domain-specific schemas.
3. Implement real logic and error handling.
4. Run `npm run pipeline`.

## Notes on Naming

- names are normalized to kebab-case
- file name and registered primitive name are aligned
- this avoids mismatches during list/call/read/get operations
