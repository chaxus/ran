# getAllQueryString

从 URL 中提取所有查询参数并转换为对象。

## API

### getAllQueryString

#### Return

| 参数     | 说明         | 类型                     |
| -------- | ------------ | ------------------------ |
| `Object` | 查询参数对象 | `Record<string, string>` |

#### Parameters

| 参数  | 说明                                       | 类型     | 默认值 |
| ----- | ------------------------------------------ | -------- | ------ |
| `url` | 要解析的 URL（可选，默认使用当前页面 URL） | `string` | 无     |

## Example

### 基础用法

```js
import { getAllQueryString } from 'ranuts';

// 假设当前 URL 是: https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### 解析指定 URL

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### 获取特定参数

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`页码: ${page}, 每页: ${limit}`);
```

### 处理编码参数

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (自动解码)
```

## 注意事项

1. **URL 解码**：参数值会自动进行 URL 解码。

2. **服务端环境**：在服务端环境（无 `window` 对象）时返回空对象 `{}`。

3. **默认 URL**：如果不传 `url` 参数，默认使用 `window.location.href`。

4. **空值处理**：如果 URL 中没有查询参数，返回空对象。

5. **重复参数**：如果 URL 中有重复的参数名，只会保留最后一个值。
