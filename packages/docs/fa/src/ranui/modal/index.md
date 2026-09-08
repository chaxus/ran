---
description: 'مودال ranui (<r-modal>) یک دیالوگ برای تعامل‌های متمرکز است، با به‌دام‌انداختن فوکوس، قفل اسکرول، بی‌اثر کردن پس‌زمینه و یک API دستوری به نام Modal.confirm.'
---

# Modal

کامپوننت دیالوگ برای تعامل‌های متمرکز روی صفحه جاری، همراه با به‌دام‌انداختن فوکوس، قفل اسکرول و بی‌اثر کردن پس‌زمینه.

> **کجا به کار می‌آید:** وقتی به دیالوگی برای یک تعامل متمرکز روی صفحه نیاز دارید، با به‌دام‌انداختن فوکوس، قفل اسکرول و بی‌اثر کردن پس‌زمینه. `<r-modal>` را با اتریبیوت `open` یا با کمک‌کننده‌های دستوری `Modal.confirm` / `Modal.info` بگردانید.

## شروع سریع

### کاربرد پایه

دیده‌شدن مودال را اتریبیوت `open` (یا ویژگی `open`) تعیین می‌کند. در آغاز بسته است و تا باز نشود چیزی رسم نمی‌کند، پس یک محرک برای باز و بسته کردنش سیم‌کشی کنید.

<ran-demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">باز کردن مودال</r-button>
  <r-modal id="quickstart-modal" heading="مودال پایه">
    <p>این محتوای مودال است.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">تأیید</r-button>
    </div>
  </r-modal>
</ran-demo>

```html
<r-button onclick="modal.open = true">باز کردن مودال</r-button>

<r-modal id="modal" heading="مودال پایه">
  <p>این محتوای مودال است.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">تأیید</r-button>
  </div>
</r-modal>
```

## مرجع API

### ویژگی‌ها

| ویژگی          | نوع       | پیش‌فرض | توضیح                                                           |
| -------------- | --------- | ------- | --------------------------------------------------------------- |
| `open`         | `boolean` | `false` | اینکه مودال دیده می‌شود یا نه                                   |
| `heading`      | `string`  | `''`    | متن عنوان سربرگ (وقتی خالی باشد به `Modal` برمی‌گردد)           |
| `closable`     | `boolean` | `true`  | اینکه دکمه بستن (`x`) نمایش داده شود یا نه                      |
| `maskClosable` | `boolean` | `true`  | اینکه کلیک روی ماسک پس‌زمینه مودال را ببندد یا نه               |
| `closeOnEsc`   | `boolean` | `true`  | اینکه فشردن `Escape` مودال را ببندد یا نه                       |
| `lockScroll`   | `boolean` | `true`  | اینکه تا وقتی مودال باز است اسکرول body قفل شود یا نه           |
| `autoFocus`    | `boolean` | `true`  | اینکه هنگام باز شدن، اولین عنصر فوکوس‌پذیر فوکوس بگیرد یا نه    |
| `hideHeader`   | `boolean` | `false` | نوار عنوان را یکسره حذف می‌کند و فقط یک دکمه بستن شناور می‌ماند |
| `sheet`        | `string`  | `''`    | CSSی که به Shadow DOM تزریق می‌شود                              |

`closing` یک اتریبیوت فقط‌خواندنی است که عنصر روی خودش بازتاب می‌دهد (نه ویژگی‌ای که بشود مقدار داد): از همان لحظه‌ای که `close()` اجرا می‌شود تا وقتی گذارِ محوشدن و کوچک‌شدنِ ماسک و دیالوگ واقعاً تمام شود حاضر است (حدود ۰٫۳ ثانیه بعد، هم‌زمان با رویداد `afterclose`). برای صفحه میزبانی مفید است که لازم دارد در طول آن دنباله بصری هم مودال همچنان «حاضر» شمرده شود؛ بهترین شیوه‌ها در پایین را ببینید.

### عنوان `title`

```html
<r-modal open heading="حذف مورد">
  <p>مطمئنید که می‌خواهید این مورد را حذف کنید؟</p>
</r-modal>
```

### دکمه بستن `closable`

