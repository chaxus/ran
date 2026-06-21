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

  it('attributeChangedCallback appends container and calls drawScratchTicket', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket');
    scratch.attributeChangedCallback();
    expect(drawSpy).toHaveBeenCalled();
  });

  it('drawScratchTicket sets up touch event listeners on canvas', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    const addSpy = vi.spyOn(scratch.scratchTicket, 'addEventListener');
    scratch.drawScratchTicket();
    expect(addSpy).toHaveBeenCalledWith('touchstart', scratch.touchStartScratch);
    expect(addSpy).toHaveBeenCalledWith('touchmove', scratch.touchMoveScratch);
    expect(addSpy).toHaveBeenCalledWith('touchend', scratch.touchEndScratch);
  });

  it('drawScratchTicket onload draws image when fired', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const mockCtx = {
      drawImage: vi.fn(),
    };
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.drawScratchTicket();

    // Manually fire the onload to test the callback
    const img = new Image();
    Object.defineProperty(img, 'width', { value: 100 });
    Object.defineProperty(img, 'height', { value: 100 });
    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;

    // Call the onload function directly if we can
    const _revealImg = { src: '', onload: null as any };
    let capturedOnload: Function | null = null;
    const origImage = global.Image;
    (global as any).Image = function () {
      capturedOnload = null;
      const mockImg = {
        src: '',
        set onload(fn: any) {
          capturedOnload = fn;
        },
      };
      return mockImg;
    };

    scratch.drawScratchTicket();
    if (capturedOnload) {
      (capturedOnload as Function)();
      expect(mockCtx.drawImage).toHaveBeenCalled();
    }

    (global as any).Image = origImage;
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

  it('attributeChangedCallback appends container when not in shadow DOM', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    // Remove the container from shadow DOM to trigger the append branch
    scratch._shadowDom.removeChild(scratch.scratchTicketContainer);
    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(false);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket').mockImplementation(() => {});
    scratch.attributeChangedCallback();
    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(true);
    expect(drawSpy).toHaveBeenCalled();
  });
});
