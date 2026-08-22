/**
 * Executable half of the ranui design standard.
 *
 * `docs/DESIGN.md` and `CLAUDE.md` state a set of non-negotiable rules — semantic tokens
 * over raw colour, fallbacks that flip with the theme, the spacing and sizing scales,
 * Pointer Events for anything draggable. Prose alone cannot enforce them: a rule only
 * holds while whoever is editing has read that paragraph, which for an agent-edited
 * component library is not a safe assumption.
 *
 * Each rule below reports `file:line` occurrences. Existing violations are recorded per
 * file in `docs/design-rule-baseline.json` and act as a ratchet: a count that rises fails
 * as a new violation, and a count that falls fails as a stale baseline that must be
 * lowered. Neither direction can drift silently, and no rule is ever globally disabled.
 *
 * Usage:
 *   tsx ./bin/verify-design-rules.ts                    check (what CI runs)
 *   tsx ./bin/verify-design-rules.ts --update-baseline  re-record counts after fixing
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const COMPONENTS_DIR = path.join(ROOT, 'components');
const BASELINE_FILE = path.join(ROOT, 'docs', 'design-rule-baseline.json');
const UPDATE = process.argv.includes('--update-baseline');

interface Violation {
  file: string;
  line: number;
  text: string;
}

interface Rule {
  id: string;
  /** What the rule enforces, shown when it fires. */
  summary: string;
  /** What to do about a violation, shown when it fires. */
  fix: string;
  /** Extensions this rule reads. */
  extensions: string[];
  /**
   * Directories this rule scans, relative to the package root. Defaults to `components`.
   *
   * Most rules are about component discipline and have no business in the demo's own
   * stylesheet. `undefined-token-fallback` is different: a dead token reference is simply
   * wrong wherever it is written, and the demo is where five of them were hiding.
   */
  roots?: string[];
  /**
   * @param source File contents.
   * @param file Path relative to the ranui package root, POSIX separators.
   * @returns Every violation in this file.
   */
  scan: (source: string, file: string) => Violation[];
}

/** Colour literal in any CSS notation. */
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^()]*\)|\bhsla?\([^()]*\)/g;
/** `var(--token, fallback)`; the fallback may nest one level of parentheses. */
const VAR_WITH_FALLBACK = /var\(\s*(--[a-zA-Z0-9-]+)\s*,\s*((?:[^()]|\([^()]*\))*)\)/g;
/** A colour that is fully transparent flips with any theme, so it is never unsafe. */
const FULLY_TRANSPARENT = /\brgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0*\.?0+\s*\)/;

/**
 * Strips comments so a rule never fires on prose that merely names an event or colour.
 *
 * @param source File contents.
 * @returns The same text with `//` and block comments blanked, line count preserved.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, lead: string) => lead + ' '.repeat(m.length - lead.length));
}

/**
 * Splits into lines once, so every rule reports the same line numbers.
 *
 * @param source File contents.
 * @returns Comment-free lines, 0-indexed.
 */
function lines(source: string): string[] {
  return stripComments(source).split('\n');
}

/** Global design tokens, as declared by the theme. */
const THEME_TOKENS = path.join(ROOT, 'theme', 'tokens.less');

/**
 * Every `--ran-*` custom property the theme defines.
 *
 * Read from the theme rather than hard-coded: a token added there must not need this file
 * edited too, and a rule carrying its own copy of the list is a rule that goes stale.
 * Loaded once by {@link main} because `Rule.scan` is synchronous.
 */
let themeTokens = new Set<string>();

/**
 * Reads the theme's token declarations.
 *
 * @returns The declared `--ran-*` names.
 */
async function loadThemeTokens(): Promise<Set<string>> {
  const source = await fs.readFile(THEME_TOKENS, 'utf8');
  return new Set([...source.matchAll(/^\s*(--ran-[a-z0-9-]+)\s*:/gm)].map((match) => match[1]));
}

