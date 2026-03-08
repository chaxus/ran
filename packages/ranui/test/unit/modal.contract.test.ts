import { describe, expect, it, beforeEach } from 'vitest';
import { Modal } from '@/components/modal/index';
// Ensure custom elements are defined
import '@/components/modal/index';

describe('r-modal contract', () => {
  const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const createModal = async () => {
    const modal = document.createElement('r-modal') as Modal;
    document.body.appendChild(modal);
    await sleep(20);
    return modal;
  };

  it('reflects open property and updates dialog visibility', async () => {
    const modal = await createModal();
    // Modal root is created synchronously in constructor
    // @ts-ignore
    const shadow = modal._shadowDom as ShadowRoot;
    const root = shadow?.querySelector('.ran-modal-root') as HTMLElement;
    const dialog = shadow?.querySelector('.ran-modal-dialog') as HTMLElement;

    // Initial state (closed)
    expect(modal.open).toBe(false);
    expect(root?.hasAttribute('open')).toBe(false);
    expect(dialog?.getAttribute('aria-hidden')).toBe('true');

    // Open modal
    modal.open = true;
    // JSDOM hasAttribute handles things differently sometimes, need to await render
    await sleep();
    expect(modal.hasAttribute('open')).toBe(true);
    expect(root?.hasAttribute('open')).toBe(true);
    expect(dialog?.getAttribute('aria-hidden')).toBe('false');

    // Close modal
    modal.open = false;
    await sleep();
    expect(modal.hasAttribute('open')).toBe(false);
    expect(root?.hasAttribute('open')).toBe(false);
    expect(dialog?.getAttribute('aria-hidden')).toBe('true');
  });

  it('reflects title property', async () => {
    const modal = await createModal();
    // @ts-ignore
    const shadow = modal._shadowDom as ShadowRoot;
    const titleEl = shadow?.querySelector('.ran-modal-title') as HTMLElement;

    // Default title
    expect(titleEl?.textContent).toBe('Modal');

    // Set title
    modal.title = 'New Title';
    await sleep();
    expect(modal.getAttribute('title')).toBe('New Title');
    expect(titleEl?.textContent).toBe('New Title');

    // Remove title
    modal.removeAttribute('title');
    await sleep();
    expect(titleEl?.textContent).toBe('Modal'); // Fallback to default
  });

  it('dispatches close event on mask click when maskClosable is true', async () => {
    const modal = await createModal();

    let closeTrigger = '';
    modal.addEventListener('close', (e: Event) => {
      closeTrigger = (e as CustomEvent).detail.trigger;
    });

    // Default maskClosable is true
    expect(modal.maskClosable).toBe(true);

    // Must be open to close
    modal.open = true;
    await sleep();

    // Re-query mask after potential re-render
    // @ts-ignore
    const shadow = modal._shadowDom as ShadowRoot;
    const mask = shadow?.querySelector('.ran-modal-mask') as HTMLElement;

    // We need to click the internal element inside the mask because event composition
    const maskContent = mask?.querySelector('.ran-modal-mask') || mask;
    maskContent?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeTrigger).toBe('mask');
    expect(modal.open).toBe(false);
  });

  it('does not dispatch close event on mask click when maskClosable is false', async () => {
    const modal = await createModal();

    let closeCalled = false;
    modal.addEventListener('close', () => {
      closeCalled = true;
    });

    modal.open = true;
    modal.maskClosable = false;
    await sleep();

    // @ts-ignore
    const shadow = modal._shadowDom as ShadowRoot;
    const mask = shadow?.querySelector('.ran-modal-mask') as HTMLElement;
    const maskContent = mask?.querySelector('.ran-modal-mask') || mask;
    maskContent?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeCalled).toBe(false);
    expect(modal.open).toBe(true);
  });

  it('dispatches close event on close button click', async () => {
    const modal = await createModal();

    let closeTrigger = '';
    modal.addEventListener('close', (e: Event) => {
      closeTrigger = (e as CustomEvent).detail.trigger;
    });

    modal.open = true;
    await sleep();

    // Click close button
    // @ts-ignore
    const shadow = modal._shadowDom as ShadowRoot;
    const closeBtn = shadow?.querySelector('.ran-modal-close') as HTMLElement;

    // Click inner icon or the button
    const closeBtnContent = closeBtn?.querySelector('r-icon') || closeBtn;
    closeBtnContent?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeTrigger).toBe('button');
    expect(modal.open).toBe(false);
  });

  it('dispatches close event on Escape keydown', async () => {
    const modal = await createModal();

    let closeTrigger = '';
    modal.addEventListener('close', (e: Event) => {
      closeTrigger = (e as CustomEvent).detail.trigger;
    });

    modal.open = true;
    await sleep();

    // Simulate Escape keydown
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escapeEvent);

    expect(closeTrigger).toBe('escape');
    expect(modal.open).toBe(false);
  });

  it('removes event listeners on disconnect', async () => {
    const modal = await createModal();

    let closeCalled = false;
    modal.addEventListener('close', () => {
      closeCalled = true;
    });

    modal.open = true;
    await sleep();
    const maskContent = modal.shadowRoot?.querySelector('.ran-modal-mask') as HTMLElement;

    // Disconnect
    document.body.removeChild(modal);

    // Click mask after disconnect
    maskContent?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Simulate Escape keydown after disconnect
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escapeEvent);

    expect(closeCalled).toBe(false);
  });

  it('locks and restores body scroll with stacked modals', async () => {
    const modalA = await createModal();
    const modalB = await createModal();

    modalA.open = true;
    await sleep();
    expect(document.body.style.overflow).toBe('hidden');

    modalB.open = true;
    await sleep();
    expect(document.body.style.overflow).toBe('hidden');

    modalB.open = false;
    await sleep();
    expect(document.body.style.overflow).toBe('hidden');

    modalA.open = false;
    await sleep();
    expect(document.body.style.overflow).toBe('');
  });

  it('only closes topmost modal on Escape when stacked', async () => {
    const modalA = await createModal();
    const modalB = await createModal();

    modalA.open = true;
    modalB.open = true;
    await sleep();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escapeEvent);
    await sleep();

    expect(modalB.open).toBe(false);
    expect(modalA.open).toBe(true);
  });

  it('supports cancelling open via beforeopen event', async () => {
    const modal = await createModal();
    modal.addEventListener('beforeopen', (event) => {
      event.preventDefault();
    });

    modal.open = true;
    await sleep();

    expect(modal.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('supports cancelling close via beforeclose event', async () => {
    const modal = await createModal();
    modal.open = true;
    await sleep();

    modal.addEventListener('beforeclose', (event) => {
      event.preventDefault();
    });

    modal.close('program');
    await sleep();

    expect(modal.open).toBe(true);
  });

  it('respects closeOnEsc false', async () => {
    const modal = await createModal();
    modal.closeOnEsc = false;
    modal.open = true;
    await sleep();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await sleep();

    expect(modal.open).toBe(true);
  });

  it('emits afteropen and afterclose events', async () => {
    const modal = await createModal();
    let afterOpen = false;
    let afterClose = false;

    modal.addEventListener('afteropen', () => {
      afterOpen = true;
    });
    modal.addEventListener('afterclose', () => {
      afterClose = true;
    });

    modal.open = true;
    await sleep(360);
    expect(afterOpen).toBe(true);

    modal.close('program');
    await sleep(360);
    expect(afterClose).toBe(true);
  });
});
