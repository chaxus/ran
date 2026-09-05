# scriptOnLoad

script や link のタグを動的に差し込み、すべての読み込みが終わるまで待ちます。

## API

### scriptOnLoad

#### 戻り値

| 引数            | 説明                                               | 型        |
| --------------- | -------------------------------------------------- | --------- |
| `Promise<void>` | すべての読み込みが終わったときに解決される Promise | `Promise` |

#### パラメーター

| パラメーター | 説明                                                 | 型            | 既定値 |
| ------------ | ---------------------------------------------------- | ------------- | ------ |
| `urls`       | リソースの URL の配列                                | `string[]`    | 必須   |
| `append`     | 差し込み先の親要素（任意）                           | `HTMLElement` | `body` |
| `callback`   | すべての読み込みが終わったときのコールバック（任意） | `Function`    | 任意   |

## 使用例

### 基本的な使い方

```js
import { scriptOnLoad } from 'ranuts';

// スクリプトをひとつ読み込む
await scriptOnLoad(['https://example.com/script.js']);
console.log('スクリプトを読み込みました');
```

### 複数のリソースを読み込む

```js
import { scriptOnLoad } from 'ranuts';

// 複数のスクリプトとスタイルを同時に読み込む
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('すべてのリソースを読み込みました');
```

### コールバックを使う

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('読み込みが終わりました。使い始められます');
});
```

### サードパーティのライブラリを動的に読み込む

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // ライブラリを読み込んだので使えます
  window.Library.init();
}
```

## 補足

1. **種類の自動判別**：URL の末尾（`.css`）を見て、スタイルなのかスクリプトなのかを自動で見分けます。
2. **並行して読み込む**：すべてのリソースを並行して読み込み、全部が終わってから解決します。
3. **差し込み先**：既定では `body` 要素ですが、ほかの親要素も指定できます。
4. **Promise とコールバック**：どちらにも対応しており、併用もできます。
