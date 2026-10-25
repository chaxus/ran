import { format } from 'prettier';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Rule indexes and the graded sources each one lists. A file joins a list once every normative
 * sentence in it carries an ID. `links` is the index's relative path to its sources' rendered pages.
 */
export const ruleIndexes = [
  {
    path: 'design/RULES.md',
    sources: ['design/DESIGN.md', 'design/INTERACTION.md', 'design/ACCEPTANCE.md', 'design/WORKFLOW_PATTERNS.md'],
    links: './',
    portable: true,
  },
  {
    path: 'packages/ranui/docs/adapters/RULES.md',
    sources: ['packages/ranui/docs/adapters/DESIGN.md'],
    links: '../',
    portable: false,
  },
];
const verifierPath = 'packages/ranui/bin/verify-design-rules.ts';
/** Adapter sources and the portable page bin/sync-design-docs.ts appends them to. */
const appendedTo: Record<string, string> = { 'packages/ranui/docs/adapters/DESIGN.md': 'design/DESIGN.md' };

export type Level = 'MUST' | 'SHOULD' | 'MAY';
export interface Rule {
  id: string;
  level: Level;
  text: string;
  proof?: string;
  source: string;
  section: string;
  line: number;
}

const RULE_START = /^- \*\*([A-Z]+(?:-[A-Z]+)*-\d+) · (MUST|SHOULD|MAY)\*\* (.+)$/;
const PROOF = /\s*_Proof: (.+?)_\s*$/;
// 看起来像规则标签、但没对上 RULE_START 的行，多半是手误（等级小写、分隔符写错）。
const TAG_LIKE = /^\s*- \*\*[A-Z]+-/;
// 规则条目之外出现这些词，说明有规范性句子漏标了等级。
// 全大写的 MUST/SHOULD 是等级名本身，不算漏标。祈使句（"Use …"）无法机械识别，靠评审。
// 标题不检查：已有锚点被别处链接，改标题会断链。
const NORMATIVE = /\b([Mm]ust|[Nn]ever|[Aa]lways|[Ss]hould|[Ss]hall|[Dd]o not|[Dd]on['’]t)\b/;
const proofKinds = new Set(['browser', 'recording', 'review', 'unit']);

/** GitHub-style heading anchor, without the duplicate suffix. */
export const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');

/** Heading anchor counts of a document, so a source appended to it gets the anchors of the combined page. */
export function headingAnchors(content: string): Map<string, number> {
  const anchors = new Map<string, number>();
  let fence = '';
  for (const line of content.split(/\r?\n/)) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (marker && (!fence || marker.startsWith(fence))) fence = fence ? '' : marker;
    const heading = !fence && line.match(/^#{1,6} (.+)$/);
    if (heading) anchors.set(slug(heading[1]!), (anchors.get(slug(heading[1]!)) ?? 0) + 1);
  }
  return anchors;
}

/** Parse one graded source; returns its rules and every problem found. */
export function parseRules(
  source: string,
  content: string,
  anchors = new Map<string, number>(),
): { rules: Rule[]; problems: string[] } {
  const rules: Rule[] = [];
  const problems: string[] = [];
  let section = '';
  let fence = '';
  let comment = false;
  let current: Rule | undefined;
  const close = () => {
    if (!current) return;
    const proof = current.text.match(PROOF);
    if (proof) {
      current.proof = proof[1]!.trim();
      current.text = current.text.replace(PROOF, '');
    }
    if (current.text.includes('_Proof:'))
      problems.push(`${current.source}:${current.line} ${current.id}: the proof ends the rule`);
    rules.push(current);
    current = undefined;
  };
  content.split(/\r?\n/).forEach((line, index) => {
    const at = `${source}:${index + 1}`;
    // 只有同种、不短于开头的围栏才算闭合。
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (marker && (!fence || marker.startsWith(fence))) {
      fence = fence ? '' : marker;
      return;
    }
    if (fence) return;
    if (comment || line.trimStart().startsWith('<!--')) {
      comment = !line.includes('-->');
      return;
    }
    if (current && /^ {2}\S/.test(line) && !/^ {2}[-*+] /.test(line)) {
      current.text += ` ${line.trim()}`;
      return;
    }
    close();
    const heading = line.match(/^#{1,6} (.+)$/);
    if (heading) {
      const base = slug(heading[1]!);
      const seen = anchors.get(base) ?? 0;
      anchors.set(base, seen + 1);
      section = seen ? `${base}-${seen}` : base;
      return;
    }
    const start = line.match(RULE_START);
    if (start) {
      if (!section) problems.push(`${at}: a rule needs a section heading above it`);
      current = { id: start[1]!, level: start[2] as Level, text: start[3]!, source, section, line: index + 1 };
      return;
    }
    if (TAG_LIKE.test(line))
      problems.push(`${at}: malformed rule tag (expected "- **ID-1 · MUST** …"): ${line.trim()}`);
    else if (/^ +\S/.test(line) && !/^ {0,3}[|>]/.test(line))
      problems.push(`${at}: indented text belongs to no rule (nested list or a gap after the rule): ${line.trim()}`);
    else if (NORMATIVE.test(line)) problems.push(`${at}: normative wording outside a graded rule: ${line.trim()}`);
  });
  close();
  return { rules, problems };
}

/** Validate IDs, levels and proofs across every graded source. */
export function checkRules(rules: Rule[], root: string): string[] {
  const problems: string[] = [];
  const verifier = readFileSync(path.join(root, verifierPath), 'utf8');
  const checks = new Set([...verifier.matchAll(/^\s*id: '([a-z-]+)'/gm)].map((match) => match[1]));
  const seen = new Map<string, Rule>();
  for (const rule of rules) {
    const at = `${rule.source}:${rule.line} ${rule.id}`;
    const first = seen.get(rule.id);
    if (first) problems.push(`${at}: duplicate ID, first used at ${first.source}:${first.line}`);
    seen.set(rule.id, rule);
    if (rule.level !== 'MUST') {
      if (rule.proof) problems.push(`${at}: only MUST rules name a proof`);
      continue;
    }
    if (!rule.proof) {
      problems.push(
        `${at}: a MUST rule names its proof (_Proof: browser|recording|review|unit|check:<id>|test:<path>_)`,
      );
      continue;
    }
    for (const proof of rule.proof.split(/,\s*/)) {
      const [kind, target] = proof.split(/:(.*)/s);
      if (kind === 'check' && target) {
        if (!checks.has(target)) problems.push(`${at}: unknown verify:design rule ${target}`);
      } else if (kind === 'test' && target) {
        if (!existsSync(path.join(root, target))) problems.push(`${at}: missing test ${target}`);
      } else if (!proofKinds.has(proof)) problems.push(`${at}: unknown proof ${proof}`);
    }
  }
  return problems;
}

/** Render the rule index from the graded sources. */
export function renderIndex(rules: Rule[], links = './', portable = true): string {
  const cell = (text: string) => text.replaceAll('|', '\\|');
  const counts = (['MUST', 'SHOULD', 'MAY'] as const).map(
    (level) => `${rules.filter((rule) => rule.level === level).length} ${level}`,
  );
  const rows = rules.map((rule) => {
    const link = `${links}${path.basename(rule.source)}#${rule.section}`;
    // A same-page anchor in the rule's source points into that source from here.
    const text = rule.text.replace(/\]\(#/g, `](${links}${path.basename(rule.source)}#`);
    return `| [${rule.id}](${link}) | ${rule.level} | ${cell(text)} | ${rule.proof ?? ''} |`;
  });
  const banner =
    '<!-- Generated by bin/design-rules.ts from the graded design sources. Edit the sources, then run sync:design. -->';
  const table = ['| ID | Level | Rule | Proof |', '| --- | --- | --- | --- |', ...rows, ''];
  if (!portable)
    return [
      banner,
      '',
      '## ranui adapter rules',
      '',
      `ranui-specific rules (${counts.join(', ')}).`,
      '',
      ...table,
    ].join('\n');
  return [
    banner,
    '',
    '# Rule index',
    '',
    `Every graded rule, with its level and proof (${counts.join(', ')}). Open a rule's ID for its section.`,
    '',
    'Proof kinds: **browser** — real browser interaction ([browser proof](./ACCEPTANCE.md#browser-proof));',
    '**recording** — continuous recording ([motion over time](./ACCEPTANCE.md#review-motion-over-time));',
    '**unit** — a unit or state test in the host; **review** — inspection of the change itself;',
    '`check:<id>` — a `verify:design` rule; `test:<path>` — a named test (paths from the repository root).',
    '',
    ...table,
  ].join('\n');
}

function parseSources(root: string, sources: string[]): { rules: Rule[]; problems: string[] } {
  const rules: Rule[] = [];
  const problems: string[] = [];
  for (const source of sources) {
    const base = appendedTo[source];
    const anchors = base ? headingAnchors(readFileSync(path.join(root, base), 'utf8')) : undefined;
    const parsed = parseRules(source, readFileSync(path.join(root, source), 'utf8'), anchors);
    rules.push(...parsed.rules);
    problems.push(...parsed.problems);
  }
  return { rules, problems };
}

/** Every graded rule across all indexes, with every problem; IDs are unique across indexes. */
export function collectRules(root: string): { rules: Rule[]; problems: string[] } {
  const { rules, problems } = parseSources(
    root,
    ruleIndexes.flatMap((index) => index.sources),
  );
  problems.push(...checkRules(rules, root));
  return { rules, problems };
}

export async function syncRules(root: string, check: boolean): Promise<void> {
  const { rules, problems } = collectRules(root);
  if (problems.length) throw new Error(`Design rule problems:\n${problems.join('\n')}`);
  for (const index of ruleIndexes) {
    const own = rules.filter((rule) => index.sources.includes(rule.source));
    const expected = await format(renderIndex(own, index.links, index.portable), {
      parser: 'markdown',
      printWidth: 120,
    });
    const target = path.join(root, index.path);
    if (!check) writeFileSync(target, expected);
    else if (!existsSync(target) || readFileSync(target, 'utf8') !== expected)
      throw new Error(`${index.path} is stale; run sync:design.`);
  }
}

/** Problems in one source on its own, for grading a file before it joins an index. */
export function lintSource(root: string, source: string): string[] {
  const { rules, problems } = parseSources(root, [source]);
  return [...problems, ...checkRules(rules, root)];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const args = process.argv.slice(2);
  if (args[0] === '--lint' && args.length === 2) {
    const problems = lintSource(root, args[1]!);
    console.log(problems.length ? problems.join('\n') : `${args[1]}: no problems.`);
    process.exitCode = problems.length ? 1 : 0;
  } else if (args.every((arg) => arg === '--check')) {
    await syncRules(root, args.includes('--check'));
    console.log(`Design rules ${args.includes('--check') ? 'verified' : 'indexed'}.`);
  } else throw new Error('Usage: node bin/design-rules.ts [--check | --lint <source>]');
}
