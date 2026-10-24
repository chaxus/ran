<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">웹 제품을 만들기 위한 디자인 방법, 컴포넌트, 도구. 개발자와 코딩 에이전트 모두를 위해.</p>
<p align="center"><a href="https://ran.chaxus.com/ko/">문서</a> · <a href="https://ran.chaxus.com/ko/src/ranui/">컴포넌트</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <b>한국어</b> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran은 각각 따로 쓸 수 있는 세 부분으로 이루어져 있습니다. **ranui**는 네이티브 커스텀 엘리먼트로 만든 UI 컴포넌트, **ranuts**는 타입이 있는 TypeScript 유틸리티, **Ran Design**은 사람과 코딩 에이전트가 어떤 기술 스택에서든 적용할 수 있는 레이아웃·인터랙션·검수 방법입니다. ranui의 모든 컴포넌트는 `<r-*>` 태그이므로 React, Vue, Svelte, 일반 HTML에서 똑같이 동작하며, AI 채팅 화면용 컴포넌트도 포함되어 있습니다.

## 설치

빌드 없이 쓰려면 CDN에서 불러온 뒤 태그를 작성하면 됩니다.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">저장</r-button>
```

번들러를 쓰는 경우:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui는 알파 단계라 새 버전에 호환되지 않는 변경이 들어갈 수 있습니다. 프로덕션에서는 정확한 버전을 고정하세요.

## 더 알아보기

패키지별 설명은 [ranui](./packages/ranui/README.ko.md)와 [ranuts](./packages/ranuts/README.ko.md)를, 라이브 예제는 [문서 사이트](https://ran.chaxus.com/ko/)를 참고하세요. 코딩 에이전트 플러그인과 기여 방법은 [영문 README](./README.md)에 있습니다.

## 라이선스

[MIT](./LICENSE)
