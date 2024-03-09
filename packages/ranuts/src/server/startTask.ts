import { hrtime } from 'node:process';

const startTask = (): symbol => {
  if (typeof window !== 'undefined') {
    const startTime = window.performance.now();
    return Symbol.for(`${startTime}`);
  }
  if (typeof process !== 'undefined') {
    const startTime = hrtime.bigint();
    return Symbol.for(`${startTime}`);
  }
  return Symbol.for(`${Date.now()}`);
};

export default startTask;
