/** Vite resolves a bare `.css` side-effect import into the bundle; TypeScript needs telling. */
declare module '*.css';

/**
 * ranui maps `./style` to `dist/ranui.css` in its exports, so the specifier carries no
 * extension for `*.css` above to match. It is a stylesheet, not a module with a shape.
 */
declare module 'ranui/style';
