# detectLanguage

按字符占比判定一段文本的主语言。纯统计方式，不加载模型，不加载词典。适合
「用哪套分词规则 / 哪个语言专属模型 / 哪种排版度量」这类分支判断。

## API

### detectLanguage(text, sampleSize?)

| 参数         | 说明       | 类型     | 默认值  |
| ------------ | ---------- | -------- | ------- |
| `text`       | 待检测文本 | `string` | 必填    |
| `sampleSize` | 采样字符数 | `number` | `20000` |

返回 `'zh' \| 'en' \| 'other'`。

### navigatorLanguage()

把浏览器 UI 语言映射到同一套三分桶，用作没有内容可检测时的默认值。SSR 下返回 `'other'`。

## 示例

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## 注意

1. **只采样开头**。正文语言全文一致，为了确认第一段就已说明的事去扫一本上百万字的书纯属浪费。
2. **夹杂少量英文的中文仍判中文**。拉丁字符要明显占多（超过 3 倍）才判成英文，
   因为中文里混英文很常见，反过来少见。
3. **`'other'` 表示「既非 CJK 也非拉丁」**：日语假名、西里尔、阿拉伯文、纯数字文本都落在这里。
   这是一个粗粒度三分桶，不是语种识别。
