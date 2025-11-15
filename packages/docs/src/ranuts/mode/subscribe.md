# EventEmitter

Publish-subscribe class.

## Class

### Methods

| Method | Parameters              | Description                                                 | Default |
| ------ | ----------------------- | ----------------------------------------------------------- | ------- |
| on     | Subscribe to event      | Subscribe to event, pass event name and callback            | None    |
| once   | Subscribe to event once | Subscribe to event once, trigger once then auto unsubscribe | None    |
| off    | Unsubscribe from event  | Unsubscribe from event, pass event name and callback        | None    |
| emit   | Trigger event           | Trigger event, requires event name                          | None    |

## Example

```js
import { Subscribe } from 'ranuts';

const subscribe = new Subscribe();

// Subscribe to event 1
subscribe.on('event', () => {
  console.log(1);
});
// Subscribe to event 2
subscribe.on('event', () => {
  console.log(2);
});
// Subscribe to event 3
const eventThree = () => {
  console.log(3);
};
subscribe.on('event', eventThree);
// Subscribe to event 4, need to pass parameters
subscribe.on('event', (num) => {
  console.log(num);
});
// Trigger event, pass parameters
subscribe.emit('event', 4);
// console.log(1) console.log(2) console.log(3) console.log(4)

// Unsubscribe event three
subscribe.off('event', eventThree);

// Subscribe once, auto unsubscribe after trigger
subscribe.once('other', () => {
  console.log(5);
});
```
