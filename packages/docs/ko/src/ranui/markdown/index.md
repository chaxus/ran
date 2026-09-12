---
description: '스트리밍에 강한 Markdown 렌더러 웹 컴포넌트. 절반만 도착한 markdown을 닫고, 바뀐 블록만 다시 그리며, 코드(shiki)·Mermaid 다이어그램·수식을 품습니다.'
---

# Markdown

Markdown을(**토큰 단위로 오는 AI 출력**까지) 프레임워크에 매이지 않는 웹 컴포넌트로 그립니다. `<r-markdown>`은 Vercel의 [Streamdown](https://streamdown.ai)을 본떴습니다. 텍스트가 흘러드는 동안 쓰다 만 `**bold`, `` `code ``, 링크, `$$` 수식을 즉석에서 닫고, 문서를 블록으로 쪼개 **바뀐 블록만** 다시 그립니다. 그래서 긴 답변이라도 토큰마다 처음부터 다시 파싱하지 않습니다.

` ```mermaid ` 펜스는 [`<r-mermaid>`](/ko/src/ranui/mermaid/)가 되고, 수식은 [`<r-math>`](/ko/src/ranui/math/)가 되며, 코드는 shiki로 하이라이트할 수 있습니다. 이 모두는 내용이 실제로 필요로 한 첫 순간에 지연 로드됩니다. 출력은 DOMPurify로 정화됩니다.

> **이럴 때 씁니다.** 온전히 통제하지 못하는 Markdown(채팅 답변, LLM 스트림, 사용자 댓글, 문서)을 보여 주면서, 파서·정화기·하이라이터를 직접 엮지 않고도 스트리밍, 코드·다이어그램·수식 지원, 안전한 HTML을 얻고 싶을 때.

## 빠른 시작

<ran-demo>
  <r-markdown copy highlight data-content="%23%20%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%0A%0A%2A%2A%EA%B5%B5%EA%B2%8C%2A%2A%2C%20%2A%EA%B8%B0%EC%9A%B8%EC%9E%84%2A%2C%20%5B%EB%A7%81%ED%81%AC%5D%28https%3A%2F%2Fgithub.com%2Fchaxus%2Fran%29%2C%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%60%EC%9D%B8%EB%9D%BC%EC%9D%B8%20%EC%BD%94%EB%93%9C%60.%0A%0A%60%60%60ts%0Aconst%20greet%20%3D%20%28name%3A%20string%29%3A%20string%20%3D%3E%20%60Hi%20%24%7Bname%7D%60%3B%0A%60%60%60%0A%0A%7C%20%EA%B8%B0%EB%8A%A5%20%7C%20%EC%A7%80%EC%9B%90%20%7C%0A%7C%20---%20%7C%20---%20%7C%0A%7C%20%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D%20%7C%20%E2%9C%85%20%7C%0A%7C%20Mermaid%20%2F%20%EC%88%98%EC%8B%9D%20%7C%20%E2%9C%85%20%7C"></r-markdown>
</ran-demo>

```html
<r-markdown copy highlight content="# 안녕하세요 ..."></r-markdown>
```

```js
import 'ranui'; // 또는 단독 진입점:
import 'ranui/markdown';
```

원본은 **`content` 프로퍼티**(권장. 어트리뷰트로 반영되지 않으므로 긴 답변을 스트리밍해도 DOM이 요동치지 않습니다), `content` 어트리뷰트, 또는 요소의 텍스트 내용에서 읽습니다.

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // 스트리밍 중 깜박이는 캐럿을 보여 줍니다
for await (const chunk of stream) {
  el.content += chunk; // 마지막 블록만 다시 그려집니다
}
el.removeAttribute('caret');
container.append(el);
```

## 스트리밍

`mode="streaming"`(기본값)은 텍스트를 먼저 [remend](https://www.npmjs.com/package/remend)에 통과시킵니다. Streamdown에서 뽑아낸, 미완성 markdown을 마무리해 주는 조각입니다. 덕분에 절반만 받은 `**bold`는 별표가 그대로 보이는 대신 굵게 그려지고, `[text](https://exa`는 URL이 닫힐 때까지 평범한 텍스트로 남으며, `- ` 하나가 앞 문단을 제목으로 바꿔 버리는 일도 없습니다. 이미 완성된 문서라면 `mode="static"`으로 이 과정을 건너뛰고 한 번에 그리세요.

<ran-demo>
  <r-markdown caret data-content="%EC%93%B0%EB%8B%A4%20%EB%A7%8C%20%2A%EA%B0%95%EC%A1%B0%2A%2C%20%60%EC%9D%B8%EB%9D%BC%EC%9D%B8%20%EC%BD%94%EB%93%9C%60%2C%20%EA%B7%B8%EB%A6%AC%EA%B3%A0%20%2A%2A%EC%95%84%EC%A7%81%20%EB%8F%84%EC%B0%A9%20%EC%A4%91%EC%9D%B8%20%EA%B5%B5%EC%9D%80%20%EA%B8%80%EC%94%A8"></r-markdown>
</ran-demo>

```html
<r-markdown caret content="쓰다 만 *강조*, `인라인 코드`, 그리고 **아직 도착 중인 굵은 글씨"></r-markdown>
```

- **캐럿**: `caret`은 깜박이는 `▋`를, `caret="circle"`은 `●`를 마지막 블록 뒤에 보여 줍니다. 코드 펜스가 아직 열려 있거나 마지막 블록이 표일 때는 알아서 숨습니다.
- **미완성 코드 펜스**는 닫는 펜스가 도착할 때까지 평범한 텍스트로 남습니다(하이라이트가 번쩍이지도, 다이어그램이 반쯤 그려지지도 않습니다). 그동안 컨테이너에는 `data-incomplete`가 붙습니다.

## 코드 블록

모든 코드 블록에는 언어 이름이 담긴 헤더가 붙고, 원한다면 복사·다운로드 버튼도 켤 수 있습니다. [shiki](https://shiki.style)로 문법을 강조하려면 `highlight`를 더하세요(지연 로드되며, 언어도 필요할 때 불러옵니다. 기본 테마는 `github-light` / `github-dark`로 페이지 테마를 따릅니다).

<ran-demo>
  <r-markdown copy download line-numbers highlight data-content="%60%60%60python%0Adef%20fib%28n%3A%20int%29%20-%3E%20int%3A%0A%20%20%20%20return%20n%20if%20n%20%3C%202%20else%20fib%28n%20-%201%29%20%2B%20fib%28n%20-%202%29%0A%0Aprint%28fib%2810%29%29%0A%60%60%60"></r-markdown>
</ran-demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- 테마 고르기: 라이트 다크 -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid와 수식

<ran-demo>
  <r-markdown data-content="%60%60%60mermaid%0Agraph%20LR%3B%20A%5BPrompt%5D%20--%3E%20B%5BModel%5D%3B%20B%20--%3E%20C%5BTokens%5D%3B%20C%20--%3E%20D%5Br-markdown%5D%0A%60%60%60%0A%0A%24%24%0AE%20%3D%20mc%5E2%0A%24%24%0A%0A%EC%9D%B8%EB%9D%BC%EC%9D%B8%20%5C%28e%5E%7Bi%5Cpi%7D%20%2B%201%20%3D%200%5C%29%20%EB%8A%94%20%EA%B8%80%EA%B3%BC%20%ED%95%A8%EA%BB%98%20%ED%9D%90%EB%A6%85%EB%8B%88%EB%8B%A4."></r-markdown>
</ran-demo>

- ` ```mermaid ` → `<r-mermaid>`(전체 화면 지원. `copy` / `download`는 그대로 전달됩니다).
- `$$…$$`, `\[…\]`, ` ```math ` → 블록 `<r-math>`. `\(…\)` → 인라인. 달러 하나짜리 `$…$`는 통화 표기와 헷갈리므로 `inline-math`로 **직접 켜야** 합니다.

## API 레퍼런스

### 어트리뷰트

| 어트리뷰트     | 타입                              | 기본값        | 설명                                                                                                                                   |
| -------------- | --------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                          | —             | Markdown 원본. `content` **프로퍼티**가 우선하며 어트리뷰트로 반영되지 않습니다. 둘 다 없으면 요소의 텍스트를 씁니다.                  |
| `mode`         | `'streaming' \| 'static'`         | `'streaming'` | `streaming`은 미완성 markdown을 닫고 블록 단위로 비교합니다. `static`은 전체 텍스트를 그대로 한 번에 그립니다.                         |
| `caret`        | 불리언 / `'circle'`               | 꺼짐          | 마지막 블록 뒤의 깜박이는 캐럿(`▋`, `circle`이면 `●`).                                                                                 |
| `copy`         | 불리언                            | 꺼짐          | 코드 블록의 복사 버튼(품고 있는 `<r-mermaid>`에도 전달됩니다).                                                                         |
| `download`     | 불리언                            | 꺼짐          | 코드 블록의 다운로드 버튼(언어에 따른 `code.<ext>`).                                                                                   |
| `line-numbers` | 불리언                            | 꺼짐          | 코드 블록의 줄 번호.                                                                                                                   |
| `highlight`    | 불리언 / `"light dark"` 테마 이름 | 꺼짐          | shiki 문법 강조. 값 없이 쓰면 `github-light github-dark`, 하나면 둘 다에, 둘이면 라이트 / 다크에 씁니다.                               |
| `inline-math`  | 불리언                            | 꺼짐          | `$…$`를 인라인 수식으로 다룹니다(`\(…\)`는 언제나 인라인입니다).                                                                       |
| `link-target`  | `string`                          | `'_blank'`    | 외부 링크의 `target`(`rel="noopener noreferrer"`도 붙습니다). `_self`면 링크를 건드리지 않습니다. 페이지 안 `#앵커`에는 붙지 않습니다. |
| `theme`        | `'auto' \| 'light' \| 'dark'`     | `'auto'`      | 하이라이트와 다이어그램의 테마. `auto`는 페이지를 따릅니다(`.dark`, `[data-ran-theme]`, 없으면 `prefers-color-scheme`).                |
| `sheet`        | `string`                          | —             | 섀도 루트에 주입할 추가 CSS.                                                                                                           |
| `label-*`      | `string`                          | 영어          | 컨트롤 레이블을 덮어씁니다: `label-copy`, `label-download`.                                                                            |

프로퍼티 별칭: `content`, `mode`, `caret`, `copyable`, `downloadable`, `lineNumbers`, `highlight`, `inlineMath`, `linkTarget`, `theme`, `sheet`.

## 이벤트

모든 이벤트는 버블링되며 섀도 경계를 넘습니다(`composed`).

| 이벤트     | `detail`                               | 언제 발생하는가                                   |
| ---------- | -------------------------------------- | ------------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | 한 번의 렌더에서 블록이 하나 이상 바뀌었을 때     |
| `copied`   | `{ kind: 'code', language, code }`     | 코드 블록이 복사되었을 때                         |
| `download` | `{ kind: 'code', language, filename }` | 코드 블록이 다운로드되었을 때                     |
| `error`    | `{ message: string }`                  | 파싱·렌더링이 실패했을 때(그 자리에도 표시됩니다) |

## CSS Part

| Part           | 설명                        |
| -------------- | --------------------------- |
| `markdown`     | 바깥 래퍼.                  |
| `body`         | 블록 컨테이너.              |
| `block`        | 그려진 각 블록.             |
| `code`         | 코드 블록 컨테이너.         |
| `code-header`  | 코드 블록의 언어·동작 막대. |
| `code-lang`    | 언어 레이블.                |
| `code-actions` | 동작 버튼 묶음.             |
| `button`       | 복사·다운로드 각 버튼.      |
| `table`        | 가로로 스크롤되는 표 래퍼.  |
| `error`        | 오류 상자(렌더 실패 시).    |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## CSS 변수

요소에서 덮어쓸 수 있습니다(각각 시맨틱 토큰으로, 다시 리터럴 값으로 물러납니다): `--ran-markdown-color`, `--ran-markdown-font-size`, `--ran-markdown-line-height`, `--ran-markdown-gap`, `--ran-markdown-heading-color`, `--ran-markdown-link-color`, `--ran-markdown-inline-code-bg`, `--ran-markdown-code-bg`, `--ran-markdown-code-border`, `--ran-markdown-code-radius`, `--ran-markdown-code-font-size`, `--ran-markdown-mono-font`, `--ran-markdown-blockquote-border`, `--ran-markdown-table-border`, `--ran-markdown-table-header-bg`, `--ran-markdown-caret`, `--ran-markdown-caret-color`, `--ran-markdown-button-color`, `--ran-markdown-error-color`.

## 참고

- **지연 로드**: 파서 청크(marked + DOMPurify + remend)는 첫 렌더 때 로드되고, shiki·mermaid·Temml은 내용이 실제로 쓸 때만 각각 로드됩니다. markdown을 전혀 그리지 않는 앱은 비용을 치르지 않습니다.
- **정화됨**: markdown 안의 날 HTML은 DOMPurify를 거칩니다. 스크립트, 이벤트 핸들러, `javascript:` URL, `<style>`, 폼, iframe이 제거됩니다. 할 일 목록의 체크박스는 살아남습니다.
- **블록 비교**는 블록을 위치로 식별하므로, 손대지 않은 블록 안의 DOM 상태(전체 화면으로 열린 다이어그램, 스크롤해 둔 표)는 스트리밍 갱신에도 살아남습니다. 문서는 한 번만 어휘 분석되고 각 블록은 자기 토큰으로 그려지므로, 링크 참조 정의도 블록을 넘어 해결됩니다(`[text][id]`가 한 블록에, `[id]: url`이 다른 블록에 있어도 됩니다).
- **GFM 각주**(`[^1]`)는 **지원하지 않습니다**. marked에 각주 토크나이저가 없어서 표시가 글자 그대로 그려집니다.
- **shiki는 여러분의 설치본에서 해결됩니다.** ES 빌드는 `import('shiki')`를 그대로 두므로, 번들러가 코드를 쪼개고 코드 펜스가 실제로 쓰는 문법만 내려받습니다. shiki는 ranui의 평범한 의존성이라 `npm i ranui`만으로 이미 들어옵니다. 따로 더할 것은 없습니다.
- **단독 IIFE**: `dist/iife/markdown.iife.js`에는 해석기가 없어서, 대신 mermaid, Temml, 그리고 shiki의 _web_ 언어 번들(흔한 50여 개 언어)을 인라인합니다. 언어를 두루 지원하고 다운로드도 줄이려면 ES 진입점(`ranui/markdown`)을 쓰세요.
