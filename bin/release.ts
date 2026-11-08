import { object, packageManifest, hasErrorCode } from './tooling-json.ts';
import type { PackageManifest } from './tooling-json.ts';
import { releaseReceipt } from './release-types.ts';
import type { ReleaseIdentity, ReleaseArchive, ReleaseReceipt } from './release-types.ts';
/** Prepare, verify and publish library tarballs (any non-empty subset), in dependency order. */
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
] as const;

export type ReleasePackageName = (typeof RELEASE_PACKAGES)[number]['name'];

export type ReleasePlanOptions = {
  tag?: string;
  /** Explicit package names; omit to use the full allowlist (or unpublished-only with registry). */
  packages?: readonly string[];
  /** When true, drop versions already on npm and require unpublished upstream deps. */
  registry?: boolean;
  request?: (url: string, init?: RequestInit) => Promise<Response>;
  nodeVersion?: string;
};

const registry = 'https://registry.npmjs.org/';
const json = async (path: string): Promise<unknown> => JSON.parse(await readFile(path, 'utf8'));
const digest = (bytes: Uint8Array) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
const archiveName = (directory: string, version: string) => `${directory}-${version}.tgz`;
const command = (name: string, args: string[], cwd = ROOT) => execFileSync(name, args, { cwd, stdio: 'inherit' });
const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

const INTERNAL_DEPS: Record<ReleasePackageName, readonly ReleasePackageName[]> = {
  ranuts: [],
  '@alixex/ranview': ['ranuts'],
  ranui: ['ranuts', '@alixex/ranview'],
};

export function parsePackageSelection(value?: string): string[] | undefined {
  if (value === undefined || value.trim() === '' || value.trim() === 'all') return undefined;
  const names = value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  assert.ok(names.length > 0, 'Package selection must name at least one library');
  return names;
}

function packageIndex(name: string) {
  const index = RELEASE_PACKAGES.findIndex((pkg) => pkg.name === name);
  assert.ok(index >= 0, `Unknown release package: ${name}`);
  return index;
}

function directoryFor(name: string) {
  return RELEASE_PACKAGES[packageIndex(name)].directory;
}

export function validatePlan(
  values: readonly unknown[],
  {
    tag,
    nodeVersion = process.versions.node,
    allowlist = values,
  }: { tag?: string; nodeVersion?: string; allowlist?: readonly unknown[] } = {},
) {
  assert.ok(Number(nodeVersion.split('.')[0]) >= 24, 'Release tooling requires Node 24 or newer');
  assert.ok(values.length >= 1 && values.length <= 3, 'Release one to three libraries');
  const selected = values.map(packageManifest);
  const libraries = allowlist.map(packageManifest);
  assert.equal(libraries.length, 3, 'Allowlist must be the three libraries');
  for (const [index, manifest] of libraries.entries()) {
    assert.equal(manifest.name, RELEASE_PACKAGES[index].name, 'Unexpected release package or dependency order');
    assert.equal(manifest.engines?.node, '>=24.0.0', `${manifest.name}: engines must be >=24.0.0`);
    for (const dependency of INTERNAL_DEPS[manifest.name as ReleasePackageName]) {
      assert.equal(
        manifest.dependencies?.[dependency],
        'workspace:*',
        `${manifest.name}: use workspace:* for ${dependency}`,
      );
    }
  }

  const selectedNames = new Set<string>();
  let previousIndex = -1;
  for (const manifest of selected) {
    const index = packageIndex(manifest.name);
    assert.ok(index > previousIndex, 'Release packages must stay in dependency order');
    previousIndex = index;
    assert.equal(
      libraries[index].version,
      manifest.version,
      `${manifest.name}: selected version must match the workspace`,
    );
    const version = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta|rc)\.(0|[1-9]\d*))?$/.exec(
      manifest.version,
    );
    assert.ok(version, `${manifest.name}: invalid release version`);
    assert.equal(tag, version[4] ?? 'latest', `${manifest.name}: tag must match the version channel`);
    selectedNames.add(manifest.name);
  }

  for (const manifest of selected) {
    for (const dependency of INTERNAL_DEPS[manifest.name as ReleasePackageName]) {
      assert.ok(
        selectedNames.has(dependency) || libraries.some((pkg) => pkg.name === dependency),
        `${dependency} must exist in the workspace before ${manifest.name}`,
      );
    }
  }
  return selected;
}

export async function currentTag(root = ROOT) {
  const pkg = packageManifest(await json(join(root, 'packages/ranui/package.json')));
  return /-(alpha|beta|rc)\.\d+$/.exec(pkg.version)?.[1] ?? 'latest';
}

