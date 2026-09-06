# isImageSize

画像ファイルの寸法が、求める条件に合っているかを確かめます。

## API

### isImageSize

#### 戻り値

| 引数 | 説明 | 型 |
| ------------------ | ------------------------------------------------------------- | --------- |
| `Promise<boolean>` | 寸法が条件に合うかどうかで解決される Promise | `Promise` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | -------------------------- | -------- | -------- |
| `file` | 画像のファイルオブジェクト | `File` | 必須 |
| `width` | 期待する幅（任意） | `number` | 任意 |
| `height` | 期待する高さ（任意） | `number` | 任意 |

## 使用例

### 基本的な使い方

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // 幅が 800 かどうかを確かめます
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('画像の幅は条件に合っています');
      } else {
        console.log('画像の幅が条件に合いません');
      }
    } catch (error) {
      console.error('確認に失敗しました:', error);
    }
  }
});
```

### 幅と高さの両方を確かめる

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // 800x600 かどうかを確かめます
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### 高さだけを確かめる

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// 高さが 600 かどうかだけを確かめます
```

### アップロード前の確認

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('画像の寸法は 1920x1080 でなければなりません');
    return;
  }
  // アップロードを続けます
}
```

## ふるまい

1. **`width` と `height` の両方を渡したときは、両方が一致しなければなりません。** どちらも渡さなければ、そのファイルが画像としてデコードできるかどうかだけを確かめます。
2. **デコードに失敗すると reject します。** 壊れたファイルや画像でないファイルのとき、Promise を保留のまま放置しません。
3. **オブジェクト URL は必ず解放します。** 成功しても失敗しても解放するので、たくさんのファイルを確かめても、blob の URL がページを離れるまで漏れ続けることはありません。
4. **ブラウザー専用です。** SSR では、はっきりしたエラーで reject します。

::: warning 0.3 で修正しました
以前はふたつめの条件がひとつめを上書きしていたので、`width` と `height` の両方を渡すと `width` が黙って無視されていました。`onerror` がなかったので、壊れたファイルを渡すと Promise が永遠に保留のままでした。SSR の防護は `reject` を呼んだあと return せずに先へ進み、`window` に触れて `ReferenceError` を投げていました。
:::

## 補足

1. **非同期の処理**：Promise を返すので、`await` か `.then()` で扱ってください。

2. **引数について**：
   - `width` だけを渡せば、幅だけを確かめます
   - `height` だけを渡せば、高さだけを確かめます
   - 両方を渡せば、両方が一致しなければなりません

3. **サーバー側の環境**：サーバー側の環境（`window` オブジェクトがない）では reject します。

4. **メモリーの後片づけ**：作ったオブジェクト URL は関数の内部で自動的に片づけられるので、自分で扱う必要はありません。

5. **使いどころ**：アップロード前の寸法の確認、アイコン画像の大きさの確認などでよく使われます。
