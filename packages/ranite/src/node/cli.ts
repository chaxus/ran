// 构建cli命令行
import { startDevServer } from "./server";

// cli命令对应的方法
const commandMapMethod = {
  dev: startDevServer,
  serve: startDevServer
}

function parseOptions() {
  const argv = process.argv;
  /**
   * @description:  执行ran dev后，process.argv的值
   * 测试 cli~ [
    '/Users/.nvm/versions/node/v16.14.2/bin/node',
    '/Users/Documents/code/ran/packages/ranite/bin/ranite',
    'serve'
      ]
 */
  // 获取命令行的命令
  for (let i = 0; i < argv.length; i++) {
    const cmd = argv[i];
    const method = commandMapMethod[cmd]
    if (method) method()
  }
}

parseOptions();
