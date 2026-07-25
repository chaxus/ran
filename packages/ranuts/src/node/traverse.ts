import { join, resolve } from 'node:path';
import type { Stats } from 'node:fs';
import { readdir, readdirSync, stat, statSync } from 'node:fs';
import { promisify } from 'node:util';

const toStats = promisify(stat);
const toRead = promisify(readdir);

type Caller = (relPath: string, absPath: string, stats: Stats) => any;
/**
 * @description: Walk every directory recursively, running a function for each file found
 * @param {string} dir
 * @param {Caller} callback
 * @param {*} pre
 */
export async function traverse(dir: string, callback: Caller, pre = ''): Promise<any> {
  dir = resolve('.', dir);
  const arr = await toRead(dir);
  await Promise.all(
    arr.map(async (str) => {
      const abs = join(dir, str);
      const stats = await toStats(abs);
      if (stats.isDirectory()) {
        return traverse(abs, callback, join(pre, str));
      }
      return callback(join(pre, str), abs, stats);
    }),
  );
}
/**
 * @description: Synchronous: walk every directory recursively, running a function for each file found
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
    if (stats.isDirectory()) {
      traverseSync(abs, callback, join(pre, arr[i]));
    } else {
      callback(join(pre, arr[i]), abs, stats);
    }
  }
}
