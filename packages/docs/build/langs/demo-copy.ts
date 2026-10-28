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
  /** Headings of the control groups. Control labels are attribute names and stay untranslated. */
  sections: { material: string; optics: string; light: string; backdrop: string };
  /** Accessible names of the built-in backdrop pictures. */
  scenes: { aurora: string; paper: string; grid: string };
  /** The tile that loads a picture of the reader's own. */
  upload: string;
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
      cardSub: 'drag or use arrow keys · tune the knobs',
      reset: 'Reset',
      copy: 'Copy',
      copied: 'Copied',
      sections: { material: 'Material', optics: 'Optics', light: 'Shape and light', backdrop: 'Backdrop' },
      scenes: { aurora: 'Colorful gradient', paper: 'Light page', grid: 'Colored lines' },
      upload: 'Your image',
    },
    icons: { copied: 'Copied!', copyLabel: 'Copy the markup for the {name} icon' },
  },
  cn: {
    glass: {
      cardTitle: '毛玻璃面板',
      cardSub: '拖动或用方向键移动 · 调节参数',
      reset: '重置',
      copy: '复制',
      copied: '已复制',
      sections: { material: '材质', optics: '光学', light: '形状与光', backdrop: '背景' },
      scenes: { aurora: '彩色渐变', paper: '浅色页面', grid: '彩色线条' },
      upload: '用自己的图',
    },
    icons: { copied: '已复制', copyLabel: '复制 {name} 图标的代码' },
  },
  ja: {
    glass: {
      cardTitle: 'すりガラスのパネル',
      cardSub: 'ドラッグまたは矢印キーで移動 · 値を調整',
      reset: 'リセット',
      copy: 'コピー',
      copied: 'コピーしました',
      sections: { material: '素材', optics: '光学', light: '形と光', backdrop: '背景' },
      scenes: { aurora: 'カラフルなグラデーション', paper: '明るいページ', grid: 'カラーライン' },
      upload: '自分の画像',
    },
    icons: { copied: 'コピーしました', copyLabel: '{name} アイコンのコードをコピー' },
  },
  es: {
    glass: {
      cardTitle: 'Panel esmerilado',
      cardSub: 'arrastra o usa las flechas · ajusta los controles',
      reset: 'Restablecer',
      copy: 'Copiar',
      copied: 'Copiado',
      sections: { material: 'Material', optics: 'Óptica', light: 'Forma y luz', backdrop: 'Fondo' },
      scenes: { aurora: 'Degradado de colores', paper: 'Página clara', grid: 'Líneas de colores' },
      upload: 'Tu imagen',
    },
    icons: { copied: '¡Copiado!', copyLabel: 'Copiar el marcado del icono {name}' },
  },
  pt: {
    glass: {
      cardTitle: 'Painel fosco',
      cardSub: 'arraste ou use as setas · ajuste os controles',
      reset: 'Redefinir',
      copy: 'Copiar',
      copied: 'Copiado',
      sections: { material: 'Material', optics: 'Óptica', light: 'Forma e luz', backdrop: 'Fundo' },
      scenes: { aurora: 'Gradiente colorido', paper: 'Página clara', grid: 'Linhas coloridas' },
      upload: 'Sua imagem',
    },
    icons: { copied: 'Copiado!', copyLabel: 'Copiar o markup do ícone {name}' },
  },
  ko: {
    glass: {
      cardTitle: '반투명 유리 패널',
      cardSub: '드래그하거나 방향키로 이동 · 값 조절',
      reset: '초기화',
      copy: '복사',
      copied: '복사됨',
      sections: { material: '재질', optics: '광학', light: '모양과 빛', backdrop: '배경' },
      scenes: { aurora: '컬러 그라데이션', paper: '밝은 페이지', grid: '컬러 선' },
      upload: '내 이미지',
    },
    icons: { copied: '복사됨', copyLabel: '{name} 아이콘 코드 복사' },
  },
  de: {
    glass: {
      cardTitle: 'Milchglas-Panel',
      cardSub: 'ziehen oder Pfeiltasten nutzen · Regler einstellen',
      reset: 'Zurücksetzen',
      copy: 'Kopieren',
      copied: 'Kopiert',
      sections: { material: 'Material', optics: 'Optik', light: 'Form und Licht', backdrop: 'Hintergrund' },
      scenes: { aurora: 'Farbverlauf', paper: 'Helle Seite', grid: 'Farbige Linien' },
      upload: 'Eigenes Bild',
    },
    icons: { copied: 'Kopiert!', copyLabel: 'Markup für das Symbol {name} kopieren' },
  },
  fa: {
    glass: {
      cardTitle: 'پنل شیشه‌ای مات',
      cardSub: 'بکشید یا با کلیدهای جهت حرکت دهید · تنظیم‌ها را تغییر دهید',
      reset: 'بازنشانی',
      copy: 'کپی',
      copied: 'کپی شد',
      sections: { material: 'جنس', optics: 'اپتیک', light: 'شکل و نور', backdrop: 'پس‌زمینه' },
      scenes: { aurora: 'گرادیان رنگی', paper: 'صفحهٔ روشن', grid: 'خطوط رنگی' },
      upload: 'تصویر خودتان',
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
