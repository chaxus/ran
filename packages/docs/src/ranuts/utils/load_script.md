# loadScript

Inject a single `<script>` dynamically, de-duplicated by content.

How this differs from [`scriptOnLoad`](/src/ranuts/utils/script_on_load): that one loads a **batch**
of URLs at once (routing `.css` through a `<link>` tag), while this one handles a **single** script,
supports an inline body, and guarantees the same script is evaluated only once — injecting a
third-party SDK twice usually means its initialisation side effects ran twice.

The de-duplication key is the md5 of `type + content`, so a URL and an identically named inline
script cannot be confused.

## Usage

```ts
import { loadScript } from 'ranuts/utils';

// External script
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// Inline script
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// The second call is a no-op — already evaluated
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### Parameters

| Parameter | Description                                                    | Type                 | Default  |
| --------- | -------------------------------------------------------------- | -------------------- | -------- |
| `type`    | `'url'` loads via `src`; `'content'` inlines the script text   | `'url' \| 'content'` | Required |
| `content` | The URL when type is `'url'`, the script body when `'content'` | `string`             | Required |

#### Return

| Argument  | Description                                 | Type                            |
| --------- | ------------------------------------------- | ------------------------------- |
| `promise` | Resolves `{ success: true }` once evaluated | `Promise<{ success: boolean }>` |

Rejects with `{ success: false, error }` when an external script fails to load.

## Notes

An **inline** script is evaluated synchronously the moment it is appended and never dispatches a
`load` event afterwards. Waiting only on `onload` would leave the promise pending forever in a real
browser, so for `type: 'content'` this function resolves as soon as `append` returns. (jsdom _does_
dispatch a load event for inline scripts, which is why a unit test would not catch the difference.)
