import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/scratch';

const pointer = (
  type: string,
  init: Partial<PointerEventInit> & { clientX?: number; clientY?: number },
): PointerEvent => new PointerEvent(type, { pointerId: 1, bubbles: true, ...init });

const mockDrawingContext = () => ({
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  closePath: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillStyle: '',
  globalCompositeOperation: '',
  lineCap: '',
  lineJoin: '',
  lineWidth: 0,
});

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

  it('initializes state with isScratching false and scratchedArea 0', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    expect(scratch.state.isScratching).toBe(false);
    expect(scratch.state.scratchedArea).toBe(0);
  });

  it('onScratchPointerDown sets isScratching and strokes a dab at the pointer position', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;
    vi.spyOn(scratch.scratchTicket, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerDown(pointer('pointerdown', { clientX: 40, clientY: 60 }));

    expect(scratch.state.isScratching).toBe(true);
    expect(scratch.state.lastX).toBe(40);
    expect(scratch.state.lastY).toBe(60);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(40, 60);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(40, 60);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('does not start scratching while disabled', () => {
    const scratch = document.createElement('r-scratch') as any;
    scratch.setAttribute('disabled', '');
    document.body.appendChild(scratch);

    scratch.onScratchPointerDown(pointer('pointerdown', { clientX: 10, clientY: 10 }));
    expect(scratch.state.isScratching).toBe(false);
  });

  it('onScratchPointerMove strokes a line from the last point to the new one and accumulates scratchedArea', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.scratchTicket.width = 200;
    scratch.scratchTicket.height = 200;
    vi.spyOn(scratch.scratchTicket, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
    } as DOMRect);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
    const areaAfterDown = scratch.state.scratchedArea;
    scratch.onScratchPointerMove(pointer('pointermove', { clientX: 30, clientY: 40 })); // distance 50

    expect(mockCtx.moveTo).toHaveBeenLastCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenLastCalledWith(30, 40);
    expect(scratch.state.lastX).toBe(30);
    expect(scratch.state.lastY).toBe(40);
    expect(scratch.state.scratchedArea).toBeGreaterThan(areaAfterDown);
  });

  it('maps client coordinates through the canvas resolution scale, not raw client offsets', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    // Canvas resolution 200x100 rendered at half size (100x50 CSS px) -> scale factor 2.
    scratch.scratchTicket.width = 200;
    scratch.scratchTicket.height = 100;
    vi.spyOn(scratch.scratchTicket, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 100,
      height: 50,
    } as DOMRect);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerDown(pointer('pointerdown', { clientX: 60, clientY: 45 })); // (60-10)*2=100, (45-20)*2=50

    expect(scratch.state.lastX).toBe(100);
    expect(scratch.state.lastY).toBe(50);
  });

  it('onScratchPointerMove does nothing when not currently scratching', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerMove(pointer('pointermove', { clientX: 5, clientY: 5 }));
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  it('onScratchPointerUp sets isScratching false and clears the canvas past the auto-reveal threshold', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;
    scratch.state.isScratching = true;
    scratch.state.activePointerId = 1;
    scratch.state.scratchedArea = 100 * 100 * 0.5; // above the 0.35 threshold

    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerUp(pointer('pointerup', {}));

    expect(scratch.state.isScratching).toBe(false);
    expect(scratch.state.activePointerId).toBeUndefined();
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(scratch.state.scratchedArea).toBe(0);
  });

  it('onScratchPointerUp does not clear when scratchedArea is below the threshold', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.scratchTicket.width = 100;
    scratch.scratchTicket.height = 100;
    scratch.state.isScratching = true;
    scratch.state.activePointerId = 1;
    scratch.state.scratchedArea = 10;

    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerUp(pointer('pointerup', {}));
    expect(mockCtx.clearRect).not.toHaveBeenCalled();
    expect(scratch.state.scratchedArea).toBe(10);
  });

  it('onScratchPointerUp ignores a pointer that is not the one currently scratching', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.state.isScratching = true;
    scratch.state.activePointerId = 1;

    scratch.onScratchPointerUp(pointer('pointerup', { pointerId: 2 }));

    expect(scratch.state.isScratching).toBe(true);
    expect(scratch.state.activePointerId).toBe(1);
  });

  it('onScratchPointerMove returns when ctx is null', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    scratch.state.isScratching = true;
    scratch.state.activePointerId = 1;
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(null as any);
    expect(() => scratch.onScratchPointerMove(pointer('pointermove', { clientX: 1, clientY: 1 }))).not.toThrow();
  });

  it('onScratchPointerUp returns when ctx is null', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    scratch.state.isScratching = true;
    scratch.state.activePointerId = 1;

    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(null as any);
    expect(() => scratch.onScratchPointerUp(pointer('pointerup', {}))).not.toThrow();
  });

  it('ignores a non-primary mouse button (e.g. right-click-drag)', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    vi.spyOn(scratch.scratchTicket, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerDown(pointer('pointerdown', { pointerType: 'mouse', button: 2, clientX: 10, clientY: 10 }));

    expect(scratch.state.isScratching).toBe(false);
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  it('a second touch mid-scratch does not hijack the active stroke', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    vi.spyOn(scratch.scratchTicket, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.onScratchPointerDown(
      pointer('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: 10, clientY: 10 }),
    );
    expect(scratch.state.activePointerId).toBe(1);

    // A second finger touches down before the first is lifted.
    scratch.onScratchPointerDown(
      pointer('pointerdown', { pointerId: 2, pointerType: 'touch', clientX: 90, clientY: 90 }),
    );
    expect(scratch.state.activePointerId).toBe(1); // still the first finger

    // The second finger's move must not be able to draw either.
    const strokesBefore = mockCtx.stroke.mock.calls.length;
    scratch.onScratchPointerMove(pointer('pointermove', { pointerId: 2, clientX: 95, clientY: 95 }));
    expect(mockCtx.stroke.mock.calls.length).toBe(strokesBefore);
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

  it('connectedCallback binds pointer listeners on the canvas — mouse and touch share one path', () => {
    const scratch = document.createElement('r-scratch') as any;
    const addSpy = vi.spyOn(scratch.scratchTicket, 'addEventListener');

    document.body.appendChild(scratch);

    expect(addSpy).toHaveBeenCalledWith('pointerdown', scratch.onScratchPointerDown, expect.any(Object));
    expect(addSpy).toHaveBeenCalledWith('pointermove', scratch.onScratchPointerMove, expect.any(Object));
    expect(addSpy).toHaveBeenCalledWith('pointerup', scratch.onScratchPointerUp, expect.any(Object));
    expect(addSpy).toHaveBeenCalledWith('pointercancel', scratch.onScratchPointerUp, expect.any(Object));
    // A device/OS can reclaim pointer capture mid-gesture without ever firing `pointerup`.
    expect(addSpy).toHaveBeenCalledWith('lostpointercapture', scratch.onScratchPointerUp, expect.any(Object));
  });

  it('drawScratchTicket paints an opaque cover instead of leaving the canvas blank', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);

    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.drawScratchTicket();

    expect(mockCtx.fillStyle).toBeTruthy();
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, scratch.scratchTicket.width, scratch.scratchTicket.height);
  });

  it('syncCanvasResolution matches the canvas buffer to its rendered size × devicePixelRatio', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    vi.spyOn(scratch.scratchTicketContainer, 'getBoundingClientRect').mockReturnValue({
      width: 240,
      height: 120,
    } as DOMRect);
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    const mockCtx = mockDrawingContext();
    vi.spyOn(scratch.scratchTicket, 'getContext').mockReturnValue(mockCtx as any);

    scratch.syncCanvasResolution();

    expect(scratch.scratchTicket.width).toBe(480);
    expect(scratch.scratchTicket.height).toBe(240);
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDpr, configurable: true });
  });

  it('syncCanvasResolution is a no-op when the size has not changed', () => {
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    vi.spyOn(scratch.scratchTicketContainer, 'getBoundingClientRect').mockReturnValue({
      width: 240,
      height: 120,
    } as DOMRect);
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    scratch.syncCanvasResolution();
    scratch.state.scratchedArea = 42;

    scratch.syncCanvasResolution();

    expect(scratch.state.scratchedArea).toBe(42); // unchanged — no reset happened
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

    scratch.onScratchPointerDown(pointer('pointerdown', { clientX: 1, clientY: 1 }));
    expect(scratch.state.isScratching).toBe(false);

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

  it('keeps its container mounted across attribute changes', () => {
    // This replaced a test that removed the container itself and then asserted
    // `attributeChangedCallback` put it back. Nothing in the component ever removes it, so
    // that branch was unreachable and the test was the only thing keeping it alive. What
    // has to hold is that the container mounted at construction stays mounted.
    const scratch = document.createElement('r-scratch') as any;
    document.body.appendChild(scratch);
    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(true);

    const drawSpy = vi.spyOn(scratch, 'drawScratchTicket').mockImplementation(() => {});
    scratch.attributeChangedCallback('disabled', null, 'true');

    expect(scratch._shadowDom.contains(scratch.scratchTicketContainer)).toBe(true);
    expect(drawSpy).toHaveBeenCalled();
  });
});
