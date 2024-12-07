import { createReadStream, createWriteStream } from 'node:fs';
import type { ReadStream, WriteStream } from 'node:fs';

interface ReadOption {
  path: string;
  encoding: string;
  start: number;
  end: number;
  highWaterMark: number;
}

interface WriteOption {
  path: string;
  encoding: string;
}

export const readStream = (option: ReadOption): ReadStream => {
  const { path } = option;
  if (path) {
    const stream = createReadStream(path);
    return stream;
  }
  throw new Error('path is not defined');
};

export const writeStream = (option: WriteOption): WriteStream => {
  const { path } = option;
  if (path) {
    const stream = createWriteStream(path);
    return stream;
  }
  throw new Error('path is not defined');
};
