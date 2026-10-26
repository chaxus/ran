import { beforeEach, describe, expect, it } from 'vitest';
import { FanGallery } from '@/components/fan-gallery';
import '@/components/fan-gallery';

/**
 * Mounts a gallery holding `count` children.
 *
 * @returns The gallery and its children.
 */
function mount(count: number, attrs = ''): { gallery: FanGallery; items: HTMLElement[] } {
  document.body.innerHTML = `<r-fan-gallery ${attrs}>${'<div tabindex="0"></div>'.repeat(count)}</r-fan-gallery>`;
  const gallery = document.querySelector('r-fan-gallery') as FanGallery;
  const items = [...gallery.children] as HTMLElement[];
  // jsdom never assigns slotted nodes; stand in for the browser's assignment.
  const slot = (gallery as unknown as { _shadowDom: ShadowRoot })._shadowDom.querySelector('slot')!;
  slot.assignedElements = () => items;
  slot.dispatchEvent(new Event('slotchange'));
  return { gallery, items };
}

const angle = (item: HTMLElement) => item.style.getPropertyValue('--fan-angle');

describe('r-fan-gallery contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('projects its children through a slot', () => {
    const { gallery } = mount(1);
    expect((gallery as unknown as { _shadowDom: ShadowRoot })._shadowDom.querySelector('slot')).not.toBeNull();
  });

  it('opens at once where entry cannot be observed, spreading children evenly about the centre', () => {
    // The test environment has no IntersectionObserver, so the fan opens on connect.
    const { items } = mount(3, 'spread="30"');
    expect(items.map(angle)).toEqual(['-15deg', '0deg', '15deg']);
  });

  it('defaults to a 24 degree spread and follows a change to it', () => {
    const { gallery, items } = mount(3);
    expect(angle(items[0]!)).toBe('-12deg');
    gallery.spread = '0';
    expect(items.map(angle)).toEqual(['0deg', '0deg', '0deg']);
  });

  it('lifts the focused child and turns its neighbours aside', () => {
    const { gallery, items } = mount(3, 'spread="20"');
    items[1]!.focus();
    expect(items.map(angle)).toEqual(['-14deg', '0deg', '14deg']);
    expect(items[1]!.style.getPropertyValue('--fan-lifted')).toBe('1');
    items[1]!.blur();
    expect(items.map(angle)).toEqual(['-10deg', '0deg', '10deg']);
    expect(gallery.contains(document.activeElement)).toBe(false);
  });
});
