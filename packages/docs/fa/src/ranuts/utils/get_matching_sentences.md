# getMatchingSentences

جمله‌های کاملی را که واژهٔ جست‌وجو در آن‌هاست از متن بیرون می‌کشد؛ اگر دو جمله روی هم بیفتند، تنها بلندترین را نگه می‌دارد.

## API

### getMatchingSentences

#### بازگشت

| آرگومان | توضیح                                            | نوع        |
| ------- | ------------------------------------------------ | ---------- |
| `Array` | آرایهٔ جمله‌های دارای واژهٔ جست‌وجو (بدون تکرار) | `string[]` |

#### پارامترها

| پارامتر       | توضیح         | نوع      | پیش‌فرض |
| ------------- | ------------- | -------- | ------- |
| `text`        | متن مبدأ      | `string` | الزامی  |
| `searchValue` | واژهٔ جست‌وجو | `string` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### وقتی چند جمله می‌خورند

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### جمله‌هایی که روی هم می‌افتند

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// تنها بلندترین جمله می‌ماند
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### مقدارهای خالی

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## یادداشت‌ها

1. **مرز جمله**: با نقطهٔ ایدئوگرافیک (。)، نقطه (.)، خط تازه (\n)، علامت تعجب (！) و پرسش (?، ？) مرز جمله را می‌شناسد.
2. **حذف تکرار**: وقتی جمله‌ها روی هم می‌افتند، تنها بلندترین می‌ماند.
3. **بی‌توجه به بزرگی حروف**: جست‌وجو بزرگی و کوچکی حروف را نادیده می‌گیرد.
4. **کاربرد**: معمولاً برای برجسته‌سازی نتیجهٔ جست‌وجو، خلاصه‌سازی متن و نمایش نتایج به کار می‌رود.
