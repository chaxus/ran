import type { Plugin } from 'vite';
import { readFile } from 'ranuts/node';

interface Options {
  defaultImport?: string;
}

/**
 * Loads `.svg` imports as raw strings.
 *
 * This used to carry an svgo optimisation pass behind an `svgo` option, and the `svgo`
 * dependency with it. The pass was unreachable: both call sites disabled it, and both also set
 * `defaultImport: 'raw'`, which returns above the optimisation branch anyway. The regex only
 * admits `?raw` and `?skipsvgo` as queries, and neither can reach it either — so no
 * configuration expressible here ever optimised anything. Removed along with the dependency;
 * build output is byte-identical.
 *
 * If SVG optimisation is wanted later, run svgo over `assets/icons/*.svg` as a build step and
 * commit the result — the icons are static, so paying for it on every dev-server request was
 * never the right shape.
 *
 * `?skipsvgo` stays accepted so any stray import keeps resolving; it now behaves like `?raw`.
 */
export default function loadSvgPlugin(options: Options = {}): Plugin {
  const { defaultImport } = options;
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const svgRegex = /\.svg(\?(raw|skipsvgo))?$/;
  return {
    name: 'vite-plugin-load-svg',
    enforce: 'pre',
    async load(id) {
      if (!svgRegex.test(id)) return;
      const [path, query] = id.split('?', 2);
      const importType = query || defaultImport;
      if (importType === 'url') return;
      let svg: string;
      try {
        svg = await readFile(path, 'utf-8');
      } catch (error) {
        console.warn('\n', `${id} couldn't be loaded by vite-plugin-load-svg,error:${error}`);
        return;
      }
      return `export default ${JSON.stringify(svg)}`;
    },
  };
}
