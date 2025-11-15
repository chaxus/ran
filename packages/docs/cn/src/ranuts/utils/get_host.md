# getHost

根据环境配置获取主机地址。

## API

### getHost

#### Return

| 参数                  | 说明           | 类型                  |
| --------------------- | -------------- | --------------------- |
| `string \| undefined` | 主机地址字符串 | `string \| undefined` |

#### Parameters

| 参数  | 说明             | 类型     | 默认值 |
| ----- | ---------------- | -------- | ------ |
| `env` | 环境名称（可选） | `string` | 无     |

## Example

### 基础用法

```js
import { getHost } from 'ranuts';

// 自动从 window.location.hostname 检测环境
const host = getHost();
console.log(host); // 根据当前环境返回对应主机地址
```

### 指定环境

```js
import { getHost } from 'ranuts';

const trunkHost = getHost('trunk');
console.log(trunkHost); // '//log..trunk'

const testHost = getHost('test');
console.log(testHost); // '//log.test'

const prodHost = getHost('prod');
console.log(prodHost); // '//log.'
```

### 环境检测规则

```js
import { getHost } from 'ranuts';

// trunk/neibu/release 环境
getHost('trunk'); // '//log..trunk'
getHost('neibu'); // '//log..neibu'
getHost('release'); // '//log..release'

// test 环境
getHost('test'); // '//log.test'

// prod 环境
getHost('prod'); // '//log.'
```

## 注意事项

1. **环境检测**：如果不传 `env` 参数，会从 `window.location.hostname` 自动检测环境。
2. **服务端环境**：在服务端环境（无 `window` 对象）时返回 `undefined`。
3. **环境映射**：
   - `trunk`、`neibu`、`release` → `.${env}`
   - `test` → `test`
   - `prod` → 空字符串
4. **返回格式**：返回格式为 `//log.${host}`，其中 `host` 根据环境变化。
