// 构建cli命令行
import { startDevServer } from "./server";

const argv = process.argv;
/**
 * @description:  执行ran dev后，process.argv的值
 * 测试 cli~ [
  '/Users/.nvm/versions/node/v16.14.2/bin/node',
  '/Users/Documents/code/ran/packages/ranite/bin/ranite',
  'serve'
    ]
 */
const dev = (cmd: string) => {
    if (cmd === 'dev' || cmd === 'serve') {
        startDevServer()
    }
}
function parseOptions(options = {}) {
    const argv = process.argv;
    for (let i = 2; i < argv.length; i++) {
        const cmd = argv[i];
        dev(cmd)
    }
}

parseOptions()


