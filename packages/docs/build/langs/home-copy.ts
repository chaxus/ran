/**
 * Home page copy, per language.
 *
 * It lives outside the home renderer because eight languages of hero, pillars,
 * capabilities and component states is more prose than component — and because the invariant half
 * (which capability sits in which column, what its API signature is, where a pillar links)
 * must not be retyped per language, where it would drift.
 *
 * `homeCopy()` reassembles the exact object shape the template already consumed, so the
 * template is unchanged: translators touch this file, nobody touches the markup.
 *
 * Site copy is written for SEO/GEO. Keep it factual — no decorative taglines (see
 * `packages/docs/CLAUDE.md`).
 */

/** The part of a capability card that never changes: its icon key, API signature and docs path. */
const CAPS_STRUCTURE = [
  {
    lib: 'ranui',
    items: [
      { kind: 'player', api: '<r-player>', link: '/ranui/player/' },
      { kind: 'droplet', api: '<r-colorpicker>', link: '/ranui/colorpicker/' },
      { kind: 'radar', api: '<r-radar>', link: '/ranui/radar/' },
      { kind: 'sigma', api: '<r-math>', link: '/ranui/math/' },
      { kind: 'scratch', api: '<r-scratch>', link: '/ranui/scratch/' },
    ],
  },
  {
    lib: 'ranuts',
    items: [
      { kind: 'bridge', api: 'PostMessageBridge', link: '/ranuts/bridge/' },
      { kind: 'gpu', api: 'Application', link: '/ranuts/visual/' },
      { kind: 'vdom', api: 'h() · init()', link: '/ranuts/vnode/' },
      { kind: 'totp', api: 'TOTP', link: '/ranuts/utils/totp' },
      { kind: 'mime', api: 'getMime()', link: '/ranuts/mime_type/mime_type' },
    ],
  },
] as const;

/**
 * Stat figures and pillar destinations — identical in every language.
 *
 * Each fact has one place on the page: the licence and the language count live only in
 * this row, so the hero and the pillars must not repeat them (audit F14).
 */
const STAT_NUMS = ['42', '90+', '8', 'MIT'] as const;
const PILLAR_STRUCTURE = [
  { kind: 'article', link: '/design/' },
  { kind: 'ui', link: '/ranui/' },
  { kind: 'utils', link: '/ranuts/' },
] as const;

interface Pair {
  name: string;
  desc: string;
}

/** One language's translatable strings. Order matches the rendered page, top to bottom. */
export interface HomeStrings {
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
  proofTitle: string;
  /** The composed component states in the live-proof section. */
  proof: ProofCopy;
  chooseTitle: string;
  /** `{ title, desc, more }` for Ran Design, ranui and ranuts, in that order. */
  pillars: [Pair3, Pair3, Pair3];
  /** Short link under the pillars to the agent workflow. */
  agentsCta: string;
  capsTitle: string;
  /** Column tags: ranui's then ranuts'. */
  capTags: [string, string];
  /** Keyed by the `kind` in `CAPS_STRUCTURE`. */
  caps: Record<string, Pair>;
  startTitle: string;
  startDesc: string;
  startStep1: string;
  startStep2: string;
  copy: string;
  liveLabel: string;
  liveNote: string;
  /** The hero's working example: inviting a teammate, with its states and the guide sections it follows. */
  example: ExampleCopy;
}

export interface ProofCopy {
  /** Captions for the upload, agent-run and loading states, in that order. */
  states: [string, string, string];
  cancel: string;
  /** The agent run's three steps, finished, running and waiting. */
  steps: [string, string, string];
  /** Accessible names for those three step states. */
  stepStates: [string, string, string];
  /** What the token meter counts; its accessible name. */
  meter: string;
  /** Caption for the glass specimen, whose rim renders through WebGPU where available. */
  glass: string;
}

/** `{email}` and `{role}` are filled in by the client; keep them in every translation. */
export interface ExampleCopy {
  title: string;
  email: string;
  emailPlaceholder: string;
  role: string;
  /** Viewer, editor, admin, in that order. */
  roles: [string, string, string];
  submit: string;
  sending: string;
  invalid: string;
  sent: string;
  failed: string;
  simulate: string;
  rules: string;
}

interface Pair2 {
  title: string;
  desc: string;
}
interface Pair3 extends Pair2 {
  more: string;
}

/**
 * Every language's home copy, keyed by locale directory (`''` for English).
 *
 * Exported so `bin/check-langs.ts` can prove each locale in `langs/locales.ts` has an entry
 * with no blank strings — without that, a newly added language silently renders the whole
 * home page in English via the fallback in `homeCopy()`.
 */
