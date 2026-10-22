import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { Markdown } from '@/components/markdown';

it('documents public parts mounted by the lazy Markdown renderer', async () => {
  const reader = new Markdown();
  reader.setAttribute('copy', '');
  document.body.append(reader);
  try {
    reader.content = '| Item | Cost |\n| --- | ---: |\n| Pilot | 24 |\n\n```text\nexample\n```';
    await reader._pending;
    const reference = readFileSync(resolve(__dirname, '../../docs/COMPONENTS.md'), 'utf8');
    const section = reference.split('## `<r-markdown>`')[1].split('\n## ')[0];
    const declared = new Set([...section.split('**Parts**:')[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]));
    const actual = [...reader._shadowDom.querySelectorAll('[part]')].flatMap((node) =>
      node.getAttribute('part')!.split(/\s+/),
    );
    expect(actual).toContain('copy-status');
    expect(actual.filter((part) => !declared.has(part))).toEqual([]);
  } finally {
    reader.remove();
  }
});
