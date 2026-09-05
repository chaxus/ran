# parseChineseNumber / parseRomanNumber / parseEnglishNumber

عددهایی را که برای خواندنِ آدم‌ها نوشته شده‌اند تجزیه می‌کند: `第二十三章`، `Chapter XIV`، `Part Three`.

هر سه یک قرار مشترک دارند: وقتی ورودی را نتوان به‌تمامی تجزیه کرد، **به‌جای حدس زدن `null` برمی‌گردانند**. این تجزیه‌گرها معمولاً به تصمیم «آیا این خط یک عنوان است؟» خوراک می‌دهند و یک عدد اشتباه، کل بررسی توالی را خراب می‌کند.

## API

| تابع                        | چه چیزی می‌پذیرد                                                                |
| --------------------------- | ------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | رقم‌ها (نیم‌پهنا و تمام‌پهنا)، `一二三…`، یکاهای `十百千万/萬`، ساده‌شده و سنتی |
| `parseRomanNumber(value)`   | `IVXLCDM`، با هر حالت حروف، نشانه‌گذاری تفریقی (`IV`، `IX`)                     |
| `parseEnglishNumber(value)` | رقم‌ها، واژه‌های عددی انگلیسی `one`–`twenty` و سپس عددهای رومی                  |

کمک‌کارهای رشته‌ای مرتبط: `toHalfWidth(value)` / `toFullWidth(value)` نویسه‌های تمام‌پهنا را یکدست می‌کنند و `parseChineseNumber` خودش این کار را برایتان انجام می‌دهد.

## نمونه

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — نخست بخش عددی را جدا کنید

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## یادداشت‌ها

۱. **فقط بخش عددی را بدهید.** `第三章` مقدار `null` می‌دهد: نخست `三` را با الگوی خودتان بیرون بکشید و همان را تجزیه کنید.
۲. **`十` که چیزی پیش از آن نباشد یعنی ۱**، پس `十五` می‌شود ۱۵ نه ۵.
۳. **`parseEnglishNumber` نخست رقم، سپس واژه و سپس عدد رومی را می‌آزماید.** `twenty-one` و بالاتر پوشش داده نشده‌اند؛ اگر لازم دارید جدول واژه‌ها را گسترش دهید.
