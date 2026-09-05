# getMatchingSentences

글에서 검색어가 든 문장을 통째로 뽑아냅니다. 겹치는 문장이 있으면 가장 긴 것만 남깁니다.

## API

### getMatchingSentences

#### 반환값

| 인자    | 설명                               | 타입       |
| ------- | ---------------------------------- | ---------- |
| `Array` | 검색어가 든 문장의 배열(중복 제거) | `string[]` |

#### 매개변수

| 매개변수      | 설명    | 타입     | 기본값 |
| ------------- | ------- | -------- | ------ |
| `text`        | 원본 글 | `string` | 필수   |
| `searchValue` | 검색어  | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### 여러 문장이 걸릴 때

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### 겹치는 문장 다루기

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// 가장 긴 문장만 남습니다
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### 빈 값 다루기

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## 참고

1. **문장 경계**: 고리점(。), 마침표(.), 줄바꿈(\n), 느낌표(！), 물음표(?, ？)로 문장의 경계를 가릅니다.
2. **중복 제거**: 문장이 겹치면 가장 긴 것만 남깁니다.
3. **대소문자 무시**: 검색은 대소문자를 가리지 않습니다.
4. **활용**: 검색어 강조, 글 요약, 검색 결과 표시 등에 흔히 쓰입니다.
