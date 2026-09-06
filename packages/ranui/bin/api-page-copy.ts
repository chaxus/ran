import type { DocLocaleDir } from './doc-site-locales.ts';
import { siteHref } from './doc-site-locales.ts';

/** The bullet labels around the extracted data, per output language. */
export interface Labels {
  source: string;
  attributes: string;
  properties: string;
  events: string;
  slots: string;
  parts: string;
  defaultSlot: string;
  namedSlot: (name: string) => string;
}

/**
 * One language's chrome for the generated element-API page.
 *
 * Only the chrome is translated. The tables themselves are extracted from source JSDoc and
 * stay in the English they are written in — translating them here would mean maintaining a
 * second copy of every doc comment, which is exactly the drift this generator exists to
 * prevent. Each page says so in its own language.
 */
export interface ApiPageCopy {
  labels: Labels;
  title: string;
  description: (count: number) => string;
  heading: string;
  /** Paragraphs under the heading; `href` prefixes an internal link for this language. */
  intro: (href: (link: string) => string, repoBlob: string) => string[];
  eventLegend: string;
  count: (count: number) => string;
}

const EN_LABELS: Labels = {
  source: 'Source',
  attributes: 'Attributes',
  properties: 'Properties',
  events: 'Events',
  slots: 'Slots',
  parts: 'Parts',
  defaultSlot: 'default',
  namedSlot: (name) => `${name} (named)`,
};

