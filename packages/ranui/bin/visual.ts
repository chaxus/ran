import { object, text, stringRecord } from '../../../bin/tooling-json.ts';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(packageRoot, '../..');
const environment = stringRecord(
  JSON.parse(readFileSync(join(packageRoot, 'test/visual/environment.json'), 'utf8')),
  'visual environment',
);
const mode = process.argv[2];
if (!['check', 'update'].includes(mode) || process.argv.length !== 3) {
  throw new Error('Usage: node bin/visual.ts check|update (no arbitrary Playwright overrides)');
}
if (mode === 'update' && process.env.CI) throw new Error('CI may compare baselines, but must never update them.');
const baseline = join(packageRoot, 'test/e2e/__screenshots__');
const artifacts = join(packageRoot, 'test-results/visual');
if (mode === 'check' && !existsSync(join(baseline, 'manifest.json')))
  throw new Error('Reviewed screenshot manifest is missing.');
mkdirSync(baseline, { recursive: true });
mkdirSync(artifacts, { recursive: true });
const temp = mkdtempSync(join(tmpdir(), 'ranui-visual-'));
const candidates = mode === 'update' ? mkdtempSync(join(artifacts, 'candidates-')) : baseline;
function run(args: string[]) {
  const result = spawnSync('docker', args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Visual container command failed (${result.status})`);
}
try {
  const pnpm = text(
    object(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))).packageManager,
    'packageManager',
  ).replace('pnpm@', '');
  const iid = join(temp, 'image-id');
  // CI opts into BuildKit's GitHub Actions cache so the dependency-install layer, keyed by
  // the lockfile, is reused across runs. Local runs build with the plain daemon.
  const cache =
    process.env.RANUI_VISUAL_CACHE === 'gha'
      ? [
          'buildx',
          'build',
          '--load',
          '--cache-from',
          'type=gha,scope=ranui-visual',
          '--cache-to',
          'type=gha,mode=max,scope=ranui-visual',
        ]
      : ['build'];
  run([
    ...cache,
    '--platform',
    environment.platform,
    '--file',
    'packages/ranui/test/visual/Dockerfile',
    '--build-arg',
    `PLAYWRIGHT_IMAGE=${environment.image}`,
    '--build-arg',
    `PNPM_VERSION=${pnpm}`,
    '--iidfile',
    iid,
    '.',
  ]);
  const image = readFileSync(iid, 'utf8').trim();
  run([
    'run',
    '--rm',
    '--init',
    '--ipc=host',
    '--platform',
    environment.platform,
    '--mount',
    `type=bind,source=${candidates},target=/workspace/packages/ranui/test/e2e/__screenshots__`,
    '--mount',
    `type=bind,source=${artifacts},target=/workspace/packages/ranui/test-results/visual`,
    '--env',
    `RANUI_VISUAL_IMAGE=${environment.image}`,
    '--env',
    `RANUI_VISUAL_UPDATE=${mode === 'update' ? '1' : '0'}`,
    image,
    'pnpm',
    'exec',
    'playwright',
    'test',
    '--config=playwright.visual.config.ts',
    `--update-snapshots=${mode === 'update' ? 'all' : 'none'}`,
  ]);
  if (mode === 'update') {
    const files = readdirSync(join(candidates, 'linux-arm64'), { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.png'))
      .sort();
    const snapshots = Object.fromEntries(
      files.map((file) => [
        file.replaceAll('\\', '/'),
        createHash('sha256')
          .update(readFileSync(join(candidates, 'linux-arm64', file)))
          .digest('hex'),
      ]),
    );
    const metadata = {
      environment: object(
        JSON.parse(readFileSync(join(artifacts, 'environment.json'), 'utf8')),
        'captured environment',
      ),
      image,
      snapshots,
    };
    writeFileSync(join(candidates, 'manifest.json'), JSON.stringify(metadata, null, 2) + '\n');
    // A failed generation leaves reviewed baselines intact. Successful replacement
    // starts from an empty candidate directory, so removed tests leave no orphans.
    const previous = join(artifacts, `previous-${Date.now()}`);
    renameSync(baseline, previous);
    try {
      renameSync(candidates, baseline);
    } catch (error) {
      renameSync(previous, baseline);
      throw error;
    }
    rmSync(previous, { recursive: true });
    console.log(`Generated ${files.length} candidate baselines. Review every image before committing.`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
