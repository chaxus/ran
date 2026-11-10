/**
 * Build-time Declarative Shadow DOM for header chrome.
 *
 * Not wired into `build.ts` today: ranui attaches **closed** shadow roots, so the
 * client `attachShadow` wipe-rebuilds the DSD snapshot and first paint flashes
 * harder than empty FOUC plates. Keep this helper for when open-root hydration
 * lands; call it from the page writer only after upgrade reuses the snapshot.
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
