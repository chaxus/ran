import type { DocLocaleDir } from './doc-site-locales.ts';

/**
 * One language's chrome for the generated style-token page.
 *
 * The body — the per-component token and `::part()` tables — is extracted from the
 * stylesheets and is identical in every language: the names are CSS identifiers, not prose.
 * Only the framing is translated.
 */
export interface StylePageCopy {
  title: string;
  description: string;
  heading: string;
  /** Paragraphs under the heading; `href` prefixes an internal link for this language. */
  intro: (href: (link: string) => string) => string[];
}

export const STYLE_PAGE_COPY: Record<DocLocaleDir, StylePageCopy> = {
  '': {
    title: 'ranui style tokens',
    description:
      'The CSS custom properties and ::part() names every ranui element exposes, extracted from its stylesheet.',
    heading: 'Style tokens and parts',
    intro: (href) => [
      'Every CSS custom property and `::part()` name each element exposes, extracted from its',
      'stylesheet by `pnpm -F ranui doc:style` so it cannot drift. Structural and internal tokens',
      'are filtered out: what is left is the styling API you can rely on.',
      '',
      'Set a token anywhere it inherits from — `:root`, a wrapper, or the element itself — and',
      'prefer a semantic token when one covers the change, since it reaches every component at',
      `once. The vocabulary is the [design system](${href('/src/ranui/design-system/')}); the naming rule is`,
      '`--ran-{component}-{element}[-{state}]-{property}`.',
    ],
  },
  cn: {
    title: 'ranui 样式令牌',
    description: 'ranui 每个元素暴露的 CSS 自定义属性与 ::part() 名称，均从其样式表提取。',
    heading: '样式令牌与 Part',
    intro: (href) => [
      '每个元素暴露的全部 CSS 自定义属性与 `::part()` 名称，由 `pnpm -F ranui doc:style` 从其样式表',
      '提取，因此不会与代码脱节。结构性与内部令牌已被过滤掉，剩下的就是可以放心依赖的样式接口。',
      '',
      '令牌可以设在任何能继承到的地方——`:root`、外层容器，或元素本身；如果某个语义令牌就能表达这次',
      `改动，优先用它，因为它一次影响所有组件。词汇表见[设计系统](${href('/src/ranui/design-system/')})，`,
      '命名规则是 `--ran-{component}-{element}[-{state}]-{property}`。',
    ],
  },
  ja: {
    title: 'ranui スタイルトークン',
    description: 'ranui の各要素が公開する CSS カスタムプロパティと ::part() 名。いずれもスタイルシートから抽出しています。',
    heading: 'スタイルトークンと Part',
    intro: (href) => [
      '各要素が公開する CSS カスタムプロパティと `::part()` 名の一覧です。`pnpm -F ranui doc:style` が',
      'スタイルシートから抽出するため、実装とずれません。構造用・内部用のトークンは除外してあるので、',
      '残っているものがそのまま頼ってよいスタイル API です。',
      '',
      'トークンは継承が届く場所ならどこに設定してもかまいません——`:root`、外側のコンテナ、要素そのもの。',
      'その変更をセマンティックトークン一つで表せるなら、そちらを優先してください。一度で全コンポーネントに',
      `効きます。語彙は[デザインシステム](${href('/src/ranui/design-system/')})にまとまっており、命名規則は`,
      '`--ran-{component}-{element}[-{state}]-{property}` です。',
    ],
  },
  es: {
    title: 'Tokens de estilo de ranui',
    description:
      'Las propiedades personalizadas de CSS y los nombres de ::part() que expone cada elemento de ranui, extraídos de su hoja de estilos.',
    heading: 'Tokens de estilo y partes',
    intro: (href) => [
      'Cada propiedad personalizada de CSS y cada nombre de `::part()` que expone un elemento,',
      'extraídos de su hoja de estilos por `pnpm -F ranui doc:style` para que no puedan desviarse.',
      'Los tokens estructurales e internos quedan filtrados: lo que ves es la API de estilos en la',
      'que puedes confiar.',
      '',
      'Define un token allí donde se herede — `:root`, un contenedor o el propio elemento — y',
      'prefiere un token semántico cuando cubra el cambio, porque alcanza a todos los componentes',
      `de una vez. El vocabulario es el [sistema de diseño](${href('/src/ranui/design-system/')}); la regla de`,
      'nomenclatura es `--ran-{component}-{element}[-{state}]-{property}`.',
    ],
  },
  pt: {
    title: 'Tokens de estilo do ranui',
    description:
      'As propriedades personalizadas de CSS e os nomes de ::part() que cada elemento do ranui expõe, extraídos da sua folha de estilos.',
    heading: 'Tokens de estilo e partes',
    intro: (href) => [
      'Cada propriedade personalizada de CSS e cada nome de `::part()` que um elemento expõe,',
      'extraídos da sua folha de estilos por `pnpm -F ranui doc:style` para que não possam divergir.',
      'Tokens estruturais e internos ficam de fora: o que resta é a API de estilos em que você pode',
      'confiar.',
      '',
      'Defina um token em qualquer lugar de onde ele seja herdado — `:root`, um contêiner ou o',
      'próprio elemento — e prefira um token semântico quando ele der conta da mudança, porque',
      `alcança todos os componentes de uma vez. O vocabulário é o [design system](${href('/src/ranui/design-system/')});`,
      'a regra de nomenclatura é `--ran-{component}-{element}[-{state}]-{property}`.',
    ],
  },
  ko: {
    title: 'ranui 스타일 토큰',
    description: 'ranui의 각 엘리먼트가 노출하는 CSS 커스텀 프로퍼티와 ::part() 이름. 모두 스타일시트에서 추출했습니다.',
    heading: '스타일 토큰과 Part',
    intro: (href) => [
      '각 엘리먼트가 노출하는 모든 CSS 커스텀 프로퍼티와 `::part()` 이름입니다. `pnpm -F ranui doc:style`이',
      '스타일시트에서 추출하므로 구현과 어긋나지 않습니다. 구조용·내부용 토큰은 걸러냈으니, 남은 것이',
      '그대로 믿고 쓸 수 있는 스타일 API입니다.',
      '',
      '토큰은 상속이 닿는 곳이면 어디에나 지정할 수 있습니다 — `:root`, 바깥 컨테이너, 엘리먼트 자체.',
      '의미 토큰 하나로 그 변경을 표현할 수 있다면 그쪽을 택하세요. 한 번에 모든 컴포넌트에 적용됩니다.',
      `어휘는 [디자인 시스템](${href('/src/ranui/design-system/')})에 정리돼 있고, 이름 규칙은`,
      '`--ran-{component}-{element}[-{state}]-{property}` 입니다.',
    ],
  },
  de: {
    title: 'ranui-Style-Tokens',
    description:
      'Die CSS-Custom-Properties und ::part()-Namen, die jedes ranui-Element bereitstellt — aus seinem Stylesheet extrahiert.',
    heading: 'Style-Tokens und Parts',
    intro: (href) => [
      'Jede CSS-Custom-Property und jeder `::part()`-Name, den ein Element bereitstellt, von',
      '`pnpm -F ranui doc:style` aus dessen Stylesheet extrahiert und daher nie veraltet.',
      'Strukturelle und interne Tokens sind herausgefiltert: Was bleibt, ist die Styling-API, auf',
      'die du dich verlassen kannst.',
      '',
      'Setze ein Token überall dort, wo es vererbt wird — `:root`, ein Wrapper oder das Element',
      'selbst — und bevorzuge ein semantisches Token, wenn eines die Änderung abdeckt: es erreicht',
      `alle Komponenten auf einmal. Das Vokabular ist das [Designsystem](${href('/src/ranui/design-system/')});`,
      'die Namensregel lautet `--ran-{component}-{element}[-{state}]-{property}`.',
    ],
  },
  fa: {
    title: 'توکن‌های استایل ranui',
    description: 'ویژگی‌های سفارشی CSS و نام‌های ()::part که هر عنصر ranui در اختیار می‌گذارد، استخراج‌شده از شیوه‌نامهٔ خودش.',
    heading: 'توکن‌های استایل و Part‌ها',
    intro: (href) => [
      'هر ویژگی سفارشی CSS و هر نام `()::part` که یک عنصر در اختیار می‌گذارد، به دست',
      '`pnpm -F ranui doc:style` از شیوه‌نامهٔ همان عنصر استخراج می‌شود و از این رو هرگز کهنه نمی‌شود.',
      'توکن‌های ساختاری و درونی کنار گذاشته شده‌اند؛ آنچه می‌ماند همان رابط استایلی است که می‌توانید',
      'به آن تکیه کنید.',
      '',
      'توکن را هرجا که ارث می‌رسد می‌توانید تعیین کنید — `:root`، یک نگه‌دارندهٔ بیرونی، یا خود عنصر —',
      'و اگر یک توکن معنایی همان تغییر را پوشش می‌دهد همان را ترجیح دهید، چون یک‌باره روی همهٔ',
      `کامپوننت‌ها اثر می‌گذارد. واژگان در [سیستم طراحی](${href('/src/ranui/design-system/')}) آمده و قاعدهٔ`,
      'نام‌گذاری `--ran-{component}-{element}[-{state}]-{property}` است.',
    ],
  },
};
