import type { LocaleConfig, DefaultTheme } from 'vitepress';
import { LOCALES, ROOT_LOCALE } from './locales.ts';
import type { LocaleDef } from './locales.ts';
import { buildThemeConfig } from './build.ts';
import type { LocaleMessages } from './types.ts';
import en from './messages/en.ts';
import cn from './messages/cn.ts';
import ja from './messages/ja.ts';
import es from './messages/es.ts';
import pt from './messages/pt.ts';
import ko from './messages/ko.ts';
import de from './messages/de.ts';
import fa from './messages/fa.ts';

/** Message dictionary per locale id. Keyed by `LocaleDef.dir` — `''` is the root locale. */
const MESSAGES: Record<string, LocaleMessages> = { '': en, cn, ja, es, pt, ko, de, fa };

export const messagesFor = (locale: LocaleDef): LocaleMessages => MESSAGES[locale.dir] ?? en;

/** The root locale's theme config, used as VitePress's top-level `themeConfig`. */
export const rootThemeConfig: DefaultTheme.Config = buildThemeConfig(ROOT_LOCALE, messagesFor(ROOT_LOCALE));

/**
 * `config.locales`, assembled from the registry so adding a language is one row in
 * `locales.ts` plus one file in `messages/` — never an edit here.
 */
export const localeConfigs: LocaleConfig<DefaultTheme.Config> = Object.fromEntries(
  LOCALES.map((locale) => [
    locale.id,
    {
      label: locale.label,
      lang: locale.lang,
      // Persian is right-to-left; VitePress writes this to <html dir>.
      ...(locale.rtl ? { dir: 'rtl' as const } : {}),
      themeConfig: buildThemeConfig(locale, messagesFor(locale)),
    },
  ]),
);
