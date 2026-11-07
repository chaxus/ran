---
description: 'ranuts는 트리 셰이킹이 되는 JavaScript/TypeScript 유틸리티 라이브러리입니다. DOM/BOM, 문자열·객체·숫자·색 헬퍼, 스토리지, 스트리밍, 2D 렌더링 엔진, 가상 DOM을 담고 있습니다.'
---

# ranuts

프런트엔드와 Node를 위한 유틸리티 라이브러리로, **서로 독립적이고 트리 셰이킹이 되는 진입점**으로 공개됩니다. 필요한 것을 담고 있는 하위 경로에서 import하면 나머지는 번들에 들어가지 않습니다. 전부 TypeScript로 쓰였고, 모든 export가 소스에서 문서화됩니다.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **소스**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## 진입점

| import                                                | 담긴 것                                           | 실행 환경         |
| ----------------------------------------------------- | ------------------------------------------------- | ----------------- |
| `ranuts`                                              | 최상위 배럴: utils와 visual을 아우르는 면         | 브라우저 + Node   |
| [`ranuts/utils`](/ko/ranuts/utils/)               | DOM/BOM, 문자열, 객체, 숫자, 색, 시간, 스토리지 … | 브라우저 + Node\* |
| [`ranuts/visual`](/ko/ranuts/visual/)             | 2D 렌더링 엔진(Canvas / WebGL / WebGPU)           | **브라우저 전용** |
| [`ranuts/i18n`](/ko/ranuts/i18n/)                 | 번역 엔진: 평평한 사전, 실행 중 전환              | 브라우저 + Node   |
| [`ranuts/sw`](/ko/ranuts/sw/)                     | 캐시 전략과 프리캐시 규약의 워커 쪽 절반          | **서비스 워커**   |
| [`ranuts/vnode`](/ko/ranuts/vnode/)               | Snabbdom 풍의 가상 DOM                            | 브라우저          |
| [`ranuts/stream`](/ko/ranuts/stream/)             | SSE 파싱, 모델 스트림 접기, 토큰 예산             | 브라우저 + Node   |
| [`ranuts/conversation`](/ko/ranuts/conversation/) | 이벤트 로그 → 그릴 수 있는 대화 노드              | 브라우저 + Node   |

## 무엇이 들어 있나

**함수형**: [debounce](/ko/ranuts/utils/debounce) · [throttle](/ko/ranuts/utils/throttle) ·
[once / singleFlight](/ko/ranuts/utils/memoize) ·
[QuestQueue](/ko/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/ko/ranuts/utils/with_timeout) ·
[compose](/ko/ranuts/utils/compose)

**데이터**: [cloneDeep](/ko/ranuts/utils/clone_deep) · [isEqual](/ko/ranuts/utils/is_equal) ·
[merge](/ko/ranuts/utils/merge) · [filterObj](/ko/ranuts/utils/filter_obj) ·
[숫자 서식과 파싱](/ko/ranuts/utils/parse_number) ·
[색 변환과 혼합](/ko/ranuts/utils/color)

**텍스트**: [truncate](/ko/ranuts/utils/truncate) ·
[detectLanguage](/ko/ranuts/utils/detect_language) ·
[resolveLocale](/ko/ranuts/utils/resolve_locale) ·
[segmentByRanges](/ko/ranuts/utils/segment) · [paginate](/ko/ranuts/utils/paginate) ·
[escapeHtml](/ko/ranuts/utils/escape_html)

**브라우저**: [스토리지](/ko/ranuts/utils/local_storage) ·
[IndexedDB](/ko/ranuts/utils/web_db) · [워커 클라이언트](/ko/ranuts/utils/worker_client) ·
[postMessage 브리지](/ko/ranuts/bridge/) · [프리페치](/ko/ranuts/utils/prefetch) ·
[기기 감지](/ko/ranuts/utils/current_device) ·
[성능](/ko/ranuts/utils/get_performance) · [ZIP](/ko/ranuts/utils/zip) ·
[오디오 녹음](/ko/ranuts/utils/audio_recorder) ·
[음성을 텍스트로](/ko/ranuts/utils/speech)

**AI와 채팅**: [stream](/ko/ranuts/stream/) · [conversation](/ko/ranuts/conversation/) ·
[i18n](/ko/ranuts/i18n/)

**렌더링**: [2D 엔진](/ko/ranuts/visual/) · [가상 DOM](/ko/ranuts/vnode/) ·
[canvas 헬퍼](/ko/ranuts/utils/canvas) · [tween](/ko/ranuts/utils/tween)

여기 있는 것은 일부입니다. [API 레퍼런스](/ko/ranuts/api)에는 **모든** export가 시그니처와 설명과 함께 실려 있고, 소스에서 생성되므로 어긋날 수 없습니다.

## 다음에 볼 곳

| 이런 걸 하고 싶다면                              | 이것을 읽으세요                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| 어떤 함수가 있는지, 시그니처는 무엇인지 찾아보기 | [API 레퍼런스](/ko/ranuts/api)                                              |
| 비슷한 두 유틸리티 중에서 고르기                 | [유틸리티 고르기](/ko/ranuts/choosing/)                                     |
| 갈래별로 훑어보기                                | [유틸리티 목록](/ko/ranuts/utils/)                                          |
| 스트리밍되는 모델 응답을 그리기                  | [stream](/ko/ranuts/stream/) → [conversation](/ko/ranuts/conversation/) |
| 그 위에 UI 만들기                                | [ranui](/ko/ranui/)                                                         |

두 패키지 모두 npm 타르볼 안에 `CLAUDE.md`를 함께 싣습니다. 코딩 에이전트를 위한 길잡이이며, 네트워크 없이 `node_modules`에서 바로 읽을 수 있습니다.
