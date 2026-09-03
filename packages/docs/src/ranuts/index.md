---
description: 'ranuts is a tree-shakeable JavaScript/TypeScript utility library: DOM/BOM, string/object/number/color helpers, storage, streaming, a 2D rendering engine and a virtual DOM.'
---

# ranuts

A utility library for the front end and for Node, published as **independent, tree-shakeable
entry points**. Import from the subpath that owns what you need and the rest never reaches your
bundle. Everything is TypeScript, and every export is documented from source.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **source**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## Entry points

| Import                                             | Contains                                                  | Runtime            |
| -------------------------------------------------- | --------------------------------------------------------- | ------------------ |
| `ranuts`                                           | Root barrel: the utils + visual surface                   | browser + node     |
| [`ranuts/utils`](/src/ranuts/utils/)               | DOM/BOM, string, object, number, colour, time, storage, … | browser + node\*   |
| [`ranuts/node`](/src/ranuts/node/)                 | HTTP server, router, WebSocket, fs, streams, middleware   | **node only**      |
| [`ranuts/visual`](/src/ranuts/visual/)             | 2D rendering engine (Canvas / WebGL / WebGPU)             | **browser only**   |
| [`ranuts/i18n`](/src/ranuts/i18n/)                 | Translation engine: flat dictionaries, runtime switching  | browser + node     |
| [`ranuts/sw`](/src/ranuts/sw/)                     | Cache strategies and the precache protocol's worker half  | **service worker** |
| [`ranuts/vnode`](/src/ranuts/vnode/)               | Snabbdom-style virtual DOM                                | browser            |
| [`ranuts/stream`](/src/ranuts/stream/)             | SSE parsing, model-stream fold, token budget              | browser + node     |
| [`ranuts/conversation`](/src/ranuts/conversation/) | Event log → renderable conversation nodes                 | browser + node     |

\* `ranuts/utils` is broad: most of it is browser-oriented, but the pure helpers run anywhere.
**Do not import `ranuts/node` in browser code.** It pulls in `fs` / `http` / `child_process`.

## What's in it

**Functional**: [debounce](/src/ranuts/utils/debounce) · [throttle](/src/ranuts/utils/throttle) ·
[once / singleFlight](/src/ranuts/utils/memoize) ·
[QuestQueue](/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/src/ranuts/utils/with_timeout) ·
[compose](/src/ranuts/utils/compose)

**Data**: [cloneDeep](/src/ranuts/utils/clone_deep) · [isEqual](/src/ranuts/utils/is_equal) ·
[merge](/src/ranuts/utils/merge) · [filterObj](/src/ranuts/utils/filter_obj) ·
[format / parse numbers](/src/ranuts/utils/parse_number) ·
[colour conversion and blending](/src/ranuts/utils/color)

**Text**: [md5](/src/ranuts/utils/md5) · [truncate](/src/ranuts/utils/truncate) ·
[detectLanguage](/src/ranuts/utils/detect_language) ·
[resolveLocale](/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/src/ranuts/utils/segment) · [paginate](/src/ranuts/utils/paginate) ·
[escapeHtml](/src/ranuts/utils/escape_html)

**Browser**: [storage](/src/ranuts/utils/local_storage) ·
[IndexedDB](/src/ranuts/utils/web_db) · [worker client](/src/ranuts/utils/worker_client) ·
[postMessage bridge](/src/ranuts/bridge/) · [prefetch](/src/ranuts/utils/prefetch) ·
[device detection](/src/ranuts/utils/current_device) ·
[performance](/src/ranuts/utils/get_performance) · [ZIP](/src/ranuts/utils/zip) ·
[audio recording](/src/ranuts/utils/audio_recorder) ·
[speech to text](/src/ranuts/utils/speech)

**AI & chat**: [stream](/src/ranuts/stream/) · [conversation](/src/ranuts/conversation/) ·
[i18n](/src/ranuts/i18n/)

**Rendering**: [2D engine](/src/ranuts/visual/) · [virtual DOM](/src/ranuts/vnode/) ·
[canvas helpers](/src/ranuts/utils/canvas) · [tween](/src/ranuts/utils/tween)

**Node**: [HTTP server and router](/src/ranuts/node/) ·
[file operations](/src/ranuts/file/write_file) ·
[MIME types](/src/ranuts/mime_type/mime_type)

That is a selection. The [API reference](/src/ranuts/api) has **every** export with its
signature and description, generated from source so it cannot drift.

## Where to go next

| If you want to…                                       | Read                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Find out whether a function exists, and its signature | [API reference](/src/ranuts/api)                                          |
| Decide between two similar utilities                  | [Choosing a utility](/src/ranuts/choosing/)                               |
| Browse by category                                    | [Utility index](/src/ranuts/utils/)                                       |
| Render a streamed model response                      | [stream](/src/ranuts/stream/) → [conversation](/src/ranuts/conversation/) |
| Build UI on top of it                                 | [ranui](/src/ranui/)                                                      |

Both packages ship `CLAUDE.md` inside the npm tarball: orientation for coding agents, readable
straight from `node_modules` with no network access.
