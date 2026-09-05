# create

تابع کمکی برای ساختن عنصرهای DOM؛ هم عنصرهای HTML و هم SVG را پشتیبانی می‌کند.

## API

### create

#### بازگشت

| آرگومان | توضیح | نوع |
| ------------- | ------------------- | ------------- |
| `HTMLElement` | عنصر DOM ساخته‌شده | `HTMLElement` |

#### پارامترها

| پارامتر | توضیح | نوع | پیش‌فرض |
| --------- | --------------------------- | ------------------------ | -------- |
| `tagName` | نام تگ | `string` | الزامی |
| `options` | گزینه‌های ساخت (اختیاری) | `ElementCreationOptions` | اختیاری |

## نمونه

### کاربرد پایه

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### ساختن یک عنصر SVG

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### استفاده از گزینه‌های ساخت

```js
import { create } from 'ranuts';

// ساختن یک عنصر سفارشی
const customElement = create('my-custom-element', { is: 'my-element' });
```

## یادداشت‌ها

۱. **تشخیص خودکار**: تگ‌های SVG را خودش می‌شناسد و با فضای‌نام درست می‌سازد.
۲. **عنصرهای HTML**: عنصرهای معمولی HTML با `document.createElement` ساخته می‌شوند.
۳. **عنصرهای SVG**: عنصرهای SVG با `document.createElementNS` ساخته می‌شوند.
۴. **کاربرد**: معمولاً جایی به کار می‌آید که باید عنصر SVG ساخته شود و مسیر کار را کوتاه می‌کند.
