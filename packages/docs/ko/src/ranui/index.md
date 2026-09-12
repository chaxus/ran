---
description: 'ranui 는 네이티브 커스텀 엘리먼트 (<r-*>) 위에 만든 Web Components UI 라이브러리로, TypeScript 타입·라이트/다크 테마·Shadow DOM·SSR·PWA 를 지원합니다.'
---

# ranui

**네이티브 커스텀 엘리먼트** 위에 만든 UI 라이브러리입니다. 모든 컴포넌트가 `<r-*>` 태그라서
React, Vue, Svelte, Solid, Astro, 혹은 순수 HTML 파일에서 똑같이 동작합니다. 어댑터도 없고
맞춰야 할 프레임워크 버전도 없습니다. TypeScript 타입, 디자인 토큰 기반 라이트/다크 테마,
Shadow DOM 캡슐화, 서버 렌더링이 기본으로 들어 있습니다.


<PackageFacts package="ranui" />

- ranui 는 **alpha**입니다. 버전마다 호환성을 깨는 변경이 들어갑니다. 정확한 버전을 고정하고,
  업그레이드 전에 [변경 이력](/ko/src/ranui/changelog)을 읽으세요.

## 설치

```bash
npm install ranui
```

```html
<!-- 또는 CDN 에서, 빌드 단계 없이 -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## 사용법

import 하면 엘리먼트가 등록됩니다. 그다음부터는 태그를 쓰면 됩니다.

```js
import 'ranui'; // 모든 컴포넌트
import 'ranui/button'; // 또는 하나만
```

```html
<r-button type="primary">프로젝트 배포</r-button>
```

태그는 어느 프레임워크에서나 같습니다. 다른 것은 값을 넘기고 이벤트를 묶는 방식뿐이며, 그 부분은
[코딩 가이드](/ko/src/ranui/coding-guides/#framework-integration)에서 전부 다룹니다.

::: code-group

```html [HTML]
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

```jsx [React]
import 'ranui';

export const App = () => <r-button type="primary">Deploy</r-button>;
// 복잡한 값과 이벤트 리스너는 ref 를 통해 넘깁니다 — 코딩 가이드를 보세요.
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<!-- 빌드 설정의 compilerOptions.isCustomElement 에 `r-`를 추가하세요. -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## 진입점

각 진입점은 이름이 말하는 것만 정확히 등록합니다. 그래서 테마만 필요한 페이지가 컴포넌트
라이브러리 값을 치를 일이 없습니다.

| import                                                | 내용                                              |
| ----------------------------------------------------- | ------------------------------------------------- |
| `ranui`                                               | 모든 컴포넌트                                     |
| `ranui/<component>`                                   | 컴포넌트 하나: `ranui/button`, `ranui/select`, …  |
| [`ranui/theme`](/ko/src/ranui/theme/)                 | 라이트/다크 테마와 토큰 덮어쓰기. 엘리먼트는 없음 |
| [`ranui/i18n`](/ko/src/ranui/i18n/)                   | 번역 엔진. 엘리먼트는 없음                        |
| `ranui/fonts`                                         | 자체 호스팅한 Geist Sans + Geist Mono             |
| `ranui/style`                                         | 스타일시트. 설정이 자동으로 집어 가지 않을 때     |
| [`ranui/builder`](/ko/src/ranui/builder/)             | 세밀한 반응성을 갖춘 유창한 DOM 빌더              |
| [`ranui/ssr`](/ko/src/ranui/ssr/), `ranui/ssr-stream` | 서버 렌더링                                       |
| `ranui/testing`                                       | 테스트에서 닫힌 섀도 루트에 손을 뻗기 위한 도우미 |
| `ranui/typings`                                       | 앰비언트 JSX / TS 엘리먼트 타입                   |

## 컴포넌트

엘리먼트 40 개. 어트리뷰트, 프로퍼티, 이벤트, 슬롯, `::part()` 이름까지 전부
[엘리먼트 API 레퍼런스](/ko/src/ranui/api)에 있습니다.

**공통**: [Button](/ko/src/ranui/button/) · [Icon](/ko/src/ranui/icon/) ·
[Loading](/ko/src/ranui/loading/)

**데이터 입력**: [Input](/ko/src/ranui/input/) · [CheckBox](/ko/src/ranui/checkbox/) ·
[Select](/ko/src/ranui/select/) · [ColorPicker](/ko/src/ranui/colorpicker/) ·
[Attachments](/ko/src/ranui/attachments/) · [VoiceButton](/ko/src/ranui/voice-button/) ·
[Forms](/ko/src/ranui/form/)

**데이터 표시**: [Card](/ko/src/ranui/card/) · [Section](/ko/src/ranui/section/) ·
[Tabs](/ko/src/ranui/tab/) · [Image](/ko/src/ranui/image/) · [Progress](/ko/src/ranui/progress/) ·
[Radar](/ko/src/ranui/radar/) · [Player](/ko/src/ranui/player/) · [Preview](/ko/src/ranui/preview/) ·
[Glass](/ko/src/ranui/glass/) · [Scratch](/ko/src/ranui/scratch/) ·
[StateDot](/ko/src/ranui/state-dot/) · [DisclosureRow](/ko/src/ranui/disclosure-row/)

**콘텐츠 렌더링**: [Markdown](/ko/src/ranui/markdown/) · [Math](/ko/src/ranui/math/) ·
[Mermaid](/ko/src/ranui/mermaid/)

**AI 와 채팅**: [Conversation](/ko/src/ranui/conversation/) ·
[Reasoning](/ko/src/ranui/reasoning/) · [ToolCard](/ko/src/ranui/tool-card/) ·
[TokenMeter](/ko/src/ranui/token-meter/)

**오버레이와 피드백**: [Modal](/ko/src/ranui/modal/) · [Popover](/ko/src/ranui/popover/) ·
[Dropdown](/ko/src/ranui/dropdown/) · [Message](/ko/src/ranui/message/) ·
[Skeleton](/ko/src/ranui/skeleton/)

**내비게이션**: [Router](/ko/src/ranui/router/) · [Route](/ko/src/ranui/route/) ·
[Link](/ko/src/ranui/link/)

**기반**: [테마](/ko/src/ranui/theme/) · [ThemeSwitch](/ko/src/ranui/theme-switch/) ·
[i18n](/ko/src/ranui/i18n/)

엘리먼트 다섯 개는 다른 엘리먼트 안에서만 존재하기 때문에 자기 페이지가 없습니다: `<r-option>`
(Select), `<r-tabs>`(Tabs), `<r-img>`(Image), `<r-dropdown-item>`(Dropdown), `<r-content>`
(Popover). 나머지와 마찬가지로 API 레퍼런스에는 실려 있습니다.

### 라이브

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px">
  <r-button type="primary">Primary</r-button>
  <r-button type="warning">Warning</r-button>
  <r-button type="text">Text</r-button>
  <r-button>Default</r-button>
  <r-icon name="lock" size="28"></r-icon>
  <r-icon name="user" size="28"></r-icon>
  <r-icon name="loading" size="28" color="#1E90FF" spin></r-icon>
</div>

<div style="width:100%;margin-bottom:12px">
  <r-progress percent="0.7" type="drag"></r-progress>
</div>

<r-markdown copy content="**Streaming** Markdown with `code`, tables, mermaid and math."></r-markdown>

## 스타일

컴포넌트는 **닫힌** 섀도 루트에 그려집니다. 페이지 CSS 가 안으로 새지 않고, 선택자도 안까지 닿지
않습니다. 들어가는 길은 네 가지이며, 아래는 권장 순서입니다.

**1. 디자인 토큰 (CSS 커스텀 프로퍼티)**: 경계를 넘어 상속되므로 `:root`에 두든, 바깥 컨테이너에
두든, 엘리먼트 자체에 두든 모두 통합니다.

```html
<r-progress
  percent="0.7"
  type="drag"
  style="--ran-progress-track-background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f)"
