# connection

いまのネットワーク接続の情報を取得します（Network Information API）。

## API

### connection

#### 戻り値

| 引数                              | 説明                                             | 型                                |
| --------------------------------- | ------------------------------------------------ | --------------------------------- |
| `NetworkInformation \| undefined` | ネットワーク接続のオブジェクト、または undefined | `NetworkInformation \| undefined` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('ネットワークの種類:', conn.effectiveType);
  console.log('下り速度:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### ネットワークの変化を監視する

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('ネットワークの状態が変わりました');
    console.log('新しいネットワークの種類:', conn.effectiveType);
  });
}
```

### ネットワークに応じて方針を変える

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // 遅いネットワーク。低画質の画像を読み込む
    loadLowQualityImages();
  } else {
    // 速いネットワーク。高画質の画像を読み込む
    loadHighQualityImages();
  }
}
```

## 補足

1. **ブラウザーの対応**：Network Information API に対応したブラウザーが必要で、対応していないものもあります。
2. **サーバー側の環境**：サーバー側の環境（`window` オブジェクトがない）では `undefined` を返します。
3. **接続オブジェクトのプロパティ**：
   - `effectiveType`：ネットワークの種類（'slow-2g'、'2g'、'3g'、'4g'）
   - `downlink`：下り速度（Mbps）
   - `rtt`：往復時間（ミリ秒）
   - `saveData`：データセーバーが有効かどうか
4. **使いどころ**：ネットワークの状況に応じて読み込み方を変えるなど、パフォーマンスの調整でよく使われます。
