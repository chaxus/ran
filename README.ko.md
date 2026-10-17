# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components, DOM 빌더, TypeScript 유틸리티를 한 워크스페이스에서 제공합니다.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> 사전 출시 단계입니다. API와 패키지 형식이 변경될 수 있습니다. 정확한 버전을 고정하고 업데이트 전에 마이그레이션 가이드를 확인하세요.

## 패키지

| 패키지                                        | 용도                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.ko.md)          | Shadow DOM, 테마 토큰, SSR 도구를 제공하는 프레임워크 독립 Web Components. |
| [ranuts](packages/ranuts/README.ko.md)        | 브라우저 API, 데이터 처리, 스트림, 2D 렌더링을 위한 TypeScript 유틸리티.   |
| [@alixex/ranview](packages/ranview/README.md) | 컴포넌트 라이브러리 없이 사용하는 DOM 빌더, 시그널, 정적 HTML 스냅샷.      |

## 빠른 시작

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

HTML에 사용자 정의 요소를 배치하세요:

```html
<r-button type="primary">Hello</r-button>
```

## 문서

- [ranui](https://ran.chaxus.com/ko/src/ranui/)
- [ranuts](https://ran.chaxus.com/ko/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [마이그레이션 가이드](https://ran.chaxus.com/ko/src/ranuts/migration/)

## 저장소 개발

Node 24+와 pnpm을 사용하고 저장소 루트에서 실행하세요:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

다른 개발 명령:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean`은 생성물만 삭제하고 소스, 설치된 의존성, 잠금 파일을 보존합니다.

## 다른 프로젝트와 학습 자료

문서 도구: [docs](packages/docs), [ranpress](packages/ranpress), [site](packages/site). [im](packages/im)은 실험용 채팅 앱입니다.

네이티브 예제: [C/C++](packages/cpro), [이미지 처리](packages/image-process), [Rust](packages/rust). 보존한 학습 자료: [Shader](docs/learning/visual/README.md), [Koa/Nginx](docs/learning/debug/README.md).

워크스페이스 상태와 CI 검사는 [packages/manifest.json](packages/manifest.json)에 정의되어 있습니다.

## AI / Claude Code

[유지 관리자와 Agent 참고](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## 기여

담당 범위와 검증 절차는 [AGENTS.md](AGENTS.md)를 확인하세요. 예제와 문서를 공개 내보내기와 일치시키고 변경에 맞는 검사를 실행하세요.

[릴리스 가이드](docs/RELEASING.md)

## 라이선스

[MIT](./LICENSE)
