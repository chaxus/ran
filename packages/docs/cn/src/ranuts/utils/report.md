# report / setReportUrl / createData

把埋点数据上报到你自己的接口。

## API

### setReportUrl(config)

启动时配置一次默认接口。可传 URL 字符串，或一个对象：

| 字段           | 说明                                            | 类型     |
| -------------- | ----------------------------------------------- | -------- |
| `url`          | 所有未自带 `url` 的 `report()` 使用的默认接口   | `string` |
| `userIdCookie` | 存放用户 id 的 cookie 名，`createData()` 会带上 | `string` |

### getReportUrl()

返回已配置的接口，未配置时为 `''`。

### report({ url?, type?, payload })

发送 `payload`。优先 `navigator.sendBeacon`，失败降级为 1x1 图片请求。有通道接收返回 `true`，
无法发送（包括未配置接口）返回 `false`。

### createData(params?)

构造标准信封：事件 id、页面 URL、时间戳、referrer、视口、UA，配置了 `userIdCookie` 时还包含
`userId`。你传的 `params` 最后合并。SSR 下返回 `{}`。

## 示例

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## 注意

1. **刻意没有默认接口**。库无从知道你的埋点该发到哪，所以 `report()` 直接返回 `false` 而不是瞎猜。
2. **降级依据是 sendBeacon 是否真的成功**，而不是 `navigator` 存不存在。浏览器队列超配额时
   `sendBeacon` 也会返回 `false`，这种情况同样会落到图片兜底。
3. **每次事件都要调 `createData()`，不要在初始化时调一次**。它记录的是调用那一刻的 URL 和时间戳，
   把它提到处理函数外面调用，会让之后所有事件都上报页面加载时的状态。

::: warning 0.3 取代 getHost
`getHost()` 已删除。它用一个硬编码到本仓库作者的域名拼出日志接口，而且一次遗留改动早已把它的
输出退化成字面量 `'//log.'`（一个不可达的 host），于是所有不带 `url` 的上报都被静默发进了黑洞。
`createData()` 同样不再读硬编码的 `chaxus_prod` cookie，改为配置 `userIdCookie`。
:::
