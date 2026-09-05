# escapeHtml

نویسه‌های ویژهٔ HTML را می‌گریزاند تا جلوی حملهٔ XSS گرفته شود.

## API

### escapeHtml

#### بازگشت

| آرگومان  | توضیح              | نوع      |
| -------- | ------------------ | -------- |
| `string` | رشتهٔ گریزانده‌شده | `string` |

#### پارامترها

| پارامتر  | توضیح                      | نوع                        | پیش‌فرض |
| -------- | -------------------------- | -------------------------- | ------- |
| `string` | رشته‌ای که گریزانده می‌شود | `string \| number \| null` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### گریزاندن نویسه‌های ویژه

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### عددها و null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### پیشگیری از حملهٔ XSS

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// نمایش امن؛ اسکریپت اجرا نمی‌شود
```

## یادداشت‌ها

۱. **نویسه‌های گریزانده‌شده**: این نویسه‌ها عوض می‌شوند:

- `"` → `&quot;`
- `'` → `&#39;`
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`

۲. **تبدیل نوع**: هر چه رشته نباشد نخست به رشته تبدیل و سپس گریزانده می‌شود.

۳. **امنیت**: برای جلوگیری از حملهٔ XSS است؛ هر جا محتوای ورودی کاربر را نشان می‌دهید از آن استفاده کنید.

۴. **کارایی**: رشته‌ای که نویسهٔ ویژه ندارد، همان‌طور برگردانده می‌شود.
