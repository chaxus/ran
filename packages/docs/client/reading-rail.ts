import { ButtonBuilder, Div, Span, View } from '@alixex/ranview/static';

/** The original links remain the navigation; the SVG is a decorative reading overview. */
export const mountReadingRail = (headings: HTMLElement[]) => {
  const toc = document.querySelector<HTMLElement>('.toc');
  const list = toc?.querySelector<HTMLElement>('.toc__list');
  const article = document.querySelector<HTMLElement>('.prose');
  if (!toc || !list || !article) return { update: (_index: number) => {}, dispose: () => {} };
  const label = toc.querySelector('.toc__label')?.textContent ?? '';
  const toggle = ButtonBuilder()
    .attrs({ type: 'button', class: 'toc-mode', 'aria-label': label, 'aria-pressed': 'false' })
    .children(
      Span().text(label),
      View('svg')
        .attrs({ viewBox: '0 0 20 20', width: '18', height: '18', 'aria-hidden': 'true' })
        .children(
          View('path').attrs({
            d: 'M4 4h12M4 10h8M4 16h12',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
          }),
        ),
    )
    .build();
  const path = View('path').attrs({ class: 'reading-rail__path', fill: 'none', 'stroke-width': '1.25' }).build();
  const marker = View('circle').attrs({ class: 'reading-rail__marker', r: '3' }).build();
  const chapters = headings.filter((heading, index) => heading.tagName === 'H2' || index === 0);
  // Sample the whole document, retaining its first and last chapter, instead of
  // dropping every chapter after the 48th on long references.
  const count = Math.min(48, chapters.length);
  const visible = Array.from(
    { length: count },
    (_, index) => chapters[Math.round((index * (chapters.length - 1)) / Math.max(1, count - 1))],
  );
  const points = visible.map((heading) =>
    View('circle').attrs({ class: 'reading-rail__node', cx: '10', r: '1.5', 'data-heading': heading.id }).build(),
  );
  const svg = View('svg')
    .attrs({ viewBox: '0 0 180 320', preserveAspectRatio: 'none', class: 'reading-rail__svg', 'aria-hidden': 'true' })
    .children(path, ...points, marker)
    .build();
  const title = Span().attr('class', 'reading-rail__title').build();
  const percent = Span().attr('class', 'reading-rail__percent').build();
  const caption = Div().attr('class', 'reading-rail__caption').children(title, percent).build();
  const rail = Div().attrs({ class: 'reading-rail', 'aria-hidden': 'true' }).children(svg, caption).build();
  const stage = Div().attr('class', 'toc-stage').children(list, rail).build();
  const oldLabel = toc.querySelector<HTMLElement>('.toc__label');
  if (oldLabel) oldLabel.hidden = true;
  toc.prepend(toggle);
  toc.append(stage);
  const setReading = (reading: boolean): void => {
    toc.toggleAttribute('data-reading', reading);
    toggle.setAttribute('aria-pressed', String(reading));
  };
  const click = (): void => {
    setReading(!toc.hasAttribute('data-reading'));
    update(latestIndex);
  };
  const engage = (): void => toc.setAttribute('data-engaged', '');
  const leave = (): void => {
    if (!list.contains(document.activeElement)) toc.removeAttribute('data-engaged');
  };
  const blur = (event: FocusEvent): void => {
    if (!list.contains(event.relatedTarget as Node | null)) toc.removeAttribute('data-engaged');
  };
  toggle.addEventListener('click', click);
  stage.addEventListener('pointerenter', engage);
  stage.addEventListener('pointerleave', leave);
  list.addEventListener('focusin', engage);
  list.addEventListener('focusout', blur);
  setReading(toc.dataset.readingDefault === 'true');
  let frame = 0;
  let latestIndex = -1;
  let geometry = '';
  let previousTime = 0;
  let disposed = false;
  let displayed = 20;
  let target = 20;
  const paint = (): void => {
    const y = displayed;
    path.setAttribute(
      'd',
      `M10 0 L10 ${y - 20} C10 ${y - 8} 24 ${y - 10} 24 ${y} C24 ${y + 10} 10 ${y + 8} 10 ${y + 20} L10 320`,
    );
    marker.setAttribute('cx', '24');
    marker.setAttribute('cy', String(y));
    caption.style.top = `${(y / 320) * 100}%`;
  };
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia?.('(min-width: 1240px)');
  const animate = (time: number): void => {
    frame = 0;
    if (disposed) return;
    const elapsed = previousTime ? Math.min(64, Math.max(0, time - previousTime)) : 16;
    previousTime = time;
    displayed += (target - displayed) * (1 - Math.exp(-elapsed / 75));
    if (Math.abs(target - displayed) < 0.15) displayed = target;
    paint();
    if (displayed !== target) frame = requestAnimationFrame(animate);
  };
  const update = (index: number): void => {
    latestIndex = index;
    const rect = article.getBoundingClientRect();
    const edge = (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 60) + 24;
    const distance = Math.max(1, rect.height - innerHeight + edge);
    const progress = Math.max(0, Math.min(1, (edge - rect.top) / distance));
    target = 20 + progress * 280;
    const nextGeometry = `${rect.height}:${innerHeight}:${edge}`;
    if (nextGeometry !== geometry) {
      geometry = nextGeometry;
      points.forEach((point, i) => {
        const top = visible[i].getBoundingClientRect().top - rect.top;
        point.setAttribute('cy', String(20 + Math.max(0, Math.min(1, top / distance)) * 280));
      });
    }
    const heading = headings[index] ?? headings[0];
    const text = heading
      ? [...heading.childNodes]
          .filter((node) => !(node instanceof Element && node.classList.contains('anchor')))
          .map((node) => node.textContent)
          .join('')
          .trim()
      : '';
    if (title.textContent !== text) {
      title.textContent = text;
      title.title = text;
    }
    const progressText = `${Math.round(progress * 100)}%`;
    if (percent.textContent !== progressText) percent.textContent = progressText;
    if (
      reducedMotion?.matches ||
      wide?.matches === false ||
      !toc.hasAttribute('data-reading') ||
      toc.hasAttribute('data-engaged')
    ) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      displayed = target;
      paint();
    } else if (!frame) {
      previousTime = 0;
      frame = requestAnimationFrame(animate);
    }
  };
  const mediaChange = (): void => update(latestIndex);
  reducedMotion?.addEventListener('change', mediaChange);
  wide?.addEventListener('change', mediaChange);
  return {
    update,
    dispose: () => {
      disposed = true;
      reducedMotion?.removeEventListener('change', mediaChange);
      wide?.removeEventListener('change', mediaChange);
      if (frame) cancelAnimationFrame(frame);
      toggle.removeEventListener('click', click);
      stage.removeEventListener('pointerenter', engage);
      stage.removeEventListener('pointerleave', leave);
      list.removeEventListener('focusin', engage);
      list.removeEventListener('focusout', blur);
      toc.append(list);
      stage.remove();
      toggle.remove();
      if (oldLabel) oldLabel.hidden = false;
      toc.removeAttribute('data-reading');
      toc.removeAttribute('data-engaged');
    },
  };
};
