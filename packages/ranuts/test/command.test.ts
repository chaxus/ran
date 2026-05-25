import { existsSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { runCommand } from '@/node/command';

describe('runCommand', () => {
  it('passes arguments literally instead of evaluating them through a shell', async () => {
    const marker = join(tmpdir(), `ranuts-command-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await writeFile(marker, '');
    await unlink(marker);

    await runCommand(process.execPath, [
      '-e',
      'process.exit(0)',
      '&&',
      process.execPath,
      '-e',
      `require("node:fs").writeFileSync(${JSON.stringify(marker)}, "injected")`,
    ]);

    expect(existsSync(marker)).toBe(false);
  });
});
