# getPerformance

쪽의 성능 지표를 가져옵니다. DNS 해석, TCP 연결, 자원 불러오기를 비롯한 여러 지표가 들어 있습니다.

## API

### getPerformance

#### 반환값

| 인자 | 설명 | 타입 |
| ------------------------ | -------------------------- | ------------------------ |
| `BasicType \| undefined` | 성능 지표 객체 | `BasicType \| undefined` |

#### BasicType

| 프로퍼티 | 설명 | 타입 |
| -------------- | ------------------------------------------------------- | --------------------- |
| `dnsSearch` | DNS 해석에 걸린 시간(ms) | `number` |
| `tcpConnect` | TCP 연결에 걸린 시간(ms) | `number` |
| `sslConnect` | SSL 보안 연결에 걸린 시간(ms) | `number` |
| `request` | TTFB. 네트워크 요청에 걸린 시간(ms) | `number` |
| `response` | 데이터 전송에 걸린 시간(ms) | `number` |
| `parseDomTree` | DOM 해석에 걸린 시간(ms) | `number` |
| `resource` | 자원을 불러오는 데 걸린 시간(ms) | `number` |
| `domReady` | DOM Ready까지의 시간(ms) | `number` |
| `httpHead` | HTTP 헤더의 크기(바이트) | `number` |
| `interactive` | 처음으로 다룰 수 있게 되기까지의 시간(ms) | `number` |
| `complete` | 쪽이 온전히 불러와지기까지의 시간(ms) | `number` |
| `redirect` | 리다이렉트 횟수 | `number` |
| `redirectTime` | 리다이렉트에 걸린 시간(ms) | `number` |
| `duration` | 자원 요청에 걸린 총 시간(ms) | `number` |
| `fp` | First Paint까지의 시간(흰 화면이 이어진 시간, ms) | `number \| undefined` |
| `fcp` | First Contentful Paint까지의 시간(첫 화면이 다 차기까지, ms) | `number \| undefined` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('DNS 해석:', perf.dnsSearch, 'ms');
  console.log('TCP 연결:', perf.tcpConnect, 'ms');
  console.log('첫 화면까지:', perf.fcp, 'ms');
}
```

### 성능 측정

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // 성능 데이터를 서버로 보냅니다
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### 성능 분석

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== 성능 분석 ===');
  console.log('DNS 해석:', perf.dnsSearch, 'ms');
  console.log('TCP 연결:', perf.tcpConnect, 'ms');
  console.log('SSL 악수:', perf.sslConnect, 'ms');
  console.log('요청 응답:', perf.request, 'ms');
  console.log('데이터 전송:', perf.response, 'ms');
  console.log('DOM 해석:', perf.parseDomTree, 'ms');
  console.log('자원 불러오기:', perf.resource, 'ms');
  console.log('First Paint:', perf.fp, 'ms');
  console.log('First Contentful Paint:', perf.fcp, 'ms');
}
```

## 참고

1. **브라우저 지원**: Performance API를 지원하는 브라우저가 필요하며, 요즘 브라우저는 모두 지원합니다.

2. **서버 환경**: 서버 환경(`window` 객체가 없는 경우)에서는 `undefined`를 반환합니다.

3. **부르는 때**: 온전한 데이터를 얻으려면 쪽을 다 불러온 뒤(`load` 이벤트 뒤에) 부르는 편이 좋습니다.

4. **단위**: 시간은 모두 밀리초, 크기는 바이트입니다.

5. **활용**: 성능 관찰, 분석, 다듬기 등에 흔히 쓰입니다.
