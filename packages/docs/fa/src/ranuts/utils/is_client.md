# isClient

تعیین می‌کند که محیط کنونی محیط کلاینت (مرورگر) است یا نه.

## API

### isClient

#### بازگشت

| آرگومان   | توضیح                       | نوع       |
| --------- | --------------------------- | --------- |
| `boolean` | اینکه محیط کلاینت است یا نه | `boolean` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('اکنون در محیط مرورگر هستیم');
  // می‌شود از APIهای مرورگر مثل window و document استفاده کرد
  window.localStorage.setItem('key', 'value');
} else {
  console.log('اکنون در محیط سمت سرور هستیم');
}
```

### اجرای شرطی

```js
import { isClient } from 'ranuts';

// فقط در کلاینت اجرا شود
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### ایمنی در رندر سمت سرور

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## یادداشت‌ها

۱. **شیوه تشخیص**: با `typeof window !== 'undefined'` تشخیص می‌دهد.
۲. **یک ثابت است**: `isClient` تابع نیست بلکه ثابت است، پس هنگام استفاده پرانتز لازم ندارد.
۳. **کجا به کار می‌آید**: برای جدا کردن محیط کلاینت از سرور و پرهیز از خطا هنگام استفاده از APIهای مرورگر در سرور رایج است.
