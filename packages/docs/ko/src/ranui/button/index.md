---
description: 'ranui 의 Button(<r-button>) 은 여러 종류·크기와 로딩/비활성 상태를 갖추고 즉각적인 동작을 일으키는, 프레임워크에 얽매이지 않는 웹 컴포넌트입니다.'
---

# Button

여러 스타일과 상태로 즉각적인 동작을 일으키는 버튼 컴포넌트입니다.

> **이럴 때 쓰세요.** primary·contrast·warning·text 스타일과 비활성 상태, 아이콘까지 갖춘 클릭 가능한 동작 컨트롤이 필요할 때. 맨 `<button>`에 스타일을 입히는 대신 `<r-button>`을 쓰세요.

## 빠른 시작

### 기본 사용법

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입      | 기본값      | 설명                                                           |
| ---------- | --------- | ----------- | -------------------------------------------------------------- |
| `type`     | `string`  | `'default'` | 버튼 종류: `default`, `primary`, `contrast`, `warning`, `text` |
| `disabled` | `boolean` | `false`     | 버튼을 비활성화할지 여부                                       |
| `icon`     | `string`  | `''`        | 버튼 아이콘 이름                                               |
| `effect`   | `boolean` | `true`      | 클릭 물결 효과를 보일지 여부                                   |

### 버튼 종류 `type`

<Demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</Demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary`는 (Geist 디자인 언어에서 온) 무채색 동작입니다. 라이트 모드에서는 흰 바탕에 검정, 다크 모드에서는 검정 바탕에 흰색입니다. 여기서 파랑은 브랜드 의미를 담지 않고 링크와 포커스 링을 위해 남겨 둡니다. `--ran-color-primary*` 토큰 (`--ran-color-primary`, `-hover`, `-active`, 반전 잉크용 `--ran-color-primary-text`) 을 따릅니다. [테마와 토큰](/ko/src/ranui/theme/)을 보세요.

### 비활성 상태 `disabled`

<Demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</Demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### 아이콘 버튼 `icon`

> 💡 **팁**: 아이콘 위치를 세밀하게 잡아야 한다면 Icon 컴포넌트를 직접 쓰세요.

<Demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### 효과 제어 `effect`

클릭 물결은 기본으로 켜져 있습니다. 물결 없는 밋밋한 버튼을 원하면 `effect="false"`를 지정하세요. 아래 두 버튼은 이 어트리뷰트만 다르므로 각각 눌러 비교해 볼 수 있습니다. 물결은 포인터 장치를 위한 효과이며 뷰포트 너비 1024px 부터만 그려집니다.

<Demo>
  <r-button type="primary" icon="home">물결 있음 (기본)</r-button>
  <r-button type="primary" icon="home" effect="false">물결 없음</r-button>
</Demo>

```html
<r-button type="primary" icon="home">물결 있음 (기본)</r-button>
<r-button type="primary" icon="home" effect="false">물결 없음</r-button>
```

물결을 끄는 값은 문자열 `false` 하나뿐입니다. `effect="true"`도, 그 밖의 어떤 값도 켜진 상태로 둡니다. 스크립트에서는 불리언 프로퍼티로 지정하세요: `button.effect = false`.

## 이벤트

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## 스타일

`<r-button>`은 자체 **CSS 커스텀 프로퍼티 43 개**를 공개합니다: `--ran-btn-background`, `--ran-btn-color`, `--ran-btn-border-color`와 그 `hover`/`active` 변형, `warning` 변형 3 개, 그리고 테마에서 읽어 오는 의미 토큰들입니다.

```css
/* 버튼 하나, 또는 어떤 범위 안의 모든 버튼 */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

바꾸려는 것이 버튼 고유의 성질이 아니라면 **의미 토큰**을 쓰세요. `--ran-color-primary`를 덮어쓰면 여기뿐 아니라 어디서든 주요 동작의 모습이 바뀝니다.

Part: `button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#button)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 권장 사항

- **주요 동작**: `type="primary"`(무채색: 흰 바탕에 검정 / 검정 바탕에 흰색)
- **위험한 동작**: `type="warning"`
- **보조 동작**: `type="text"`
- **비활성 상태**: 동작을 쓸 수 없을 때 `disabled`
- **아이콘**: 알맞은 아이콘을 붙여 이해를 돕기
