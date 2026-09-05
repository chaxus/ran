# detectLanguage

文字の割合から、その文章の主たる言語を決めます。純粋な統計であって、モデルも辞書も使いません。「どのトークナイザーか / どの言語向けのモデルか / どの組版の寸法か」を分岐するのに使ってください。

## API

### detectLanguage(text, sampleSize?)

| パラメーター | 説明 | 型 | 既定値 |
| ------------ | -------------------- | -------- | -------- |
| `text` | 調べる文章 | `string` | 必須 |
| `sampleSize` | 標本として見る文字数 | `number` | `20000` |

`'zh' \| 'en' \| 'other'` を返します。

### navigatorLanguage()

ブラウザーの UI の言語を、同じ 3 つの区分に写したものです。調べる内容がないときの既定値になります。SSR では `'other'` を返します。

## 使用例

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## 補足

1. **先頭だけを標本にします。** 文章の言語は全体を通じて一貫しています。最初の段落がすでに教えてくれることを知るために、100 万字の本を走査するのは無駄です。
2. **英語が少し混じった中国語は、中国語のままです。** 判定が英語へ傾くには、ラテン文字がはっきり優勢（3 倍を超える）でなければなりません。中国語に英語を混ぜるのはよくあることで、逆はそうではありません。
3. **`'other'` は「CJK でもラテンでもない」という意味です。** 日本語のかな、キリル文字、アラビア文字、数字だけの文章はすべてここに入ります。これは粗い 3 分類であって、言語の同定ではありません。
