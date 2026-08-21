/**
 * Runs one declared check across every package that declares it.
 *
 * Reading the package list from packages/manifest.json is the point: a hand-maintained list
 * inside a shell script drifts from the manifest silently, and the drift is invisible
 * precisely because nothing runs the package that fell out.
 *
 * Usage: node bin/run-checks.mjs <check>
 */
import { spawnSync } from 'node:child_process';
import { readManifest } from './packages.mjs';

const check = process.argv[2];
if (check === undefined) {
  console.error('usage: node bin/run-checks.mjs <check>');
  process.exit(2);
}

const targets = readManifest().filter((entry) => (entry.checks ?? []).includes(check));
if (targets.length === 0) {
  console.error(`No package declares the "${check}" check.`);
  process.exit(1);
}

for (const { name } of targets) {
  console.log(`\n▸ ${name}: ${check}`);
  const result = spawnSync('pnpm', ['-F', name, check], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
