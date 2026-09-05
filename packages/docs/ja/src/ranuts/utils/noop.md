# noop

何もしない関数です。既定のコールバックや、その場しのぎの置き場所としてよく使われます。

## API

### noop

#### 戻り値

| 引数   | 説明               | 型     |
| ------ | ------------------ | ------ |
| `void` | 戻り値はありません | `void` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { noop } from 'ranuts';

// 既定のコールバックとして
const callback = noop;
callback(); // 何も起きません
```

### 引数の既定値として使う

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // データを処理する
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// 成功時のコールバックだけを渡す
processData({ id: 1 }, (data) => {
  console.log('成功:', data);
});

// コールバックを何も渡さない
processData({ id: 2 }); // 例外にはなりません
```

### 条件つきのコールバック

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('処理を実行');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### イベントリスナーの仮置き

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // いまはイベントを扱わない
```

## 補足

1. **速度**：空の関数を呼ぶ負荷はごくわずかなので、既定値に向いています。
2. **型の安全**：TypeScript では `noop` の型は `() => void` なので、関数を求められるところならどこでも安全に使えます。
3. **読みやすさ**：`() => {}` より `noop` のほうが、「何もしない」という意図がはっきり伝わります。
