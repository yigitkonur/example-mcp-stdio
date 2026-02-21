import {
  completable,
  ProtocolError,
  ProtocolErrorCode,
  type McpServer,
} from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const implementationStyles = ['minimal', 'production', 'experimental'] as const;
const implementationStyleSet = new Set(implementationStyles);

export function register(server: McpServer): void {
  server.registerPrompt(
    'scaffold-plan',
    {
      title: 'Scaffold Plan',
      description: 'Generate a practical implementation plan for a new MCP capability.',
      argsSchema: z.object({
        feature: z.string().describe('Capability you want to add.'),
        style: completable(z.string().describe('Implementation style').optional(), async (value) =>
          implementationStyles.filter((item) => item.startsWith((value ?? '').toLowerCase())),
        ),
      }),
    },
    ({ feature, style }) => {
      if (style && !implementationStyleSet.has(style as (typeof implementationStyles)[number])) {
        throw new ProtocolError(
          ProtocolErrorCode.InvalidParams,
          `Invalid style '${style}'. Expected one of: ${implementationStyles.join(', ')}`,
        );
      }

      const selectedStyle = style ?? 'production';

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `Create a ${selectedStyle} implementation plan for: ${feature}.`,
                'Return: goal, schema design, error handling, and rollout checklist.',
                'Keep the plan specific to MCP v2 stdio server constraints.',
              ].join('\n'),
            },
          },
        ],
      };
    },
  );
}
