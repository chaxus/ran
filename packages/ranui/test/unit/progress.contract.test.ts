import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Progress } from '@/components/progress';
import '@/components/progress';

describe('r-progress contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with correct structure', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);

    const shadow = (progress as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-progress')).not.toBeNull();
    expect(shadow.querySelector('.ran-progress-wrap')).not.toBeNull();
    expect(shadow.querySelector('.ran-progress-wrap-value')).not.toBeNull();
    // The drag handle element is built, but only mounted for type="drag"
    // (a default bar detaches it), so assert the element exists, not that it's in the tree.
    expect((progress as any)._progressDot).toBeTruthy();
  });

  it('percent defaults to 0 when not set', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    expect(progress.percent).toBe('0');
  });

  it('percent setter reflects to attribute', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);

    progress.percent = '42';
    expect(progress.getAttribute('percent')).toBe('42');
    expect(progress.getAttribute('aria-valuenow')).toBe('42');
  });

  it('total defaults to 100', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    expect(progress.total).toBe('100');
  });

  it('total setter reflects to attribute', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    progress.total = '200';
    expect(progress.getAttribute('total')).toBe('200');
  });

  it('percent is capped at total', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    progress.total = '100';
    progress.percent = '150';
    // percent > total should return total
    expect(Number(progress.percent)).toBeLessThanOrEqual(100);
  });

  it('type defaults to primary', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    expect(progress.type).toBe('primary');
  });

  it('type rejects unknown values and keeps primary', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    progress.type = 'unknown';
    expect(progress.type).toBe('primary');
  });

  it('dot defaults to true', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    expect(progress.dot).toBe('true');
  });

  it('appendProgressDot appends dot when dot=true and type=drag', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    // Remove dot first so the contains check is false
    if (progress._progress.contains(progress._progressDot)) {
      progress._progress.removeChild(progress._progressDot);
    }
    progress.setAttribute('type', 'drag');
    progress.dot = 'true';
    progress.appendProgressDot();
    expect(progress._progress.contains(progress._progressDot)).toBe(true);
  });

  it('appendProgressDot removes dot when dot=false', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    // First ensure dot is in DOM (drag type shows the handle)
    progress.setAttribute('type', 'drag');
    progress.dot = 'true';
    progress.appendProgressDot();

    progress.dot = 'false';
    progress.appendProgressDot();
    expect(progress._progress.contains(progress._progressDot)).toBe(false);
  });

  // Regression: a plain (non-drag) progress bar must NOT render the drag handle,
  // even with dot='true' — otherwise it shows as an orphaned green dot with no
  // bar behind it (see docs homepage live demo).
  it('does not append the drag dot for a non-drag progress even when dot=true', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    if (progress._progress.contains(progress._progressDot)) {
      progress._progress.removeChild(progress._progressDot);
    }
    expect(progress.type).toBe('primary');
    progress.dot = 'true';
    progress.appendProgressDot();
    expect(progress._progress.contains(progress._progressDot)).toBe(false);
  });

  it('removes the drag dot when switching from drag back to a plain bar', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    progress.setAttribute('type', 'drag');
    progress.dot = 'true';
    progress.appendProgressDot();
    expect(progress._progress.contains(progress._progressDot)).toBe(true);

    progress.setAttribute('type', 'primary');
    expect(progress._progress.contains(progress._progressDot)).toBe(false);
  });

  it('updateUI updates scaleX and translateX styles', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    Object.defineProperty(progress._progress, 'offsetWidth', { value: 200 });
    progress.updateUI(0.5);

    // New CSS-variable approach: updateUI sets --progress-percent on the host.
    // CSS handles the visual transform (scaleX / translateX) without needing offsetWidth.
    expect(progress.style.getPropertyValue('--progress-percent')).toBe('0.5');
  });

  it('binds click event when type is drag', () => {
    const progress = document.createElement('r-progress') as Progress;
    progress.setAttribute('type', 'drag');
    progress.setAttribute('percent', '30');
    progress.setAttribute('total', '100');
    document.body.appendChild(progress);

    const percentEl = (progress as any)._progress;
    Object.defineProperty(percentEl, 'offsetWidth', { value: 100 });
    percentEl.getBoundingClientRect = vi.fn(() => ({ left: 0 }));

    const clickEvent = new MouseEvent('click', { clientX: 50 });
    percentEl.dispatchEvent(clickEvent);

    expect((progress as any).percent).toBe('50');

    // updateUI now sets --progress-percent on the host; CSS positions the dot.
    expect(progress.style.getPropertyValue('--progress-percent')).toBeDefined();
    expect(progress.getAttribute('percent')).toBe('50');
  });

  it('dispatches change event on click when type is drag', () => {
    const progress = document.createElement('r-progress') as Progress;
    progress.setAttribute('type', 'drag');
    document.body.appendChild(progress);

    const percentEl = (progress as any)._progress;
    Object.defineProperty(percentEl, 'offsetWidth', { value: 100 });
    percentEl.getBoundingClientRect = vi.fn(() => ({ left: 0 }));

    let changeDetail: any;
    progress.addEventListener('change', (e: Event) => {
      changeDetail = (e as CustomEvent).detail;
    });

    percentEl.dispatchEvent(new MouseEvent('click', { clientX: 75 }));
    expect(changeDetail).toBeDefined();
    expect(changeDetail.percent).toBeDefined();
  });

  it('drag mouse events: mousedown → mousemove → mouseup', () => {
    const progress = document.createElement('r-progress') as any;
    progress.setAttribute('type', 'drag');
    document.body.appendChild(progress);

    Object.defineProperty(progress._progress, 'offsetWidth', { value: 100 });
    progress._progress.getBoundingClientRect = vi.fn(() => ({ left: 0 }));

    progress._progressDot.dispatchEvent(new MouseEvent('mousedown', { clientX: 0 }));
    expect(progress.moveProgress.mouseDown).toBe(true);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60 }));
    expect(progress.percent).toBe('60');

    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(progress.moveProgress.mouseDown).toBe(false);
  });

  it('sheet property reflects to attribute', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);

    progress.sheet = '.ran-progress { background: red; }';
    expect(progress.getAttribute('sheet')).toBe('.ran-progress { background: red; }');
  });

  it('role=progressbar is set on container', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);
    expect(progress._progress.getAttribute('role')).toBe('progressbar');
  });

  it('disconnectedCallback removes event listeners without error', () => {
    const progress = document.createElement('r-progress') as Progress;
    document.body.appendChild(progress);
    expect(() => document.body.removeChild(progress)).not.toThrow();
  });

  it('disconnectedCallback tolerates missing internal nodes', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    progress._progress = null;
    progress._progressDot = null;

    expect(() => document.body.removeChild(progress)).not.toThrow();
  });

  it('progressClick returns early when type is not drag', () => {
    const progress = document.createElement('r-progress') as any;
    progress.setAttribute('type', 'primary');
    document.body.appendChild(progress);

    const updateSpy = vi.spyOn(progress, 'updateUI');
    const changeSpy = vi.spyOn(progress, 'change');
    progress.progressClick(new MouseEvent('click', { clientX: 50 }));
    expect(updateSpy).not.toHaveBeenCalled();
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('progressDotMouseMove does nothing when mouseDown is false', () => {
    const progress = document.createElement('r-progress') as any;
    progress.setAttribute('type', 'drag');
    document.body.appendChild(progress);

    expect(progress.moveProgress.mouseDown).toBe(false);
    const updateSpy = vi.spyOn(progress, 'updateUI');
    progress.progressDotMouseMove(new MouseEvent('mousemove', { clientX: 50 }));
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('updateCurrentProgress returns early when _progress is not set', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    const updateSpy = vi.spyOn(progress, 'updateUI');
    progress._progress = null;
    expect(() => progress.updateCurrentProgress()).not.toThrow();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('window resize triggers updateCurrentProgress', () => {
    const progress = document.createElement('r-progress') as any;
    progress.setAttribute('percent', '50');
    document.body.appendChild(progress);

    Object.defineProperty(progress._progress, 'offsetWidth', { value: 200 });
    const updateSpy = vi.spyOn(progress, 'updateUI');
    window.dispatchEvent(new Event('resize'));
    expect(updateSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new value', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    const appendSpy = vi.spyOn(progress, 'appendProgressDot');
    const updateSpy = vi.spyOn(progress, 'updateCurrentProgress');
    progress.attributeChangedCallback('percent', '50', '50');
    expect(appendSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('attributeChangedCallback handles dot change', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    const appendSpy = vi.spyOn(progress, 'appendProgressDot');
    progress.attributeChangedCallback('dot', 'true', 'false');
    expect(appendSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback handles sheet change', () => {
    const progress = document.createElement('r-progress') as any;
    document.body.appendChild(progress);

    const cssSpy = vi.spyOn(progress, 'handlerExternalCss');
    progress.attributeChangedCallback('sheet', '', '.ran-progress { color: red; }');
    expect(cssSpy).toHaveBeenCalled();
  });

  it('dragEvent does not bind events when type is not drag', () => {
    const progress = document.createElement('r-progress') as any;
    progress.setAttribute('type', 'primary');
    document.body.appendChild(progress);

    const addSpy = vi.spyOn(progress._progress, 'addEventListener');
    progress.dragEvent();
    expect(addSpy).not.toHaveBeenCalledWith('click', progress.progressClick);
  });
});
