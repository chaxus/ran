---
description: 'ranui로 만들 때의 엔지니어링 규칙. 진입점, 어트리뷰트·프로퍼티·이벤트 계약, 섀도 경계 너머의 스타일링, 상태의 주인, SSR, 테스트, 그리고 피해야 할 안티패턴.'
---

# 코딩 지침

ranui로 _만드는_ 법입니다. 컴포넌트의 계약이 무엇인지, Shadow DOM 경계가 익숙한 규칙을 어디서 바꿔 놓는지, 그리고 저지르기 전에 알아 둘 만한 실수는 무엇인지.

이것의 시각적인 반쪽은 [디자인 지침](/ko/src/ranui/design-guides/)이고, 토큰은 [디자인 시스템](/ko/src/ranui/design-system/)입니다.

> **이럴 때 씁니다.** ranui 컴포넌트를 애플리케이션에 이어 붙일 때. import를 고르고, 이벤트를 연결하고, 선택자가 닿지 않는 것에 스타일을 주고, 서버에서 렌더링하고, 테스트를 쓸 때.

## 원칙

1. **요소가 곧 API입니다.** 어트리뷰트, 프로퍼티, 이벤트, 슬롯, `::part()`가 계약의 전부입니다. 바깥에서 보이는 그 밖의 모든 것은 언젠가 움직일 구현 세부사항입니다.
2. **상태의 주인은 정확히 한 곳입니다.** 값을 앱이 쥐고 밀어 넣거나, 컴포넌트가 쥐고 바뀔 때 알려 주거나 둘 중 하나입니다. 양쪽으로 비추는 순간부터 값이 어긋나기 시작합니다.
3. **Shadow DOM 경계 너머의 스타일은 사용자 정의 속성, `::part()`, `sheet`, 슬롯으로 주세요.** 평범한 선택자는 경계를 넘지 못하고, 명시도를 아무리 올려도 마찬가지입니다.
4. **쓰는 것만 import하세요.** 컴포넌트마다 전용 진입점이 있습니다. 배럴은 편의일 뿐 필수가 아닙니다.
5. **플랫폼을 우선하세요.** 이것들은 커스텀 엘리먼트입니다. `addEventListener`, `setAttribute`, `hidden`이 명세대로 동작하고, 그 위에 얹는 프레임워크 추상은 선택입니다.

## 진입점

각 진입점은 이름이 말하는 것만 정확히 등록하고 그 이상은 하지 않습니다. 그래서 테마만 필요한 페이지가 컴포넌트 라이브러리의 값을 치를 일이 없습니다.

| import                          | 담긴 것                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `ranui`                         | 모든 컴포넌트(부수효과로 모든 `<r-*>` 요소를 등록합니다)         |
| `ranui/<component>`             | 컴포넌트 하나: `ranui/button`, `ranui/select`, `ranui/modal` …   |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme`과 토큰 덮어쓰기. 요소 없음 |
| `ranui/i18n`                    | 번역 엔진. 요소 없음                                             |
| `ranui/fonts`                   | 직접 호스팅하는 Geist Sans + Geist Mono(`@font-face` CSS만)      |
| `ranui/style`                   | 스타일시트. 설정이 자동으로 집어 가지 않을 때                    |
| `ranui/builder`                 | 컴포넌트들이 쓰인 체이닝 DOM 빌더                                |
| `ranui/ssr`, `ranui/ssr-stream` | 서버 렌더링                                                      |
| `ranui/testing`                 | 테스트에서 닫힌 섀도 루트에 손을 뻗기 위한 헬퍼                  |
| `ranui/typings`                 | 앰비언트 타입(JSX / TS 요소 타입 선언)                           |

```js
import 'ranui/button'; // 요소 하나
import 'ranui'; // 전부
```

**import는 부수효과를 위한 것입니다.** `import 'ranui/button'`은 `<r-button>`을 등록합니다. 내보낸 클래스가 필요한 경우는 드뭅니다. 예외는 서버 렌더링으로, 거기서는 직접 인스턴스를 만듭니다.

## 컴포넌트 계약

각 요소의 정확한 어트리뷰트, 프로퍼티, 이벤트(그리고 `detail`의 모양), 슬롯, part는 소스에서 [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)로 생성됩니다. 아래 규칙은 그 표가 말하지 _않는_ 것들입니다.

### 어트리뷰트는 문자열, 프로퍼티는 타입이 있습니다

HTML 어트리뷰트는 소문자이고 문자열 타입이며, 짝이 되는 프로퍼티는 카멜케이스이고 진짜 값을 받습니다. 같은 상태로 가는 두 갈래 입구입니다.

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // 프로퍼티 — 카멜케이스
select.setAttribute('showsearch', ''); // 어트리뷰트 — 소문자
```

