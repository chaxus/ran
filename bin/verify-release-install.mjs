/** Install verified tarballs with npm outside the workspace, without dependency symlinks. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { currentTag, readPlan, ROOT, verifyArtifacts } from './release.mjs';
import { assertSizeBudgets, measureInstallation } from './package-size.mjs';

const tag = process.argv[2] ?? (await currentTag());
const plan = await readPlan(ROOT, tag);
const artifacts = join(ROOT, '.release');
const receipt = await verifyArtifacts(artifacts, plan, tag);
const fixture = await mkdtemp(join(tmpdir(), 'ran-release-install-'));
const run = (name, args) => execFileSync(name, args, { cwd: fixture, stdio: 'pipe', timeout: 300000 });
try {
  await writeFile(join(fixture, 'package.json'), '{"name":"ran-release-consumer","private":true,"type":"module"}');
  run('npm', [
    'install',
    '--ignore-scripts',
    '--omit=dev',
    '--engine-strict',
    '--no-audit',
    '--no-fund',
    '--package-lock=false',
    '--workspaces=false',
    '--registry=https://registry.npmjs.org/',
    ...receipt.packages.map((pkg) => join(artifacts, pkg.archive)),
  ]);
  const sizes = await measureInstallation(fixture, artifacts, receipt);
  await writeFile(join(artifacts, 'size-report.json'), `${JSON.stringify(sizes, null, 2)}\n`);
  assertSizeBudgets(sizes, JSON.parse(await readFile(join(ROOT, 'bin/package-size-budgets.json'), 'utf8')));
  console.log(
    `Production installation: ${sizes.installation.bytes} bytes in ${sizes.installation.files} files (size budgets passed)`,
  );
  const imports = [];
  for (const pkg of plan) {
    const installed = join(fixture, 'node_modules', pkg.name);
    assert.ok(
      (await realpath(installed)).startsWith(await realpath(fixture)),
      'Installed package escaped the isolated fixture',
    );
    const manifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
    assert.equal(manifest.version, pkg.version);
    assert.equal(manifest.engines.node, '>=24.0.0');
    if (pkg.name === 'ranuts') {
      const license = await readFile(join(installed, 'dist/third-party/jschardet/LICENSE.txt'), 'utf8');
      const notice = await readFile(join(installed, 'dist/third-party/jschardet/NOTICE.txt'), 'utf8');
      const dependency = JSON.parse(await readFile(join(fixture, 'node_modules/jschardet/package.json'), 'utf8'));
      assert.equal(license, await readFile(join(fixture, 'node_modules/jschardet/LICENSE'), 'utf8'));
      assert.ok(notice.includes(`jschardet@${dependency.version}`));
      assert.ok(notice.includes('Netscape Communications Corporation'));
      for (const name of ['index', 'utils']) {
        const bundle = await readFile(join(installed, `dist/iife/${name}.iife.js`), 'utf8');
        assert.ok(bundle.startsWith(`/*! Bundled dependency: jschardet@${dependency.version}`));
        assert.ok(bundle.includes('../third-party/jschardet/NOTICE.txt'));
      }
    }
    if (pkg.name === 'ranui') {
      for (const name of ['dashjs', 'mpegts.js']) {
        assert.ok(
          (await readFile(join(installed, 'dist/third-party', name, 'LICENSE.txt'), 'utf8')).length > 100,
          `${name}: missing prebundle notices`,
        );
      }
      for (const file of ['THIRD_PARTY_LICENSES.md', 'IIFE-LICENSES.md']) {
        const notices = await readFile(join(installed, 'dist', file), 'utf8');
        for (const name of ['dashjs', 'hls.js', 'mpegts.js', 'mermaid']) {
          assert.ok(notices.includes(`## ${name} - `), `${file}: missing ${name} notice`);
          assert.ok(!manifest.dependencies?.[name], `${name} must be bundled without a second production install`);
        }
      }
    }
    for (const [path, conditions] of Object.entries(manifest.exports)) {
      if (typeof conditions !== 'object' || !conditions.import || path.includes('*')) continue;
      const name = pkg.name + (path === '.' ? '' : path.slice(1));
      imports.push(`import * as p${imports.length} from ${JSON.stringify(name)}; void p${imports.length};`);
    }
  }
  await writeFile(
    join(fixture, 'consumer.mts'),
    `${imports.join('\n')}
import { requestUrlToBuffer } from 'ranuts';
async function binary() {
  const buffer: ArrayBuffer = (await requestUrlToBuffer('/data')).data;
  // @ts-expect-error Default bytes must never degrade to any or Blob.
  const blob: Blob = (await requestUrlToBuffer('/data')).data;
  return [buffer, blob];
}
void binary;
`,
  );
  const require = createRequire(join(ROOT, 'packages/ranui/package.json'));
  const tsc = join(dirname(require.resolve('typescript/package.json')), 'bin/tsc');
  for (const [module, moduleResolution] of [
    ['NodeNext', 'NodeNext'],
    ['ESNext', 'Bundler'],
  ]) {
    await writeFile(
      join(fixture, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          noEmit: true,
          strict: true,
          skipLibCheck: false,
          target: 'ES2022',
          module,
          moduleResolution,
          types: [],
        },
        files: ['consumer.mts'],
      }),
    );
    run(process.execPath, [tsc, '-p', 'tsconfig.json']);
  }
  await writeFile(
    join(fixture, 'runtime.mjs'),
    `
import assert from 'node:assert/strict';
import { Button } from 'ranui/button';
import { Button as BarrelButton } from 'ranui';
import { renderToString } from 'ranui/ssr';
import { renderHTMLToString } from 'ranui/ssr-stream';
import { Div } from '@alixex/ranview/static';
import { rgbToHex, arrayBufferToString } from 'ranuts';
assert.equal(Button, BarrelButton);
assert.equal(rgbToHex(1,2,3), '#010203');
assert.equal(arrayBufferToString(new TextEncoder().encode('Hello')), 'Hello');
assert.equal(Div().text('Hello').serialize(), '<div>Hello</div>');
assert.match(renderToString(new Button()), /<r-button/);
assert.match(await renderHTMLToString('<r-button>Ready</r-button>'), /shadowrootmode/);
`,
  );
  run(process.execPath, ['runtime.mjs']);
  await writeFile(
    join(fixture, 'index.html'),
    '<html><body><r-button>Ready</r-button><script type="module" src="/main.js"></script></body></html>',
  );
  await writeFile(
    join(fixture, 'main.js'),
    "import 'ranui/button'; import 'ranui/input'; import 'ranui/player'; import 'ranui/mermaid'; import 'ranui/style';",
  );
  const { build } = require('vite');
  const result = await build({ root: fixture, configFile: false, logLevel: 'error', build: { write: false } });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output);
  assert.ok(
    outputs.some((item) => item.fileName.endsWith('.css')),
    'Consumer build lost the shared stylesheet',
  );
  await writeFile(join(artifacts, 'verified.json'), `${JSON.stringify({ artifacts: receipt }, null, 2)}\n`);
  console.log(
    'Release install: real npm dependency resolution, strict NodeNext/Bundler declarations, ESM/SSR execution and browser production build passed',
  );
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  await rm(fixture, { recursive: true, force: true });
}
