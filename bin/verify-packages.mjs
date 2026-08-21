/**
 * Keeps packages/manifest.json honest against what is on disk.
 *
 * The manifest decides which packages CI checks, so a package missing from it is a package
 * nobody decided about — which is how `visual` ended up with 48 TypeScript files that
 * typechecked cleanly and were run by nothing, and how `ranite` kept a tsconfig option
 * TypeScript had removed.
 */
import {
  NEEDS_REASON,
  STATUSES,
  hasTypeScriptSource,
  readDirectories,
  readManifest,
  readPackageJson,
} from './packages.mjs';

const failures = [];
const manifest = readManifest();
const declared = new Set(manifest.map((entry) => entry.name));
const present = readDirectories();

for (const name of present) {
  if (!declared.has(name)) {
    failures.push(`packages/${name} is not declared in packages/manifest.json — add it with a status and its checks.`);
  }
}

for (const entry of manifest) {
  const { name, status, checks = [], reason } = entry;

  if (!present.includes(name)) {
    failures.push(`packages/manifest.json declares "${name}", which no longer exists on disk.`);
    continue;
  }
  if (!STATUSES.includes(status)) {
    failures.push(`"${name}" has status "${status}"; expected one of ${STATUSES.join(', ')}.`);
  }
  if (NEEDS_REASON.includes(status) && (reason === undefined || reason.trim() === '')) {
    failures.push(`"${name}" is "${status}" and opts out of every check, so it needs a "reason".`);
  }

  const pkg = readPackageJson(name);
  if (pkg === null) {
    if (checks.length > 0) failures.push(`"${name}" declares checks but has no package.json to run them from.`);
    continue;
  }

  for (const check of checks) {
    if (pkg.scripts?.[check] === undefined) {
      failures.push(`"${name}" declares the "${check}" check, but its package.json has no "${check}" script.`);
    }
  }

  // The rule the whole file exists for: real TypeScript is typechecked, or says why not.
  // A justified opt-out passes — the point is that the justification is visible in review,
  // not that the gate is unopenable.
  if (hasTypeScriptSource(name) && !checks.includes('tsc') && (reason === undefined || reason.trim() === '')) {
    failures.push(
      `"${name}" holds TypeScript source but does not declare the "tsc" check. ` +
        'Add it, or give a "reason" for leaving it unchecked.',
    );
  }
}

if (failures.length > 0) {
  console.error(`packages/manifest.json: ${failures.length} problem(s)\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const counts = manifest.reduce((out, entry) => ({ ...out, [entry.status]: (out[entry.status] ?? 0) + 1 }), {});
const summary = Object.entries(counts)
  .map(([status, n]) => `${n} ${status}`)
  .join(' · ');
console.log(`packages/manifest.json: ${manifest.length} packages declared (${summary}).`);