const RULES: Rule[] = [
  {
    id: 'dark-unsafe-fallback',
    summary: "a component token's colour fallback is a light-only literal",
    fix: 'Point the fallback at a token that flips with the theme — `var(--ran-color-text, var(--ran-gray-1000))` — rather than a fixed colour that stays light in dark mode.',
    extensions: ['.less'],
    scan(source, file) {
      const out: Violation[] = [];
      lines(source).forEach((line, i) => {
        for (const m of line.matchAll(VAR_WITH_FALLBACK)) {
          const fallback = m[2].trim();
          if (!COLOUR.test(fallback)) continue;
          COLOUR.lastIndex = 0;
          if (fallback.includes('var(') || FULLY_TRANSPARENT.test(fallback)) continue;
          out.push({ file, line: i + 1, text: `${m[1]} → ${fallback}` });
        }
      });
      return out;
    },
  },
  {
    id: 'bare-colour',
    summary: 'a raw colour literal is used outside a token fallback',
    fix: 'Use a semantic token (`--ran-color-*`) so the value follows the theme. A genuinely decorative colour still belongs in a component token with its own fallback.',
    extensions: ['.less'],
    scan(source, file) {
      const out: Violation[] = [];
      lines(source).forEach((line, i) => {
        const covered = [...line.matchAll(VAR_WITH_FALLBACK)].map((m) => {
          const start = m.index + m[0].length - 1 - m[2].length;
          return [start, start + m[2].length] as const;
        });
        for (const m of line.matchAll(COLOUR)) {
          const start = m.index;
          const end = start + m[0].length;
          if (covered.some(([a, b]) => a <= start && end <= b)) continue;
          if (FULLY_TRANSPARENT.test(m[0])) continue;
          out.push({ file, line: i + 1, text: m[0] });
        }
      });
      return out;
    },
  },
  {
    id: 'spacing-scale',
    summary: 'spacing uses a literal length instead of the `--ran-space-*` scale',
    fix: 'Use `var(--ran-space-N)`. The scale is 4px-based with nine steps; a one-off inset that is genuinely not shared belongs in a component token with its own fallback.',
    extensions: ['.less'],
    scan(source, file) {
      const property = /^\s*(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left))?\s*:\s*([^;]+);/;
      const exempt = /^(0|auto|inherit|unset|initial|revert)$/;
      const out: Violation[] = [];
      lines(source).forEach((line, i) => {
        const m = property.exec(line);
        if (!m) return;
        const value = m[4].trim();
        if (value.includes('var(--')) return;
        if (value.split(/\s+/).every((part) => exempt.test(part))) return;
        out.push({ file, line: i + 1, text: `${m[1]}${m[2] ?? ''}: ${value}` });
      });
      return out;
    },
  },
  {
    id: 'sizing-scale',
    summary: 'an intrinsic dimension is drawn from the spacing scale',
    fix: 'Intrinsic dimensions use `--ran-size-*`. The two scales have different ranges and progressions, so consumers need to retune one without perturbing the other.',
    extensions: ['.less'],
    scan(source, file) {
      const property =
        /^\s*(width|height|min-width|min-height|max-width|max-height|font-size|line-height|border-radius)\s*:\s*([^;]+);/;
      const out: Violation[] = [];
      lines(source).forEach((line, i) => {
        const m = property.exec(line);
        if (!m || !m[2].includes('var(--ran-space-')) return;
        out.push({ file, line: i + 1, text: `${m[1]}: ${m[2].trim()}` });
      });
      return out;
    },
  },
  {
    id: 'mouse-only-drag',
    summary: 'a drag loop is driven by mouse events with no Pointer Events path',
    fix: 'Drive drags with `pointerdown`/`pointermove`/`pointerup`/`pointercancel` plus `setPointerCapture`, and set `touch-action: none` on the drag surface. A `mousemove`-driven drag simply does not work on touch.',
    extensions: ['.ts'],
    scan(source, file) {
      const body = stripComments(source);
      if (!body.includes('mousemove') || body.includes('pointermove')) return [];
      const out: Violation[] = [];
      body.split('\n').forEach((line, i) => {
        if (line.includes('mousemove')) out.push({ file, line: i + 1, text: line.trim().slice(0, 90) });
      });
      return out;
    },
  },
  {
    id: 'hidden-inert',
    summary: 'a `:host` display rule makes the standard `hidden` attribute do nothing',
    fix: "Add `:host([hidden]) { display: none; }`. The UA stylesheet's `[hidden] { display: none }` is a user-agent rule, and any author `display` on `:host` outranks it — so `element.hidden = true` silently leaves the element on screen.",
    extensions: ['.less'],
    scan(source, file) {
      const stripped = stripComments(source);
      // Only a `:host` rule with no condition; `:host([open])` and friends are states the
      // element already controls, and none of them can shadow the `hidden` attribute.
      const displays = lines(stripped)
        .map((line, i) => ({ line, i }))
        .filter(({ line }) => /^\s*display:\s*(block|flex|grid|inline-block|inline-flex|inline-grid)\s*;/.test(line));
      if (displays.length === 0) return [];
      if (!/^:host\s*\{/m.test(stripped)) return [];
      if (/:host\(\[hidden\]\)/.test(stripped)) return [];
      const first = displays[0];
      return [{ file, line: first.i + 1, text: first.line.trim() }];
    },
  },
  {
    id: 'undefined-token-fallback',
    summary: 'a component token falls back to a `--ran-*` token the theme never defines',
    fix: "Point the fallback at a token that exists — `grep -- '--ran-color-' theme/tokens.less` lists them. A `var()` naming an undeclared property resolves to nothing at all: the declaration is dropped and the element silently keeps whatever it inherited, which for a colour is usually the body text colour and looks almost right.",
    extensions: ['.less', '.css'],
    roots: ['components', 'demo', 'theme'],
    scan(source, file) {
      const out: Violation[] = [];
      lines(stripComments(source)).forEach((line, i) => {
        // Every `var()` on the line, with whatever follows the name up to the closing paren.
        for (const match of line.matchAll(/var\(\s*(--ran-[a-zA-Z0-9-]+)\s*(,([^;]*))?\)/g)) {
          const [, name, , fallback] = match;
          if (fallback === undefined) {
            // No fallback: the reference is the whole chain, so the name must resolve. A
            // component's own override hook is always written with one.
            if (!themeTokens.has(name)) out.push({ file, line: i + 1, text: `${name} (undeclared, no fallback)` });
            continue;
          }
          // A fallback that is itself a bare `var(--ran-…)` ends the chain, so it has to
          // resolve. One with its own fallback is seen on its own by the pass above.
          const inner = /^\s*var\(\s*(--ran-[a-zA-Z0-9-]+)\s*\)\s*$/.exec(fallback);
          if (inner === null) continue;
          if (themeTokens.has(inner[1])) continue;
          out.push({ file, line: i + 1, text: `${name} → ${inner[1]} (undeclared)` });
        }
      });
      return out;
    },
  },
];

