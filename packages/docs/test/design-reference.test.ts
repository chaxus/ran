import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { designReferenceMarkdown, githubSlug } from '../build/design-reference.ts';
import { DESIGN_REFERENCE } from '../build/langs/design-pages.ts';

const DESIGN = resolve(import.meta.dirname, '../../../design');

describe('the Ran Design reference pages', () => {
  it('slugs headings exactly like the rule index does', async () => {
    // Outside this package's sources, so loaded at runtime rather than type-checked here.
    const owner = pathToFileURL(resolve(import.meta.dirname, '../../../bin/design-rules.ts')).href;
    const { slug } = (await import(owner)) as { slug: (heading: string) => string };
    for (const { file } of DESIGN_REFERENCE)
      for (const [, heading] of readFileSync(resolve(DESIGN, file), 'utf8').matchAll(/^#{1,6} (.+)$/gm))
        expect(githubSlug(heading!), heading).toBe(slug(heading!));
  });

  it.each(DESIGN_REFERENCE.map(({ file }) => file))('keeps %s readers on the site', (file) => {
    const page = designReferenceMarkdown(DESIGN, file);
    // No link to another reference file survives as a file path.
    expect(page).not.toMatch(/\]\((?:\.\/)?(?:DESIGN|INTERACTION|ACCEPTANCE|WORKFLOW_PATTERNS|RULES)\.md/);
    // Files that are not published here go to GitHub, where they are maintained.
    expect(page).not.toMatch(/\]\(\.\/[A-Z_]+\.md/);
    expect(page).toContain(`https://github.com/chaxus/ran/blob/main/design/${file}`);
  });

  it('rewrites a GitHub anchor to the heading anchor this site renders', () => {
    const page = designReferenceMarkdown(DESIGN, 'RULES.md');
    expect(page).toContain('](/src/design/composition#_9-composition-—-the-page-not-the-component)');
  });
});
