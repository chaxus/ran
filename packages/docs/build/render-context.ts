/**
 * Per-page state the markdown renderer needs while it renders that page.
 *
 * One renderer serves the whole build — creating one per locale would load shiki's
 * grammars eight times, which is the expensive half — so anything that varies per page
 * has to be handed to it rather than constructed with it.
 *
 * It lives in its own module because the two things that need it, `content.ts` (which
 * sets it) and `components.ts` (which reads it), would otherwise import each other.
 * That cycle happened to resolve at runtime, which is the kind of thing that holds until
 * someone adds a top-level constant and it does not.
 *
 * Mutable module state is worth being uneasy about. It is safe here because rendering is
 * synchronous and single-threaded, and it is written in exactly one place.
 */
import type { LocaleDef } from './config.ts';

let locale: LocaleDef | null = null;
let linkBase = '/';

export const setRenderContext = (next: { locale: LocaleDef; url: string }): void => {
  locale = next.locale;
  linkBase = next.url;
};

export const currentLocale = (): LocaleDef => {
  if (!locale) throw new Error('setRenderContext() must be called before rendering a page');
  return locale;
};

export const currentLinkBase = (): string => linkBase;
