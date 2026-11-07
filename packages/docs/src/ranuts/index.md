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

| Import                                         | Contains                                                  | Runtime            |
| ---------------------------------------------- | --------------------------------------------------------- | ------------------ |
| `ranuts`                                       | Root barrel: the utils + visual surface                   | browser + node     |
| [`ranuts/utils`](/ranuts/utils/)               | DOM/BOM, string, object, number, colour, time, storage, … | browser + node     |
| [`ranuts/visual`](/ranuts/visual/)             | 2D rendering engine (Canvas / WebGL / WebGPU)             | **browser only**   |
| [`ranuts/i18n`](/ranuts/i18n/)                 | Translation engine: flat dictionaries, runtime switching  | browser + node     |
| [`ranuts/sw`](/ranuts/sw/)                     | Cache strategies and the precache protocol's worker half  | **service worker** |
| [`ranuts/vnode`](/ranuts/vnode/)               | Snabbdom-style virtual DOM                                | browser            |
| [`ranuts/stream`](/ranuts/stream/)             | SSE parsing, model-stream fold, token budget              | browser + node     |
| [`ranuts/conversation`](/ranuts/conversation/) | Event log → renderable conversation nodes                 | browser + node     |

## What's in it

**Functional**: [debounce](/ranuts/utils/debounce) · [throttle](/ranuts/utils/throttle) ·
[once / singleFlight](/ranuts/utils/memoize) ·
[QuestQueue](/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/ranuts/utils/with_timeout) ·
[compose](/ranuts/utils/compose)

**Data**: [cloneDeep](/ranuts/utils/clone_deep) · [isEqual](/ranuts/utils/is_equal) ·
[merge](/ranuts/utils/merge) · [filterObj](/ranuts/utils/filter_obj) ·
[format / parse numbers](/ranuts/utils/parse_number) ·
[colour conversion and blending](/ranuts/utils/color)

**Text**: [truncate](/ranuts/utils/truncate) ·
[detectLanguage](/ranuts/utils/detect_language) ·
[resolveLocale](/ranuts/utils/resolve_locale) ·
[segmentByRanges](/ranuts/utils/segment) · [paginate](/ranuts/utils/paginate) ·
[escapeHtml](/ranuts/utils/escape_html)

**Browser**: [storage](/ranuts/utils/local_storage) ·
[IndexedDB](/ranuts/utils/web_db) · [worker client](/ranuts/utils/worker_client) ·
[postMessage bridge](/ranuts/bridge/) · [prefetch](/ranuts/utils/prefetch) ·
[device detection](/ranuts/utils/current_device) ·
[performance](/ranuts/utils/get_performance) · [ZIP](/ranuts/utils/zip) ·
[audio recording](/ranuts/utils/audio_recorder) ·
[speech to text](/ranuts/utils/speech)

**AI & chat**: [stream](/ranuts/stream/) · [conversation](/ranuts/conversation/) ·
[i18n](/ranuts/i18n/)

**Rendering**: [2D engine](/ranuts/visual/) · [virtual DOM](/ranuts/vnode/) ·
[canvas helpers](/ranuts/utils/canvas) · [tween](/ranuts/utils/tween)

That is a selection. The [API reference](/ranuts/api) has **every** export with its
signature and description, generated from source so it cannot drift.

## Where to go next

| If you want to…                                       | Read                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Find out whether a function exists, and its signature | [API reference](/ranuts/api)                                      |
| Decide between two similar utilities                  | [Choosing a utility](/ranuts/choosing/)                           |
| Browse by category                                    | [Utility index](/ranuts/utils/)                                   |
| Render a streamed model response                      | [stream](/ranuts/stream/) → [conversation](/ranuts/conversation/) |
| Build UI on top of it                                 | [ranui](/ranui/)                                                  |

Both packages ship `CLAUDE.md` inside the npm tarball: orientation for coding agents, readable
straight from `node_modules` with no network access.
