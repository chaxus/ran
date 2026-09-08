---
description: 'یک سطح شیشه مات سیال که تاری پس‌زمینه، جابه‌جایی SVG برای خم‌کردن نور و لبه بازتابی را کنار هم می‌گذارد و هرجا backdrop-filter نباشد با متانت افت می‌کند.'
---

# Glass

یک سطح شیشه سیال / مات. `<r-glass>` هرچه پشتش باشد را مات و شکسته نشان می‌دهد: `backdrop-filter` با blur و saturate برای حس مات، یک `feDisplacementMap` در SVG برای خم‌شدن سیال نور، به‌علاوه یک لبه و یک درخشش بازتابی تا چشم آن را شیشه بخواند. همه چیز با توکن اداره می‌شود؛ محتوا در اسلات پیش‌فرض می‌نشیند.

> **کجا به کار می‌آید:** وقتی یک صفحه نیمه‌شفاف روی محتوای پررنگ و شلوغ می‌خواهید (یک کارت شاخص، یک نوار ابزار شناور، یک لایه روی ویدیو). اتریبیوت `displace` تعیین می‌کند چقدر _سیال_ به نظر برسد (۰ یعنی یک شیشه مات صاف). هرجا `backdrop-filter` نباشد، همه جلوه‌ها به یک سطح نیمه‌شفاف ساده افت می‌کنند.

## زمین بازی

شیشه را روی صحنه بکشید، هر اتریبیوت را تنظیم کنید و دقیقاً همان مارک‌آپ را کپی کنید. مقادیر پیش‌فرض همان ظاهر متریال مات iOS است.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> `<r-glass>` را روی محتوای رنگی یا شلوغ بگذارید؛ روی یک پس‌زمینه یکدست این جلوه دیده نمی‌شود.

## تودرتویی

`<r-glass>` ترکیب‌پذیر است: یکی را داخل دیگری بگذارید تا متریال لایه‌لایه شود (مثلاً یک نوار ابزار شیشه‌ای روی یک پنل شیشه‌ای). هر لایه آنچه را پشت خودش است می‌شکند.

<ran-demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">پنل بیرونی</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">نوار ابزار شیشه‌ای تودرتو</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="26">
  <div class="panel">
    پنل بیرونی
    <r-glass radius="16" displace="6">
      <div class="toolbar">نوار ابزار شیشه‌ای تودرتو</div>
    </r-glass>
  </div>
</r-glass>
```

## مرجع API

### ویژگی‌ها

| ویژگی         | نوع       | پیش‌فرض | توضیح                                                                                                                                                                                                          |
| ------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | شعاع تاری پس‌زمینه، بر حسب پیکسل (میزان مات‌شدن).                                                                                                                                                              |
| `saturate`    | `number`  | `180`   | اشباع پس‌زمینه، به درصد: رنگ آنچه پشت شیشه است را بالا می‌کشد.                                                                                                                                                 |
| `displace`    | `number`  | `8`     | شدت شکست سیال (مقیاس جابه‌جایی SVG). `0` یعنی شیشه مات صاف؛ هرچه بیشتر، موج‌دارتر.                                                                                                                             |
| `frequency`   | `number`  | `0.005` | فرکانس پایه آشفتگی: مقدارهای کوچک‌تر موج‌های بزرگ‌تر و نرم‌تر می‌دهند.                                                                                                                                         |
| `radius`      | `number`  | `20`    | شعاع گوشه‌ها، بر حسب پیکسل.                                                                                                                                                                                    |
| `tint`        | `string`  | ملایم   | ته‌رنگ پرکننده شیشه: هر مقدار background در CSS.                                                                                                                                                               |
| `sheen`       | `boolean` | `false` | گذر بازتابی متحرک روی سطح.                                                                                                                                                                                     |
| `interactive` | `boolean` | `false` | بالا آمدن با هاور و کوچک‌شدن با فشار، برای شیشه‌ای که کلیک می‌شود. میزبان را به دکمه‌ای قابل استفاده با صفحه‌کلید هم تبدیل می‌کند: `role="button"`، توقف Tab، و Enter/Space مثل کلیک.                          |
| `rim`         | `boolean` | `false` | لبه بازتابی و حاشیه رنگی اختیاری، برای نوری فیزیکی‌تر. اول WebGL (همیشه و همگام)، و اگر در دسترس باشد در پس‌زمینه به‌طور نامحسوس به WebGPU ارتقا می‌یابد. اگر هیچ‌کدام نبود، به گرادیان بازتابی CSS برمی‌گردد. |

### شکست نور `displace`

`displace` مقیاس `feDisplacementMap` در SVG را می‌راند: اینکه نور با چه شدتی هنگام عبور از سطح خم می‌شود. برای یک شیشه مات ساده آن را `0` بگذارید.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass displace="0">…مات صاف…</r-glass> <r-glass displace="60">…سیال…</r-glass>
```

### درخشش و تعامل

`sheen` یک درخشش بازتابی متحرک اضافه می‌کند؛ `interactive` بالا آمدن با هاور و یک فشار فنری می‌افزاید (با توکن مشترک `--ran-motion-ease-spring`).

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">نشانگر را ببرید و فشار دهید</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive displace="36">
  <div>نشانگر را ببرید و فشار دهید</div>
