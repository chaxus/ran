import {
  alignCrossAxis,
  computePlacement,
  type Placement,
  type PlacementAlign,
  type PlacementSide,
} from '@/utils/placement';

/**
 * The shared machinery behind every panel that floats next to something else:
 * r-select's dropdown, r-popover's content, and anything either of them grows
 * into.
 *
 * It exists because those two had written it twice. The copies had already
 * started to drift -- r-select's reposition listeners carried a comment saying
 * they mirrored r-popover's, which is the usual sign that a shared thing is
 * being kept in step by hand -- and the parts that had not drifted were the
 * parts nobody had touched yet.
 *
 * What lives here: the open/closed state machine, portalling, positioning,
 * staying with the anchor while the page scrolls, the enter/exit animation, and
 * the four lifecycle events. What stays in the component: when to open, what to
 * put in the panel, and the sizing or arrow adjustments only it knows about,
 * supplied as hooks.
 *
 * `open` is the state and nothing infers it from the DOM. A panel's
 * `style.display` trails the state by the length of the exit animation, so any
 * decision made by reading it is a decision about the frame rather than the
 * intent -- which is how a click could land in that window and be swallowed,
 * and how `aria-expanded` drifted from what was on screen.
 */

/** The animation class pairs `r-dropdown` ships, keyed by the side actually used. */
const TRANSIT: Record<PlacementSide, { enter: string; exit: string }> = {
  bottom: { enter: 'ran-dropdown-down-in', exit: 'ran-dropdown-down-out' },
  top: { enter: 'ran-dropdown-up-in', exit: 'ran-dropdown-up-out' },
  left: { enter: 'ran-dropdown-left-in', exit: 'ran-dropdown-left-out' },
  right: { enter: 'ran-dropdown-right-in', exit: 'ran-dropdown-right-out' },
};

/** Everything a positioning pass worked out, handed to the hooks. */
export interface FloatingPosition {
  /** Viewport coordinates for the panel's top-left corner. */
  top: number;
  left: number;
  /** The side actually used, after any flip. */
  side: PlacementSide;
  /** The cross-axis alignment actually used. */
  align: PlacementAlign;
  /** The anchor's box, in viewport coordinates. */
  anchorRect: DOMRect;
  /** The panel's box, measured before this pass moved it. */
  panelRect: DOMRect;
  /** The custom positioning container, when `containerId` names one. */
  container: HTMLElement | null;
}

export interface FloatingOptions {
  /** The element that owns the panel: holds `open`, and receives the events. */
  host: HTMLElement;
  /** The panel. Read every time, because components build theirs lazily. */
  panel: () => HTMLElement | null | undefined;
  /** What the panel is positioned against. Defaults to the host. */
  anchor?: () => HTMLElement;
  /** Preferred side, optionally with an alignment suffix (`bottom-end`). */
  placement: () => Placement;
  /** Gap between anchor and panel, in px. */
  offset?: number;
  /**
   * `id` of an element to position within instead of the viewport. Flip and
   * shift do not apply there (they reason in viewport coordinates); alignment
   * does, through the same `alignCrossAxis` the viewport path uses.
   */
  containerId?: () => string;
  /**
   * Called before the panel is measured, for a component that sizes its panel
   * from the anchor -- r-select matches the trigger's width, and the width has
   * to be in place before the height that the flip decision needs is real.
   */
  beforeMeasure?: (anchorRect: DOMRect, panel: HTMLElement) => void;
  /**
   * The panel's size, when its own box does not report it. r-select pins the
   * panel host's width to the trigger's, but a consumer can make the panel
   * *inside* that host wider (`::part(dropdown) { min-width }`, so a long option
   * is not clipped by a deliberately narrow trigger -- r-player's quality menu
   * does exactly this). The extra width simply overflows the host, invisible to
   * a measurement taken on it, and both the alignment and the flip decision
   * would then be computed against a width nobody sees.
   */
  measurePanel?: (panel: HTMLElement) => { width: number; height: number };
  /**
   * Last word on the coordinates. Return a replacement to override the computed
   * position; return nothing to accept it.
   */
  adjust?: (position: FloatingPosition, panel: HTMLElement) => { top: number; left: number } | void;
  /** Called once the coordinates are written, for arrow nudges and the like. */
  afterPosition?: (position: FloatingPosition, panel: HTMLElement) => void;
}

