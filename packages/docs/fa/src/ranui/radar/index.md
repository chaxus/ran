---
description: 'نمودار راداری (تارعنکبوتی) برای سنجش چند شاخص از یک مجموعه‌داده روی بوم دوبعدی.'
---

# Radar

نمودار راداری برای سنجش چند شاخص از یک مجموعه‌داده روی بومی دوبعدی.

> **کجا به کارش ببرید**: وقتی به نمودار راداری نیاز دارید تا چند شاخص از یک مجموعه‌داده را با هم بسنجید. آرایه‌ای JSON از نام محورها و امتیازها را از راه ویژگی `abilitys` به `<r-radar>` بدهید.

## شروع سریع

### استفادهٔ پایه

داده از راه ویژگی `abilitys` و به‌شکل **رشتهٔ JSON** (آرایه‌ای از شیءها) داده می‌شود. چون ویژگی‌های HTML تنها رشته نگه می‌دارند، مقدار باید JSON معتبر باشد؛ درون کامپوننت با `JSON.parse` تجزیه می‌شود. میزبان `<r-radar>` اندازهٔ ذاتی ندارد، پس عرض و ارتفاع صریح به آن بدهید.

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

می‌توانید داده را دستوری هم از راه خصیصهٔ JS به نام `abilitys` تعیین کنید؛ این خصیصه هم آرایه می‌پذیرد (که دوباره به‌شکل رشته روی ویژگی نوشته می‌شود) و هم رشتهٔ JSON:

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: 'جان', scoreRate: 10 },
  { abilityName: 'حمله', scoreRate: 90 },
  { abilityName: 'دفاع', scoreRate: 20 },
];
chart.append(radar);
```

## مرجع API

### خصیصه‌ها

| خصیصه          | نوع                | پیش‌فرض                                      | توضیح                                                      |
| -------------- | ------------------ | -------------------------------------------- | ---------------------------------------------------------- |
| `abilitys`     | `string` / `Array` | `''`                                         | دادهٔ نمودار به‌شکل رشتهٔ JSON (یا آرایه از راه خصیصهٔ JS) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | رنگ چندضلعی‌های هم‌مرکز شبکه                               |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | رنگ خطوط محور و لبهٔ بیرونی                                |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | رنگ پرشدگی ناحیهٔ داده                                     |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | رنگ خط پیرامون ناحیه و نقطه‌های رأس                        |
| `sheet`        | `string`           | `''`                                         | CSS تزریق‌شده به shadow DOM کامپوننت                       |

هر مدخل آرایهٔ `abilitys` این کلیدها را می‌پذیرد:

| کلید              | نوع      | الزامی | توضیح                                        |
| ----------------- | -------- | ------ | -------------------------------------------- |
| `abilityName`     | `string` | بله    | متن برچسب محور                               |
| `scoreRate`       | `number` | بله    | مقدار روی آن محور؛ سقف شبکه `100` است        |
| `backgroundColor` | `string` | خیر    | رنگ زمینهٔ برچسب (پیش‌فرض شفاف)              |
| `fontSize`        | `number` | خیر    | اندازهٔ قلم برچسب (پیش‌فرض متناسب با نمودار) |
| `fontColor`       | `string` | خیر    | رنگ متن برچسب (پیش‌فرض `--ran-color-text`)   |
| `fontFamily`      | `string` | خیر    | خانوادهٔ قلم برچسب (پیش‌فرض `SimHei`)        |

> یادداشت: `colorPolygon`، `colorLine`، `fillColor` و `strokeColor` بدون حساسیت به بزرگی و کوچکی حروف خوانده می‌شوند، پس چه ویژگی از ابتدا باشد و چه پس از mount عوض شود، درست ترسیم می‌شوند؛ به‌روزرسانی هرکدام نمودار را دوباره می‌کشد. برای استایلی که از پوسته پیروی کند، متغیرهای CSS پایین‌تر را ترجیح دهید.

### دادهٔ نمودار `abilitys`

استایل برچسب هر محور (`backgroundColor`، `fontSize`، `fontColor`) را می‌توان روی مدخل‌های جداگانه تعیین کرد:

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"جان","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"جان","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

### رنگ چندضلعی شبکه `colorPolygon`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

### رنگ خط محور `colorLine`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

### رنگ پرشدگی ناحیه `fillColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

