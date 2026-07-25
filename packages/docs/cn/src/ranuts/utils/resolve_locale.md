# resolveLocale

按惯常的链路挑出该用哪个语言：**query → cookie → localStorage → navigator → 兜底值**。

文案表是你自己的，这里只负责挑出那个 key。

## API

### resolveLocale(options)

| 选项           | 说明                                                        | 类型                | 默认值         |
| -------------- | ----------------------------------------------------------- | ------------------- | -------------- |
| `supported`    | 实际支持的语言，越具体的放越前                              | `readonly string[]` | 必填           |
| `fallback`     | 全部不匹配时返回的值                                        | `string`            | `supported[0]` |
| `query`        | 承载显式选择的查询参数，如 `lang`                           | `string`            | —              |
| `cookie`       | 承载选择的 cookie 名                                        | `string`            | —              |
| `storageKey`   | 承载用户上次在应用内所选语言的 localStorage 键              | `string`            | —              |
| `useNavigator` | 兜底前是否参考 `navigator.languages` / `navigator.language` | `boolean`           | `true`         |
| `url`          | 从哪个 URL 读 query                                         | `string`            | 当前页面地址   |

#### 返回值

`supported` 中的某一项 —— 一定是其中之一，不会返回任意字符串。

## 示例

### 完整链路

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### 地区变体回退到基础语言

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'（不支持 → 兜底）
```

### 与语言路径配合

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// URL 里已经写明的优先；否则回到用户自己的偏好。
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## 注意事项

1. **顺序才是重点**。URL 上的 `?lang=` 是显式的、可分享的、一次性的指令，优先级最高；cookie 是
   服务端也能看到的决定，优先于纯客户端状态；localStorage 是用户上次在应用内选的；
   `navigator.language` 只是对首次访问者的猜测。顺序搞反就会出现那个经典 bug：分享出去的
   `?lang=en` 链接在接收方那里仍然按他存储的语言渲染。

2. **返回值一定在 `supported` 里**。不在列表中的值会被忽略而不是原样返回，因此结果可以直接拿
   去索引文案表。

3. **匹配大小写不敏感，并按基础语言回退**。`supported: ['en', 'zh-CN']` 时，`en-GB` 命中
   `en`，`zh` 命中 `zh-CN`。

4. **按顺序遍历 `navigator.languages`**，而不只看 `navigator.language` —— 前者是用户真实的
   偏好排序，而它的第一项往往并不是最合适的那个。

5. **每个来源都会静默降级**。没有 `window`、没有 `document.cookie`、没有 localStorage 时，各自
   什么也不提供，因此整条链在 SSR 和构建期脚本里同样可用。
