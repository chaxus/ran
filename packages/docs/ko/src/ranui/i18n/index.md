---
description: '프레임워크에 매이지 않는 국제화 엔진. 작은 코어와 선택적인 전역 싱글턴만 있고, DOM과 얽히지 않습니다.'
---

# i18n

프레임워크에 매이지 않는 국제화 엔진입니다. [라우터](/ko/src/ranui/router/)와 같은 설계를 따릅니다. 작은 코어(`I18nCore`)에 선택적인 전역 싱글턴(`createI18n` / `useI18n`)이 붙고, DOM과는 얽히지 않으므로 UI에 붙이는 방식은 원하는 대로 정하면 됩니다.

> **이럴 때 씁니다.** ranui 앱에서 실행 중에 로케일을 바꿔야 할 때. `createI18n`을 한 번 부르고, 문자열은 `useI18n().t(key, params)`로 읽고, 언어는 `setLocale`로 바꿉니다. 프레임워크에도 DOM에도 기대지 않으므로 평범한 JS에서도, 어떤 프레임워크에서도, SSR에서도 동작합니다.

이 엔진은 **`ranui/i18n`**이라는 자체 진입점으로 제공됩니다. import해도 커스텀 엘리먼트는 **하나도** 등록되지 않으므로, 번역만 필요한 페이지가 컴포넌트 라이브러리를 끌어오는 일이 없습니다. 같은 export는 최상위 `ranui` 배럴에서도 쓸 수 있습니다.

## 빠른 시작

시작할 때 i18n 싱글턴을 한 번 만들어 두면, 어디서든 번역할 수 있습니다.

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // 각 로케일은 평평한 사전입니다. 키는 중첩 없이 그대로 조회됩니다.
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // 현재 로케일에 키가 없을 때 씁니다
  persist: true, // localStorage의 'ran-locale' 키에 선택을 기억합니다
  detectNavigator: true, // 브라우저의 언어 설정에서 초기 로케일을 정합니다
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // 저장하고 구독자에게 알립니다
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)`는 `messages[activeLocale][key]`를, 다음으로 `messages[fallbackLocale][key]`를 찾고, 둘 다 없으면 `key` 자체를 돌려줍니다. 문자열 안의 `{param}`은 두 번째 인자에서 채워집니다. 조회가 평평한 맵 접근이므로 **키는 문자 그대로의 문자열**입니다. `'hero.title'`을 키 하나로 쓰고, 중첩된 `{ hero: { title } }` 객체로 만들지 마세요.

## 매개변수(보간)

네, 메시지는 실행 중 매개변수를 받습니다. 문자열에 `{name}` 꼴의 자리를 두고 값을 `t()`의 두 번째 인자로 넘기면, 각 `{param}`이 대응하는 값으로 바뀝니다.

```js
createI18n({
  messages: {
    en: {
      'cart.summary': '{count} items · ${total}',
      greeting: 'Welcome back, {user}!',
    },
    zh: {
      'cart.summary': '{count} 件商品 · ¥{total}',
      greeting: '欢迎回来，{user}！',
    },
  },
});

