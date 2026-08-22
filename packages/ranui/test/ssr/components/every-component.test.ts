import { describe, expect, it } from 'vitest';
import { renderHTMLToString } from '@/utils/ssr-stream';
import { getSSRRegistry } from '@/utils/ssr-registry';
// The barrel, so a component added later is covered without editing this file.
import '../../../index';

/**
 * Tags whose server rendering this does not assert, each with a reason.
 *
 * Empty, and worth keeping empty. An exemption is a decision someone made and wrote down,
 * not a component that quietly stopped rendering — which is how `r-card` shipped throwing
 * on the server, from a compound selector the SSR mock could not match, with nothing to
 * notice it.
 *
 * The five this check first found are all fixed: three built a browser-only observer or
 * reached for `document` in their constructor, which server rendering never gets past, and
 * two were gaps in the mock rather than in the components.
 */
const EXEMPT: Record<string, string> = {};

const tags = [...getSSRRegistry().keys()].sort();

describe('every registered component server-renders', () => {
  it('reads the registry at all', () => {
    // A registry this test could not read would make every assertion below vacuously pass.
    expect(tags.length).toBeGreaterThan(20);
  });

  it.each(tags.filter((tag) => !(tag in EXEMPT)))('%s renders without throwing', async (tag) => {
    const html = await renderHTMLToString(`<${tag}></${tag}>`);
    expect(html).toContain(`<${tag}`);
  });
});
