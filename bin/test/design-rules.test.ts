import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkRules,
  collectRules,
  headingAnchors,
  lintSource,
  parseRules,
  renderIndex,
  ruleIndexes,
  syncRules,
} from '../design-rules.ts';
const repo = fileURLToPath(new URL('../../', import.meta.url));

const graded = (body: string) => `# Interaction standard\n\n## 1. Inputs\n\n${body}\n`;

test('the repository rules are graded, unique, proven and indexed', async () => {
  const { rules, problems } = collectRules(repo);
  assert.deepEqual(problems, []);
  assert.ok(rules.length > 0);
  await syncRules(repo, true);
});

test('normative wording outside a graded rule is rejected, in tables too; code and the level names are not', () => {
  const { problems } = parseRules(
    'design/X.md',
    graded(
      [
        'MUST and SHOULD name the levels.',
        '| Case | Restore only repopulates |',
        '```',
        'never inside code',
        '```',
        'A preview should match its file.',
      ].join('\n'),
    ),
  );
  assert.equal(problems.length, 1);
  assert.match(problems[0]!, /design\/X\.md:10: normative wording outside a graded rule/);
});

test('a rule keeps its continuation lines, section anchor and proof', () => {
  const { rules, problems } = parseRules(
    'design/X.md',
    graded('- **X-IN-1 · MUST** Submit dispatches\n  once. _Proof: unit_\n- **X-IN-2 · SHOULD** Keep labels near.'),
  );
  assert.deepEqual(problems, []);
  assert.deepEqual(
    rules.map(({ id, level, text, proof, section }) => ({ id, level, text, proof, section })),
    [
      { id: 'X-IN-1', level: 'MUST', text: 'Submit dispatches once.', proof: 'unit', section: '1-inputs' },
      { id: 'X-IN-2', level: 'SHOULD', text: 'Keep labels near.', proof: undefined, section: '1-inputs' },
    ],
  );
  assert.match(
    renderIndex(rules),
    /\| \[X-IN-1\]\(\.\/X\.md#1-inputs\) \| MUST \| Submit dispatches once\. \| unit \|/,
  );
});

test('a same-page anchor in a rule points back into its source from the index', () => {
  const { rules } = parseRules('design/X.md', graded('- **X-IN-1 · SHOULD** See [wording](#words).'));
  assert.match(renderIndex(rules), /See \[wording\]\(\.\/X\.md#words\)\./);
  assert.match(renderIndex(rules, '../', false), /See \[wording\]\(\.\.\/X\.md#words\)\./);
});

test('missing, unknown or misplaced proofs and duplicate IDs are reported', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ran-design-rules-'));
  try {
    mkdirSync(path.join(root, 'packages/ranui/bin'), { recursive: true });
    writeFileSync(path.join(root, 'packages/ranui/bin/verify-design-rules.ts'), "  id: 'bare-colour',\n");
    const { rules } = parseRules(
      'design/X.md',
      graded(
        [
          '- **X-IN-1 · MUST** No proof.',
          '- **X-IN-2 · MUST** Known check. _Proof: check:bare-colour_',
          '- **X-IN-3 · MUST** Unknown check. _Proof: check:no-such-rule_',
          '- **X-IN-4 · MUST** Missing test. _Proof: test:missing.test.ts_',
          '- **X-IN-5 · SHOULD** Proof on a default. _Proof: review_',
          '- **X-IN-2 · MAY** Duplicate.',
        ].join('\n'),
      ),
    );
    const problems = checkRules(rules, root);
    assert.equal(problems.length, 5);
    for (const [id, reason] of [
      ['X-IN-1', /names its proof/],
      ['X-IN-3', /unknown verify:design rule no-such-rule/],
      ['X-IN-4', /missing test missing\.test\.ts/],
      ['X-IN-5', /only MUST rules name a proof/],
      ['X-IN-2', /duplicate ID/],
    ] as const)
      assert.ok(
        problems.some((problem) => problem.includes(id) && reason.test(problem)),
        `${id} ${reason}`,
      );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('CRLF sources parse like LF sources', () => {
  const lf = graded('- **X-IN-1 · MUST** Dispatch once. _Proof: unit_');
  const { rules, problems } = parseRules('design/X.md', lf.replaceAll('\n', '\r\n'));
  assert.deepEqual(problems, []);
  assert.deepEqual(
    rules.map((rule) => [rule.id, rule.proof]),
    [['X-IN-1', 'unit']],
  );
});

test('typos, nested lists, detached continuations and mid-rule proofs are reported, comments are not', () => {
  const { rules, problems } = parseRules(
    'design/X.md',
    graded(
      [
        '<!-- a comment that says never -->',
        '- **X-IN-1 - MUST** Wrong separator.',
        '- **X-IN-2 · must** Lower-case level.',
        '- **X-IN-3 · MUST** Parent.',
        '  - a nested child that must hide nothing',
        '- **X-IN-4 · MUST** Detached.',
        '',
        '  _Proof: unit_',
        '- **X-IN-5 · SHOULD** Mid _Proof: review_ rule.',
      ].join('\n'),
    ),
  );
  assert.deepEqual(
    rules.map((rule) => rule.id),
    ['X-IN-3', 'X-IN-4', 'X-IN-5'],
  );
  for (const reason of [
    /:6: malformed rule tag/,
    /:7: malformed rule tag/,
    /:9: indented text belongs to no rule/,
    /:12: indented text belongs to no rule/,
    /X-IN-5: the proof ends the rule/,
  ])
    assert.ok(
      problems.some((problem) => reason.test(problem)),
      String(reason),
    );
  assert.equal(problems.length, 5);
});

test('several proofs, underscores in paths, pipes and duplicate headings render correctly', () => {
  const { rules } = parseRules(
    'design/X.md',
    [
      '# X',
      '## Same_name',
      '- **X-A-1 · MUST** A | B. _Proof: unit, test:bin/test/a_b.test.ts_',
      '## Same_name',
      '- **X-A-2 · MAY** Again.',
    ].join('\n'),
  );
  assert.deepEqual(
    rules.map(({ section, proof }) => [section, proof]),
    [
      ['same_name', 'unit, test:bin/test/a_b.test.ts'],
      ['same_name-1', undefined],
    ],
  );
  assert.match(renderIndex(rules), /\| A \\\| B\. \| unit, test:bin\/test\/a_b\.test\.ts \|/);
});

test('the index check rejects a stale index and regeneration repairs it', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ran-design-index-'));
  try {
    mkdirSync(path.join(root, 'packages/ranui/bin'), { recursive: true });
    mkdirSync(path.join(root, 'packages/ranui/docs/adapters'), { recursive: true });
    mkdirSync(path.join(root, 'design'));
    writeFileSync(path.join(root, 'packages/ranui/bin/verify-design-rules.ts'), '');
    for (const source of ruleIndexes.flatMap((index) => index.sources))
      writeFileSync(path.join(root, source), graded(''));
    writeFileSync(path.join(root, 'design/INTERACTION.md'), graded('- **X-IN-1 · SHOULD** Keep labels near.'));
    await syncRules(root, false);
    await syncRules(root, true);
    writeFileSync(path.join(root, 'design/INTERACTION.md'), graded('- **X-IN-1 · MAY** Keep labels near.'));
    await assert.rejects(syncRules(root, true), /RULES\.md is stale/);
    await syncRules(root, false);
    await syncRules(root, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('table cells are linted and a fence closes only on its own marker', () => {
  const { problems } = parseRules(
    'design/X.md',
    graded(
      ['| Case | Restore must not submit |', '```', '~~~', 'never, still code', '```', 'after code, never'].join('\n'),
    ),
  );
  assert.deepEqual(
    problems.map((problem) => problem.match(/:(\d+):/)?.[1]),
    ['5', '10'],
  );
});

test('an adapter appended to a page takes the anchors of the combined page', () => {
  const anchors = headingAnchors('# Ran\n## Rules\n```\n## not a heading\n```\n');
  const { rules } = parseRules('adapters/DESIGN.md', '## Rules\n- **R-A-1 · MAY** Optional.', anchors);
  assert.equal(rules[0]!.section, 'rules-1');
});

test('IDs are unique across indexes, and a single source can be linted alone', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ran-design-ids-'));
  try {
    mkdirSync(path.join(root, 'packages/ranui/bin'), { recursive: true });
    mkdirSync(path.join(root, 'packages/ranui/docs/adapters'), { recursive: true });
    mkdirSync(path.join(root, 'design'));
    writeFileSync(path.join(root, 'packages/ranui/bin/verify-design-rules.ts'), '');
    for (const source of ruleIndexes.flatMap((index) => index.sources))
      writeFileSync(path.join(root, source), graded(''));
    writeFileSync(path.join(root, 'design/DESIGN.md'), graded('- **D-A-1 · MAY** Portable.'));
    writeFileSync(path.join(root, 'packages/ranui/docs/adapters/DESIGN.md'), graded('- **D-A-1 · MAY** Adapter.'));
    assert.ok(collectRules(root).problems.some((problem) => /D-A-1: duplicate ID/.test(problem)));
    assert.deepEqual(lintSource(root, 'design/DESIGN.md'), []);
    writeFileSync(path.join(root, 'design/DRAFT.md'), graded('A draft rule must be graded.'));
    assert.equal(lintSource(root, 'design/DRAFT.md').length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
