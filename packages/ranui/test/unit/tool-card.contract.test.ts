import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToolCard } from '@/components/tool-card';
import '@/components/tool-card';
import type { DisclosureRow } from '@/components/disclosure-row';
import type { StateDot } from '@/components/state-dot';

/**
 * Mounts a card.
 *
 * @returns The element, its shadow root, and the body container.
 */
function mount(): { card: ToolCard; shadow: ShadowRoot; body: HTMLElement; row: DisclosureRow; dot: StateDot } {
  const card = document.createElement('r-tool-card') as ToolCard;
  document.body.appendChild(card);
  const shadow = (card as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return {
    card,
    shadow,
    body: shadow.querySelector<HTMLElement>('.ran-tool-card-body')!,
    row: shadow.querySelector('r-disclosure-row') as DisclosureRow,
    dot: shadow.querySelector('r-state-dot') as StateDot,
  };
}

describe('r-tool-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── The row ─────────────────────────────────────────────────────────────

  it('renders as a disclosure row with a state dot, not as a bordered box', () => {
    // A run of tool calls is a list. Twelve bordered cards down a transcript is twelve
    // things competing with the answer; twelve one-line rows is something a reader skims.
    const { row, dot, body } = mount();
    expect(row).not.toBeNull();
    expect(dot.getAttribute('slot')).toBe('leading');
    expect(body).not.toBeNull();
  });

  it('puts the title and a summary on the collapsed line', () => {
    const { card, row } = mount();
    card.call = { card: 'generic', title: '抓取网页', summary: 'https://example.com' };
    expect(row.title).toBe('抓取网页');
    expect(row.summary).toBe('https://example.com');
  });

  it('derives a summary for a tool that did not name one', () => {
    // A tool that did not think about its collapsed line still gets a useful one. Which
    // argument matters is the producer's call, so a named summary always wins.
    const { card, row } = mount();
    card.call = { card: 'generic', title: 'Fetch', input: { url: 'https://a.test', depth: '2' } };
    expect(row.summary).toBe('https://a.test');

    card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
    expect(row.summary).toBe('/repo');

    card.call = { card: 'diff', title: 'Edit', diffs: [{ path: 'a.ts', oldText: null, newText: 'x' }] };
    expect(row.summary).toBe('a.ts');
  });

  it('drives the state dot from the call status', () => {
    const { card, dot } = mount();
    card.call = { card: 'generic', title: 'Read' };
    expect(dot.state).toBe('running');
    card.status = 'success';
    expect(dot.state).toBe('success');
    card.status = 'error';
    expect(dot.state).toBe('error');
  });

  it('colours the summary as an error only when the call failed', () => {
    const { card, row } = mount();
    card.call = { card: 'generic', title: 'Fetch', summary: 'https://a.test' };
    expect(row.tone).toBe('');
    card.status = 'error';
    expect(row.tone).toBe('error');
  });

  it('offers no toggle for a call with nothing inside', () => {
    // A control that reveals a blank is worse than no control: it invites a press and
    // answers with nothing.
    const { card, row } = mount();
    card.call = { card: 'generic', title: 'Ping' };
    expect(row.expandable).toBe(false);

    card.result = { card: 'generic', content: 'pong' };
    expect(row.expandable).toBe(true);
  });

  it('starts collapsed, so a run of calls stays scannable', () => {
    const { card, row } = mount();
    card.call = { card: 'generic', title: 'Read', input: { path: 'a.ts' } };
    expect(card.open).toBe(false);
    expect(row.open).toBe(false);
  });

  it('mirrors the row opening back onto itself, so a page can style and read it', () => {
    // The row owns the open state and announces it; the card only reflects it. Driven
    // through the announcement because the row's own control lives behind a closed shadow
    // root, which is exactly why the announcement exists.
    const { card, row } = mount();
    card.call = { card: 'generic', title: 'Read', input: { path: 'a.ts' } };
    row.dispatchEvent(new CustomEvent('disclosuretoggle', { detail: { open: true }, bubbles: true, composed: true }));
    expect(card.open).toBe(true);
    expect(card.hasAttribute('open')).toBe(true);
  });

  // ── Generic card ────────────────────────────────────────────────────────

  it('shows the declared input and the result in one IN/OUT card', () => {
    const { card, body } = mount();
    card.call = { card: 'generic', title: 'Read', input: { path: 'src/a.ts', limit: '200' } };
    card.result = { card: 'generic', content: 'line one' };
    const labels = [...body.querySelectorAll('.ran-tool-card-io-label')].map((node) => node.textContent);
    expect(labels).toEqual(['IN', 'OUT']);
    const texts = [...body.querySelectorAll('.ran-tool-card-io-text')].map((node) => node.textContent);
    expect(texts).toEqual(['path: src/a.ts\nlimit: 200', 'line one']);
  });

  it('shows a half of the IN/OUT card that has no counterpart', () => {
    const { card, body } = mount();
    card.result = { card: 'generic', content: 'only output' };
    expect([...body.querySelectorAll('.ran-tool-card-io-label')].map((n) => n.textContent)).toEqual(['OUT']);
  });

  it('marks the output as an error when the call failed', () => {
    const { card, body } = mount();
    card.status = 'error';
    card.result = { card: 'generic', content: 'not found' };
    expect(body.querySelector<HTMLElement>('.ran-tool-card-io-text')?.dataset.error).toBe('');
  });

  // ── Terminal card ───────────────────────────────────────────────────────

  it('shows the working directory in the IN half of a terminal call', () => {
    const { card, body } = mount();
    card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
    expect(body.querySelector('.ran-tool-card-io-text')?.textContent).toBe('cwd: /repo');
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
    expect((shadow.querySelector('r-disclosure-row') as DisclosureRow).title).toBe('From a newer producer');
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
    expect((shadow.querySelector('r-disclosure-row') as DisclosureRow).title).toBe('');
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
