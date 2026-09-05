---
description: 'وب‌کامپوننت رندر Markdown که برای استریم ساخته شده: markdownِ نیمه‌رسیده را می‌بندد، تنها بلوکِ تغییرکرده را دوباره می‌کشد و کد (shiki)، نمودار Mermaid و ریاضی را در خود جای می‌دهد.'
---

<script setup>
const quick = `# سلام

کمی **پررنگ**، کمی *مورب*، یک [پیوند](https://github.com/chaxus/ran) و \`کد درون‌خطی\`.

\`\`\`ts
const greet = (name: string): string => \`Hi \${name}\`;
\`\`\`

| قابلیت | وضعیت |
| --- | --- |
| استریم | ✅ |
| Mermaid / ریاضی | ✅ |`;
const partial = '*تأکیدِ* نیمه‌تایپ‌شده، `کد درون‌خطی` و **پررنگی که هنوز در راه است';
const code = `\`\`\`python
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))
\`\`\``;
const rich = `\`\`\`mermaid
graph LR; A[Prompt] --> B[Model]; B --> C[Tokens]; C --> D[r-markdown]
\`\`\`

$$
E = mc^2
$$

عبارت درون‌خطی \\(e^{i\\pi} + 1 = 0\\) همراه متن جاری می‌شود.`;
</script>

# Markdown

