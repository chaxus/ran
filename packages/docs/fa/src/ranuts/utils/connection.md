# connection

اطلاعات اتصال شبکهٔ کنونی را می‌گیرد (Network Information API).

## API

### connection

#### بازگشت

| آرگومان                           | توضیح                       | نوع                               |
| --------------------------------- | --------------------------- | --------------------------------- |
| `NetworkInformation \| undefined` | شیء اتصال شبکه یا undefined | `NetworkInformation \| undefined` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('نوع شبکه:', conn.effectiveType);
  console.log('سرعت دریافت:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### گوش دادن به تغییرهای شبکه

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('وضعیت شبکه عوض شد');
    console.log('نوع تازهٔ شبکه:', conn.effectiveType);
  });
}
```

### تنظیم راهبرد بر پایهٔ شبکه

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // شبکهٔ کند: تصویرهای کم‌کیفیت بارگذاری شوند
    loadLowQualityImages();
  } else {
    // شبکهٔ تند: تصویرهای پرکیفیت بارگذاری شوند
    loadHighQualityImages();
  }
}
```

## یادداشت‌ها

1. **پشتیبانی مرورگر**: مرورگر باید Network Information API را داشته باشد؛ برخی ندارند.
2. **محیط سرور**: در محیط‌های سرور (بدون شیء `window`) مقدار `undefined` برمی‌گردد.
3. **ویژگی‌های شیء اتصال**:

- `effectiveType`: نوع شبکه ('slow-2g'، '2g'، '3g'، '4g')
- `downlink`: سرعت دریافت (Mbps)
- `rtt`: زمان رفت‌وبرگشت (میلی‌ثانیه)
- `saveData`: اینکه حالت صرفه‌جویی در داده روشن است یا نه 4. **کاربرد**: معمولاً برای هماهنگ کردن شیوهٔ بارگذاری محتوا با وضعیت شبکه و بهبود کارایی به کار می‌رود.
