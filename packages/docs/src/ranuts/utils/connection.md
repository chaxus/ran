# connection

Get current network connection information (Network Information API).

## API

### connection

#### Return

| Argument              | Description                            | Type                  |
| --------------------- | -------------------------------------- | --------------------- |
| `number \| undefined` | Network connection object or undefined | `number \| undefined` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('Network type:', conn.effectiveType);
  console.log('Downlink speed:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### Listen to Network Changes

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('Network status changed');
    console.log('New network type:', conn.effectiveType);
  });
}
```

### Adjust Strategy Based on Network

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // Slow network, load low-quality images
    loadLowQualityImages();
  } else {
    // Fast network, load high-quality images
    loadHighQualityImages();
  }
}
```

## Notes

1. **Browser support**: Requires browser support for Network Information API, some browsers may not support it.
2. **Server-side environment**: Returns `undefined` in server-side environments (no `window` object).
3. **Connection object properties**:
   - `effectiveType`: Network type ('slow-2g', '2g', '3g', '4g')
   - `downlink`: Downlink speed (Mbps)
   - `rtt`: Round-trip time (milliseconds)
   - `saveData`: Whether data saver mode is enabled
4. **Use case**: Commonly used to adjust content loading strategy based on network conditions, performance optimization, etc.
