# querystring

将对象转换为 URL 查询字符串。

## API

### querystring

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | URL 查询字符串 | `string` |

#### Parameters

| 参数   | 说明         | 类型     | 默认值 |
| ------ | ------------ | -------- | ------ |
| `data` | 要转换的对象 | `Object` | `{}`   |

## Example

### 基础用法

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### 构建 URL

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### 处理特殊字符

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web开发',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%E5%BC%80%E5%8F%91'
```

### 过滤 undefined 和 null

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// undefined 和 null 的值会被过滤掉
```

## 注意事项

1. **URL 编码**：值会自动进行 URL 编码。
2. **空值过滤**：`undefined` 和 `null` 的值会被自动过滤，不会出现在查询字符串中。
3. **对象类型**：如果传入的不是对象，会抛出 `TypeError`。
4. **编码处理**：键和值都会进行 `decodeURIComponent` 处理后再编码。
