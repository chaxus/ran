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
  const result = spawnSync('pnpm', ['-F', name, check], {
    stdio: 'inherit',
    // On Windows `pnpm` is `pnpm.cmd`, which spawn will not find by the bare name. Running
    // through the shell resolves it there and changes nothing on POSIX; the arguments are
    // package and check names from our own manifest, so there is nothing to quote around.
    shell: process.platform === 'win32',
  });
  // A failure to start looks nothing like a failing check: `status` is null and no output
  // was ever produced, so without this the run exits 1 with the cause missing entirely.
  // That is exactly how the Windows job failed with only `▸ ranuts: test` to show for it.
  if (result.error !== undefined) {
    console.error(`\nCould not run \`pnpm -F ${name} ${check}\`: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
