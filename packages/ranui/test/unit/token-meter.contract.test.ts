import { beforeEach, describe, expect, it } from 'vitest';
import { TokenMeter } from '@/components/token-meter';
import '@/components/token-meter';

/**
 * Mounts a meter.
 *
 * @returns The element and the parts a caller can observe.
 */
function mount(): { meter: TokenMeter; root: HTMLElement; fill: HTMLElement; text: HTMLElement } {
  const meter = document.createElement('r-token-meter') as TokenMeter;
  document.body.appendChild(meter);
  const shadow = (meter as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return {
    meter,
    root: shadow.querySelector<HTMLElement>('.ran-token-meter')!,
    fill: shadow.querySelector<HTMLElement>('.ran-token-meter-fill')!,
    text: shadow.querySelector<HTMLElement>('.ran-token-meter-text')!,
  };
}

describe('r-token-meter contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a track, a fill and a readout', () => {
    const { root, fill, text } = mount();
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(fill).not.toBeNull();
    expect(text).not.toBeNull();
  });

  it('fills in proportion to the limit', () => {
    const { meter, fill } = mount();
    meter.limit = 1000;
    meter.used = 250;
    expect(fill.style.width).toBe('25%');
  });

  it('stops the fill at the track while still reporting the real number', () => {
    // A bar wider than its track paints outside the rounded corner. The number is what
    // carries the overflow.
    const { meter, root, fill } = mount();
    meter.limit = 1000;
    meter.used = 4000;
    expect(fill.style.width).toBe('100%');
    expect(root.getAttribute('aria-valuenow')).toBe('4000');
  });

  it('escalates through ok, warn and over', () => {
    const { meter } = mount();
    meter.limit = 1000;
    meter.used = 500;
    expect(meter.level).toBe('ok');
    meter.used = 850;
    expect(meter.level).toBe('warn');
    meter.used = 1000;
    expect(meter.level).toBe('over');
  });

  it('states the level in words as well as in colour', () => {
    // Colour is never the only carrier: a reader who cannot distinguish these still needs
    // to know the next request will not fit.
    const { meter, root } = mount();
    meter.limit = 1000;
    meter.used = 1200;
    expect(root.getAttribute('title')).toContain('Over the limit');
    meter.used = 850;
    expect(root.getAttribute('title')).toContain('Approaching');
    meter.used = 100;
    expect(root.getAttribute('title')).not.toContain('limit');
  });

  it('abbreviates in the readout and spells the number out in the title', () => {
    const { meter, root, text } = mount();
    meter.limit = 128_000;
    meter.used = 41_200;
    expect(text.textContent).toBe('Context 41k / 128k');
    expect(root.getAttribute('title')).toContain('41,200');
  });

  it('keeps small counts exact, because a reader can hold three digits', () => {
    const { meter, text } = mount();
    meter.limit = 1000;
    meter.used = 847;
    expect(text.textContent).toBe('Context 847 / 1.0k');
  });

  it('shows what has been spent beside what is carried', () => {
    // Not derivable from `used`: a compacted conversation has spent far more than it
    // currently carries, and that difference is why anyone looks at this.
    const { meter, text } = mount();
    meter.limit = 10_000;
    meter.used = 2000;
    meter.spent = 45_000;
    expect(text.textContent).toBe('Context 2.0k / 10k · 45k');
  });

  it('drops the label when a caller asks for counts alone', () => {
    const { meter, text } = mount();
    meter.label = '';
    meter.used = 300;
    expect(text.textContent).toBe('300');
  });

  it('shows only what is carried when no limit is known', () => {
    const { meter, text, fill } = mount();
    meter.used = 300;
    expect(text.textContent).toBe('Context 300');
    expect(fill.style.width).toBe('0%');
    expect(meter.level).toBe('ok');
  });

  it('treats a malformed count as zero rather than throwing in a render path', () => {
    // A meter is decoration on someone else's screen. It must not be able to break a page.
    const { meter, text } = mount();
    meter.setAttribute('limit', 'lots');
    meter.setAttribute('used', '-5');
    expect(() => meter.setAttribute('spent', 'NaN')).not.toThrow();
    expect(text.textContent).toBe('Context 0');
  });
});
