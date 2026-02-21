#!/usr/bin/env node
import { resolve } from 'node:path';
import { createArtifact, type ScaffoldKind } from './cli/scaffold.js';
import { SERVER_METADATA } from './core/server-metadata.js';
import { runStdioServer } from './server/run-stdio.js';

interface CreateCommandArgs {
  force: boolean;
  kind: ScaffoldKind;
  name: string;
  projectRoot: string;
  uri: string | undefined;
}

function printHelp(): void {
  console.error(`${SERVER_METADATA.name} v${SERVER_METADATA.version}`);
  console.error('');
  console.error('Usage:');
  console.error('  example-mcp-stdio serve');
  console.error('  example-mcp-stdio create <tool|resource|prompt> <name> [options]');
  console.error('');
  console.error('Options:');
  console.error('  --uri <value>      Resource URI template (resource scaffolds only)');
  console.error('  --project <path>   Target project root (default: current working directory)');
  console.error('  --force            Overwrite output file if it exists');
  console.error('  -h, --help         Show help');
}

function parseCreateArgs(args: string[]): CreateCommandArgs {
  const kind = args[0];
  const name = args[1];

  if (kind !== 'tool' && kind !== 'resource' && kind !== 'prompt') {
    throw new Error('create requires a kind: tool | resource | prompt');
  }

  if (!name) {
    throw new Error('create requires a name.');
  }

  let uri: string | undefined;
  let force = false;
  let projectRoot = process.cwd();

  for (let index = 2; index < args.length; index += 1) {
    const token = args[index];

    if (token === '--force') {
      force = true;
      continue;
    }

    if (token === '--uri') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--uri expects a value.');
      }
      uri = value;
      index += 1;
      continue;
    }

    if (token === '--project') {
      const value = args[index + 1];
      if (!value) {
        throw new Error('--project expects a value.');
      }
      projectRoot = resolve(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown create option: ${token}`);
  }

  return {
    force,
    kind,
    name,
    projectRoot,
    uri,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] ?? 'serve';

  if (command === 'serve') {
    await runStdioServer();
    return;
  }

  if (command === 'create') {
    const createOptions = parseCreateArgs(args.slice(1));
    const outputPath = await createArtifact(createOptions);
    console.error(`Created ${createOptions.kind}: ${outputPath}`);
    return;
  }

  if (command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
