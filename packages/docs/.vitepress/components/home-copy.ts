/**
 * Home page copy, per language.
 *
 * It lives outside `HomeCinematic.vue` because eight languages of hero, pillars,
 * capabilities and features is more prose than component — and because the invariant half
 * (which capability sits in which column, what its API signature is, where a pillar links)
 * must not be retyped per language, where it would drift.
 *
 * `homeCopy()` reassembles the exact object shape the template already consumed, so the
 * template is unchanged: translators touch this file, nobody touches the markup.
 *
 * Site copy is written for SEO/GEO. Keep it factual — no decorative taglines (see
 * `packages/docs/CLAUDE.md`).
 */

/** The part of a capability card that never changes: its icon key and API signature. */
const CAPS_STRUCTURE = [
  {
    lib: 'ranuts',
    items: [
      { kind: 'bridge', api: 'PostMessageBridge' },
      { kind: 'gpu', api: 'Application' },
      { kind: 'vdom', api: 'h() · init()' },
      { kind: 'totp', api: 'TOTP' },
      { kind: 'mime', api: 'getMime()' },
    ],
  },
  {
    lib: 'ranui',
    items: [
      { kind: 'player', api: '<r-player>' },
      { kind: 'droplet', api: '<r-colorpicker>' },
      { kind: 'radar', api: '<r-radar>' },
      { kind: 'sigma', api: '<r-math>' },
      { kind: 'scratch', api: '<r-scratch>' },
    ],
  },
] as const;

/** Stat figures and pillar destinations — identical in every language. */
const STAT_NUMS = ['40', '90+', '8', 'MIT'] as const;
const PILLAR_STRUCTURE = [
  { kind: 'ui', link: '/src/ranui/' },
  { kind: 'utils', link: '/src/ranuts/' },
  { kind: 'article', link: '/src/article/doc_preview' },
] as const;
const FEATURE_KINDS = ['agnostic', 'typed', 'pwa', 'i18n'] as const;

interface Pair {
  name: string;
  desc: string;
}

/** One language's translatable strings. Order matches the rendered page, top to bottom. */
export interface HomeStrings {
  eyebrow: string;
  headline: string;
  /**
   * Whether the headline animates word by word. False for scripts written without spaces
   * between words, and for Persian, where splitting an RTL line into separate inline spans
   * is not worth the reordering risk — those rise as one block instead.
   */
  splitWords: boolean;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Labels under `STAT_NUMS`, in that order. */
  statLabels: [string, string, string, string];
  /** `{ title, desc, more }` for ranui, ranuts and the articles pillar, in that order. */
  pillars: [Pair3, Pair3, Pair3];
  capsKicker: string;
  capsTitle: string;
  capsSub: string;
  /** Column tags: ranuts' then ranui's. */
  capTags: [string, string];
  /** Keyed by the `kind` in `CAPS_STRUCTURE`. */
  caps: Record<string, Pair>;
  startKicker: string;
  startTitle: string;
  startDesc: string;
  startStep1: string;
  startStep2: string;
  copy: string;
  liveLabel: string;
  liveNote: string;
  /** Titles and descriptions for `FEATURE_KINDS`, in that order. */
  features: [Pair2, Pair2, Pair2, Pair2];
}

interface Pair2 {
  title: string;
  desc: string;
}
interface Pair3 extends Pair2 {
  more: string;
}

