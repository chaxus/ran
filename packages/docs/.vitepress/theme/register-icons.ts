// Register ranui's bundled SVG icons on the docs site so `<r-icon name="…">` demos
// actually render. The new r-icon only shows *registered* icons (there is no built-in
// set and no iconfont fallback), and the docs — unlike the ranui demo app — never
// registered any, so every standalone icon demo came up blank.
import { registerIcons } from 'ranui';

// Every SVG shipped in ranui's asset set, keyed by file name (e.g. `lock.svg` → "lock").
const modules = import.meta.glob('../../../ranui/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const icons: Record<string, string> = {};
for (const [path, svg] of Object.entries(modules)) {
  const name = path
    .split('/')
    .pop()
    ?.replace(/\.svg$/, '');
  if (name) icons[name] = svg;
}

registerIcons(icons);
