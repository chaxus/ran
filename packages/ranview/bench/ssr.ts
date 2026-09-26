/** Node SSR microbenchmark: build + serialize, validate equivalent output first. */
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as standard from '../src/index';
import * as snapshot from '../src/static';

const rows = Array.from({ length: 100 }, (_, id) => ({ id, title: `Row ${id} <safe>` }));
const baselinePath = process.env.RANVIEW_BENCH_BASELINE;
const baseline = baselinePath ? await import(pathToFileURL(resolve(baselinePath)).href) : null;
type API = typeof standard;
function render(v: API, kind: string): string {
  {
    const root = v.Div().class(kind === 'values' ? 'page' : () => 'page');
    if (kind === 'branches') root.children(v.Show({ when: () => true, children: () => v.Span().text('yes') }));
    if (kind === 'lists')
      root.children(v.For({ each: () => rows, key: (r) => r.id, render: (r) => v.Span().text(() => r.title) }));
    else root.children(rows.map((r) => v.Span().text(kind === 'values' ? r.title : () => r.title)));
    const html = root.serialize();
    return html;
  }
}
// Dispose scopes after each render, including the legacy baseline's SSR effects.
function run(v: API, kind: string): string {
  let output = '';
  v.createRoot((dispose) => {
    output = render(v, kind);
    dispose();
  });
  return output;
}
const staticAPI = { ...snapshot, createRoot: standard.createRoot } as unknown as API;
const entries: [string, API][] = [
  ['standard', standard],
  ['static', staticAPI],
];
if (baseline) entries.unshift(['baseline', baseline as API]);
for (const kind of ['values', 'getters', 'branches', 'lists']) {
  const expected = run(standard, kind);
  for (const [name, api] of entries) {
    if (run(api, kind) !== expected) throw new Error(`Output mismatch: ${name}/${kind}`);
    for (let i = 0; i < 30; i++) run(api, kind);
    const samples: number[] = [];
    for (let sample = 0; sample < 7; sample++) {
      const start = performance.now();
      for (let i = 0; i < 200; i++) run(api, kind);
      samples.push((performance.now() - start) / 200);
    }
    samples.sort((a, b) => a - b);
    console.log(
      `${kind.padEnd(9)} ${name.padEnd(9)} ${samples[3].toFixed(4)} ms/render (${expected.length} HTML chars)`,
    );
  }
}
