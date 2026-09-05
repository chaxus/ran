/**
 * Per-language SEO copy: the strings `config.ts` injects into <title>, <meta description>
 * and JSON-LD. Kept apart from `messages/` because these are page *content* for crawlers
 * and answer engines, not chrome — and because the home page's title is the single
 * highest-leverage on-page signal the site has.
 *
 * Every language needs its own: emitting an English description on a Japanese page tells a
 * search engine the page is English, which is exactly what the hreflang set is there to
 * deny.
 */
export interface SeoCopy {
  /** The home page's document <title>; `title === site title` otherwise suppresses it. */
  tagline: string;
  /** The home page's <meta description>. */
  homeDescription: string;
  /** Last-resort description for a page with no frontmatter and no extractable prose. */
  fallback: (title: string) => string;
  /** `SoftwareSourceCode` descriptions on the two library landing pages. */
  ranui: string;
  ranuts: string;
}

/** Keyed by `LocaleDef.dir`; `''` is the root (English) locale. */
export const SEO: Record<string, SeoCopy> = {
  '': {
    tagline: 'ran — Web Components UI library (ranui) & utility library (ranuts)',
    homeDescription:
      'ran is an open-source front-end ecosystem: ranui, a framework-agnostic Web Components UI library on native custom elements, and ranuts, a tree-shakeable TypeScript utility library.',
    fallback: (t) => `${t} — documentation for ran: ranui Web Components and ranuts utilities.`,
    ranui:
      'A Web Components UI library built on native custom elements, with TypeScript types, light/dark theming, SSR and PWA support.',
    ranuts:
      'A tree-shakeable JavaScript/TypeScript utility library: DOM/BOM, string/object/number helpers, a 2D rendering engine, and a virtual DOM.',
  },
  cn: {
    tagline: 'ran — Web Components 组件库（ranui）与 TypeScript 工具库（ranuts）',
    homeDescription:
      'ran 是一套开源前端生态：ranui 是基于原生 custom elements、框架无关的 Web Components 组件库；ranuts 是可 tree-shaking 的 TypeScript 工具库。',
    fallback: (t) => `${t} — ran 文档：ranui Web Components 组件库与 ranuts 工具库。`,
    ranui: '基于原生 custom elements 的 Web Components 组件库，自带 TypeScript 类型、明暗主题、SSR 与 PWA 支持。',
    ranuts: '可 tree-shaking 的 JavaScript/TypeScript 工具库：DOM/BOM、字符串/对象/数字工具、2D 渲染引擎与虚拟 DOM。',
  },
  ja: {
    tagline: 'ran — Web Components UI ライブラリ（ranui）と TypeScript ユーティリティ（ranuts）',
    homeDescription:
      'ran はオープンソースのフロントエンド・エコシステムです。ranui はネイティブ custom elements にもとづくフレームワーク非依存の Web Components UI ライブラリ、ranuts は tree-shaking 可能な TypeScript ユーティリティライブラリです。',
    fallback: (t) => `${t} — ran のドキュメント：ranui の Web Components と ranuts のユーティリティ。`,
    ranui:
      'ネイティブ custom elements で構築した Web Components UI ライブラリ。TypeScript の型定義、ライト／ダークテーマ、SSR と PWA に対応します。',
    ranuts:
      'tree-shaking 可能な JavaScript / TypeScript ユーティリティライブラリ。DOM / BOM、文字列・オブジェクト・数値のヘルパー、2D レンダリングエンジン、仮想 DOM を収録します。',
  },
  es: {
    tagline: 'ran — biblioteca de componentes web (ranui) y de utilidades (ranuts)',
    homeDescription:
      'ran es un ecosistema front-end de código abierto: ranui, una biblioteca de UI en Web Components independiente de cualquier framework y basada en custom elements nativos, y ranuts, una biblioteca de utilidades TypeScript compatible con tree-shaking.',
    fallback: (t) => `${t} — documentación de ran: los Web Components de ranui y las utilidades de ranuts.`,
    ranui:
      'Una biblioteca de UI en Web Components construida sobre custom elements nativos, con tipos TypeScript, tema claro y oscuro, SSR y soporte para PWA.',
    ranuts:
      'Una biblioteca de utilidades JavaScript/TypeScript compatible con tree-shaking: DOM/BOM, ayudantes para cadenas, objetos y números, un motor de renderizado 2D y un DOM virtual.',
  },
  pt: {
    tagline: 'ran — biblioteca de componentes web (ranui) e de utilitários (ranuts)',
    homeDescription:
      'ran é um ecossistema front-end de código aberto: ranui, uma biblioteca de UI em Web Components independente de framework e baseada em custom elements nativos, e ranuts, uma biblioteca de utilitários TypeScript compatível com tree-shaking.',
    fallback: (t) => `${t} — documentação do ran: os Web Components do ranui e os utilitários do ranuts.`,
    ranui:
      'Uma biblioteca de UI em Web Components construída sobre custom elements nativos, com tipos TypeScript, tema claro e escuro, SSR e suporte a PWA.',
    ranuts:
      'Uma biblioteca de utilitários JavaScript/TypeScript compatível com tree-shaking: DOM/BOM, auxiliares para strings, objetos e números, um motor de renderização 2D e um DOM virtual.',
  },
  ko: {
    tagline: 'ran — 웹 컴포넌트 UI 라이브러리(ranui)와 TypeScript 유틸리티 라이브러리(ranuts)',
    homeDescription:
      'ran은 오픈소스 프런트엔드 생태계입니다. ranui는 네이티브 custom elements 위에 만든 프레임워크 비종속 Web Components UI 라이브러리이고, ranuts는 트리 셰이킹이 가능한 TypeScript 유틸리티 라이브러리입니다.',
    fallback: (t) => `${t} — ran 문서: ranui의 Web Components와 ranuts의 유틸리티.`,
    ranui:
      '네이티브 custom elements로 만든 Web Components UI 라이브러리. TypeScript 타입, 라이트·다크 테마, SSR과 PWA를 지원합니다.',
    ranuts:
      '트리 셰이킹이 가능한 JavaScript/TypeScript 유틸리티 라이브러리: DOM/BOM, 문자열·객체·숫자 헬퍼, 2D 렌더링 엔진과 가상 DOM.',
  },
  de: {
    tagline: 'ran — Web-Components-UI-Bibliothek (ranui) und Utility-Bibliothek (ranuts)',
    homeDescription:
      'ran ist ein quelloffenes Frontend-Ökosystem: ranui, eine frameworkunabhängige Web-Components-UI-Bibliothek auf Basis nativer Custom Elements, und ranuts, eine tree-shaking-fähige TypeScript-Utility-Bibliothek.',
    fallback: (t) => `${t} — Dokumentation zu ran: die Web Components von ranui und die Utilities von ranuts.`,
    ranui:
      'Eine Web-Components-UI-Bibliothek auf Basis nativer Custom Elements — mit TypeScript-Typen, hellem und dunklem Theme, SSR und PWA-Unterstützung.',
    ranuts:
      'Eine tree-shaking-fähige JavaScript-/TypeScript-Utility-Bibliothek: DOM/BOM, Helfer für Zeichenketten, Objekte und Zahlen, eine 2D-Rendering-Engine und ein virtuelles DOM.',
  },
  fa: {
    tagline: 'ran — کتابخانهٔ رابط کاربری وب‌کامپوننت (ranui) و کتابخانهٔ ابزار (ranuts)',
    homeDescription:
      'ran یک زیست‌بوم متن‌باز فرانت‌اند است: ranui یک کتابخانهٔ رابط کاربری Web Components مستقل از فریم‌ورک و بر پایهٔ custom elements بومی، و ranuts یک کتابخانهٔ ابزار TypeScript با پشتیبانی از tree-shaking.',
    fallback: (t) => `${t} — مستندات ran: وب‌کامپوننت‌های ranui و ابزارهای ranuts.`,
    ranui:
      'کتابخانهٔ رابط کاربری Web Components بر پایهٔ custom elements بومی، همراه با تایپ‌های TypeScript، پوستهٔ روشن و تیره، و پشتیبانی از SSR و PWA.',
    ranuts:
      'کتابخانهٔ ابزار JavaScript/TypeScript با پشتیبانی از tree-shaking: DOM/BOM، ابزارهای رشته، شیء و عدد، موتور رندر دوبعدی و DOM مجازی.',
  },
};
