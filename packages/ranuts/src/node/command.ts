import childProcess from 'node:child_process';
import readline from 'node:readline';

export const runCommand = (command: string, args: string[]): Promise<void> => {
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
