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
    // 如果命令是dev或者是serve，启动服务
  if (cmd === "dev" || cmd === "serve") {
    startDevServer();
  }
};
function parseOptions() {
  const argv = process.argv;
  for (let i = 0; i < argv.length; i++) {
    const cmd = argv[i];
    // console.log("cmd--->", argv, cmd);
    dev(cmd);
  }
}

parseOptions();
