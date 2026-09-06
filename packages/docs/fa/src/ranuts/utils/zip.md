# zip

خواندن و دستکاری بایگانی‌های ZIP بدون هیچ وابستگی، با همان DEFLATE خودِ بستر.

ZIP همان ظرفی است که پشت OOXML (`.docx`، `.xlsx`، `.pptx`)، EPUB، ODF و افزونه‌های مرورگر نشسته است. «یک فایل از این بایگانی بیرون بکش» و «یک فایل درون این بایگانی را از نو بنویس» مدام پیش می‌آید، و یک کتابخانهٔ کامل ZIP برای همین‌قدر کار، وابستگی سنگینی است. تنها چیزی که این دو کار لازم دارند فهرست مرکزی است و DEFLATE، و DEFLATE امروز در همهٔ مرورگرها با نام `DecompressionStream` حاضر است.

## API

| تابع                               | توضیح                                                                 |
| ---------------------------------- | --------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | فهرست مرکزی را می‌خواند و `ZipEntry[]` می‌دهد؛ اگر ZIP نباشد `[]`     |
| `readZipEntry(bytes, nameOrEntry)` | یک مدخل را باز می‌کند؛ اگر نباشد یا پشتیبانی نشود `null`              |
| `zipHasEntry(bytes, name)`         | آیا مدخلی دقیقاً با همین نام وجود دارد                                |
| `rewriteZip(bytes, options)`       | بایگانی را با مدخل‌های جایگزین‌شده یا مدخل‌های تازه از نو می‌سازد     |
| `createZip(files)`                 | بایگانی‌ای را از صفر می‌سازد؛ همهٔ مدخل‌ها STORED                     |
| `crc32(data)`                      | همان CRC32 استاندارد IEEE، درستی‌سنجی که ZIP برای هر مدخل نگه می‌دارد |
| `inflateRaw(data)`                 | بایت‌های خام DEFLATE را باز می‌کند (بدون پوستهٔ zlib یا gzip)         |

### `rewriteZip` options

| گزینه       | توضیح                                                                              | پیش‌فرض      |
| ----------- | ---------------------------------------------------------------------------------- | ------------ |
| `filter`    | اینکه کدام مدخل‌ها باز شوند و به `transform` سپرده شوند                            | همهٔ فایل‌ها |
| `transform` | `(data, entry) => Uint8Array \| string \| null`؛ با `null` مدخل دست‌نخورده می‌ماند | —            |
| `inject`    | مدخل‌های کاملاً تازه برای افزودن: `{ name, data }[]`                               | —            |

### `ZipEntry`

| فیلد                                        | توضیح                                              |
| ------------------------------------------- | -------------------------------------------------- |
| `name`                                      | مسیر درون بایگانی، مثلاً `word/document.xml`       |
| `compression`                               | `ZIP_STORED` (۰) یا `ZIP_DEFLATE` (۸)              |
| `crc`، `compressedSize`، `uncompressedSize` | همان‌گونه که در فهرست مرکزی ثبت شده                |
| `modTime`، `modDate`                        | مهر زمانی فشردهٔ MS-DOS؛ هنگام بازنویسی حفظ می‌شود |
| `directory`                                 | آیا نام به `/` ختم می‌شود                          |
| `dataStart`                                 | جایی که بایت‌های فشرده در منبع آغاز می‌شوند        |

## نمونه

### بیرون کشیدن یک فایل از `.docx`

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### فهرست کردن آنچه درون آن است

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### دستکاری همهٔ بخش‌های XML و افزودن یک فایل

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### بیرون کشیدن رسانهٔ جاسازی‌شده در قالب object URL

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### ساختن یک ظرف

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## یادداشت‌ها

1. **STORED و DEFLATE را می‌خواند.** روش‌های فشرده‌سازی دیگر در `readZipEntries` دیده می‌شوند، اما `readZipEntry` به‌جای حدس زدن، برایشان `null` برمی‌گرداند.

2. **آنچه از نو نوشته می‌شود فشرده نیست.** مدخل‌های جایگزین‌شده و مدخل‌های تازه به‌صورت STORED نوشته می‌شوند، پس خروجی از ورودی بزرگ‌تر است. مدخل‌های دست‌نخورده بایت‌های فشردهٔ اصلی خود را عیناً نگه می‌دارند. برای «دستکاری کن و تحویل بده» معاملهٔ درستی است و برای بایگانی کردن، معاملهٔ نادرست.

3. **اگر چیزی تغییر نکرده باشد، `rewriteZip` همان آرایهٔ اصلی را برمی‌گرداند** — از جمله وقتی که یک دگرگونی، بایت‌های یکسان تحویل دهد. این مسیر هیچ هزینه‌ای ندارد و نتیجه را می‌توان با `===` سنجید.

4. **اندازه‌ها از فهرست مرکزی می‌آیند، هرگز از سرآیندهای محلی.** بایگانی‌هایی که نویسنده‌ای جریانی ساخته است، بیت ۳ پرچم همه‌منظوره را می‌گذارند و در سرآیند محلی صفر باقی می‌گذارند و مقدارهای واقعی را _پس از_ بایت‌های فشرده در یک توصیف‌گر داده می‌نویسند. اعتماد به سرآیندهای محلی رایج‌ترین راهی است که یک خوانندهٔ دست‌ساز ZIP بر سر فایل‌های واقعی از کار می‌افتد؛ `rewriteZip` سرآیندهای محلی را هم از نو می‌نویسد و آن پرچم را پاک می‌کند، پس خروجی‌اش را تجزیه‌گرهای سخت‌گیر هم می‌خوانند.

5. **اگر دگرگونی شکست بخورد، مدخل سر جایش می‌ماند.** اگر `transform` خطا بیندازد، یا مدخل از روشی استفاده کند که پشتیبانی نمی‌شود، محتوای اصلی همان‌طور عبور داده می‌شود؛ بازنویسی هرگز نباید داده‌ای را که نفهمیده است از دست بدهد.

6. **بدون ZIP64، بدون رمزگذاری، بدون چنددیسکی.** بایگانی‌های بزرگ‌تر از ۴ گیبی‌بایت یا با بیش از ۶۵۵۳۵ مدخل بیرون از دامنهٔ کارند. `readZipEntries` برای هر چیزی که نتواند تجزیه کند به‌جای خطا انداختن `[]` برمی‌گرداند، چون معمولاً فراخوان دارد فایلی را وارسی می‌کند که کاربر داده است.

7. **`inflateRaw` به `DecompressionStream` نیاز دارد**: در همهٔ مرورگرهای امروزی و در Node ۱۸ به بعد هست. هرجا این API نباشد، خطا می‌اندازد.
