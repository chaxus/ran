---
description: 'ranuts یک کتابخانه ابزار جاوااسکریپت/تایپ‌اسکریپت با قابلیت tree-shaking است: DOM/BOM، کمک‌کننده‌های رشته و شیء و عدد و رنگ، ذخیره‌سازی، استریم، یک موتور رسم دوبعدی و یک DOM مجازی.'
---

# ranuts

کتابخانه‌ای از ابزارها برای سمت کاربر و برای Node، که به‌شکل **نقاط ورودیِ مستقل و tree-shaking‌پذیر** منتشر می‌شود. از همان زیرمسیری وارد کنید که چیز موردنیازتان در آن است، بقیه هرگز به باندل شما نمی‌رسد. همه‌چیز TypeScript است و هر خروجی از روی سورس مستند می‌شود.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **سورس**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## نقاط ورودی

| import                                                | چه دارد                                            | محیط اجرا       |
| ----------------------------------------------------- | -------------------------------------------------- | --------------- |
| `ranuts`                                              | بسته ریشه: سطحِ utils به‌همراه visual              | مرورگر + Node   |
| [`ranuts/utils`](/fa/ranuts/utils/)               | DOM/BOM، رشته، شیء، عدد، رنگ، زمان، ذخیره‌سازی …   | مرورگر + Node\* |
| [`ranuts/visual`](/fa/ranuts/visual/)             | موتور رسم دوبعدی (Canvas / WebGL / WebGPU)         | **فقط مرورگر**  |
| [`ranuts/i18n`](/fa/ranuts/i18n/)                 | موتور ترجمه: واژه‌نامه‌های تخت، تعویض در زمان اجرا | مرورگر + Node   |
| [`ranuts/sw`](/fa/ranuts/sw/)                     | راهبردهای کش و نیمهٔ ورکرِ قرارداد پیش‌کش          | **سرویس‌ورکر**  |
| [`ranuts/vnode`](/fa/ranuts/vnode/)               | DOM مجازی به سبک Snabbdom                          | مرورگر          |
| [`ranuts/stream`](/fa/ranuts/stream/)             | تحلیل SSE، تاکردن جریان مدل، بودجه توکن            | مرورگر + Node   |
| [`ranuts/conversation`](/fa/ranuts/conversation/) | گزارش رویدادها ← گره‌های گفت‌وگوی قابل رسم         | مرورگر + Node   |

## چه چیزهایی در آن هست

**تابعی**: [debounce](/fa/ranuts/utils/debounce) · [throttle](/fa/ranuts/utils/throttle) ·
[once / singleFlight](/fa/ranuts/utils/memoize) ·
[QuestQueue](/fa/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/fa/ranuts/utils/with_timeout) ·
[compose](/fa/ranuts/utils/compose)

**داده**: [cloneDeep](/fa/ranuts/utils/clone_deep) · [isEqual](/fa/ranuts/utils/is_equal) ·
[merge](/fa/ranuts/utils/merge) · [filterObj](/fa/ranuts/utils/filter_obj) ·
[قالب‌بندی و تحلیل عدد](/fa/ranuts/utils/parse_number) ·
[تبدیل و آمیختن رنگ](/fa/ranuts/utils/color)

**متن**: [truncate](/fa/ranuts/utils/truncate) ·
[detectLanguage](/fa/ranuts/utils/detect_language) ·
[resolveLocale](/fa/ranuts/utils/resolve_locale) ·
[segmentByRanges](/fa/ranuts/utils/segment) · [paginate](/fa/ranuts/utils/paginate) ·
[escapeHtml](/fa/ranuts/utils/escape_html)

**مرورگر**: [ذخیره‌سازی](/fa/ranuts/utils/local_storage) ·
[IndexedDB](/fa/ranuts/utils/web_db) · [کلاینت ورکر](/fa/ranuts/utils/worker_client) ·
[پل postMessage](/fa/ranuts/bridge/) · [پیش‌واکشی](/fa/ranuts/utils/prefetch) ·
[تشخیص دستگاه](/fa/ranuts/utils/current_device) ·
[کارایی](/fa/ranuts/utils/get_performance) · [ZIP](/fa/ranuts/utils/zip) ·
[ضبط صدا](/fa/ranuts/utils/audio_recorder) ·
[گفتار به متن](/fa/ranuts/utils/speech)

**هوش مصنوعی و گفت‌وگو**: [stream](/fa/ranuts/stream/) · [conversation](/fa/ranuts/conversation/) ·
[i18n](/fa/ranuts/i18n/)

**رسم**: [موتور دوبعدی](/fa/ranuts/visual/) · [DOM مجازی](/fa/ranuts/vnode/) ·
[کمک‌کننده‌های canvas](/fa/ranuts/utils/canvas) · [tween](/fa/ranuts/utils/tween)

این‌ها گزیده‌اند. [مرجع API](/fa/ranuts/api) **همه** خروجی‌ها را با امضا و توضیحشان دارد و چون از روی سورس تولید می‌شود نمی‌تواند از واقعیت فاصله بگیرد.

## بعد کجا برویم

| اگر می‌خواهید…                           | این را بخوانید                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| بدانید تابعی هست یا نه و امضایش چیست     | [مرجع API](/fa/ranuts/api)                                                  |
| میان دو ابزار شبیه به هم یکی را برگزینید | [انتخاب ابزار](/fa/ranuts/choosing/)                                        |
| بر پایه دسته‌بندی مرور کنید              | [فهرست ابزارها](/fa/ranuts/utils/)                                          |
| پاسخ استریم‌شده یک مدل را رسم کنید       | [stream](/fa/ranuts/stream/) ← [conversation](/fa/ranuts/conversation/) |
| رابط کاربری روی آن بسازید                | [ranui](/fa/ranui/)                                                         |

هر دو بسته یک `CLAUDE.md` را درون تاربال npm همراه دارند: راهنمای آغازین برای عامل‌های کدنویس، که بی‌نیاز از شبکه مستقیم از `node_modules` خواندنی است.
