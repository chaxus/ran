# SyncHook

同期のイベントフックのクラスです。発行・購読（publish-subscribe）の仕組みを作るのに使います。

## API

### SyncHook

#### 主なメソッド

| メソッド   | 説明                                                       | 戻り値          |
| ---------- | ---------------------------------------------------------- | --------------- |
| `tap`      | イベントを購読する                                         | `this`          |
| `call`     | イベントを発火する                                         | `this`          |
| `callSync` | イベントを同期的に発火する（非同期のコールバックにも対応） | `Promise<this>` |
| `once`     | イベントを一度だけ購読する                                 | `this`          |
| `off`      | イベントの購読をやめる                                     | `this`          |

## 使用例

### 基本的な使い方

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// イベントを購読する
hook.tap('event1', () => {
  console.log('イベント 1 が発火しました');
});

// イベントを発火する
hook.call('event1'); // 'イベント 1 が発火しました'
```

### 引数を渡す

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`こんにちは、${name}さん！`);
});

hook.call('greet', 'World'); // 'こんにちは、Worldさん！'
```

### 一度だけ購読する

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('これは一度しか起きません');
});

hook.call('onceEvent'); // 'これは一度しか起きません'
hook.call('onceEvent'); // 何も起きません
```

### 購読をやめる

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('コールバック');
};

hook.tap('event', callback);
hook.call('event'); // 'コールバック'

hook.off('event', callback);
hook.call('event'); // 何も起きません
```

### 非同期のコールバック

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('非同期のコールバック');
});

await hook.callSync('asyncEvent'); // '非同期のコールバック'
```

## 補足

1. **同期の実行**：`call` メソッドは、すべてのコールバックを同期的に実行します。
2. **非同期にも対応**：`callSync` メソッドは非同期のコールバックに対応し、すべて終わるまで待ちます。
3. **イベントの管理**：内部では Map と Set を使ってイベントとコールバックを管理しています。
4. **使いどころ**：イベントの仕組み、プラグインの仕組み、ミドルウェアなどでよく使われます。
