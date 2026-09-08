---
description: '앱 안의 이동은 가로채고 외부 링크는 브라우저에 넘기는, 라우터를 아는 앵커.'
---

# Link

슬롯 콘텐츠를 `<a>`로 감싸고 앱 안의 이동을 가로채는, 라우터를 아는 앵커입니다.

> **이럴 때 쓰세요.** 내부 경로는 ranui 라우터로 보내고 외부 링크는 브라우저에 그대로 넘기는 앵커가 필요할 때. `<r-link>`가 앱 안의 이동을 가로채 `push`/`replace`를 대신 해 줍니다.

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-link href="/getting-started">시작하기</r-link>
</ran-demo>

```html
<r-link href="/getting-started">시작하기</r-link>
```

내부 `href`를 클릭하면 링크가 그 경로를 활성 ranui 라우터에 넘깁니다 (`push`, `replace` 어트리뷰트가 있으면 `replace`). 외부 링크 (`https://`, `//`, `mailto:`, `tel:`) 와 보조 키를 누른 클릭 (가운데 버튼, Ctrl/Cmd/Shift/Alt)은 평소대로 브라우저로 넘어갑니다. 등록된 라우터가 없으면 대신 버블링되고 composed 된 `ran-navigate` 이벤트를 디스패치합니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티  | 타입      | 기본값  | 설명                                                                               |
| --------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `href`    | `string`  | `''`    | 이동 대상. 내부 경로는 앱 안에서 처리되고 외부 URL 은 평소대로 이동합니다          |
| `replace` | `boolean` | `false` | 있으면 앱 안의 이동이 현재 히스토리 항목을 대체합니다 (읽기 전용, 어트리뷰트 반영) |
| `sheet`   | `string`  | `''`    | 링크의 섀도 DOM 에 주입할 CSS                                                      |

### 이동 대상 `href`

내부 경로는 앱 안에서 처리되고, 절대 URL 과 `mailto:` / `tel:` 링크는 평소대로 이동합니다.

<ran-demo>
  <r-link href="/docs">내부 링크</r-link>
  <r-link href="https://example.com">외부 링크</r-link>
</ran-demo>

```html
<r-link href="/docs">내부 링크</r-link> <r-link href="https://example.com">외부 링크</r-link>
```

### 히스토리 대체 `replace`

불리언 어트리뷰트입니다. 있으면 앱 안의 이동이 새 항목을 쌓지 않고 현재 히스토리 항목을 대체합니다 (`router.replace`).

<ran-demo>
  <r-link href="/settings" replace>항목 대체</r-link>
</ran-demo>

```html
<r-link href="/settings" replace>항목 대체</r-link>
```

### 외부 스타일 `sheet`

링크의 섀도 DOM 에 주입하는 CSS 로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다. 클릭 대상인 `<a>`가 섀도 루트 안에 있으므로, 호스트를 버튼이나 카드처럼 보이게 하려면 `sheet`로 박스 모델 (`display`, `padding`, `width`) 을 지정하세요.

<ran-demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">여백 있는 링크</r-link>
</ran-demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">여백 있는 링크</r-link>
```

## 슬롯

| 슬롯   | 설명                                                        |
| ------ | ----------------------------------------------------------- |
| (기본) | 링크 콘텐츠. 섀도의 `<a>` 안으로 투영됩니다 (텍스트나 노드) |

## 이벤트

| 이벤트         | detail                               | 발생 시점                                                                       |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace: boolean }` | 내부 링크를 클릭했는데 활성 ranui 라우터가 없을 때. 버블링되고 composed 입니다. |

```html
<r-link href="/docs">Docs</r-link>

<script>
  const link = document.createElement('r-link');
  link.href = '/docs';
  link.textContent = 'Docs';
  link.addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
  nav.append(link);
</script>
```

## 권장 사항

- **내부 이동**: 라우터가 앱 안에서 처리하도록 루트 기준 `href`(예: `/docs`) 를 쓰세요.
- **외부 링크**: 절대 URL 과 `mailto:` / `tel:`는 브라우저로 넘어갑니다. 추가 설정은 필요 없습니다.
- **히스토리 대체**: 뒤로 가기 항목을 만들지 말아야 할 링크 (리디렉션, 탭 전환) 에는 `replace`를 붙이세요.
- **활성 상태**: 호스트가 `:host([active]) a`에 스타일 (굵게 + 밑줄) 을 주므로, 현재 링크에는 `active` 어트리뷰트를 지정하세요.
- **버튼·카드처럼 보이게**: 표면 (배경, 테두리, 모서리) 은 호스트에 두고 `<a>`의 박스 모델 (`display`, `padding`, `width`) 은 `sheet`로 주입해 전체 영역이 클릭되게 하세요.
- **테마**: `<a>`는 전역 토큰 `--ran-color-link`, `--ran-color-primary`(포커스 링), `--ran-radius-sm`를 읽습니다. 컴포넌트 전용 `--ran-link-*` 변수는 없으니 그 토큰들을 덮어쓰세요.
