import type { SourceMap } from 'magic-string'
import { Bundle } from './bundle';

export interface Options {
  input: string;
  output: string;
}

interface Build {
    generate: () => {
        code: string;
        map: SourceMap;
    }
}

export function build(options: Options):Promise<any> {
  const bundle = new Bundle({
    entry: options.input
  });
  return bundle.build().then(() => {
    return {
      generate: () => bundle.render()
      // write: (dest, options = {}) => {
      //   let { code, map } = bundle.generate({
      //     dest,
      //     format: options.format,
      //     globalName: options.globalName
      //   });

      //   return Promise.all([
      //     writeFile(dest, code),
      //     writeFile(dest + '.map', map.toString())
      //   ]);
      // }
    };
  });
}