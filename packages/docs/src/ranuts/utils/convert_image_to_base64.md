# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| --------- | ------------------------------------------------ | ------------------------------- |
| `success` | Whether the conversion is successful             | `boolean`                       |
| `data`    | The value after successful conversion            | `string`,`ArrayBuffer` , `null` |
| `message` | The reasons why the conversion succeeds or fails | `string`                        |

### Options

| argument | Instructions  | type   | Default value |
| -------- | ------------- | ------ | ------------- |
| file     | Incoming file | `File` | null          |

## Example

```js
import { convertImageToBase64 } from 'ranuts';

convertImageToBase64(file).then((res) => {
  console.log(result);
});
```
