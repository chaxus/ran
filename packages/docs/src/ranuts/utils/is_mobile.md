# isMobile

Determine if the current device is a mobile device.

## API

### isMobile

#### Return

| Argument  | Description                   | Type      |
| --------- | ----------------------------- | --------- |
| `boolean` | Whether it is a mobile device | `boolean` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('Current device is mobile');
} else {
  console.log('Current device is desktop');
}
```

### Responsive Layout

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`Using ${layout} layout`);
```

### Conditional Loading

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // Load mobile-specific code
  import('./mobile-module');
} else {
  // Load desktop code
  import('./desktop-module');
}
```

## Notes

1. **Detection rules**: Detects the following devices via User Agent:
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **Server-side rendering**: Returns `false` in server-side environments (no `window` object).

3. **Accuracy**: Based on User Agent detection, may be fooled by modified UAs.

4. **iPad handling**: iPad may be identified as a mobile device in some cases, depending on the User Agent.
