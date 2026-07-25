# report / setReportUrl / createData

Send telemetry beacons to your own endpoint.

## API

### setReportUrl(config)

Configure the default endpoint once at startup. Accepts a URL string, or an object:

| Field          | Description                                                        | Type     |
| -------------- | ------------------------------------------------------------------ | -------- |
| `url`          | Default endpoint for every `report()` without its own `url`         | `string` |
| `userIdCookie` | Cookie holding the user id, included by `createData()`              | `string` |

### getReportUrl()

The configured endpoint, or `''`.

### report({ url?, type?, payload })

Sends `payload`. Prefers `navigator.sendBeacon` and falls back to a 1x1 image request.
Returns `true` when some transport accepted it, `false` when nothing could send — including
when no endpoint has been configured.

### createData(params?)

Builds the standard envelope: event id, page URL, timestamp, referrer, viewport, user agent,
plus `userId` when `userIdCookie` is configured. Your `params` are applied last. Returns `{}`
under SSR.

## Example

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## Notes

1. **There is no default endpoint, by design.** A library cannot know where your telemetry
   belongs, so `report()` returns `false` rather than guessing.
2. **The transport is chosen by whether sendBeacon actually succeeded**, not by whether
   `navigator` exists. `sendBeacon` also returns `false` when the browser's queue is over
   quota — that case falls through to the image beacon too.
3. **Call `createData()` per event, not once at setup.** It snapshots the URL and timestamp at
   the moment it runs; hoisting it out of a handler makes every later event report the state
   of page load.

::: warning Replaces getHost in 0.3
`getHost()` has been removed. It built a log endpoint from a domain hard-coded to this repo's
author, and a leftover edit had already degraded its output to the literal `'//log.'` — not a
reachable host — so every report without an explicit `url` was silently posted into the void.
`createData()` likewise no longer reads a hard-coded `chaxus_prod` cookie; configure
`userIdCookie` instead.
:::
