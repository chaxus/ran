# getHost

**Removed in 0.3.** `getHost()` derived a logging endpoint from a domain hard-coded to this
repository's author, and a leftover edit had already reduced its output to the literal
`'//log.'`, which is not a reachable host.

Configure the endpoint explicitly instead — see [report / setReportUrl](./report).

```js
import { report, setReportUrl } from 'ranuts';

setReportUrl('https://telemetry.example.com/collect');
report({ payload: { type: 'page_view' } });
```
