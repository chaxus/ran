# isWeiXin

Determine if the current environment is WeChat browser.

## API

### isWeiXin

#### Return

| Argument  | Description                  | Type      |
| --------- | ---------------------------- | --------- |
| `boolean` | Whether it is WeChat browser | `boolean` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('Currently in WeChat browser');
} else {
  console.log('Not in WeChat browser');
}
```

### WeChat-Specific Features

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Use WeChat JS-SDK
  wx.config({
    // Configuration
  });
} else {
  // Use normal sharing functionality
  shareToSocial();
}
```

### Conditional Display

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Show WeChat-specific tips
  showWeChatTip();
}
```

## Notes

1. **Detection method**: Determines by checking if the User Agent contains the `micromessenger` string.

2. **Server-side rendering**: Returns `false` in server-side environments (no `window` object).

3. **Accuracy**: Based on User Agent detection, may not accurately identify if UA is modified.

4. **WeChat versions**: Works with all versions of WeChat browser (including WeChat built-in browser and WeChat Mini Program WebView).