/**
 * Wait for whatever the stylesheet is animating on `el` to finish.
 *
 * Reading the CSS rather than duplicating its duration in a timer. The three
 * components used to hold a `const animationTime = 300` each, matched by hand
 * against `--ran-dropdown-animation-duration` in the stylesheet -- a comment in
 * `dropdown/index.less` records what happened the last time the two got out of
 * step, and a consumer setting that token would have reproduced it. Asking the
 * element what it is animating cannot go out of step, and it answers
 * immediately when there is nothing to wait for: a panel under
 * `prefers-reduced-motion`, or one whose animation a consumer turned off.
 */
const settleAnimations = (el: HTMLElement, done: () => void): void => {
  // No animation API (jsdom) or no frames to wait for: there is provably
  // nothing running, so finish in this tick rather than a microtask later.
  if (typeof el.getAnimations !== 'function' || typeof requestAnimationFrame !== 'function') {
    done();
    return;
  }
  // A class applied this tick has no running animation until the next frame.
  requestAnimationFrame(() => {
    const running = el.getAnimations();
    if (!running.length) {
      done();
      return;
    }
    void (async () => {
      // `finished` rejects on cancel, which is a normal outcome here: a panel
      // re-opened mid-exit cancels the exit animation.
      await Promise.allSettled(running.map((animation) => animation.finished));
      done();
    })();
  });
};

export class FloatingController {
  private options: FloatingOptions;
  private repositionBound = false;
  /**
   * Bumped on every transition. An async tail (waiting on animations) checks it
   * before touching the DOM, so a panel that has since been re-opened is never
   * hidden by the exit that was already in flight when it re-opened. A timeout
   * would only have guessed at the same thing.
   */
  private generation = 0;

  constructor(options: FloatingOptions) {
    this.options = options;
  }

  /** The element the panel is positioned against. */
  private get anchor(): HTMLElement {
    return this.options.anchor?.() ?? this.options.host;
  }

  /**
   * Drive the panel to `open`.
   *
   * The only writer of the panel's display, its transit class, the reposition
   * listeners and the host's `aria-expanded` -- which is why those four cannot
   * disagree with each other or with the state.
   */
  apply = (open: boolean): void => {
    const generation = ++this.generation;
    const { host } = this.options;
    host.setAttribute('aria-expanded', open ? 'true' : 'false');
    const panel = this.options.panel();
    if (!panel) return;

    if (open) {
      host.dispatchEvent(new CustomEvent('show'));
      panel.style.setProperty('display', 'block');
      this.attachReposition();
      this.position(true);
      settleAnimations(panel, () => {
        if (generation !== this.generation) return;
        panel.removeAttribute('transit');
        host.dispatchEvent(new CustomEvent('after-show'));
      });
      return;
    }

    this.detachReposition();
    if (panel.style.display === 'none') return;
    host.dispatchEvent(new CustomEvent('hide'));
    panel.setAttribute('transit', TRANSIT[this.side()].exit);
    settleAnimations(panel, () => {
      if (generation !== this.generation) return;
      panel.style.setProperty('display', 'none');
      panel.removeAttribute('transit');
      host.dispatchEvent(new CustomEvent('after-hide'));
    });
  };

  /** The side of the requested placement, without its alignment suffix. */
  private side = (): PlacementSide => this.options.placement().split('-')[0] as PlacementSide;

