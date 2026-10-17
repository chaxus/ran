# مهاجرت آلفا

این پاک‌سازی آلفا، پوشش‌های سرور بدون مصرف‌کننده و خروجی‌های سازگاری قدیمی را حذف می‌کند. پیش از ارتقا، کد مصرف‌کننده را مهاجرت دهید. ابزارهای خالص، stream/conversation و i18n همچنان در Node کار می‌کنند.

| API حذف‌شده                                                                                   | جایگزین                                                                               |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ranuts/node`: `readFile`, `writeFile`, `appendFile`, `readDir`, `queryFileInfo`, `watchFile` | `node:fs/promises`: `readFile`, `writeFile`, `appendFile`, `readdir`, `stat`, `watch` |
| `ranuts/node`: `readStream`, `writeStream`                                                    | `node:fs`: `createReadStream`, `createWriteStream`                                    |
| `Server`, `Router`, `body`, `staticMiddleware`, `connect`, `Context`                          | `node:http` / maintained HTTP framework                                               |
| `WSS`                                                                                         | WebSocket server library                                                              |
| `get`, `paresUrl`                                                                             | `fetch` + HTTP status/body checks; `new URL(url, base)`                               |
| `startTask`, `taskEnd`                                                                        | `performance.now()` (ms), `process.hrtime.bigint()` (ns)                              |
| `runCommand`, `prompt`, `colors`, `FMT`                                                       | `node:child_process`, `node:readline/promises`, `node:util.styleText`                 |
| `traverse`, `traverseSync`                                                                    | `node:fs/promises.readdir`, `node:fs.readdirSync` + recursion                         |
| `isColorSupported`                                                                            | `process.stdout.hasColors?.()`                                                        |
| `getIPAdress`                                                                                 | `node:os.networkInterfaces()`                                                         |
| `memoize`                                                                                     | `once` / `singleFlight`                                                               |
| `timeFormat`                                                                                  | `formatDuration`                                                                      |
| `timestampToTime`                                                                             | `formatDate` / `new Date(timestamp)`                                                  |
| `isClient`                                                                                    | `typeof window !== 'undefined'`                                                       |
| `md5`                                                                                         | `node:crypto.createHash('md5')` / dedicated MD5 library                               |

API فایل مقدار بومی را برمی‌گرداند و در خطا با Error رد می‌شود، نه با شیء success. برای متن، کدگذاری را صریح مشخص کنید.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

برای Server، Router، میان‌افزار و connect از یک چارچوب HTTP نگهداری‌شده یا node:http استفاده کنید. سرور WebSocket به پیاده‌سازی سرور نیاز دارد؛ کلاینت بومی WebSocket جایگزین آن نیست.

formatDate متن برمی‌گرداند. برای شیء Date از new Date(timestamp) استفاده کنید. once اولین نتیجه را ذخیره می‌کند، نه نتیجه‌ای برای هر آرگومان.

برای سازگاری MD5 از پیاده‌سازی اختصاصی استفاده کنید (node:crypto در Node). خروجی SHA-256 متفاوت است؛ هیچ‌کدام الگوریتم ذخیره‌سازی گذرواژه نیستند.

حذف اسکریپت تکراری بر اساس نوع و محتوای دقیق انجام می‌شود، بدون هش یا یکسان‌سازی پایان خط.

## فضاهای کاری آزمایشی حذف‌شده

بسته‌های مستقل `visual` و `ranite` حذف شده‌اند. از موتور نگهداری‌شدهٔ `ranuts/visual` و اسکریپت‌های توسعهٔ موجود مبتنی بر Vite استفاده کنید.

مصرف‌کنندگان `visual` باید با API عمومی فعلی سازگار شوند: با `await Application.create(options)` مقداردهی کنند، گره‌های `Graphics` / `Container` را به `app.stage` بیفزایند و `app.render()` یا `app.start()` را فراخوانی کنند. برای `Bar`، `Line`، `Pie` و `Sankey` ناتمام جایگزینی وجود ندارد. کلاس‌های داخلی هندسه و رویداد نیز خروجی عمومی نیستند؛ تغییر نام import کافی نیست.
