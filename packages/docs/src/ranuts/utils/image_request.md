# imageRequest

Test network latency (ping value) through image request.

## API

### imageRequest

#### Return

| Argument          | Description                                              | Type      |
| ----------------- | -------------------------------------------------------- | --------- |
| `Promise<number>` | Promise that resolves to request duration (milliseconds) | `Promise` |

#### Parameters

| Parameter | Description                                      | Type     | Default  |
| --------- | ------------------------------------------------ | -------- | -------- |
| `url`     | Image URL (optional, defaults to GitHub favicon) | `string` | Optional |

## Example

### Basic Usage

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('Network latency:', latency, 'ms');
```

### Specify Test URL

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('Latency:', latency, 'ms');
```

### Network Test

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('Good network');
    } else if (latency < 300) {
      console.log('Average network');
    } else {
      console.log('Slow network');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}
```

## Notes

1. **Default URL**: If URL is not provided, defaults to GitHub's favicon (about 2.2KB).
2. **Measurement method**: Measures network latency through image loading time, time difference from request initiation to image load completion.
3. **Error handling**: If image loading fails, Promise will reject.
4. **Use case**: Commonly used for network quality detection, performance monitoring, etc.
