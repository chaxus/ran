# getMime

پسوند یک فایل را می‌دهید و `mime type` آن را می‌گیرید.

## API

### بازگشت

| آرگومان  | توضیح                      | نوع      |
| -------- | -------------------------- | -------- |
| `string` | `mime type` را برمی‌گرداند | `string` |

### گزینه‌ها

| پارامتر | توضیح           | نوع      | پیش‌فرض |
| ------- | --------------- | -------- | ------- |
| ext     | قالب پسوند فایل | `string` | الزامی  |

## نمونه

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
