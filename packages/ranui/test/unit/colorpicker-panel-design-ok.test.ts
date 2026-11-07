import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

/**
 * Chromatic picker ink is not theme ink, so it is excused in place.
 * `verify:design` only excuses a `design-ok` comment on that line, or a comment-only
 * line directly above it. Wrapping the gradient or the thumb shadow moves the literal
 * off the excused line and the baseline (already cleared) fails closed.
 */
it('keeps every chromatic literal in the color picker panel on an excused line', () => {
  const source = readFileSync(resolve(__dirname, '../../components/colorpicker/panel.less'), 'utf8');
  const raw = source.split('\n');
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (comment, lead: string) => lead + ' '.repeat(comment.length - lead.length))
    .split('\n');
  const colour = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^()]*\)|\bhsla?\([^()]*\)/g;
  const transparent = /\brgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0*\.?0+\s*\)/;
  const designOk = /design-ok:\s*bare-colour\s+[\p{L}\p{N}]/u;
  const commentOnly = /^\s*(\/\*|\/\/)/;
  const missed: string[] = [];
  stripped.forEach((line, index) => {
    for (const match of line.matchAll(colour)) {
      if (transparent.test(match[0])) continue;
      const own = raw[index] ?? '';
      const above = raw[index - 1];
      const excused = designOk.test(own) || (above !== undefined && commentOnly.test(above) && designOk.test(above));
      if (!excused) missed.push(`${index + 1} ${match[0]}`);
    }
  });
  expect(missed).toEqual([]);
});
