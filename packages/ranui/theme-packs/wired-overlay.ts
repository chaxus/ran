import rough from 'roughjs';

// Components that receive rough JS borders
const SELECTORS = [
  'r-button',
  'r-input',
  'r-checkbox',
  'r-select',
  'r-modal',
  'r-message',
  'r-tab',
  'r-progress',
  'r-colorpicker',
  'r-skeleton',
  'r-card',
  'r-section',
]
  .map((tag) => `[data-ran-theme-pack="wired"] ${tag}:not([data-wired-skip])`)
  .join(',');

const ROUGHNESS = 2;
const STROKE_WIDTH = 1.5;
const STROKE_COLOR = '#111827';
const BOWING = 0.85;
// Extra padding so the rough stroke clears the element boundary
const PAD = 3;

// Stable per-element seed so borders don't jitter on re-render
const seeds = new WeakMap<Element, number>();
let seedCounter = 1;
function getSeed(el: Element): number {
  if (!seeds.has(el)) seeds.set(el, seedCounter++);
  return seeds.get(el)!;
}

let layer: SVGSVGElement | null = null;
const groups = new Map<Element, SVGGElement>();
const tracked = new Set<Element>();
let rafPending = false;
let active = false;

let ro: ResizeObserver | null = null;
let mo: MutationObserver | null = null;

const generator = rough.generator();

// ── Layer ──────────────────────────────────────────────────────────────────

function ensureLayer(): SVGSVGElement {
  if (layer?.isConnected) return layer;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('data-ran-wired-overlay', '');
  Object.assign(svg.style, {
    // position: absolute so the SVG scrolls with the page; paths use document
    // coordinates (getBoundingClientRect + scrollX/Y) and never need redrawn
    // on scroll — eliminates the one-frame lag that caused jitter.
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '999',
    overflow: 'visible',
  });
  document.body.appendChild(svg);
  layer = svg;
  return svg;
}

// ── Drawing ────────────────────────────────────────────────────────────────

function drawElement(el: Element): void {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;

  const x = rect.left + window.scrollX - PAD;
  const y = rect.top + window.scrollY - PAD;
  const w = rect.width + PAD * 2;
  const h = rect.height + PAD * 2;

  const drawable = generator.rectangle(x, y, w, h, {
    roughness: ROUGHNESS,
    strokeWidth: STROKE_WIDTH,
    stroke: STROKE_COLOR,
    fill: 'none',
    seed: getSeed(el),
    bowing: BOWING,
  });

  const paths = generator.toPaths(drawable);
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  for (const { d, stroke, strokeWidth } of paths) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', stroke ?? STROKE_COLOR);
    path.setAttribute('stroke-width', String(strokeWidth ?? STROKE_WIDTH));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    g.appendChild(path);
  }

  const existing = groups.get(el);
  if (existing?.isConnected) {
    existing.replaceWith(g);
  } else {
    ensureLayer().appendChild(g);
  }
  groups.set(el, g);
}

function untrack(el: Element): void {
  ro?.unobserve(el);
  groups.get(el)?.remove();
  groups.delete(el);
  tracked.delete(el);
}

function renderAll(): void {
  rafPending = false;
  for (const el of tracked) {
    if (!el.isConnected || !el.matches(SELECTORS)) {
      untrack(el);
    } else {
      drawElement(el);
    }
  }
}

function schedule(): void {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(renderAll);
}

// ── Tracking ───────────────────────────────────────────────────────────────

function trackNew(): void {
  document.querySelectorAll<Element>(SELECTORS).forEach((el) => {
    if (tracked.has(el)) return;
    tracked.add(el);
    ro?.observe(el);
  });
}

// ── Public API ─────────────────────────────────────────────────────────────

export function activateWiredBorders(): void {
  if (typeof window === 'undefined') return;
  if (active) {
    trackNew();
    schedule();
    return;
  }
  active = true;

  ro = new ResizeObserver(schedule);

  mo = new MutationObserver(() => {
    trackNew();
    schedule();
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-ran-theme-pack'],
  });

  window.addEventListener('resize', schedule, { passive: true });

  trackNew();
  schedule();
}

export function deactivateWiredBorders(): void {
  ro?.disconnect();
  mo?.disconnect();
  ro = null;
  mo = null;
  window.removeEventListener('resize', schedule);
  layer?.remove();
  layer = null;
  tracked.clear();
  groups.clear();
  active = false;
}
