import { hrtime } from 'node:process';

const taskEnd = (symbol: symbol): number | bigint => {
  const startTime = Symbol.keyFor(symbol);
  if (typeof window !== 'undefined' && startTime) {
    return window.performance.now() - Number(startTime);
  }
  if (typeof process !== 'undefined' && startTime) {
    return hrtime.bigint() - BigInt(startTime);
  }
  return Date.now() - Number(startTime);
};

export default taskEnd;
