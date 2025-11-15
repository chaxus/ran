# getPerformance

Get page performance metrics data, including DNS resolution, TCP connection, resource loading, and other performance indicators.

## API

### getPerformance

#### Return

| Argument                 | Description                | Type                     |
| ------------------------ | -------------------------- | ------------------------ |
| `BasicType \| undefined` | Performance metrics object | `BasicType \| undefined` |

#### BasicType

| Property       | Description                                             | Type                  |
| -------------- | ------------------------------------------------------- | --------------------- |
| `dnsSearch`    | DNS resolution time (ms)                                | `number`              |
| `tcpConnect`   | TCP connection time (ms)                                | `number`              |
| `sslConnect`   | SSL secure connection time (ms)                         | `number`              |
| `request`      | TTFB network request time (ms)                          | `number`              |
| `response`     | Data transfer time (ms)                                 | `number`              |
| `parseDomTree` | DOM parsing time (ms)                                   | `number`              |
| `resource`     | Resource loading time (ms)                              | `number`              |
| `domReady`     | DOM Ready time (ms)                                     | `number`              |
| `httpHead`     | HTTP header size (bytes)                                | `number`              |
| `interactive`  | First interactive time (ms)                             | `number`              |
| `complete`     | Page fully loaded time (ms)                             | `number`              |
| `redirect`     | Redirect count                                          | `number`              |
| `redirectTime` | Redirect time (ms)                                      | `number`              |
| `duration`     | Total resource request time (ms)                        | `number`              |
| `fp`           | First Paint time (white screen time, ms)                | `number \| undefined` |
| `fcp`          | First Contentful Paint time (first screen end time, ms) | `number \| undefined` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('DNS resolution time:', perf.dnsSearch, 'ms');
  console.log('TCP connection time:', perf.tcpConnect, 'ms');
  console.log('First screen time:', perf.fcp, 'ms');
}
```

### Performance Monitoring

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // Send performance data to server
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### Performance Analysis

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== Performance Analysis ===');
  console.log('DNS resolution:', perf.dnsSearch, 'ms');
  console.log('TCP connection:', perf.tcpConnect, 'ms');
  console.log('SSL handshake:', perf.sslConnect, 'ms');
  console.log('Request response:', perf.request, 'ms');
  console.log('Data transfer:', perf.response, 'ms');
  console.log('DOM parsing:', perf.parseDomTree, 'ms');
  console.log('Resource loading:', perf.resource, 'ms');
  console.log('First Paint:', perf.fp, 'ms');
  console.log('First Contentful Paint:', perf.fcp, 'ms');
}
```

## Notes

1. **Browser support**: Requires browser support for Performance API, all modern browsers support it.

2. **Server-side environment**: Returns `undefined` in server-side environments (no `window` object).

3. **Timing**: Recommended to call after page load completes (`load` event) to get complete performance data.

4. **Data units**: All time units are in milliseconds, size units are in bytes.

5. **Use case**: Commonly used for performance monitoring, performance analysis, performance optimization, etc.
