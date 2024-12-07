import type { Plugin } from 'vite';
interface Options {
  ignore?: Array<string>;
}

export default function loadStylePlugin(options?: Options): Plugin {
  return {
    name: 'vite-plugin-load-style',
    transform(code, id) {
      const path = /ranui\/components\/[a-z|A-Z\d]+\/index.ts/;
      const stylePath = new RegExp(/((this\.)?[a-zA-Z\d]+)\s*=\s*this\.attachShadow\(\{.*\}\)/);
      const { ignore = [] } = options ?? {};
      const match = stylePath.exec(code) ?? [];
      const [fragment, statement] = match;
      let result = code;
      if (path.test(id) && !ignore.some((item) => new RegExp(item).test(id)) && fragment && statement) {
        const front = `import f7170ee498e0dd32cbdcb63fba8f75cc from '${id.replace('index.ts', 'index.less?inline')}';`;
        result = result.replace(
          stylePath,
          `${fragment};
                    const F7170EE498E0DD32CBDCB63FBA8F75CC = document.createElement('style');
                    F7170EE498E0DD32CBDCB63FBA8F75CC.textContent = f7170ee498e0dd32cbdcb63fba8f75cc;
                    ${statement}.appendChild(F7170EE498E0DD32CBDCB63FBA8F75CC);`,
        );
        result = front + result;
      }

      return {
        code: result,
        map: null, // TODO
      };
    },
  };
}
