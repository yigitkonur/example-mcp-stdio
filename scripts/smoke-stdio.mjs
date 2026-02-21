import { spawn } from 'node:child_process';
import { LATEST_PROTOCOL_VERSION } from '@modelcontextprotocol/server';

const child = spawn(process.execPath, ['dist/index.js', 'serve'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd(),
});

let nextId = 1;
let stdoutBuffer = '';
const pending = new Map();

const ready = new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('spawn', resolve);
});

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

function request(method, params) {
  const id = nextId;
  nextId += 1;

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    send({
      jsonrpc: '2.0',
      id,
      method,
      params,
    });
  });
}

function rejectPending(error) {
  for (const item of pending.values()) {
    item.reject(error);
  }
  pending.clear();
}

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk) => {
  stdoutBuffer += chunk;

  while (true) {
    const lineBreakIndex = stdoutBuffer.indexOf('\n');
    if (lineBreakIndex === -1) {
      break;
    }

    const line = stdoutBuffer.slice(0, lineBreakIndex).trim();
    stdoutBuffer = stdoutBuffer.slice(lineBreakIndex + 1);

    if (!line) {
      continue;
    }

    const message = JSON.parse(line);

    if (!Object.prototype.hasOwnProperty.call(message, 'id')) {
      continue;
    }

    const item = pending.get(message.id);
    if (!item) {
      continue;
    }

    pending.delete(message.id);

    if (message.error) {
      item.reject(new Error(message.error.message ?? 'Unknown JSON-RPC error'));
      continue;
    }

    item.resolve(message.result);
  }
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', () => {
  // Server logs are expected on stderr for stdio transport.
});

child.once('exit', (code) => {
  if (pending.size > 0) {
    rejectPending(new Error(`Server exited before responses were completed (code ${code ?? 0}).`));
  }
});

async function main() {
  await ready;

  const initializeResult = await request('initialize', {
    protocolVersion: LATEST_PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: {
      name: 'smoke-client',
      version: '0.0.1',
    },
  });

  if (!initializeResult?.serverInfo?.name) {
    throw new Error('initialize response did not include serverInfo.name');
  }

  send({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  });

  const tools = await request('tools/list', {});
  const resources = await request('resources/list', {});
  const prompts = await request('prompts/list', {});

  const toolNames = new Set((tools.tools ?? []).map((tool) => tool.name));
  const resourceUris = new Set((resources.resources ?? []).map((resource) => resource.uri));
  const promptNames = new Set((prompts.prompts ?? []).map((prompt) => prompt.name));

  if (!toolNames.has('echo')) {
    throw new Error('Expected tool "echo" not found.');
  }

  if (!toolNames.has('sum_numbers')) {
    throw new Error('Expected tool "sum_numbers" not found.');
  }

  if (!resourceUris.has('starter://checklist')) {
    throw new Error('Expected resource "starter://checklist" not found.');
  }

  if (!promptNames.has('scaffold-plan')) {
    throw new Error('Expected prompt "scaffold-plan" not found.');
  }

  child.kill('SIGINT');
}

main()
  .then(() => {
    process.stderr.write('smoke:stdio passed\n');
  })
  .catch((error) => {
    process.stderr.write(
      `smoke:stdio failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    child.kill('SIGINT');
    process.exitCode = 1;
  });
