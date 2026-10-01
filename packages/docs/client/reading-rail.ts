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
  const points = headings
    .filter((heading, index) => heading.tagName === 'H2' || index === 0)
    .slice(0, 48)
    .map(() => View('circle').attrs({ class: 'reading-rail__node', cx: '10', r: '1.5' }).build());
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
  let measuredHeight = -1;
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
  const animate = (): void => {
    frame = 0;
    if (disposed) return;
    displayed += (target - displayed) * 0.2;
    if (Math.abs(target - displayed) < 0.15) displayed = target;
    paint();
    if (displayed !== target) frame = requestAnimationFrame(animate);
  };
  const update = (index: number): void => {
    latestIndex = index;
    const rect = article.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (84 - rect.top) / Math.max(1, rect.height - innerHeight + 84)));
    target = 20 + progress * 280;
    if (rect.height !== measuredHeight) {
      measuredHeight = rect.height;
      const visible = headings.filter((heading, i) => heading.tagName === 'H2' || i === 0).slice(0, 48);
      points.forEach((point, i) => {
        const top = visible[i].getBoundingClientRect().top - rect.top;
        point.setAttribute('cy', String(20 + Math.max(0, Math.min(1, top / Math.max(1, rect.height))) * 280));
      });
    }
    title.textContent = headings[index]?.textContent?.replace(/#$/, '').trim() ?? headings[0]?.textContent ?? '';
    percent.textContent = `${Math.round(progress * 100)}%`;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !toc.hasAttribute('data-reading')) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      displayed = target;
      paint();
    } else if (!frame) frame = requestAnimationFrame(animate);
  };
  return {
    update,
    dispose: () => {
      disposed = true;
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
