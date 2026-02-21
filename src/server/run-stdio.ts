import { StdioServerTransport } from '@modelcontextprotocol/server';
import { createStarterServer } from './create-server.js';

export async function runStdioServer(): Promise<void> {
  const server = await createStarterServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  const shutdown = () => {
    void server.close().finally(() => {
      process.exit(0);
    });
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
