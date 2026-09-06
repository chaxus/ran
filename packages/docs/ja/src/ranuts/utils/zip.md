# zip

依存なしで ZIP の書庫を読み、書き換えます。DEFLATE はその環境が持っているものを使います。

ZIP は、OOXML（`.docx` / `.xlsx` / `.pptx`）、EPUB、ODF、ブラウザーの拡張機能の、いずれの土台にもなっている入れ物です。「この書庫からファイルをひとつ取り出す」「この書庫の中のファイルをひとつ書き換える」という用は絶えず出てきますが、そのために ZIP のライブラリを丸ごと抱えるのは重すぎます。このふたつに要るのは中央ディレクトリと DEFLATE だけで、その DEFLATE はいまやどのブラウザーにも `DecompressionStream` として載っています。

## API

| 関数                               | 説明                                                                  |
| ---------------------------------- | --------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | 中央ディレクトリを解析して `ZipEntry[]` にします。ZIP でなければ `[]` |
| `readZipEntry(bytes, nameOrEntry)` | 項目をひとつ展開します。見つからないときや対応していないときは `null` |
| `zipHasEntry(bytes, name)`         | ちょうどその名前の項目があるかどうか                                  |
| `rewriteZip(bytes, options)`       | 項目を差し替えたり、新しい項目を足したりして書庫を組み直します        |
| `createZip(files)`                 | 書庫を一から組み立てます。項目はすべて STORED です                    |
| `crc32(data)`                      | IEEE の CRC32。ZIP が項目ごとに持っているチェックサムです             |
| `inflateRaw(data)`                 | 生の DEFLATE のバイト列を展開します（zlib や gzip の包みなし）        |

### `rewriteZip` options

| オプション  | 説明                                                                                       | 既定値           |
| ----------- | ------------------------------------------------------------------------------------------ | ---------------- |
| `filter`    | どの項目を展開して `transform` へ渡すか                                                    | すべてのファイル |
| `transform` | `(data, entry) => Uint8Array \| string \| null`。`null` を返すとその項目はそのまま残ります | —                |
| `inject`    | 新しく足す項目：`{ name, data }[]`                                                         | —                |

### `ZipEntry`

| フィールド                                  | 説明                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `name`                                      | 書庫の中でのパス。`word/document.xml` など          |
| `compression`                               | `ZIP_STORED`（0）か `ZIP_DEFLATE`（8）              |
| `crc`、`compressedSize`、`uncompressedSize` | 中央ディレクトリに記録されているとおりの値          |
| `modTime`、`modDate`                        | MS-DOS 形式に詰められた時刻。書き換えても保たれます |
| `directory`                                 | 名前が `/` で終わっているかどうか                   |
| `dataStart`                                 | もとのデータの中で、圧縮されたバイト列が始まる位置  |

## 使用例

### `.docx` からファイルをひとつ読み出す

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### 中身を並べる

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### XML の部品をすべて書き換え、ファイルを足す

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### 埋め込まれたメディアをオブジェクト URL として取り出す

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### 入れ物を組み立てる

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## 補足

1. **読めるのは STORED と DEFLATE です。** ほかの圧縮方式も `readZipEntries` には現れますが、`readZipEntry` は当て推量をせず `null` を返します。

2. **書き換えたものは圧縮されません。** 差し替えた項目と足した項目は STORED で書かれるので、出力はもとより大きくなります。手を付けなかった項目は、もとの圧縮されたバイト列をそのまま写します。これは「直して渡す」用途には正しい取り引きですが、保管の用途には誤った取り引きです。

3. **何も変わらなかったときは、`rewriteZip` はもとの配列をそのまま返します。** 変換が同じバイト列を返した場合も同じです。何もしない経路には費用がかからず、結果は `===` で比べられます。

4. **大きさは必ず中央ディレクトリから取り、ローカルヘッダーからは決して取りません。** ストリーミングで書き出す実装は、汎用ビットの 3 を立ててローカルヘッダーには 0 を残し、本当の値は圧縮されたバイト列の _あと_ のデータディスクリプターに書き込みます。ローカルヘッダーを信じることこそ、自作の ZIP の読み手が実際のファイルで壊れるいちばんよくある原因です。`rewriteZip` は新しいローカルヘッダーも書き、そのビットを下ろすので、出力は厳密な解析器でも読めます。

5. **変換に失敗した項目は、そのまま残ります。** `transform` が例外を投げたときや、対応していない方式の項目だったときは、もとの中身をそのまま写します。書き換えが、理解できなかったデータを失わせてはいけないからです。

6. **ZIP64 も、暗号化も、複数ディスクも扱いません。** 4 GiB を超える書庫や、項目が 65535 を超える書庫は対象外です。`readZipEntries` は、解析できないものに対して例外を投げず `[]` を返します。ふつうの呼び出し側は、利用者から渡されたファイルを調べているところだからです。

7. **`inflateRaw` には `DecompressionStream` が要ります。** いまどきのブラウザーならどれにもあり、Node も 18 以降にはあります。この API がないところでは例外を投げます。