  /**
   * Place the panel next to the anchor.
   *
   * Deferred to the next frame so a `display: block` set this tick, and any
   * content added with it, are part of the measurement -- the flip decision
   * needs the panel's real laid-out height, which is also why the entrance
   * animation is chosen here (from the side actually used) rather than by the
   * caller (from the side merely asked for).
   */
  position = (applyEntranceTransit = false): void => {
    const panel = this.options.panel();
    if (!panel) return;
    const run = (): void => {
      const current = this.options.panel();
      if (current) this.write(current, applyEntranceTransit);
    };
    if (applyEntranceTransit && typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else run();
  };

  private write(panel: HTMLElement, applyEntranceTransit: boolean): void {
    const { offset = 0, containerId, beforeMeasure, measurePanel, adjust, afterPosition } = this.options;
    const anchorRect = this.anchor.getBoundingClientRect();
    beforeMeasure?.(anchorRect, panel);

    const rootNode = this.options.host.getRootNode() as ShadowRoot | Document;
    const id = containerId?.() ?? '';
    const container = id ? ((rootNode as Document).getElementById?.(id) ?? document.getElementById(id)) : null;
    const ownRect = panel.getBoundingClientRect();
    const measured = measurePanel?.(panel);
    // Keep the DOMRect for the hooks, but position against the measured size.
    const panelRect = ownRect;
    const panelWidth = measured?.width ?? ownRect.width;
    const panelHeight = measured?.height ?? ownRect.height;
    const requested = this.options.placement();
    const align = (requested.split('-')[1] as PlacementAlign | undefined) ?? 'start';

    let top: number;
    let left: number;
    let side = this.side();

    if (container) {
      // Coordinates are relative to the container, not the viewport, so the
      // flip/shift middleware -- which reasons in viewport space -- does not
      // apply. Alignment still does, through the same helper.
      const containerRect = container.getBoundingClientRect();
      const vertical = side === 'top' || side === 'bottom';
      if (vertical) {
        top =
          side === 'bottom'
            ? anchorRect.bottom - containerRect.top + offset
            : anchorRect.top - containerRect.top - panelHeight - offset;
        left = alignCrossAxis(align, anchorRect.left, anchorRect.width, panelWidth) - containerRect.left;
      } else {
        top = alignCrossAxis(align, anchorRect.top, anchorRect.height, panelHeight) - containerRect.top;
        left =
          side === 'right'
            ? anchorRect.right - containerRect.left + offset
            : anchorRect.left - containerRect.left - panelWidth - offset;
      }
    } else {
      const computed = computePlacement({
        anchor: { top: anchorRect.top, left: anchorRect.left, width: anchorRect.width, height: anchorRect.height },
        floating: { width: panelWidth, height: panelHeight },
        placement: requested,
        offset,
      });
      side = computed.side;
      top = computed.top + window.scrollY;
      left = computed.left + window.scrollX;
    }

    const position: FloatingPosition = { top, left, side, align, anchorRect, panelRect, container };
    const override = adjust?.(position, panel);
    if (override) {
      position.top = override.top;
      position.left = override.left;
    }

    panel.style.setProperty('position', 'absolute');
    panel.style.setProperty('inset', `${position.top}px auto auto ${position.left}px`);
    panel.style.setProperty('--ran-x', `${position.left}px`);
    panel.style.setProperty('--ran-y', `${position.top}px`);
    if (applyEntranceTransit) panel.setAttribute('transit', TRANSIT[position.side].enter);
    afterPosition?.(position, panel);
  }

  /**
   * The panel is portalled and positioned once on open, so it comes adrift when
   * the page or any scroll container moves under it -- a select in a sticky
   * header, a popover in a scrolling pane. Capture-phase scroll catches nested
   * scrollers, which do not bubble.
   */
  private reposition = (): void => {
    const panel = this.options.panel();
    if (panel?.style.display === 'block') this.position();
  };

  private attachReposition(): void {
    if (this.repositionBound || typeof window === 'undefined') return;
    window.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition);
    this.repositionBound = true;
  }

  private detachReposition(): void {
    if (!this.repositionBound || typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
    this.repositionBound = false;
  }

  /** Drop the listeners. Call from `disconnectedCallback`. */
  destroy = (): void => {
    this.generation++;
    this.detachReposition();
  };
}
