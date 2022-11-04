import { Plugin } from 'vite';
interface Options {
    ignore?: Array<string>
}

export default function loadStylePlugin(options?: Options): Plugin {
    return {
        name: 'vite-plugin-load-style',
        transform(code, id) {
            const path = new RegExp('ranui\/components\/[a-zA-z0-9]+\/index\.ts')
            const stylePath = new RegExp(/((this\.)?[a-zA-Z0-9]+)\s*=\s*this\.attachShadow\(\{.*\}\)/)
            const { ignore = [] } = options ?? {}
            const [fragment, statement] = code.match(stylePath) ?? []
            let result = code
            if (path.test(id) && !ignore.some(item => new RegExp(item).test(id)) && fragment && statement) {
                const front = `import f7170ee498e0dd32cbdcb63fba8f75cc from '${id.replace('index.ts','index.less')}';`
                result = result.replace(
                    stylePath,
                    `${fragment};
                    const F7170EE498E0DD32CBDCB63FBA8F75CC = document.createElement('style');
                    F7170EE498E0DD32CBDCB63FBA8F75CC.textContent = f7170ee498e0dd32cbdcb63fba8f75cc;
                    ${statement}.appendChild(F7170EE498E0DD32CBDCB63FBA8F75CC);`)
                result = front + result;
            }

            return {
                code: result,
                map: null // TODO
            };
        }
    }
}