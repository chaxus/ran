# createLocalePath

多语言站点的 URL 换算。纯函数、无全局状态、无 DOM —— 构建期脚本（sitemap、`hreflang`）
和浏览器里都能跑。

采用**子目录**（`/zh/book/`）而非子域名（`zh.example.com/book/`）：搜索引擎把子域名当独立站点、
权重从零开始，而子目录继承主站权重。默认语言落在根路径，其余语言带前缀。

## API

### createLocalePath(config)

| 参数            | 说明                                                      | 类型            | 默认值               |
| --------------- | --------------------------------------------------------- | --------------- | -------------------- |
| `locales`       | `{ code, prefix? }[]`，无 prefix 表示默认语言、落在根路径 | `LocaleRoute[]` | 必填                 |
| `defaultLocale` | 默认语言 code                                             | `string`        | 第一个无 prefix 的项 |
| `base`          | 部署子路径，如 `/weread`；结尾斜杠会被忽略                | `string`        | `''`                 |

返回：

| 成员                            | 说明                                                     |
| ------------------------------- | -------------------------------------------------------- |
| `base` / `defaultLocale`        | 归一化后的配置，只读                                     |
| `localeFromPath(pathname)`      | 识别语言，识别不出返回默认语言                           |
| `stripLocale(pathname)`         | 去掉语言前缀，得到与语言无关的路径（路由判断用）         |
| `href(path, code?)`             | 生成某语言下的链接                                       |
| `hrefForLocale(pathname, code)` | 把当前路径换算到另一语言（语言切换器用）                 |
| `alternates(pathname)`          | 所有语言下的地址，用于 `<link rel="alternate" hreflang>` |

## 示例

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/'); // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN'); // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/'); // 'zh-CN'
paths.stripLocale('/docs/zh/book/'); // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// hreflang 标签
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## 注意

1. **`href` 是幂等的**。加新前缀前会先剥掉已有前缀，传入已本地化的路径不会叠加 ——
   `hrefForLocale` 本身就是 `href`。
2. **长前缀优先匹配**，`zh` 不会吃掉 `/zh-hant/...`。
3. **`base` 只从开头剥**。用 `replace(base, '')` 会替换字符串中第一次出现的位置，
   路径中部含有同名片段时会剥错地方。
4. **query 与 hash 会保留** —— 换算只作用于 pathname。
5. **没有全局「当前语言」**。语言 code 由调用方显式传入或走默认值；当前语言是 i18n 运行时的职责，
   不是本模块的。
