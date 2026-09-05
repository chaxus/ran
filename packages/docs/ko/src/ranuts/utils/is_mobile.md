# isMobile

지금 기기가 모바일 기기인지 판별합니다.

## API

### isMobile

#### 반환값

| 인자      | 설명                 | 타입      |
| --------- | -------------------- | --------- |
| `boolean` | 모바일 기기인지 여부 | `boolean` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('지금 기기는 모바일입니다');
} else {
  console.log('지금 기기는 데스크톱입니다');
}
```

### 반응형 레이아웃

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`${layout} 레이아웃을 씁니다`);
```

### 조건부 로딩

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // 모바일 전용 코드를 불러옵니다
  import('./mobile-module');
} else {
  // 데스크톱 코드를 불러옵니다
  import('./desktop-module');
}
```

## 참고

1. **판별 규칙**: User Agent로 다음 기기를 가려냅니다.
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **서버 렌더링**: 서버 환경(`window` 객체가 없음)에서는 `false`를 돌려줍니다.

3. **정확도**: User Agent에 기대므로 UA를 고치면 속을 수 있습니다.

4. **iPad**: User Agent에 따라 iPad가 모바일 기기로 판별되는 경우가 있습니다.
