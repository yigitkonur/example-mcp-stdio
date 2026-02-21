import type { CallToolResult, McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const inputSchema = z.object({
  numbers: z.array(z.number()).min(1).max(100).describe('Numbers to add together.'),
});

const outputSchema = z.object({
  sum: z.number(),
  count: z.number().int().positive(),
});

export function register(server: McpServer): void {
  server.registerTool(
    'sum_numbers',
    {
      title: 'Sum Numbers',
      description: 'Add a list of numbers and return sum + count.',
      inputSchema,
      outputSchema,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
      },
    },
    async ({ numbers }, ctx): Promise<CallToolResult> => {
      const sum = numbers.reduce((total, value) => total + value, 0);
      await ctx.mcpReq.log('debug', { tool: 'sum_numbers', count: numbers.length, sum });

      return {
        content: [
          {
            type: 'text',
            text: `Sum(${numbers.join(', ')}) = ${sum}`,
          },
        ],
        structuredContent: {
          sum,
          count: numbers.length,
        },
      };
    },
  );
}
