import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const sdkRepository = 'https://github.com/modelcontextprotocol/typescript-sdk';
const targetVendorDirectory = resolve('vendor');

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'mcp-sdk-v2-'));

  try {
    run('git', ['clone', '--depth', '1', sdkRepository, 'sdk'], tempRoot);

    const sdkPath = join(tempRoot, 'sdk');
    run('pnpm', ['install'], sdkPath);
    run(
      'pnpm',
      ['--filter', '@modelcontextprotocol/server', 'pack', '--pack-destination', '.packed'],
      sdkPath,
    );

    const packedDirectory = join(sdkPath, '.packed');
    const packedFiles = await readdir(packedDirectory);
    const tgzFileName = packedFiles.find((fileName) => fileName.endsWith('.tgz'));

    if (!tgzFileName) {
      throw new Error('Could not find packed server tarball in .packed directory.');
    }

    const sourceTarballPath = join(packedDirectory, tgzFileName);
    const targetTarballPath = join(targetVendorDirectory, tgzFileName);

    await cp(sourceTarballPath, targetTarballPath);
    process.stderr.write(`Vendored SDK tarball updated: ${targetTarballPath}\n`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(
    `Failed to update vendored SDK package: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
