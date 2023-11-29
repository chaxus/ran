# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `Object` | 返回的一个对象 | `Object` |

### Options

| 参数 | 说明               | 类型     | 默认值 |
| ---- | ------------------ | -------- | ------ |
| obj  | 需要过滤的对象     | `object` | 无     |
| list | 需要过滤的熟悉数组 | `array`  | 无     |

## Example

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