export const API_PAGE_COPY: Record<DocLocaleDir, ApiPageCopy> = {
  '': {
    labels: EN_LABELS,
    title: 'ranui element API',
    description: (n) =>
      `Every ranui custom element — ${n} elements with their attributes, properties, events, slots and ::part() names, extracted from source.`,
    heading: 'ranui element API (generated)',
    intro: (href, repo) => [
      'Auto-generated from the component source by `pnpm -F ranui doc:api`, so it cannot drift',
      'from what ships. Per-element reference of attributes, typed properties, events (with',
      'their `detail` shape and dispatch flags), slots, and `::part()` names.',
      '',
      'For the CSS variables each element exposes see',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md); for how to choose`,
      `between them, the [design system](${href('/src/ranui/design-system/')}) and the`,
      `[design guidelines](${href('/src/ranui/design-guides/')}). Usage guidance per element lives on its`,
      'own page in the sidebar; this is the exhaustive surface in one place.',
    ],
    eventLegend: [
      'Each event states the options it is dispatched with: `bubbles`, `composed` (crosses the',
      'shadow boundary) and `cancelable` (`preventDefault()` vetoes it). **`element-only`** means',
      'none of the three — a delegated listener on an ancestor never sees that event, so bind to',
      'the element itself.',
    ].join('\n'),
    count: (n) => `**${n} custom elements.**`,
  },
  cn: {
    labels: {
      source: '源码',
      attributes: '属性（attribute）',
      properties: '属性值（property）',
      events: '事件',
      slots: '插槽',
      parts: 'Part',
      defaultSlot: '默认插槽',
      namedSlot: (name) => `${name}（具名）`,
    },
    title: 'ranui 元素 API',
    description: (n) =>
      `ranui 的全部自定义元素 —— ${n} 个元素的属性、属性值、事件、插槽与 ::part() 名称，均从源码提取。`,
    heading: 'ranui 元素 API（自动生成）',
    intro: (href, repo) => [
      '由 `pnpm -F ranui doc:api` 从组件源码自动生成，因此不会与实际发布的代码脱节：逐个元素',
      '列出属性（attribute）、带类型的属性值（property）、事件（含 `detail` 结构与派发选项）、',
      '插槽与 `::part()` 名称。描述直接提取自源码 JSDoc，因此保持英文。',
      '',
      '每个元素暴露的 CSS 变量见',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md)；如何在其中取舍见`,
      `[设计系统](${href('/src/ranui/design-system/')})与[设计规范](${href('/src/ranui/design-guides/')})。`,
      '单个元素的用法说明在侧边栏各自的页面里，这里是一次性列全的完整接口。',
    ],
    eventLegend: [
      '每个事件都标注了它的派发选项：`bubbles`（冒泡）、`composed`（可穿过 Shadow 边界）、',
      '`cancelable`（`preventDefault()` 可否决）。**`element-only`** 表示三者皆无——在祖先节点上',
      '做事件委托永远收不到它，请把监听绑在元素本身上。',
    ].join('\n'),
    count: (n) => `**共 ${n} 个自定义元素。**`,
  },
  ja: {
    labels: {
      source: 'ソース',
      attributes: '属性（attribute）',
      properties: 'プロパティ（property）',
      events: 'イベント',
      slots: 'スロット',
      parts: 'Part',
      defaultSlot: 'デフォルトスロット',
      namedSlot: (name) => `${name}（名前つき）`,
    },
    title: 'ranui 要素 API',
    description: (n) =>
      `ranui のすべてのカスタム要素 —— ${n} 個の要素の属性、プロパティ、イベント、スロット、::part() 名。いずれもソースから抽出しています。`,
    heading: 'ranui 要素 API（自動生成）',
    intro: (href, repo) => [
      '`pnpm -F ranui doc:api` がコンポーネントのソースから自動生成するため、実際に配布される',
      'コードとずれることがありません。要素ごとに属性（attribute）、型つきプロパティ、イベント',
      '（`detail` の構造と派発オプションつき）、スロット、`::part()` 名を列挙します。説明は',
      'ソースの JSDoc をそのまま取り出したものなので英語のままです。',
      '',
      '各要素が公開する CSS 変数は',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md) を、使い分けは`,
      `[デザインシステム](${href('/src/ranui/design-system/')})と[デザインガイドライン](${href('/src/ranui/design-guides/')})を参照してください。`,
      '個々の要素の使い方はサイドバーの各ページにあります。ここは全インターフェースを一望する場所です。',
    ],
    eventLegend: [
      '各イベントには派発時のオプションを併記しています：`bubbles`（バブリング）、`composed`',
      '（Shadow 境界を越える）、`cancelable`（`preventDefault()` で取り消せる）。**`element-only`**',
      'は三つとものない状態で、祖先要素へのイベント委譲では決して受け取れません。要素自身に',
      'リスナーを登録してください。',
    ].join('\n'),
    count: (n) => `**カスタム要素 ${n} 個。**`,
  },
  es: {
    labels: {
      source: 'Código fuente',
      attributes: 'Atributos',
      properties: 'Propiedades',
      events: 'Eventos',
      slots: 'Slots',
      parts: 'Partes',
      defaultSlot: 'por defecto',
      namedSlot: (name) => `${name} (con nombre)`,
    },
    title: 'API de elementos de ranui',
    description: (n) =>
      `Todos los custom elements de ranui: ${n} elementos con sus atributos, propiedades, eventos, slots y nombres de ::part(), extraídos del código fuente.`,
    heading: 'API de elementos de ranui (generada)',
    intro: (href, repo) => [
      'Generada automáticamente desde el código de los componentes por `pnpm -F ranui doc:api`, de',
      'modo que no puede desviarse de lo que se publica. Referencia por elemento de atributos,',
      'propiedades tipadas, eventos (con la forma de su `detail` y sus opciones de despacho),',
      'slots y nombres de `::part()`. Las descripciones se extraen del JSDoc del código, así que',
      'permanecen en inglés.',
      '',
      'Para las variables CSS que expone cada elemento, consulta',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md); para elegir entre ellas, el`,
      `[sistema de diseño](${href('/src/ranui/design-system/')}) y la`,
      `[guía de diseño](${href('/src/ranui/design-guides/')}). El uso de cada elemento se explica en su`,
      'propia página de la barra lateral; esto es la superficie completa en un solo sitio.',
    ],
    eventLegend: [
      'Cada evento indica las opciones con las que se despacha: `bubbles`, `composed` (cruza el',
      'límite del shadow DOM) y `cancelable` (`preventDefault()` lo veta). **`element-only`**',
      'significa ninguna de las tres: una escucha delegada en un ancestro nunca verá ese evento,',
      'así que enlázala al elemento mismo.',
    ].join('\n'),
    count: (n) => `**${n} custom elements.**`,
  },
  pt: {
    labels: {
      source: 'Código-fonte',
      attributes: 'Atributos',
      properties: 'Propriedades',
      events: 'Eventos',
      slots: 'Slots',
      parts: 'Partes',
      defaultSlot: 'padrão',
      namedSlot: (name) => `${name} (nomeado)`,
    },
    title: 'API de elementos do ranui',
    description: (n) =>
      `Todos os custom elements do ranui: ${n} elementos com seus atributos, propriedades, eventos, slots e nomes de ::part(), extraídos do código-fonte.`,
    heading: 'API de elementos do ranui (gerada)',
    intro: (href, repo) => [
      'Gerada automaticamente a partir do código dos componentes por `pnpm -F ranui doc:api`, de',
      'modo que não pode divergir do que é publicado. Referência por elemento de atributos,',
      'propriedades tipadas, eventos (com o formato do `detail` e as opções de despacho), slots e',
      'nomes de `::part()`. As descrições são extraídas do JSDoc do código, portanto permanecem',
      'em inglês.',
      '',
      'Para as variáveis CSS que cada elemento expõe, veja',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md); para escolher entre elas, o`,
      `[design system](${href('/src/ranui/design-system/')}) e as`,
      `[diretrizes de design](${href('/src/ranui/design-guides/')}). O uso de cada elemento fica na página`,
      'dele na barra lateral; aqui está toda a superfície em um só lugar.',
    ],
    eventLegend: [
      'Cada evento informa as opções com que é despachado: `bubbles`, `composed` (cruza a',
      'fronteira do shadow DOM) e `cancelable` (`preventDefault()` o veta). **`element-only`**',
      'significa nenhuma das três — um ouvinte delegado num ancestral nunca verá esse evento,',
      'então ligue-o ao próprio elemento.',
    ].join('\n'),
    count: (n) => `**${n} custom elements.**`,
  },
  ko: {
    labels: {
      source: '소스',
      attributes: '어트리뷰트',
      properties: '프로퍼티',
      events: '이벤트',
      slots: '슬롯',
      parts: 'Part',
      defaultSlot: '기본 슬롯',
      namedSlot: (name) => `${name} (이름 있음)`,
    },
    title: 'ranui 엘리먼트 API',
    description: (n) =>
      `ranui의 모든 커스텀 엘리먼트 — ${n}개 엘리먼트의 어트리뷰트, 프로퍼티, 이벤트, 슬롯, ::part() 이름. 모두 소스에서 추출했습니다.`,
    heading: 'ranui 엘리먼트 API (자동 생성)',
    intro: (href, repo) => [
      '`pnpm -F ranui doc:api`가 컴포넌트 소스에서 자동 생성하므로 실제로 배포되는 코드와',
      '어긋날 수 없습니다. 엘리먼트별로 어트리뷰트, 타입이 붙은 프로퍼티, 이벤트(`detail` 구조와',
      '디스패치 옵션 포함), 슬롯, `::part()` 이름을 정리합니다. 설명은 소스 JSDoc에서 그대로',
      '가져오므로 영어입니다.',
      '',
      '각 엘리먼트가 노출하는 CSS 변수는',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md)를, 무엇을 고를지는`,
      `[디자인 시스템](${href('/src/ranui/design-system/')})과 [디자인 가이드](${href('/src/ranui/design-guides/')})를 보세요.`,
      '엘리먼트별 사용법은 사이드바의 각 페이지에 있고, 여기는 전체 인터페이스를 한자리에 모은 곳입니다.',
    ],
    eventLegend: [
      '각 이벤트에는 디스패치 옵션이 함께 적혀 있습니다: `bubbles`(버블링), `composed`(섀도 경계를',
      '넘음), `cancelable`(`preventDefault()`로 취소 가능). **`element-only`** 은 셋 다 아니라는',
      '뜻이며, 조상 노드에 건 위임 리스너로는 절대 받을 수 없습니다. 엘리먼트 자체에 바인딩하세요.',
    ].join('\n'),
    count: (n) => `**커스텀 엘리먼트 ${n}개.**`,
  },
  de: {
    labels: {
      source: 'Quelltext',
      attributes: 'Attribute',
      properties: 'Eigenschaften',
      events: 'Events',
      slots: 'Slots',
      parts: 'Parts',
      defaultSlot: 'Standard',
      namedSlot: (name) => `${name} (benannt)`,
    },
    title: 'ranui-Element-API',
    description: (n) =>
      `Alle Custom Elements von ranui — ${n} Elemente mit ihren Attributen, Eigenschaften, Events, Slots und ::part()-Namen, aus dem Quelltext extrahiert.`,
    heading: 'ranui-Element-API (generiert)',
    intro: (href, repo) => [
      'Von `pnpm -F ranui doc:api` aus dem Komponenten-Quelltext generiert und daher nie im',
      'Widerspruch zum ausgelieferten Code. Referenz je Element: Attribute, typisierte',
      'Eigenschaften, Events (samt `detail`-Form und Dispatch-Optionen), Slots und',
      '`::part()`-Namen. Die Beschreibungen stammen unverändert aus dem JSDoc im Quelltext und',
      'bleiben deshalb englisch.',
      '',
      'Die CSS-Variablen der einzelnen Elemente stehen in',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md); zur Auswahl zwischen ihnen`,
      `das [Designsystem](${href('/src/ranui/design-system/')}) und die`,
      `[Designrichtlinien](${href('/src/ranui/design-guides/')}). Wie ein Element zu verwenden ist, steht auf`,
      'seiner eigenen Seite in der Seitenleiste; hier ist die vollständige Oberfläche an einem Ort.',
    ],
    eventLegend: [
      'Zu jedem Event stehen die Optionen, mit denen es ausgelöst wird: `bubbles`, `composed`',
      '(überschreitet die Shadow-Grenze) und `cancelable` (`preventDefault()` legt sein Veto ein).',
      '**`element-only`** heißt: keine der drei — ein delegierter Listener an einem Vorfahren sieht',
      'dieses Event nie, binde ihn also an das Element selbst.',
    ].join('\n'),
    count: (n) => `**${n} Custom Elements.**`,
  },
  fa: {
    labels: {
      source: 'کد منبع',
      attributes: 'ویژگی‌ها (attribute)',
      properties: 'خصیصه‌ها (property)',
      events: 'رویدادها',
      slots: 'اسلات‌ها',
      parts: 'Part‌ها',
      defaultSlot: 'پیش‌فرض',
      namedSlot: (name) => `${name} (نام‌دار)`,
    },
    title: 'API عناصر ranui',
    description: (n) =>
      `همهٔ عناصر سفارشی ranui — ${n} عنصر همراه با ویژگی‌ها، خصیصه‌ها، رویدادها، اسلات‌ها و نام‌های ()::part، همگی استخراج‌شده از کد منبع.`,
    heading: 'API عناصر ranui (تولید خودکار)',
    intro: (href, repo) => [
      'این صفحه را `pnpm -F ranui doc:api` از کد منبع کامپوننت‌ها می‌سازد، بنابراین هرگز از آنچه',
      'منتشر می‌شود جدا نمی‌افتد. برای هر عنصر: ویژگی‌ها، خصیصه‌های تایپ‌شده، رویدادها (همراه با',
      'ساختار `detail` و گزینه‌های ارسال)، اسلات‌ها و نام‌های `()::part`. توضیح‌ها مستقیم از JSDoc',
      'کد برداشته می‌شوند و به همین دلیل انگلیسی می‌مانند.',
      '',
      'متغیرهای CSS هر عنصر در',
      `[style-tokens-public.md](${repo}/docs/style-tokens-public.md) آمده است؛ برای انتخاب میان آن‌ها`,
      `[سیستم طراحی](${href('/src/ranui/design-system/')}) و [راهنمای طراحی](${href('/src/ranui/design-guides/')}) را ببینید.`,
      'شیوهٔ استفاده از هر عنصر در صفحهٔ خودش در نوار کناری است؛ اینجا کل سطح رابط یک‌جا آمده.',
    ],
    eventLegend: [
      'برای هر رویداد گزینه‌های ارسال آن نوشته شده است: `bubbles` (حباب‌کردن)، `composed` (عبور از',
      'مرز Shadow) و `cancelable` (امکان وتو با `preventDefault()`). **`element-only`** یعنی هیچ‌کدام',
      'از این سه — شنوندهٔ واگذارشده روی یک گره والد هرگز آن را نمی‌بیند، پس شنونده را به خود عنصر ببندید.',
    ].join('\n'),
    count: (n) => `**${n} عنصر سفارشی.**`,
  },
};

/** Convenience: the internal-link prefixer for one language. */
export const hrefIn =
  (dir: DocLocaleDir) =>
  (link: string): string =>
    siteHref(dir, link);
