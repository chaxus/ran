# getHost

**0.3 已删除。** `getHost()` 用一个硬编码到本仓库作者的域名拼日志接口，而且一次遗留改动早已把
它的输出退化成字面量 `'//log.'` —— 一个不可达的 host。

请改为显式配置接口，见 [report / setReportUrl](./report)。

```js
import { report, setReportUrl } from 'ranuts';

setReportUrl('https://telemetry.example.com/collect');
report({ payload: { type: 'page_view' } });
```
