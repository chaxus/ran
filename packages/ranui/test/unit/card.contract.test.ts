import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Card } from '@/components/card';
import '@/components/card';

describe('r-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Shadow DOM structure ──────────────────────────────────────────────────

  it('renders shadow DOM with card, header, body, footer elements', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-card')).not.toBeNull();
    expect(shadow.querySelector('.ran-card-header')).not.toBeNull();
    expect(shadow.querySelector('.ran-card-body')).not.toBeNull();
    expect(shadow.querySelector('.ran-card-footer')).not.toBeNull();
  });

  it('exports part attributes on all structural elements', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card')?.getAttribute('part')).toBe('card');
    expect(shadow.querySelector('.ran-card-header')?.getAttribute('part')).toBe('header');
    expect(shadow.querySelector('.ran-card-title')?.getAttribute('part')).toBe('title');
    expect(shadow.querySelector('.ran-card-description')?.getAttribute('part')).toBe('description');
    expect(shadow.querySelector('.ran-card-body')?.getAttribute('part')).toBe('body');
    expect(shadow.querySelector('.ran-card-footer')?.getAttribute('part')).toBe('footer');
  });

  it('provides named slot for extra header content', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const extraSlot = shadow.querySelector('slot[name="extra"]');
    expect(extraSlot).not.toBeNull();
    expect(extraSlot?.getAttribute('part')).toBe('extra');
  });

  it('provides named slot for footer content', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot[name="footer"]')).not.toBeNull();
  });

  it('provides default slot in card body', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const bodySlot = shadow.querySelector('.ran-card-body slot:not([name])');
    expect(bodySlot).not.toBeNull();
  });

  // ── Title attribute ───────────────────────────────────────────────────────

  it('syncs title attribute to title element on connectedCallback', () => {
    const card = document.createElement('r-card') as Card;
    card.setAttribute('title', 'My Card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card-title')?.textContent).toBe('My Card');
  });

  it('syncs title element when title attribute changes', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('title', 'First');
    expect((card as any)._titleEl.textContent).toBe('First');

    card.setAttribute('title', 'Second');
    expect((card as any)._titleEl.textContent).toBe('Second');
  });

  it('clears title element when title attribute is removed', () => {
    const card = document.createElement('r-card') as Card;
    card.setAttribute('title', 'To Remove');
    document.body.appendChild(card);

    card.removeAttribute('title');
    expect((card as any)._titleEl.textContent).toBe('');
  });

  it('title getter returns attribute value', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('title', 'Test Title');
    expect(card.title).toBe('Test Title');
  });

  it('title getter returns empty string when attribute is absent', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);
    expect(card.title).toBe('');
  });

  it('title setter updates the attribute', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.title = 'Via Setter';
    expect(card.getAttribute('title')).toBe('Via Setter');
  });

  // ── Description attribute ─────────────────────────────────────────────────

  it('syncs description attribute to description element on connectedCallback', () => {
    const card = document.createElement('r-card') as Card;
    card.setAttribute('description', 'My description');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card-description')?.textContent).toBe('My description');
  });

  it('syncs description element when description attribute changes', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('description', 'Alpha');
    expect((card as any)._descriptionEl.textContent).toBe('Alpha');

    card.setAttribute('description', 'Beta');
    expect((card as any)._descriptionEl.textContent).toBe('Beta');
  });

  it('description getter returns attribute value', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('description', 'Some desc');
    expect(card.description).toBe('Some desc');
  });

  it('description getter returns empty string when attribute is absent', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);
    expect(card.description).toBe('');
  });

  it('description setter updates the attribute', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.description = 'Via Setter';
    expect(card.getAttribute('description')).toBe('Via Setter');
  });

  // ── Footer visibility ─────────────────────────────────────────────────────

  it('hides footer by default before any slot content', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    expect((card as any)._footerEl.style.display).toBe('none');
  });

  // ── Sheet attribute ───────────────────────────────────────────────────────

  it('sheet getter returns attribute value', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('sheet', '.ran-card { background: red; }');
    expect(card.sheet).toBe('.ran-card { background: red; }');
  });

  it('sheet getter returns empty string when absent', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);
    expect(card.sheet).toBe('');
  });

  it('sheet setter updates the attribute', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.sheet = '.ran-card { color: green; }';
    expect(card.getAttribute('sheet')).toBe('.ran-card { color: green; }');
  });

  it('attributeChangedCallback applies sheet via syncSheetAttribute', () => {
    const originalCSSStyleSheet = window.CSSStyleSheet;
    try {
      class MockCSSStyleSheet {
        replaceSync() {
          throw new Error('force fallback');
        }
      }
      (window as any).CSSStyleSheet = MockCSSStyleSheet;

      const card = document.createElement('r-card') as Card;
      document.body.appendChild(card);

      card.setAttribute('sheet', '.ran-card { border: 2px solid red; }');

      const shadow = (card as any)._shadowDom as ShadowRoot;
      expect(shadow.innerHTML).toContain('.ran-card { border: 2px solid red; }');
    } finally {
      window.CSSStyleSheet = originalCSSStyleSheet;
    }
  });

  // ── attributeChangedCallback guards ──────────────────────────────────────

  it('attributeChangedCallback skips sync when oldValue === newValue', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const syncTitle = vi.spyOn(card as any, '_syncTitle');
    card.attributeChangedCallback('title', 'same', 'same');
    expect(syncTitle).not.toHaveBeenCalled();
  });

  it('attributeChangedCallback calls _syncTitle when title changes', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const syncTitle = vi.spyOn(card as any, '_syncTitle');
    card.attributeChangedCallback('title', null, 'New Title');
    expect(syncTitle).toHaveBeenCalledOnce();
  });

  it('attributeChangedCallback calls _syncDescription when description changes', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const syncDesc = vi.spyOn(card as any, '_syncDescription');
    card.attributeChangedCallback('description', null, 'New Description');
    expect(syncDesc).toHaveBeenCalledOnce();
  });

  // ── connectedCallback ─────────────────────────────────────────────────────

  it('connectedCallback initializes empty title and description', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    expect((card as any)._titleEl.textContent).toBe('');
    expect((card as any)._descriptionEl.textContent).toBe('');
  });
});
