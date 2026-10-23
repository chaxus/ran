import path from 'node:path';
import { capture } from './evidence.ts';
const dir = path.resolve(process.argv[2]);
const name = process.argv[3] || 'final';
console.log(JSON.stringify(await capture(dir, name), null, 2));
