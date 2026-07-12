// Zero-config registration for ranui's bundled icon set.
//
// `<r-icon>` has no built-in icons — it only renders SVGs registered into its
// in-memory registry. Calling `registerBuiltinIcons()` once (as early as
// possible in your entry) makes every name in `RAN_ICON_NAMES` renderable via
// `<r-icon name="lock">`, with no asset-path or bundler-glob wiring on the
// consumer side: the SVG strings are inlined into this module at build time, so
// they travel inside the published package (unlike the raw `assets/*.svg` files,
// which are not shipped).
import { registerIcons } from './index';

// Vite resolves this glob at ranui's build time: each SVG is inlined as a raw
// string constant, so the built output carries the icon set with no runtime fetch.
const modules = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const builtinIcons: Record<string, string> = {};
for (const [path, svg] of Object.entries(modules)) {
  const name = path
    .split('/')
    .pop()
    ?.replace(/\.svg$/, '');
  // `sprite.svg` is a combined sheet, not an individually named icon.
  if (name && name !== 'sprite') builtinIcons[name] = svg;
}

/** Registered names available after {@link registerBuiltinIcons} runs. */
export const BUILTIN_ICON_NAMES = Object.keys(builtinIcons).sort();

/**
 * Register every icon ranui ships (see `RAN_ICON_NAMES`) so `<r-icon name="…">`
 * renders it. Idempotent; call once, in the browser, before the first `<r-icon>`
 * connects. Import cost: the bundled SVG strings (~15 KB). To register only a
 * subset, import the specific SVGs yourself and call `registerIcons` instead.
 */
export const registerBuiltinIcons = (): void => {
  registerIcons(builtinIcons);
};
