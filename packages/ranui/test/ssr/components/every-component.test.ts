import { describe, expect, it } from 'vitest';
import { renderHTMLToString } from '@/utils/ssr-stream';
import { getSSRRegistry } from '@/utils/ssr-registry';
// The barrel, so a component added later is covered without editing this file.
import '../../../index';

/**
 * Tags whose server rendering this does not assert, each with a reason.
 *
 * An exemption is a decision someone made and wrote down, not a component that quietly
 * stopped rendering — which is exactly how `r-card` shipped throwing on the server, from a
 * compound selector the SSR mock could not match, with nothing to notice it.
 *
 * The four below fail today and are recorded rather than fixed here: three reach for a
 * browser global the server does not have, and one calls a slot method the mock does not
 * implement. Each is a decision about that component's own behaviour. What this list buys
 * meanwhile is that the number cannot grow silently.
 */
const EXEMPT: Record<string, string> = {
  'r-content': 'Constructs a MutationObserver, which the server has none of.',
  'r-link': 'Reaches for `document` while constructing.',
  'r-modal': 'Calls `assignedNodes()` on a slot; the SSR mock does not implement it.',
  'r-radar': 'Constructs a ResizeObserver, which the server has none of.',
};

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