/**
 * Collects files under `components/` that a rule reads.
 *
 * @param extensions Extensions to include, with the leading dot.
 * @returns Paths relative to the ranui package root, POSIX separators, sorted.
 */
async function collect(extensions: string[], roots: string[] = ['components']): Promise<string[]> {
  const out: string[] = [];
  const walk = async (dir: string): Promise<void> => {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      // Build output is a copy of the source with every violation already counted once.
      if (entry.name === 'dist' || entry.name === 'node_modules') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (extensions.includes(path.extname(entry.name)) && !entry.name.endsWith('.test.ts')) {
        out.push(path.relative(ROOT, full).split(path.sep).join('/'));
      }
    }
  };
  for (const root of roots) await walk(path.join(ROOT, root));
  return out.sort();
}

interface Baseline {
  /** Why this file exists, for anyone who opens it before reading the linter. */
  $comment: string;
  /** Known violation counts, keyed by rule id then by file path. */
  rules: Record<string, Record<string, number>>;
}

const BASELINE_COMMENT =
  'Known design-rule violations, recorded per file by bin/verify-design-rules.ts. ' +
  'This is a ratchet, not an allowlist: a count that rises fails as a new violation, ' +
  'and a count that falls fails until it is lowered here, so a fix cannot regress later. ' +
  'Do not edit by hand — run `pnpm -F ranui verify:design --update-baseline`. ' +
  'The rules themselves are stated in docs/DESIGN.md and CLAUDE.md.';

