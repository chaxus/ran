# currentDevice

نوع دستگاه کنونی را می‌گیرد.

## API

### currentDevice

#### بازگشت

| آرگومان | توضیح | نوع |
| --------------- | ------------------ | ----------------------------------------- |
| `CurrentDevice` | رشتهٔ نوع دستگاه | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`دستگاه کنونی: ${device}`);
// خروجی ممکن: 'ipad'، 'android'، 'iphone' یا 'pc'
```

### اجرای منطق متفاوت بر پایهٔ نوع دستگاه

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // منطق ویژهٔ iPhone
    break;
  case 'android':
    // منطق ویژهٔ Android
    break;
  case 'ipad':
    // منطق ویژهٔ iPad
    break;
  case 'pc':
    // منطق ویژهٔ رایانه
    break;
}
```

### سبک‌های ویژهٔ هر دستگاه

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## یادداشت‌ها

۱. **ترتیب تشخیص**: به این ترتیب بررسی می‌کند:
   - iPad/iPod
   - Android
   - iPhone
   - بقیه (به‌طور پیش‌فرض 'pc' برمی‌گردد)

۲. **رندر سمت سرور**: در محیط‌های سرور (بدون شیء `window`) مقدار `'pc'` را برمی‌گرداند.

۳. **روش تشخیص**: از روی رشتهٔ User Agent.

۴. **مقدار بازگشتی**: از نوع شمارشی است و تنها یکی از `'ipad'`، `'android'`، `'iphone'` یا `'pc'` می‌تواند باشد.
