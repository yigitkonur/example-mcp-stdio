import type { McpServer } from '@modelcontextprotocol/server';

const checklist = [
  'Add one new tool that solves a real workflow problem.',
  'Return structuredContent for machine-readable outputs.',
  'Add one static resource and one templated resource.',
  'Use prompts to standardize repeated model instructions.',
  'Keep logs on stderr only (stdio safety).',
];

export function register(server: McpServer): void {
  server.registerResource(
    'starter-checklist',
    'starter://checklist',
    {
      title: 'Starter Checklist',
      description: 'Recommended steps for extending this boilerplate.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ checklist }, null, 2),
        },
      ],
    }),
  );
}
