# resolveLocale

対応しているロケールの中からどれを使うかを、おなじみの順序で選びます。**クエリ → Cookie → localStorage → navigator → 既定値** の順です。

メッセージの一覧はあなたのものです。これが選ぶのはその鍵だけです。

## API

### resolveLocale(options)

| オプション     | 説明                                                                           | 型                  | 既定値          |
| -------------- | ------------------------------------------------------------------------------ | ------------------- | --------------- |
| `supported`    | 実際に用意してあるロケール。細かいものから先に並べます                         | `readonly string[]` | 必須            |
| `fallback`     | どれにも当てはまらなかったときに返る値                                         | `string`            | `supported[0]`  |
| `query`        | はっきり指定された選択を運ぶクエリパラメーター（`lang` など）                  | `string`            | —               |
| `cookie`       | 選択を運ぶ Cookie の名前                                                       | `string`            | —               |
| `storageKey`   | 利用者が最後に選んだものを収めた localStorage のキー                           | `string`            | —               |
| `useNavigator` | 既定値に落ちる前に `navigator.languages` / `navigator.language` を見るかどうか | `boolean`           | `true`          |
| `url`          | クエリを読み取る URL                                                           | `string`            | いまの location |

#### 戻り値

`supported` の中の、当てはまった項目です。必ずその中のどれかであって、任意の文字列が返ることはありません。

## 使用例

### 一連の流れ

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

### 地域つきの指定は、もとの言語に落ちます

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'（未対応なので既定値へ）
```

### ロケールつきの URL と組み合わせる

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// URL がすでに示しているものを優先し、なければ利用者自身の好みに従います。
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## 補足

1. **肝心なのは順序です。** URL の `?lang=` ははっきりした指定で、人に渡せて、その一度きりのものなので、何よりも優先します。Cookie はサーバーからも見える決定なので、クライアントだけの状態より優先します。localStorage は、利用者がアプリの中で最後に選んだものです。`navigator.language` は、初めて訪れた人についての推測にすぎません。この順序を逆にすると、共有された `?lang=en` のリンクが、受け取った人の保存済みの言語で表示され続けるという、おなじみの不具合になります。

2. **返るのは必ず `supported` の中のどれかです。** 一覧の外の値は、返さずに無視します。ですから返った値でメッセージの一覧を安全に引けます。

3. **照合は大文字小文字を区別せず、もとの言語まで落ちます。** `supported: ['en', 'zh-CN']` なら、`en-GB` は `en` に、`zh` は `zh-CN` に当たります。

4. **`navigator.language` だけでなく `navigator.languages` を順に見ます。** この一覧は利用者が実際に付けた優先順位であり、その先頭が、用意してあるものの中で最良の一致とはかぎらないからです。

5. **どの手がかりも、静かに諦めます。** `window` がない、`document.cookie` がない、localStorage がない。それぞれが何も足さないだけなので、SSR でもビルド時のスクリプトでもこの流れは働きます。
