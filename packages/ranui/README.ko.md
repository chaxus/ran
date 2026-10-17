# ranui

Shadow DOM, 테마 토큰, SSR 도구를 제공하는 프레임워크 독립 Web Components.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Alpha 단계입니다. API와 패키지 형식이 변경될 수 있습니다. 정확한 버전을 고정하고 업데이트 전에 마이그레이션 가이드를 확인하세요.

## 빠른 시작

```sh
npm install ranui
```

패키지 가져오기는 ESM을 사용합니다. 번들러에서는 컴포넌트별로 가져오고 앱 진입점에서 공통 스타일을 한 번 불러오세요.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

HTML에 사용자 정의 요소를 배치하세요:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

일반 script 태그에서는 독립 IIFE를 사용하세요. VERSION을 배포된 버전으로 바꾸면 번들러나 모듈 로더 없이 사용할 수 있습니다.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@VERSION/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

전체 IIFE는 `dist/index.iife.js`입니다. 한 페이지에서는 전체 번들 또는 컴포넌트 번들 중 하나를 선택하고 혼용하지 마세요.

## TypeScript

각 진입점에 타입이 포함됩니다. 선택적인 브라우저 전역 및 JSX 선언에는 타입 전용 가져오기를 사용하세요:

```ts
import type {} from 'ranui/typings';
```

TypeScript가 CSS 부수 효과 가져오기를 검사하면 앱의 `assets.d.ts`에 CSS 진입점을 선언하세요:

```ts
declare module 'ranui/style';
```

## SSR

이 서버 예제는 Node 24+를 사용합니다. 컴포넌트를 가져오면 SSR 직렬화기가 등록되며 결과에 Declarative Shadow DOM이 포함됩니다.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

테마 모드는 명시적으로 활성화합니다. 공개 토큰과 part로 스타일을 조정하고 자세한 규칙과 API는 아래 링크를 확인하세요.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## 문서

[ranui](https://ran.chaxus.com/ko/src/ranui/)

- [컴포넌트 API](./docs/COMPONENTS.md)
- [스타일과 토큰](./docs/style-tokens-public.md)
- [디자인과 상호작용](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [DOM 빌더와 시그널](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [유지 관리자와 Agent 참고](./CLAUDE.md)
- [마이그레이션 가이드](https://ran.chaxus.com/ko/src/ranuts/migration/)

## 기여

[유지 관리자와 Agent 참고](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## 라이선스

[MIT](./LICENSE)
