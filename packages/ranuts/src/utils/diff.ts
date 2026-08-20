/**
 * Line-level text diff.
 *
 * Enough to render "what changed in this file" — a review card, a tool result, a config
 * preview — without a diff library. It is deliberately line-level: word- and
 * character-level diffing is a different problem with different trade-offs, and a
 * component that renders lines gains nothing from it.
 *
 * The shape is the familiar unified-diff one, because that is what consumers already know
 * how to render and because it is what a server-side producer would send.
 */

/** What happened to one line. */
export type DiffLineKind = 'context' | 'added' | 'removed';

/** One line of a diff, carrying both line numbers so a gutter can show either side. */
export interface DiffLine {
  kind: DiffLineKind;
  text: string;
  /** 1-based line number on the old side, or null for an added line. */
  oldLine: number | null;
  /** 1-based line number on the new side, or null for a removed line. */
  newLine: number | null;
}

/** A run of changed lines plus the context around it. */
export interface DiffHunk {
  /** 1-based first old-side line in this hunk; 0 when the old side is empty. */
  oldStart: number;
  oldLines: number;
  /** 1-based first new-side line in this hunk; 0 when the new side is empty. */
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

/** How to compute a diff. */
export interface DiffOptions {
  /** Unchanged lines kept either side of a change. Defaults to 3. */
  context?: number;
}

/**
 * Largest LCS table this will build, in cells.
 *
 * The table is quadratic, so an unbounded diff of two large files is a memory incident
 * rather than a slow render. Past the cap the result degrades to "all of the old side
 * removed, all of the new side added", which is honest — it is what a diff of two
 * unrelated files looks like anyway — instead of failing or hanging.
 */
const MAX_TABLE_CELLS = 4_000_000;

/**
 * Splits text into lines, treating a trailing newline as a terminator rather than as an
 * empty final line.
 *
 * @param text Text to split.
 * @returns Its lines; an empty string yields no lines.
 */
function toLines(text: string): string[] {
  if (text === '') return [];
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

/**
 * Longest-common-subsequence backtrace over two line arrays.
 *
 * @param a Old lines.
 * @param b New lines.
 * @returns Every line in order, tagged with what happened to it.
 */
function lcsDiff(a: readonly string[], b: readonly string[]): DiffLine[] {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = new Uint32Array(rows * cols);

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * cols + j] =
        a[i] === b[j]
          ? table[(i + 1) * cols + j + 1] + 1
          : Math.max(table[(i + 1) * cols + j], table[i * cols + j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ kind: 'context', text: a[i], oldLine: i + 1, newLine: j + 1 });
      i += 1;
      j += 1;
    } else if (table[(i + 1) * cols + j] >= table[i * cols + j + 1]) {
      out.push({ kind: 'removed', text: a[i], oldLine: i + 1, newLine: null });
      i += 1;
    } else {
      out.push({ kind: 'added', text: b[j], oldLine: null, newLine: j + 1 });
      j += 1;
    }
  }
  for (; i < a.length; i += 1) out.push({ kind: 'removed', text: a[i], oldLine: i + 1, newLine: null });
  for (; j < b.length; j += 1) out.push({ kind: 'added', text: b[j], oldLine: null, newLine: j + 1 });
  return out;
}

/**
 * Wholesale replacement, used when the table cap is exceeded.
 *
 * @param a Old lines.
 * @param b New lines.
 * @returns Every old line removed, then every new line added.
 */
function replaceAll(a: readonly string[], b: readonly string[]): DiffLine[] {
  return [
    ...a.map((text, index): DiffLine => ({ kind: 'removed', text, oldLine: index + 1, newLine: null })),
    ...b.map((text, index): DiffLine => ({ kind: 'added', text, oldLine: null, newLine: index + 1 })),
  ];
}

/**
 * Groups a tagged line list into hunks, keeping `context` unchanged lines around changes.
 *
 * @param lines Tagged lines in order.
 * @param context Unchanged lines to keep either side of a change.
 * @returns The hunks; empty when nothing changed.
 */
function toHunks(lines: readonly DiffLine[], context: number): DiffHunk[] {
  const changed = lines.map((line) => line.kind !== 'context');
  if (!changed.includes(true)) return [];

  const keep: boolean[] = Array.from({ length: lines.length }, () => false);
  changed.forEach((isChanged, index) => {
    if (!isChanged) return;
    for (let k = Math.max(0, index - context); k <= Math.min(lines.length - 1, index + context); k += 1) keep[k] = true;
  });

  const hunks: DiffHunk[] = [];
  let current: DiffLine[] = [];
  const flush = (): void => {
    if (current.length === 0) return;
    const oldNumbers = current.map((line) => line.oldLine).filter((n): n is number => n !== null);
    const newNumbers = current.map((line) => line.newLine).filter((n): n is number => n !== null);
    hunks.push({
      oldStart: oldNumbers[0] ?? 0,
      oldLines: oldNumbers.length,
      newStart: newNumbers[0] ?? 0,
      newLines: newNumbers.length,
      lines: current,
    });
    current = [];
  };

  keep.forEach((isKept, index) => {
    if (isKept) current.push(lines[index]);
    else flush();
  });
  flush();
  return hunks;
}

/**
 * Diffs two texts by line.
 *
 * A common prefix and suffix are matched directly, so a one-line edit in a large file
 * costs almost nothing; only the differing middle goes through the quadratic table. Past
 * {@link MAX_TABLE_CELLS} that middle degrades to a wholesale replacement rather than
 * allocating an unbounded table.
 *
 * @param oldText The text before. Pass `''` for a file being created.
 * @param newText The text after. Pass `''` for a file being deleted.
 * @param options Context size.
 * @returns Hunks in order; empty when the texts are identical.
 */
export function diffLines(oldText: string, newText: string, options: DiffOptions = {}): DiffHunk[] {
  const context = Math.max(0, options.context ?? 3);
  const a = toLines(oldText);
  const b = toLines(newText);

  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix += 1;
  let suffix = 0;
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) {
    suffix += 1;
  }

  const midA = a.slice(prefix, a.length - suffix);
  const midB = b.slice(prefix, b.length - suffix);
  const cells = (midA.length + 1) * (midB.length + 1);
  const middle = cells > MAX_TABLE_CELLS ? replaceAll(midA, midB) : lcsDiff(midA, midB);

  const lines: DiffLine[] = [
    ...a
      .slice(0, prefix)
      .map((text, index): DiffLine => ({ kind: 'context', text, oldLine: index + 1, newLine: index + 1 })),
    ...middle.map((line): DiffLine => ({
      ...line,
      oldLine: line.oldLine === null ? null : line.oldLine + prefix,
      newLine: line.newLine === null ? null : line.newLine + prefix,
    })),
    ...a.slice(a.length - suffix).map((text, index): DiffLine => ({
      kind: 'context',
      text,
      oldLine: a.length - suffix + index + 1,
      newLine: b.length - suffix + index + 1,
    })),
  ];

  return toHunks(lines, context);
}
