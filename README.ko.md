<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components, DOM 빌더와 TypeScript 유틸리티.</p>
<p align="center"><a href="https://ran.chaxus.com/ko/">문서</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <b>한국어</b> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## 패키지

| 패키지                                          | 용도                              |
| ----------------------------------------------- | --------------------------------- |
| [ranui](https://ran.chaxus.com/ko/src/ranui/)   | 프레임워크 독립 UI 컴포넌트.      |
| [ranuts](https://ran.chaxus.com/ko/src/ranuts/) | 브라우저 및 데이터 처리 유틸리티. |
| [@alixex/ranview](packages/ranview/README.md)   | DOM 빌더와 반응형 신호.           |

## 빠른 시작

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

```html
<r-button type="primary">Hello</r-button>
```

## 개발

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[기여](./AGENTS.md) · [MIT](./LICENSE)
