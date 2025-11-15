# networkSpeed

Test current network ping value and jitter through multiple requests.

## API

### networkSpeed

#### Return

| Argument              | Description                                   | Type      |
| --------------------- | --------------------------------------------- | --------- |
| `Promise<ReturnType>` | Promise that resolves to network test results | `Promise` |

#### ReturnType

| Property | Description                       | Type     |
| -------- | --------------------------------- | -------- |
| `ping`   | Average ping value (milliseconds) | `number` |
| `jitter` | Network jitter (milliseconds)     | `number` |

#### Parameters

| Parameter | Description           | Type      | Default  |
| --------- | --------------------- | --------- | -------- |
| `options` | Configuration options | `Options` | Required |

#### Options

| Parameter  | Description                    | Type     | Default  |
| ---------- | ------------------------------ | -------- | -------- |
| `url`      | Image URL for testing          | `string` | Required |
| `duration` | Interval between requests (ms) | `number` | `3000`   |
| `count`    | Number of tests                | `number` | `5`      |

## Example

### Basic Usage

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('Average latency:', result.ping, 'ms');
console.log('Network jitter:', result.jitter, 'ms');
```

### Network Quality Assessment

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('Excellent network quality');
  } else if (ping < 100 && jitter < 50) {
    console.log('Good network quality');
  } else {
    console.log('Average network quality');
  }
}
```

### Custom Test Parameters

```js
import { networkSpeed } from 'ranuts';

// Test 10 times, 2 seconds interval each
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## Notes

1. **Jitter**: Describes network fluctuation, the difference between maximum and minimum values of multiple test results, smaller difference means more stable network.
2. **Test method**: Tests through multiple image requests, calculates average latency and jitter.
3. **Default parameters**: Defaults to 5 tests, 3 seconds interval each.
4. **Use case**: Commonly used for network quality detection, performance monitoring, user experience optimization, etc.
