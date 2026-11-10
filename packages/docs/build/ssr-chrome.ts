/**
 * Build-time Declarative Shadow DOM for header chrome.
 *
 * Client upgrade reuses the closed root via `ElementInternals.shadowRoot` and keeps
 * the painted tree (structure bind, no remount wipe). Skip this pass and first paint
 * falls back to empty FOUC plates again.
 */
import 'ranui/select';
import 'ranui/theme-switch';
import 'ranui/surface-switch';
import 'ranui/menubar';
import { renderHTMLToString } from 'ranui/ssr-stream';

const HEADER_UTILS_RE = /<r-menubar\b[^>]*class="header-utils"[^>]*>[\s\S]*?<\/r-menubar>/i;

/**
 * Expand the docs header `<r-menubar class="header-utils">…</r-menubar>` fragment
 * to Declarative Shadow DOM. Leaves the rest of the page untouched.
 */
export const ssrHeaderChrome = async (html: string): Promise<string> => {
  const match = HEADER_UTILS_RE.exec(html);
  if (!match) return html;
  const expanded = await renderHTMLToString(match[0]);
  // Fail the build if the registry missed a tag — silent pass-through would ship
  // empty hosts again and reintroduce the first-paint flash.
  if (!expanded.includes('shadowrootmode=')) {
    throw new Error(
      'ssrHeaderChrome: expected Declarative Shadow DOM in header-utils, but renderHTMLToString returned no shadowrootmode. Check ranui SSR registry imports.',
    );
  }
  return html.slice(0, match.index) + expanded + html.slice(match.index + match[0].length);
};
