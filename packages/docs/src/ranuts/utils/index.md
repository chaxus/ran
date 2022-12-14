# 通用函数

## filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

### API

#### Return

| 参数     | 说明     | 类型                                     |
| -------- | -------- | ---------------------------------------- |
| run      | 启动轮询 | `(...params: TParams) => void`           |
| runAsync | 启动轮询 | `(...params: TParams) => Promise<TData>` |
| cancel   | 停止轮询 | `() => void`                             |

#### Options

| 参数                   | 说明                                                                                                   | 类型      | 默认值 |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | --------- | ------ |
| pollingInterval        | 轮询间隔，单位为毫秒。如果值大于 0，则启动轮询模式。                                                   | `number`  | `0`    |
| pollingWhenHidden      | 在页面隐藏时，是否继续轮询。如果设置为 false，在页面隐藏时会暂时停止轮询，页面重新显示时继续上次轮询。 | `boolean` | `true` |
| pollingErrorRetryCount | 轮询错误重试次数。如果设置为 -1，则无限次                                                              | `number`  | `-1`   |
