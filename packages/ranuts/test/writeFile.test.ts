import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import fs from 'node:fs';
import { describe, it } from 'vitest';
// import { writeFile } from '@/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('functions', () => {
  it('write file', () => {
    // const writeFileSpy = vi.spyOn(fs, 'writeFile')
    // writeFile(`${__dirname}/index.md`, 'xxxx')
    // expect(writeFileSpy).toHaveBeenCalledTimes(0)
    // writeFileSpy.mockClear()
    // afterEach(() => {
    //   fs.rm(`${__dirname}/index.md`, (error) => {
    //     console.log('write file', error)
    //   })
    // })
  });
});
