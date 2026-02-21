import { mkdir, writeFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

export type ScaffoldKind = 'tool' | 'resource' | 'prompt';

export interface CreateArtifactOptions {
  force: boolean;
  kind: ScaffoldKind;
  name: string;
  projectRoot: string;
  uri: string | undefined;
}

const kindDirectoryMap: Record<ScaffoldKind, string> = {
  tool: 'tools',
  resource: 'resources',
  prompt: 'prompts',
};

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toPascalCase(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function createToolTemplate(fileBaseName: string): string {
  const functionSuffix = toPascalCase(fileBaseName);
  const toolName = fileBaseName;

  return `import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const inputSchema = z.object({
  input: z.string().describe('Input for ${toolName}.'),
});

export function register(server: McpServer): void {
  server.registerTool(
    '${toolName}',
    {
      title: '${functionSuffix}',
      description: 'TODO: describe what ${toolName} does.',
      inputSchema,
    },
    async ({ input }, ctx) => {
      await ctx.mcpReq.log('info', '${toolName} called');

      return {
        content: [
          {
            type: 'text',
            text: \`${toolName} received: \${input}\`,
          },
        ],
      };
    },
  );
}
`;
}

function createResourceTemplate(fileBaseName: string, requestedUri: string): string {
  const resourceName = fileBaseName;
  const functionSuffix = toPascalCase(fileBaseName);

  return `import type { McpServer } from '@modelcontextprotocol/server';

export function register(server: McpServer): void {
  server.registerResource(
    '${resourceName}',
    '${requestedUri}',
    {
      title: '${functionSuffix}',
      description: 'TODO: describe what ${resourceName} exposes.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({
            message: '${resourceName} placeholder',
          }, null, 2),
        },
      ],
    }),
  );
}
`;
}

function createPromptTemplate(fileBaseName: string): string {
  const promptName = fileBaseName;
  const functionSuffix = toPascalCase(fileBaseName);

  return `import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export function register(server: McpServer): void {
  server.registerPrompt(
    '${promptName}',
    {
      title: '${functionSuffix}',
      description: 'TODO: describe when to use ${promptName}.',
      argsSchema: z.object({
        topic: z.string().describe('Prompt topic.'),
      }),
    },
    ({ topic }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: \`${promptName} request for: \${topic}\`,
          },
        },
      ],
    }),
  );
}
`;
}

function createTemplateContent(
  kind: ScaffoldKind,
  fileBaseName: string,
  options: { uri: string | undefined },
): string {
  if (kind === 'tool') {
    return createToolTemplate(fileBaseName);
  }

  if (kind === 'resource') {
    const uri = options.uri ?? `${fileBaseName}://example`;
    return createResourceTemplate(fileBaseName, uri);
  }

  return createPromptTemplate(fileBaseName);
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function createArtifact(options: CreateArtifactOptions): Promise<string> {
  const normalizedName = toKebabCase(options.name);

  if (!normalizedName) {
    throw new Error('Name must contain at least one alphanumeric character.');
  }

  const featureDirectory = join(
    options.projectRoot,
    'src',
    'features',
    kindDirectoryMap[options.kind],
  );

  await mkdir(featureDirectory, { recursive: true });

  const outputFilePath = join(featureDirectory, `${normalizedName}.ts`);

  if (!options.force && (await pathExists(outputFilePath))) {
    throw new Error(`File already exists: ${outputFilePath}. Use --force to overwrite the file.`);
  }

  const template = createTemplateContent(options.kind, normalizedName, {
    uri: options.uri,
  });

  await writeFile(outputFilePath, template, 'utf8');
  return outputFilePath;
}
