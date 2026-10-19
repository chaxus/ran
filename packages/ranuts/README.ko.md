# ranuts

브라우저 API, 데이터 처리, 스트림, 2D 렌더링을 위한 TypeScript 유틸리티.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## 빠른 시작

```sh
npm install ranuts@0.5.0
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

실행 환경과 작업에 맞는 진입점을 선택하세요. 일부 함수는 브라우저 전역 객체가 필요하며 모든 함수가 서버에서 작동하는 것은 아닙니다.

| 패키지                | 용도                               |
| --------------------- | ---------------------------------- |
| `ranuts/utils`        | DOM/BOM, 색상, 바이너리, 저장소 등 |
| `ranuts/i18n`         | 독립 국제화 엔진                   |
| `ranuts/stream`       | SSE 파싱과 스트리밍 응답 상태      |
| `ranuts/conversation` | 대화 이벤트 로그 투영              |
| `ranuts/visual`       | 2D 렌더링; 브라우저                |
| `ranuts/vnode`        | 가상 DOM; 브라우저                 |
| `ranuts/sw`           | Service Worker 캐시 전략           |

## IIFE / CDN

일반 script 태그에서는 배포된 독립 IIFE를 번들러나 모듈 로더 없이 사용할 수 있습니다.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@0.5.0/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

유틸리티 IIFE는 `ranuts_utils`, 전체 `dist/iife/index.iife.js`는 `ranuts`를 노출합니다.

## 문서

- [ranuts](https://ran.chaxus.com/ko/src/ranuts/)
- [API](./docs/API.md)
- [유지 관리자와 Agent 참고](./CLAUDE.md)

## 기여

[유지 관리자와 Agent 참고](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## 라이선스

[MIT](./LICENSE)
