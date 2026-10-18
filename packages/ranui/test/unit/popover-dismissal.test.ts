import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Popover } from '@/components/popover';
import type { Select } from '@/components/select';
import '@/components/popover';
import '@/components/select';

function popover(content = '<button>Panel action</button>'): Popover {
  const el = document.createElement('r-popover') as Popover;
  el.trigger = 'click';
  el.innerHTML = `<button>Open</button><r-content>${content}</r-content>`;
  document.body.append(el);
  return el;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('popover outside dismissal', () => {
  it('closes when an outside control stops click propagation', async () => {
    const el = popover();
    const outside = document.createElement('button');
    outside.addEventListener('click', (event) => event.stopPropagation());
    document.body.append(outside);
    el.show();
    outside.click();
    await vi.waitFor(() => expect(el.open).toBe(false));
  });

  it('closes the previous popover when another trigger is clicked', async () => {
    const first = popover();
    const second = popover();
    first.show();
    second.querySelector('button')!.click();
    await vi.waitFor(() => expect(first.open).toBe(false));
    expect(second.open).toBe(true);
  });

  it('keeps clicks inside the portaled panel and trigger toggle working', async () => {
    const el = popover();
    el.show();
    const action = el.popoverContent!.querySelector('button')!;
    action.addEventListener('click', (event) => event.stopPropagation());
    action.click();
    expect(el.open).toBe(true);
    el.querySelector('button')!.click();
    await vi.waitFor(() => expect(el.open).toBe(false));
  });

  it('keeps the parent open when selecting from a nested portaled select', async () => {
    const el = popover('<r-select><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>');
    el.show();
    const select = el.popoverContent!.querySelector('r-select') as Select;
    select.show();
    const option = select._selectionDropdown!.querySelectorAll('r-dropdown-item')[1] as HTMLElement;
    option.click();
    await vi.waitFor(() => expect(select.value).toBe('two'));
    expect(el.open).toBe(true);
  });

  it('keeps ancestors open when interacting with a nested portaled popover', () => {
    const el = popover();
    el.show();
    const nested = document.createElement('r-popover') as Popover;
    nested.trigger = 'click';
    nested.innerHTML = '<button>Nested</button><r-content><button>Nested action</button></r-content>';
    el.popoverContent!.append(nested);
    nested.querySelector('button')!.click();
    expect(nested.open).toBe(true);
    nested.popoverContent!.querySelector('button')!.click();
    expect(nested.open).toBe(true);
    expect(el.open).toBe(true);
  });
});
