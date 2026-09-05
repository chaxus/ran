# scriptOnLoad

تگ‌های script یا link را پویا درج می‌کند و می‌ماند تا همهٔ منابع بارگذاری شوند.

## API

### scriptOnLoad

#### بازگشت

| آرگومان         | توضیح                                               | نوع       |
| --------------- | --------------------------------------------------- | --------- |
| `Promise<void>` | Promise‌ای که با بارگذاری همهٔ منابع برآورده می‌شود | `Promise` |

#### پارامترها

| پارامتر    | توضیح                                    | نوع           | پیش‌فرض |
| ---------- | ---------------------------------------- | ------------- | ------- |
| `urls`     | آرایهٔ نشانی منابع                       | `string[]`    | الزامی  |
| `append`   | عنصر والدی که در آن درج می‌شود (اختیاری) | `HTMLElement` | `body`  |
| `callback` | فراخوانی پس از بارگذاری همه (اختیاری)    | `Function`    | اختیاری |

## نمونه

### کاربرد پایه

```js
import { scriptOnLoad } from 'ranuts';

// بارگذاری یک اسکریپت
await scriptOnLoad(['https://example.com/script.js']);
console.log('اسکریپت بارگذاری شد');
```

### بارگذاری چند منبع

```js
import { scriptOnLoad } from 'ranuts';

// بارگذاری هم‌زمان چند اسکریپت و سبک
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('همهٔ منابع بارگذاری شدند');
```

### استفاده از فراخوان

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('منابع بارگذاری شدند؛ می‌توان کار را آغاز کرد');
});
```

### بارگذاری پویای کتابخانهٔ بیرونی

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // کتابخانه بارگذاری شد و آمادهٔ استفاده است
  window.Library.init();
}
```

## یادداشت‌ها

۱. **تشخیص خودکار نوع**: از روی پسوند نشانی (`.css`) خودش سبک را از اسکریپت جدا می‌کند.
۲. **بارگذاری موازی**: همهٔ منابع هم‌زمان بارگذاری می‌شوند و تنها پس از پایان همه برآورده می‌شود.
۳. **جای درج**: به‌طور پیش‌فرض عنصر `body`، ولی می‌توان والد دیگری تعیین کرد.
۴. **Promise و فراخوان**: هر دو پشتیبانی می‌شوند و می‌توان با هم به کار برد.
