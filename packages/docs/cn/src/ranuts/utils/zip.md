# zip

零依赖读写 ZIP 压缩包，DEFLATE 直接用浏览器自带的实现。

ZIP 是 OOXML（`.docx` / `.xlsx` / `.pptx`）、EPUB、ODF、浏览器扩展的容器格式。「从包里取一个
文件」和「改包里的一个文件」是高频需求，为此引入一整个 ZIP 库的代价太大。这两件事需要的只是
中央目录加 DEFLATE，而 DEFLATE 现在已经作为 `DecompressionStream` 内建在每个浏览器里。

## API

| 函数                               | 说明                                                |
| ---------------------------------- | --------------------------------------------------- |
| `readZipEntries(bytes)`            | 解析中央目录得到 `ZipEntry[]`；不是 ZIP 时返回 `[]` |
| `readZipEntry(bytes, nameOrEntry)` | 解压单个条目；不存在或不支持时返回 `null`           |
| `zipHasEntry(bytes, name)`         | 是否存在同名条目                                    |
| `rewriteZip(bytes, options)`       | 替换条目、追加新条目后重建压缩包                    |
| `createZip(files)`                 | 从零构建压缩包，全部以 STORED 存储                  |
| `crc32(data)`                      | IEEE CRC32，即 ZIP 每个条目记录的校验和             |
| `inflateRaw(data)`                 | 解压裸 DEFLATE 数据（无 zlib/gzip 包头）            |

### `rewriteZip` 选项

| 选项        | 说明                                                                    | 默认值       |
| ----------- | ----------------------------------------------------------------------- | ------------ |
| `filter`    | 哪些条目需要解压并交给 `transform`                                      | 所有文件条目 |
| `transform` | `(data, entry) => Uint8Array \| string \| null`；返回 `null` 表示不修改 | —            |
| `inject`    | 要追加的全新条目：`{ name, data }[]`                                    | —            |

### `ZipEntry`

| 字段                                        | 说明                                   |
| ------------------------------------------- | -------------------------------------- |
| `name`                                      | 包内路径，如 `word/document.xml`       |
| `compression`                               | `ZIP_STORED`（0）或 `ZIP_DEFLATE`（8） |
| `crc`、`compressedSize`、`uncompressedSize` | 中央目录中记录的值                     |
| `modTime`、`modDate`                        | MS-DOS 打包时间戳，重写时保留          |
| `directory`                                 | 名字是否以 `/` 结尾                    |
| `dataStart`                                 | 压缩数据在源数组中的偏移               |

## 示例

### 从 `.docx` 里取出一个文件

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### 列出包内容

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### 批量修改 XML 并追加文件

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### 把内嵌媒体导出为 object URL

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

### 构建一个容器

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## 注意事项

1. **只读取 STORED 和 DEFLATE**。其它压缩方式会出现在 `readZipEntries` 的结果里，但
   `readZipEntry` 对它们返回 `null`，不做猜测。

2. **重写出来的条目不压缩**。被替换和被追加的条目以 STORED 写入，所以输出比输入大；未改动的
   条目原样保留其压缩数据。对「改完就交出去」的流程这是划算的取舍，对归档则不是。

3. **无改动时 `rewriteZip` 会原样返回入参数组**，包括 transform 返回了完全相同字节的情况。
   空转路径零成本，返回值可以直接用 `===` 判断。

4. **尺寸一律取自中央目录，绝不取自 local header**。流式写入器写出的包会置 general purpose
   bit 3，local header 里留零，真实数值追加在压缩数据之后的 data descriptor 里。相信 local
   header 是手写 ZIP 解析器在真实文件上翻车最常见的原因；`rewriteZip` 会同时重写 local
   header 并清掉该标志位，让严格的解析器也能正常读取产物。

5. **transform 抛错时会保留原条目**。transform 抛出异常，或者条目使用了不支持的压缩方式，都会原样
   拷贝原始内容：重写绝不能把看不懂的数据弄丢。

6. **不支持 ZIP64、加密、分卷**。超过 4 GiB 或条目数超过 65535 的包不在范围内。
   `readZipEntries` 对无法解析的输入返回 `[]` 而不是抛错，因为调用方通常是在检查用户给的文件。

7. **`inflateRaw` 依赖 `DecompressionStream`**，当前所有浏览器和 Node 18+ 都已内置该接口；缺失时会抛错。
