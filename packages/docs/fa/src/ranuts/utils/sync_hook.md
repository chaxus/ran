# SyncHook

کلاس قلاب‌های رویدادی همگام، برای پیاده کردن الگوی انتشار-اشتراک.

## API

### SyncHook

#### متدهای اصلی

| متد        | توضیح                                                       | مقدار بازگشتی   |
| ---------- | ----------------------------------------------------------- | --------------- |
| `tap`      | مشترک شدن در یک رویداد                                      | `this`          |
| `call`     | برانگیختن رویداد                                            | `this`          |
| `callSync` | برانگیختن همگام رویداد (فراخوان‌های ناهمگام را هم می‌پذیرد) | `Promise<this>` |
| `once`     | مشترک شدن تنها برای یک بار                                  | `this`          |
| `off`      | لغو اشتراک                                                  | `this`          |

## نمونه

### کاربرد پایه

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// مشترک شدن در رویداد
hook.tap('event1', () => {
  console.log('رویداد ۱ برانگیخته شد');
});

// برانگیختن رویداد
hook.call('event1'); // 'رویداد ۱ برانگیخته شد'
```

### دادن آرگومان

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`سلام، ${name}!`);
});

hook.call('greet', 'World'); // 'سلام، World!'
```

### اشتراک یک‌باره

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('این تنها یک بار رخ می‌دهد');
});

hook.call('onceEvent'); // 'این تنها یک بار رخ می‌دهد'
hook.call('onceEvent'); // چیزی رخ نمی‌دهد
```

### لغو اشتراک

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('فراخوان');
};

hook.tap('event', callback);
hook.call('event'); // 'فراخوان'

hook.off('event', callback);
hook.call('event'); // چیزی رخ نمی‌دهد
```

### فراخوان‌های ناهمگام

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('فراخوان ناهمگام');
});

await hook.callSync('asyncEvent'); // 'فراخوان ناهمگام'
```

## یادداشت‌ها

۱. **اجرای همگام**: متد `call` همهٔ فراخوان‌ها را همگام اجرا می‌کند.
۲. **پشتیبانی ناهمگام**: متد `callSync` فراخوان‌های ناهمگام را می‌پذیرد و تا پایان همه صبر می‌کند.
۳. **مدیریت رویداد**: در درون از `Map` و `Set` برای نگهداری رویدادها و فراخوان‌ها استفاده می‌کند.
۴. **کاربرد**: معمولاً در سامانه‌های رویداد، سامانه‌های افزونه و میان‌افزارها به کار می‌رود.
