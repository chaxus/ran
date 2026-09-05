# i18n

프레임워크에 매이지 않는 국제화 엔진입니다. 작은 반응형 코어(`I18nCore`)에 선택적인 전역 싱글턴(`createI18n` / `useI18n`)이 붙습니다. 여기 있는 것은 DOM을 전혀 건드리지 않으므로, UI에 붙이는 방식은 원하는 대로 정하면 됩니다.

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

`ranuts/utils`에서도 다시 export됩니다. i18n만 필요하다면 `ranuts/i18n`에서 import하세요. 이 진입점에는 엔진과 헬퍼 둘만 들어 있고, 폭넓은 `utils` 배럴이 덤으로 끌어오는 것들은 들어오지 않습니다.

## 사용법

```ts
import { createI18n, useI18n } from 'ranuts/i18n';

createI18n({
  messages: {
    en: { 'hero.title': 'Hello, {name}', 'nav.docs': 'Docs' },
    zh: { 'hero.title': '你好，{name}', 'nav.docs': '文档' },
  },
  fallbackLocale: 'en',
  persist: true,
  detectNavigator: true,
});

const i18n = useI18n()!;
i18n.t('hero.title', { name: 'Ada' }); // "Hello, Ada"
i18n.setLocale('zh');
i18n.t('hero.title', { name: 'Ada' }); // "你好，Ada"
```

사전은 **평평합니다.** `t()`는 `messages[locale][key]`를 곧바로 조회하므로, 키는 `'hero.title'` 같은 문자 그대로의 문자열이지 중첩된 객체가 아닙니다.

## 초기 로케일

생성자에서 한 번, 다음 순서로 결정됩니다.

1. `localStorage`에 저장된 선택(`persist`가 켜져 있고, 그 로케일에 사전이 있을 때만)
2. `config.locale`
3. 브라우저의 언어들(`detectNavigator`가 켜져 있을 때만)
4. `fallbackLocale`

3단계는 [`resolveLocale`](/ko/src/ranuts/utils/resolve_locale)을 거칩니다. `navigator.language`만이 아니라 순서가 있는 `navigator.languages` 목록 전체를 읽으므로, 첫 번째 선호 언어가 여러분의 사전에 없는 독자도 곧장 대체 언어로 떨어지는 대신 두 번째 언어를 받습니다.

## 보간

`t(key, params)`는 `{param}` 자리를 왼쪽에서 오른쪽으로 한 번에 훑으며 바꿉니다. Rust의 `format!`, Python의 `str.format`, .NET의 `String.Format`이 쓰는 형식 문자열 관례를 따릅니다.

::: v-pre

| 입력                          | 출력                                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| `{{`                          | 글자 그대로의 `{`                                                |
| `}}`                          | 글자 그대로의 `}`                                                |
| `{name}`                      | `params.name`을 문자열로 바꾼 값                                 |
| 해당 매개변수가 없는 `{name}` | 그대로 남습니다. 그래서 빠진 자리가 조용히 비는 대신 눈에 띕니다 |

:::

혼자 있는 `{` / `}`나 `{ x }`처럼 공백이 낀 묶음은 **자리가 아니며** 그대로 출력됩니다. 그래서 메시지 안의 CSS, JSON, 코드 조각이 다치지 않고 지나갑니다. 값을 중괄호로 감싸고 싶다면 바깥 짝을 겹치세요: <code v-pre>{{{name}}}</code>.

## 타입이 붙은 사전

사전의 모양을 타입 인자로 넘기면 모든 `t()` 호출이 컴파일 시점에 검사됩니다. 그러지 않으면 이름을 바꾼 키나 오타 난 키가 "키 자체를 그린다"로 조용히 내려앉습니다. 문장이 있어야 할 자리에 `agentModelFirstDownlaod`가 보이는데, 그때까지 아무것도 실패하지 않습니다.

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // 아직 번역 중 — 괜찮습니다
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // 컴파일 오류

