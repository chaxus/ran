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

| import                                                | چه دارد                                                  | محیط اجرا       |
| ----------------------------------------------------- | -------------------------------------------------------- | --------------- |
| `ranuts`                                              | بسته ریشه: سطحِ utils به‌همراه visual                    | مرورگر + Node   |
| [`ranuts/utils`](/fa/src/ranuts/utils/)               | DOM/BOM، رشته، شیء، عدد، رنگ، زمان، ذخیره‌سازی …         | مرورگر + Node\* |
| [`ranuts/node`](/fa/src/ranuts/node/)                 | سرور HTTP، مسیریاب، WebSocket، fs، استریم‌ها، میان‌افزار | **فقط Node**    |
| [`ranuts/visual`](/fa/src/ranuts/visual/)             | موتور رسم دوبعدی (Canvas / WebGL / WebGPU)               | **فقط مرورگر**  |
| [`ranuts/i18n`](/fa/src/ranuts/i18n/)                 | موتور ترجمه: واژه‌نامه‌های تخت، تعویض در زمان اجرا       | مرورگر + Node   |
| [`ranuts/sw`](/fa/src/ranuts/sw/)                     | راهبردهای کش و نیمهٔ ورکرِ قرارداد پیش‌کش                | **سرویس‌ورکر**  |
| [`ranuts/vnode`](/fa/src/ranuts/vnode/)               | DOM مجازی به سبک Snabbdom                                | مرورگر          |
| [`ranuts/stream`](/fa/src/ranuts/stream/)             | تحلیل SSE، تاکردن جریان مدل، بودجه توکن                  | مرورگر + Node   |
| [`ranuts/conversation`](/fa/src/ranuts/conversation/) | گزارش رویدادها ← گره‌های گفت‌وگوی قابل رسم               | مرورگر + Node   |

\* دامنه `ranuts/utils` گسترده است: بیشترش رو به مرورگر دارد، اما کمک‌کننده‌های خالص همه‌جا کار می‌کنند. **`ranuts/node` را در کد مرورگر وارد نکنید.** `fs` / `http` / `child_process` را با خود می‌آورد.

## چه چیزهایی در آن هست

**تابعی**: [debounce](/fa/src/ranuts/utils/debounce) · [throttle](/fa/src/ranuts/utils/throttle) ·
[once / singleFlight](/fa/src/ranuts/utils/memoize) ·
[QuestQueue](/fa/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/fa/src/ranuts/utils/with_timeout) ·
[compose](/fa/src/ranuts/utils/compose)

**داده**: [cloneDeep](/fa/src/ranuts/utils/clone_deep) · [isEqual](/fa/src/ranuts/utils/is_equal) ·
[merge](/fa/src/ranuts/utils/merge) · [filterObj](/fa/src/ranuts/utils/filter_obj) ·
[قالب‌بندی و تحلیل عدد](/fa/src/ranuts/utils/parse_number) ·
[تبدیل و آمیختن رنگ](/fa/src/ranuts/utils/color)

**متن**: [md5](/fa/src/ranuts/utils/md5) · [truncate](/fa/src/ranuts/utils/truncate) ·
[detectLanguage](/fa/src/ranuts/utils/detect_language) ·
[resolveLocale](/fa/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/fa/src/ranuts/utils/segment) · [paginate](/fa/src/ranuts/utils/paginate) ·
[escapeHtml](/fa/src/ranuts/utils/escape_html)

**مرورگر**: [ذخیره‌سازی](/fa/src/ranuts/utils/local_storage) ·
[IndexedDB](/fa/src/ranuts/utils/web_db) · [کلاینت ورکر](/fa/src/ranuts/utils/worker_client) ·
[پل postMessage](/fa/src/ranuts/bridge/) · [پیش‌واکشی](/fa/src/ranuts/utils/prefetch) ·
[تشخیص دستگاه](/fa/src/ranuts/utils/current_device) ·
[کارایی](/fa/src/ranuts/utils/get_performance) · [ZIP](/fa/src/ranuts/utils/zip) ·
[ضبط صدا](/fa/src/ranuts/utils/audio_recorder) ·
[گفتار به متن](/fa/src/ranuts/utils/speech)

**هوش مصنوعی و گفت‌وگو**: [stream](/fa/src/ranuts/stream/) · [conversation](/fa/src/ranuts/conversation/) ·
[i18n](/fa/src/ranuts/i18n/)

**رسم**: [موتور دوبعدی](/fa/src/ranuts/visual/) · [DOM مجازی](/fa/src/ranuts/vnode/) ·
[کمک‌کننده‌های canvas](/fa/src/ranuts/utils/canvas) · [tween](/fa/src/ranuts/utils/tween)

**Node**: [سرور HTTP و مسیریاب](/fa/src/ranuts/node/) ·
[کار با فایل](/fa/src/ranuts/file/write_file) ·
[نوع‌های MIME](/fa/src/ranuts/mime_type/mime_type)

این‌ها گزیده‌اند. [مرجع API](/fa/src/ranuts/api) **همه** خروجی‌ها را با امضا و توضیحشان دارد و چون از روی سورس تولید می‌شود نمی‌تواند از واقعیت فاصله بگیرد.

## بعد کجا برویم

| اگر می‌خواهید…                           | این را بخوانید                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| بدانید تابعی هست یا نه و امضایش چیست     | [مرجع API](/fa/src/ranuts/api)                                                  |
| میان دو ابزار شبیه به هم یکی را برگزینید | [انتخاب ابزار](/fa/src/ranuts/choosing/)                                        |
| بر پایه دسته‌بندی مرور کنید              | [فهرست ابزارها](/fa/src/ranuts/utils/)                                          |
| پاسخ استریم‌شده یک مدل را رسم کنید       | [stream](/fa/src/ranuts/stream/) ← [conversation](/fa/src/ranuts/conversation/) |
| رابط کاربری روی آن بسازید                | [ranui](/fa/src/ranui/)                                                         |

هر دو بسته یک `CLAUDE.md` را درون تاربال npm همراه دارند: راهنمای آغازین برای عامل‌های کدنویس، که بی‌نیاز از شبکه مستقیم از `node_modules` خواندنی است.
