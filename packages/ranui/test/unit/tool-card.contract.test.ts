import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToolCard } from '@/components/tool-card';
import '@/components/tool-card';

/**
 * Mounts a card.
 *
 * @returns The element, its shadow root, and the body container.
 */
function mount(): { card: ToolCard; shadow: ShadowRoot; body: HTMLElement } {
  const card = document.createElement('r-tool-card') as ToolCard;
  document.body.appendChild(card);
  const shadow = (card as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { card, shadow, body: shadow.querySelector<HTMLElement>('.ran-tool-card-body')! };
}

describe('r-tool-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Shadow DOM structure ────────────────────────────────────────────────

  it('renders a header, status dot, title and body', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-tool-card-header')).not.toBeNull();
    expect(shadow.querySelector('.ran-tool-card-status')).not.toBeNull();
    expect(shadow.querySelector('.ran-tool-card-title')).not.toBeNull();
    expect(shadow.querySelector('.ran-tool-card-body')).not.toBeNull();
  });

  it('exports part attributes on the structural elements', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-tool-card')?.getAttribute('part')).toBe('card');
    expect(shadow.querySelector('.ran-tool-card-header')?.getAttribute('part')).toBe('header');
    expect(shadow.querySelector('.ran-tool-card-status')?.getAttribute('part')).toBe('status');
    expect(shadow.querySelector('.ran-tool-card-title')?.getAttribute('part')).toBe('title');
    expect(shadow.querySelector('.ran-tool-card-body')?.getAttribute('part')).toBe('body');
  });

  it('uses a real button for the header, so it is keyboard reachable', () => {
    const { shadow } = mount();
    const header = shadow.querySelector('.ran-tool-card-header')!;
    expect(header.tagName).toBe('BUTTON');
    expect(header.getAttribute('type')).toBe('button');
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  // ── Expansion ───────────────────────────────────────────────────────────

  it('toggles open on header activation and tracks aria-expanded', () => {
    const { card, shadow } = mount();
    const header = shadow.querySelector<HTMLElement>('.ran-tool-card-header')!;
    header.click();
    expect(card.open).toBe(true);
    expect(header.getAttribute('aria-expanded')).toBe('true');
    header.click();
    expect(card.open).toBe(false);
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  // ── Generic card ────────────────────────────────────────────────────────

  it('shows the title from the call view', () => {
    const { card, shadow } = mount();
    card.call = { card: 'generic', title: 'Read file' };
    expect(shadow.querySelector('.ran-tool-card-title')?.textContent).toBe('Read file');
  });

  it('lists the declared input as term/description pairs', () => {
    const { card, body } = mount();
    card.call = { card: 'generic', title: 'Read', input: { path: 'src/a.ts', limit: '200' } };
    const terms = [...body.querySelectorAll('dt')].map((node) => node.textContent);
    const values = [...body.querySelectorAll('dd')].map((node) => node.textContent);
    expect(terms).toEqual(['path', 'limit']);
    expect(values).toEqual(['src/a.ts', '200']);
  });

  it('shows generic result content as preformatted output', () => {
    const { card, body } = mount();
    card.call = { card: 'generic', title: 'Read' };
    card.result = { card: 'generic', content: 'line one\nline two' };
    expect(body.querySelector('pre')?.textContent).toBe('line one\nline two');
  });

  // ── Terminal card ───────────────────────────────────────────────────────

  it('shows the working directory and description for a terminal call', () => {
    const { card, body } = mount();
    card.call = { card: 'terminal', title: 'pnpm test', description: 'Run the suite', cwd: '/repo' };
    expect(body.querySelector('.ran-tool-card-description')?.textContent).toBe('Run the suite · cwd: /repo');
  });

  it('shows terminal output verbatim', () => {
    const { card, body } = mount();
    card.call = { card: 'terminal', title: 'ls' };
    card.result = { card: 'terminal', output: 'a\nb' };
    expect(body.querySelector('pre')?.textContent).toBe('a\nb');
  });

  it('surfaces a non-zero exit code and stays silent on zero', () => {
    const { card, body } = mount();
    card.call = { card: 'terminal', title: 'ls' };
    card.result = { card: 'terminal', output: '', exitCode: 2 };
    expect(body.querySelector('[part="exit"]')?.textContent).toBe('exit 2');

    card.result = { card: 'terminal', output: '', exitCode: 0 };
    expect(body.querySelector('[part="exit"]')).toBeNull();
  });

  // ── Diff card ───────────────────────────────────────────────────────────

  it('renders a diff with both gutters and change markers', () => {
    const { card, body } = mount();
    card.call = {
      card: 'diff',
      title: 'Edit',
      diffs: [{ path: 'a.ts', oldText: 'one\ntwo\n', newText: 'one\nTWO\n' }],
    };
    expect(body.querySelector('.ran-tool-card-path')?.textContent).toBe('a.ts');
    const kinds = [...body.querySelectorAll<HTMLElement>('.ran-tool-card-line')].map((row) => row.dataset.kind);
    expect(kinds).toEqual(['context', 'removed', 'added']);
    const text = [...body.querySelectorAll('.ran-tool-card-line')].map((row) => row.lastElementChild?.textContent);
    expect(text).toEqual([' one', '-two', '+TWO']);
  });

  it('treats a null oldText as a file being created', () => {
    const { card, body } = mount();
    card.call = { card: 'diff', title: 'Write', diffs: [{ path: 'new.ts', oldText: null, newText: 'a\nb\n' }] };
    const kinds = [...body.querySelectorAll<HTMLElement>('.ran-tool-card-line')].map((row) => row.dataset.kind);
    expect(kinds).toEqual(['added', 'added']);
  });

  it('renders every file in a multi-file diff', () => {
    const { card, body } = mount();
    card.call = {
      card: 'diff',
      title: 'Edit',
      diffs: [
        { path: 'a.ts', oldText: 'x\n', newText: 'y\n' },
        { path: 'b.ts', oldText: 'p\n', newText: 'q\n' },
      ],
    };
    expect([...body.querySelectorAll('.ran-tool-card-path')].map((n) => n.textContent)).toEqual(['a.ts', 'b.ts']);
  });

  it('lets the result view replace the call view for the same card kind', () => {
    const { card, body } = mount();
    card.call = { card: 'diff', title: 'Write', diffs: [{ path: 'a.ts', oldText: null, newText: 'draft\n' }] };
    card.result = { card: 'diff', diffs: [{ path: 'a.ts', oldText: null, newText: 'applied\n' }] };
    expect(body.querySelector('.ran-tool-card-line')?.lastElementChild?.textContent).toBe('+applied');
  });

  // ── Degradation ─────────────────────────────────────────────────────────

  it('degrades an unrecognised card to generic rather than throwing', () => {
    const { card, shadow, body } = mount();
    card.call = { card: 'holographic', title: 'From a newer producer' } as never;
    expect(shadow.querySelector('.ran-tool-card-title')?.textContent).toBe('From a newer producer');
    expect(body.querySelector('.ran-tool-card-line')).toBeNull();
  });

  it('survives a diff view whose diffs are missing', () => {
    const { card, body } = mount();
    expect(() => {
      card.call = { card: 'diff', title: 'Edit' } as never;
    }).not.toThrow();
    expect(body.querySelector('.ran-tool-card-line')).toBeNull();
  });

  it('survives a null call', () => {
    const { card, shadow } = mount();
    card.call = { card: 'generic', title: 'Something' };
    card.call = null;
    expect(shadow.querySelector('.ran-tool-card-title')?.textContent).toBe('');
  });

  // ── Locations ───────────────────────────────────────────────────────────

  it('renders locations and reports the one activated', () => {
    const { card, body } = mount();
    const listener = vi.fn();
    card.addEventListener('locationclick', listener);
    card.call = {
      card: 'generic',
      title: 'Read',
      locations: [{ path: 'src/a.ts', line: 42 }, { path: 'src/b.ts' }],
    };
    const buttons = [...body.querySelectorAll<HTMLElement>('.ran-tool-card-location')];
    expect(buttons.map((node) => node.textContent)).toEqual(['src/a.ts:42', 'src/b.ts']);

    buttons[0].click();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ location: { path: 'src/a.ts', line: 42 } });
  });

  // ── Status ──────────────────────────────────────────────────────────────

  it('defaults to running and reflects a set status', () => {
    const { card } = mount();
    expect(card.status).toBe('running');
    card.status = 'error';
    expect(card.getAttribute('status')).toBe('error');
    expect(card.status).toBe('error');
  });

  it('falls back to running for a status it does not know', () => {
    const { card } = mount();
    card.setAttribute('status', 'nonsense');
    expect(card.status).toBe('running');
  });
});
