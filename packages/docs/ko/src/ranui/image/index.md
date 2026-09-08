---
description: 'ranui 의 Image(<r-image>) 는 원본을 불러오지 못하면 내장 대체 이미지로 바뀌는 이미지 컴포넌트입니다.'
---

# Image

이미지를 그리다가 원본을 불러오지 못하면 내장 대체 이미지로 바꿔 주는 컴포넌트입니다.

> **이럴 때 쓰세요.** 원본이 실패해도 자리표시자로 매끄럽게 물러나는 이미지가 필요할 때. `<r-img>`는 내장된 깨진 이미지 그래픽이나 직접 지정한 `fallback`으로 바꿔 줍니다.

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입     | 기본값                    | 설명                                                               |
| ---------- | -------- | ------------------------- | ------------------------------------------------------------------ |
| `src`      | `string` | `''`                      | 이미지 URL. 반응형이라 마운트 후 바꾸면 이미지를 다시 불러옵니다.  |
| `alt`      | `string` | `''`                      | 내부 `<img>`로 전달되는 대체 텍스트. 비우면 장식용으로 표시됩니다. |
| `fallback` | `string` | 내장 깨진 이미지 data URI | `src`를 불러오지 못했을 때 보여 줄 이미지.                         |
| `sheet`    | `string` | `''`                      | 컴포넌트의 섀도 DOM 에 주입할 CSS.                                 |

`src`, `alt`, `fallback`, `sheet`는 모두 관찰되며 반응형으로 갱신됩니다. 마운트된 엘리먼트에서 어느 것을 바꾸든 즉시 반영됩니다.

### 이미지 위치 `src`

<ran-demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### 대체 텍스트 `alt`

`alt`는 내부 `<img>`로 그대로 전달됩니다. 장식용 이미지라면 기본값대로 비워 두어 스크린 리더가 건너뛰게 하고, 의미가 있는 이미지에는 설명을 주세요.

<ran-demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="해 질 녘의 산정호수"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="해 질 녘의 산정호수"></r-img>
```

### 로드 실패 `fallback`

`src`를 불러오지 못하면 컴포넌트가 `fallback`으로 바꿉니다. `fallback`을 지정하지 않았다면 내장된 깨진 이미지 자리표시자가 쓰입니다. 아래에서는 `src`가 잘못된 URL 이라 대체 이미지가 보입니다.

<ran-demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</ran-demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(깨진 이미지 자리표시자)..."
></r-img>
```

### 외부 스타일 `sheet`

`sheet`는 컴포넌트의 섀도 DOM 에 CSS 를 그대로 주입합니다. 내부 `.ran-image` 컨테이너나 그 안의 `<img>`에 스타일을 줄 때 씁니다.

<ran-demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</ran-demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## 이벤트

없습니다. `r-img`는 커스텀 이벤트를 디스패치하지 않습니다.

## 권장 사항

- **`src`는 언제든 바꿔도 됩니다**: 반응형이라 마운트된 엘리먼트에서 갱신하면 이미지를 다시 불러옵니다. 새 URL 이 실패해도 대체 이미지는 그대로 동작합니다.
- **의미 있는 이미지에는 `alt`를**: 스크린 리더를 위해 내용을 설명하세요. `alt`를 비우는 것은 순수하게 장식용인 이미지뿐입니다.
- **내장 대체 이미지를 믿으세요**: 기본 깨진 이미지 자리표시자가 자동으로 쓰입니다. 브랜드나 맥락에 맞는 것을 보이고 싶을 때만 `fallback`을 지정하세요.
- **스타일은 `sheet`로**: 이미지가 섀도 DOM 안에 있으므로 테두리, 모서리, 크기는 `sheet` 어트리뷰트 (또는 컴포넌트 CSS 변수) 로 지정하세요.
