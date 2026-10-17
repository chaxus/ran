/** Measure browser consumers of packed packages with Vite's normal tree shaking. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

// Button must fit without an unrelated ~30 kB MIME catalogue. The larger entries
// keep independent initial-load ceilings; lazy renderers/media engines are excluded.
export const componentBundleBudgets = {
  button: { bytes: 40_000, gzipBytes: 13_000 },
  markdown: { bytes: 60_000, gzipBytes: 20_000 },
  player: { bytes: 385_000, gzipBytes: 170_000 },
};

export function initialJavaScriptSize(output, entryName = 'consumer') {
  const chunks = new Map(output.filter((item) => item.type === 'chunk').map((chunk) => [chunk.fileName, chunk]));
  const entry = [...chunks.values()].find((chunk) => chunk.isEntry && chunk.name === entryName);
  assert.ok(entry, `Missing consumer entry: ${entryName}`);
  const visited = new Set();
  function visit(fileName) {
    if (visited.has(fileName)) return;
    const chunk = chunks.get(fileName);
    assert.ok(chunk, `Unbundled initial JavaScript dependency: ${fileName}`);
    visited.add(fileName);
    for (const dependency of chunk.imports) visit(dependency);
  }
  visit(entry.fileName);
  const initial = [...visited].map((name) => chunks.get(name));
  const bytes = initial.reduce((sum, chunk) => sum + Buffer.byteLength(chunk.code), 0);
  assert.ok(bytes > 0, 'Consumer registration was removed from the JavaScript bundle');
  return {
    bytes,
    gzipBytes: initial.reduce((sum, chunk) => sum + gzipSync(chunk.code).length, 0),
    chunks: initial.length,
  };
}

export function assertComponentBundleBudget(entry, size, budgets = componentBundleBudgets) {
  const budget = budgets[entry];
  assert.ok(budget, `Missing component budget: ${entry}`);
  for (const metric of ['bytes', 'gzipBytes']) {
    assert.ok(
      size[metric] <= budget[metric],
      `${entry} initial JavaScript ${metric}: ${size[metric]} exceeds budget ${budget[metric]}`,
    );
  }
}

export async function verifyComponentBundles(fixture, repository) {
  const require = createRequire(join(repository, 'packages/ranui/package.json'));
  const { build } = await import(pathToFileURL(require.resolve('vite')).href);
  const report = [];
  for (const entry of Object.keys(componentBundleBudgets)) {
    const result = await build({
      configFile: false,
      root: fixture,
      logLevel: 'error',
      plugins: [
        {
          name: 'packed-component-consumer',
          resolveId(id) {
            if (id === 'virtual:consumer') return '\0consumer';
          },
          load(id) {
            if (id === '\0consumer') return `import 'ranui/${entry}';`;
          },
        },
      ],
      build: {
        write: false,
        target: 'es2022',
        minify: 'esbuild',
        reportCompressedSize: false,
        rollupOptions: { input: { consumer: 'virtual:consumer' } },
      },
    });
    const size = initialJavaScriptSize(result.output);
    console.log(
      `Packed ranui/${entry}: ${size.bytes} initial JS bytes, ${size.gzipBytes} gzip bytes (${size.chunks} chunks)`,
    );
    report.push({ entry, ...size });
  }
  // Measure every entry before failing, so a regression report remains useful.
  for (const { entry, ...size } of report) assertComponentBundleBudget(entry, size);
  return report;
}
