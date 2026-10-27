import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { renderDesignDocs, syncDesignDocs } from '../sync-design-docs.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('generated npm guides exactly match the canonical methods and adapter', async () => {
  await syncDesignDocs(root, true);
});

test('portable method reading dependencies remain inside its distributed directory', async () => {
  const design = resolve(root, 'design');
  const files = await readdir(design);
  for (const file of files.filter((name) => name.endsWith('.md'))) {
    const content = await readFile(resolve(design, file), 'utf8');
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      const link = match[1]!;
      if (/^(?:https?:|#)/.test(link)) continue;
      const target = resolve(dirname(resolve(design, file)), link.split('#')[0]!);
      assert.ok(target.startsWith(`${design}/`), `${file}: escaping dependency ${link}`);
      const targetContent = await readFile(target, 'utf8');
      const fragment = link.split('#')[1];
      if (fragment) {
        const anchors = new Set(
          [...targetContent.matchAll(/^#{1,6} (.+)$/gm)].map((heading) =>
            heading[1]!
              .toLowerCase()
              .replace(/[^\p{L}\p{N}_\- ]/gu, '')
              .replaceAll(' ', '-'),
          ),
        );
        assert.ok(anchors.has(decodeURIComponent(fragment)), `${file}: missing heading ${link}`);
      }
    }
  }
});

test('freshness gate rejects an edited distribution and regeneration repairs it', async () => {
  const fixture = await mkdtemp(resolve(tmpdir(), 'ran-design-docs-'));
  try {
    for (const directory of ['design', 'design/assets', 'packages/ranui/docs/adapters']) {
      await mkdir(resolve(fixture, directory), { recursive: true });
      for (const file of await readdir(resolve(root, directory))) {
        if (file.endsWith('.md') || file.endsWith('.svg'))
          await writeFile(resolve(fixture, directory, file), await readFile(resolve(root, directory, file)));
      }
    }
    await syncDesignDocs(fixture, false);
    await syncDesignDocs(fixture, true);
    const target = resolve(fixture, 'packages/ranui/docs/DESIGN.md');
    await writeFile(target, (await readFile(target, 'utf8')) + 'Independent duplicate rule\n');
    await assert.rejects(syncDesignDocs(fixture, true), /stale/);
    await syncDesignDocs(fixture, false);
    await syncDesignDocs(fixture, true);
    // Changing a source must invalidate its generated output too.
    const source = resolve(fixture, 'design/DESIGN.md');
    await writeFile(source, (await readFile(source, 'utf8')) + '\nNew canonical decision\n');
    await assert.rejects(syncDesignDocs(fixture, true), /stale/);
    await syncDesignDocs(fixture, false);
    assert.equal(
      await readFile(target, 'utf8'),
      (await renderDesignDocs(fixture)).get('packages/ranui/docs/DESIGN.md'),
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
