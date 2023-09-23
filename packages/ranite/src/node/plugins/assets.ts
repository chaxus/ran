import type { Plugin } from '../plugin';
import { cleanUrl, removeImportQuery } from '../utils';

export function assetPlugin(): Plugin {
  return {
    name: 'ranite:asset',
    async load(id) {
      const cleanedId = removeImportQuery(cleanUrl(id));
      // 这里仅处理 svg
      if (cleanedId.endsWith('.svg')) {
        return {
          code: `export default "${cleanedId}"`,
        };
      }
    },
  };
}
