# spring / stagger / observeEntry

ابزارهای پایه‌ی حرکت که رسم را به عهده‌ی شما می‌گذارند: یک فنر که دقیق حل می‌شود (و به‌صورت easing از نوع CSS `linear()` هم در دسترس است)، تأخیرهای پلکانی، تشخیص یک‌باره‌ی ورود به دید و ترجیح «کاهش حرکت» خواننده. هیچ‌کدام حلقه‌ی انیمیشن ندارند، پس با Web Animations، ترنزیشن‌های CSS یا `requestAnimationFrame` خودتان به یک اندازه کار می‌کنند.

## API

### spring(options?)

`{ at, duration, easing }` را برمی‌گرداند. `at(seconds)` پیشرفت از ۰ تا ۱ است (فنر کم‌میرا پیش از آرام گرفتن از ۱ می‌گذرد)؛ `duration` زمانی است تا در فاصله‌ی ۰٫۱٪ از هدف بماند؛ `easing` همان منحنی به‌صورت رشته‌ی CSS `linear()` در همان مدت است.

| گزینه       | توضیح                                                       | پیش‌فرض |
| ----------- | ----------------------------------------------------------- | ------- |
| `stiffness` | کشش به سمت هدف؛ بیشتر یعنی سریع‌تر                          | `170`   |
| `damping`   | مقاومت؛ کمتر از `2 * sqrt(stiffness * mass)` از هدف می‌گذرد | `26`    |
| `mass`      | اینرسی                                                      | `1`     |
| `velocity`  | سرعت اولیه، بر حسب پیشرفت در ثانیه                          | `0`     |

### stagger(index, count, options?)

تأخیر بر حسب ثانیه برای عضو `index` از `count`، با شروع از اولی، آخری یا وسط (`from`).

### observeEntry(element, options)

وقتی لبه‌ی بالای عنصر برای اولین بار از `line` (کسری از ارتفاع دید از بالا) بگذرد، `onEnter` را یک بار صدا می‌زند و مشاهده را متوقف می‌کند. ورودی آن `{ reduced }` است: اگر `true` باشد، حالت نهایی را بدون انیمیشن نشان دهید. تابعی برمی‌گرداند که مشاهده را زودتر متوقف می‌کند.

### prefersReducedMotion()

اگر خواننده «کاهش حرکت» را فعال کرده باشد `true`؛ جایی که window نیست (SSR، Node) `false`.

## نمونه

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## نکته‌ها

1. **محتوا بدون اسکریپت هم دیده می‌شود.** به‌جای پنهان کردن عناصر با CSS، با `fill: 'backwards'` _از_ یک جابه‌جایی انیمیت کنید تا اگر اسکریپت شکست خورد یا کاهش حرکت فعال بود، همه‌چیز سر جایش بماند.
2. **جایی که IntersectionObserver نیست، `observeEntry` فوراً وارد می‌شود** و عنصر را منتظر نمی‌گذارد.
3. **فنر دقیق حل می‌شود، نه گام‌به‌گام،** پس گزینه‌های یکسان در هر نرخ فریمی همان منحنی را می‌دهند.
