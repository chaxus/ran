import childProcess from 'node:child_process';
import readline from 'node:readline';

export const runCommand = (command: string, args: string[]): Promise<void> => {
  // 验证命令和参数
  if (!command || typeof command !== 'string') {
    throw new Error('Invalid command');
  }

  // 验证命令是否在允许列表中
  const allowedCommands = ['git', 'npm', 'yarn', 'pnpm']; // 根据实际需求添加允许的命令
  const commandName = command.split(' ')[0];
  if (!allowedCommands.includes(commandName)) {
    throw new Error(`Command ${commandName} is not allowed`);
  }

  // 验证参数
  if (!Array.isArray(args)) {
    throw new Error('Invalid arguments');
  }

  return new Promise<void>((resolve, reject) => {
    const executedCommand = childProcess.spawn(command, args, {
      stdio: 'inherit', // 子进程继承父进程的 stdio（标准输入/输出）流。这意味着子进程可以使用父进程的 stdin（标准输入流）和 stdout（标准输出流）。
      shell: true, // 指示 spawn 方法在 shell 中执行命令。
    });
    executedCommand.on('error', (e) => reject(e));
    executedCommand.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(`Command exited with code ${c}`))));
  });
};

interface PromptOption {
  message: string;
  defaultResponse: string; // "Y"
  stream: NodeJS.ReadWriteStream;
}

export const prompt = ({ message, stream = process.stderr, defaultResponse = 'Y' }: PromptOption): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: stream,
  });
  return new Promise((resolve) => {
    rl.question(`${message} `, (answer) => {
      // Close the stream
      rl.close();
      const response = (answer || defaultResponse).toLowerCase();
      // Resolve with the input response
      response === 'y' || response === 'yes' ? resolve(true) : resolve(false);
    });
  });
};
