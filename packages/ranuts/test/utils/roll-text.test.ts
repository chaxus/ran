// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { rollText } from '@/utils/motion';

afterEach(() => vi.unstubAllGlobals());

describe('rollText', () => {
  /** Records which characters were animated, and in which direction. */
  const recordRolls = (): Array<{ char: string; from: string }> => {
    const rolls: Array<{ char: string; from: string }> = [];
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    HTMLElement.prototype.animate = function (keyframes: Keyframe[]) {
      rolls.push({ char: this.textContent ?? '', from: String(keyframes[0]!.transform) });
      return { onfinish: null } as unknown as Animation;
    };
    return rolls;
  };
  afterEach(() => {
    delete (HTMLElement.prototype as { animate?: unknown }).animate;
  });

  it('always shows exactly the new text', () => {
    recordRolls();
    const host = document.createElement('span');
    rollText(host, '41.2k');
    rollText(host, '41.5k');
    expect(host.textContent).toBe('41.5k');
    rollText(host, '9');
    expect(host.textContent).toBe('9');
  });

  it('writes the first value without motion, then rolls only the characters that changed', () => {
    const rolls = recordRolls();
    const host = document.createElement('span');
    rollText(host, '41.2k');
    expect(rolls).toEqual([]);
    rollText(host, '41.5k');
    expect(rolls.map((roll) => roll.char)).toEqual(['5']);
  });

  it('rolls up from below when the value grows and down from above when it shrinks', () => {
    const rolls = recordRolls();
    const host = document.createElement('span');
    rollText(host, '95');
    rollText(host, '96');
    rollText(host, '94');
    expect(rolls.map((roll) => roll.from)).toEqual(['translateY(100%)', 'translateY(-100%)']);
  });

  it('lines characters up from the right, so a new leading digit is the only change', () => {
    const rolls = recordRolls();
    const host = document.createElement('span');
    rollText(host, '99');
    rollText(host, '199');
    expect(rolls.map((roll) => roll.char)).toEqual(['1']);
  });

  it('raises every character on an entrance, and moves nothing under reduced motion', () => {
    const rolls = recordRolls();
    const host = document.createElement('span');
    rollText(host, '90+', { rise: true });
    expect(rolls.map((roll) => roll.char)).toEqual(['9', '0', '+']);
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    rollText(host, '91+');
    expect(rolls).toHaveLength(3);
    expect(host.textContent).toBe('91+');
  });

  it('reads the direction from the leading number and its suffix', () => {
    const rolls = recordRolls();
    const host = document.createElement('span');
    rollText(host, '999 / 128k');
    rollText(host, '1.0k / 128k');
    expect(new Set(rolls.map((roll) => roll.from))).toEqual(new Set(['translateY(100%)']));
  });

  it('keeps the cell of an unchanged character, so a roll in progress carries on', () => {
    recordRolls();
    const host = document.createElement('span');
    rollText(host, '41');
    rollText(host, '42');
    // The word's cells, one per character.
    const cells = () => [...host.firstElementChild!.children];
    const rolling = cells()[1];
    rollText(host, '52');
    expect(cells()[1]).toBe(rolling);
    expect(host.textContent).toBe('52');
  });
});