</r-glass>
```

### Rim — لبه بازتابی روی GPU (اختیاری)

`rim` یک لایه درخشش دوم اضافه می‌کند: یک لبه بازتابی که از یک جهت نور ثابت در بالا-چپ روشن می‌شود، به‌علاوه یک حاشیه رنگی (RGB) بسیار ملایم روی مرز گردشده پنل. برخلاف شکست `displace`، این لایه **هرگز از پس‌زمینه نمونه‌برداری نمی‌کند**: شیدر تنها عرض، ارتفاع و شعاع گوشه خود پنل را می‌داند، پس هیچ‌یک از هزینه‌های تعامل و دسترس‌پذیری را که یک رویکرد GPUی تمام‌پس‌زمینه تحمیل می‌کند نمی‌پردازد (به [یادداشت‌ها](#notes) نگاه کنید). این فقط یک لایه تزئینی روی همان مات `backdrop-filter` است؛ روشن یا خاموش کردنش هرگز آنچه پشت شیشه است یا شیوه نمونه‌برداری از آن را تغییر نمی‌دهد.

نخست با WebGL رسم می‌شود (همگام، و عملاً در هر مرورگری کار می‌کند، پس این لبه هیچ‌وقت اولین رسم خودش را عقب نمی‌اندازد) و اگر مرورگر WebGPU داشته باشد، در پس‌زمینه به‌طور نامحسوس به آن ارتقا می‌یابد (همان جلوه، با خروجی پیکسل‌به‌پیکسل یکسان). وقتی هیچ‌کدام از این دو API در دسترس نباشد (مرورگرهای خیلی قدیمی، غیرفعال‌بودن، SSR) به گرادیان بازتابی CSS برمی‌گردد؛ هیچ حالت خراب یا خالی‌ای نیست که لازم باشد در طراحی پیش‌بینی شود.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">بدون rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…فقط بازتاب CSS…</r-glass> <r-glass rim>…لبه GPU + حاشیه رنگی (WebGL، با ارتقا به WebGPU)…</r-glass>
```

### Partها و توکن‌های CSS

درون عنصر را با `::part(glass)`، `::part(specular)` و (وقتی `rim` تنظیم شده) `::part(rim)` استایل بدهید، یا ویژگی‌های سفارشی `--ran-glass-*` را بازنویسی کنید:

| توکن                                          | کارکرد                                               |
| --------------------------------------------- | ---------------------------------------------------- |
| `--ran-glass-blur`                            | شعاع تاری پس‌زمینه.                                  |
| `--ran-glass-saturate`                        | اشباع پس‌زمینه.                                      |
| `--ran-glass-radius`                          | شعاع گوشه‌ها.                                        |
| `--ran-glass-tint`                            | پس‌زمینه پرکننده.                                    |
| `--ran-glass-border`                          | خط لبه.                                              |
| `--ran-glass-shadow`                          | مجموعه سایه‌ها (درخشش + عمق).                        |
| `--ran-glass-specular-background`             | پس‌زمینه درخشش بازتابی.                              |
| `--ran-glass-specular-opacity`                | شدت بازتاب.                                          |
| `--ran-glass-reduced-transparency-background` | سطح جایگزین وقتی تنظیم «کاهش شفافیت» سیستم روشن است. |
| `--ran-glass-reduced-transparency-shadow`     | سایه جایگزین در همان حالت.                           |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## یادداشت‌ها {#notes}

- **نمونه‌برداری از پس‌زمینه.** `<r-glass>` با `backdrop-filter` دامِ پشت خود را می‌شکند، پس متنِ قابل انتخاب، ویدیوی در حال پخش و عناصر تعاملیِ پشت شیشه همچنان کار می‌کنند. `rim` (بالا) یک لایه GPUی صرفاً تزئینی است که از روی شکل خود پنل حساب می‌شود و هرگز از پس‌زمینه نمونه نمی‌گیرد.
- **خوانایی.** متن اصلی را روی یک سطح داخلی مات نگه دارید؛ کنتراست را تنها به شیشه نسپارید.
- **کاهش شفافیت.** `<r-glass>` به تنظیم سطح‌سیستمی «کاهش شفافیت / افزایش کنتراست» (`prefers-reduced-transparency: reduce`) پاسخ می‌دهد: به‌جای مات‌کردن و شکستن نور، به یک سطح توپر و هماهنگ با پوسته (به‌طور پیش‌فرض `--ran-color-bg-elevated`) سوئیچ می‌کند. کنترل‌های بومی این کار را خودشان می‌کنند؛ این معادلِ همان رفتار برای یک عنصر سفارشی است.
- **تفاوت شکست نور میان مرورگرها.** جلوه سیال `feDisplacementMap` فعلاً فقط در Chromium رسم می‌شود: سافاری و فایرفاکس آن بخش از مقدار `backdrop-filter` را کنار می‌گذارند و مات حاصل از blur / saturate / brightness را نگه می‌دارند، که یک جایگزین درست (هرچند تخت‌تر) است، نه یک حالت خراب.
- **حرکت.** این سطح فقط `transform` را ترنزیشن می‌دهد و هرگز رنگ را، پس جابه‌جایی میان پوسته روشن و تیره در یک فریم تمام می‌شود. درخشش و فشار از `prefers-reduced-motion` پیروی می‌کنند.
