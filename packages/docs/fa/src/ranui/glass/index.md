---
description: 'یک سطح شیشه سیال: یک ماده انتخاب کنید تا هرچه پشتش است را مات کند و در لبه‌ای عدسی‌مانند خم کند. روی تصویر یا ویدیو، خودِ پیکسل‌ها را با WebGL2 می‌شکند.'
---

# Glass

یک سطح شیشه سیال. یک `material` انتخاب کنید و شیشه آماده است: هرچه پشتش باشد را مات می‌کند، آن را در لبه‌ای خمیده مثل یک عدسی خم می‌کند، رنگ‌ها را در لبه کمی از هم جدا می‌کند و لبه را روشن می‌کند. هر مقدار را می‌توان جداگانه با اتریبیوتی هم‌نام بازنویسی کرد. محتوا در اسلات پیش‌فرض می‌نشیند و رنگی می‌گیرد که روی شیشه خوانا باشد.

> **کجا به کار می‌آید:** وقتی یک پنل روی محتوای پررنگ و غنی قرار می‌گیرد: یک کارت شاخص، یک نوار ابزار شناور، یک لایه روی رسانه. روی پس‌زمینه یکدست چیزی برای خم‌کردن نیست و جلوه از بین می‌رود.

## زمین بازی

شیشه را بکشید، ماده و پس‌زمینه را عوض کنید و نشانه‌گذاری را کپی کنید. قطعه کد فقط چیزهایی را دارد که با ماده فرق می‌کنند.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## مواد

چهار ماده بیشتر کاربردها را پوشش می‌دهند. `regular` پیش‌فرض است.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| ماده      | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## روی یک تصویر

وقتی شیشه روی یک `<img>` یا `<video>` قرار دارد، `backdrop` را اضافه کنید. بدون مقدار، اولین تصویر یا ویدیوی والدِ شیشه را برمی‌دارد؛ یک سلکتور مورد دیگری را مشخص می‌کند. سپس شیشه پیکسل‌های آن عنصر را با WebGL2 می‌خواند و هر طول موج را به اندازه خودش می‌شکند، در هر موتوری که WebGL2 دارد؛ در حالی که مسیر CSS فقط در Chromium نور را خم می‌کند. تصویر در صفحه باقی می‌ماند، پس متن alt آن و محتوای اطرافش تغییری نمی‌کنند.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

تصویری از مبدأ دیگر برای خوانده‌شدن به `crossorigin` و یک پاسخ CORS نیاز دارد؛ در غیر این صورت شیشه همان مات CSS خود را نگه می‌دارد.

## ته‌رنگ و رنگ متن

`tone` می‌گوید پشت شیشه چه چیزی است. روی پس‌زمینه تیره یا رنگی، لبه روشن می‌شود و محتوا سفید است؛ روی پس‌زمینه روشن، لبه سفید دیده نمی‌شود، پس لبه سایه می‌خورد و محتوا تیره می‌شود. روی تصویر `backdrop`، ته‌رنگ از روشنایی ناحیه پوشیده‌شده پیروی می‌کند، مگر اینکه خودتان آن را تنظیم کنید. ته‌رنگ فعلی به صورت `:state(light)` و `:state(dark)` در دسترس است و `--ran-glass-ink` رنگ محتوا را بازنویسی می‌کند.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## تودرتویی

`<r-glass>` ترکیب‌پذیر است: یکی را داخل دیگری بگذارید تا مواد لایه‌لایه بسازید، مثل یک نوار ابزار شیشه‌ای روی یک پنل شیشه‌ای. هر لایه آنچه پشتش است را خم می‌کند.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## مرجع API

### ویژگی‌ها