const STRINGS: Record<string, HomeStrings> = {
  '': {
    eyebrow: 'Open source · MIT Licensed',
    headline: 'A Web Components UI library and a typed utility library',
    splitWords: true,
    subtitle:
      'ranui ships 40 framework-agnostic r- elements; ranuts packs 90+ tree-shakeable TypeScript helpers. Use them in Vue, React, or plain HTML, with no build step required.',
    ctaPrimary: 'Explore Components',
    ctaSecondary: 'Star on GitHub',
    statLabels: ['Components', 'Utilities', 'Languages', 'Licensed'],
    pillars: [
      {
        title: 'ranui',
        desc: 'A framework-agnostic Web Components library. Drop 40 styled r- elements into any stack: Vue, React, or plain HTML.',
        more: 'Browse components',
      },
      {
        title: 'ranuts',
        desc: '90+ typed helpers for strings, objects, color, time, files and the DOM. Tree-shakeable, zero-dependency.',
        more: 'Read the docs',
      },
      {
        title: 'Articles',
        desc: 'Longer write-ups on rendering engines, functional programming, sorting algorithms and the web platform.',
        more: 'Start reading',
      },
    ],
    capsKicker: 'Capabilities',
    capsTitle: 'What most libraries leave out',
    capsSub: 'Five in ranuts, five in ranui.',
    capTags: ['utilities', 'components'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Promise-based RPC over postMessage across iframes, workers and tabs, with structured-clone transport and channel isolation.',
      },
      gpu: {
        name: 'Visual',
        desc: 'A PixiJS-style scene graph with a pluggable WebGPU / WebGL / Canvas renderer backend.',
      },
      vdom: {
        name: 'Virtual DOM',
        desc: 'A snabbdom-style vDOM: hyperscript, patch, pluggable modules and lifecycle hooks.',
      },
      totp: { name: 'TOTP', desc: 'RFC-6238 one-time passwords, SHA-1 through SHA3-512, with zero crypto dependencies.' },
      mime: { name: 'MIME registry', desc: 'A ~1000-entry bidirectional MIME ⇄ file-extension lookup.' },
      player: { name: 'Player', desc: 'An HLS adaptive-streaming video player with a modular controller core.' },
      droplet: {
        name: 'Color picker',
        desc: 'A full HSV picker with hue + alpha sliders and live HEX / RGBA output.',
      },
      radar: { name: 'Radar chart', desc: 'A canvas-drawn radar chart with per-axis labels and per-axis label styling.' },
      sigma: { name: 'Math', desc: 'Renders LaTeX to native MathML with lazily-loaded Temml, from a single attribute.' },
      scratch: { name: 'Scratch card', desc: 'An interactive canvas scratch-to-reveal with a completion threshold.' },
    },
    startKicker: 'Quick start',
    startTitle: 'Install and use',
    startDesc:
      'Install both packages, register the elements once, and use them anywhere. No build step or framework required.',
    startStep1: 'Install & register',
    startStep2: 'Use anywhere',
    copy: 'Copy install command',
    liveLabel: 'Live',
    liveNote: 'Real ranui components, running right on this page.',
    features: [
      { title: 'Works everywhere', desc: 'Standards-based custom elements run in any framework, or none at all.' },
      { title: 'Fully typed', desc: 'Written in TypeScript, shipped with declarations end to end.' },
      { title: 'Installable & offline', desc: 'The docs are a PWA, with their own service worker.' },
      { title: 'Eight languages', desc: 'The ranui and ranuts reference is maintained in eight languages.' },
    ],
  },
  cn: {
    eyebrow: '开源 · MIT 协议',
    headline: 'Web Components 组件库与 TypeScript 工具集',
    splitWords: false,
    subtitle:
      'ranui 提供 40 个框架无关的 r- 元素，ranuts 收录 90+ 个可 Tree-shaking 的类型化工具函数，在 Vue、React 或纯 HTML 中直接使用，无需构建步骤。',
    ctaPrimary: '浏览组件',
    ctaSecondary: '前往 GitHub',
    statLabels: ['组件', '工具函数', '语言', '协议'],
    pillars: [
      {
        title: 'ranui',
        desc: '框架无关的 Web Components 组件库。40 个开箱即用的 r- 元素，可放进 Vue、React 或纯 HTML 的任意技术栈。',
        more: '查看组件',
      },
      {
        title: 'ranuts',
        desc: '90+ 个带类型的工具函数，覆盖字符串、对象、颜色、时间、文件与 DOM。支持 Tree-shaking，零依赖。',
        more: '阅读文档',
      },
      { title: '文章', desc: '关于渲染引擎、函数式编程、排序算法与 Web 平台的长文。', more: '开始阅读' },
    ],
    capsKicker: '特色能力',
    capsTitle: '多数库没有的能力',
    capsSub: 'ranuts 五项，ranui 五项。',
    capTags: ['工具函数', '组件'],
    caps: {
      bridge: {
        name: 'Bridge 通信桥',
        desc: '基于 postMessage 的 Promise 化 RPC，跨 iframe、Worker 与标签页通信，结构化克隆传输、通道隔离。',
      },
      gpu: { name: 'Visual 渲染引擎', desc: 'PixiJS 风格的场景图，可插拔 WebGPU / WebGL / Canvas 渲染后端。' },
      vdom: { name: '虚拟 DOM', desc: 'snabbdom 风格的 vDOM：hyperscript、patch、可插拔模块与生命周期钩子。' },
      totp: { name: 'TOTP 验证码', desc: 'RFC-6238 一次性口令，支持 SHA-1 到 SHA3-512，零加密依赖。' },
      mime: { name: 'MIME 注册表', desc: '约 1000 条的 MIME ⇄ 文件扩展名双向查询。' },
      player: { name: '播放器', desc: 'HLS 自适应码率视频播放器，模块化的控制器内核。' },
      droplet: { name: '取色器', desc: '完整 HSV 取色，带色相 + 透明度滑块，实时输出 HEX / RGBA。' },
      radar: { name: '雷达图', desc: 'Canvas 绘制的雷达图，支持逐轴标签与逐轴标签样式。' },
      sigma: { name: '数学公式', desc: '通过懒加载的 Temml，用一个属性把 LaTeX 公式渲染成原生 MathML。' },
      scratch: { name: '刮刮卡', desc: '可交互的 Canvas 刮开揭晓，带完成度阈值。' },
    },
    startKicker: '快速开始',
    startTitle: '安装与使用',
    startDesc: '安装两个包，注册一次元素，即可在任意地方使用，无需构建步骤，也不依赖任何框架。',
    startStep1: '安装并注册',
    startStep2: '随处使用',
    copy: '复制安装命令',
    liveLabel: '实时',
    liveNote: '真实的 ranui 组件，就运行在这个页面上。',
    features: [
      { title: '随处可用', desc: '基于标准的自定义元素，在任意框架或无框架下都能运行。' },
      { title: '完整类型', desc: '全程 TypeScript 编写，附带类型声明。' },
      { title: '可安装 · 离线', desc: '文档本身就是一个 PWA，带自己的 Service Worker。' },
      { title: '八种语言', desc: 'ranui 与 ranuts 的文档以八种语言维护。' },
    ],
  },
  ja: {
    eyebrow: 'オープンソース · MIT ライセンス',
    headline: 'Web Components の UI ライブラリと型付きユーティリティ',
    splitWords: false,
    subtitle:
      'ranui はフレームワークに依存しない r- 要素を 40 個、ranuts は tree-shaking 可能な型付きユーティリティを 90 以上そろえています。Vue でも React でも素の HTML でも、ビルド工程なしでそのまま使えます。',
    ctaPrimary: 'コンポーネントを見る',
    ctaSecondary: 'GitHub でスターする',
    statLabels: ['コンポーネント', 'ユーティリティ', '言語', 'ライセンス'],
    pillars: [
      {
        title: 'ranui',
        desc: 'フレームワーク非依存の Web Components ライブラリ。スタイル済みの r- 要素 40 個を Vue・React・素の HTML のどこにでも置けます。',
        more: 'コンポーネント一覧',
      },
      {
        title: 'ranuts',
        desc: '文字列・オブジェクト・色・時間・ファイル・DOM を扱う型付きユーティリティが 90 以上。tree-shaking 対応、依存ゼロ。',
        more: 'ドキュメントを読む',
      },
      {
        title: '記事',
        desc: 'レンダリングエンジン、関数型プログラミング、ソートアルゴリズム、Web プラットフォームについての長文。',
        more: '読みはじめる',
      },
    ],
    capsKicker: '特色ある機能',
    capsTitle: '多くのライブラリが用意していないもの',
    capsSub: 'ranuts から 5 つ、ranui から 5 つ。',
    capTags: ['ユーティリティ', 'コンポーネント'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'postMessage 上の Promise ベース RPC。iframe・Worker・タブをまたぎ、構造化クローン転送とチャネル分離に対応します。',
      },
      gpu: {
        name: 'Visual',
        desc: 'PixiJS 風のシーングラフ。WebGPU / WebGL / Canvas のレンダラーを差し替えられます。',
      },
      vdom: {
        name: '仮想 DOM',
        desc: 'snabbdom 風の vDOM。hyperscript、patch、差し替え可能なモジュールとライフサイクルフック。',
      },
      totp: { name: 'TOTP', desc: 'RFC-6238 のワンタイムパスワード。SHA-1 から SHA3-512 まで、暗号ライブラリへの依存はゼロ。' },
      mime: { name: 'MIME レジストリ', desc: '約 1000 件の MIME ⇄ 拡張子の双方向検索。' },
      player: { name: 'プレーヤー', desc: 'モジュール化されたコントローラーを核とする HLS アダプティブ配信の動画プレーヤー。' },
      droplet: {
        name: 'カラーピッカー',
        desc: '色相とアルファのスライダーを備えた HSV ピッカー。HEX / RGBA をリアルタイムに出力します。',
      },
      radar: { name: 'レーダーチャート', desc: 'Canvas 描画のレーダーチャート。軸ごとのラベルとその個別スタイルに対応。' },
      sigma: { name: '数式', desc: '遅延読み込みの Temml で、属性ひとつから LaTeX をネイティブ MathML に描画します。' },
      scratch: { name: 'スクラッチカード', desc: '完了しきい値つきの、削って表示する Canvas インタラクション。' },
    },
    startKicker: 'クイックスタート',
    startTitle: 'インストールして使う',
    startDesc:
      '2 つのパッケージを入れ、要素を一度登録すれば、どこでも使えます。ビルド工程もフレームワークも必要ありません。',
    startStep1: 'インストールと登録',
    startStep2: 'どこでも使う',
    copy: 'インストールコマンドをコピー',
    liveLabel: 'ライブ',
    liveNote: '本物の ranui コンポーネントが、このページ上で動いています。',
    features: [
      { title: 'どこでも動く', desc: '標準準拠のカスタム要素なので、どのフレームワークでも、フレームワークなしでも動きます。' },
      { title: '完全な型定義', desc: 'TypeScript で書かれ、型宣言まで含めて配布しています。' },
      { title: 'インストール可能・オフライン対応', desc: 'ドキュメント自体が PWA で、専用の Service Worker を持ちます。' },
      { title: '8 言語', desc: 'ranui と ranuts のリファレンスは 8 言語で維持されています。' },
    ],
  },
  es: {
    eyebrow: 'Código abierto · Licencia MIT',
    headline: 'Una biblioteca de UI en Web Components y utilidades tipadas',
    splitWords: true,
    subtitle:
      'ranui trae 40 elementos r- independientes de cualquier framework; ranuts reúne más de 90 utilidades TypeScript compatibles con tree-shaking. Úsalos en Vue, en React o en HTML puro, sin ningún paso de compilación.',
    ctaPrimary: 'Ver los componentes',
    ctaSecondary: 'Dar una estrella en GitHub',
    statLabels: ['Componentes', 'Utilidades', 'Idiomas', 'Licencia'],
    pillars: [
      {
        title: 'ranui',
        desc: 'Una biblioteca de Web Components independiente de cualquier framework. Coloca 40 elementos r- ya estilizados en Vue, React o HTML puro.',
        more: 'Explorar componentes',
      },
      {
        title: 'ranuts',
        desc: 'Más de 90 utilidades tipadas para cadenas, objetos, color, tiempo, archivos y el DOM. Compatibles con tree-shaking y sin dependencias.',
        more: 'Leer la documentación',
      },
      {
        title: 'Artículos',
        desc: 'Textos largos sobre motores de renderizado, programación funcional, algoritmos de ordenación y la plataforma web.',
        more: 'Empezar a leer',
      },
    ],
    capsKicker: 'Capacidades',
    capsTitle: 'Lo que la mayoría de bibliotecas deja fuera',
    capsSub: 'Cinco en ranuts, cinco en ranui.',
    capTags: ['utilidades', 'componentes'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'RPC basado en promesas sobre postMessage entre iframes, workers y pestañas, con transporte por clonado estructurado y canales aislados.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Un grafo de escena al estilo de PixiJS, con backend de renderizado intercambiable: WebGPU, WebGL o Canvas.',
      },
      vdom: {
        name: 'DOM virtual',
        desc: 'Un DOM virtual al estilo de snabbdom: hyperscript, patch, módulos intercambiables y hooks de ciclo de vida.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Contraseñas de un solo uso según RFC-6238, de SHA-1 a SHA3-512, sin ninguna dependencia criptográfica.',
      },
      mime: { name: 'Registro MIME', desc: 'Una búsqueda bidireccional MIME ⇄ extensión con unas 1000 entradas.' },
      player: { name: 'Reproductor', desc: 'Un reproductor de vídeo HLS con tasa de bits adaptativa y un núcleo de control modular.' },
      droplet: {
        name: 'Selector de color',
        desc: 'Un selector HSV completo con deslizadores de tono y alfa, y salida HEX / RGBA en vivo.',
      },
      radar: {
        name: 'Gráfico de radar',
        desc: 'Un gráfico de radar dibujado en canvas, con etiquetas y estilos de etiqueta por eje.',
      },
      sigma: {
        name: 'Fórmulas',
        desc: 'Convierte LaTeX en MathML nativo con Temml cargado bajo demanda, desde un único atributo.',
      },
      scratch: { name: 'Tarjeta rasca y gana', desc: 'Un raspado interactivo en canvas, con umbral de finalización.' },
    },
    startKicker: 'Primeros pasos',
    startTitle: 'Instalar y usar',
    startDesc:
      'Instala ambos paquetes, registra los elementos una vez y úsalos donde quieras. Sin paso de compilación ni framework.',
    startStep1: 'Instalar y registrar',
    startStep2: 'Usar en cualquier sitio',
    copy: 'Copiar el comando de instalación',
    liveLabel: 'En vivo',
    liveNote: 'Componentes ranui reales, funcionando en esta misma página.',
    features: [
      {
        title: 'Funciona en todas partes',
        desc: 'Los custom elements estándar funcionan en cualquier framework, o sin ninguno.',
      },
      { title: 'Totalmente tipado', desc: 'Escrito en TypeScript y publicado con sus declaraciones de tipos.' },
      { title: 'Instalable y sin conexión', desc: 'La documentación es una PWA, con su propio service worker.' },
      { title: 'Ocho idiomas', desc: 'La referencia de ranui y ranuts se mantiene en ocho idiomas.' },
    ],
  },
  pt: {
    eyebrow: 'Código aberto · Licença MIT',
    headline: 'Uma biblioteca de UI em Web Components e utilitários tipados',
    splitWords: true,
    subtitle:
      'O ranui traz 40 elementos r- independentes de framework; o ranuts reúne mais de 90 utilitários TypeScript compatíveis com tree-shaking. Use-os no Vue, no React ou em HTML puro, sem nenhuma etapa de build.',
    ctaPrimary: 'Ver os componentes',
    ctaSecondary: 'Dar uma estrela no GitHub',
    statLabels: ['Componentes', 'Utilitários', 'Idiomas', 'Licença'],
    pillars: [
      {
        title: 'ranui',
        desc: 'Uma biblioteca de Web Components independente de framework. Coloque 40 elementos r- já estilizados no Vue, no React ou em HTML puro.',
        more: 'Explorar componentes',
      },
      {
        title: 'ranuts',
        desc: 'Mais de 90 utilitários tipados para strings, objetos, cor, tempo, arquivos e o DOM. Compatíveis com tree-shaking e sem dependências.',
        more: 'Ler a documentação',
      },
      {
        title: 'Artigos',
        desc: 'Textos longos sobre motores de renderização, programação funcional, algoritmos de ordenação e a plataforma web.',
        more: 'Começar a ler',
      },
    ],
    capsKicker: 'Recursos',
    capsTitle: 'O que a maioria das bibliotecas deixa de fora',
    capsSub: 'Cinco no ranuts, cinco no ranui.',
    capTags: ['utilitários', 'componentes'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'RPC baseado em promessas sobre postMessage entre iframes, workers e abas, com transporte por clonagem estruturada e canais isolados.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Um grafo de cena no estilo do PixiJS, com backend de renderização intercambiável: WebGPU, WebGL ou Canvas.',
      },
      vdom: {
        name: 'DOM virtual',
        desc: 'Um DOM virtual no estilo do snabbdom: hyperscript, patch, módulos intercambiáveis e hooks de ciclo de vida.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Senhas de uso único conforme a RFC-6238, de SHA-1 a SHA3-512, sem nenhuma dependência de criptografia.',
      },
      mime: { name: 'Registro MIME', desc: 'Uma busca bidirecional MIME ⇄ extensão com cerca de 1000 entradas.' },
      player: { name: 'Reprodutor', desc: 'Um reprodutor de vídeo HLS com taxa de bits adaptativa e núcleo de controle modular.' },
      droplet: {
        name: 'Seletor de cor',
        desc: 'Um seletor HSV completo, com controles de matiz e alfa e saída HEX / RGBA em tempo real.',
      },
      radar: {
        name: 'Gráfico de radar',
        desc: 'Um gráfico de radar desenhado em canvas, com rótulos e estilos de rótulo por eixo.',
      },
      sigma: {
        name: 'Fórmulas',
        desc: 'Converte LaTeX em MathML nativo com o Temml carregado sob demanda, a partir de um único atributo.',
      },
      scratch: { name: 'Cartão raspadinha', desc: 'Uma raspagem interativa em canvas, com limiar de conclusão.' },
    },
    startKicker: 'Primeiros passos',
    startTitle: 'Instalar e usar',
    startDesc:
      'Instale os dois pacotes, registre os elementos uma vez e use-os em qualquer lugar. Sem etapa de build nem framework.',
    startStep1: 'Instalar e registrar',
    startStep2: 'Usar em qualquer lugar',
    copy: 'Copiar o comando de instalação',
    liveLabel: 'Ao vivo',
    liveNote: 'Componentes ranui reais, rodando nesta própria página.',
    features: [
      {
        title: 'Funciona em qualquer lugar',
        desc: 'Custom elements baseados em padrões rodam em qualquer framework, ou em nenhum.',
      },
      { title: 'Totalmente tipado', desc: 'Escrito em TypeScript e publicado com as declarações de tipos.' },
      { title: 'Instalável e offline', desc: 'A documentação é um PWA, com seu próprio service worker.' },
      { title: 'Oito idiomas', desc: 'A referência do ranui e do ranuts é mantida em oito idiomas.' },
    ],
  },
  ko: {
    eyebrow: '오픈소스 · MIT 라이선스',
    headline: '웹 컴포넌트 UI 라이브러리와 타입이 붙은 유틸리티',
    splitWords: true,
    subtitle:
      'ranui는 프레임워크에 얽매이지 않는 r- 엘리먼트 40개를, ranuts는 트리 셰이킹이 되는 타입 유틸리티 90여 개를 제공합니다. Vue에서도 React에서도 순수 HTML에서도 빌드 단계 없이 그대로 씁니다.',
    ctaPrimary: '컴포넌트 둘러보기',
    ctaSecondary: 'GitHub에서 스타 주기',
    statLabels: ['컴포넌트', '유틸리티', '언어', '라이선스'],
    pillars: [
      {
        title: 'ranui',
        desc: '프레임워크 비종속 Web Components 라이브러리. 스타일이 갖춰진 r- 엘리먼트 40개를 Vue, React, 순수 HTML 어디에나 넣을 수 있습니다.',
        more: '컴포넌트 보기',
      },
      {
        title: 'ranuts',
        desc: '문자열, 객체, 색상, 시간, 파일, DOM을 다루는 타입 유틸리티 90여 개. 트리 셰이킹을 지원하고 의존성이 없습니다.',
        more: '문서 읽기',
      },
      {
        title: '아티클',
        desc: '렌더링 엔진, 함수형 프로그래밍, 정렬 알고리즘, 웹 플랫폼을 다루는 긴 글.',
        more: '읽기 시작하기',
      },
    ],
    capsKicker: '주요 기능',
    capsTitle: '대부분의 라이브러리가 빼놓는 것',
    capsSub: 'ranuts에서 다섯 가지, ranui에서 다섯 가지.',
    capTags: ['유틸리티', '컴포넌트'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'postMessage 위에서 동작하는 프로미스 기반 RPC. iframe, 워커, 탭을 넘나들며 구조화 복제 전송과 채널 격리를 지원합니다.',
      },
      gpu: {
        name: 'Visual',
        desc: 'PixiJS 스타일의 씬 그래프. WebGPU / WebGL / Canvas 렌더러를 갈아 끼울 수 있습니다.',
      },
      vdom: {
        name: '가상 DOM',
        desc: 'snabbdom 스타일의 가상 DOM: 하이퍼스크립트, patch, 교체 가능한 모듈과 생명주기 훅.',
      },
      totp: { name: 'TOTP', desc: 'RFC-6238 일회용 비밀번호. SHA-1부터 SHA3-512까지, 암호 라이브러리 의존성은 없습니다.' },
      mime: { name: 'MIME 레지스트리', desc: '약 1000개 항목의 MIME ⇄ 확장자 양방향 조회.' },
      player: { name: '플레이어', desc: '모듈화된 컨트롤러 코어를 갖춘 HLS 적응형 스트리밍 비디오 플레이어.' },
      droplet: {
        name: '컬러 피커',
        desc: '색상과 알파 슬라이더를 갖춘 완전한 HSV 피커. HEX / RGBA를 실시간으로 출력합니다.',
      },
      radar: { name: '레이더 차트', desc: 'canvas로 그리는 레이더 차트. 축별 레이블과 축별 레이블 스타일을 지원합니다.' },
      sigma: { name: '수식', desc: '지연 로딩되는 Temml로, 속성 하나만으로 LaTeX을 네이티브 MathML로 렌더링합니다.' },
      scratch: { name: '스크래치 카드', desc: '완료 임계값이 있는, 긁어서 드러내는 canvas 인터랙션.' },
    },
    startKicker: '빠른 시작',
    startTitle: '설치하고 사용하기',
    startDesc: '두 패키지를 설치하고 엘리먼트를 한 번만 등록하면 어디서든 씁니다. 빌드 단계도 프레임워크도 필요 없습니다.',
    startStep1: '설치와 등록',
    startStep2: '어디서든 사용',
    copy: '설치 명령 복사',
    liveLabel: '실시간',
    liveNote: '진짜 ranui 컴포넌트가 바로 이 페이지에서 돌아가고 있습니다.',
    features: [
      { title: '어디서나 동작', desc: '표준 기반 커스텀 엘리먼트라 어떤 프레임워크에서도, 프레임워크 없이도 동작합니다.' },
      { title: '완전한 타입', desc: 'TypeScript로 작성했고 타입 선언까지 함께 배포합니다.' },
      { title: '설치 가능 · 오프라인', desc: '문서 자체가 PWA이며 자체 서비스 워커를 갖습니다.' },
      { title: '여덟 개 언어', desc: 'ranui와 ranuts 레퍼런스는 여덟 개 언어로 관리됩니다.' },
    ],
  },
  de: {
    eyebrow: 'Open Source · MIT-Lizenz',
    headline: 'Eine Web-Components-UI-Bibliothek und typisierte Utilities',
    splitWords: true,
    subtitle:
      'ranui liefert 40 frameworkunabhängige r--Elemente, ranuts über 90 tree-shaking-fähige TypeScript-Helfer. Nutzbar in Vue, in React oder in reinem HTML — ganz ohne Build-Schritt.',
    ctaPrimary: 'Komponenten ansehen',
    ctaSecondary: 'Auf GitHub mit Stern versehen',
    statLabels: ['Komponenten', 'Utilities', 'Sprachen', 'Lizenz'],
    pillars: [
      {
        title: 'ranui',
        desc: 'Eine frameworkunabhängige Web-Components-Bibliothek. 40 fertig gestaltete r--Elemente für jeden Stack: Vue, React oder reines HTML.',
        more: 'Komponenten durchsehen',
      },
      {
        title: 'ranuts',
        desc: 'Über 90 typisierte Helfer für Zeichenketten, Objekte, Farben, Zeit, Dateien und das DOM. Tree-shaking-fähig, ohne Abhängigkeiten.',
        more: 'Dokumentation lesen',
      },
      {
        title: 'Artikel',
        desc: 'Längere Texte über Rendering-Engines, funktionale Programmierung, Sortieralgorithmen und die Web-Plattform.',
        more: 'Zu lesen beginnen',
      },
    ],
    capsKicker: 'Fähigkeiten',
    capsTitle: 'Was die meisten Bibliotheken weglassen',
    capsSub: 'Fünf in ranuts, fünf in ranui.',
    capTags: ['Utilities', 'Komponenten'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Promise-basiertes RPC über postMessage — über iframes, Worker und Tabs hinweg, mit Structured-Clone-Transport und getrennten Kanälen.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Ein Szenengraph im Stil von PixiJS, mit austauschbarem Renderer-Backend: WebGPU, WebGL oder Canvas.',
      },
      vdom: {
        name: 'Virtuelles DOM',
        desc: 'Ein vDOM im Stil von snabbdom: Hyperscript, patch, austauschbare Module und Lifecycle-Hooks.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Einmalpasswörter nach RFC-6238, von SHA-1 bis SHA3-512, ohne jede Krypto-Abhängigkeit.',
      },
      mime: { name: 'MIME-Registry', desc: 'Eine bidirektionale Zuordnung MIME ⇄ Dateiendung mit rund 1000 Einträgen.' },
      player: { name: 'Player', desc: 'Ein Videoplayer für adaptives HLS-Streaming mit modularem Controller-Kern.' },
      droplet: {
        name: 'Farbwähler',
        desc: 'Ein vollständiger HSV-Wähler mit Farbton- und Alpha-Reglern und HEX-/RGBA-Ausgabe in Echtzeit.',
      },
      radar: {
        name: 'Netzdiagramm',
        desc: 'Ein auf Canvas gezeichnetes Netzdiagramm mit Beschriftung und Beschriftungsstil je Achse.',
      },
      sigma: {
        name: 'Formeln',
        desc: 'Rendert LaTeX über ein einziges Attribut zu nativem MathML — mit nachgeladenem Temml.',
      },
      scratch: { name: 'Rubbelkarte', desc: 'Interaktives Freirubbeln auf Canvas, mit Schwelle für „fertig“.' },
    },
    startKicker: 'Schnellstart',
    startTitle: 'Installieren und verwenden',
    startDesc:
      'Beide Pakete installieren, die Elemente einmal registrieren, überall verwenden. Kein Build-Schritt, kein Framework nötig.',
    startStep1: 'Installieren & registrieren',
    startStep2: 'Überall verwenden',
    copy: 'Installationsbefehl kopieren',
    liveLabel: 'Live',
    liveNote: 'Echte ranui-Komponenten, die direkt auf dieser Seite laufen.',
    features: [
      {
        title: 'Läuft überall',
        desc: 'Standardbasierte Custom Elements laufen in jedem Framework — oder ganz ohne.',
      },
      { title: 'Vollständig typisiert', desc: 'In TypeScript geschrieben und samt Typdeklarationen ausgeliefert.' },
      { title: 'Installierbar & offline', desc: 'Die Dokumentation ist eine PWA mit eigenem Service Worker.' },
      { title: 'Acht Sprachen', desc: 'Die Referenz zu ranui und ranuts wird in acht Sprachen gepflegt.' },
    ],
  },
  fa: {
    eyebrow: 'متن‌باز · مجوز MIT',
    headline: 'کتابخانهٔ رابط کاربری وب‌کامپوننت و ابزارهای تایپ‌شده',
    splitWords: false,
    subtitle:
      'ranui چهل عنصر ‎r-‎ مستقل از فریم‌ورک دارد و ranuts بیش از ۹۰ ابزار تایپ‌شده با پشتیبانی از tree-shaking. در Vue، React یا HTML ساده و بدون هیچ مرحلهٔ ساخت به کار می‌روند.',
    ctaPrimary: 'دیدن کامپوننت‌ها',
    ctaSecondary: 'ستاره دادن در گیت‌هاب',
    statLabels: ['کامپوننت', 'ابزار', 'زبان', 'مجوز'],
    pillars: [
      {
        title: 'ranui',
        desc: 'کتابخانهٔ Web Components مستقل از فریم‌ورک. چهل عنصر ‎r-‎ آمادهٔ استفاده را در Vue، React یا HTML ساده بگذارید.',
        more: 'مرور کامپوننت‌ها',
      },
      {
        title: 'ranuts',
        desc: 'بیش از ۹۰ ابزار تایپ‌شده برای رشته، شیء، رنگ، زمان، فایل و DOM. سازگار با tree-shaking و بدون وابستگی.',
        more: 'خواندن مستندات',
      },
      {
        title: 'مقاله‌ها',
        desc: 'نوشته‌های بلند دربارهٔ موتورهای رندر، برنامه‌نویسی تابعی، الگوریتم‌های مرتب‌سازی و بستر وب.',
        more: 'شروع خواندن',
      },
    ],
    capsKicker: 'توانمندی‌ها',
    capsTitle: 'آنچه بیشتر کتابخانه‌ها کنار می‌گذارند',
    capsSub: 'پنج مورد در ranuts، پنج مورد در ranui.',
    capTags: ['ابزارها', 'کامپوننت‌ها'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'فراخوانی از راه دور مبتنی بر Promise روی postMessage، میان iframe و Worker و تب‌ها، با انتقال structured clone و کانال‌های جدا.',
      },
      gpu: {
        name: 'Visual',
        desc: 'گراف صحنه به سبک PixiJS، با موتور رندر قابل تعویض: WebGPU، WebGL یا Canvas.',
      },
      vdom: {
        name: 'DOM مجازی',
        desc: 'DOM مجازی به سبک snabbdom: هایپراسکریپت، patch، ماژول‌های قابل تعویض و قلاب‌های چرخهٔ عمر.',
      },
      totp: {
        name: 'TOTP',
        desc: 'رمزهای یک‌بارمصرف بر پایهٔ RFC-6238، از SHA-1 تا SHA3-512، بدون هیچ وابستگی رمزنگاری.',
      },
      mime: { name: 'فهرست MIME', desc: 'جست‌وجوی دوسویهٔ MIME ⇄ پسوند فایل با حدود ۱۰۰۰ مدخل.' },
      player: { name: 'پخش‌کننده', desc: 'پخش‌کنندهٔ ویدئوی HLS با نرخ بیت وفقی و هستهٔ کنترلی ماژولار.' },
      droplet: {
        name: 'انتخابگر رنگ',
        desc: 'انتخابگر کامل HSV با لغزندهٔ فام و شفافیت، و خروجی زندهٔ HEX / RGBA.',
      },
      radar: { name: 'نمودار راداری', desc: 'نمودار راداری ترسیم‌شده روی canvas، با برچسب و سبک برچسب برای هر محور.' },
      sigma: { name: 'فرمول ریاضی', desc: 'با Temml که تنبل بارگذاری می‌شود، LaTeX را تنها با یک ویژگی به MathML بومی تبدیل می‌کند.' },
      scratch: { name: 'کارت اسکراچ', desc: 'تعامل خراشیدن و آشکار شدن روی canvas، با آستانهٔ تکمیل.' },
    },
    startKicker: 'شروع سریع',
    startTitle: 'نصب و استفاده',
    startDesc: 'هر دو بسته را نصب کنید، عناصر را یک بار ثبت کنید و هرجا خواستید به کار ببرید. نه مرحلهٔ ساخت لازم است نه فریم‌ورک.',
    startStep1: 'نصب و ثبت',
    startStep2: 'استفاده در هر جا',
    copy: 'رونوشت فرمان نصب',
    liveLabel: 'زنده',
    liveNote: 'کامپوننت‌های واقعی ranui، همین‌جا روی این صفحه در حال اجرا.',
    features: [
      { title: 'همه‌جا کار می‌کند', desc: 'عناصر سفارشی استاندارد در هر فریم‌ورکی — و بدون فریم‌ورک — اجرا می‌شوند.' },
      { title: 'کاملاً تایپ‌شده', desc: 'با TypeScript نوشته شده و همراه با تعریف تایپ‌ها منتشر می‌شود.' },
      { title: 'قابل نصب و برون‌خط', desc: 'خود مستندات یک PWA است و Service Worker اختصاصی دارد.' },
      { title: 'هشت زبان', desc: 'مرجع ranui و ranuts در هشت زبان نگهداری می‌شود.' },
    ],
  },
};

