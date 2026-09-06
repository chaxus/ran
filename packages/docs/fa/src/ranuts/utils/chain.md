# Chain

کلاسی برای دستکاری DOM با فراخوانی‌های زنجیره‌ای: ساختن عنصر، گذاشتن ویژگی، شنیدن رویداد و مانند آن.

## API

### Chain

#### سازنده

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### متدهای اصلی

| متد                | توضیح                                | مقدار بازگشتی |
| ------------------ | ------------------------------------ | ------------- |
| `setAttribute`     | ویژگی‌ای روی عنصر می‌گذارد           | `Chain`       |
| `removeAttribute`  | ویژگی‌ای را از عنصر برمی‌دارد        | `Chain`       |
| `append`           | عنصر فرزندی می‌افزاید                | `Chain`       |
| `remove`           | عنصر فرزندی را برمی‌دارد             | `Chain`       |
| `setTextContent`   | محتوای متنی را تعیین می‌کند          | `Chain`       |
| `setStyle`         | سبکی را تعیین می‌کند                 | `Chain`       |
| `addChild`         | فرزندی می‌افزاید (آرایه هم می‌پذیرد) | `Chain`       |
| `listen`           | شنوندهٔ رویداد می‌نشاند              | `Chain`       |
| `clearListener`    | شنوندهٔ رویداد را برمی‌دارد          | `Chain`       |
| `clearAllListener` | همهٔ شنونده‌های رویداد را برمی‌دارد  | `Chain`       |

#### ویژگی‌ها

| ویژگی     | توضیح    | نوع           |
| --------- | -------- | ------------- |
| `element` | عنصر DOM | `HTMLElement` |

## نمونه

### کاربرد پایه

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### زنجیره‌سازی

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('کلیک کنید')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('دکمه کلیک شد');
  });

document.body.appendChild(button.element);
```

### افزودن عنصرهای فرزند

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('عنوان'))
  .addChild(new Chain('p').setTextContent('محتوا'));

document.body.appendChild(container.element);
```

### افزودن دسته‌جمعی فرزندها

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('مورد ۱'),
  new Chain('li').setTextContent('مورد ۲'),
  new Chain('li').setTextContent('مورد ۳'),
]);

document.body.appendChild(list.element);
```

### عنصرهای SVG

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## یادداشت‌ها

1. **زنجیره‌سازی**: همهٔ متدها نمونهٔ `Chain` را برمی‌گردانند، پس می‌توان آن‌ها را به هم زنجیر کرد.
2. **پشتیبانی از SVG**: تگ‌های SVG را خودش می‌شناسد و با فضای‌نام درست می‌سازد.
3. **مدیریت رویداد**: در درون، نگاشت شنونده‌ها را نگه می‌دارد و همین اداره و برداشتنشان را آسان می‌کند.
4. **کاربرد**: معمولاً برای ساختن پویای ساختار DOM و سرهم کردن مؤلفه‌های رابط کاربری به کار می‌رود.