/**
 * Entry point: scans every rule, then either rewrites the baseline or compares against it.
 */
async function main(): Promise<void> {
  themeTokens = await loadThemeTokens();
  const found = new Map<string, Violation[]>();
  for (const rule of RULES) {
    const violations: Violation[] = [];
    for (const file of await collect(rule.extensions, rule.roots)) {
      violations.push(...rule.scan(await fs.readFile(path.join(ROOT, file), 'utf8'), file));
    }
    found.set(rule.id, violations);
  }

  const counts: Baseline['rules'] = {};
  for (const rule of RULES) {
    const perFile: Record<string, number> = {};
    for (const v of found.get(rule.id) ?? []) perFile[v.file] = (perFile[v.file] ?? 0) + 1;
    counts[rule.id] = Object.fromEntries(Object.entries(perFile).sort(([a], [b]) => a.localeCompare(b)));
  }

  if (UPDATE) {
    const next: Baseline = { $comment: BASELINE_COMMENT, rules: counts };
    await fs.writeFile(BASELINE_FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    const total = Object.values(counts).reduce((n, r) => n + Object.values(r).reduce((a, b) => a + b, 0), 0);
    console.log(`Recorded ${total} known violation(s) in ${path.relative(ROOT, BASELINE_FILE)}`);
    return;
  }

  const baseline = (JSON.parse(await fs.readFile(BASELINE_FILE, 'utf8')) as Baseline).rules;
  let failed = false;

  for (const rule of RULES) {
    const actual = counts[rule.id];
    const allowed = baseline[rule.id] ?? {};
    const added: string[] = [];
    const fixed: string[] = [];

    for (const file of new Set([...Object.keys(actual), ...Object.keys(allowed)])) {
      const now = actual[file] ?? 0;
      const was = allowed[file] ?? 0;
      if (now > was) added.push(`${file} (${was} → ${now})`);
      else if (now < was) fixed.push(`${file} (${was} → ${now})`);
    }

    if (added.length) {
      failed = true;
      console.error(`\n✗ ${rule.id}: ${rule.summary}`);
      for (const file of added) console.error(`    ${file}`);
      for (const v of found.get(rule.id) ?? []) {
        if (added.some((a) => a.startsWith(`${v.file} `))) console.error(`      ${v.file}:${v.line}  ${v.text}`);
      }
      console.error(`  → ${rule.fix}`);
    }

    if (fixed.length) {
      failed = true;
      console.error(`\n✗ ${rule.id}: baseline is stale — ${fixed.length} file(s) improved.`);
      for (const file of fixed) console.error(`    ${file}`);
      console.error('  → Lower it with `pnpm -F ranui verify:design --update-baseline` so the gain is locked in.');
    }
  }

  if (failed) {
    console.error('\nRules and rationale: docs/DESIGN.md · CLAUDE.md');
    process.exit(1);
  }

  const known = Object.values(baseline).reduce((n, r) => n + Object.values(r).reduce((a, b) => a + b, 0), 0);
  console.log(`Design rules: ${RULES.length} checked, no new violations (${known} known, recorded in the baseline).`);
}

main().catch((error) => {
  console.error('[design-rules] check failed');
  console.error(error);
  process.exit(1);
});
