import { Plugin } from "../plugin";
import { cleanUrl, removeImportQuery } from "../utils";

export function assetPlugin(): Plugin {
  return {
    name: "m-vite:asset",
    async load(id) {
      const cleanedId = removeImportQuery(cleanUrl(id));
      // 这里仅处理 svg
      if (cleanedId.endsWith(".svg")) {
        return {
          code: `export default "${cleanedId}"`,
        };
      }
    },
  };
}
