import type { McpServer } from '@modelcontextprotocol/server';
import { runRegistrarsFromDirectory } from '../../core/module-loader.js';

export async function registerPrompts(server: McpServer): Promise<void> {
  await runRegistrarsFromDirectory(new URL(import.meta.url), server);
}
