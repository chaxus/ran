import copyIcon from '@/assets/icons/copy.svg?raw';
import checkIcon from '@/assets/icons/check.svg?raw';
import downloadIcon from '@/assets/icons/download.svg?raw';
import fullscreenIcon from '@/assets/icons/fullscreen.svg?raw';
import zoomInIcon from '@/assets/icons/zoom-in.svg?raw';
import zoomOutIcon from '@/assets/icons/zoom-out.svg?raw';
import refreshIcon from '@/assets/icons/refresh.svg?raw';

/**
 * Core action glyphs that `<r-icon>` registers automatically on load (see index.ts), so
 * any component or app can use `<r-icon name="copy">` without importing/registering them.
 * The rest of `assets/icons/` stays opt-in via `registerBuiltinIcons()`. Keep this set
 * small — every `<r-icon>` consumer pays for these ~2KB.
 *
 * NOTE: these are *outline/stroke* glyphs (unlike ranui's filled 1024-grid builtins).
 * `r-icon`'s `setColor` forces an inline `fill: currentColor` on the <svg> root, which
 * would flood-fill an outline icon — so each of these SVGs wraps its shapes in a
 * `<g fill="none">`; the group's own `fill` attribute isn't touched by that inline style,
 * so the icon stays a clean outline. Author any future stroke icon the same way.
 */
export const coreIcons: Record<string, string> = {
  copy: copyIcon,
  check: checkIcon,
  download: downloadIcon,
  fullscreen: fullscreenIcon,
  'zoom-in': zoomInIcon,
  'zoom-out': zoomOutIcon,
  refresh: refreshIcon,
};
