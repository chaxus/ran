# getPerformance

سنجه‌های کارایی صفحه را می‌گیرد، از جمله گشایش DNS، اتصال TCP، بارگذاری منابع و دیگر شاخص‌ها.

## API

### getPerformance

#### بازگشت

| آرگومان                  | توضیح               | نوع                      |
| ------------------------ | ------------------- | ------------------------ |
| `BasicType \| undefined` | شیء سنجه‌های کارایی | `BasicType \| undefined` |

#### BasicType

| ویژگی          | توضیح                                                        | نوع                   |
| -------------- | ------------------------------------------------------------ | --------------------- |
| `dnsSearch`    | زمان گشایش DNS (میلی‌ثانیه)                                  | `number`              |
| `tcpConnect`   | زمان اتصال TCP (میلی‌ثانیه)                                  | `number`              |
| `sslConnect`   | زمان اتصال امن SSL (میلی‌ثانیه)                              | `number`              |
| `request`      | TTFB؛ زمان درخواست شبکه (میلی‌ثانیه)                         | `number`              |
| `response`     | زمان انتقال داده (میلی‌ثانیه)                                | `number`              |
| `parseDomTree` | زمان تجزیهٔ DOM (میلی‌ثانیه)                                 | `number`              |
| `resource`     | زمان بارگذاری منابع (میلی‌ثانیه)                             | `number`              |
| `domReady`     | زمان تا DOM Ready (میلی‌ثانیه)                               | `number`              |
| `httpHead`     | اندازهٔ سرآیندهای HTTP (بایت)                                | `number`              |
| `interactive`  | زمان تا نخستین تعامل‌پذیری (میلی‌ثانیه)                      | `number`              |
| `complete`     | زمان تا بارگذاری کامل صفحه (میلی‌ثانیه)                      | `number`              |
| `redirect`     | شمار تغییر مسیرها                                            | `number`              |
| `redirectTime` | زمان تغییر مسیرها (میلی‌ثانیه)                               | `number`              |
| `duration`     | زمان کل درخواست منابع (میلی‌ثانیه)                           | `number`              |
| `fp`           | زمان تا نخستین ترسیم (مدت صفحهٔ سفید، میلی‌ثانیه)            | `number \| undefined` |
| `fcp`          | زمان تا نخستین ترسیم محتوایی (پایان نخستین صفحه، میلی‌ثانیه) | `number \| undefined` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('گشایش DNS:', perf.dnsSearch, 'ms');
  console.log('اتصال TCP:', perf.tcpConnect, 'ms');
  console.log('تا نخستین صفحه:', perf.fcp, 'ms');
}
```

### سنجش کارایی

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // دادهٔ کارایی را به سرور بفرست
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### تحلیل کارایی

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== تحلیل کارایی ===');
  console.log('گشایش DNS:', perf.dnsSearch, 'ms');
  console.log('اتصال TCP:', perf.tcpConnect, 'ms');
  console.log('دست‌دادن SSL:', perf.sslConnect, 'ms');
  console.log('پاسخ به درخواست:', perf.request, 'ms');
  console.log('انتقال داده:', perf.response, 'ms');
  console.log('تجزیهٔ DOM:', perf.parseDomTree, 'ms');
  console.log('بارگذاری منابع:', perf.resource, 'ms');
  console.log('نخستین ترسیم:', perf.fp, 'ms');
  console.log('نخستین ترسیم محتوایی:', perf.fcp, 'ms');
}
```

## یادداشت‌ها

۱. **پشتیبانی مرورگر**: مرورگر باید Performance API را داشته باشد؛ همهٔ مرورگرهای امروزی دارند.

۲. **محیط سرور**: در محیط‌های سرور (بدون شیء `window`) مقدار `undefined` برمی‌گردد.

۳. **زمان فراخوانی**: برای داشتن دادهٔ کامل، بهتر است پس از پایان بارگذاری صفحه (رویداد `load`) صدا زده شود.

۴. **یکاها**: همهٔ زمان‌ها بر حسب میلی‌ثانیه و همهٔ اندازه‌ها بر حسب بایت‌اند.

۵. **کاربرد**: معمولاً برای پایش، تحلیل و بهبود کارایی به کار می‌رود.
