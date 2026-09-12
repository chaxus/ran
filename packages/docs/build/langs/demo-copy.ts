/**
 * Chrome copy for the interactive demo components — the glass playground and the icon
 * gallery. Same reasoning as `home-copy.ts`: eight languages of labels is prose, not
 * markup, and keeping it out of the `.vue` files means a translator never edits a template.
 *
 * Only the components' *own* chrome lives here (card caption, Reset, the copy button's two
 * states, the gallery's copy feedback). Slider labels stay untranslated on purpose: they
 * are the `r-glass` attribute names the generated snippet writes out — translating them
 * would break the mapping between the knob and the code beside it. The same rule is why
 * the `<Demo>` examples inside the component pages keep their English labels: each one
 * mirrors the code block printed underneath it.
 *
 * These strings are plain per-locale data rather than an i18n runtime's entries. vue-i18n
 * used to be installed here and reached the app only after an `await`, so it was
 * unavailable during the server pass these render in — which is why the tables exist, and
 * why adding a runtime back would reintroduce the problem.
 */

interface GlassStrings {
  /** Caption inside the draggable frosted card. */
  cardTitle: string;
  /** Second line of the card: what the reader is invited to do. */
  cardSub: string;
  reset: string;
  copy: string;
  copied: string;
}

interface IconStrings {
  /** Replaces the icon's name for a moment after its markup is copied. */
  copied: string;
  /** Accessible name of an icon cell. `{name}` is substituted with the icon's name. */
  copyLabel: string;
}

export interface DemoStrings {
  glass: GlassStrings;
  icons: IconStrings;
}

/**
 * Every language's demo-component copy, keyed by locale directory (`''` for English).
 * Exported for the same reason as `HOME_STRINGS` — see `bin/check-langs.ts`.
 */
export const DEMO_STRINGS: Record<string, DemoStrings> = {
  '': {
    glass: {
      cardTitle: 'Frosted panel',
      cardSub: 'drag me · tune the knobs',
      reset: 'Reset',
      copy: 'Copy',
      copied: 'Copied',
    },
    icons: { copied: 'Copied!', copyLabel: 'Copy the markup for the {name} icon' },
  },
  cn: {
    glass: {
      cardTitle: '毛玻璃面板',
      cardSub: '拖动它 · 调节参数',
      reset: '重置',
      copy: '复制',
      copied: '已复制',
    },
    icons: { copied: '已复制', copyLabel: '复制 {name} 图标的代码' },
  },
  ja: {
    glass: {
      cardTitle: 'すりガラスのパネル',
      cardSub: 'ドラッグして · つまみで調整',
      reset: 'リセット',
      copy: 'コピー',
      copied: 'コピーしました',
    },
    icons: { copied: 'コピーしました', copyLabel: '{name} アイコンのコードをコピー' },
  },
  es: {
    glass: {
      cardTitle: 'Panel esmerilado',
      cardSub: 'arrástralo · ajusta los controles',
      reset: 'Restablecer',
      copy: 'Copiar',
      copied: 'Copiado',
    },
    icons: { copied: '¡Copiado!', copyLabel: 'Copiar el marcado del icono {name}' },
  },
  pt: {
    glass: {
      cardTitle: 'Painel fosco',
      cardSub: 'arraste-o · ajuste os controles',
      reset: 'Redefinir',
      copy: 'Copiar',
      copied: 'Copiado',
    },
    icons: { copied: 'Copiado!', copyLabel: 'Copiar o markup do ícone {name}' },
  },
  ko: {
    glass: {
      cardTitle: '반투명 유리 패널',
      cardSub: '드래그해 보세요 · 값을 조절해 보세요',
      reset: '초기화',
      copy: '복사',
      copied: '복사됨',
    },
    icons: { copied: '복사됨', copyLabel: '{name} 아이콘 코드 복사' },
  },
  de: {
    glass: {
      cardTitle: 'Milchglas-Panel',
      cardSub: 'zieh es · dreh an den Reglern',
      reset: 'Zurücksetzen',
      copy: 'Kopieren',
      copied: 'Kopiert',
    },
    icons: { copied: 'Kopiert!', copyLabel: 'Markup für das Symbol {name} kopieren' },
  },
  fa: {
    glass: {
      cardTitle: 'پنل شیشه‌ای مات',
      cardSub: 'بکشیدش · تنظیم‌ها را تغییر دهید',
      reset: 'بازنشانی',
      copy: 'کپی',
      copied: 'کپی شد',
    },
    icons: { copied: 'کپی شد!', copyLabel: 'کپی کد آیکن {name}' },
  },
};

/**
 * One language's demo-component copy.
 *
 * @param dir The locale's content directory (`''` for English). Unknown values fall back to
 *            English rather than rendering blanks.
 */
export const demoCopy = (dir: string): DemoStrings => DEMO_STRINGS[dir] ?? DEMO_STRINGS[''];
