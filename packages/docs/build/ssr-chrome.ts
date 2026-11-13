/**
 * Build-time Declarative Shadow DOM for every ranui host on a docs page.
 *
 * Component FOUC plates (each components/<name>/fouc.less, aggregated into
 * ranui.css via theme/undefined.less) cover SPA / late-chunk loads. When the
 * host can SSR, expand the full HTML so closed DSD + data-ran-dsd paint the
 * real control and skip those plates — no site-specific allowlist.
 *
 * Client upgrade reuses the closed root via ElementInternals.shadowRoot and
 * keeps the painted tree (structure bind, no remount wipe).
 */
import 'ranui/attachments';
import 'ranui/button';
import 'ranui/card';
import 'ranui/checkbox';
import 'ranui/colorpicker';
import 'ranui/conversation';
import 'ranui/disclosure-row';
import 'ranui/dropdown';
import 'ranui/fan-gallery';
import 'ranui/glass';
import 'ranui/icon';
import 'ranui/image';
import 'ranui/input';
import 'ranui/loading';
import 'ranui/markdown';
import 'ranui/math';
import 'ranui/menubar';
import 'ranui/mermaid';
import 'ranui/message';
import 'ranui/player';
import 'ranui/popover';
import 'ranui/progress';
import 'ranui/reasoning';
import 'ranui/route';
import 'ranui/router';
import 'ranui/scratch';
import 'ranui/section';
import 'ranui/select';
import 'ranui/skeleton';
import 'ranui/state-dot';
import 'ranui/surface-switch';
import 'ranui/tab';
import 'ranui/tabpane';
import 'ranui/theme-switch';
import 'ranui/token-meter';
import 'ranui/tool-card';
import 'ranui/voice-button';
// Intentionally omitted (every-component EXEMPT — construct throws under Node):
// ranui/content, ranui/link, ranui/modal, ranui/radar. They pass through bare;
// hide/FOUC rules in ranui.css cover first paint. renderHTMLToString also
// catches construct failures so a future barrel import stays safe.
import { renderHTMLToString } from 'ranui/ssr-stream';

const HAS_RANUI = /<r-[a-z0-9-]+\b/i;

/**
 * Expand every registered ranui custom element in `html` to Declarative Shadow DOM.
 * Unregistered / SSR-exempt tags are left bare (FOUC plates still apply).
 */
export const ssrRanui = async (html: string): Promise<string> => {
  if (!HAS_RANUI.test(html)) return html;
  return renderHTMLToString(html);
};

/** @deprecated Prefer `ssrRanui` — expands the full page, not only header/home. */
export const ssrHeaderChrome = ssrRanui;
