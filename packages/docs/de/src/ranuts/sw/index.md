# ranuts/sw — Service Worker

Bausteine für einen Service Worker: die beiden Caching-Strategien, die am Ende jeder SW schreibt, und die Worker-Hälfte des Precache-Protokolls, dessen Seiten-Hälfte in [prefetch](../utils/prefetch) liegt.

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**Ein eigener Einstiegspunkt.** Dieser Code läuft in einem `ServiceWorkerGlobalScope`, in dem es weder `window` noch `document` gibt; ihn aus `ranuts/utils` zu importieren zöge DOM-nahe Module in das Worker-Bundle.

**Er setzt einen gebündelten Service Worker voraus.** Ein handgeschriebenes, als statische Datei ausgeliefertes `sw.js` kann nicht aus `node_modules` importieren: Entweder du bündelst es, oder du kopierst dir die benötigten Teile heraus.

## API

| Funktion                           | Beschreibung                                                             |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `cacheFirst(request, options)`     | Liefert die Kopie aus dem Cache, sonst wird geholt und abgelegt          |
| `networkFirst(request, options)`   | Holt und frischt den Cache auf, fällt offline auf ihn zurück             |
| `precache(cacheName, urls, opts?)` | Füllt einen Cache und überspringt, was schon da ist                      |
| `dropCachesExcept(keep, opts?)`    | Löscht alle anderen Caches; gibt die gelöschten Namen zurück             |
| `servePrecache(options)`           | Beantwortet `prefetchUrls({ serviceWorkerMessage })`; gibt `stop` zurück |

Strategie-Optionen: `{ cacheName, shouldCache?, scope? }`. `shouldCache` heißt standardmäßig „jedes GET, das mit 200 beantwortet wurde"; `scope` ersetzt das globale Objekt, für Tests oder einen nicht globalen Worker.

## Beispiel

```js
// sw.ts
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';

const ASSETS = `assets_${BUILD_ID}`;
const MODELS = 'models';

self.addEventListener('install', (e) => e.waitUntil(precache(ASSETS, PRECACHE_URLS)));
self.addEventListener('activate', (e) => e.waitUntil(dropCachesExcept([ASSETS, MODELS])));

self.addEventListener('fetch', (event) => {
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith(
    isNavigation
      ? networkFirst(event.request, { cacheName: ASSETS })
      : cacheFirst(event.request, { cacheName: ASSETS }),
  );
});

// Das andere Ende von prefetchUrls({ serviceWorkerMessage: 'precache-models' })
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## Hinweise

1. **`cacheFirst` für unveränderliche, inhaltsgehashte Dateien**: Skripte, Stile, Schriften, Modellgewichte. **`networkFirst` für alles, was ein Deployment sofort widerspiegeln muss**: HTML-Navigationen, ein Manifest.
2. **Keine der beiden Strategien lehnt ab.** Ein Netzwerkfehler ohne etwas im Cache löst sich zu einem 408 auf, ein `respondWith` wirft also nie.
3. **Die Antwort wird synchron geklont, bevor der Körper gelesen wird.** Erst auf `caches.open()` zu warten und danach zu klonen ist der klassische Fehler: Bis dahin strömt der Körper womöglich schon zur Seite, und `clone()` wirft.
4. **`precache` ist idempotent und je URL nachsichtig**: Ein einzelner 404 in der Liste darf keine Installation abbrechen.
5. **Im SW herunterzuladen ist genau der Sinn von `servePrecache`.** Die Arbeit steckt in `event.waitUntil` und überlebt daher Navigationen; ein Abruf auf Seiten der Seite wird in dem Moment abgebrochen, in dem jemand weiterklickt, und eine große Datei beginnt beim nächsten Besuch wieder bei null.
