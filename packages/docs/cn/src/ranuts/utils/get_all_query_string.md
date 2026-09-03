# getAllQueryString

把 URL 上的查询参数解析成对象。

## API

### getAllQueryString

#### 返回值

| 参数     | 说明         | 类型                     |
| -------- | ------------ | ------------------------ |
| `Object` | 查询参数对象 | `Record<string, string>` |

#### 参数

| 参数  | 说明                 | 类型     | 默认值       |
| ----- | -------------------- | -------- | ------------ |
| `url` | 待解析的 URL（可选） | `string` | 当前页面地址 |

## 示例

### 基础用法

```js
import { getAllQueryString } from 'ranuts';

// 当前地址为 https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### 解析指定 URL

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString('https://example.com?page=1&limit=10&sort=name');
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### 不带值的开关

```js
import { getAllQueryString } from 'ranuts';

getAllQueryString('?embed&lang=en'); // { embed: '', lang: 'en' }
```

### 处理编码后的参数

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
getAllQueryString().search; // 'hello world'（自动解码）
```

## 注意事项

1. **不带值的开关会被保留**。`?embed` 和 `?embed=` 都得到 `{ embed: '' }`。0.3 之前没有值的参数
   会被直接丢掉，导致 `?readonly`、`?embed` 这类布尔开关的常见写法与「参数不存在」无法区分。
   读取这类开关请用 [`queryFlag`](/cn/src/ranuts/utils/query_flag)。

2. **hash 不会混进最后一个值**。`?lang=en#section` 得到 `{ lang: 'en' }`。

3. **只按第一个 `=` 切分**，因此值里可以包含 `=`：`?next=/a?b=1` 得到 `{ next: '/a?b=1' }`。

4. **URL 解码**：键和值都会做百分号解码，`+` 解码为空格，与 `URLSearchParams` 一致。像 `%zz`
   这样的非法转义会原样保留而不是丢掉该参数，避免一个坏值连累其它参数。

5. **服务端环境**：没有 `window` 且未传 `url` 时返回 `{}`。传入 URL 即可在构建期脚本中使用。

6. **默认 URL**：不传 `url` 时取 `window.location.href`。

7. **重复参数**：只保留最后一个值。
