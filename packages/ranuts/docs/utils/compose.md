
# 将异步函数转化为同步的方式进行执行

```js
const fn = compose([fun,fun,fun,...])

fn()
```
### API
#### Options

| 参数      | 说明     | 类型                                    |
| -------- | --------| --------------------------------------|
| array    | 函数数组 | Array<(context: T, next: Next) => any>  |