- **불리언 어트리뷰트는 있느냐 없느냐로 정해집니다.** 네이티브 `<button>`의 `disabled`처럼, `disabled=""`도 `disabled="false"`도 모두 **비활성**입니다. 끄려면 어트리뷰트를 없애거나 프로퍼티에 `false`를 넣으세요.
- **풍부한 값은 프로퍼티로 갑니다.** 배열, 객체, `File`은 어트리뷰트에서 살아남지 못합니다. 예컨대 `r-attachments`의 `attachments`는 프로퍼티입니다.
- **마크업의 어트리뷰트 이름은 대소문자를 가리지 않습니다.** 위 HTML이 `showsearch`인데 프로퍼티는 `showSearch`인 이유가 그것입니다. JSX에서는 어트리뷰트 형태로 쓰세요.

### 리스너는 요소 자신에 붙이세요

ranui 컴포넌트는 `CustomEvent`를 내보내고, 실린 것은 언제나 `detail`에 있습니다.

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**이벤트가 버블링하는지는 컴포넌트마다의 결정이므로, 컨테이너가 아니라 요소에 연결하세요.** 폼과 오버레이의 핵심(`r-input`, `r-checkbox`, `r-select`, `r-modal`)은 일부러 버블링하지 않는 이벤트를 자기 자신에게서 내보냅니다. 여러분의 폼 안 select에서 나온 `change`가 폼이 낸 `change`처럼 보이면 곤란하기 때문입니다. 버블링하는 것들도 있습니다(그리고 `composed`라 섀도 경계도 넘습니다): `r-theme-switch`, `r-voice-button`, `r-attachments`, `r-conversation`, `r-tool-card`, `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-route`, `r-link`, `r-colorpicker`.

요소에 붙인 리스너는 두 경우 모두 동작합니다. 조상에서의 위임은 뒤쪽 무리에서만 동작하고, 앞쪽에서는 _조용히_ 실패합니다. 위임에 기대기 전에 소스나 [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)를 확인하세요.

**`before*` 이벤트는 취소할 수 있습니다.** `r-modal`은 움직이기 전에 `beforeopen` / `beforeclose`를 내보내고, `event.preventDefault()`가 그 전환에 거부권을 씁니다. `open` / `close` / `afteropen` / `afterclose` 짝은 이미 일어난 일을 알릴 뿐이고 취소할 수 없습니다.

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### 슬롯과 part

내용은 슬롯(기본과 이름 있는 것)으로 들어오고 여러분의 문서에 남습니다. 그래서 **여러분의** 페이지 CSS가 평소대로 스타일을 줍니다. 손이 닿지 않는 것은 컴포넌트가 안에서 만든 것뿐이고, `::part()`는 바로 그것을 위한 것입니다.

## 섀도 경계 너머의 스타일링 {#styling-across-the-shadow-boundary}

모든 ranui 컴포넌트는 **닫힌** 섀도 루트에 그려집니다. 페이지 CSS가 새어 들어가지 못하고, 선택자도 뚫고 가지 못합니다. 안으로 들어가는 길은 정확히 넷이며, 권하는 순서대로입니다.

| 수단                   | 쓰임새                                | 예시                                                  |
| ---------------------- | ------------------------------------- | ----------------------------------------------------- |
| **사용자 정의 속성**   | 컴포넌트가 토큰으로 노출한 모든 것    | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**         | 토큰이 못 다루는 구조적 손질          | `r-card::part(footer) { justify-content: flex-end; }` |
| **`sheet` 어트리뷰트** | 안으로 주입하는 프로그래밍적·동적 CSS | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **슬롯 내용**          | 어차피 여러분 소유인 마크업           | `<span slot="extra">…</span>`                         |

사용자 정의 속성이 가장 권할 만한 이유는 경계를 **상속으로 넘어가기** 때문입니다. `:root`에 두든, 감싸는 요소에 두든, 요소 자신에 두든 통하고, 그것은 테마가 쓰는 바로 그 토큰입니다. part와 `sheet`는 내부 구조에 묶이므로, 진짜로 구멍이 난 곳에만 쓰고 업그레이드마다 다시 볼 각오를 하세요.

