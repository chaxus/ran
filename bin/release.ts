import { object, packageManifest, hasErrorCode } from './tooling-json.ts';
import type { PackageManifest } from './tooling-json.ts';
import { releaseReceipt } from './release-types.ts';
import type { ReleaseIdentity, ReleaseArchive } from './release-types.ts';
/** Prepare, verify and publish the three library tarballs, in dependency order. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const RELEASE_PACKAGES = [
  { directory: 'ranuts', name: 'ranuts' },
  { directory: 'ranview', name: '@alixex/ranview' },
  { directory: 'ranui', name: 'ranui' },
];
const registry = 'https://registry.npmjs.org/';
const json = async (path: string): Promise<unknown> => JSON.parse(await readFile(path, 'utf8'));
const digest = (bytes: Uint8Array) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
const archiveName = (directory: string, version: string) => `${directory}-${version}.tgz`;
const command = (name: string, args: string[], cwd = ROOT) => execFileSync(name, args, { cwd, stdio: 'inherit' });
const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

export function validatePlan(
  values: readonly unknown[],
  { tag, nodeVersion = process.versions.node }: { tag?: string; nodeVersion?: string } = {},
) {
  assert.ok(Number(nodeVersion.split('.')[0]) >= 24, 'Release tooling requires Node 24 or newer');
  assert.equal(values.length, 3, 'Release exactly the three libraries');
  const manifests = values.map(packageManifest);
  const seen = new Set();
  for (const [index, manifest] of manifests.entries()) {
    assert.equal(manifest.name, RELEASE_PACKAGES[index].name, 'Unexpected release package or dependency order');
    assert.equal(manifest.engines?.node, '>=24.0.0', `${manifest.name}: engines must be >=24.0.0`);
    const version = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.(0|[1-9]\d*))?$/.exec(
      manifest.version,
    );
    assert.ok(version, `${manifest.name}: invalid release version`);
    assert.equal(tag, version[4] ?? 'latest', `${manifest.name}: tag must match the version channel`);
    const dependencies = index === 0 ? [] : index === 1 ? ['ranuts'] : ['ranuts', '@alixex/ranview'];
    for (const dependency of dependencies) {
      assert.ok(seen.has(dependency), `${dependency} must be released first`);
      assert.equal(
        manifest.dependencies?.[dependency],
        'workspace:*',
        `${manifest.name}: use workspace:* for ${dependency}`,
      );
    }
    seen.add(manifest.name);
  }
  return manifests;
}

export async function currentTag(root = ROOT) {
  const pkg = packageManifest(await json(join(root, 'packages/ranui/package.json')));
  return /-(alpha|beta|rc)\.\d+$/.exec(pkg.version)?.[1] ?? 'latest';
}

export async function readPlan(root = ROOT, tag?: string) {
  const workspace = [packageManifest(await json(join(root, 'package.json')))];
  for (const entry of await readdir(join(root, 'packages'), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'node_modules') continue;
    try {
      workspace.push(packageManifest(await json(join(root, 'packages', entry.name, 'package.json'))));
    } catch (error) {
      if (!hasErrorCode(error, 'ENOENT')) throw error;
    }
  }
  for (const pkg of workspace) assert.equal(pkg.engines?.node, '>=24.0.0', `${pkg.name}: engines must be >=24.0.0`);
  const manifests = await Promise.all(
    RELEASE_PACKAGES.map(async (pkg) =>
      packageManifest(await json(join(root, 'packages', pkg.directory, 'package.json'))),
    ),
  );
  for (const pkg of manifests) {
    assert.equal(pkg.scripts?.prepack, 'pnpm run build', `${pkg.name}: prepack must build the package`);
    assert.ok(!pkg.scripts.prepublish && !pkg.scripts.prepublishOnly, `${pkg.name}: use one prepack build lifecycle`);
  }
  return validatePlan(manifests, { tag: tag ?? (await currentTag(root)) });
}

/** A network/auth failure is never evidence that a version is available. */
export async function checkRegistry(
  plan: readonly ReleaseIdentity[],
  {
    request = fetch,
    resume = false,
  }: { request?: (url: string, init?: RequestInit) => Promise<Response>; resume?: boolean } = {},
) {
  const existing = new Set();
  for (const pkg of plan) {
    const response = await request(`${registry}${encodeURIComponent(pkg.name)}/${pkg.version}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (response.status === 404) continue;
    assert.ok(response.ok, `Registry check failed for ${pkg.name}: HTTP ${response.status}`);
    assert.ok(resume, `${pkg.name}@${pkg.version} is already published; choose a new version`);
    const published = object(await response.json(), 'registry metadata');
    const dist = published.dist === undefined ? {} : object(published.dist, 'registry dist');
    assert.ok(
      pkg.integrity && dist.integrity === pkg.integrity,
      `${pkg.name}: published integrity differs from the verified archive`,
    );
    existing.add(pkg.name);
  }
  return existing;
}

export async function verifyArtifacts(
  directory: string,
  plan: readonly ReleaseIdentity[],
  tag: string,
  { requireVerification = false } = {},
) {
  assert.ok(!(await lstat(directory)).isSymbolicLink(), 'Artifact directory must not be a symlink');
  const receipt = releaseReceipt(await json(join(directory, 'release.json')));
  assert.equal(receipt.tag, tag, 'Artifact tag differs from the release plan');
  assert.equal(receipt.packages?.length, 3, 'Artifact receipt must contain three libraries');
  for (const [index, pkg] of receipt.packages.entries()) {
    assert.equal(pkg.name, plan[index].name, 'Artifact package/order differs from the release plan');
    assert.equal(pkg.version, plan[index].version, 'Artifact version differs from the release plan');
    assert.equal(pkg.archive, archiveName(RELEASE_PACKAGES[index].directory, pkg.version), 'Unexpected archive path');
    const file = join(directory, pkg.archive);
    assert.ok(
      (await lstat(file)).isFile() && !(await lstat(file)).isSymbolicLink(),
      'Artifact must be a regular archive',
    );
    assert.equal(digest(await readFile(file)), pkg.integrity, `${pkg.name}: artifact integrity mismatch`);
  }
  if (requireVerification) {
    const verified = object(
      await json(join(directory, 'verified.json')).catch(() => {
        throw new Error('Run verify:release before publishing these archives');
      }),
    );
    assert.deepEqual(verified.artifacts, receipt, 'Verification belongs to different release artifacts');
  }
  return receipt;
}

export function verifyPackedManifest(
  packed: PackageManifest,
  source: PackageManifest,
  plan: readonly ReleaseIdentity[],
) {
  assert.equal(packed.name, source.name);
  assert.equal(packed.version, source.version);
  assert.equal(packed.engines?.node, '>=24.0.0');
  assert.equal(packed.type, 'module');
  for (const dependency of plan) {
    if (source.dependencies?.[dependency.name])
      assert.equal(packed.dependencies?.[dependency.name], dependency.version);
  }
  assert.ok(
    !JSON.stringify(packed.dependencies ?? {}).includes('workspace:'),
    'Unresolved workspace dependency in tarball',
  );
}

export async function prepare(tag?: string) {
  const commit = git('rev-parse', 'HEAD');
  const cleanBefore = git('status', '--porcelain') === '';
  tag ??= await currentTag();
  const plan = await readPlan(ROOT, tag);
  const directory = join(ROOT, '.release');
  await mkdir(directory, { recursive: true });
  assert.ok(!(await lstat(directory)).isSymbolicLink(), 'Artifact directory must not be a symlink');
  const packages = [];
  for (const [index, pkg] of plan.entries()) {
    const source = RELEASE_PACKAGES[index];
    const archive = archiveName(source.directory, pkg.version);
    const path = join(directory, archive);
    try {
      assert.ok((await lstat(path)).isFile(), 'Archive output must be a regular file');
    } catch (error) {
      if (!hasErrorCode(error, 'ENOENT')) throw error;
    }
    // prepack builds each package exactly once, after its local dependencies.
    command('pnpm', ['pack', '--out', path], join(ROOT, 'packages', source.directory));
    const packed = packageManifest(
      JSON.parse(execFileSync('tar', ['-xOf', path, 'package/package.json'], { encoding: 'utf8' })),
    );
    verifyPackedManifest(packed, pkg, plan);
    const entries = execFileSync('tar', ['-tzf', path], { encoding: 'utf8' }).split('\n');
    for (const entry of ['package/dist/index.js', 'package/dist/index.d.ts'])
      assert.ok(entries.includes(entry), `Missing ${entry}`);
    assert.ok(!entries.some((entry) => /\.(?:cjs|cts)(?:\.map)?$/.test(entry)), 'CommonJS artifact in release');
    packages.push({ name: pkg.name, version: pkg.version, archive, integrity: digest(await readFile(path)) });
  }
  assert.equal(git('rev-parse', 'HEAD'), commit, 'Source commit changed during preparation');
  const preparedFromCleanCheckout = cleanBefore && git('status', '--porcelain') === '';
  const receipt = { commit, preparedFromCleanCheckout, tag, packages };
  await writeFile(join(directory, 'release.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`Prepared ${packages.length} verified archives in .release/ for tag ${tag}`);
}

export function assertPublication({
  confirm,
  preparedClean,
  commit,
  head,
  dirty,
  branch,
  ciRef,
}: {
  confirm: boolean;
  preparedClean?: boolean;
  commit?: string;
  head: string;
  dirty: string;
  branch: string;
  ciRef?: string;
}) {
  assert.ok(confirm, 'Actual npm publication requires --confirm');
  assert.equal(preparedClean, true, 'Publication requires archives prepared from a clean checkout');
  assert.equal(commit, head, 'Archives belong to a different source commit');
  assert.equal(dirty, '', 'Publication requires a clean checkout');
  assert.ok(branch === 'main' || ciRef === 'refs/heads/main', 'Publish only from main');
}

export async function publish({
  tag,
  dryRun = true,
  confirm = false,
}: { tag?: string; dryRun?: boolean; confirm?: boolean } = {}) {
  tag ??= await currentTag();
  const plan = await readPlan(ROOT, tag);
  const directory = join(ROOT, '.release');
  const receipt = await verifyArtifacts(directory, plan, tag, { requireVerification: true });
  if (!dryRun) {
    assertPublication({
      confirm,
      preparedClean: receipt.preparedFromCleanCheckout,
      commit: receipt.commit,
      head: git('rev-parse', 'HEAD'),
      dirty: git('status', '--porcelain'),
      branch: git('branch', '--show-current'),
      ciRef: process.env.GITHUB_ACTIONS === 'true' ? process.env.GITHUB_REF : undefined,
    });
  }
  const existing = await checkRegistry(receipt.packages, { resume: !dryRun });
  const completed: (ReleaseArchive & { status: string })[] = [];
  try {
    for (const pkg of receipt.packages) {
      if (existing.has(pkg.name)) {
        completed.push({ ...pkg, status: 'already-published-identical' });
        continue;
      }
      const args = [
        'publish',
        join(directory, pkg.archive),
        '--ignore-scripts',
        '--access',
        'public',
        '--tag',
        tag,
        '--registry=https://registry.npmjs.org/',
      ];
      args.push(dryRun ? '--dry-run' : '--provenance');
      command('npm', args);
      completed.push({ ...pkg, status: dryRun ? 'dry-run' : 'published' });
    }
  } finally {
    await writeFile(
      join(directory, dryRun ? 'dry-run.json' : 'published.json'),
      `${JSON.stringify({ commit: receipt.commit, tag, packages: completed }, null, 2)}\n`,
    );
  }
}

async function main() {
  const [action = 'check', ...args] = process.argv.slice(2);
  const { values } = parseArgs({
    args,
    options: { tag: { type: 'string' }, registry: { type: 'boolean' }, confirm: { type: 'boolean' } },
  });
  const tag = values.tag ?? (await currentTag());
  assert.ok(tag && ['alpha', 'beta', 'rc', 'latest'].includes(tag), 'Invalid release tag');
  if (action === 'check') {
    const plan = await readPlan(ROOT, tag);
    if (values.registry) await checkRegistry(plan);
    console.log(
      JSON.stringify(
        { tag, node: '>=24.0.0', packages: plan.map(({ name, version }) => ({ name, version })) },
        null,
        2,
      ),
    );
  } else if (action === 'prepare') await prepare(tag);
  else if (action === 'dry-run' || action === 'publish')
    await publish({ tag, dryRun: action === 'dry-run', confirm: values.confirm });
  else throw new Error('Use check, prepare, dry-run or publish');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