export const HOME_STRINGS: Record<string, HomeStrings> = {
  '': {
    headline: 'Design methods, components and tools',
    splitWords: true,
    subtitle:
      'Build products with Ran Design, ranui components and ranuts utilities. Use each independently, with guidance for developers and agents.',
    ctaPrimary: 'Pick a pillar',
    ctaSecondary: 'Build with agents',
    statLabels: ['Components', 'Utilities', 'Languages', 'License'],
    proofTitle: 'States and materials with ranui',
    proof: {
      states: ['Uploading', 'Agent run', 'Loading'],
      cancel: 'Cancel',
      steps: ['Read 4 files', 'Run the test suite', 'Open a pull request'],
      stepStates: ['Done', 'Running', 'Waiting'],
      meter: 'Context',
      glass: 'Glass specimen',
    },
    chooseTitle: 'Choose where to start',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'Methods for layout, interaction, motion and evidence-based review, independent of any component library.',
        more: 'Explore design',
      },
      {
        title: 'ranui',
        desc: 'A framework-agnostic Web Components library. Drop styled r- elements into any stack: Vue, React, or plain HTML.',
        more: 'Browse components',
      },
      {
        title: 'ranuts',
        desc: 'Typed helpers for strings, objects, color, time, files and the DOM. Tree-shakeable, zero-dependency.',
        more: 'Read the docs',
      },
    ],
    agentsCta: 'Install the plugin',
    capsTitle: 'Capabilities beyond the usual set',
    capTags: ['components', 'utilities'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Use when iframes, workers or tabs need Promise RPC over postMessage with isolated channels.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Use when you need a Pixi-style scene graph with a swappable WebGPU, WebGL or Canvas backend.',
      },
      vdom: {
        name: 'Virtual DOM',
        desc: 'Use when you want snabbdom-style hyperscript, patch and pluggable modules without a framework.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Use when you need RFC-6238 one-time passwords without pulling in a crypto library.',
      },
      mime: { name: 'MIME registry', desc: 'Use when you need a bidirectional MIME ⇄ extension lookup from a large built-in table.' },
      player: { name: 'Player', desc: 'Use when you need HLS adaptive video with a modular controller, not a full app shell.' },
      droplet: {
        name: 'Color picker',
        desc: 'Use when a form needs HSV picking with live HEX / RGBA, not a native color input alone.',
      },
      radar: {
        name: 'Radar chart',
        desc: 'Use when you need a canvas radar chart with per-axis labels and label styles.',
      },
      sigma: {
        name: 'Math',
        desc: 'Use when a single attribute should render LaTeX as native MathML.',
      },
      scratch: { name: 'Scratch card', desc: 'Use when a reveal interaction needs a scratch threshold on canvas.' },
    },
    startTitle: 'Install and use',
    startDesc:
      'Install ranui and ranuts for the libraries. Ran Design and the agent plugin are separate entry points in the pillars above.',
    startStep1: 'Install & register',
    startStep2: 'Use anywhere',
    copy: 'Copy install command',
    liveLabel: 'Example',
    liveNote: 'Real ranui components. Leave the email empty, or simulate a failure, to see each state.',
    example: {
      title: 'Invite a teammate',
      email: 'Work email',
      emailPlaceholder: 'ada@company.com',
      role: 'Role',
      roles: ['Viewer', 'Editor', 'Admin'],
      submit: 'Send invite',
      sending: 'Sending…',
      invalid: 'Enter an email address, like ada@company.com.',
      sent: 'Invitation sent to {email} as {role}.',
      failed: "The invitation wasn't sent. Your entries are still here; try again.",
      simulate: 'Simulate a failed request',
      rules: 'Follows',
    },
  },
  cn: {
    headline: '设计方法、组件与工具',
    splitWords: false,
    subtitle: '使用 Ran Design、ranui 组件和 ranuts 工具构建产品。三者可独立使用，为开发者和 agent 提供指引。',
    ctaPrimary: '选择一个方向',
    ctaSecondary: '使用 agent 构建',
    statLabels: ['组件', '工具函数', '语言', '许可'],
    proofTitle: '用 ranui 呈现的状态与材质',
    proof: {
      states: ['上传中', 'Agent 运行', '加载中'],
      cancel: '取消',
      steps: ['读取 4 个文件', '运行测试', '创建 Pull Request'],
      stepStates: ['已完成', '运行中', '等待中'],
      meter: '上下文',
      glass: '玻璃标本',
    },
    chooseTitle: '选择从哪里开始',
    pillars: [
      {
        title: 'Ran Design',
        desc: '涵盖布局、交互、动效和实际验收的方法，不依赖特定组件库。',
        more: '探索设计方法',
      },
      {
        title: 'ranui',
        desc: '框架无关的 Web Components 组件库。开箱即用的 r- 元素，可放进 Vue、React 或纯 HTML 的任意技术栈。',
        more: '查看组件',
      },
      {
        title: 'ranuts',
        desc: '提供字符串、对象、颜色、时间、文件与 DOM 等 TypeScript 工具，支持按需引入。',
        more: '查看工具',
      },
    ],
    agentsCta: '安装插件',
    capsTitle: '超出常规的能力',
    capTags: ['组件', '工具函数'],
    caps: {
      bridge: {
        name: 'Bridge 通信桥',
        desc: '跨 iframe、Worker 或标签页、需要带通道隔离的 Promise 化 postMessage RPC 时用。',
      },
      gpu: { name: 'Visual 渲染引擎', desc: '需要可切换 WebGPU / WebGL / Canvas 后端的 Pixi 风格场景图时用。' },
      vdom: { name: '虚拟 DOM', desc: '想在无框架的情况下用 snabbdom 风格的 hyperscript、patch 与可插拔模块时用。' },
      totp: { name: 'TOTP 验证码', desc: '需要 RFC-6238 一次性口令、又不想引入加密库时用。' },
      mime: { name: 'MIME 注册表', desc: '需要从内置大表做 MIME ⇄ 扩展名双向查询时用。' },
      player: { name: '播放器', desc: '需要带模块化控制器的 HLS 自适应视频、而不是整套应用壳时用。' },
      droplet: { name: '取色器', desc: '表单需要带实时 HEX / RGBA 的 HSV 取色、而不是仅靠原生 color 输入时用。' },
      radar: { name: '雷达图', desc: '需要带逐轴标签与标签样式的 canvas 雷达图时用。' },
      sigma: { name: '数学公式', desc: '希望用一个属性把 LaTeX 渲成原生 MathML 时用。' },
      scratch: { name: '刮刮卡', desc: '揭示交互需要 canvas 刮开阈值时用。' },
    },
    startTitle: '安装与使用',
    startDesc: '需要组件与工具库时安装 ranui 和 ranuts。Ran Design 与 agent 插件是上方支柱里的独立入口，不是 npm 安装。',
    startStep1: '安装并注册',
    startStep2: '随处使用',
    copy: '复制安装命令',
    liveLabel: '示例',
    liveNote: '真实的 ranui 组件。不填邮箱或模拟失败，就能看到每种状态。',
    example: {
      title: '邀请成员',
      email: '工作邮箱',
      emailPlaceholder: 'ada@company.com',
      role: '角色',
      roles: ['只读', '编辑', '管理员'],
      submit: '发送邀请',
      sending: '发送中…',
      invalid: '请输入邮箱地址，例如 ada@company.com。',
      sent: '已向 {email} 发送邀请，角色为{role}。',
      failed: '邀请没有发出去。填写的内容都还在，请重试。',
      simulate: '模拟请求失败',
      rules: '对应指南',
    },
  },
  ja: {
    headline: '設計方法、コンポーネント、ツール',
    splitWords: false,
    subtitle: 'Ran Design、ranui、ranuts で製品を構築。各機能を独立して使い、開発者とエージェントを支援します。',
    ctaPrimary: '柱を選ぶ',
    ctaSecondary: 'エージェントで構築',
    statLabels: ['コンポーネント', 'ユーティリティ', '言語', 'ライセンス'],
    proofTitle: 'ranui で組んだ状態と素材',
    proof: {
      states: ['アップロード中', 'エージェント実行', '読み込み中'],
      cancel: 'キャンセル',
      steps: ['4 ファイルを読み込む', 'テストを実行', 'プルリクエストを作成'],
      stepStates: ['完了', '実行中', '待機中'],
      meter: 'コンテキスト',
      glass: 'ガラスの見本',
    },
    chooseTitle: 'どこから始めるか選ぶ',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'レイアウト、操作、モーション、実際の検証を扱う、ライブラリに依存しない設計方法。',
        more: '設計方法を見る',
      },
      {
        title: 'ranui',
        desc: 'フレームワーク非依存の Web Components ライブラリ。スタイル済みの r- 要素を Vue・React・素の HTML のどこにでも置けます。',
        more: 'コンポーネント一覧',
      },
      {
        title: 'ranuts',
        desc: '文字列・オブジェクト・色・時間・ファイル・DOM を扱う型付きユーティリティ。tree-shaking 対応、依存ゼロ。',
        more: 'ドキュメントを読む',
      },
    ],
    agentsCta: 'プラグインをインストール',
    capsTitle: '定番を超える能力',
    capTags: ['コンポーネント', 'ユーティリティ'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'iframe・Worker・タブ間で、チャネル分離のある Promise ベースの postMessage RPC が必要なときに使う。',
      },
      gpu: {
        name: 'Visual',
        desc: 'WebGPU / WebGL / Canvas を差し替えられる Pixi 風シーングラフが必要なときに使う。',
      },
      vdom: {
        name: '仮想 DOM',
        desc: 'フレームワークなしで snabbdom 風の hyperscript、patch、差し替え可能モジュールが欲しいときに使う。',
      },
      totp: {
        name: 'TOTP',
        desc: '暗号ライブラリを足さずに RFC-6238 ワンタイムパスワードが必要なときに使う。',
      },
      mime: { name: 'MIME レジストリ', desc: '組み込みの大きな表で MIME ⇄ 拡張子の双方向検索が必要なときに使う。' },
      player: {
        name: 'プレーヤー',
        desc: 'アプリ殻全体ではなく、モジュール化されたコントローラー付き HLS 適応動画が必要なときに使う。',
      },
      droplet: {
        name: 'カラーピッカー',
        desc: 'ネイティブの color 入力だけでは足りず、HEX / RGBA をライブ出力する HSV ピッカーがフォームに必要なときに使う。',
      },
      radar: {
        name: 'レーダーチャート',
        desc: '軸ごとのラベルとスタイルを持つ canvas レーダーチャートが必要なときに使う。',
      },
      sigma: { name: '数式', desc: '属性ひとつで LaTeX をネイティブ MathML に描きたいときに使う。' },
      scratch: { name: 'スクラッチカード', desc: 'キャンバス上のスクラッチ閾値付きの「削って表示」が必要なときに使う。' },
    },
    startTitle: 'インストールして使う',
    startDesc:
      'ライブラリが必要なら ranui と ranuts を入れます。Ran Design とエージェントプラグインは上の柱にある別の入り口です。',
    startStep1: 'インストールと登録',
    startStep2: 'どこでも使う',
    copy: 'インストールコマンドをコピー',
    liveLabel: 'サンプル',
    liveNote: '本物の ranui コンポーネントです。メールを空のままにするか、失敗を再現すると各状態を確認できます。',
    example: {
      title: 'メンバーを招待',
      email: '仕事用メール',
      emailPlaceholder: 'ada@company.com',
      role: '権限',
      roles: ['閲覧者', '編集者', '管理者'],
      submit: '招待を送信',
      sending: '送信中…',
      invalid: 'ada@company.com のようなメールアドレスを入力してください。',
      sent: '{email} に{role}として招待を送信しました。',
      failed: '招待は送信されませんでした。入力内容はそのまま残っています。もう一度お試しください。',
      simulate: 'リクエストの失敗を再現',
      rules: '準拠するガイド',
    },
  },
  es: {
    headline: 'Métodos de diseño, componentes y herramientas',
    splitWords: true,
    subtitle:
      'Crea productos con Ran Design, ranui y ranuts. Úsalos por separado, con orientación para desarrolladores y agentes.',
    ctaPrimary: 'Elige un pilar',
    ctaSecondary: 'Crear con agentes',
    statLabels: ['Componentes', 'Utilidades', 'Idiomas', 'Licencia'],
    proofTitle: 'Estados y materiales con ranui',
    proof: {
      states: ['Subiendo', 'Ejecución del agente', 'Cargando'],
      cancel: 'Cancelar',
      steps: ['Leer 4 archivos', 'Ejecutar las pruebas', 'Abrir un pull request'],
      stepStates: ['Hecho', 'En curso', 'En espera'],
      meter: 'Contexto',
      glass: 'Muestra de vidrio',
    },
    chooseTitle: 'Elige por dónde empezar',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'Métodos de composición, interacción, movimiento y revisión con evidencia, independientes de una biblioteca.',
        more: 'Explorar diseño',
      },
      {
        title: 'ranui',
        desc: 'Una biblioteca de Web Components independiente de cualquier framework. Coloca elementos r- ya estilizados en Vue, React o HTML puro.',
        more: 'Explorar componentes',
      },
      {
        title: 'ranuts',
        desc: 'Utilidades tipadas para cadenas, objetos, color, tiempo, archivos y el DOM. Compatibles con tree-shaking y sin dependencias.',
        more: 'Leer la documentación',
      },
    ],
    agentsCta: 'Instala el plugin',
    capsTitle: 'Capacidades más allá del conjunto habitual',
    capTags: ['componentes', 'utilidades'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Úsalo cuando iframes, workers o pestañas necesiten RPC con promesas sobre postMessage y canales aislados.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Úsalo cuando necesites un grafo de escena al estilo Pixi con backend WebGPU, WebGL o Canvas intercambiable.',
      },
      vdom: {
        name: 'DOM virtual',
        desc: 'Úsalo cuando quieras hyperscript, patch y módulos intercambiables al estilo snabbdom sin un framework.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Úsalo cuando necesites contraseñas de un solo uso RFC-6238 sin añadir una biblioteca criptográfica.',
      },
      mime: { name: 'Registro MIME', desc: 'Úsalo cuando necesites una búsqueda bidireccional MIME ⇄ extensión desde una tabla grande incluida.' },
      player: {
        name: 'Reproductor',
        desc: 'Úsalo cuando necesites vídeo HLS adaptativo con controlador modular, no un shell de aplicación completo.',
      },
      droplet: {
        name: 'Selector de color',
        desc: 'Úsalo cuando un formulario necesite HSV con HEX / RGBA en vivo, no solo un input color nativo.',
      },
      radar: {
        name: 'Gráfico de radar',
        desc: 'Úsalo cuando necesites un gráfico de radar en canvas con etiquetas y estilos por eje.',
      },
      sigma: {
        name: 'Fórmulas',
        desc: 'Úsalo cuando un solo atributo deba renderizar LaTeX como MathML nativo.',
      },
      scratch: { name: 'Tarjeta rasca y gana', desc: 'Úsalo cuando una revelación necesite un umbral de raspado en canvas.' },
    },
    startTitle: 'Instalar y usar',
    startDesc:
      'Instala ranui y ranuts para las bibliotecas. Ran Design y el plugin de agentes son entradas aparte en los pilares de arriba.',
    startStep1: 'Instalar y registrar',
    startStep2: 'Usar en cualquier sitio',
    copy: 'Copiar el comando de instalación',
    liveLabel: 'Ejemplo',
    liveNote: 'Componentes ranui reales. Deja el correo vacío o simula un fallo para ver cada estado.',
    example: {
      title: 'Invitar a un compañero',
      email: 'Correo de trabajo',
      emailPlaceholder: 'ada@company.com',
      role: 'Rol',
      roles: ['Lector', 'Editor', 'Administrador'],
      submit: 'Enviar invitación',
      sending: 'Enviando…',
      invalid: 'Escribe un correo, por ejemplo ada@company.com.',
      sent: 'Invitación enviada a {email} como {role}.',
      failed: 'La invitación no se envió. Tus datos siguen aquí; inténtalo de nuevo.',
      simulate: 'Simular un fallo de la petición',
      rules: 'Sigue',
    },
  },
  pt: {
    headline: 'Métodos de design, componentes e ferramentas',
    splitWords: true,
    subtitle:
      'Crie produtos com Ran Design, ranui e ranuts. Use cada um de forma independente, com orientação para desenvolvedores e agentes.',
    ctaPrimary: 'Escolha um pilar',
    ctaSecondary: 'Criar com agentes',
    statLabels: ['Componentes', 'Utilitários', 'Idiomas', 'Licença'],
    proofTitle: 'Estados e materiais com ranui',
    proof: {
      states: ['Enviando', 'Execução do agente', 'Carregando'],
      cancel: 'Cancelar',
      steps: ['Ler 4 arquivos', 'Executar os testes', 'Abrir um pull request'],
      stepStates: ['Concluído', 'Em execução', 'Aguardando'],
      meter: 'Contexto',
      glass: 'Amostra de vidro',
    },
    chooseTitle: 'Escolha por onde começar',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'Métodos de composição, interação, movimento e revisão com evidências, independentes de bibliotecas.',
        more: 'Explorar design',
      },
      {
        title: 'ranui',
        desc: 'Uma biblioteca de Web Components independente de framework. Coloque elementos r- já estilizados no Vue, no React ou em HTML puro.',
        more: 'Explorar componentes',
      },
      {
        title: 'ranuts',
        desc: 'Utilitários tipados para strings, objetos, cor, tempo, arquivos e o DOM. Compatíveis com tree-shaking e sem dependências.',
        more: 'Ler a documentação',
      },
    ],
    agentsCta: 'Instale o plugin',
    capsTitle: 'Capacidades além do conjunto usual',
    capTags: ['componentes', 'utilitários'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Use quando iframes, workers ou abas precisarem de RPC com promises sobre postMessage e canais isolados.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Use quando precisar de um grafo de cena no estilo Pixi com backend WebGPU, WebGL ou Canvas trocável.',
      },
      vdom: {
        name: 'DOM virtual',
        desc: 'Use quando quiser hyperscript, patch e módulos plugáveis no estilo snabbdom sem um framework.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Use quando precisar de senhas de uso único RFC-6238 sem puxar uma biblioteca de criptografia.',
      },
      mime: { name: 'Registro MIME', desc: 'Use quando precisar de busca bidirecional MIME ⇄ extensão a partir de uma tabela grande embutida.' },
      player: {
        name: 'Reprodutor',
        desc: 'Use quando precisar de vídeo HLS adaptativo com controlador modular, não um shell de aplicativo inteiro.',
      },
      droplet: {
        name: 'Seletor de cor',
        desc: 'Use quando um formulário precisar de HSV com HEX / RGBA ao vivo, não só um input color nativo.',
      },
      radar: {
        name: 'Gráfico de radar',
        desc: 'Use quando precisar de um gráfico de radar em canvas com rótulos e estilos por eixo.',
      },
      sigma: {
        name: 'Fórmulas',
        desc: 'Use quando um único atributo deve renderizar LaTeX como MathML nativo.',
      },
      scratch: { name: 'Cartão raspadinha', desc: 'Use quando uma revelação precisar de um limiar de raspagem no canvas.' },
    },
    startTitle: 'Instalar e usar',
    startDesc:
      'Instale ranui e ranuts para as bibliotecas. Ran Design e o plugin de agentes são entradas separadas nos pilares acima.',
    startStep1: 'Instalar e registrar',
    startStep2: 'Usar em qualquer lugar',
    copy: 'Copiar o comando de instalação',
    liveLabel: 'Exemplo',
    liveNote: 'Componentes ranui reais. Deixe o e-mail vazio ou simule uma falha para ver cada estado.',
    example: {
      title: 'Convidar alguém para a equipe',
      email: 'E-mail de trabalho',
      emailPlaceholder: 'ada@company.com',
      role: 'Função',
      roles: ['Leitor', 'Editor', 'Administrador'],
      submit: 'Enviar convite',
      sending: 'Enviando…',
      invalid: 'Digite um e-mail, como ada@company.com.',
      sent: 'Convite enviado para {email} como {role}.',
      failed: 'O convite não foi enviado. Seus dados continuam aqui; tente de novo.',
      simulate: 'Simular uma falha na requisição',
      rules: 'Segue',
    },
  },
  ko: {
    headline: '디자인 방법, 컴포넌트와 도구',
    splitWords: true,
    subtitle:
      'Ran Design, ranui, ranuts로 제품을 만드세요. 개발자와 에이전트를 위한 지침과 함께 각각 독립적으로 사용할 수 있습니다.',
    ctaPrimary: '기둥 고르기',
    ctaSecondary: '에이전트로 만들기',
    statLabels: ['컴포넌트', '유틸리티', '언어', '라이선스'],
    proofTitle: 'ranui로 만든 상태와 재질',
    proof: {
      states: ['업로드 중', '에이전트 실행', '불러오는 중'],
      cancel: '취소',
      steps: ['파일 4개 읽기', '테스트 실행', '풀 리퀘스트 열기'],
      stepStates: ['완료', '실행 중', '대기 중'],
      meter: '컨텍스트',
      glass: '유리 표본',
    },
    chooseTitle: '시작할 곳 고르기',
    pillars: [
      {
        title: 'Ran Design',
        desc: '특정 라이브러리에 종속되지 않는 레이아웃, 상호작용, 모션 및 실제 검증 방법입니다.',
        more: '디자인 살펴보기',
      },
      {
        title: 'ranui',
        desc: '프레임워크 비종속 Web Components 라이브러리. 스타일이 갖춰진 r- 엘리먼트를 Vue, React, 순수 HTML 어디에나 넣을 수 있습니다.',
        more: '컴포넌트 보기',
      },
      {
        title: 'ranuts',
        desc: '문자열, 객체, 색상, 시간, 파일, DOM을 다루는 타입 유틸리티. 트리 셰이킹을 지원하고 의존성이 없습니다.',
        more: '문서 읽기',
      },
    ],
    agentsCta: '플러그인 설치',
    capsTitle: '일반적인 범위를 넘는 기능',
    capTags: ['컴포넌트', '유틸리티'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'iframe·워커·탭 사이에서 채널이 분리된 Promise 기반 postMessage RPC가 필요할 때 쓰세요.',
      },
      gpu: {
        name: 'Visual',
        desc: 'WebGPU / WebGL / Canvas 백엔드를 갈아 끼울 수 있는 Pixi 스타일 씬 그래프가 필요할 때 쓰세요.',
      },
      vdom: {
        name: '가상 DOM',
        desc: '프레임워크 없이 snabbdom 스타일 hyperscript·patch·교체 가능 모듈이 필요할 때 쓰세요.',
      },
      totp: {
        name: 'TOTP',
        desc: '암호 라이브러리 없이 RFC-6238 일회용 비밀번호가 필요할 때 쓰세요.',
      },
      mime: { name: 'MIME 레지스트리', desc: '내장 대량 테이블로 MIME ⇄ 확장자 양방향 조회가 필요할 때 쓰세요.' },
      player: { name: '플레이어', desc: '앱 셸 전체가 아니라 모듈형 컨트롤러를 갖춘 HLS 적응형 비디오가 필요할 때 쓰세요.' },
      droplet: {
        name: '컬러 피커',
        desc: '네이티브 color 입력만으로는 부족하고, HEX / RGBA를 실시간으로 내는 HSV 피커가 폼에 필요할 때 쓰세요.',
      },
      radar: {
        name: '레이더 차트',
        desc: '축별 레이블과 스타일을 갖춘 canvas 레이더 차트가 필요할 때 쓰세요.',
      },
      sigma: { name: '수식', desc: '속성 하나로 LaTeX를 네이티브 MathML로 그려야 할 때 쓰세요.' },
      scratch: { name: '스크래치 카드', desc: '캔버스 스크래치 임계값이 있는 드러내기 상호작용이 필요할 때 쓰세요.' },
    },
    startTitle: '설치하고 사용하기',
    startDesc:
      '라이브러리가 필요하면 ranui와 ranuts를 설치하세요. Ran Design과 에이전트 플러그인은 위 기둥의 별도 진입점입니다.',
    startStep1: '설치와 등록',
    startStep2: '어디서든 사용',
    copy: '설치 명령 복사',
    liveLabel: '예제',
    liveNote: '실제 ranui 컴포넌트입니다. 이메일을 비워 두거나 실패를 재현하면 각 상태를 볼 수 있습니다.',
    example: {
      title: '팀원 초대',
      email: '업무용 이메일',
      emailPlaceholder: 'ada@company.com',
      role: '권한',
      roles: ['뷰어', '편집자', '관리자'],
      submit: '초대 보내기',
      sending: '보내는 중…',
      invalid: 'ada@company.com 같은 이메일 주소를 입력하세요.',
      sent: '{email}에게 {role} 권한으로 초대를 보냈습니다.',
      failed: '초대를 보내지 못했습니다. 입력한 내용은 그대로 있으니 다시 시도하세요.',
      simulate: '요청 실패 재현',
      rules: '따름',
    },
  },
  de: {
    headline: 'Designmethoden, Komponenten und Werkzeuge',
    splitWords: true,
    subtitle:
      'Produkte mit Ran Design, ranui und ranuts entwickeln. Unabhängig nutzbar, mit Anleitungen für Entwickler und Agenten.',
    ctaPrimary: 'Wähle eine Säule',
    ctaSecondary: 'Mit Agenten entwickeln',
    statLabels: ['Komponenten', 'Utilities', 'Sprachen', 'Lizenz'],
    proofTitle: 'Zustände und Materialien mit ranui',
    proof: {
      states: ['Hochladen', 'Agent-Lauf', 'Laden'],
      cancel: 'Abbrechen',
      steps: ['4 Dateien lesen', 'Tests ausführen', 'Pull-Request öffnen'],
      stepStates: ['Erledigt', 'Läuft', 'Wartet'],
      meter: 'Kontext',
      glass: 'Glas-Probe',
    },
    chooseTitle: 'Wähle deinen Einstieg',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'Bibliotheksunabhängige Methoden für Layout, Interaktion, Bewegung und Prüfung anhand konkreter Ergebnisse.',
        more: 'Design erkunden',
      },
      {
        title: 'ranui',
        desc: 'Eine frameworkunabhängige Web-Components-Bibliothek. Fertig gestaltete r-Elemente für jeden Stack: Vue, React oder reines HTML.',
        more: 'Komponenten durchsehen',
      },
      {
        title: 'ranuts',
        desc: 'Typisierte Helfer für Zeichenketten, Objekte, Farben, Zeit, Dateien und das DOM. Tree-shaking-fähig, ohne Abhängigkeiten.',
        more: 'Dokumentation lesen',
      },
    ],
    agentsCta: 'Plugin installieren',
    capsTitle: 'Fähigkeiten über den üblichen Satz hinaus',
    capTags: ['Komponenten', 'Utilities'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'Nutzen, wenn iframes, Worker oder Tabs Promise-RPC über postMessage mit getrennten Kanälen brauchen.',
      },
      gpu: {
        name: 'Visual',
        desc: 'Nutzen, wenn du einen Pixi-ähnlichen Szenengraphen mit austauschbarem WebGPU-, WebGL- oder Canvas-Backend brauchst.',
      },
      vdom: {
        name: 'Virtuelles DOM',
        desc: 'Nutzen, wenn du snabbdom-artiges Hyperscript, patch und austauschbare Module ohne Framework willst.',
      },
      totp: {
        name: 'TOTP',
        desc: 'Nutzen, wenn du Einmalpasswörter nach RFC-6238 brauchst, ohne eine Krypto-Bibliothek einzuziehen.',
      },
      mime: {
        name: 'MIME-Registry',
        desc: 'Nutzen, wenn du eine bidirektionale MIME-⇄-Endungs-Suche aus einer großen eingebauten Tabelle brauchst.',
      },
      player: { name: 'Player', desc: 'Nutzen, wenn du adaptives HLS-Video mit modularem Controller brauchst, nicht eine ganze App-Hülle.' },
      droplet: {
        name: 'Farbwähler',
        desc: 'Nutzen, wenn ein Formular HSV mit live HEX / RGBA braucht, nicht nur ein natives color-Input.',
      },
      radar: {
        name: 'Netzdiagramm',
        desc: 'Nutzen, wenn du ein Canvas-Netzdiagramm mit Beschriftung und Stil je Achse brauchst.',
      },
      sigma: {
        name: 'Formeln',
        desc: 'Nutzen, wenn ein einziges Attribut LaTeX als natives MathML rendern soll.',
      },
      scratch: { name: 'Rubbelkarte', desc: 'Nutzen, wenn eine Enthüllung eine Rubbelschwelle auf Canvas braucht.' },
    },
    startTitle: 'Installieren und verwenden',
    startDesc:
      'ranui und ranuts installieren, wenn du die Bibliotheken brauchst. Ran Design und das Agenten-Plugin sind eigene Einstiege in den Säulen oben.',
    startStep1: 'Installieren & registrieren',
    startStep2: 'Überall verwenden',
    copy: 'Installationsbefehl kopieren',
    liveLabel: 'Beispiel',
    liveNote: 'Echte ranui-Komponenten. Lass die E-Mail leer oder simuliere einen Fehler, um jeden Zustand zu sehen.',
    example: {
      title: 'Teammitglied einladen',
      email: 'Geschäftliche E-Mail',
      emailPlaceholder: 'ada@company.com',
      role: 'Rolle',
      roles: ['Leser', 'Bearbeiter', 'Admin'],
      submit: 'Einladung senden',
      sending: 'Wird gesendet…',
      invalid: 'Gib eine E-Mail-Adresse ein, etwa ada@company.com.',
      sent: 'Einladung an {email} als {role} gesendet.',
      failed: 'Die Einladung wurde nicht gesendet. Deine Eingaben sind noch da; versuch es erneut.',
      simulate: 'Fehlgeschlagene Anfrage simulieren',
      rules: 'Folgt',
    },
  },
  fa: {
    headline: 'روش\u200cهای طراحی، مؤلفه\u200cها و ابزارها',
    splitWords: false,
    subtitle:
      'با Ran Design، ranui و ranuts محصول بسازید. هر بخش به\u200cصورت مستقل با راهنمای توسعه\u200cدهندگان و عامل\u200cها قابل استفاده است.',
    ctaPrimary: 'یک ستون را انتخاب کنید',
    ctaSecondary: 'ساخت با عامل\u200cها',
    statLabels: ['کامپوننت', 'ابزار', 'زبان', 'مجوز'],
    proofTitle: 'حالت‌ها و مواد با ranui',
    proof: {
      states: ['در حال آپلود', 'اجرای عامل', 'در حال بارگیری'],
      cancel: 'لغو',
      steps: ['خواندن ۴ فایل', 'اجرای تست‌ها', 'باز کردن pull request'],
      stepStates: ['انجام شد', 'در حال اجرا', 'در انتظار'],
      meter: 'زمینه',
      glass: 'نمونهٔ شیشه',
    },
    chooseTitle: 'از کجا شروع کنید',
    pillars: [
      {
        title: 'Ran Design',
        desc: 'روش\u200cهای چیدمان، تعامل، حرکت و ارزیابی با شواهد، مستقل از کتابخانهٔ مؤلفه\u200cها.',
        more: 'کاوش طراحی',
      },
      {
        title: 'ranui',
        desc: 'کتابخانهٔ Web Components مستقل از فریم‌ورک. عنصرهای ‎r-‎ آمادهٔ استفاده را در Vue، React یا HTML ساده بگذارید.',
        more: 'مرور کامپوننت‌ها',
      },
      {
        title: 'ranuts',
        desc: 'ابزار تایپ‌شده برای رشته، شیء، رنگ، زمان، فایل و DOM. سازگار با tree-shaking و بدون وابستگی.',
        more: 'خواندن مستندات',
      },
    ],
    agentsCta: 'افزونه را نصب کنید',
    capsTitle: 'توانایی‌هایی فراتر از مجموعهٔ معمول',
    capTags: ['کامپوننت‌ها', 'ابزارها'],
    caps: {
      bridge: {
        name: 'Bridge',
        desc: 'وقتی iframe یا Worker یا تب‌ها به RPC مبتنی بر Promise روی postMessage با کانال‌های جدا نیاز دارند.',
      },
      gpu: {
        name: 'Visual',
        desc: 'وقتی به گراف صحنه به سبک Pixi با موتور WebGPU یا WebGL یا Canvas قابل تعویض نیاز دارید.',
      },
      vdom: {
        name: 'DOM مجازی',
        desc: 'وقتی بدون فریم‌ورک به hyperscript و patch و ماژول‌های قابل تعویض به سبک snabbdom نیاز دارید.',
      },
      totp: {
        name: 'TOTP',
        desc: 'وقتی به رمز یک‌بارمصرف RFC-6238 بدون آوردن کتابخانهٔ رمزنگاری نیاز دارید.',
      },
      mime: { name: 'فهرست MIME', desc: 'وقتی به جست‌وجوی دوسویهٔ MIME ⇄ پسوند از یک جدول بزرگِ توکار نیاز دارید.' },
      player: { name: 'پخش‌کننده', desc: 'وقتی به ویدئوی HLS وفقی با کنترل‌گر ماژولار نیاز دارید، نه پوستهٔ کامل اپ.' },
      droplet: {
        name: 'انتخابگر رنگ',
        desc: 'وقتی فرم به انتخاب HSV با خروجی زندهٔ HEX / RGBA نیاز دارد، نه فقط input رنگ بومی.',
      },
      radar: { name: 'نمودار راداری', desc: 'وقتی به نمودار راداری canvas با برچسب و سبک برچسب برای هر محور نیاز دارید.' },
      sigma: {
        name: 'فرمول ریاضی',
        desc: 'وقتی یک ویژگی باید LaTeX را به MathML بومی برساند.',
      },
      scratch: { name: 'کارت اسکراچ', desc: 'وقتی آشکارسازی به آستانهٔ خراش روی canvas نیاز دارد.' },
    },
    startTitle: 'نصب و استفاده',
    startDesc:
      'اگر کتابخانه می‌خواهید ranui و ranuts را نصب کنید. Ran Design و افزونهٔ عامل ورودی‌های جدا در ستون‌های بالا هستند.',
    startStep1: 'نصب و ثبت',
    startStep2: 'استفاده در هر جا',
    copy: 'رونوشت فرمان نصب',
    liveLabel: 'نمونه',
    liveNote: 'کامپوننت‌های واقعی ranui. ایمیل را خالی بگذارید یا خطا را شبیه‌سازی کنید تا هر حالت را ببینید.',
    example: {
      title: 'دعوت از هم‌تیمی',
      email: 'ایمیل کاری',
      emailPlaceholder: 'ada@company.com',
      role: 'نقش',
      roles: ['بیننده', 'ویرایشگر', 'مدیر'],
      submit: 'ارسال دعوت',
      sending: 'در حال ارسال…',
      invalid: 'یک نشانی ایمیل وارد کنید، مثلاً ada@company.com.',
      sent: 'دعوت برای {email} با نقش {role} ارسال شد.',
      failed: 'دعوت ارسال نشد. اطلاعاتی که وارد کردید باقی است؛ دوباره تلاش کنید.',
      simulate: 'شبیه‌سازی خطای درخواست',
      rules: 'پیروی می‌کند',
    },
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
  const s = HOME_STRINGS[dir] ?? HOME_STRINGS[''];
  return {
    headline: s.headline,
    splitWords: s.splitWords,
    subtitle: s.subtitle,
    ctaPrimary: s.ctaPrimary,
    ctaSecondary: s.ctaSecondary,
    stats: STAT_NUMS.map((num, i) => ({ num, label: s.statLabels[i] })),
    proofTitle: s.proofTitle,
    proof: s.proof,
    chooseTitle: s.chooseTitle,
    pillars: PILLAR_STRUCTURE.map((p, i) => ({ ...p, ...s.pillars[i] })),
    agentsCta: s.agentsCta,
    capsTitle: s.capsTitle,
    caps: CAPS_STRUCTURE.map((col, i) => ({
      lib: col.lib,
      tag: s.capTags[i],
      items: col.items.map((it) => ({ kind: it.kind, api: it.api, link: it.link, ...s.caps[it.kind] })),
    })),
    startTitle: s.startTitle,
    startDesc: s.startDesc,
    startStep1: s.startStep1,
    startStep2: s.startStep2,
    copy: s.copy,
    liveLabel: s.liveLabel,
    liveNote: s.liveNote,
    example: s.example,
  };
};