어떤 명시도로도 통하지 않는 것: `r-select .some-inner-class { … }`, `!important`, 컴포넌트 안으로의 `querySelector`. 루트가 닫혔다는 말은, 여러분의 CSS에게도 스크립트에게도 테스트 러너의 로케이터에게도 `element.shadowRoot`가 `null`이라는 뜻입니다.

## 상태의 주인 되기

값마다 누가 주인인지 정하세요.

- **컴포넌트가 주인**(비제어): 초기값을 주고, 바뀌면 이벤트의 `detail`에서 값을 읽습니다. 가장 단순하며, 폼에서는 이것이 기본입니다.
- **여러분의 앱이 주인**(제어): 렌더할 때마다 프로퍼티를 지정하고, 이벤트는 여러분의 상태를 바꿔 달라는 **요청**으로 다루세요. 모델에 이미 일어난 변화로 다루지 마세요.

망가지는 것은 둘 다 하는 경우입니다. 컴포넌트 값의 사본을 상태에 두고, 이벤트마다 되써 넣고, 그 상태로 프로퍼티를 다시 지정하는 것. 빠른 입력에서는 둘이 어긋나고, 이벤트 도중의 쓰기는 루프가 될 수도 있습니다. 한 방향을 고르세요.

```js
// 제어: 상태가 진실의 출처이고, 이벤트는 요청입니다
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // 여기서 input.value를 다시 지정하지만, 주인은 하나입니다
});
```

## 프레임워크 연동 {#framework-integration}

이것들은 표준 커스텀 엘리먼트라 프레임워크 전용의 무언가는 필요 없습니다. 다만 세 가지 세부가 발목을 잡습니다.

- **React**(19 미만)는 모든 JSX prop을 **어트리뷰트**로 지정하므로, 풍부한 값은 닿지 않고 `onChange` 식의 prop도 커스텀 이벤트에 연결되지 않습니다. `ref`를 쓰고, 이펙트 안에서 프로퍼티를 지정하거나 `addEventListener`를 부르세요. React 19는 프로퍼티가 있으면 그쪽을 지정하지만 여전히 이름으로 커스텀 이벤트를 연결하지는 않으므로, 리스너용 `ref`는 남겨 두세요.
- **Vue**는 따로 알려 주지 않으면 모르는 태그를 컴포넌트로 컴파일합니다. 빌드 설정의 `compilerOptions.isCustomElement`에 `r-`를 더하세요. 그 뒤로는 `:prop`이 프로퍼티를, `@change`가 진짜 이벤트 리스너를 각각 올바르게 연결합니다.
- **Angular**에는 `CUSTOM_ELEMENTS_SCHEMA`가 필요합니다. Svelte와 Solid는 어트리뷰트와 `on:` / `on` 리스너를 그대로 통과시키므로 아무것도 필요 없습니다.

TypeScript를 쓴다면 JSX의 intrinsic element 선언을 위해 `import 'ranui/typings'`를 할 수 있습니다.

## 서버 렌더링 {#server-rendering}

ranui 컴포넌트는 **선언적 Shadow DOM**으로 직렬화되므로, 서버가 진짜 마크업을 내보낼 수 있고 JavaScript가 돌기 전에 첫 페인트가 이미 옳습니다.

```js
import 'ranui'; // SSR 레지스트리를 채웁니다
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)`은 같은 것을 비동기 제너레이터로 만든 것으로, 스트리밍 응답에 씁니다. `ranui/ssr`의 `renderToString(instance)`는 직접 만든 컴포넌트 인스턴스 하나를 직렬화합니다. 모르는 태그는 그대로 지나가므로 페이지 전체에 돌려도 안전합니다.

알아 둘 것이 둘 있습니다.

- **클라이언트는 다시 짓지, 재사용하지 않습니다.** 루트가 닫혀 있어서 브라우저는 서버가 그린 트리를 컴포넌트를 위해 재사용할 수 없습니다. 그래서 업그레이드 시 각 요소가 똑같은 것을 처음부터 짓습니다. 서버에서 첫 페인트는 얻지만 하이드레이션 재사용은 얻지 못하며, 클라이언트가 읽어 주기를 기대하며 서버가 그린 섀도 마크업에 상태를 넣어서는 안 됩니다.
- **측정된 값은 서버에 없습니다.** `getBoundingClientRect`나 `offsetWidth`에 기대는 것은 마운트 뒤 브라우저에서 결정됩니다.

## 성능

