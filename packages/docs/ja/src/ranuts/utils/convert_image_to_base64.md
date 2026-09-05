# convertImageToBase64

画像ファイルを Base64 の文字列に変換します。

## API

### convertImageToBase64

#### 戻り値

| 引数 | 説明 | 型 |
| ------------------------------------- | -------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | 結果のオブジェクトで解決される Promise | `Promise` |

#### convertImageToBase64Return

| プロパティ | 説明 | 型 |
| --------- | ------------------ | ------------------------------- |
| `success` | 成功したかどうか | `boolean` |
| `data` | Base64 のデータ | `string \| ArrayBuffer \| null` |
| `message` | エラーのメッセージ | `string` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | ----------------- | ------ | -------- |
| `file` | 画像のファイルオブジェクト | `File` | 必須 |

## 使用例

### 基本的な使い方

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // img の src にそのまま使えます
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('変換に失敗しました:', error);
    }
  }
});
```

### アップロードの前にプレビューする

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('画像の変換に失敗しました');
}
```

### エラーの扱い

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('エラー:', result.message);
  }
} catch (error) {
  console.error('例外:', error);
}
```

## 補足

1. **非同期の処理**：Promise を返すので、`await` か `.then()` で扱ってください。

2. **ファイルの種類**：ブラウザーが対応している画像の形式（JPEG、PNG、GIF、WebP など）はすべて扱えます。

3. **データの形**：返る `data` は完全な Data URL の形式（`data:image/jpeg;base64,...` など）なので、`img` タグの `src` にそのまま使えます。

4. **エラーの扱い**：変換に失敗すると Promise が reject されるので、捕まえてください。

5. **使いどころ**：画像のプレビュー、アップロード前の処理、ローカルへの保存などでよく使われます。
