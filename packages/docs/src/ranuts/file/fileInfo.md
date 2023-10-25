# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的data来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| ------ | -------------- | --------- | ---------------------------- |
| success | 是否检查成功 | `boolean` | true 成功 false 失败 |
| data | 文件的信息，或者错误的原因 | `Stats` |  |

### Options

| 参数     | 说明                           | 类型     | 默认值    |
| -------- | ------------------------------ | -------- | --------- |
| path     | 文件路径，需要检查的文件路径       | `string` | undefined |


## Example 



