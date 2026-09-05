# convertImageToBase64

یک فایل تصویر را به رشتهٔ کدشده با Base64 تبدیل می‌کند.

## API

### convertImageToBase64

#### بازگشت

| آرگومان | توضیح | نوع |
| ------------------------------------- | -------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promise‌ای که با شیء نتیجه برآورده می‌شود | `Promise` |

#### convertImageToBase64Return

| ویژگی | توضیح | نوع |
| --------- | ------------------ | ------------------------------- |
| `success` | اینکه کار گرفت یا نه | `boolean` |
| `data` | دادهٔ Base64 | `string \| ArrayBuffer \| null` |
| `message` | پیام خطا | `string` |

#### پارامترها

| پارامتر | توضیح | نوع | پیش‌فرض |
| --------- | ----------------- | ------ | -------- |
| `file` | شیء فایل تصویر | `File` | الزامی |

## نمونه

### کاربرد پایه

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // مستقیم برای src یک img به کار می‌آید
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('تبدیل شکست خورد:', error);
    }
  }
});
```

### پیش‌نمایش پیش از بارگذاری

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('تبدیل تصویر شکست خورد');
}
```

### مدیریت خطا

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('خطا:', result.message);
  }
} catch (error) {
  console.error('استثنا:', error);
}
```

## یادداشت‌ها

۱. **ناهمگام است**: Promise برمی‌گرداند، پس با `await` یا `.then()` رسیدگی کنید.

۲. **گونهٔ فایل**: هر قالب تصویری که مرورگر بشناسد (JPEG، PNG، GIF، WebP و مانند آن).

۳. **قالب داده**: `data`ی بازگشتی یک Data URL کامل است (`data:image/jpeg;base64,...`) و همان‌طور در ویژگی `src` تگ `img` جا می‌افتد.

۴. **مدیریت خطا**: اگر تبدیل شکست بخورد Promise رد می‌شود؛ آن را بگیرید.

۵. **کاربرد**: معمولاً برای پیش‌نمایش تصویر، پردازش پیش از بارگذاری و ذخیرهٔ محلی به کار می‌رود.
