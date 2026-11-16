<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>AI 채팅과 제품 UI를 위한 웹 컴포넌트. <code>&lt;r-*&gt;</code> 태그 하나가 React, Vue, Svelte, 일반 HTML 파일에서 똑같이 동작합니다.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="npm의 ranui"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="npm의 ranuts"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT 라이선스"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/ko/">문서</a> · <a href="https://ran.chaxus.com/ko/ranui/">컴포넌트</a> · <a href="https://ran.chaxus.com/ko/agents/">에이전트</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <b>한국어</b> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## 숫자로 보기

|                                          |       ranui | Shoelace | Web Awesome | Material Web |
| ---------------------------------------- | ----------: | -------: | ----------: | -----------: |
| 버튼 하나, 모든 의존성과 테마 포함, gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 버튼 1,000개 생성 및 렌더링              |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui 단독                                                                         |                  |
| ---------------------------------------------------------------------------------- | ---------------: |
| 컨트롤 다섯 개로 된 폼(버튼, 입력란, 체크박스, 셀렉트, 모달), gzip                 |          41.3 kB |
| 요소 140개를 Declarative Shadow DOM으로 서버 렌더링, Node                          |           1.5 ms |
| 스타일이 적용된 첫 페인트, 서버 렌더링 vs 클라이언트 전용 (Slow 4G, 4× CPU)        | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/)의 Lighthouse 모바일 결과: 점수, LCP, CLS |     97, 2.5 s, 0 |

<details>
<summary>측정 방법</summary>

- **직접 비교:** ranui 0.5.5, Shoelace 2.20.1, Web Awesome 3.14.0(무료판), Material Web 2.5.0, 모두 npm에서 받았습니다. 크기는 버튼 진입점을 `esbuild --bundle --minify --format=esm`으로 번들하고, 각 라이브러리 문서가 요구하는 테마 스타일시트를 더해(Material Web은 필요 없음) `gzip -9`로 압축한 값입니다. Web Awesome과 Shoelace의 버튼은 아이콘과 스피너 컴포넌트를 함께 불러옵니다. 시간은 새 페이지 10개의 중앙값입니다. 버튼 1,000개를 만들어 추가하고, Lit 기반 컴포넌트가 렌더링을 마치도록 태스크 하나를 기다린 뒤 레이아웃을 읽습니다.
- **폼 크기:** `main` 빌드(`3f54e43`)에서 다섯 컴포넌트를 함께 가져와 esbuild로 번들하고, 브라우저가 받은 모든 파일을 셌습니다. 하나씩 따로 가져오면 합계가 74.4 kB가 되는데, 다섯 컴포넌트가 하나의 런타임을 공유하기 때문입니다.
- **서버 렌더링:** 폼 20개로 된 페이지에 `ranui/ssr-stream`의 `renderHTMLToString`을 실행한 15회 샘플의 중앙값입니다. 출력은 HTML 947 kB(gzip 125 kB)인데, 요소마다 자체 스타일을 담고 있기 때문입니다.
- **스타일이 적용된 첫 페인트:** 같은 폼 20개 페이지, gzip 사용, Chromium을 Slow 4G와 4× 느린 CPU로 제한한 10회 실행의 중앙값입니다. 서버 렌더링에서는 스타일이 적용된 폼이 첫 페인트에 나타나고, 클라이언트 전용에서는 컴포넌트가 로드된 뒤에 스타일이 적용됩니다. 업그레이드 시점에 서버 렌더링 페이지는 현재 CLS 0.125만큼 밀립니다.
- **Lighthouse:** Lighthouse 12.8 모바일 프리셋, 3회 실행의 중앙값입니다. 버튼 페이지도 같은 점수를 받습니다(97, LCP 2.3 s, CLS 0).

</details>

ran은 각각 따로 쓸 수 있는 세 부분으로 이루어져 있습니다. **ranui**는 네이티브 커스텀 엘리먼트로 만든 UI 컴포넌트, **ranuts**는 타입이 있는 TypeScript 유틸리티, **Ran Design**은 사람과 코딩 에이전트가 어떤 기술 스택에서든 적용할 수 있는 레이아웃·인터랙션·검수 방법입니다.

- **어떤 프레임워크에서도, 프레임워크 없이도 동작합니다.** 모든 컴포넌트는 `<r-*>` 태그라서 React, Vue, Svelte, 일반 HTML 파일에서 똑같이 씁니다. 어댑터나 프레임워크 런타임이 필요 없고 script 태그 하나면 충분합니다.
- **AI 채팅 화면을 위한 구성 요소.** 스트리밍 출력을 따라가는 대화 뷰, 작성 중인 텍스트도 렌더링하는 Markdown, 추론과 도구 호출 행, 첨부 파일, 음성 입력. 스트리밍 응답 해석은 `ranuts/stream`이 맡습니다.
- **테마, 서버 렌더링, 타입 포함.** 디자인 토큰 기반의 라이트·다크 테마, SSR 도구, TypeScript 타입 선언이 패키지에 들어 있습니다.
- **쓰는 것만 설치합니다.** 패키지마다, 컴포넌트마다 독립된 진입점이 있습니다.

## 패키지

| 패키지                                   | 용도                                                                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.ko.md)   | 커스텀 엘리먼트로 만드는 폼, 대화상자, 표, Markdown, 미디어 플레이어, AI 채팅 화면. 테마와 서버 렌더링 도구 포함. |
| [ranuts](./packages/ranuts/README.ko.md) | 문자열, 색상, 시간, 파일, 저장소, DOM을 위한 헬퍼와 SSE 파싱, 스트리밍 응답 상태 관리.                            |
| [Ran Design](./design/README.md)         | 구성, 인터랙션, 모션, 근거 기반 검수를 위한 방법. 에이전트 플러그인으로 배포되며 ranui 없이도 쓸 수 있습니다.     |

ranui의 빌더와 반응성 계층은 [@alixex/ranview](./packages/ranview/README.md)로 따로 배포됩니다.

## 빠른 시작

빌드 없이 쓰려면 CDN에서 컴포넌트를 불러오고 태그를 작성합니다.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">저장</r-button>
```

번들러를 쓴다면 패키지를 설치하고 사용할 컴포넌트를 가져옵니다.

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui는 알파 단계라 새 버전에 호환되지 않는 변경이 들어갈 수 있으니 프로덕션에서는 정확한 버전을 고정하세요. 각 요소의 라이브 예제, 이벤트, 스타일은 [컴포넌트 문서](https://ran.chaxus.com/ko/ranui/)에 있습니다.

## 코딩 에이전트와 함께 쓰기

**ran** 플러그인은 Claude Code와 Codex에 design, ranui, ranuts 세 가지 스킬을 추가합니다. MCP 서버나 계정이 필요 없습니다.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

새 세션에서 Claude Code는 `/ran:design`, `/ran:ranui`, `/ran:ranuts`를, Codex는 `$design`, `$ranui`, `$ranuts`를 사용합니다. 로컬 체크아웃에서 설치하는 방법은 [에이전트 가이드](https://ran.chaxus.com/ko/agents/)를, 스킬 본문은 [plugins/ran](./plugins/ran/)을 참고하세요.

## 기여하기

Node 24 이상과 `package.json`에 고정된 pnpm 버전을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

기여하기 전에 [AGENTS.md](./AGENTS.md)를, 패키지를 배포할 때는 [배포 가이드](./docs/RELEASING.md)를 읽어 주세요.

## 라이선스

[MIT](./LICENSE)