دکمه بستن سربرگ را پنهان می‌کند تا مودال فقط از راه کنترل‌های خودتان بسته شود.

```html
<r-modal open heading="شرایط" closable="false">
  <p>برای ادامه باید شرایط را بپذیرید.</p>
  <div slot="footer">
    <r-button type="primary">می‌پذیرم</r-button>
  </div>
</r-modal>
```

### بستن با ماسک `maskClosable`

به‌طور پیش‌فرض کلیک روی پس‌زمینه مودال را می‌بندد. با `false` می‌توانید یک کنش صریح را الزامی کنید.

```html
<r-modal open heading="تغییرات ذخیره‌نشده" maskClosable="false">
  <p>کلیک بیرون، این دیالوگ را نمی‌بندد.</p>
</r-modal>
```

### بستن با Escape `closeOnEsc`

```html
<r-modal open heading="گزارش" closeOnEsc="false">
  <p>کلید Escape برای این دیالوگ غیرفعال است.</p>
</r-modal>
```

### قفل اسکرول `lockScroll`

```html
<r-modal open heading="پیش‌نمایش" lockScroll="false">
  <p>صفحه پشت مودال همچنان اسکرول می‌شود.</p>
</r-modal>
```

### فوکوس خودکار `autoFocus`

```html
<r-modal open heading="جستجو" autoFocus="false">
  <input type="text" placeholder="برای جستجو تایپ کنید" />
</r-modal>
```

### حالت بدون سربرگ `hideHeader`

نوار عنوان و خط جداکننده‌اش را یکسره حذف می‌کند و وقتی `closable` باشد فقط یک دکمه بستن شناور (بالا-راست) می‌ماند. مناسبِ دیالوگ‌هایی که فقط محتوا هستند، مثل لایت‌باکس تصویر یا نمودار، که نوار عنوان در آن‌ها جز خوردن فضای محتوا کاری نمی‌کند. دیالوگ حتی بدون عنوان دیدنیِ `<h3>` هم نام دسترس‌پذیرش را از `aria-label` (برگرفته از `title`) نگه می‌دارد، پس در این حالت هم `title` را برای برچسب صفحه‌خوان تنظیم کنید.

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="نمودار معماری" style="display: block; max-width: 100%;" />
</r-modal>
```

## اسلات‌ها

| اسلات     | توضیح                                                    |
| --------- | -------------------------------------------------------- |
| (پیش‌فرض) | محتوای بدنه مودال                                        |
| `footer`  | کنش‌های پاورقی؛ نوار پاورقی فقط وقتی پر باشد دیده می‌شود |

```html
<r-modal open heading="تأیید">
  <p>محتوای بدنه در اسلات پیش‌فرض می‌نشیند.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">انصراف</r-button>
    <r-button type="primary">تأیید</r-button>
  </div>
