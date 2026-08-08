import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/scratch';

describe('r-scratch contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with correct structure', () => {
    const scratch = document.createElement('r-scratch');
    document.body.appendChild(scratch);

    const shadow = (scratch as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    expect(shadow.querySelector('.ran-scratch-ticket')).not.toBeNull();
    expect(shadow.querySelector('.ran-scratch-ticket-award')).not.toBeNull();
    expect(shadow.querySelector('.ran-scratch-ticket-canvas')).not.toBeNull();
  });

  it('initializes state with touchStart false and scratchArea 0', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    expect(scratch.state.touchStart).toBe(false);
    expect(scratch.state.scratchArea).toBe(0);
  });

  it('touchStartScratch sets touchStart to true', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const touch = { clientX: 10, clientY: 10 };
    const event = { touches: [touch] } as unknown as TouchEvent;
    scratch.touchStartScratch(event);
    expect(scratch.state.touchStart).toBe(true);
  });

  it('touchEndScratch sets touchStart to false', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.state.touchStart = true;
    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;

    const mockCtx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      closePath: vi.fn(),
      clearRect: vi.fn(),
      globalCompositeOperation: '',
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.touchEndScratch();
    expect(scratch.state.touchStart).toBe(false);
  });

  it('touchMoveScratch increments scratchArea when touchStart is true', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.state.touchStart = true;
    scratch.state.scratchArea = 0;

    const mockCtx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      closePath: vi.fn(),
      globalCompositeOperation: '',
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.touchMoveScratch();
    expect(scratch.state.scratchArea).toBe(30);
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalled();
  });

  it('touchMoveScratch does nothing when touchStart is false', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.state.touchStart = false;
    const mockCtx = { beginPath: vi.fn() };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.touchMoveScratch();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('touchEndScratch clears canvas when scratchArea exceeds 3% threshold', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;
    scratch.state.scratchArea = 500; // > 100*100*0.03 = 300

    const mockCtx = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      closePath: vi.fn(),
      globalCompositeOperation: '',
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.touchEndScratch();
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(scratch.state.scratchArea).toBe(0);
  });

  it('attributeChangedCallback appends container and calls drawScratchTicket when value changes', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket');
    scratch.attributeChangedCallback('disabled', null, 'true');
    expect(drawSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips work when old === next', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket');
    scratch.attributeChangedCallback('disabled', 'true', 'true');
    expect(drawSpy).not.toHaveBeenCalled();
  });

  it('connectedCallback binds touch listeners on the canvas', () => {
    const scratch = document.createElement('r-scratch') as any;
    const addSpy = vi.spyOn(scratch.scratchTicket, 'addEventListener');

    document.body.appendChild(scratch);

    expect(addSpy).toHaveBeenCalledWith('touchstart', scratch.touchStartScratch, expect.any(Object));
    expect(addSpy).toHaveBeenCalledWith('touchmove', scratch.touchMoveScratch, expect.any(Object));
    expect(addSpy).toHaveBeenCalledWith('touchend', scratch.touchEndScratch, expect.any(Object));
  });

  it('drawScratchTicket paints an opaque cover instead of leaving the canvas blank', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const mockCtx = {
      fillRect: vi.fn(),
      fillStyle: '',
      globalCompositeOperation: '',
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.drawScratchTicket();

    expect(mockCtx.fillStyle).toBeTruthy();
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, scratch.scratchTicket.width, scratch.scratchTicket.height);
  });

  it('touchEndScratch does not clear when scratchArea below threshold', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;
    scratch.state.scratchArea = 10; // below 100*100*0.03 = 300

    const mockCtx = {
      clearRect: vi.fn(),
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.touchEndScratch();
    expect(mockCtx.clearRect).not.toHaveBeenCalled();
    expect(scratch.state.scratchArea).toBe(10);
  });

  it('touchMoveScratch returns when ctx is null', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.state.touchStart = true;
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(null as any);
    expect(() => scratch.touchMoveScratch()).not.toThrow();
  });

  it('touchEndScratch returns when ctx is null', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(null as any);
    expect(() => scratch.touchEndScratch()).not.toThrow();
  });

  it('projects arbitrary light-DOM content as the reveal layer via the default slot', () => {
    // The reveal content is arbitrary (text, an image, an <r-icon>, several
    // elements) rather than a fixed icon+size pair — it's projected through
    // the default slot exactly like every other ranui component's content.
    const scratch = document.createElement('r-scratch') as any;
    scratch.innerHTML = '<span class="prize">You won 50 coins</span>';
    document.body.appendChild(scratch);

    const slot = scratch._shadowDom.querySelector('.ran-scratch-ticket-award slot') as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot.assignedElements();
    expect(assigned).toHaveLength(1);
    expect(assigned[0].textContent).toBe('You won 50 coins');
  });

  it('disabled property reflects to the attribute and back', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    expect(scratch.disabled).toBe(false);

    scratch.disabled = true;
    expect(scratch.hasAttribute('disabled')).toBe(true);
    expect(scratch.disabled).toBe(true);

    scratch.disabled = false;
    expect(scratch.hasAttribute('disabled')).toBe(false);
  });

  it('reflects aria-disabled and blocks scratching while disabled', () => {
    const scratch = document.createElement('r-scratch') as any;
    scratch.setAttribute('disabled', '');
    document.body.appendChild(scratch);
    expect(scratch.getAttribute('aria-disabled')).toBe('true');

    scratch.touchStartScratch();
    expect(scratch.state.touchStart).toBe(false);

    scratch.state.touchStart = true; // simulate as if a touch had started
    // fillRect included: attributeChangedCallback always redraws the cover, so
    // flipping `disabled` below re-enters drawScratchTicket via the same mock.
    const mockCtx = { beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), closePath: vi.fn(), fillRect: vi.fn() };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);
    scratch.touchMoveScratch();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();

    scratch.disabled = false;
    expect(scratch.getAttribute('aria-disabled')).toBe('false');
  });

  it('sheet property reflects to attribute', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.sheet = '.ran-scratch-ticket-award { background: red; }';
    expect(scratch.getAttribute('sheet')).toBe('.ran-scratch-ticket-award { background: red; }');
    expect(scratch.sheet).toBe('.ran-scratch-ticket-award { background: red; }');
  });

  it('attributeChangedCallback appends container when not in shadow DOM', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    // Remove the container from shadow DOM to trigger the append branch
    scratch._shadowDom.removeChild(scratch.scratchTicketContainer);
    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(false);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket').mockImplementation(() => {});
    scratch.attributeChangedCallback('disabled', null, 'true');
    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(true);
    expect(drawSpy).toHaveBeenCalled();
  });
});
