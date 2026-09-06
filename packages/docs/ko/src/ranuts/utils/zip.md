# zip

플랫폼이 이미 갖고 있는 DEFLATE만 써서, 의존성 없이 ZIP 압축 파일을 읽고 고칩니다.

ZIP은 OOXML(`.docx`·`.xlsx`·`.pptx`), EPUB, ODF, 브라우저 확장 프로그램의 밑바탕이 되는 컨테이너입니다. 「이 압축 파일에서 파일 하나만 꺼내기」와 「이 압축 파일 안의 파일 하나만 고쳐 쓰기」는 늘 나오는 일인데, 그것만 하자고 ZIP 라이브러리를 통째로 들이기에는 너무 무겁습니다. 이 두 가지에 필요한 것은 중앙 디렉터리와 DEFLATE뿐이고, DEFLATE는 이제 모든 브라우저에 `DecompressionStream`으로 들어 있습니다.

## API

| 함수                               | 설명                                                                |
| ---------------------------------- | ------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | 중앙 디렉터리를 해석해 `ZipEntry[]`로 돌려줍니다. ZIP이 아니면 `[]` |
| `readZipEntry(bytes, nameOrEntry)` | 항목 하나를 풉니다. 없거나 지원하지 않으면 `null`                   |
| `zipHasEntry(bytes, name)`         | 정확히 그 이름의 항목이 있는지                                      |
| `rewriteZip(bytes, options)`       | 항목을 바꾸거나 새로 붙여 압축 파일을 다시 만듭니다                 |
| `createZip(files)`                 | 압축 파일을 처음부터 만듭니다. 모든 항목은 STORED                   |
| `crc32(data)`                      | ZIP이 항목마다 저장하는 검사합인 IEEE CRC32                         |
| `inflateRaw(data)`                 | 날것의 DEFLATE 바이트를 풉니다(zlib·gzip 껍데기 없이)               |

### `rewriteZip` options

| 옵션        | 설명                                                                                    | 기본값    |
| ----------- | --------------------------------------------------------------------------------------- | --------- |
| `filter`    | 어떤 항목을 풀어서 `transform`에 넘길지                                                 | 모든 파일 |
| `transform` | `(data, entry) => Uint8Array \| string \| null`. `null`이면 그 항목은 건드리지 않습니다 | —         |
| `inject`    | 새로 덧붙일 항목: `{ name, data }[]`                                                    | —         |

### `ZipEntry`

| 필드                                        | 설명                                                    |
| ------------------------------------------- | ------------------------------------------------------- |
| `name`                                      | 압축 파일 안에서의 경로. 예를 들면 `word/document.xml`  |
| `compression`                               | `ZIP_STORED`(0) 또는 `ZIP_DEFLATE`(8)                   |
| `crc`, `compressedSize`, `uncompressedSize` | 중앙 디렉터리에 적힌 그대로                             |
| `modTime`, `modDate`                        | MS-DOS 방식으로 묶인 시각. 고쳐 쓸 때도 그대로 남습니다 |
| `directory`                                 | 이름이 `/`로 끝나는지                                   |
| `dataStart`                                 | 원본 안에서 압축된 바이트가 시작하는 위치               |

## 예시

### `.docx`에서 파일 하나 꺼내기

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### 안에 무엇이 들었는지 훑기

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### XML 파트를 모두 손보고 파일 하나 더하기

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### 안에 든 미디어를 객체 URL로 꺼내기

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

### 컨테이너 만들기

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## 참고

1. **STORED와 DEFLATE를 읽습니다.** 다른 압축 방식도 `readZipEntries`에는 나타나지만, `readZipEntry`는 어림짐작하는 대신 `null`을 돌려줍니다.

2. **고쳐 쓴 결과는 압축되지 않습니다.** 바꾼 항목과 새로 넣은 항목은 STORED로 기록되므로 결과물이 원본보다 커집니다. 손대지 않은 항목은 원래의 압축 바이트를 그대로 옮겨 담습니다. 고쳐서 곧장 넘기는 용도에는 알맞은 맞바꿈이고, 보관용으로는 그렇지 않습니다.

3. **바뀐 것이 없으면 `rewriteZip`은 원본 배열을 그대로 돌려줍니다.** 변환이 똑같은 바이트를 돌려준 경우도 마찬가지입니다. 이 경로는 비용이 들지 않고, 결과는 `===`로 견줄 수 있습니다.

4. **크기는 언제나 중앙 디렉터리에서 읽지, 로컬 헤더에서 읽지 않습니다.** 스트리밍 방식으로 쓴 압축 파일은 범용 플래그 3번 비트를 세우고 로컬 헤더에는 0을 남긴 뒤, 진짜 값을 압축 바이트 _뒤쪽_ 데이터 디스크립터에 채웁니다. 로컬 헤더를 믿는 것이야말로 직접 만든 ZIP 리더가 실제 파일 앞에서 무너지는 가장 흔한 이유입니다. `rewriteZip`은 로컬 헤더도 새로 쓰고 그 플래그를 지우므로, 결과물은 엄격한 파서로도 읽힙니다.

5. **변환이 실패해도 항목은 남습니다.** `transform`이 예외를 던지거나 지원하지 않는 방식으로 압축된 항목이면 원래 내용을 그대로 옮깁니다. 고쳐 쓰기가 해석하지 못한 데이터를 잃어서는 안 되기 때문입니다.

6. **ZIP64도, 암호화도, 여러 장 나눠 담기도 다루지 않습니다.** 4 GiB가 넘거나 항목이 65535개를 넘는 압축 파일은 대상 밖입니다. `readZipEntries`는 해석하지 못하는 것에 예외를 던지지 않고 `[]`를 돌려줍니다. 이걸 부르는 쪽은 대개 남이 건넨 파일을 살펴보는 중이기 때문입니다.

7. **`inflateRaw`에는 `DecompressionStream`이 필요합니다.** 요즘 브라우저에는 모두 있고 Node 18 이상에도 있습니다. 이 API가 없는 곳에서는 예외를 던집니다.
