# getFrame

نرخ فریم در هر میلی‌ثانیه را حساب می‌کند؛ برای نرخ در هر ثانیه باید در ۱۰۰۰ ضرب شود.

## API

### getFrame

#### بازگشت

| آرگومان           | توضیح                                                       | نوع       |
| ----------------- | ----------------------------------------------------------- | --------- |
| `Promise<number>` | Promise‌ای که با نرخ فریم (در هر میلی‌ثانیه) برآورده می‌شود | `Promise` |

#### پارامترها

| پارامتر | توضیح                | نوع      | پیش‌فرض |
| ------- | -------------------- | -------- | ------- |
| `n`     | تعداد فریم‌های نمونه | `number` | `10`    |

## نمونه

### کاربرد پایه

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('فریم در هر میلی‌ثانیه:', fps);
console.log('فریم در هر ثانیه:', fps * 1000);
```

### تغییر تعداد نمونه‌ها

```js
import { getFrame } from 'ranuts';

// از ۲۰ فریم نمونه بگیرید تا میانگین نرخ فریم به دست آید
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### سنجش کارایی

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('نرخ فریم پایین است:', fpsPerSecond);
  } else {
    console.log('نرخ فریم عادی است:', fpsPerSecond);
  }
}
```

### وارسی کارایی پویانمایی

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`نرخ فریم پویانمایی: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## یادداشت‌ها

۱. **یکا**: نرخ فریم در هر میلی‌ثانیه برمی‌گردد؛ برای نرخ در هر ثانیه (FPS) در ۱۰۰۰ ضرب کنید.
۲. **شیوهٔ نمونه‌برداری**: با `requestAnimationFrame` نمونه می‌گیرد و میانگین فاصلهٔ چند فریم را حساب می‌کند.
۳. **ناهمگام**: Promise برمی‌گرداند، پس با `await` یا `.then()` رسیدگی کنید.
۴. **کاربرد**: معمولاً برای پایش کارایی، وارسی پویانمایی و رصد نرخ فریم بازی به کار می‌رود.
