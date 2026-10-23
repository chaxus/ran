import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  assertPublication,
  validatePlan,
  checkRegistry,
  verifyArtifacts,
  verifyPackedManifest,
  RELEASE_PACKAGES,
} from '../release.ts';

const manifests = (): {
  name: string;
  version: string;
  engines: { node: string };
  dependencies: Record<string, string>;
}[] => [
  { name: 'ranuts', version: '0.5.0-rc.0', engines: { node: '>=24.0.0' }, dependencies: {} },
  {
    name: '@alixex/ranview',
    version: '0.2.0-rc.0',
    engines: { node: '>=24.0.0' },
    dependencies: { ranuts: 'workspace:*' },
  },
  {
    name: 'ranui',
    version: '0.5.0-rc.0',
    engines: { node: '>=24.0.0' },
    dependencies: { ranuts: 'workspace:*', '@alixex/ranview': 'workspace:*' },
  },
];

test('releases only the three libraries in dependency order', () => {
  assert.deepEqual(
    RELEASE_PACKAGES.map((p) => p.name),
    manifests().map((p) => p.name),
  );
  assert.equal(validatePlan(manifests(), { tag: 'rc', nodeVersion: '24.0.0' }).length, 3);
});

test('rejects unsupported runtime, drifting engines and missing workspace dependencies', () => {
  assert.throws(() => validatePlan(manifests(), { tag: 'rc', nodeVersion: '23.11.0' }), /Node 24/);
  const engines = manifests();
  engines[2].engines.node = '>=20.19.0';
  assert.throws(() => validatePlan(engines, { tag: 'rc' }), /engines/);
  const dependencies = manifests();
  dependencies[2].dependencies.ranuts = '0.4.1-alpha.2';
  assert.throws(() => validatePlan(dependencies, { tag: 'rc' }), /workspace/);
});

test('requires an explicit matching channel and rejects unsafe versions or extra packages', () => {
  assert.throws(() => validatePlan(manifests(), { tag: 'latest' }), /tag/);
  assert.throws(() => validatePlan(manifests(), { tag: 'beta' }), /tag/);
  const mixed = manifests();
  mixed[1].version = '0.2.0-beta.0';
  assert.throws(() => validatePlan(mixed, { tag: 'rc' }), /tag/);
  const invalid = manifests();
  invalid[0].version = '../escape';
  assert.throws(() => validatePlan(invalid, { tag: 'rc' }), /version/);
  assert.throws(() => validatePlan([...manifests(), { name: 'docs' }], { tag: 'rc' }), /three/);
  const stable = manifests().map((p) => ({ ...p, version: p.version.replace('-rc.0', '') }));
  assert.equal(validatePlan(stable, { tag: 'latest' }).length, 3);
});

test('registry preflight accepts only explicit 404s as unpublished versions', async () => {
  const calls: string[] = [];
  await checkRegistry(manifests(), {
    request: async (url) => {
      calls.push(url);
      return new Response('', { status: 404 });
    },
  });
  assert.equal(calls.length, 3);
  assert.ok(calls.some((url) => url.includes('%40alixex%2Franview')));
  for (const status of [200, 401, 403, 429, 500]) {
    await assert.rejects(
      checkRegistry(manifests(), { request: async () => new Response('{}', { status }) }),
      /published|registry/i,
    );
  }
  await assert.rejects(
    checkRegistry(manifests(), {
      request: async () => {
        throw new Error('offline');
      },
    }),
    /offline/,
  );
});

test('publish retries skip only archives whose registry integrity matches exactly', async () => {
  const plan = manifests().map((p) => ({ ...p, integrity: 'sha512-expected' }));
  const existing = await checkRegistry(plan, {
    resume: true,
    request: async () => Response.json({ dist: { integrity: 'sha512-expected' } }),
  });
  assert.equal(existing.size, 3);
  await assert.rejects(
    checkRegistry(plan, { resume: true, request: async () => Response.json({ dist: { integrity: 'sha512-other' } }) }),
    /integrity/,
  );
});

test('artifact verification rejects missing or changed bytes and unexpected paths', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'ran-release-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const { createHash } = await import('node:crypto');
  const plan = manifests();
  const packages = [];
  for (const [index, manifest] of plan.entries()) {
    const archive = `${RELEASE_PACKAGES[index].directory}-${manifest.version}.tgz`;
    const bytes = Buffer.from(manifest.name);
    await writeFile(join(root, archive), bytes);
    packages.push({
      name: manifest.name,
      version: manifest.version,
      archive,
      integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
    });
  }
  const receipt = { tag: 'rc', packages };
  await writeFile(join(root, 'release.json'), JSON.stringify(receipt));
  assert.equal((await verifyArtifacts(root, plan, 'rc')).packages.length, 3);
  const first = join(root, packages[0].archive);
  const original = await readFile(first);
  await writeFile(first, 'modified');
  await assert.rejects(verifyArtifacts(root, plan, 'rc'), /integrity/);
  await writeFile(first, original);
  await rm(first);
  await assert.rejects(verifyArtifacts(root, plan, 'rc'), /ENOENT/);
  await writeFile(first, original);
  await assert.rejects(verifyArtifacts(root, plan, 'rc', { requireVerification: true }), /verify:release/);
  await writeFile(join(root, 'verified.json'), JSON.stringify({ artifacts: receipt }));
  await verifyArtifacts(root, plan, 'rc', { requireVerification: true });
  await writeFile(join(root, 'verified.json'), JSON.stringify({ artifacts: { ...receipt, tag: 'latest' } }));
  await assert.rejects(verifyArtifacts(root, plan, 'rc', { requireVerification: true }), /different release/);
  packages[0].archive = '../outside.tgz';
  await writeFile(join(root, 'release.json'), JSON.stringify(receipt));
  await assert.rejects(verifyArtifacts(root, plan, 'rc'), /archive/);
});

test('the repository declares one Node baseline, channel and build lifecycle', async () => {
  const { readPlan } = await import('../release.ts');
  const plan = await readPlan();
  assert.deepEqual(
    plan.map((p) => p.name),
    RELEASE_PACKAGES.map((p) => p.name),
  );
});

test('packed internal dependencies must resolve to the coordinated release versions', () => {
  const plan = manifests();
  const packed = {
    ...plan[2],
    type: 'module',
    dependencies: { ranuts: plan[0].version, '@alixex/ranview': plan[1].version },
  };
  verifyPackedManifest(packed, plan[2], plan);
  for (const version of ['workspace:*', '0.4.1-alpha.2']) {
    assert.throws(() =>
      verifyPackedManifest({ ...packed, dependencies: { ...packed.dependencies, ranuts: version } }, plan[2], plan),
    );
  }
});

test('actual uploads require explicit intent, a clean main checkout and the original source commit', () => {
  const source = { confirm: true, preparedClean: true, commit: 'abc', head: 'abc', dirty: '', branch: 'main' };
  assertPublication(source);
  assertPublication({ ...source, branch: '', ciRef: 'refs/heads/main' });
  for (const changed of [
    { confirm: false },
    { preparedClean: false },
    { preparedClean: undefined },
    { head: 'other' },
    { dirty: ' M package.json' },
    { branch: 'codex/reliability-fixes' },
  ]) {
    assert.throws(() => assertPublication({ ...source, ...changed }));
  }
});
