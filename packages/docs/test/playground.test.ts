import { expect, it } from 'vitest';
import { firstExample, parseControls, statedDefault } from '../build/playground.ts';

const REFERENCE = `## \`<r-demo>\`

Source: \`components/demo/index.ts\`

- **Attributes**: \`aria-label\`, \`disabled: boolean | string\`, \`effect: boolean\`, \`iconSize: string\`, \`mode: 'a' | 'b'\`, \`sheet: string\`, \`type: string\`, \`untyped\`
- **Properties**:
  - \`effect: boolean\` — Ripple. On by default; opt out with \`effect="false"\`.
  - \`type: string\` — Variant: \`''\` (default) | \`'primary'\` | \`'text'\`.
`;

it('turns typed attributes into controls and leaves plumbing out', () => {
  expect(parseControls(REFERENCE).get('r-demo')).toEqual([
    { name: 'disabled', kind: 'boolean', description: '', defaultOn: false },
    { name: 'effect', kind: 'boolean', description: expect.stringContaining('On by default'), defaultOn: true },
    { name: 'iconsize', kind: 'text', description: '' },
    { name: 'mode', kind: 'select', options: ['a', 'b'], description: '' },
    {
      name: 'type',
      kind: 'select',
      options: ['', 'primary', 'text'],
      description: expect.any(String),
      defaultValue: 'default',
    },
  ]);
});

it('reads the default a description states, and nothing when it states none', () => {
  expect(statedDefault("Variant: `''` (default) | `'primary'`.")).toBe('default');
  expect(statedDefault("How it opens: `'click'` | `'hover'`. Default `'click'`.")).toBe('click');
  expect(statedDefault("Defaults to `'bottom'`.")).toBe('bottom');
  expect(statedDefault('Native input type. Behaves as `text` when unset.')).toBe('text');
  expect(statedDefault('Accessible name. Defaults to "Loading".')).toBe('Loading');
  // How a default is computed is not a value a reader could type in.
  expect(statedDefault('Container id. Defaults to `document.body`.')).toBeUndefined();
  expect(statedDefault('Defaults to about 1.15× the font size.')).toBeUndefined();
  expect(statedDefault("Defaults to `''` (empty).")).toBeUndefined();
  expect(statedDefault('Name of an icon.')).toBeUndefined();
});

it('starts from the first live example that holds the element', () => {
  const page =
    '<ran-demo>\n<r-icon></r-icon>\n</ran-demo>\n\n<ran-demo column>\n  <r-demo type="text">Go</r-demo>\n</ran-demo>';
  expect(firstExample(page, 'r-demo')).toBe('<r-demo type="text">Go</r-demo>');
  expect(firstExample(page, 'r-missing')).toBe('');
  expect(firstExample('<ran-demo><r-demo id="one">Go</r-demo></ran-demo>', 'r-demo')).toBe('<r-demo>Go</r-demo>');
});
