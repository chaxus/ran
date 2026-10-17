import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const script = join(repository, 'bin/prepare-declarations.mjs');
const require = createRequire(join(repository, 'packages/ranuts/package.json'));
const typescript = dirname(require.resolve('typescript/package.json'));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ran-declarations-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, content) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  put('package.json', '{"type":"module"}');
  mkdirSync(join(root, 'node_modules'));
  symlinkSync(typescript, join(root, 'node_modules/typescript'), 'junction');
  const run = (aliasRoot = '.') =>
    spawnSync(process.execPath, [script, 'dist', aliasRoot], { cwd: root, encoding: 'utf8' });
  const read = (path) => readFileSync(join(root, path), 'utf8');
  return { root, put, read, run };
}

function succeeded(result) {
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test('normalizes aliases, exports, side effects and dynamic types and emits all CommonJS entry declarations', (t) => {
  const { root, put, read, run } = fixture(t);
  put(
    'dist/index.d.ts',
    [
      'export type { Token } from "@/shared";',
      'export * from "./src/public.ts";',
      'import "./src/register";',
      'export type Dynamic = import("./src/shared").Token;',
      'export type Literal = "@/not-an-import";',
      'export type External = import("node:fs").Stats;',
      'import "./theme.css";',
      'import "@/theme.less?inline";',
      'declare module "@/components/*" { const component: unknown; export default component; }',
      '//# sourceMappingURL=index.d.ts.map',
    ].join('\n'),
  );
  put('dist/src/shared/index.d.ts', 'export interface Token { value: string }\n');
  put('dist/src/public.d.ts', 'export type { Token } from "./shared/index.js";\n');
  put('dist/src/register.d.ts', 'export {};\n');
  put('dist/unreferenced.d.ts', 'export interface Unreferenced { count: number }\n');
  succeeded(run('src'));
  const esm = read('dist/index.d.ts');
  assert.match(esm, /from "\.\/src\/shared\/index\.js"/);
  assert.match(esm, /from "\.\/src\/public\.js"/);
  assert.match(esm, /import "\.\/src\/register\.js"/);
  assert.match(esm, /import\("\.\/src\/shared\/index\.js"\)/);
  assert.match(esm, /Literal = "@\/not-an-import"/);
  assert.match(esm, /import\("node:fs"\)/);
  assert.match(esm, /import "\.\/theme\.css"/);
  assert.match(esm, /import "@\/theme\.less\?inline"/);
  assert.match(esm, /declare module "@\/components\/\*"/);
  assert.match(esm, /sourceMappingURL=index\.d\.ts\.map/);
  assert.equal(existsSync(join(root, 'dist/cjs-types/index.d.cts')), true);
  assert.equal(existsSync(join(root, 'dist/cjs-types/unreferenced.d.cts')), true);
  assert.equal(existsSync(join(root, 'dist/cjs-types/src/shared/index.d.cts')), true);
  assert.equal(existsSync(join(root, 'dist/cjs-types/src/public.d.cts')), true);
});

test('both trees resolve in real NodeNext TypeScript consumers, including triple-reference paths', (t) => {
  const { root, put, run, read } = fixture(t);
  put('dist/index.d.ts', '/// <reference path="./globals" />\nexport type { Value } from "@/models";\n');
  put('dist/models/index.d.ts', 'export interface Value { count: number }\n');
  put('dist/globals.d.ts', 'interface DeclarationFixtureGlobal { value: string }\n');
  put('consumer.mts', 'import type { Value } from "./dist/index.js";\nexport const value: Value = {count: 1};\n');
  put(
    'consumer.cts',
    'import api = require("./dist/cjs-types/index.cjs");\nexport const value: api.Value = {count: 1};\n',
  );
  put(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
        noEmit: true,
        strict: true,
        types: [],
      },
      files: ['consumer.mts', 'consumer.cts'],
    }),
  );
  succeeded(run());
  assert.match(read('dist/index.d.ts'), /reference path="\.\/globals\.d\.ts"/);
  succeeded(
    spawnSync(process.execPath, [join(typescript, 'bin/tsc'), '--project', 'tsconfig.json'], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
});

test('rejects dangling local code references before changing declaration output', (t) => {
  const { root, put, read, run } = fixture(t);
  const original = 'export * from "./missing";\n';
  put('dist/index.d.ts', original);
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unresolved declaration import.*index\.d\.ts.*missing/s);
  assert.equal(read('dist/index.d.ts'), original);
  assert.equal(existsSync(join(root, 'dist/cjs-types')), false);
});

