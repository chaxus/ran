# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| ---- | -------------------------------------- | ---------------------------------- | ------ |
| on   | 订阅事件                               | 订阅事件，传入参数事件名，回调函数 | 无     |
| once | 订阅一次事件，传入参数事件名，回调函数 | 订阅一次事件，触发一次后不再会触发 | 无     |
| off  | 取消订阅事件，传入参数事件名，回调函数 | 取消订阅事件                       | 无     |
| emit | 触发事件，需要事件名                   | 触发事件                           | 无     |

## Example

```js
import { Subscribe } from 'ranuts';

const subscribe = new Subscribe();

// 订阅事件1
subscribe.on('event', () => {
  console.log(1);
});
// 订阅事件2
subscribe.on('event', () => {
  console.log(2);
});
// 订阅事件3
const eventThree = () => {
  console.log(3);
};
subscribe.on('event', eventThree);
// 订阅事件4，需要传递参数
subscribe.on('event', (num) => {
  console.log(num);
});
// 触发事件，同时传参数
subscribe.emit('event', 4);
// console.log(1) console.log(2) console.log(3) console.log(4)

// 取消事件三
subscribe.off('event', eventThree);

// 订阅一次，触发一次自动取消
subscribe.once('other', () => {
  console.log(5);
});
```