/**
 * Assemble one language's home copy into the shape the template renders: the invariant
 * structure above, filled in with that language's strings.
 *
 * @param dir The locale's content directory (`''` for English). Unknown values fall back to
 *            English rather than rendering a page of blanks.
 */
export const homeCopy = (dir: string) => {
  const s = STRINGS[dir] ?? STRINGS[''];
  return {
    eyebrow: s.eyebrow,
    headline: s.headline,
    splitWords: s.splitWords,
    subtitle: s.subtitle,
    ctaPrimary: s.ctaPrimary,
    ctaSecondary: s.ctaSecondary,
    stats: STAT_NUMS.map((num, i) => ({ num, label: s.statLabels[i] })),
    pillars: PILLAR_STRUCTURE.map((p, i) => ({ ...p, ...s.pillars[i] })),
    capsKicker: s.capsKicker,
    capsTitle: s.capsTitle,
    capsSub: s.capsSub,
    caps: CAPS_STRUCTURE.map((col, i) => ({
      lib: col.lib,
      tag: s.capTags[i],
      items: col.items.map((it) => ({ kind: it.kind, api: it.api, ...s.caps[it.kind] })),
    })),
    startKicker: s.startKicker,
    startTitle: s.startTitle,
    startDesc: s.startDesc,
    startStep1: s.startStep1,
    startStep2: s.startStep2,
    copy: s.copy,
    liveLabel: s.liveLabel,
    liveNote: s.liveNote,
    features: FEATURE_KINDS.map((kind, i) => ({ kind, ...s.features[i] })),
  };
};
