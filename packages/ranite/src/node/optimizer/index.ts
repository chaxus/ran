import path from 'node:path';
import { build } from 'esbuild';
import { green } from 'picocolors';
import { PRE_BUNDLE_DIR } from '../constants';
import { scanPlugin } from './scanPlugin';
import { preBundlePlugin } from './preBundlePlugin';

export async function optimize(root: string): Promise<void> {
  // 1. 确定入口
  const entry = path.resolve(root, 'src/main.tsx');
  // 2. 从入口处扫描依赖
  const deps = new Set<string>();
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [scanPlugin(deps)],
  });
  console.log(
    `${green('需要预构建的依赖')}:\n${[...deps]
      .map(green)
      .map((item) => `  ${item}`)
      .join('\n')}\n`,
  );
  // 3. 预构建依赖
  await build({
    entryPoints: [...deps],
    write: true,
    bundle: true,
    format: 'esm',
    splitting: true,
    // 指定打包输出的目录：node_modules/.ranite
    outdir: path.resolve(root, PRE_BUNDLE_DIR),
    plugins: [preBundlePlugin(deps)],
  });
}
