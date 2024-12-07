import type { Plugin } from 'vite';
import { readFile } from 'ranuts/node';
import type { Config } from 'svgo';
import { optimize } from 'svgo';

interface Options {
  defaultImport?: string;
  svgoConfig?: Config;
  svgo?: boolean;
}

export default function loadSvgPlugin(options: Options = {}): Plugin {
  const { svgoConfig, defaultImport, svgo = true } = options;
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
      let svg: any;
      try {
        svg = await readFile(path, 'utf-8');
      } catch (error) {
        console.warn('\n', `${id} couldn't be loaded by vite-plugin-load-svg,error:${error}`);
        return;
      }
      if (importType === 'raw') {
        return `export default ${JSON.stringify(svg)}`;
      }
      if (svgo && query !== 'skipsvgo') {
        svg = optimize(svg, { ...svgoConfig, path }).data;
      }
      return svg;
    },
  };
}
