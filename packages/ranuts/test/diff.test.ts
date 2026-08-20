import { describe, expect, it } from 'vitest';
import { diffLines } from '@/utils/diff.ts';
import type { DiffHunk } from '@/utils/diff.ts';

/**
 * Renders hunks the way a unified diff reads, so an assertion shows what a reader would see.
 *
 * @param hunks Hunks to render.
 * @returns One string per line, prefixed with its marker.
 */
function render(hunks: readonly DiffHunk[]): string[] {
  return hunks.flatMap((hunk) =>
    hunk.lines.map((line) => `${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '}${line.text}`),
  );
}

describe('diffLines', () => {
  it('reports nothing for identical text', () => {
    expect(diffLines('a\nb\nc\n', 'a\nb\nc\n')).toEqual([]);
  });

  it('reports nothing when only the trailing newline differs', () => {
    expect(diffLines('a\nb', 'a\nb\n')).toEqual([]);
  });

  it('marks a changed line as a removal followed by an addition', () => {
    const hunks = diffLines('a\nb\nc\n', 'a\nB\nc\n');
    expect(render(hunks)).toEqual([' a', '-b', '+B', ' c']);
  });

  it('carries both line numbers so either gutter can be rendered', () => {
    const [hunk] = diffLines('a\nb\n', 'a\nB\n');
    expect(hunk.lines.map((line) => [line.kind, line.oldLine, line.newLine])).toEqual([
      ['context', 1, 1],
      ['removed', 2, null],
      ['added', null, 2],
    ]);
  });

  it('treats an empty old side as a file being created', () => {
    const hunks = diffLines('', 'one\ntwo\n');
    expect(render(hunks)).toEqual(['+one', '+two']);
    expect(hunks[0].oldStart).toBe(0);
    expect(hunks[0].oldLines).toBe(0);
    expect(hunks[0].newStart).toBe(1);
  });

  it('treats an empty new side as a file being deleted', () => {
    const hunks = diffLines('one\ntwo\n', '');
    expect(render(hunks)).toEqual(['-one', '-two']);
    expect(hunks[0].newLines).toBe(0);
  });

  it('keeps the requested amount of context around a change', () => {
    const before = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].join('\n');
    const after = ['1', '2', '3', '4', 'X', '6', '7', '8', '9'].join('\n');
    expect(render(diffLines(before, after, { context: 1 }))).toEqual([' 4', '-5', '+X', ' 6']);
    expect(render(diffLines(before, after, { context: 0 }))).toEqual(['-5', '+X']);
  });

  it('splits distant changes into separate hunks', () => {
    const before = Array.from({ length: 20 }, (_, i) => String(i + 1)).join('\n');
    const after = before.replace('\n2\n', '\nTWO\n').replace('\n19\n', '\nNINETEEN\n');
    const hunks = diffLines(before, after, { context: 1 });
    expect(hunks).toHaveLength(2);
    expect(render([hunks[0]])).toEqual([' 1', '-2', '+TWO', ' 3']);
    expect(render([hunks[1]])).toEqual([' 18', '-19', '+NINETEEN', ' 20']);
  });

  it('joins changes that are closer together than twice the context', () => {
    const before = ['1', '2', '3', '4', '5'].join('\n');
    const after = ['1', 'TWO', '3', 'FOUR', '5'].join('\n');
    expect(diffLines(before, after, { context: 1 })).toHaveLength(1);
  });

  it('reports the hunk boundaries a unified diff header would carry', () => {
    const before = ['1', '2', '3', '4', '5'].join('\n');
    const after = ['1', '2', 'THREE', 'EXTRA', '4', '5'].join('\n');
    const [hunk] = diffLines(before, after, { context: 1 });
    expect({
      oldStart: hunk.oldStart,
      oldLines: hunk.oldLines,
      newStart: hunk.newStart,
      newLines: hunk.newLines,
    }).toEqual({
      oldStart: 2,
      oldLines: 3,
      newStart: 2,
      newLines: 4,
    });
  });

  it('handles an insertion at the very start and the very end', () => {
    expect(render(diffLines('b\n', 'a\nb\n'))).toEqual(['+a', ' b']);
    expect(render(diffLines('a\n', 'a\nb\n'))).toEqual([' a', '+b']);
  });

  it('finds a one-line edit in a long file without diffing the whole thing', () => {
    const lines = Array.from({ length: 5000 }, (_, i) => `line ${i}`);
    const before = lines.join('\n');
    const after = [...lines.slice(0, 2500), 'CHANGED', ...lines.slice(2501)].join('\n');
    const hunks = diffLines(before, after, { context: 1 });
    expect(render(hunks)).toEqual([' line 2499', '-line 2500', '+CHANGED', ' line 2501']);
  });

  it('degrades to a wholesale replacement rather than allocating an unbounded table', () => {
    // Two large files sharing no prefix, suffix, or lines: the middle exceeds the cap.
    const before = Array.from({ length: 2100 }, (_, i) => `old ${i}`).join('\n');
    const after = Array.from({ length: 2100 }, (_, i) => `new ${i}`).join('\n');
    const [hunk] = diffLines(before, after, { context: 0 });
    expect(hunk.lines.filter((line) => line.kind === 'removed')).toHaveLength(2100);
    expect(hunk.lines.filter((line) => line.kind === 'added')).toHaveLength(2100);
    expect(hunk.lines.filter((line) => line.kind === 'context')).toHaveLength(0);
  });
});
