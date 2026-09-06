# ranuts

자주 쓰는 함수와 도구를 모은, 실험적인 유틸리티 라이브러리입니다

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

---

## ⚠️ 먼저 읽어 주세요

아직 초기 단계에 있는 **실험적인 유틸리티 라이브러리**입니다. 돌아가기는 하지만, 무엇보다 배우고 이것저것 해 보려고 만들었습니다.

**요점:**

- 🚧 **초기 단계**: 기능은 아직 만들고 다듬는 중입니다
- 🧪 **실험적**: API가 자주 바뀔 수 있습니다
- 📚 **배움이 먼저**: 자바스크립트와 타입스크립트 유틸리티를 익히는 데 중점을 두었습니다

## 설치

npm을 쓴다면:

```console
npm install ranuts@latest --save
```

## 문서

[자주 쓰는 함수와 도구 몇 가지](https://ran.chaxus.com/ko/src/ranuts/)

**AI 에이전트와 LLM에게:** 먼저 [CLAUDE.md](./CLAUDE.md)(전체 지형도. 진입점, 실행 환경의 제약, 관례)를 읽고, 이어서 [docs/API.md](./docs/API.md)(내보낸 모든 심벌을 시그니처와 설명과 함께 뽑아 둔 레퍼런스. 새로 만들려면 `npm run doc:api`)를 보세요.

아니면 `ran` 플러그인 마켓플레이스에서 이미 만들어 둔 **Claude Code 스킬**을 설치하세요. 가져오기 대응표와 `ranuts/utils` 목록, 사용 예, 관례를 어시스턴트에게 건네고, 패키지에 함께 실려 오는 API 레퍼런스로 이끌어 줍니다.

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

그다음부터는 Claude가 알아서 씁니다(`/ranuts:ranuts`로 직접 불러도 됩니다).

## 쓰는 법

필요한 것만 가져오세요. 고를 수 있는 것은 이렇습니다.

- `ranuts/utils` — DOM/BOM, 문자열, 객체, 숫자, 색, 시간, 저장소, 바이너리와 zip, 워커와 IndexedDB, 다국어 도우미
- `ranuts/node` — HTTP 서버, 라우터, 웹소켓, fs, 스트림, 미들웨어(**Node 전용**)
- `ranuts/visual` — 2D 렌더링 엔진(Canvas / WebGL / WebGPU, **브라우저 전용**)
- `ranuts/sw` — 캐시 전략과 프리캐시 규약의 서비스 워커 쪽 절반(**서비스 워커 전용**)
- `ranuts/vnode` — Snabbdom 식 가상 DOM
- `ranuts/stream` — Server-Sent Events 해석, 제공자를 가리지 않는 모델 스트림 응답 접기, 그리고 대화 기록이 더는 들어가지 않는 지점을 정하는 토큰 예산
- `ranuts/conversation` — 덧붙이기만 하는 이벤트 로그를 그릴 수 있는 대화 노드에 비춥니다
- `ranuts/i18n` — `utils`의 나머지 없이 i18n 엔진만

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

통째로 가져오기(통째로 가져오면 쓰지도 않는 모듈이 잔뜩 딸려 옵니다. 필요한 것만 가져오기를 권합니다)

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('window resized');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('window resized');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## 함께 만들기

배우러 오신 분도, 개발자도 모두 환영합니다. 실험적인 프로젝트라 개발이 더딜 수 있으니 너그럽게 봐주세요.

## 함께해 주신 분들

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 방문자 수

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## 그 밖에

[라이선스(MIT)](/LICENSE)