| ویژگی         | نوع       | پیش‌فرض   | توضیح                                                                                                                                                                                           |
| ------------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular` | `thin`، `regular`، `thick` یا `clear`: همه مقادیر نوری زیر را یک‌جا تنظیم می‌کند.                                                                                                               |
| `blur`        | `number`  | از ماده   | شعاع مات‌شدن، بر حسب px.                                                                                                                                                                        |
| `saturate`    | `number`  | از ماده   | اشباع رنگِ آنچه پشت شیشه است، به درصد.                                                                                                                                                          |
| `displace`    | `number`  | از ماده   | اینکه لبه پس‌زمینه را چقدر به داخل می‌کشد، بر حسب px. `0` یعنی یک شیشه صاف.                                                                                                                     |
| `bevel`       | `number`  | از ماده   | پهنای نوار خمیده لبه که نور را خم می‌کند، بر حسب px.                                                                                                                                            |
| `dispersion`  | `number`  | از ماده   | اینکه رنگ‌ها در لبه چقدر از هم جدا می‌شوند، به درصدی از `displace`.                                                                                                                             |
| `specular`    | `number`  | از ماده   | شدت هایلایت‌ها، به درصد.                                                                                                                                                                        |
| `radius`      | `number`  | `20`      | شعاع گوشه‌ها، بر حسب px.                                                                                                                                                                        |
| `tint`        | `string`  | از ماده   | پرکننده روی لایه مات: هر مقدار background در CSS.                                                                                                                                               |
| `tone`        | `string`  | `dark`    | `dark` یا `light`: پشت شیشه چه چیزی است. اگر روی `backdrop` تنظیم نشود، از تصویر پیروی می‌کند.                                                                                                  |
| `backdrop`    | `string`  | —         | یک `<img>` یا `<video>` را با WebGL2 می‌شکند. خالی، اولین مورد در والد را برمی‌دارد؛ یک سلکتور مورد دیگری را مشخص می‌کند.                                                                       |
| `rim`         | `boolean` | `false`   | لبه‌ای که با GPU نورپردازی می‌شود: دیواره بیرونی و درونی، نور اصلی و نور پرکننده، درخشش‌ها. فقط به شکل پنل بستگی دارد.                                                                          |
| `sheen`       | `boolean` | `false`   | هایلایتی که روی سطح جارو می‌کشد.                                                                                                                                                                |
| `interactive` | `boolean` | `false`   | بالا آمدن هنگام hover و بازخورد فشردن، برای شیشه قابل کلیک. میزبان را هم به دکمه‌ای قابل استفاده با صفحه‌کلید تبدیل می‌کند: `role="button"`، یک توقف tab، و Enter و Space مثل کلیک عمل می‌کنند. |

### شکست نور `displace`

`displace` تعیین می‌کند لبه چقدر آنچه پشت شیشه است را به سمت مرکز بکشد، به طوری که پس‌زمینه درست داخل لبه روی آن کشیده شود، همان‌طور که یک لبه محدب ضخیم بزرگنمایی می‌کند. `bevel` پهنای آن نوار خمیده را تعیین می‌کند. بیش از نصف bevel، لبه تصویر را روی خودش برمی‌گرداند، همان کاری که لبه یک شیشه ضخیم واقعی می‌کند.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### درخشش و تعامل

`sheen` یک هایلایت متحرک اضافه می‌کند؛ `interactive` بالا آمدن هنگام hover و فشردنی که بدون جهش به جای خود برمی‌گردد را اضافه می‌کند.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — لبه بازتابی روی GPU (اختیاری)

`rim` لبه را روی GPU می‌کشد: یک دیواره بیرونی روشن و یک دیواره درونی کم‌رنگ‌تر جایی که bevel به سطح صاف می‌رسد، روشن‌شده با یک نور اصلی از بالا چپ و یک نور پرکننده کم‌سو از پایین راست، با ضخامتی که در طول لبه تغییر می‌کند و درخشش‌های گاه‌به‌گاه. با ته‌رنگ `light`، دیواره‌ها به جای روشن شدن سایه می‌خورند. هرگز از پس‌زمینه نمونه نمی‌گیرد: شیدر فقط اندازه، شعاع و bevel پنل را می‌داند. ابتدا با WebGL رندر می‌شود، اگر مرورگر WebGPU داشته باشد در پس‌زمینه به آن منتقل می‌شود، و اگر هیچ‌کدام نباشد هایلایت CSS را دست‌نخورده می‌گذارد.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### Partها و توکن‌های CSS

بخش‌های داخلی را با `::part(glass)`، `::part(specular)`، `::part(refraction)` و، وقتی `rim` تنظیم شده، `::part(rim)` استایل دهید، یا ویژگی‌های سفارشی `--ran-glass-*` را بازنویسی کنید:

| توکن                                          | کارکرد                                                     |
| --------------------------------------------- | ---------------------------------------------------------- |
| `--ran-glass-ink`                             | رنگ محتوا. پیش‌فرض سفید، یا روی ته‌رنگ روشن نزدیک به سیاه. |
| `--ran-glass-tint`                            | پرکننده روی لایه مات.                                      |
| `--ran-glass-border`                          | حاشیه لبه.                                                 |
| `--ran-glass-shadow`                          | پشته سایه‌ها (بازتاب و عمق).                               |
| `--ran-glass-brightness`                      | روشنایی آنچه پشت شیشه است.                                 |
| `--ran-glass-specular-background`             | پس‌زمینه هایلایت CSS.                                      |
| `--ran-glass-specular-opacity`                | شدت هایلایت CSS؛ برای آن لایه جای `specular` را می‌گیرد.   |
| `--ran-glass-reduced-transparency-background` | سطح جایگزین وقتی تنظیم سیستمی «کاهش شفافیت» روشن است.      |
| `--ran-glass-reduced-transparency-shadow`     | سایه جایگزین در همان حالت.                                 |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## یادداشت‌ها {#notes}

- **دو مسیر.** بدون `backdrop`، `backdrop-filter` صفحه زنده پشت شیشه را مات می‌کند، پس متن، ویدیو و کنترل‌های پشت آن همچنان کار می‌کنند؛ لبه عدسی‌مانند با رنگ‌های جداشده یک فیلتر SVG است که در Chromium رندر می‌شود، و سافاری و فایرفاکس فقط مات را نگه می‌دارند. با `backdrop`، WebGL2 همان یک تصویر یا ویدیو را در هر موتوری که WebGL2 دارد می‌شکند.
- **خوانایی.** محتوا رنگ `--ran-glass-ink` را می‌گیرد. متن طولانی را به جای سپردن کنتراست به شیشه، روی یک سطح داخلی مات نگه دارید.
- **کاهش شفافیت.** با تنظیم سیستمی «کاهش شفافیت» یا «افزایش کنتراست» (`prefers-reduced-transparency: reduce`)، شیشه به یک سطح توپر و هماهنگ با پوسته (`--ran-color-bg-elevated`) تبدیل می‌شود، بدون مات‌شدن، شکست نور یا هایلایت.
- **حرکت.** این سطح فقط `transform` را ترنزیشن می‌دهد، پس تغییر پوسته در یک فریم تمام می‌شود. درخشش و فشردن از `prefers-reduced-motion` پیروی می‌کنند.
- **هزینه.** نقشه عدسی SVG وقتی اندازه، شعاع یا bevel پنل تغییر کند دوباره ساخته می‌شود. شکست نور WebGL تا وقتی شیشه دیده می‌شود، در هر فریم یک بار پنل و تصویر را بررسی می‌کند و فقط وقتی یکی از آن‌ها جابه‌جا شده باشد رسم می‌کند.
