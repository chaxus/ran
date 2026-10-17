import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import loadSvg from '../../plugins/load-svg';

it.each(['', '?raw'])('exports SVG text rather than a file result object (%s)', async (query) => {
  const directory = await mkdtemp(join(tmpdir(), 'ranui-svg-'));
  try {
    const file = join(directory, 'icon.svg');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';
    await writeFile(file, svg);
    const load = loadSvg({ defaultImport: 'raw' }).load;
    if (typeof load !== 'function') throw new Error('Expected a load hook');
    expect(await load.call({} as never, `${file}${query}`)).toBe(`export default ${JSON.stringify(svg)}`);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
