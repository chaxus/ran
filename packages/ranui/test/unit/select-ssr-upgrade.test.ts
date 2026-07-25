import { beforeEach, describe, expect, it } from 'vitest';
import '@/components/select/index';
import type { Select } from '@/components/select/index';

/**
 * Regression: a `value` that is already present in the markup (server-rendered
 * pages, declarative shadow DOM, or any hand-written HTML) must still produce a
 * visible closed-state label.
 *
 * During a custom-element upgrade the reaction order is
 * `constructor` → `attributeChangedCallback` → `connectedCallback`, so the
 * `value` sync used to run before the element had any layout. It wrote
 * `line-height: 0px` (from a zero-height `getBoundingClientRect()`), which
 * collapsed the label to invisible even though its text was correct — the
 * select rendered as an empty box until something re-selected the option.
 */
describe('r-select upgrade with a pre-existing value (SSR)', () => {
  const sleep = (ms = 50): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mountFromMarkup = async (value: string): Promise<Select> => {
    document.body.innerHTML =
      `<r-select value="${value}">` +
      '<r-option value="en">English</r-option>' +
      '<r-option value="zh">中文</r-option>' +
      '</r-select>';
    await sleep();
    return document.querySelector('r-select') as Select;
  };

  /** 闭合 shadow root 里的标签节点（组件内部字段，测试里按内部结构断言）。 */
  const labelNode = (select: Select): HTMLElement => (select as unknown as { _text: HTMLElement })._text;

  it('reflects the markup value into the label', async () => {
    const select = await mountFromMarkup('zh');
    expect(labelNode(select).textContent).toBe('中文');
    expect(select.getAttribute('value')).toBe('zh');
  });

  it('never leaves the label with a zero line-height', async () => {
    const select = await mountFromMarkup('zh');
    const lineHeight = labelNode(select).style.lineHeight;
    // Either unset (stylesheet decides) or a real height — but never collapsed.
    expect(lineHeight).not.toBe('0px');
  });

  it('marks the matching option active', async () => {
    const select = await mountFromMarkup('zh');
    const active = select.querySelector('r-option[value="zh"]');
    expect(active?.getAttribute('aria-selected')).toBe('true');
  });
});