Markdown را (از جمله **خروجی توکن‌به‌توکن هوش مصنوعی**) به‌صورت یک وب‌کامپوننتِ مستقل از فریم‌ورک رسم می‌کند. `<r-markdown>` از روی [Streamdown](https://streamdown.ai) شرکت Vercel الگو گرفته است: تا وقتی متن در حال رسیدن است، `**bold`، `` `code ``، پیوندها و ریاضیِ `$$` نیمه‌تایپ‌شده را همان‌جا می‌بندد، سند را به بلوک‌ها می‌شکند و **فقط بلوکی را که تغییر کرده** دوباره می‌کشد؛ پس یک پاسخ بلند هرگز با هر توکن از ابتدا دوباره تحلیل نمی‌شود.

بلوک‌های حصاردار ` ```mermaid ` به [`<r-mermaid>`](/fa/src/ranui/mermaid/) تبدیل می‌شوند، ریاضی به [`<r-math>`](/fa/src/ranui/math/)، و کد را می‌توان با shiki برجسته کرد؛ هر یک از این‌ها نخستین باری که محتوا به آن نیاز پیدا کند با تأخیر بارگذاری می‌شود. خروجی با DOMPurify پاک‌سازی می‌شود.

> **کجا به کار می‌آید:** وقتی Markdownی را نشان می‌دهید که کاملاً در اختیار شما نیست (پاسخ‌های گفت‌وگو، جریان‌های LLM، نظرهای کاربران، مستندات) و استریم، پشتیبانی از کد و نمودار و ریاضی، و HTML امن می‌خواهید، بی‌آنکه خودتان یک تحلیل‌گر و پاک‌ساز و برجسته‌ساز را به هم سیم‌کشی کنید.

## شروع سریع

<Demo>
  <r-markdown copy highlight :content.prop="quick"></r-markdown>
</Demo>

```html
<r-markdown copy highlight content="# سلام ..."></r-markdown>
```

```js
import 'ranui'; // یا نقطه ورود مستقل:
import 'ranui/markdown';
```

منبع از **ویژگی `content`** خوانده می‌شود (ترجیح‌داده‌شده؛ به اتریبیوت بازتاب نمی‌یابد، پس استریمِ یک پاسخ بلند DOM را زیر و رو نمی‌کند)، یا از اتریبیوت `content`، یا از متن خود عنصر:

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // هنگام استریم یک مکان‌نمای چشمک‌زن نشان بده
for await (const chunk of stream) {
  el.content += chunk; // فقط آخرین بلوک دوباره رسم می‌شود
}
el.removeAttribute('caret');
container.append(el);
```

## استریم

`mode="streaming"` (پیش‌فرض) متن را نخست از [remend](https://www.npmjs.com/package/remend) می‌گذراند، همان پایان‌دهنده markdownِ ناتمام که از Streamdown بیرون کشیده شده است. بنابراین یک `**bold`ِ نیمه‌رسیده به‌جای ستاره‌های خام، پررنگ رسم می‌شود، `[text](https://exa` تا بسته‌شدن نشانی به‌صورت متن ساده می‌ماند، یک `- ` بند پیشین را به عنوان تبدیل نمی‌کند، و از این دست. برای سندهای تمام‌شده `mode="static"` بگذارید تا این مرحله رد شود و همه‌چیز یکجا رسم شود.

<Demo>
  <r-markdown caret :content.prop="partial"></r-markdown>
</Demo>

```html
<r-markdown caret content="*تأکیدِ* نیمه‌تایپ‌شده، `کد درون‌خطی` و **پررنگی که هنوز در راه است"></r-markdown>
```

- **مکان‌نما**: `caret` یک `▋` چشمک‌زن و `caret="circle"` یک `●` را پس از آخرین بلوک نشان می‌دهد. تا وقتی یک حصار کد باز مانده یا آخرین بلوک جدول است، خودش پنهان می‌شود.
- **حصارهای کدِ ناتمام** تا رسیدن حصار بسته، ساده می‌مانند (نه برجسته‌سازی سوسو می‌زند و نه نموداری نیمه‌کاره رسم می‌شود)؛ در این میان ظرف، `data-incomplete` را با خود دارد.

## بلوک‌های کد

هر بلوک کد یک سربرگ با نام زبان می‌گیرد و در صورت تمایل، دکمه‌های کپی و دانلود. برای برجسته‌سازی نحو با [shiki](https://shiki.style) اتریبیوت `highlight` را اضافه کنید (با تأخیر بارگذاری می‌شود؛ زبان‌ها هنگام نیاز می‌آیند؛ پیش‌فرض `github-light` / `github-dark` که از پوسته صفحه پیروی می‌کند).

<Demo>
  <r-markdown copy download line-numbers highlight :content.prop="code"></r-markdown>
</Demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- انتخاب پوسته‌ها: روشن تیره -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid و ریاضی

<Demo>
  <r-markdown :content.prop="rich"></r-markdown>
</Demo>

- ` ```mermaid ` → `<r-mermaid>` (با تمام‌صفحه؛ `copy` / `download` پاس داده می‌شوند).
- `$$…$$`، `\[…\]` و ` ```math ` → `<r-math>` بلوکی؛ `\(…\)` → درون‌خطی. دلار تکی `$…$` چون با واحد پول اشتباه می‌شود، **باید** با `inline-math` **روشن شود**.

## مرجع API

### اتریبیوت‌ها

| اتریبیوت       | نوع                                      | پیش‌فرض       | توضیح                                                                                                                                                       |
| -------------- | ---------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                                 | —             | منبع Markdown. **ویژگی** `content` اولویت دارد و بازتاب نمی‌یابد؛ در نبود هر دو، متن خود عنصر به کار می‌رود.                                                |
| `mode`         | `'streaming' \| 'static'`                | `'streaming'` | `streaming` markdownِ ناتمام را می‌بندد و بلوک‌به‌بلوک تفاوت می‌گیرد؛ `static` کل متن را همان‌طور که هست یکجا می‌کشد.                                       |
| `caret`        | بولی / `'circle'`                        | خاموش         | مکان‌نمای چشمک‌زن پس از آخرین بلوک (`▋`، یا با `circle` همان `●`).                                                                                          |
| `copy`         | بولی                                     | خاموش         | دکمه کپی روی بلوک‌های کد (به `<r-mermaid>`ِ درون‌نشانده هم پاس می‌رود).                                                                                     |
| `download`     | بولی                                     | خاموش         | دکمه دانلود روی بلوک‌های کد (`code.<ext>` بر پایه زبان).                                                                                                    |
| `line-numbers` | بولی                                     | خاموش         | شماره خط در بلوک‌های کد.                                                                                                                                    |
| `highlight`    | بولی / نام پوسته‌ها به شکل `"روشن تیره"` | خاموش         | برجسته‌سازی نحو با shiki. بدون مقدار → `github-light github-dark`؛ یک نام → برای هر دو؛ دو نام → روشن / تیره.                                               |
| `inline-math`  | بولی                                     | خاموش         | `$…$` را ریاضیِ درون‌خطی می‌شمارد (`\(…\)` همیشه هست).                                                                                                      |
| `link-target`  | `string`                                 | `'_blank'`    | `target` پیوندهای بیرونی (`rel="noopener noreferrer"` هم افزوده می‌شود). `_self` پیوندها را دست‌نخورده می‌گذارد. `#لنگر`های درون‌صفحه هرگز آن را نمی‌گیرند. |
| `theme`        | `'auto' \| 'light' \| 'dark'`            | `'auto'`      | پوسته برجسته‌سازی و نمودار. `auto` از صفحه پیروی می‌کند (`.dark`، `[data-ran-theme]`، وگرنه `prefers-color-scheme`).                                        |
| `sheet`        | `string`                                 | —             | CSS اضافی که به shadow root تزریق می‌شود.                                                                                                                   |
| `label-*`      | `string`                                 | انگلیسی       | بازنویسی برچسب کنترل‌ها: `label-copy`، `label-download`.                                                                                                    |

نام‌های معادل در ویژگی‌ها: `content`، `mode`، `caret`، `copyable`، `downloadable`، `lineNumbers`، `highlight`، `inlineMath`، `linkTarget`، `theme`، `sheet`.

## رویدادها

همه رویدادها حباب می‌کنند و از مرز shadow می‌گذرند (`composed`).

| رویداد     | `detail`                               | چه وقت فرستاده می‌شود                                   |
| ---------- | -------------------------------------- | ------------------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | یک دور رسم، دست‌کم یک بلوک را تغییر داده باشد           |
| `copied`   | `{ kind: 'code', language, code }`     | یک بلوک کد کپی شده باشد                                 |
| `download` | `{ kind: 'code', language, filename }` | یک بلوک کد دانلود شده باشد                              |
| `error`    | `{ message: string }`                  | تحلیل یا رسم شکست خورده باشد (همان‌جا هم نمایش می‌یابد) |

## Partهای CSS

| Part           | توضیح                           |
| -------------- | ------------------------------- |
| `markdown`     | پوشش بیرونی.                    |
| `body`         | ظرف بلوک‌ها.                    |
| `block`        | هر بلوک رسم‌شده.                |
| `code`         | ظرف یک بلوک کد.                 |
| `code-header`  | نوار زبان و کنش‌های یک بلوک کد. |
| `code-lang`    | برچسب زبان.                     |
| `code-actions` | گروه دکمه‌های کنش.              |
| `button`       | هر دکمه کپی یا دانلود.          |
| `table`        | پوشش جدول با اسکرول افقی.       |
| `error`        | جعبه خطا (هنگام شکست در رسم).   |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## متغیرهای CSS

روی عنصر بازنویسی کنید (هرکدام نخست به یک توکن معنایی و سپس به یک مقدار ثابت برمی‌گردند): `--ran-markdown-color`، `--ran-markdown-font-size`، `--ran-markdown-line-height`، `--ran-markdown-gap`، `--ran-markdown-heading-color`، `--ran-markdown-link-color`، `--ran-markdown-inline-code-bg`، `--ran-markdown-code-bg`، `--ran-markdown-code-border`، `--ran-markdown-code-radius`، `--ran-markdown-code-font-size`، `--ran-markdown-mono-font`، `--ran-markdown-blockquote-border`، `--ran-markdown-table-border`، `--ran-markdown-table-header-bg`، `--ran-markdown-caret`، `--ran-markdown-caret-color`، `--ran-markdown-button-color`، `--ran-markdown-error-color`.

## یادداشت‌ها

- **بارگذاری با تأخیر**: تکه تحلیل‌گر (marked + DOMPurify + remend) در نخستین رسم بار می‌شود؛ shiki و mermaid و Temml هرکدام تنها وقتی محتوا از آن‌ها استفاده کند بار می‌شوند. برنامه‌هایی که هرگز markdown رسم نمی‌کنند چیزی نمی‌پردازند.
- **پاک‌سازی‌شده**: HTML خام درون markdown از DOMPurify می‌گذرد: اسکریپت‌ها، هندلرهای رویداد، نشانی‌های `javascript:`، `<style>`، فرم‌ها و iframeها حذف می‌شوند. چک‌باکس‌های فهرست کارها می‌مانند.
- **تفاوت‌گیری بلوکی** بلوک‌ها را با موقعیتشان کلید می‌زند، پس وضعیت DOM درون بلوک‌های دست‌نخورده (نموداری که تمام‌صفحه باز است، جدولی که اسکرول شده) از به‌روزرسانی‌های استریم جان سالم به در می‌برد. سند یک بار توکن‌بندی می‌شود و هر بلوک از توکن‌های خودش رسم می‌شود، پس تعریف مرجع پیوند از مرز بلوک‌ها می‌گذرد (`[text][id]` در یک بلوک و `[id]: url` در بلوکی دیگر).
- **پانویس‌های GFM** (`[^1]`) **پشتیبانی نمی‌شوند**: marked توکن‌ساز پانویس ندارد، پس نشانه‌ها به‌صورت متن خام رسم می‌شوند.
- **shiki از نصب خودِ شما حل می‌شود.** بیلد ES عبارت `import('shiki')` را دست‌نخورده می‌گذارد، پس باندلر شما آن را جدا می‌کند و تنها گرامرهایی را می‌گیرد که حصارهای کد شما به کار می‌برند. shiki یک وابستگی معمولی ranui است، پس `npm i ranui` آن را آورده؛ چیز دیگری لازم نیست.
- **IIFE مستقل**: `dist/iife/markdown.iife.js` حل‌کننده ندارد، پس به‌جای آن mermaid، Temml و بسته زبانیِ _web_ در shiki (حدود ۵۰ زبان پرکاربرد) را درون خود جای می‌دهد. برای پوشش کامل زبان‌ها و دانلود کوچک‌تر، نقطه ورود ES (`ranui/markdown`) را ترجیح دهید.