useI18n<Messages>()?.t('cancel'); // 검사를 이어 가려면 같은 타입을 다시 넘기세요
```

이것을 "있기만 한" 기능이 아니라 쓸 만한 기능으로 만드는 세 가지가 있습니다.

1. **각 로케일은 `Partial`입니다.** 번역이 진행 중인 것이 보통의 상태이고, 아직 채워지지 않은 부분은 대체 로케일이 맡습니다.
2. **타입은 타입 인자에서 오지, 데이터에서 오지 않습니다.** `messages`는 `NoInfer`로 감싸여 있어서, 키 집합이 다른 로케일들로부터 TypeScript가 그 _교집합_을 추론해 버리는 일이 없습니다. 그러지 않으면 대체 로케일만 정의한 키가 모든 호출부에서 거부되고, 번역이 덜 되었을 뿐인데 빌드가 깨집니다. 실행 중에 대체하면 그만인 일인데도요.
3. **`type`뿐 아니라 `interface`도 됩니다.** 제약이 `Record<string, string>`이 아니라 `StringValues<T>`(`{ [K in keyof T]: string }`)인 것은, TypeScript가 암묵적 인덱스 시그니처를 타입 별칭에만 주기 때문입니다. 뻔한 방식으로 제약했다면 모든 사용자에게 사전을 `type`으로 다시 쓰게 만들었을 것입니다.

타입 인자를 빼면 타입 없는 동작이 그대로 남습니다. 기본 `MessageDict`는 `Record<string, string>`이고, 그 `keyof`는 `string`입니다.

## 설정

| 필드              | 설명                                                          | 타입             | 기본값         |
| ----------------- | ------------------------------------------------------------- | ---------------- | -------------- |
| `locale`          | 초기 로케일. `persist`가 켜져 있으면 저장된 선택이 우선합니다 | `string`         | `-`            |
| `fallbackLocale`  | 현재 로케일에 키가 없을 때 쓰는 로케일                        | `string`         | `'en'`         |
| `messages`        | 로케일 → 키 → 문자열                                          | `LocaleMessages` | `{}`           |
| `persist`         | 현재 로케일을 `localStorage`에 저장합니다                     | `boolean`        | `false`        |
| `storageKey`      | `persist`가 켜졌을 때 쓰는 `localStorage` 키                  | `string`         | `'ran-locale'` |
| `detectNavigator` | 초기 로케일을 브라우저의 언어 설정에서 정합니다               | `boolean`        | `false`        |

## API

### createI18n

전역 싱글턴을 만들어 등록합니다.

#### 매개변수

| 매개변수 | 설명          | 타입         | 기본값 |
| -------- | ------------- | ------------ | ------ |
| `config` | **설정** 참고 | `I18nConfig` | `{}`   |

#### 반환값

| 인자   | 설명        | 타입       |
| ------ | ----------- | ---------- |
| `i18n` | 새 인스턴스 | `I18nCore` |

### useI18n

살아 있는 전역 인스턴스를 돌려주며, 만들어진 것이 없으면 `null`을 돌려줍니다.

#### 반환값

| 인자   | 설명                           | 타입               |
| ------ | ------------------------------ | ------------------ |
| `i18n` | 살아 있는 인스턴스 또는 `null` | `I18nCore \| null` |

### I18nCore

| 멤버                        | 설명                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `t(key, params?)`           | 번역합니다. 대체 로케일로, 다시 키 자체로 물러납니다                               |
| `locale` / `getLocale()`    | 현재 로케일                                                                        |
| `setLocale(locale)`         | 로케일을 바꾸고, (켜져 있다면) 저장하며 알립니다. 그대로면 아무 일도 하지 않습니다 |
| `addMessages(locale, dict)` | 사전을 로케일에 병합하고, 없으면 만듭니다                                          |
| `getMessages(locale?)`      | 그 로케일의 사전, 없으면 `{}`                                                      |
| `availableLocales`          | 사전이 등록된 로케일들                                                             |
| `onChange(fn)`              | 로케일 변경을 구독합니다. 구독 해제 함수를 돌려줍니다                              |
| `destroy()`                 | 모든 구독자를 제거합니다                                                           |

## SSR

안전합니다. `localStorage`와 `navigator` 접근이 모두 보호되어 있으므로, 서버 렌더링 중에 인스턴스를 만들면 `config.locale`이나 `fallbackLocale`로 흘러갑니다.
