# appendUrl

将查询参数对象拼接到 URL 后面。

## API

### appendUrl

#### Return

| 参数     | 说明             | 类型     |
| -------- | ---------------- | -------- |
| `string` | 拼接后的完整 URL | `string` |

#### Parameters

| 参数     | 说明         | 类型                     | 默认值 |
| -------- | ------------ | ------------------------ | ------ |
| `url`    | 基础 URL     | `string`                 | 无     |
| `params` | 查询参数对象 | `Record<string, string>` | `{}`   |

## Example

### 基础用法

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### 已有查询参数的 URL

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### 处理协议相对 URL

```js
import { appendUrl } from 'ranuts';

// 以 // 开头的 URL 会自动添加 https://
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### 空值过滤

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// 空字符串值会被过滤
console.log(fullUrl); // 'https://example.com?page=1'
```

## 注意事项

1. **协议处理**：如果 URL 以 `//` 开头，会自动添加 `https://` 协议。

2. **参数合并**：如果 URL 已有查询参数，新参数会追加到后面。

3. **空值过滤**：值为空字符串的参数会被过滤，不会添加到 URL 中。

4. **URL 编码**：参数值会自动进行 URL 编码。

5. **覆盖行为**：如果参数名已存在，新值会覆盖旧值（由 URLSearchParams 的行为决定）。
