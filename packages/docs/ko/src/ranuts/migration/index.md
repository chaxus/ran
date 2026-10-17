# Alpha 마이그레이션

이번 alpha 정리는 사용하지 않는 서버 래퍼와 오래된 호환 내보내기를 제거합니다. 업데이트 전에 호출 코드를 이전하세요. 순수 유틸리티, stream/conversation, i18n은 Node에서 계속 작동합니다.

| 제거된 API                                                                                    | 대체 방법                                                                             |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ranuts/node`: `readFile`, `writeFile`, `appendFile`, `readDir`, `queryFileInfo`, `watchFile` | `node:fs/promises`: `readFile`, `writeFile`, `appendFile`, `readdir`, `stat`, `watch` |
| `ranuts/node`: `readStream`, `writeStream`                                                    | `node:fs`: `createReadStream`, `createWriteStream`                                    |
| `Server`, `Router`, `body`, `staticMiddleware`, `connect`, `Context`                          | `node:http` / maintained HTTP framework                                               |
| `WSS`                                                                                         | WebSocket server library                                                              |
| `get`, `paresUrl`                                                                             | `fetch` + HTTP status/body checks; `new URL(url, base)`                               |
| `startTask`, `taskEnd`                                                                        | `performance.now()` (ms), `process.hrtime.bigint()` (ns)                              |
| `runCommand`, `prompt`, `colors`, `FMT`                                                       | `node:child_process`, `node:readline/promises`, `node:util.styleText`                 |
| `traverse`, `traverseSync`                                                                    | `node:fs/promises.readdir`, `node:fs.readdirSync` + recursion                         |
| `isColorSupported`                                                                            | `process.stdout.hasColors?.()`                                                        |
| `getIPAdress`                                                                                 | `node:os.networkInterfaces()`                                                         |
| `memoize`                                                                                     | `once` / `singleFlight`                                                               |
| `timeFormat`                                                                                  | `formatDuration`                                                                      |
| `timestampToTime`                                                                             | `formatDate` / `new Date(timestamp)`                                                  |
| `isClient`                                                                                    | `typeof window !== 'undefined'`                                                       |
| `md5`                                                                                         | `node:crypto.createHash('md5')` / dedicated MD5 library                               |

파일 API는 success 객체 대신 원래 값을 반환하고 실패하면 Error로 거부합니다. 텍스트에는 인코딩을 명시하세요.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Server, Router, 미들웨어, connect는 유지 관리되는 HTTP 프레임워크나 node:http로 이전하세요. WebSocket 서버에는 서버 구현이 필요하며 기본 WebSocket 클라이언트로 대체할 수 없습니다.

formatDate는 문자열을 반환합니다. Date 객체가 필요하면 new Date(timestamp)를 사용하세요. once는 인수별 결과가 아닌 첫 결과를 저장합니다.

MD5 호환성이 필요하면 전용 구현(Node에서는 node:crypto)을 사용하세요. SHA-256은 다른 다이제스트를 만들며 둘 다 비밀번호 저장 알고리즘이 아닙니다.

스크립트는 해시나 줄바꿈 정규화 없이 정확한 타입과 내용으로 중복을 제거합니다.

## 제거된 실험 워크스페이스

독립 `visual`과 `ranite` 패키지를 제거했습니다. 유지 관리되는 `ranuts/visual` 엔진과 기존 Vite 개발 스크립트를 사용하세요.

`visual` 사용 코드는 공개 API에 맞춰 수정해야 합니다. `await Application.create(options)`로 초기화하고 `Graphics` / `Container` 노드를 `app.stage`에 추가한 뒤 `app.render()` 또는 `app.start()`를 호출하세요. 이전 `Bar`, `Line`, `Pie`, 미완성 `Sankey`의 대체 API는 없습니다. 기존 기하 및 이벤트 내부 클래스도 공개되지 않으므로 import 이름만 바꾸면 안 됩니다.

## ESM 전용 패키지

ranuts, ranui 및 @alixex/ranview는 ESM 모듈만 배포합니다. require()와 CommonJS로 변환되는 가져오기를 네이티브 ESM으로 바꾸세요. 이전 로더와 테스트 도구는 ESM을 활성화하거나 동적 import()를 사용해야 합니다. CommonJS 빌드와 .d.cts 선언은 제공하지 않습니다. 일반 script 태그용 독립 IIFE는 유지됩니다.

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