const i18n = useI18n();
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 items · $59.9"
i18n.t('greeting', { user: 'Ada' }); // → "Welcome back, Ada!"
```

세부 사항:

- 자리 표기는 `{word}`입니다(글자, 숫자, `_`). 값은 문자열이든 숫자든 되고, 숫자는 문자열로 바뀝니다.
- 대응하는 키가 없는 자리는 **그대로 남습니다**(`{oops}`가 출력에 문자 그대로 남습니다). 조용히 빈칸이 되는 대신, 빠진 매개변수가 눈에 띕니다.
- 보간은 로케일 대체 뒤에 일어나므로, 실제로 어느 로케일이 문자열을 해결했든 같은 매개변수가 통합니다.
- 복수형이나 숫자·날짜 형식은 들어 있지 않습니다. `Intl.NumberFormat` / `Intl.PluralRules`로 만들어서, 서식이 끝난 문자열을 매개변수로 넘기세요.

## 중괄호를 글자 그대로 쓰기

혼자 있는 `{`나 `}`, 또는 `{ color: red }`처럼 공백이 낀 묶음은 **자리가 아니며** 그대로 지나갑니다. 그래서 메시지 안의 CSS, JSON, 코드 조각은 기본적으로 안전합니다. 애매한 것은 그대로 보여 주고 싶은 `{word}` 하나뿐입니다. 이를 이스케이프하려면 **중괄호를 두 번 겹치세요**(Rust의 `format!`, Python의 `str.format`, .NET의 `String.Format`과 같은 관례입니다).

::: v-pre

```js
const i18n = useI18n(); // 아래 메시지는 이미 등록되었다고 봅니다

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"  (보간되지 않음)
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"  (값이 중괄호에 싸임)
```

| 메시지에 쓴 것 | 출력                                |
| -------------- | ----------------------------------- |
| `{{`           | `{`                                 |
| `}}`           | `}`                                 |
| `{name}`       | `name` 매개변수, 없으면 `{name}`    |
| `{ name }`     | `{ name }`(공백이 있어 자리가 아님) |
| `{`            | `{`(혼자 있는 중괄호)               |

이스케이프는 보간과 같은 왼쪽에서 오른쪽 한 번의 처리에서 적용되며, 매개변수를 넘기든 말든 동작합니다. 즉 `{{`와 `}}`는 언제나 중괄호 그 자체를 뜻합니다.

> 겹쳐 쓰는 방식은 Rust의 `format!`, Python의 `str.format`, .NET의 `String.Format`과 같은 관례라, 새 이스케이프 문자를 배울 필요가 없습니다. 진짜 복수·성·수의 문법이 필요하다면 `Intl.*`로 서식을 만들고 그 결과를 매개변수로 넘기세요.

:::

## 로케일 변경에 반응하기

`onChange`는 `setLocale`이 있을 때마다 발생합니다. 이미 그려 둔 문자열을 다시 그리는 데 쓰세요.

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // t() 호출을 다시 실행
});

// 나중에, 뷰가 사라질 때
unsubscribe();
```

## 메시지 나중에 추가하기

어떤 로케일의 사전을 필요할 때 불러와(언어별 코드 분할 등) 합쳐 넣을 수 있습니다.

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // 기존 'fr' 사전에 병합됩니다
i18n.setLocale('fr');
```

## 컴포넌트 문구 지역화하기

컴포넌트는 이 엔진에서 **직접 읽지 않습니다**. 일부러 그렇게 했습니다. 전역 싱글턴에서 곧바로 읽는 컴포넌트는 모든 사용자를 하나의 인스턴스와 하나의 키 이름 규칙에 묶고, 버튼 하나만 import한 페이지까지 번역 계층을 끌고 들어옵니다. 대신 **사용자에게 보이는 모든 문자열은 입력**입니다. 어트리뷰트, 프로퍼티, 옵션, 또는 슬롯 내용으로 들어옵니다. 그러니 ranui를 지역화한다는 것은, 이미 문자열이 들어가는 자리에 `t()`의 결과를 넘기는 일입니다.

```js
const i18n = useI18n(); // 아래 메시지는 이미 등록되었다고 봅니다

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

대부분의 컴포넌트는 자기 문구를 아예 갖고 있지 않습니다. 문구는 여러분이 이미 쓰는 슬롯과 어트리뷰트로 들어옵니다. 다른 데서 올 곳이 없는 문자열에 한해, 몇몇이 영어 기본값을 지니고 있는데 대개 접근성 이름입니다.

| 컴포넌트                                          | 내장 영어 문구                                                                                                        | 덮어쓰는 방법                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | 제목 `Confirm`, 버튼 `OK` / `Cancel`                                                                                  | `title`, `okText`, `cancelText` 옵션                 |
| `Modal.info` / `.success` / `.warning` / `.error` | 제목 `Info` / `Success` / `Warning` / `Error`                                                                         | `title` 옵션                                         |
| `<r-theme-switch>`                                | aria-label `Theme`, `System theme`, `Light theme`, `Dark theme`                                                       | `label`, `label-system`, `label-light`, `label-dark` |
| `<r-voice-button>`                                | aria-label `Start voice input` / `Stop voice input`, 힌트 `Release to keep · slide up to cancel`, `Release to cancel` | `label`, `active-label`, `hold-hint`, `cancel-hint`  |
| `<r-reasoning>`                                   | 헤더 레이블 `Reasoning`                                                                                               | `label`                                              |
| `<r-token-meter>`                                 | 레이블 `Context`                                                                                                      | `label`                                              |
| `<r-colorpicker>`                                 | aria-label `Choose color`, `Hue`, `Alpha opacity`                                                                     | `label`, `hue-label`, `alpha-label`                  |

실용적인 방법은 로케일이 바뀔 때마다 한곳에서 이들을 다시 적용하는 것입니다. 그러면 시작할 때와 바꾼 뒤에 같은 코드가 돌아갑니다.

```js
const i18n = useI18n();

const applyLabels = () => {
  document.querySelectorAll('r-voice-button').forEach((el) => {
    el.setAttribute('label', i18n.t('voice.start'));
    el.setAttribute('active-label', i18n.t('voice.stop'));
  });
};

applyLabels();
i18n.onChange(applyLabels);
```

`document.documentElement.lang`도 함께 맞춰 두는 것을 잊지 마세요. 브라우저와 스크린 리더, `:lang()` 선택자가 보는 것이 바로 그것입니다.

## API

`createI18n(config)`는 전역 싱글턴을 만들어 등록합니다(한 번만 부르세요). `useI18n()`은 그것을 돌려주며, `createI18n`이 아직 실행되지 않았다면 `null`을 돌려줍니다.

### `I18nConfig`

| 필드              | 타입             | 기본값         | 설명                                                                                                                                                                                         |
| ----------------- | ---------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `locale → { key → string }`. 각 사전은 평평합니다.                                                                                                                                           |
| `locale`          | `string`         | 대체 로케일    | 초기 로케일(저장된 선택이 있으면 그쪽이 우선합니다).                                                                                                                                         |
| `fallbackLocale`  | `string`         | `'en'`         | 현재 로케일에 키가 없을 때 찾아보는 로케일.                                                                                                                                                  |
| `persist`         | `boolean`        | `false`        | 현재 로케일을 `localStorage`에 저장합니다.                                                                                                                                                   |
| `storageKey`      | `string`         | `'ran-locale'` | `persist`가 켜졌을 때 쓰는 localStorage 키.                                                                                                                                                  |
| `detectNavigator` | `boolean`        | `false`        | 초기 로케일을 브라우저의 언어 설정에서 정합니다. 순서가 있는 `navigator.languages` 목록 전체를 읽으므로, 첫 번째 선호 언어의 사전이 없는 독자도 대체 언어 대신 두 번째 선호 언어를 받습니다. |

### `I18nCore` 메서드

| 메서드                      | 반환값        | 설명                                                         |
| --------------------------- | ------------- | ------------------------------------------------------------ |
| `t(key, params?)`           | `string`      | 번역합니다. 대체 로케일로, 다시 키 자체로 물러납니다.        |
| `setLocale(locale)`         | `void`        | 로케일을 바꾸고, (켜져 있다면) 저장하며 구독자에게 알립니다. |
| `getLocale()`               | `string`      | 현재 로케일.                                                 |
| `onChange(handler)`         | `() => void`  | 로케일 변경을 구독합니다. 구독 해제 함수를 돌려줍니다.       |
| `addMessages(locale, dict)` | `void`        | 로케일에 메시지를 더 병합합니다.                             |
| `getMessages(locale?)`      | `MessageDict` | 로케일의 사전을 읽습니다(기본값은 현재 로케일).              |
| `availableLocales`          | `string[]`    | 사전이 등록된 로케일들.                                      |
| `destroy()`                 | `void`        | 모든 구독자를 제거합니다.                                    |

**타입**

```ts
type MessageDict = Record<string, string>; // 평평함: 'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

코어는 SSR에서 안전합니다. `localStorage`와 `navigator` 접근이 보호되어 있으므로, 서버 렌더링 중에 `createI18n`이나 `t`를 불러도 예외가 나지 않습니다. 저장과 브라우저 언어 감지는 서버에서는 아무 일도 하지 않다가, 코드가 브라우저에서 돌 때 효력을 냅니다.
