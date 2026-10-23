/** Narrow untrusted JSON before repository tooling acts on paths or release metadata. */
import assert from 'node:assert/strict';

export type JsonRecord = Record<string, unknown>;
export function object(value: unknown, label = 'JSON object'): JsonRecord {
  assert.ok(value !== null && typeof value === 'object' && !Array.isArray(value), `Expected ${label}`);
  return value as JsonRecord;
}
export function text(value: unknown, label: string): string {
  assert.equal(typeof value, 'string', `Expected ${label} to be a string`);
  return value as string;
}
export function strings(value: unknown, label: string): string[] {
  assert.ok(Array.isArray(value), `Expected ${label} to be an array`);
  return value.map((entry) => text(entry, label));
}
export function stringRecord(value: unknown, label: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object(value, label)).map(([key, entry]) => [key, text(entry, `${label}.${key}`)]),
  );
}
export interface ExportConditions {
  import?: string;
  types?: string;
  default?: string;
  [condition: string]: string | ExportConditions | undefined;
}
function exportTarget(value: unknown): string | ExportConditions | null {
  if (typeof value === 'string' || value === null) return value;
  return Object.fromEntries(
    Object.entries(object(value, 'export conditions')).map(([key, entry]) => {
      const target = exportTarget(entry);
      assert.ok(target !== null, 'Nested export conditions must name a target');
      return [key, target];
    }),
  );
}
export interface PackageManifest {
  name: string;
  version: string;
  type?: string;
  engines?: { node?: string };
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  exports?: Record<string, string | ExportConditions | null>;
  packageManager?: string;
  license?: string;
  repository?: string | { url: string };
}
export function packageManifest(value: unknown): PackageManifest {
  const data = object(value, 'package manifest');
  const result: PackageManifest = {
    name: text(data.name, 'package name'),
    version: text(data.version, 'package version'),
  };
  for (const key of ['type', 'packageManager', 'license'] as const)
    if (data[key] !== undefined) result[key] = text(data[key], key);
  if (data.engines !== undefined) {
    const engines = object(data.engines, 'engines');
    result.engines = engines.node === undefined ? {} : { node: text(engines.node, 'engines.node') };
  }
  for (const key of ['scripts', 'dependencies'] as const)
    if (data[key] !== undefined) result[key] = stringRecord(data[key], key);
  if (data.exports !== undefined)
    result.exports = Object.fromEntries(
      Object.entries(object(data.exports, 'exports')).map(([key, entry]) => [key, exportTarget(entry)]),
    );
  if (data.repository !== undefined)
    result.repository =
      typeof data.repository === 'string'
        ? data.repository
        : { url: text(object(data.repository, 'repository').url, 'repository.url') };
  return result;
}
export function hasErrorCode(error: unknown, code: string): boolean {
  return error !== null && typeof error === 'object' && 'code' in error && error.code === code;
}
export function printCommandError(error: unknown): void {
  if (error === null || typeof error !== 'object') return;
  for (const key of ['stdout', 'stderr'] as const) {
    const value =
      key === 'stdout' ? ('stdout' in error ? error.stdout : undefined) : 'stderr' in error ? error.stderr : undefined;
    if (typeof value === 'string' || Buffer.isBuffer(value)) process.stderr.write(value);
  }
}
