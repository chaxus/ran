/**
 * The documentation page document.
 *
 * Minimal on purpose at this stage: header, content, outline. The sidebar, previous/next
 * links and the mobile drawer are the next commit — building them before the 1,393-page
 * pipeline is proven would mean debugging two things at once.
 */
import type { Assets } from 'ssg';
import { SITE } from './config.ts';
import type { DocPage } from './content.ts';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const tocHtml = (page: DocPage): string => {
  if (page.toc.length < 2) return '';
  const items = page.toc
    .map(
      (entry) =>
        `<li class="toc__item toc__item--h${entry.level}">` +
        `<a class="toc__link" href="#${encodeURIComponent(entry.slug)}">${escapeHtml(entry.text)}</a></li>`,
    )
    .join('');
  return `<aside class="toc" aria-label="On this page"><p class="toc__label">On this page</p><ul class="toc__list">${items}</ul></aside>`;
};

export interface RenderDocOptions {
  page: DocPage;
  head: string[];
  assets: Assets;
}

export const renderDoc = ({ page, head, assets }: RenderDocOptions): string => {
  const title = page.url === '/' ? SITE.name : `${page.title} | ${SITE.name}`;
  return `<!doctype html>
<html lang="${page.locale.lang}"${page.locale.rtl ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
${head.join('\n')}
${assets.css.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a class="wordmark" href="/">${escapeHtml(SITE.name)}</a>
    <r-theme-switch class="theme-switch"></r-theme-switch>
  </div>
</header>
<main id="main" class="doc">
${tocHtml(page)}
<article class="prose">${page.html}</article>
</main>
${assets.js.map((src) => `<script type="module" src="${src}"></script>`).join('\n')}
</body>
</html>
`;
};
