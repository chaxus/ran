import type { ReleaseReceipt } from './release-types.ts';
/** Logical file bytes, not filesystem allocation or pnpm store disk usage. */
import assert from 'node:assert/strict';
import { lstat, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function directorySize(directory: string): Promise<{ bytes: number; files: number }> {
  const result = { bytes: 0, files: 0 };
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    // Never follow links into a workspace or count another package twice.
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      const child = await directorySize(path);
      result.bytes += child.bytes;
      result.files += child.files;
    } else if (entry.isFile()) {
      result.bytes += (await lstat(path)).size;
      result.files++;
    }
  }
  return result;
}

export async function measureInstallation(
  fixture: string,
  archives: string,
  receipt: Pick<ReleaseReceipt, 'packages'>,
) {
  const modules = join(fixture, 'node_modules');
  const packages = [];
  for (const pkg of receipt.packages) {
    const size = await directorySize(join(modules, pkg.name));
    packages.push({
      name: pkg.name,
      version: pkg.version,
      archiveBytes: (await stat(join(archives, pkg.archive))).size,
      unpackedBytes: size.bytes,
      files: size.files,
    });
  }
  const largest = [];
  for (const entry of await readdir(modules, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const names = entry.name.startsWith('@')
      ? (await readdir(join(modules, entry.name))).map((name) => `${entry.name}/${name}`)
      : [entry.name];
    for (const name of names) largest.push({ name, ...(await directorySize(join(modules, name))) });
  }
  return {
    environment: { node: process.versions.node, platform: process.platform, arch: process.arch },
    packages,
    installation: await directorySize(modules),
    largest: largest.sort((a, b) => b.bytes - a.bytes).slice(0, 12),
  };
}

export function assertSizeBudgets(
  report: {
    installation: { bytes: number };
    packages: { name: string; archiveBytes: number; unpackedBytes: number }[];
  },
  budgets: { installationBytes: number; packages: Record<string, { archiveBytes: number; unpackedBytes: number }> },
) {
  assert.ok(
    report.installation.bytes <= budgets.installationBytes,
    `Production installation exceeds budget: ${report.installation.bytes} > ${budgets.installationBytes}`,
  );
  assert.equal(report.packages.length, Object.keys(budgets.packages).length, 'Measure all release packages');
  const names = new Set();
  for (const pkg of report.packages) {
    assert.ok(!names.has(pkg.name), 'Duplicate measured package');
    names.add(pkg.name);
    const budget = budgets.packages[pkg.name];
    assert.ok(budget, `Missing package budget: ${pkg.name}`);
    for (const key of ['archiveBytes', 'unpackedBytes'] as const)
      assert.ok(
        pkg[key] > 0 && pkg[key] <= budget[key],
        `${pkg.name}: ${key} exceeds budget: ${pkg[key]} > ${budget[key]}`,
      );
  }
}
