
import { join, resolve } from 'path';
import { readdir, stat, readdirSync, statSync, Stats } from 'fs';
import { promisify } from 'util';

const toStats = promisify(stat);
const toRead = promisify(readdir);

type Caller = (relPath: string, absPath: string, stats: Stats) => any;
/**
 * @description: 递归遍历每一个目录，为找到的文件都执行一个函数
 * @param {string} dir
 * @param {Caller} callback
 * @param {*} pre
 */
export async function traverse(dir:string, callback:Caller, pre = '') {
    dir = resolve('.', dir);
    await toRead(dir).then(arr => {
        return Promise.all(
            arr.map(str => {
                let abs = join(dir, str);
                return toStats(abs).then(stats => {
                    return stats.isDirectory()
                        ? traverse(abs, callback, join(pre, str))
                        : callback(join(pre, str), abs, stats)
                });
            })
        );
    });
}
/**
 * @description: 同步方法，递归遍历每一个目录，为找到的文件都执行一个函数
 * @param {string} dir
 * @param {Caller} callback
 * @param {*} pre
 */
export function traverseSync(dir:string, callback:Caller, pre = '') {
    dir = resolve('.', dir);
    let arr = readdirSync(dir);
    let i = 0, abs, stats;
    for (; i < arr.length; i++) {
        abs = join(dir, arr[i]);
        stats = statSync(abs);
        stats.isDirectory()
            ? traverseSync(abs, callback, join(pre, arr[i]))
            : callback(join(pre, arr[i]), abs, stats);
    }
}
