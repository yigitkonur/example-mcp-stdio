import { readdir } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SUPPORTED_MODULE_EXTENSIONS = new Set(['.js', '.ts']);

interface RegistrarModule<TTarget> {
  register?: (target: TTarget) => Promise<void> | void;
}

function isLoadableModuleFile(fileName: string): boolean {
  if (fileName === 'index.js' || fileName === 'index.ts') {
    return false;
  }

  const extension = extname(fileName);
  return SUPPORTED_MODULE_EXTENSIONS.has(extension);
}

export async function runRegistrarsFromDirectory<TTarget>(
  directoryUrl: URL,
  target: TTarget,
): Promise<void> {
  const directoryPath = dirname(fileURLToPath(directoryUrl));
  const entries = await readdir(directoryPath, { withFileTypes: true });

  const moduleFileNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isLoadableModuleFile)
    .sort((a, b) => a.localeCompare(b));

  for (const moduleFileName of moduleFileNames) {
    const moduleUrl = pathToFileURL(join(directoryPath, moduleFileName)).href;
    const loadedModule = (await import(moduleUrl)) as RegistrarModule<TTarget>;

    if (typeof loadedModule.register === 'function') {
      await loadedModule.register(target);
    }
  }
}
