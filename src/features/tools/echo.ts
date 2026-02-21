import type { CallToolResult, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const inputSchema = z.object({
  text: z.string().min(1).describe('Text to echo back.'),
});

const outputSchema = z.object({
  echoed: z.string(),
  length: z.number().int().nonnegative(),
});

export function register(server: McpServer): void {
  server.registerTool(
    'echo',
    {
      title: 'Echo',
      description: 'Return the provided text and its length.',
      inputSchema,
      outputSchema,
      annotations: {
        readOnlyHint: true,
      },
    },
    async ({ text }, ctx): Promise<CallToolResult> => {
      await ctx.mcpReq.log('info', `echo called with ${text.length} characters`);

      const structuredContent = {
        echoed: text,
        length: text.length,
      };

      return {
        content: [
          {
            type: 'text',
            text,
          },
        ],
        structuredContent,
      };
    },
  );
}