></r-progress>
```

<div style="width:100%;margin:12px 0">
  <r-progress percent="0.7" type="drag" style="--ran-progress-track-background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>
</div>

**2. `::part()`** — 토큰이 닿지 않는 구조적 조정에 ·
**3. `sheet` 어트리뷰트** — 섀도 루트에 CSS 를 주입 ·
**4. 슬롯에 넣은 콘텐츠** — 여러분의 문서에 남아 페이지 CSS 를 그대로 받습니다.

토큰 이름은 [디자인 시스템](/ko/src/ranui/design-system/)에, 무엇을 고를지의 규칙은
[디자인 가이드](/ko/src/ranui/design-guides/)에, 작동 원리는
[코딩 가이드](/ko/src/ranui/coding-guides/#styling-across-the-shadow-boundary)에 있습니다.

## 이벤트

컴포넌트는 `CustomEvent`를 디스패치하고 데이터는 `detail`에 담습니다. 리스너는 엘리먼트에 다세요.
이벤트가 버블링되는지는 컴포넌트마다 다르며, API 레퍼런스가 모두 명시합니다.

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

이들은 평범한 DOM 엘리먼트라서 `onchange="…"` 어트리뷰트 형태와 `el.onchange = …` 프로퍼티 형태도
동작합니다. 다만 핸들러를 하나만 가질 수 있고 캡처 단계가 없으므로, 먼저 손이 가야 할 것은
`addEventListener`입니다.

## 다음에 볼 곳

| 하고 싶은 일                            | 읽을 문서                                     |
| --------------------------------------- | --------------------------------------------- |
| 엘리먼트의 정확한 API 찾기              | [엘리먼트 API](/ko/src/ranui/api)             |
| 어떤 토큰을 왜 써야 하는지 알기         | [디자인 시스템](/ko/src/ranui/design-system/) |
| 하나의 체계로 보이는 화면 만들기        | [디자인 가이드](/ko/src/ranui/design-guides/) |
| ranui 를 앱에 제대로 붙이기             | [코딩 가이드](/ko/src/ranui/coding-guides/)   |
| 라이트/다크를 넣거나 전체를 다시 꾸미기 | [테마](/ko/src/ranui/theme/)                  |
| 인터페이스 번역하기                     | [i18n](/ko/src/ranui/i18n/)                   |
| 서버에서 렌더링하기                     | [서버 렌더링](/ko/src/ranui/ssr/)             |
| 프레임워크 없이 반응형 뷰 만들기        | [빌더](/ko/src/ranui/builder/)                |
| 업그레이드 전에 무엇이 바뀌었는지 보기  | [변경 이력](/ko/src/ranui/changelog)          |

## 브라우저 지원

이 라이브러리는 모든 최신 브라우저에서 동작합니다. Custom Elements v1, Shadow DOM v1, CSS 커스텀
프로퍼티 위에 만들었습니다. **Internet Explorer 는 지원하지 않습니다.**

![](../../../assets/ranui/customElements.png)

## 기여자

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 더 읽을거리

이 라이브러리가 딛고 선 표준: [W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFC](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

곁에 두면 좋은 디자인 참고 자료: [Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
