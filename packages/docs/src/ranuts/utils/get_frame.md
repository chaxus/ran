# getFrame

Calculate frame rate per millisecond (FPS), frame rate per second needs to be multiplied by 1000.

## API

### getFrame

#### Return

| Argument          | Description                                           | Type      |
| ----------------- | ----------------------------------------------------- | --------- |
| `Promise<number>` | Promise that resolves to frame rate (per millisecond) | `Promise` |

#### Parameters

| Parameter | Description             | Type     | Default |
| --------- | ----------------------- | -------- | ------- |
| `n`       | Number of sample frames | `number` | `10`    |

## Example

### Basic Usage

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('Frame rate (per ms):', fps);
console.log('Frame rate (per second):', fps * 1000);
```

### Custom Sample Count

```js
import { getFrame } from 'ranuts';

// Sample 20 frames to calculate average frame rate
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### Performance Monitoring

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('Low frame rate:', fpsPerSecond);
  } else {
    console.log('Normal frame rate:', fpsPerSecond);
  }
}
```

### Animation Performance Check

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`Animation frame rate: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## Notes

1. **Unit description**: Returns frame rate per millisecond, need to multiply by 1000 to get frame rate per second (FPS).
2. **Sampling method**: Uses `requestAnimationFrame` for sampling, calculates average interval of multiple frames.
3. **Async operation**: Returns Promise, needs to be handled with `await` or `.then()`.
4. **Use case**: Commonly used for performance monitoring, animation performance detection, game frame rate monitoring, etc.