### رنگ خط پیرامون ناحیه `strokeColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"جان","scoreRate":"10"},{"abilityName":"حمله","scoreRate":"90"},{"abilityName":"دفاع","scoreRate":"20"},{"abilityName":"تسلط عنصری","scoreRate":"50"},{"abilityName":"شانس ضربهٔ بحرانی","scoreRate":"80"},{"abilityName":"آسیب بحرانی","scoreRate":"50"}]'
></r-radar>
```

### دادهٔ نمونهٔ کامل

چون `attribute` در HTML تنها می‌تواند `string` حمل کند، داده‌ای که می‌دهید باید رشتهٔ `json` باشد که با `JSON.parse` دوباره به آرایه‌ای از شیءها تبدیل می‌شود؛ `JSON` بدشکل تجزیه نمی‌شود:

```json
[
  {
    "abilityName": "جان",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "حمله",
    "scoreRate": "90"
  },
  {
    "abilityName": "دفاع",
    "scoreRate": "20"
  },
  {
    "abilityName": "تسلط عنصری",
    "scoreRate": "50"
  },
  {
    "abilityName": "شانس ضربهٔ بحرانی",
    "scoreRate": "80"
  },
  {
    "abilityName": "آسیب بحرانی",
    "scoreRate": "50"
  }
]
```

### متغیرهای CSS

رنگ‌های نمودار را می‌توان (به‌شکل واکنشی نسبت به پوسته) با ویژگی‌های سفارشی CSS روی میزبان هم تعیین کرد:

| متغیر                       | پیش‌فرض                               | توضیح                      |
| --------------------------- | ------------------------------------- | -------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | رنگ چندضلعی شبکه           |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | رنگ خط محور                |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | رنگ پرشدگی ناحیهٔ داده     |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | رنگ خط پیرامون ناحیهٔ داده |
| `--ran-radar-width`         | `100%`                                | عرض نگه‌دارندهٔ بوم        |
| `--ran-radar-height`        | `100%`                                | ارتفاع نگه‌دارندهٔ بوم     |
| `--ran-radar-display`       | `block`                               | `display` نگه‌دارندهٔ بوم  |
| `--ran-radar-position`      | `relative`                            | `position` نگه‌دارندهٔ بوم |

رنگ متن برچسب‌ها هم به توکن پوستهٔ `--ran-color-text` برمی‌گردد، پس برچسب‌ها در حالت روشن و تیره خوانا می‌مانند.

## رویدادها

ندارد. `<r-radar>` هیچ رویداد سفارشی‌ای ارسال نمی‌کند.

## بهترین شیوه‌ها

- **اندازه‌گذاری**: میزبان اندازهٔ ذاتی ندارد؛ همیشه `width`/`height` صریح بدهید (با `style` یا با متغیرهای `--ran-radar-width`/`--ran-radar-height`). نمودار با `ResizeObserver` تغییر اندازهٔ نگه‌دارنده را می‌فهمد و خودش دوباره کشیده می‌شود.
- **قالب داده**: در `abilitys` فقط JSON معتبر بدهید؛ JSON بدشکل ثبت می‌شود و تجزیه‌شدنی نیست. وقتی در کد با آرایه‌های واقعی کار می‌کنید از خصیصهٔ JS به نام `abilitys` استفاده کنید.
- **مقیاس**: `scoreRate` نسبت به بیشینهٔ ثابت `100` سنجیده می‌شود؛ مقدارهایتان را به همان بازه ببرید.
- **پوسته‌دهی**: ویژگی‌های رنگ (`colorPolygon`، `colorLine`، `fillColor`، `strokeColor`) واکنشی‌اند و اگر پس از mount عوض شوند نمودار را دوباره می‌کشند. اگر می‌خواهید رنگ‌ها خودبه‌خود از پوستهٔ روشن/تیره پیروی کنند، متغیرهای `--ran-radar-*` را ترجیح دهید.
