/**
 * The message dictionaries, keyed by locale.
 *
 * This module used to also assemble a VitePress `themeConfig` per locale. That work now
 * lives in `build/nav.ts`, which produces the shape this renderer wants instead of the
 * shape a theme plugin wanted; what is left here is the lookup itself.
 */
import { LOCALES, ROOT_LOCALE } from './locales.ts';
import type { LocaleDef } from './locales.ts';
import type { LocaleMessages } from './types.ts';
import en from './messages/en.ts';
import cn from './messages/cn.ts';
import ja from './messages/ja.ts';
import es from './messages/es.ts';
import pt from './messages/pt.ts';
import ko from './messages/ko.ts';
import de from './messages/de.ts';
import fa from './messages/fa.ts';

/** Keyed by `LocaleDef.dir` — `''` is the root locale. */
const MESSAGES: Record<string, LocaleMessages> = { '': en, cn, ja, es, pt, ko, de, fa };

export const messagesFor = (locale: LocaleDef): LocaleMessages => MESSAGES[locale.dir] ?? en;

export { LOCALES, ROOT_LOCALE };
