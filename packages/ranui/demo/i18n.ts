// Lightweight demo-only i18n. Strings are trusted/static, so values may contain
// inline markup and are assigned via innerHTML.
export type Lang = 'en' | 'zh';

const STORAGE_KEY = 'ran-demo-lang';

type Dict = Record<string, string>;

const en: Dict = {
  'brand.tagline': 'Web Components · Geist design system',
  'hero.title': 'A token-driven component library.',
  'hero.desc':
    'Built on Web Components and the Geist design system. Every surface below is themed by the same <code>--ran-*</code> tokens — flip dark mode to watch them all re-resolve at once.',

  'sec.colors': 'Color scales',
  'sec.colors.lead': 'Geist base palette. Each step is a CSS custom property that flips value in dark mode.',
  'sec.radius': 'Radius & elevation',
  'sec.buttons': 'Buttons',
  'sec.forms': 'Forms',
  'sec.feedback': 'Feedback',
  'sec.surfaces': 'Surfaces',
  'sec.dataviz': 'Data visualization',

  'btn.primary': 'Primary',
  'btn.default': 'Default',
  'btn.warning': 'Warning',
  'btn.text': 'Text',
  'btn.icon': 'With icon',
  'btn.loading': 'Loading',
  'btn.disabled': 'Disabled',

  'card.input': 'Input',
  'card.select': 'Select',
  'card.checkbox': 'Checkbox',
  'card.progress': 'Progress',
  'card.skeleton': 'Skeleton',
  'card.loading': 'Loading',
  'card.message': 'Message',

  'input.username.label': 'Username',
  'input.username.ph': 'Enter username',
  'input.password.label': 'Password',
  'input.email.label': 'Email',
  'input.email.ph': 'Invalid email',
  'select.ph': 'Pick a teammate',
  'opt.high': '🔴 High priority',
  'opt.medium': '🟡 Medium priority',
  'opt.low': '🟢 Low priority',

  'cb.tests': 'Run unit tests',
  'cb.review': 'Review pull request',
  'cb.deploy': 'Deploy to staging',
  'cb.disabled': 'Disabled option',
  'msg.success': 'Success',
  'msg.error': 'Error',

  'card.cross.title': 'Cross-framework',
  'card.cross.desc': 'Drop ranui into React, Vue, or vanilla — they are native custom elements.',
  'card.token.title': 'Token-based styling',
  'card.token.desc': 'Theme with documented CSS variables, no build step required.',
  'card.ssr.title': 'SSR ready',
  'card.ssr.desc': 'Server-render to a string and hydrate on the client.',

  'tab.overview': 'Overview',
  'tab.api': 'API',
  'tab.theming': 'Theming',
  'tab.disabled': 'Disabled',
  'tab.overview.body': 'ranui ships ~24 components, all Shadow-DOM encapsulated.',
  'tab.api.body': 'Each component exposes attributes, <code>::part()</code>, and CSS variables.',
  'tab.theming.body': 'Light/dark via a single attribute; tokens follow the Geist scale.',
  'tab.disabled.body': 'Disabled tab.',

  'surfaces.modal': 'Open modal',
  'surfaces.doc': 'Documentation link →',

  'modal.title': 'Deploy to production',
  'modal.body': 'This will push the current build to the production environment. Continue?',
  'modal.cancel': 'Cancel',
  'modal.deploy': 'Deploy',

  'nav.github': 'GitHub',
  'nav.issues': 'Issues',
  'footer': 'ranui · MIT · ',
};

const zh: Dict = {
  'brand.tagline': 'Web Components · Geist 设计系统',
  'hero.title': '一个 token 驱动的组件库。',
  'hero.desc':
    '基于 Web Components 与 Geist 设计系统构建。下方每个元素都由同一套 <code>--ran-*</code> token 着色 —— 切换暗色模式，它们会一起重新解析。',

  'sec.colors': '色阶',
  'sec.colors.lead': 'Geist 基础调色板。每一档都是一个 CSS 变量，在暗色模式下自动翻转取值。',
  'sec.radius': '圆角与阴影',
  'sec.buttons': '按钮',
  'sec.forms': '表单',
  'sec.feedback': '反馈',
  'sec.surfaces': '容器',
  'sec.dataviz': '数据可视化',

  'btn.primary': '主要',
  'btn.default': '默认',
  'btn.warning': '警告',
  'btn.text': '文字',
  'btn.icon': '带图标',
  'btn.loading': '加载中',
  'btn.disabled': '禁用',

  'card.input': '输入框',
  'card.select': '选择器',
  'card.checkbox': '复选框',
  'card.progress': '进度条',
  'card.skeleton': '骨架屏',
  'card.loading': '加载',
  'card.message': '消息',

  'input.username.label': '用户名',
  'input.username.ph': '请输入用户名',
  'input.password.label': '密码',
  'input.email.label': '邮箱',
  'input.email.ph': '邮箱格式错误',
  'select.ph': '选择成员',
  'opt.high': '🔴 高优先级',
  'opt.medium': '🟡 中优先级',
  'opt.low': '🟢 低优先级',

  'cb.tests': '运行单元测试',
  'cb.review': '审查合并请求',
  'cb.deploy': '部署到预发',
  'cb.disabled': '禁用项',
  'msg.success': '成功',
  'msg.error': '错误',

  'card.cross.title': '跨框架',
  'card.cross.desc': '在 React、Vue 或原生中直接使用 —— 它们是原生自定义元素。',
  'card.token.title': 'Token 化样式',
  'card.token.desc': '用文档化的 CSS 变量定制主题，无需构建步骤。',
  'card.ssr.title': '支持 SSR',
  'card.ssr.desc': '服务端渲染为字符串，在客户端水合。',

  'tab.overview': '概览',
  'tab.api': 'API',
  'tab.theming': '主题',
  'tab.disabled': '禁用',
  'tab.overview.body': 'ranui 提供约 24 个组件，全部基于 Shadow DOM 封装。',
  'tab.api.body': '每个组件都暴露属性、<code>::part()</code> 与 CSS 变量。',
  'tab.theming.body': '通过单个属性切换明暗；token 遵循 Geist 色阶。',
  'tab.disabled.body': '禁用的标签页。',

  'surfaces.modal': '打开弹窗',
  'surfaces.doc': '查看文档 →',

  'modal.title': '部署到生产环境',
  'modal.body': '这会把当前构建推送到生产环境，确定继续吗？',
  'modal.cancel': '取消',
  'modal.deploy': '部署',

  'nav.github': 'GitHub',
  'nav.issues': 'Issues',
  'footer': 'ranui · MIT · ',
};

const DICTS: Record<Lang, Dict> = { en, zh };

export const getLang = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'zh') return stored;
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('zh')) return 'zh';
  return 'en';
};

export const setLang = (lang: Lang): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
};

export const applyLanguage = (lang: Lang): void => {
  const dict = DICTS[lang] ?? en;
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

  const set = (attr: string, apply: (el: Element, value: string) => void): void => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const key = el.getAttribute(attr);
      if (key && dict[key] != null) apply(el, dict[key]);
    });
  };

  set('data-i18n', (el, v) => {
    (el as HTMLElement).innerHTML = v;
  });
  set('data-i18n-placeholder', (el, v) => el.setAttribute('placeholder', v));
  set('data-i18n-label', (el, v) => el.setAttribute('label', v));
  set('data-i18n-title', (el, v) => el.setAttribute('title', v));
  set('data-i18n-desc', (el, v) => el.setAttribute('description', v));
};
