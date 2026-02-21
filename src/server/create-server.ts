import { McpServer } from '@modelcontextprotocol/server';
import { SERVER_INSTRUCTIONS, SERVER_METADATA } from '../core/server-metadata.js';
import { registerPrompts } from '../features/prompts/index.js';
import { registerResources } from '../features/resources/index.js';
import { registerTools } from '../features/tools/index.js';

export async function createStarterServer(): Promise<McpServer> {
  const server = new McpServer(
    {
      name: SERVER_METADATA.name,
      version: SERVER_METADATA.version,
    },
    {
      capabilities: {
        logging: {},
      },
      instructions: SERVER_INSTRUCTIONS,
    },
  );

  await registerTools(server);
  await registerResources(server);
  await registerPrompts(server);

  return server;
}
