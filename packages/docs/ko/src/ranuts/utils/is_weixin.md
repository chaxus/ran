# isWeiXin

지금 환경이 WeChat 브라우저인지 판별합니다.

## API

### isWeiXin

#### 반환값

| 인자      | 설명                     | 타입      |
| --------- | ------------------------ | --------- |
| `boolean` | WeChat 브라우저인지 여부 | `boolean` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('지금은 WeChat 브라우저입니다');
} else {
  console.log('WeChat 브라우저가 아닙니다');
}
```

### WeChat 전용 기능

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // WeChat JS-SDK를 씁니다
  wx.config({
    // 설정
  });
} else {
  // 평범한 공유 기능을 씁니다
  shareToSocial();
}
```

### 조건부 표시

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // WeChat 전용 안내를 보여 줍니다
  showWeChatTip();
}
```

## 참고

1. **판별 방법**: User Agent에 `micromessenger` 문자열이 있는지로 판별합니다.

2. **서버 렌더링**: 서버 환경(`window` 객체가 없음)에서는 `false`를 돌려줍니다.

3. **정확도**: User Agent에 기대므로 UA가 바뀌어 있으면 제대로 가려내지 못할 수 있습니다.

4. **WeChat 버전**: WeChat 브라우저의 모든 버전에서 동작합니다(내장 브라우저와 미니프로그램 WebView 포함).
