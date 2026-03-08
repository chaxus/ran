import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@/components/progress';

describe('r-progress contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('binds click event when type is drag', () => {
    const progress = document.createElement('r-progress');
    progress.setAttribute('type', 'drag');
    progress.setAttribute('percent', '30');
    progress.setAttribute('total', '100');
    document.body.appendChild(progress);

    const percentEl = (progress as any)._progress;
    Object.defineProperty(percentEl, 'offsetWidth', { value: 100 });
    percentEl.getBoundingClientRect = vi.fn(() => ({ left: 0 }));

    // Simulate click at x=50, should be 50%
    const clickEvent = new MouseEvent('click', { clientX: 50 });
    percentEl.dispatchEvent(clickEvent);

    expect((progress as any).percent).toBe('50');

    // Check style
    const dot = (progress as any)._progressDot;
    expect(dot.style.transform).toBe('translateX(50px)');

    // Check internal setter calls
    expect(progress.getAttribute('percent')).toBe('50');
  });
});