test('the async API is idempotent and never copies its own output recursively', async (t) => {
  const { root, put, read, run } = fixture(t);
  put('dist/index.d.ts', 'export * from "./nested";\n');
  put('dist/nested/index.d.ts', 'export interface Nested { id: string }\n');
  succeeded(run());
  const esm = read('dist/index.d.ts');
  const cjs = read('dist/cjs-types/index.d.cts');
  const source = `import { prepareDeclarations } from ${JSON.stringify(new URL('../prepare-declarations.mjs', import.meta.url).href)}; await prepareDeclarations({ dist: ${JSON.stringify(join(root, 'dist'))} });`;
  succeeded(spawnSync(process.execPath, ['--input-type=module', '-e', source], { cwd: root, encoding: 'utf8' }));
  assert.equal(read('dist/index.d.ts'), esm);
  assert.equal(read('dist/cjs-types/index.d.cts'), cjs);
  assert.deepEqual(readdirSync(join(root, 'dist/cjs-types')).sort(), ['index.d.cts', 'nested']);
});

test('mixed ESM and CommonJS consumers share globals and private class identities', (t) => {
  const { root, put, run } = fixture(t);
  put(
    'dist/index.d.ts',
    'export declare class Widget extends HTMLElement { private state; }\ndeclare global { namespace DeclarationProbe { type Alias = Widget; } interface HTMLElementTagNameMap { "declaration-probe": Widget; } }\n',
  );
  put('consumer.cts', 'import api = require("./dist/cjs-types/index.cjs"); export type CJSWidget = api.Widget;\n');
  put(
    'consumer.mts',
    'import type { Widget } from "./dist/index.js"; import type { CJSWidget } from "./consumer.cjs"; const shared: Widget = {} as CJSWidget; void shared;\n',
  );
  put(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
        strict: true,
        skipLibCheck: false,
        noEmit: true,
        types: [],
      },
      files: ['consumer.mts', 'consumer.cts'],
    }),
  );
  succeeded(run());
  succeeded(
    spawnSync(process.execPath, [join(typescript, 'bin/tsc'), '-p', 'tsconfig.json'], { cwd: root, encoding: 'utf8' }),
  );
});

test('CommonJS entry declarations preserve direct, aliased and re-exported defaults without inventing them', (t) => {
  const { root, put, run } = fixture(t);
  const declarations = {
    direct: 'export default class Direct { value: string; }',
    named: 'declare class Named { value: string; } export { Named as default };',
    reexport: 'export { default } from "./direct";',
    namespace: 'export * as default from "./direct";',
    string: 'declare class StringDefault { value: string; } export { StringDefault as "default" };',
    type: 'interface Value { value: string; } export type { Value as default };',
    nondefault:
      'export { default as Named } from "./direct"; declare module "some-asset" { const value: unknown; export default value; }',
  };
  for (const [name, source] of Object.entries(declarations)) put(`dist/${name}.d.ts`, source + '\n');
  put(
    'consumer.cts',
    [
      'import Direct from "./dist/cjs-types/direct.cjs";',
      'import Named from "./dist/cjs-types/named.cjs";',
      'import Reexport from "./dist/cjs-types/reexport.cjs";',
      'import Namespace from "./dist/cjs-types/namespace.cjs";',
      'import StringDefault from "./dist/cjs-types/string.cjs";',
      'import type Value from "./dist/cjs-types/type.cjs";',
      'import { Named as Nondefault } from "./dist/cjs-types/nondefault.cjs";',
      'const direct: Direct = new Direct(); const named: Named = new Named(); const again: Reexport = new Reexport();',
      'const namespaced: Namespace.default = new Namespace.default(); const string: StringDefault = new StringDefault();',
      'const typed: Value = {value:"test"}; const nondefault: Nondefault = new Nondefault(); void [direct,named,again,namespaced,string,typed,nondefault];',
    ].join('\n'),
  );
  put(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        target: 'ES2022',
        strict: true,
        noEmit: true,
        types: [],
        skipLibCheck: false,
      },
      files: ['consumer.cts'],
    }),
  );
  succeeded(run());
  succeeded(
    spawnSync(process.execPath, [join(typescript, 'bin/tsc'), '-p', 'tsconfig.json'], { cwd: root, encoding: 'utf8' }),
  );
});
