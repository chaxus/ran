import { expect, it } from 'vitest';
import { firstExample, parseControls } from '../build/playground.ts';

const REFERENCE = `## \`<r-demo>\`

Source: \`components/demo/index.ts\`

- **Attributes**: \`aria-label\`, \`disabled: boolean | string\`, \`effect: boolean\`, \`iconSize: string\`, \`mode: 'a' | 'b'\`, \`sheet: string\`, \`type: string\`, \`untyped\`
- **Properties**:
  - \`effect: boolean\` — Ripple. On by default; opt out with \`effect="false"\`.
  - \`type: string\` — Variant: \`''\` | \`'primary'\` | \`'text'\`.
`;

it('turns typed attributes into controls and leaves plumbing out', () => {
  expect(parseControls(REFERENCE).get('r-demo')).toEqual([
    { name: 'disabled', kind: 'boolean', description: '', defaultOn: false },
    { name: 'effect', kind: 'boolean', description: expect.stringContaining('On by default'), defaultOn: true },
    { name: 'iconsize', kind: 'text', description: '' },
    { name: 'mode', kind: 'select', options: ['a', 'b'], description: '' },
    { name: 'type', kind: 'select', options: ['', 'primary', 'text'], description: expect.any(String) },
  ]);
});

it('starts from the first live example that holds the element', () => {
  const page =
    '<ran-demo>\n<r-icon></r-icon>\n</ran-demo>\n\n<ran-demo column>\n  <r-demo type="text">Go</r-demo>\n</ran-demo>';
  expect(firstExample(page, 'r-demo')).toBe('<r-demo type="text">Go</r-demo>');
  expect(firstExample(page, 'r-missing')).toBe('');
});
