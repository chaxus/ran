import { lstatSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve from this script so running the shell wrapper elsewhere is safe.
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'packages/manifest.json'), 'utf8'));
if (!manifest.packages || typeof manifest.packages !== 'object' || Array.isArray(manifest.packages)) {
  throw new Error('Invalid packages manifest: expected a packages object');
}
const packages = Object.keys(manifest.packages);
// Validate every name before deleting anything, including root artifacts.
if (packages.some((name) => !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name))) {
  throw new Error('Invalid package directory in packages manifest');
}

// These are generated outputs. In particular, build/ contains maintained source.
const artifacts = ['dist', 'coverage', 'playwright-report', 'test-results', 'report', '.prettiercache'];
const owners = [[], ...packages.map((name) => ['packages', name])];
let removed = 0;
for (const owner of owners) {
  for (const artifact of artifacts) {
    const segments = [...owner, artifact];
    let candidate = root;
    let safe = true;
    for (const segment of segments) {
      candidate = join(candidate, segment);
      try {
        // Never follow a symlink at the artifact or any ancestor below root.
        if (lstatSync(candidate).isSymbolicLink()) {
          safe = false;
          break;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        safe = false;
        break;
      }
    }
    if (!safe) continue;
    rmSync(candidate, { recursive: true, force: true });
    removed += 1;
  }
}
console.log(`Removed ${removed} generated artifact paths.`);
