/**
 * Build-time Declarative Shadow DOM for docs chrome that must paint before upgrade.
 *
 * Client upgrade reuses the closed root via `ElementInternals.shadowRoot` and keeps
 * the painted tree (structure bind, no remount wipe). Skip this pass and first paint
 * falls back to empty hosts again.
 */
import 'ranui/select';
import 'ranui/theme-switch';
import 'ranui/surface-switch';
import 'ranui/menubar';
import 'ranui/input';
import 'ranui/button';
import 'ranui/checkbox';
import { renderHTMLToString } from 'ranui/ssr-stream';

const HEADER_UTILS_RE = /<r-menubar\b[^>]*class="header-utils"[^>]*>[\s\S]*?<\/r-menubar>/i;

/** Home invite card fields — first viewport, same flash class as header chrome. */
const HOME_EXAMPLE_TAGS: RegExp[] = [
  /<r-input\b[^>]*class="example__field"[^>]*>[\s\S]*?<\/r-input>/gi,
  /<r-select\b[^>]*class="example__field"[^>]*>[\s\S]*?<\/r-select>/gi,
  /<r-checkbox\b[^>]*class="example__simulate"[^>]*>[\s\S]*?<\/r-checkbox>/gi,
  /<r-button\b[^>]*class="example__submit"[^>]*>[\s\S]*?<\/r-button>/gi,
];

const expandMatch = async (html: string, match: RegExpExecArray | RegExpMatchArray, label: string): Promise<string> => {
  const expanded = await renderHTMLToString(match[0]);
  if (!expanded.includes('shadowrootmode=')) {
    throw new Error(`${label}: expected Declarative Shadow DOM, but renderHTMLToString returned no shadowrootmode.`);
  }
  const index = match.index ?? 0;
  return html.slice(0, index) + expanded + html.slice(index + match[0].length);
};

/**
 * Expand the docs header `<r-menubar class="header-utils">…</r-menubar>` fragment
 * and the home invite example fields to Declarative Shadow DOM.
 */
export const ssrHeaderChrome = async (html: string): Promise<string> => {
  const header = HEADER_UTILS_RE.exec(html);
  let out = header ? await expandMatch(html, header, 'ssrHeaderChrome') : html;

  for (const re of HOME_EXAMPLE_TAGS) {
    re.lastIndex = 0;
    const matches = [...out.matchAll(re)];
    for (let i = matches.length - 1; i >= 0; i--) {
      out = await expandMatch(out, matches[i]!, 'ssrHomeExample');
    }
  }
  return out;
};
