---
description: 'کامپوننت Preview در ranui (<r-preview>) پیش‌نمایش برخط فایل‌های docx، pptx، pdf و xlsx را داخل مرورگر نشان می‌دهد.'
---

# Preview

کامپوننت پیش‌نمایش برخط برای فایل‌های `docx`، `pptx`، `pdf` و `xlsx`.

> **کجا به کارش ببرید**: وقتی می‌خواهید فایل‌های `docx`، `pptx`، `pdf` یا `xlsx` را در مرورگر پیش‌نمایش بگیرید. `<r-preview>` از روی نشانی یک فایل، پنجرهٔ پیش‌نمایش سند را باز می‌کند (اکنون به‌صورت بستهٔ مستقل `@ranui/preview` منتشر می‌شود).

> ⚠️ **توجه**: بستهٔ ranui از نسخهٔ 0.1.10-alpha-27 به بعد دیگر این کامپوننت را ارائه نمی‌کند. به بستهٔ مستقل [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) کوچ کنید.

## شروع سریع

### نصب

```bash
# استفاده از بستهٔ مستقل پیش‌نمایش (توصیه‌شده)
npm install @ranui/preview

# یا بستهٔ کامل ranui (پیش از نسخهٔ 0.1.10-alpha-27)
npm install ranui
```

### استفادهٔ پایه

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview-demo')">انتخاب فایل برای پیش‌نمایش</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">انتخاب فایل برای پیش‌نمایش</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## مرجع API

### خصیصه‌ها

| خصیصه       | نوع       | پیش‌فرض                     | توضیح                                                      |
| ----------- | --------- | --------------------------- | ---------------------------------------------------------- |
| `src`       | `string`  | `''`                        | نشانی فایل؛ با تعیین آن پنجرهٔ پیش‌نمایش خودکار باز می‌شود |
| `closeable` | `boolean` | `true`                      | اینکه دکمهٔ بستن نمایش داده شود یا نه                      |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | نشانی سرویس پیش‌نمایش سند                                  |

### منبع فایل `src`

نشانی فایل را تعیین کنید تا پنجرهٔ پیش‌نمایش باز شود؛ مقدار خالی چیزی نشان نمی‌دهد.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### قابلیت بستن `closeable`

تعیین می‌کند پنجرهٔ پیش‌نمایش بسته‌شدنی باشد یا نه.

```html
<!-- پیش‌فرض: بسته‌شدنی -->
<r-preview closeable="true"></r-preview>

<!-- بسته نمی‌شود -->
<r-preview closeable="false"></r-preview>
```

### سرویس دلخواه `baseUrl`

اگر می‌خواهید سرویس پیش‌نمایش سند از آنِ خودتان باشد، نشانی آن را با خصیصهٔ `baseUrl` بدهید.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **نکته**: به‌طور پیش‌فرض از سرویس میزبانی‌شده روی `https://edit.chaxus.com` استفاده می‌شود. برای میزبانی خودتان [OnlyOffice Web Local](https://github.com/ranuts/document) را ببینید.

## راهنمای کوچ

اگر هم‌اکنون از کامپوننت `r-preview` در بستهٔ ranui استفاده می‌کنید، این مسیر را پیشنهاد می‌کنیم:

1. **نصب بستهٔ تازه**:

   ```bash
   npm install @ranui/preview
   ```

2. **به‌روزرسانی import‌ها**:

   ```javascript
   // پیش از این
   import 'ranui';

   // اکنون
   import '@ranui/preview';
   ```

3. **شیوهٔ استفاده در HTML تغییری نمی‌کند**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