export async function readLibraryManifests(root = ROOT) {
  return Promise.all(
    RELEASE_PACKAGES.map(async (pkg) =>
      packageManifest(await json(join(root, 'packages', pkg.directory, 'package.json'))),
    ),
  );
}

async function assertWorkspaceEngines(root: string) {
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
}

function pickPackages(libraries: PackageManifest[], names: readonly string[]) {
  const unique = new Set(names);
  assert.equal(unique.size, names.length, 'Duplicate package in selection');
  for (const name of names) packageIndex(name);
  const selected = libraries.filter((pkg) => unique.has(pkg.name));
  assert.equal(selected.length, unique.size, 'Unknown release package in selection');
  return selected;
}

/** A network/auth failure is never evidence that a version is available. */
export async function checkRegistry(
  plan: readonly ReleaseIdentity[],
  {
    request = fetch,
    resume = false,
  }: { request?: (url: string, init?: RequestInit) => Promise<Response>; resume?: boolean } = {},
) {
  const existing = new Set<string>();
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

async function assertUpstreamPublished(
  selected: readonly PackageManifest[],
  libraries: readonly PackageManifest[],
  request: (url: string, init?: RequestInit) => Promise<Response>,
) {
  const selectedNames = new Set(selected.map((pkg) => pkg.name));
  const libraryByName = new Map(libraries.map((pkg) => [pkg.name, pkg]));
  for (const manifest of selected) {
    for (const dependency of INTERNAL_DEPS[manifest.name as ReleasePackageName]) {
      if (selectedNames.has(dependency)) continue;
      const upstream = libraryByName.get(dependency);
      assert.ok(upstream, `${dependency} missing from workspace`);
      const response = await request(`${registry}${encodeURIComponent(dependency)}/${upstream.version}`, {
        signal: AbortSignal.timeout(20000),
      });
      assert.ok(
        response.ok,
        `${dependency}@${upstream.version} must already be on npm before releasing ${manifest.name} alone (HTTP ${response.status})`,
      );
    }
  }
}

export async function readPlan(root = ROOT, tagOrOptions?: string | ReleasePlanOptions) {
  const options: ReleasePlanOptions =
    typeof tagOrOptions === 'string' || tagOrOptions === undefined ? { tag: tagOrOptions } : tagOrOptions;
  const tag = options.tag ?? (await currentTag(root));
  await assertWorkspaceEngines(root);
  const libraries = await readLibraryManifests(root);
  for (const pkg of libraries) {
    assert.equal(pkg.scripts?.prepack, 'pnpm run build', `${pkg.name}: prepack must build the package`);
    assert.ok(!pkg.scripts.prepublish && !pkg.scripts.prepublishOnly, `${pkg.name}: use one prepack build lifecycle`);
  }

  let selected = options.packages ? pickPackages(libraries, options.packages) : libraries;
  if (options.registry) {
    const request = options.request ?? fetch;
    const unpublished: PackageManifest[] = [];
    for (const pkg of selected) {
      const response = await request(`${registry}${encodeURIComponent(pkg.name)}/${pkg.version}`, {
        signal: AbortSignal.timeout(20000),
      });
      if (response.status === 404) {
        unpublished.push(pkg);
        continue;
      }
      assert.ok(response.ok, `Registry check failed for ${pkg.name}: HTTP ${response.status}`);
    }
    assert.ok(
      unpublished.length > 0,
      options.packages
        ? 'Nothing to release; every selected version is already on npm'
        : 'Nothing to release; ranuts, @alixex/ranview and ranui are already on npm at the workspace versions',
    );
    selected = unpublished;
    await assertUpstreamPublished(selected, libraries, request);
  }

  return validatePlan(selected, { tag, nodeVersion: options.nodeVersion, allowlist: libraries });
}

export async function readPlanFromReceipt(root: string, receipt: ReleaseReceipt, tag: string) {
  const libraries = await readLibraryManifests(root);
  const selected = receipt.packages.map((pkg) => {
    const workspace = libraries.find((entry) => entry.name === pkg.name);
    assert.ok(workspace, `Receipt package ${pkg.name} is not a release library`);
    assert.equal(workspace.version, pkg.version, `${pkg.name}: receipt version differs from the workspace`);
    return workspace;
  });
  return validatePlan(selected, { tag, allowlist: libraries });
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
  assert.equal(receipt.packages?.length, plan.length, 'Artifact receipt package count differs from the release plan');
  for (const [index, pkg] of receipt.packages.entries()) {
    assert.equal(pkg.name, plan[index].name, 'Artifact package/order differs from the release plan');
    assert.equal(pkg.version, plan[index].version, 'Artifact version differs from the release plan');
    assert.equal(pkg.archive, archiveName(directoryFor(pkg.name), pkg.version), 'Unexpected archive path');
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
  libraries: readonly ReleaseIdentity[],
) {
  assert.equal(packed.name, source.name);
  assert.equal(packed.version, source.version);
  assert.equal(packed.engines?.node, '>=24.0.0');
  assert.equal(packed.type, 'module');
  for (const dependency of libraries) {
    if (source.dependencies?.[dependency.name])
      assert.equal(packed.dependencies?.[dependency.name], dependency.version);
  }
  assert.ok(
    !JSON.stringify(packed.dependencies ?? {}).includes('workspace:'),
    'Unresolved workspace dependency in tarball',
  );
}

export async function prepare(tagOrOptions?: string | ReleasePlanOptions) {
  const options: ReleasePlanOptions =
    typeof tagOrOptions === 'string' || tagOrOptions === undefined ? { tag: tagOrOptions } : tagOrOptions;
  const commit = git('rev-parse', 'HEAD');
  const cleanBefore = git('status', '--porcelain') === '';
  const tag = options.tag ?? (await currentTag());
  const libraries = await readLibraryManifests(ROOT);
  const plan = await readPlan(ROOT, { ...options, tag });
  const directory = join(ROOT, '.release');
  await mkdir(directory, { recursive: true });
  assert.ok(!(await lstat(directory)).isSymbolicLink(), 'Artifact directory must not be a symlink');

  const selectedNames = new Set(plan.map((pkg) => pkg.name));
  const lastIndex = Math.max(...plan.map((pkg) => packageIndex(pkg.name)));
  const packages = [];
  for (const [index, source] of RELEASE_PACKAGES.entries()) {
    if (index > lastIndex) break;
    const workspace = libraries[index];
    if (!selectedNames.has(source.name)) {
      // Upstream of a selected package: build so pack can resolve workspace dist.
      command('pnpm', ['run', 'build'], join(ROOT, 'packages', source.directory));
      continue;
    }
    const archive = archiveName(source.directory, workspace.version);
    const path = join(directory, archive);
    try {
      assert.ok((await lstat(path)).isFile(), 'Archive output must be a regular file');
    } catch (error) {
      if (!hasErrorCode(error, 'ENOENT')) throw error;
    }
    // prepack builds each selected package exactly once, after its local dependencies.
    command('pnpm', ['pack', '--out', path], join(ROOT, 'packages', source.directory));
    const packed = packageManifest(
      JSON.parse(execFileSync('tar', ['-xOf', path, 'package/package.json'], { encoding: 'utf8' })),
    );
    verifyPackedManifest(packed, workspace, libraries);
    const entries = execFileSync('tar', ['-tzf', path], { encoding: 'utf8' }).split('\n');
    for (const entry of ['package/dist/index.js', 'package/dist/index.d.ts'])
      assert.ok(entries.includes(entry), `Missing ${entry}`);
    assert.ok(!entries.some((entry) => /\.(?:cjs|cts)(?:\.map)?$/.test(entry)), 'CommonJS artifact in release');
    packages.push({
      name: workspace.name,
      version: workspace.version,
      archive,
      integrity: digest(await readFile(path)),
    });
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
  packages,
}: { tag?: string; dryRun?: boolean; confirm?: boolean; packages?: readonly string[] } = {}) {
  tag ??= await currentTag();
  const directory = join(ROOT, '.release');
  const receipt = releaseReceipt(await json(join(directory, 'release.json')));
  if (packages) {
    const libraries = await readLibraryManifests(ROOT);
    assert.deepEqual(
      receipt.packages.map((pkg) => pkg.name),
      pickPackages(libraries, packages).map((pkg) => pkg.name),
      'Package selection differs from the prepared receipt',
    );
  }
  const plan = await readPlanFromReceipt(ROOT, receipt, tag);
  await verifyArtifacts(directory, plan, tag, { requireVerification: true });
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
    options: {
      tag: { type: 'string' },
      registry: { type: 'boolean' },
      confirm: { type: 'boolean' },
      packages: { type: 'string' },
    },
  });
  const tag = values.tag ?? (await currentTag());
  assert.ok(tag && ['alpha', 'beta', 'rc', 'latest'].includes(tag), 'Invalid release tag');
  const packages = parsePackageSelection(values.packages);
  const planOptions: ReleasePlanOptions = { tag, packages, registry: values.registry };
  if (action === 'check') {
    const plan = await readPlan(ROOT, planOptions);
    console.log(
      JSON.stringify(
        { tag, node: '>=24.0.0', packages: plan.map(({ name, version }) => ({ name, version })) },
        null,
        2,
      ),
    );
  } else if (action === 'prepare') await prepare(planOptions);
  else if (action === 'dry-run' || action === 'publish')
    await publish({ tag, dryRun: action === 'dry-run', confirm: values.confirm, packages });
  else throw new Error('Use check, prepare, dry-run or publish');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
