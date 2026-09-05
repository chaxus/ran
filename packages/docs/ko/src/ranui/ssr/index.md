---
description: 'ranui/ssr-stream 으로 ranui 컴포넌트를 선언적 shadow DOM 으로 서버 렌더링해, JavaScript 가 돌기 전에 첫 페인트를 올바르게 만듭니다.'
---

# 서버 렌더링

ranui 컴포넌트는 **선언적 shadow DOM**으로 직렬화됩니다. 그래서 서버가 진짜 마크업을 내보낼 수 있고,
JavaScript 가 한 줄도 돌기 전에 첫 페인트가 올바릅니다.

> **이럴 때 쓰세요.** 서버나 빌드 시점에 페이지를 렌더링하고 (SSG, Express/Hono/Workers 라우트,
> 메일 미리보기 작업 등) `<r-*>` 엘리먼트가 하이드레이션을 기다리는 빈 태그가 아니라 눈에 보이는
> 마크업으로 도착하기를 바랄 때.

## 빠른 시작

```js
import 'ranui'; // SSR 레지스트리를 채웁니다 — 이것을 먼저
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

등록된 `<r-*>` 태그는 각각 인스턴스로 만들어지고, 어트리뷰트가 적용되고, 자식이 재귀적으로
렌더링되며, 결과는 안에 `<template shadowrootmode="closed">`를 담아 나옵니다. 모르는 태그는 그대로
지나가므로, 평범한 HTML 페이지 전체에 돌려도 안전합니다.

### 스트리밍

`renderToStream`은 같은 렌더러를 비동기 제너레이터로 만든 것입니다. 뒤쪽 컴포넌트가 아직 렌더링되는
동안에도 정적 청크가 클라이언트에 도착합니다.

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### 컴포넌트 하나씩

`ranui/ssr`은 여러분이 직접 만든 인스턴스를 렌더링합니다. 문자열을 템플릿하는 대신 Node 에서 트리를
조립할 때 유용합니다.

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API 레퍼런스

| Export                     | 엔트리             | 시그니처                                   | 설명                                                  |
| -------------------------- | ------------------ | ------------------------------------------ | ----------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | HTML 문자열 안의 등록된 `<r-*>` 태그를 모두 펼칩니다. |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | 같은 일을 청크 단위로.                                |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | 컴포넌트 인스턴스 하나를 직렬화합니다.                |
| `RanElement`               | `ranui/ssr`        | 클래스                                     | 브라우저에서는 `HTMLElement`, Node 에서는 SSR 목.     |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | 마크업을 손으로 만들 때 쓰는 작은 도우미.             |

## 서버가 할 수 있는 일과 없는 일

**클라이언트는 다시 만듭니다. 재사용하지 않습니다.** ranui 는 **닫힌** 섀도 루트를 붙이는데, 이미
선언적 섀도 루트를 가진 엘리먼트에 `attachShadow`를 호출하면 모드가 닫힘일 때 _그 루트의 자식이
제거됩니다_. 그래서 서버가 렌더링한 트리는 첫 프레임을 그린 뒤 똑같은 내용의 클라이언트 트리로
교체됩니다. 여기서 두 가지가 따라옵니다.

- 얻는 것은 올바른 첫 페인트이지 하이드레이션 재사용이 아닙니다. 위의 이유로 닫힌 섀도 루트는
  클라이언트가 재사용할 수 없습니다. [코딩 가이드](/ko/src/ranui/coding-guides/#server-rendering)를
  보세요.
- **서버가 렌더링한 섀도 마크업에 상태를 넣고** 클라이언트가 읽어 가리라 기대하지 마세요. 상태는
  어트리뷰트로 넘기세요. 어트리뷰트는 살아남습니다.

**측정된 값은 서버에 없습니다.** `getBoundingClientRect`나 `offsetWidth`에 기대는 것은 모두 마운트
후 브라우저에서 결정됩니다. 컴포넌트의 초기 레이아웃이 CSS 에서 나오도록 쓰인 이유가 바로 이것입니다.

**오늘 기준으로 서버 렌더링되지 않는 엘리먼트가 넷 있습니다.** 모두 생성자에서 브라우저 API 에 손을
대기 때문입니다: `<r-content>`(`MutationObserver`), `<r-link>`(`document`), `<r-modal>`(SSR 목이
구현하지 않은 슬롯 메서드), `<r-radar>`(`ResizeObserver`). 이들은 평범한 태그로 지나갔다가
클라이언트에서 업그레이드됩니다. 나머지 모든 엘리먼트에는 렌더링이 멈추면 실패하는 테스트가 있어서,
이 목록이 조용히 늘어날 수는 없습니다.

## 테마와 번쩍임

`initTheme()`는 서버에서 아무 일도 하지 않습니다 (`document` / `localStorage` / `matchMedia` 접근이
모두 보호되어 있습니다). 그래서 테마는 클라이언트가 적용합니다. 잘못된 테마가 번쩍이는 것을 피하려면
서버 템플릿의 `<html>`에 `data-ran-theme`를 지정하고 (쿠키에서, 혹은 첫 페인트 전에 `localStorage`를
읽는 아주 작은 인라인 스크립트에서) 그 뒤를 [`initTheme`](/ko/src/ranui/theme/)에 넘기세요.

## 권장 사항

- **렌더링 전에 `ranui`(또는 개별 `ranui/<component>` 엔트리) 를 import 하세요.** 레지스트리는 import 의
  부수 효과로 채워집니다. 그것이 없으면 모든 태그가 펼쳐지지 않은 채 지나가고, 페이지는 조용히
  마크업을 잃습니다.
- **조각이 아니라 페이지를 렌더링하세요.** `renderHTMLToString`은 임의의 HTML 에 안전하므로 ranui
  부분만 따로 떼어 낼 필요가 없습니다.
- **스타일시트를 함께 보내세요.** DSD 마크업은 컴포넌트의 스타일을 담고 있지만, 페이지 수준 토큰은
  `ranui/style`에서 (글꼴은 `ranui/fonts`에서) 옵니다.
