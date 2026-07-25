# formatJson

Pretty-print JSON. Accepts an object, or a JSON string to reformat.

## API

### formatJson(value, onError?, indent?)

| Parameter | Description                                                   | Type                | Default  |
| --------- | ------------------------------------------------------------- | ------------------- | -------- |
| `value`   | Object, or a JSON string (single quotes are tolerated)        | `string \| object`  | Required |
| `onError` | Called with the parse/serialize error                          | `(e: Error) => void` | no-op   |
| `indent`  | Spaces per level                                               | `number`            | `4`      |

Returns the formatted string, or `''` when the input cannot be parsed.

## Example

```js
import { formatJson } from 'ranuts';

formatJson({ a: 1, b: [2, 3] });
formatJson("{'a': 1}");                  // single quotes tolerated
formatJson({ a: 1 }, undefined, 2);      // 2-space indent
formatJson('nope', (e) => console.warn(e)); // '' and the error handed to the callback
```

## Notes

1. **A string input is re-parsed, not echoed.** That validates it and normalizes the layout
   rather than trusting whatever spacing the caller had.
2. **Errors are reported, never thrown** — invalid JSON, circular structures and values
   `JSON.stringify` cannot represent all return `''` and invoke `onError`.

::: warning Rewritten in 0.3
This was a ~90-line hand-rolled formatter that rebuilt the layout by regex-injecting newlines
around every brace, bracket and comma, then tried to undo the damage inside string literals by
counting quotes per line. It mis-handled escaped quotes and treated a brace or comma **inside
a string value** as structure, so `{ css: 'a { color: red, }' }` came out corrupted. It is now
`JSON.stringify` with lenient parsing in front — correct, and far faster. Output spacing
matches `JSON.stringify` rather than the old bespoke layout.
:::
