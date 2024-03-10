import { join, resolve } from 'node:path';
import type { Stats } from 'node:fs';
import { readdir, readdirSync, stat, statSync } from 'node:fs';
import { promisify } from 'node:util';

const toStats = promisify(stat);
const toRead = promisify(readdir);

type Caller = (relPath: string, absPath: string, stats: Stats) => any;
/**
 * @description: 递归遍历每一个目录，为找到的文件都执行一个函数
 * @param {string} dir
 * @param {Caller} callback
 * @param {*} pre
 */
export async function traverse(dir: string, callback: Caller, pre = ''): Promise<any> {
  dir = resolve('.', dir);
  await toRead(dir).then((arr) => {
    return Promise.all(
      arr.map((str) => {
        const abs = join(dir, str);
        return toStats(abs).then((stats) => {
          return stats.isDirectory() ? traverse(abs, callback, join(pre, str)) : callback(join(pre, str), abs, stats);
        });
      }),
    );
  });
}
/**
 * @description: 同步方法，递归遍历每一个目录，为找到的文件都执行一个函数
 * @param {string} dir
 * @param {Caller} callback
 * @param {*} pre
 */
export function traverseSync(dir: string, callback: Caller, pre = ''): void {
  dir = resolve('.', dir);
  const arr = readdirSync(dir);
  let i = 0,
    abs,
    stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = statSync(abs);
    stats.isDirectory() ? traverseSync(abs, callback, join(pre, arr[i])) : callback(join(pre, arr[i]), abs, stats);
  }
}
