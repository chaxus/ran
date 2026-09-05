---
description: '도구가 골라야 했던 마크업이 아니라, 선언된 의도 (generic, terminal, diff) 로부터 도구 호출과 그 결과를 그립니다.'
---

# Tool Card

도구 호출과 그 결과를 마크업이 아니라 **선언된 의도**로부터 그립니다.

> **이럴 때 쓰세요.** 에이전트나 작업이 실제로 무엇을 했는지 (셸 명령, 파일 편집, 조회) 보여 주면서,
> 도구에게는 _그것이 무엇인지_ 만 말하게 하고 겉모습은 표시하는 쪽이 정하게 하고 싶을 때.

HTML 을 돌려주는 도구는 UI 를 대신해 렌더러와 테마와 레이아웃을 골라 버린 것이고, 하필 UI 의 관심사가
있어서는 안 될 단 한 곳 (모델이 보는 결과) 에서 그렇게 합니다. 의도를 선언하면 둘이 갈라집니다. 같은
호출이 여기서는 터미널 블록으로, 압축된 대화 기록에서는 한 줄로, 에디터에서는 점프 대상으로 그려질 수
있고, 도구는 그중 무엇도 존재한다는 것을 모릅니다.

## 빠른 시작

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.createElement('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …호출이 돌아오면
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';

conversation.append(card);
```

## 카드 종류

### `generic`

기본값이자 대비책입니다. 제목, 보여 줄 만한 인자들의 키/값 표 (선택), 결과 내용 (선택) 으로 이뤄집니다.

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

호출 자체가 셸 명령인 경우입니다. `title`이 명령이고, `description`과 `cwd`가 출력 위에 그려집니다.
0 이 아닌 `exitCode`는 드러내고, 0 은 드러내지 않습니다.

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

호출이 파일을 만들거나 고치는 경우입니다. 각 항목은 양쪽 여백을 갖춘 unified 형식의 hunk 로 그려지며,
[ranuts/utils](../../ranuts/utils/)의 `diffLines`가 계산합니다. **`oldText`가 null 이면 파일을 새로
만든다는 뜻**입니다. 호출 시점의 뷰가 가진 정보가 그것뿐이기 때문입니다. 호출하는 쪽에는 읽을 이전
내용이 없으니까요.

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## 물리는 두 가지 규칙

이 뷰들은 살아 있는 호출에서 계산되고, **로그를 되감아 재생할 때 다시 계산됩니다.** 나머지는 전부
거기서 따라옵니다.

- **뷰는 호출 인자의 순수 함수입니다**(결과 뷰라면 결과까지 포함해서). I/O 도, 시계도, 세션 상태도
  없습니다. 그렇지 않으면 재생이 사용자가 원래 본 것과 어긋납니다.
- **모르는 카드는 낮춰 그릴 뿐 절대 예외를 던지지 않습니다.** 더 새로운 생산자가 붙인 카드 종류든,
  저장 중에 망가진 값이든, 가진 제목 그대로 `generic`으로 그려지고, 형태가 깨진 뷰는 빈 채로
  그려집니다. 표시가 재생을 망가뜨릴 수 있어서는 안 됩니다.

## 위치

호출에 붙은 `locations`는 `locationclick`을 발생시키는 버튼으로 그려지므로, 에디터가 따라갈 수
있습니다.

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입                                | 기본값      | 설명                                         |
| -------- | ----------------------------------- | ----------- | -------------------------------------------- |
| `call`   | `ToolCallView \| null`              | `null`      | 호출 인자에서 파생된, 진행 중인 뷰.          |
| `result` | `ToolResultView \| null`            | `null`      | 완료된 뷰. 진행 중인 것을 대체합니다.        |
| `status` | `'running' \| 'success' \| 'error'` | `'running'` | 반영되므로 스타일이 여기에 기댈 수 있습니다. |
| `open`   | `boolean`                           | `false`     | 본문이 펼쳐져 있는지 여부.                   |
| `sheet`  | `string`                            | `''`        | 엘리먼트의 섀도 DOM 에 주입할 CSS.           |

모르는 `status` 값은 다시 읽으면 `running`이 됩니다.

### 이벤트

| 이벤트          | Detail                       | 발생 시점                    |
| --------------- | ---------------------------- | ---------------------------- |
| `locationclick` | `{ location: ToolLocation }` | 파일 참조가 활성화되었을 때. |

### Part

`card`, `header`, `status`, `title`, `toggle`, `body`, `description`, `exit`, `input`,
`output`, `file`, `path`, `hunk`, `line`, `locations`, `location`.

diff 줄은 `data-kind`로 `context`, `added`, `removed` 가운데 하나를 갖습니다.

### 접근성

머리말은 `aria-expanded`를 가진 진짜 `<button type="button">`이라, 별도 배선 없이 키보드로 닿고
조작할 수 있습니다.

## 스타일

`<r-tool-card>`는 자체 **CSS 커스텀 프로퍼티 24 개**와 테마에서 읽어 오는 의미 토큰을 공개합니다.
상속이 닿는 곳이면 어디에나 지정하세요: `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Part: `body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#tool-card)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 함께 보기

- [Conversation](../conversation/): 도구 호출 뷰를 올릴 `mount` 대상으로 이것을 쓰기
- [ranuts/utils](../../ranuts/utils/): `diff` 카드를 그리는 `diffLines`
