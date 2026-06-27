import { setSSGPath, clearSSGPath, useRouter } from './router';
import { renderToString } from './ssr';

export interface SSGPage {
  /** URL path this page was rendered for, e.g. "/about". */
  path: string;
  /** Serialized HTML string with Declarative Shadow DOM. */
  html: string;
}

/**
 * Render a single router element for the given URL path.
 *
 * Sets the SSG path context so that each `r-route` child resolves its
 * `hidden` attribute during serialization via `_preSerialize()`.
 *
 *   const html = renderStaticPage(createApp(), '/about');
 */
export function renderStaticPage(element: HTMLElement, path: string): string {
  setSSGPath(path);
  try {
    return renderToString(element);
  } finally {
    clearSSGPath();
  }
}

/**
 * Render one HTML page per route and return all results.
 *
 * `factory` is called once per route — it must return a freshly constructed
 * router element tree (r-router + r-route children) each time, because each
 * render mutates the element's `hidden` attributes.
 *
 * Paths are read from the active RouterCore's `getStaticPaths()` when omitted.
 * Pass `options.paths` to override or to provide paths when no RouterCore is set.
 *
 *   const router = createRouter({
 *     routes: [
 *       { path: '/', exact: true },
 *       { path: '/about' },
 *       { path: '/contact' },
 *     ],
 *   });
 *
 *   const pages = generateStaticPages(() => {
 *     const app = new Router();
 *     [['/', homeContent], ['/about', aboutContent], ['/contact', contactContent]]
 *       .forEach(([path, content]) => {
 *         const route = new Route();
 *         route.setAttribute('path', path);
 *         route.appendChild(content);
 *         app.appendChild(route);
 *       });
 *     return app;
 *   });
 *   // pages = [{ path: '/', html: '...' }, { path: '/about', html: '...' }, ...]
 */
export function generateStaticPages(
  factory: () => HTMLElement,
  options?: { paths?: string[] },
): SSGPage[] {
  const router = useRouter();
  const paths = options?.paths ?? router?.getStaticPaths() ?? [];

  return paths.map((path) => ({
    path,
    html: renderStaticPage(factory(), path),
  }));
}