- 몇 개만 쓰는 페이지에서는 **컴포넌트 단위로 import**하세요. 배럴은 라이브러리 대부분을 쓰는 앱을 위한 것입니다.
- **변형은 지연 로드됩니다.** `r-icon`과 `r-loading`은 실행 중에 이름으로 변형을 가져오므로, 쓰지 않는 아이콘의 수에 따라 기본 비용이 늘어나지 않습니다.
- **프로퍼티를 지정하세요. 요소를 다시 만들지 마세요.** 커스텀 엘리먼트를 갈아 끼우면 생성자가 다시 돕니다. 프로퍼티 지정은 제자리에서 갱신합니다.
- **어트리뷰트 쓰기는 묶어서.** 쓸 때마다 `attributeChangedCallback`이 돌 수 있습니다. 가능한 곳에서는 삽입 전에 상태를 조립하세요.

## 테스트

**닫힌 섀도 루트는 테스트 로케이터도 막습니다.** Playwright의 `getByRole`, `getByText`, `querySelector`는 모두 경계에서 멈추고 _아무것도_ 찾지 못합니다. 그래서 그것들로 쓴 명세는 한 번도 본 적 없는 요소를 단언하면서 통과해 버립니다. 이 저장소에서도 누군가 알아채기 전까지 두 스위트가 그렇게 쓰여 있었습니다. `ranui/testing`이 이름 붙고 문서화된 이음매입니다.

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

그 밖에는 내부가 아니라 계약을 시험하세요. 어트리뷰트나 프로퍼티를 지정하고, 이벤트와 사용자가 느낄 수 있는 것에 대해 단언하세요. 내부 클래스 이름에 대한 단언은 리팩터링마다 깨지고, 컴포넌트가 동작하는지에 대해서는 아무것도 말해 주지 않습니다.

## 안티패턴

| 안티패턴                                                  | 왜 실패하는가                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `r-input` / `r-select`의 `change`를 컨테이너에서 위임하기 | 그 이벤트들은 버블링하지 않아 리스너가 절대 발동하지 않습니다. 요소에 연결하세요.    |
| `document.querySelector('r-select').shadowRoot`           | 닫힌 루트라 언제나 `null`입니다. 공개 API, part, `ranui/testing`을 쓰세요.           |
| `r-card .inner { … }`로 내부에 스타일 주기                | 선택자는 어떤 명시도로도 경계를 넘지 않습니다. 토큰이나 `::part()`를 쓰세요.         |
| 컴포넌트를 이기려고 `!important`                          | 이길 캐스케이드 충돌 자체가 없습니다. 규칙이 아예 적용되지 않습니다. 위와 같은 해법. |
| 컴포넌트의 값을 상태에 비추고 되돌리기                    | 값 하나에 주인이 둘. 어긋나고, 루프에 빠질 수도 있습니다.                            |
| 갱신하려고 요소를 다시 만들기                             | 생성자가 다시 돌고, 포커스와 내부 상태가 사라집니다. 프로퍼티를 지정하세요.          |
| 테마를 따르는 컴포넌트 옆에 색을 직접 박기                | 테마가 바뀌는 순간 망가집니다. 시맨틱 토큰을 쓰세요.                                 |
| 오버레이가 열릴 "혹시 몰라서" 래퍼에 무조건 `z-index`     | 정적인 내용까지 여러분의 틀 위로 영원히 올립니다. `:has()`로 범위를 좁히세요.        |
| 테스트에서 `shadowRoot`를 기다리기                        | 위와 같습니다. `ranui/testing`을 거치거나 관찰 가능한 동작으로 단언하세요.           |

## ranui에 기여하기

저장소에는 라이브러리 코드를 위한, 더 엄격한 자체 기준이 있습니다.

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md): 실행 가능한 디자인 기준. 아홉 가지 규칙을 `pnpm -F ranui verify:design`이 강제합니다.
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md): 라이브러리 코드를 위한 컴포넌트 구조, 상태의 주인, 테스트 규칙.
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md): 체이닝 DOM 빌더와 그 반응형 프리미티브.
- 패키지 최상위의 `CLAUDE.md`: npm 타르볼에도 함께 실리며, 사람도 코딩 에이전트도 가장 먼저 읽는 길잡이 파일.

풀 리퀘스트를 열기 전에: `pnpm -F ranui test:all`, `pnpm -F ranui verify:design`, 그리고 `pnpm verify:docs`(API와 토큰 표는 생성물이라 낡아 있으면 CI가 실패합니다).
