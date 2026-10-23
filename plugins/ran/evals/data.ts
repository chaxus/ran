/** File boundaries shared by the evaluation CLI. Never trust path-bearing JSON by assertion alone. */
import { readFileSync } from 'node:fs';
import { object, text, strings, stringRecord } from '../../../bin/tooling-json.ts';
export function readObject(file: string): Record<string, unknown> {
  return object(JSON.parse(readFileSync(file, 'utf8')), file);
}
export function runRepository(file: string): string {
  return text(readObject(file).repo, 'run.repo');
}
export function runInfo(file: string) {
  const value = readObject(file);
  return { repo: text(value.repo, 'run.repo'), scenario: text(value.scenario, 'run.scenario') };
}
export interface CaptureMetadata {
  media?: string;
  mediaPath?: string;
  screenshot?: string;
  mediaHash?: string;
  screenshotHash?: string;
  runtimeHash?: string;
  scope?: string[];
  sourceHashes?: Record<string, string>;
  captures?: { media?: string; mediaHash?: string }[];
  loadedResources?: { url: string; sha256: string }[];
}
export function captureMetadata(file: string): CaptureMetadata {
  const data = readObject(file);
  const result: CaptureMetadata = {};
  for (const key of ['media', 'mediaPath', 'screenshot', 'mediaHash', 'screenshotHash', 'runtimeHash'] as const)
    if (data[key] !== undefined) result[key] = text(data[key], key);
  if (data.scope !== undefined) result.scope = strings(data.scope, 'scope');
  if (data.sourceHashes !== undefined) result.sourceHashes = stringRecord(data.sourceHashes, 'sourceHashes');
  if (data.captures !== undefined) {
    if (!Array.isArray(data.captures)) throw new Error('captures must be an array');
    result.captures = data.captures.map((entry) => {
      const row = object(entry, 'capture');
      return {
        media: row.media === undefined ? undefined : text(row.media, 'capture.media'),
        mediaHash: row.mediaHash === undefined ? undefined : text(row.mediaHash, 'capture.mediaHash'),
      };
    });
  }
  if (data.loadedResources !== undefined) {
    if (!Array.isArray(data.loadedResources)) throw new Error('loadedResources must be an array');
    result.loadedResources = data.loadedResources.map((entry) => {
      const row = object(entry, 'resource');
      return { url: text(row.url, 'resource.url'), sha256: text(row.sha256, 'resource.sha256') };
    });
  }
  return result;
}
export interface ScenarioRecord {
  id: string;
  promptHash: string;
  surfaceHash: string;
  initialSurfaceHash?: string;
  priorEvidenceHash?: string;
}
export function evaluationManifest(file: string) {
  const data = readObject(file);
  if (!Array.isArray(data.scenarios)) throw new Error('scenarios must be an array');
  const scenarios: ScenarioRecord[] = data.scenarios.map((entry) => {
    const row = object(entry, 'scenario');
    const result: ScenarioRecord = {
      id: text(row.id, 'scenario.id'),
      promptHash: text(row.promptHash, 'scenario.promptHash'),
      surfaceHash: text(row.surfaceHash, 'scenario.surfaceHash'),
    };
    for (const key of ['initialSurfaceHash', 'priorEvidenceHash'] as const)
      if (row[key] !== undefined) result[key] = text(row[key], key);
    return result;
  });
  return {
    ...data,
    scenarios,
    guidanceRef: text(data.guidanceRef, 'guidanceRef'),
    fixtureHash: text(data.fixtureHash, 'fixtureHash'),
    toolsHash: text(data.toolsHash, 'toolsHash'),
    rubricHash: text(data.rubricHash, 'rubricHash'),
  };
}
