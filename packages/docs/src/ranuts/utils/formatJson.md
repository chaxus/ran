# formatJson

传入一个JSON或者JSON的字符串，添加空格和换行进行返回一个格式化的JSON字符串

## API

### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 返回的一个对象 | `Object` |

### Options

| 参数     | 说明                 | 类型              | 默认值 |
| -------- | -------------------- | ----------------- | ------ |
| json     | 需要格式化的JSON对象 | `object`,`string` | 无     |
| callback | 错误回调，可选       | `function`        | 无     |

## Example

```js
import { formatJson } from 'ranuts'

const json = {  
  "name": "chaxus",  
  "age": 3, 
}

const result = formatJson(json)

console.log(result) 

```
