import writeFile from '@/file/writeFile'
import { afterEach, describe, expect, it, vi } from 'vitest'
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("functions", () => {
  it("write file", () => {
    const writeFileSpy = vi.spyOn(fs, "writeFile");
    writeFile(`${__dirname}/index.md`, 'xxxx');
    expect(writeFileSpy).toHaveBeenCalledTimes(1);
    writeFileSpy.mockClear();
    afterEach(() => {
      fs.rm(`${__dirname}/index.md`, (error) => {
        console.log('write file', error);
      })
    });
  });
});