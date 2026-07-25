# getQuery

从 URL 中提取查询参数并转换为对象（与 getAllQueryString 功能相同）。

## API

### getQuery

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
import { getQuery } from 'ranuts';

// 假设当前 URL 是: https://example.com?name=John&age=30
const params = getQuery();
console.log(params); // { name: 'John', age: '30' }
```

### 解析指定 URL

```js
import { getQuery } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getQuery(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### 获取特定参数

```js
import { getQuery } from 'ranuts';

const params = getQuery();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`页码: ${page}, 每页: ${limit}`);
```

## 注意事项

1. **`getAllQueryString` 的别名**。两者曾是逐字节相同的两份实现；现在 `getQuery` 直接转发，
   修一处两处都生效。解析规则见
   [`getAllQueryString`](/cn/src/ranuts/utils/get_all_query_string)。
2. **不带值的开关自 0.3 起被保留**为 `''`。读取这类开关请用
   [`queryFlag`](/cn/src/ranuts/utils/query_flag)。
3. **服务端环境**：没有 `window` 且未传 `url` 时返回 `{}`。
