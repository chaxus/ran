# کمک‌کارهای localStorage

دسترسی به localStorage که نمی‌تواند خطا پرتاب کند، به‌علاوهٔ نمایی پیشوندگذاری‌شده و JSON‌ساز روی آن.

`localStorage` تنها در SSR غایب نیست — در iframeِ دامنهٔ دیگر با کوکی‌های بسته، همان دم _دست زدن_ خطا می‌دهد، و در حالت ناشناس سافاری یا هنگام پر شدن سهمیه، هنگام _نوشتن_. اینجا هر خواندن و نوشتنی سپر دارد، چون شکست در ذخیره باید تنها یک ترجیح را از دست بدهد، نه اینکه صفحه را بشکند.

## API

### localStorageSetItem

مقداری را در localStorage می‌نویسد.

#### پارامترها

| پارامتر | توضیح    | نوع      | پیش‌فرض |
| ------- | -------- | -------- | ------- |
| `name`  | نام کلید | `string` | الزامی  |
| `value` | مقدار    | `string` | الزامی  |

#### بازگشت

بدون مقدار بازگشتی (`void`)

### localStorageGetItem

مقداری را از localStorage می‌خواند.

#### پارامترها

| پارامتر | توضیح    | نوع      | پیش‌فرض |
| ------- | -------- | -------- | ------- |
| `name`  | نام کلید | `string` | الزامی  |

#### بازگشت

| آرگومان  | توضیح                                           | نوع      |
| -------- | ----------------------------------------------- | -------- |
| `string` | مقدار ذخیره‌شده؛ اگر نباشد رشتهٔ خالی برمی‌گردد | `string` |

### localStorageRemoveItem

کلیدی را برمی‌دارد.

| پارامتر | توضیح    | نوع      | پیش‌فرض |
| ------- | -------- | -------- | ------- |
| `name`  | نام کلید | `string` | الزامی  |

### createStore(prefix?)

نمایی روی localStorage، با پیشوند و سریال‌سازی JSON.

#### بازگشت

| متد                  | توضیح                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| `get(key, fallback)` | مقدار ذخیره‌شده، یا `fallback` وقتی نباشد، در دسترس نباشد یا خراب باشد |
| `set(key, value)`    | سریال می‌کند و ذخیره می‌کند؛ اگر چیزی نوشته نشود `false`               |
| `remove(key)`        | آن کلید را برمی‌دارد                                                   |
| `keyOf(key)`         | کلید کامل ذخیره (`prefix + key`)، به کار شنونده‌های `storage` می‌آید   |

## نمونه

### کاربرد پایه

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// نوشتن مقدار
localStorageSetItem('username', 'john');

// خواندن مقدار
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### ذخیرهٔ یک شیء

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### ایمنی سمت سرور

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// در محیط سرور خطا نمی‌دهد و خاموشانه شکست می‌خورد
localStorageSetItem('key', 'value'); // در سرور: کاری نمی‌کند
const value = localStorageGetItem('key'); // در سرور: '' برمی‌گرداند
```

### وارسی وجود

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('مقدار هست:', value);
} else {
  console.log('مقدار نیست');
}
```

### ذخیرهٔ JSON با فضای‌نام

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // در agent_history_default می‌نویسد
const restored = history.get('default', []); // اگر نباشد یا خراب باشد []
history.remove('default');
```

### چند قابلیت، یک مبدأ

```js
import { createStore } from 'ranuts';

// پیشوندها نمی‌گذارند قابلیت‌های بی‌ربط به هم بخورند.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## یادداشت‌ها

۱. **هیچ‌چیز اینجا خطا پرتاب نمی‌کند.** نبودِ انباره، قابِ بستهٔ دامنهٔ دیگر، حالت ناشناس، سهمیه: همه خاموشانه کنار می‌کشند. `localStorageGetItem` مقدار `''` می‌دهد، نویسنده‌ها کاری نمی‌کنند و `createStore().set()` مقدار `false` را گزارش می‌کند.

۲. **سپر در زمان فراخوانی است، نه هنگام بار شدن پیمانه.** جست‌وجوی انباره درون هر فراخوانی رخ می‌دهد، پس اینها پس از SSR و آب‌رسانی هم کار می‌کنند و در آزمون‌ها می‌توان جایشان چیز دیگری گذاشت.

۳. **`createStore` هیچ وارسی‌ای نمی‌کند.** هر چه ذخیره شده بود، با نوع `T` بازمی‌گردد؛ اگر از مرز یک نسخه می‌گذرد، خودتان وارسی‌اش کنید. مقدار پشتیبان تنها نبودن و شکست در تجزیه را می‌پوشاند — مقداری که نسخهٔ کهنه‌تری از کد شما نوشته، نمی‌تواند `SyntaxError` به دامن فراخواننده بیندازد، اما شکلش می‌تواند نادرست باشد.

۴. **`set` مقدار `false` می‌دهد** برای ساختار چرخه‌ای، برای `BigInt`، و برای نوشتنی که به مقصد نرسیده است. برای اطمینان، مقدار را دوباره می‌خواند.

۵. **محدودیت نوع**: کمک‌کارهای خام تنها با رشته سر و کار دارند. به‌جای نوشتن دستی `JSON.stringify` / `JSON.parse` با try/catch در هر نقطهٔ فراخوانی، از `createStore` استفاده کنید.

۶. **مقدار بازگشتی**: وقتی مقدار وجود ندارد، `localStorageGetItem` مقدار `''` می‌دهد، نه `null`.
