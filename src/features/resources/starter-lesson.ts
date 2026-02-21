import {
  ProtocolError,
  ProtocolErrorCode,
  ResourceTemplate,
  type McpServer,
} from '@modelcontextprotocol/server';

const lessonByTopic = {
  tools: {
    title: 'Tools in MCP v2',
    body: 'Tools execute actions. Prefer z.object() schemas and structuredContent outputs.',
  },
  resources: {
    title: 'Resources in MCP v2',
    body: 'Resources expose read-only data. Use ResourceTemplate for dynamic URIs.',
  },
  prompts: {
    title: 'Prompts in MCP v2',
    body: 'Prompts define reusable message templates and argument schemas.',
  },
} as const;

export function register(server: McpServer): void {
  server.registerResource(
    'starter-lesson',
    new ResourceTemplate('starter://lesson/{topic}', {
      list: async () => ({
        resources: Object.entries(lessonByTopic).map(([topic, lesson]) => ({
          uri: `starter://lesson/${topic}`,
          name: lesson.title,
          mimeType: 'application/json',
          description: `Learning note for ${topic}`,
        })),
      }),
      complete: {
        topic: async (value) =>
          Object.keys(lessonByTopic)
            .filter((topic) => topic.startsWith(value.toLowerCase()))
            .slice(0, 10),
      },
    }),
    {
      title: 'Starter Lesson',
      description: 'Tiny knowledge base for MCP primitives.',
      mimeType: 'application/json',
    },
    async (uri, { topic }) => {
      const lesson = lessonByTopic[topic as keyof typeof lessonByTopic];

      if (!lesson) {
        throw new ProtocolError(
          ProtocolErrorCode.InvalidParams,
          `Unknown lesson topic '${topic}'.`,
        );
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify({ topic, ...lesson }, null, 2),
          },
        ],
      };
    },
  );
}
