/**
 * 多语言站点的 URL 换算（纯函数，无全局状态、无 DOM）。
 *
 * 采用**子目录**而非子域名（`/zh/book/` 而不是 `zh.example.com/book/`）：搜索引擎把子域名
 * 当独立站点，权重从零开始；子目录继承主站权重。默认语言落在根路径（`/book/`），
 * 其余语言带前缀。
 *
 * 与「当前语言是什么」解耦——本模块只做路径换算，语言状态由调用方（i18n 运行时）持有。
 * 所以它在构建期脚本（生成 sitemap / hreflang）和浏览器里都能跑。
 */

export interface LocaleRoute {
  /** 语言代码，如 `zh-CN`；作为对外标识（hreflang、i18n 字典 key） */
  code: string;
  /** URL 前缀，如 `zh`。留空 = 默认语言，落在根路径 */
  prefix?: string;
}

export interface LocalePathConfig {
  locales: readonly LocaleRoute[];
  /** 默认语言 code；省略时取第一个没有 prefix 的，再退回 `locales[0]` */
  defaultLocale?: string;
  /** 部署子路径，如 `/weread`；根部署留空。结尾斜杠会被忽略 */
  base?: string;
}

export interface LocalePath {
  /** 归一化后的 base（无结尾斜杠；根部署为空串） */
  readonly base: string;
  readonly defaultLocale: string;
  /** 从 pathname 识别语言，识别不出返回默认语言 */
  localeFromPath: (pathname: string) => string;
  /** 去掉语言前缀，得到与语言无关的路径（用于路由判断） */
  stripLocale: (pathname: string) => string;
  /** 生成某语言下的链接；已带前缀的路径会先被剥离，故重复调用是幂等的 */
  href: (path: string, code?: string) => string;
  /** 把任意语言下的路径换算成另一语言的对应地址（语言切换器用） */
  hrefForLocale: (pathname: string, code: string) => string;
  /** 该路径在所有语言下的地址，用于 `<link rel="alternate" hreflang>` */
  alternates: (pathname: string) => Array<{ code: string; href: string }>;
}

/** base 归一化：去掉结尾斜杠、补上开头斜杠；空 base 保持空串 */
const normalizeBase = (base: string): string => {
  const trimmed = base.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

/** 切出 query/hash，换算只作用于 pathname 部分，剩下的原样接回去 */
const splitSuffix = (path: string): [string, string] => {
  const index = path.search(/[?#]/);
  return index === -1 ? [path, ''] : [path.slice(0, index), path.slice(index)];
};

/**
 * @description: 创建一组语言路径换算函数。
 *
 * @param {LocalePathConfig} config
 * @return {LocalePath}
 * @example
 * ```ts
 * const paths = createLocalePath({
 *   locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
 *   base: '/docs',
 * });
 * paths.href('/book/walden/');                 // '/docs/book/walden/'
 * paths.href('/book/walden/', 'zh-CN');        // '/docs/zh/book/walden/'
 * paths.localeFromPath('/docs/zh/book/');      // 'zh-CN'
 * paths.stripLocale('/docs/zh/book/');         // '/docs/book/'
 * paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'
 * ```
 */
export const createLocalePath = (config: LocalePathConfig): LocalePath => {
  const locales = config.locales.length > 0 ? config.locales : [{ code: 'en' }];
  const base = normalizeBase(config.base ?? '');
  const defaultLocale = config.defaultLocale ?? (locales.find((l) => !l.prefix) ?? locales[0]).code;
  // 长前缀优先匹配：否则 `zh` 会先命中 `/zh-hant/...`，把繁体路径判成简体
  const prefixed = locales
    .filter((l) => l.prefix)
    .sort((a, b) => (b.prefix as string).length - (a.prefix as string).length);

  const localeOf = (code: string): LocaleRoute => locales.find((l) => l.code === code) ?? { code: defaultLocale };

  /**
   * 只剥**开头**的 base。用 `replace(base, '')` 会替换字符串中第一次出现的位置，
   * base 为 `/zh` 而路径里另有 `/zh` 段时会剥错地方。
   */
  const stripBase = (pathname: string): string => {
    const path = pathname || '/';
    if (!base) return path.startsWith('/') ? path : `/${path}`;
    if (path === base) return '/';
    if (path.startsWith(`${base}/`)) return path.slice(base.length);
    return path.startsWith('/') ? path : `/${path}`;
  };

  /** 从「已剥 base 的路径」里认出并剥掉语言前缀 */
  const splitPrefix = (rest: string): { code: string; rest: string } => {
    const first = rest.split('/').filter(Boolean)[0];
    const hit = first ? prefixed.find((l) => l.prefix === first) : undefined;
    if (!hit) return { code: defaultLocale, rest };
    const stripped = rest.slice((hit.prefix as string).length + 1) || '/';
    return { code: hit.code, rest: stripped.startsWith('/') ? stripped : `/${stripped}` };
  };

  const localeFromPath = (pathname: string): string => splitPrefix(stripBase(splitSuffix(pathname)[0])).code;

  const stripLocale = (pathname: string): string => {
    const [path, suffix] = splitSuffix(pathname);
    return `${base}${splitPrefix(stripBase(path)).rest}${suffix}`;
  };

  const href = (path: string, code: string = defaultLocale): string => {
    const [pathname, suffix] = splitSuffix(path);
    const { rest } = splitPrefix(stripBase(pathname));
    const { prefix } = localeOf(code);
    const withPrefix = prefix ? `/${prefix}${rest}` : rest;
    return `${base}${withPrefix}${suffix}` || '/';
  };

  return {
    base,
    defaultLocale,
    localeFromPath,
    stripLocale,
    href,
    hrefForLocale: (pathname: string, code: string): string => href(pathname, code),
    alternates: (pathname: string): Array<{ code: string; href: string }> =>
      locales.map((l) => ({ code: l.code, href: href(pathname, l.code) })),
  };
};