</r-modal>
```

## رویدادها

همه رویدادهای مربوط به بسته‌شدن، در `event.detail` یک `trigger` دارند که می‌گوید چه چیزی باعث بسته شدن شده است: `'mask'`، `'button'`، `'escape'` یا `'program'`.

| رویداد        | لغوپذیر | `detail`      | توضیح                                                     |
| ------------- | ------- | ------------- | --------------------------------------------------------- |
| `beforeopen`  | بله     | —             | پیش از باز شدن؛ برای لغو `preventDefault()` را صدا بزنید  |
| `open`        | خیر     | —             | وقتی مودال باز می‌شود                                     |
| `afteropen`   | خیر     | —             | پس از پایان گذار باز شدن                                  |
| `beforeclose` | بله     | `{ trigger }` | پیش از بسته شدن؛ برای لغو `preventDefault()` را صدا بزنید |
| `close`       | خیر     | `{ trigger }` | وقتی مودال بسته می‌شود                                    |
| `afterclose`  | خیر     | `{ trigger }` | پس از پایان گذار بسته شدن                                 |

```html
<r-modal id="modal" heading="نمونه"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('تغییرات دور ریخته شود؟')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('بسته شد از راه', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## API برنامه‌نویسی

کلاس `Modal` کمک‌کننده‌های استاتیکی دارد که بدون هیچ مارک‌آپی یک مودال می‌سازند، سوار می‌کنند و نتیجه‌اش را برمی‌گردانند. هرکدام یک `Promise<{ action, trigger }>` می‌دهند که در آن `action` یکی از `'confirm'`، `'cancel'` یا `'dismiss'` است.

| متد                   | توضیح                                      |
| --------------------- | ------------------------------------------ |
| `Modal.open(opts)`    | باز کردن مودالی با یک دکمه تأیید           |
| `Modal.confirm(opts)` | باز کردن مودالی با دکمه‌های تأیید و انصراف |
| `Modal.info(opts)`    | مودال اطلاع‌رسانی (عنوان پیش‌فرض `Info`)   |
| `Modal.success(opts)` | مودال موفقیت (عنوان پیش‌فرض `Success`)     |
| `Modal.warning(opts)` | مودال هشدار (عنوان پیش‌فرض `Warning`)      |
| `Modal.error(opts)`   | مودال خطا (عنوان پیش‌فرض `Error`)          |

گزینه‌ها (همه اختیاری): `title`، `content`، `okText`، `cancelText`، `showCancel`، `maskClosable`، `closeOnEsc`، `lockScroll`، `autoFocus`، `closable`، `onConfirm`، `onCancel`. اگر `onConfirm` / `onCancel` مقدار `false` (یا پرامیسی که به `false` می‌رسد) برگردانند، مودال باز می‌ماند.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'حذف پروژه',
  content: 'این کار برگشت‌پذیر نیست.',
  okText: 'حذف',
  cancelText: 'نگه‌داشتن',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // حذف شد
}
```

## Partهای CSS

قطعه‌های درونی را با `::part()` استایل بدهید.

| Part     | توضیح                       |
| -------- | --------------------------- |
| `root`   | ظرف بیرونی لایه پوششی       |
| `mask`   | پس‌زمینه پشت دیالوگ         |
| `dialog` | خودِ جعبه دیالوگ            |
| `header` | نوار سربرگ                  |
| `title`  | تیتر عنوان                  |
| `close`  | دکمه بستن (`x`)             |
| `body`   | ناحیه بدنه با قابلیت اسکرول |
| `footer` | نوار کنش‌های پاورقی         |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## استایل‌دهی

`<r-modal>` **۲۳ ویژگی سفارشی CSS** از آنِ خود دارد، به‌علاوه توکن‌های معنایی که از پوسته می‌خواند. هر جا که ارث برسد می‌توانید یکی را تعیین کنید: `:root`، یک دربرگیرنده، یا خود عنصر:

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Partها: `body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#modal) است؛ اینکه کدام توکن را به کار ببرید در [سیستم طراحی](/fa/src/ranui/design-system/) آمده.

## بهترین شیوه‌ها

- **محرک و جابه‌جایی**: با `modal.open = true` باز کنید و با `modal.open = false` ببندید، یا `close()` را صدا بزنید.
- **جلوی بستن‌های ویرانگر را بگیرید**: به `beforeclose` گوش دهید و با `preventDefault()` پیش از دور ریختن کار ذخیره‌نشده تأیید بگیرید.
- **کنش‌های پاورقی**: دکمه‌های اصلی و فرعی را در `slot="footer"` بگذارید؛ نوار پاورقی فقط وقتی اسلات محتوا داشته باشد ظاهر می‌شود.
- **جریان‌های بی‌راه‌فرار**: با `closable="false"` و `maskClosable="false"` انتخاب صریح را الزامی کنید.
- **دیالوگ‌های یک‌بارمصرف**: برای پرسش‌های سریع به‌جای نوشتن مارک‌آپ از `Modal.confirm` / `Modal.info` استفاده کنید.
- **بالا بردن صفحه میزبان روی مودالِ باز**: به `:has(r-modal[open]), :has(r-modal[closing])` تطبیق دهید، نه فقط `[open]`. `open` همان لحظه‌ای که `close()` اجرا می‌شود برداشته می‌شود، اما گذار ماسک و دیالوگ حدود ۰٫۳ ثانیه دیگر هم رسم می‌شود؛ اگر ارتقای z-index را وسط محو شدن رها کنید، ماسکِ هنوز دیدنی زیر همان چیزی که رویش برده بودید دوباره رسم می‌شود.
