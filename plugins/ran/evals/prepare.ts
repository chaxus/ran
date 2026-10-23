import { evaluationManifest } from './data.ts';
import type { ScenarioRecord } from './data.ts';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, cpSync, existsSync, readdirSync, chmodSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { scenarios, codePayload, streamPayload } from './scenarios.ts';
export const repo = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)));
import { hash, treeHash } from './hash.ts';
const guidancePaths = [
  'AGENTS.md',
  'design',
  'plugins/ran/skills',
  'plugins/ranui/skills',
  'packages/ranui/docs',
  'packages/ranui/CLAUDE.md',
];
function workingGuidance(folder: string): string[] {
  if (!existsSync(path.join(repo, folder))) return [];
  if (folder.endsWith('.md')) return [folder];
  return readdirSync(path.join(repo, folder), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? workingGuidance(`${folder}/${entry.name}`)
      : entry.name.endsWith('.md') || entry.name === 'manifest.json'
        ? [`${folder}/${entry.name}`]
        : [],
  );
}
export function prepare({
  out,
  label,
  guidanceRef = 'working-tree',
}: {
  out: string;
  label: string;
  guidanceRef?: string;
}) {
  if (guidanceRef !== 'working-tree')
    execFileSync('git', ['rev-parse', '--verify', `${guidanceRef}^{commit}`], {
      cwd: repo,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  const available =
    guidanceRef === 'working-tree'
      ? guidancePaths.flatMap(workingGuidance)
      : execFileSync('git', ['ls-tree', '-r', '--name-only', guidanceRef, '--', ...guidancePaths], {
          cwd: repo,
          encoding: 'utf8',
        })
          .trim()
          .split('\n')
          .filter(Boolean);
  const dest = path.resolve(out, label);
  if (dest.startsWith(repo + path.sep)) throw new Error('Runs must live outside the source repository');
  if (existsSync(dest)) throw new Error(`Run already exists: ${dest}`);
  mkdirSync(dest, { recursive: true });
  const guidance = path.join(dest, 'guidance');
  for (const file of available) {
    const content =
      guidanceRef === 'working-tree'
        ? readFileSync(path.join(repo, file))
        : execFileSync('git', ['show', `${guidanceRef}:${file}`], { cwd: repo, stdio: ['ignore', 'pipe', 'pipe'] });
    mkdirSync(path.dirname(path.join(guidance, file)), { recursive: true });
    writeFileSync(path.join(guidance, file), content, { mode: 0o444 });
  }
  const manifest = {
    schema: 1,
    label,
    guidanceRef,
    createdAt: new Date().toISOString(),
    toolsHash: hash(
      [
        'prepare.ts',
        'serve.ts',
        'capture.ts',
        'evidence.ts',
        'assess.ts',
        'scenarios.ts',
        'rubric.json',
        'hash.ts',
        'data.ts',
        '../../../bin/tooling-json.ts',
      ]
        .map((p) => hash(readFileSync(fileURLToPath(new URL(p, import.meta.url)))))
        .join('\n'),
    ),
    rubricHash: hash(readFileSync(fileURLToPath(new URL('./rubric.json', import.meta.url)))),
    fixtureHash: treeHash(fileURLToPath(new URL('./fixture', import.meta.url))),
    guidanceHash: treeHash(guidance),
    scenarios: [] as ScenarioRecord[],
  };
  for (const item of scenarios) {
    const dir = path.join(dest, item.id);
    mkdirSync(dir, { recursive: true });
    cpSync(fileURLToPath(new URL('./fixture', import.meta.url)), path.join(dir, 'surface'), { recursive: true });
    writeFileSync(
      path.join(dir, 'runtime.js'),
      `export const scenario=${JSON.stringify(item.id)};\nexport const payload=${JSON.stringify(codePayload)};\nexport const streamPayload=${JSON.stringify(streamPayload)};\n`,
      { mode: 0o444 },
    );
    writeFileSync(
      path.join(dir, 'run-tools.md'),
      `# Browser tools\n\nThe host uses the installed ranui package source via Vite. It needs no online services.\n\n- Serve: node ${fileURLToPath(new URL('./serve.ts', import.meta.url))} ${dir}\n- Capture current rendered state and runtime/media metadata: node ${fileURLToPath(new URL('./capture.ts', import.meta.url))} ${dir} final\n- Browser automation: use the existing @playwright/test installation resolved from ${path.join(repo, 'packages/ranui/package.json')} with Node createRequire.\n\nCapturing media does not itself perform visual review or establish a human decision.\n`,
      { mode: 0o444 },
    );
    writeFileSync(
      path.join(dir, 'run.json'),
      JSON.stringify({ scenario: item.id, repo, tools: fileURLToPath(new URL('./', import.meta.url)) }, null, 2),
      { mode: 0o444 },
    );
    const task = `# ${item.title}\n\n${item.task}\n\nUse the ranui skill and relevant guidance under ../guidance/, which mirrors the host project paths. Edit only surface/. Keep its real ranui import and the existing content/actions. runtime.js is the immutable incoming data contract. Do not inspect the evaluation implementation or other runs.\n\nStart the real browser host:\n\n\`node ${fileURLToPath(new URL('./serve.ts', import.meta.url))} ${dir}\`\n\nUse available browser tools to inspect and verify. Keep evidence under evidence/ and write REPORT.md describing changes, verification, evidence paths, and decision status. For scenario 05, evidence/prior-review.json and prior.png describe the earlier state; the current shared.css includes a subsequent change. Do not edit earlier evidence.\n`;
    writeFileSync(path.join(dir, 'TASK.md'), task, { mode: 0o444 });
    manifest.scenarios.push({
      id: item.id,
      promptHash: hash(task.replaceAll(dir, '<RUN>')),
      surfaceHash: treeHash(path.join(dir, 'surface')),
    });
  }
  writeFileSync(path.join(dest, 'manifest.json'), JSON.stringify(manifest, null, 2), { mode: 0o444 });
  return dest;
}
export function finalizeManifest(dest: string) {
  const file = path.join(dest, 'manifest.json');
  const manifest = evaluationManifest(file);
  for (const item of manifest.scenarios) {
    const dir = path.join(dest, item.id);
    item.initialSurfaceHash ||= item.surfaceHash;
    item.surfaceHash = treeHash(path.join(dir, 'surface'));
    if (item.id === '05-freshness') item.priorEvidenceHash = treeHash(path.join(dir, 'evidence'));
  }
  chmodSync(file, 0o644);
  writeFileSync(file, JSON.stringify(manifest, null, 2));
  chmodSync(file, 0o444);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = Object.fromEntries(
    process.argv
      .slice(2)
      .reduce<[string, string][]>((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []),
  );
  if (!args.out || !args.label)
    throw new Error('Usage: node prepare.ts --out /outside/repo --label baseline --guidance-ref 7544bce');
  const dest = prepare({ out: args.out, label: args.label, guidanceRef: args['guidance-ref'] });
  const { seedFreshness } = await import('./evidence.ts');
  await seedFreshness(path.join(dest, '05-freshness'));
  finalizeManifest(dest);
  console.log(dest);
}
