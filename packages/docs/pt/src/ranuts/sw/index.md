# ranuts/sw — Service Worker

Peças para montar um Service Worker: as duas estratégias de cache que todo SW acaba escrevendo, e a metade do protocolo de pré-cache que fica no worker, cuja metade de página mora em [prefetch](../utils/prefetch).

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**É um ponto de entrada próprio.** Este código roda num `ServiceWorkerGlobalScope`, onde `window` e `document` não existem; importá-lo de `ranuts/utils` arrastaria módulos voltados ao DOM para dentro do pacote do worker.

**Ele pressupõe um Service Worker empacotado.** Um `sw.js` escrito à mão e servido como arquivo estático não consegue importar de `node_modules`: ou você o empacota, ou copia as peças de que precisa.

## API

| Função                             | Descrição                                                           |
| ---------------------------------- | ------------------------------------------------------------------- |
| `cacheFirst(request, options)`     | Serve a cópia em cache e, se não houver, busca e guarda             |
| `networkFirst(request, options)`   | Busca na rede e atualiza o cache; sem conexão, recai nele           |
| `precache(cacheName, urls, opts?)` | Enche um cache, pulando o que já estiver lá                         |
| `dropCachesExcept(keep, opts?)`    | Apaga todos os outros caches; devolve os nomes apagados             |
| `servePrecache(options)`           | Responde a `prefetchUrls({ serviceWorkerMessage })`; devolve `stop` |

Opções de estratégia: `{ cacheName, shouldCache?, scope? }`. O padrão de `shouldCache` é "qualquer GET respondido com 200"; `scope` substitui o global, para testes ou para um worker que não seja o global.

## Exemplo

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

// A outra ponta de prefetchUrls({ serviceWorkerMessage: 'precache-models' })
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## Notas

1. **`cacheFirst` para recursos imutáveis com hash de conteúdo**: scripts, estilos, fontes, pesos de modelos. **`networkFirst` para tudo que precisa refletir um deploy na hora**: navegações HTML, um manifesto.
2. **Nenhuma das duas estratégias rejeita.** Uma falha de rede sem nada em cache resolve para um 408, então um `respondWith` nunca lança.
3. **A resposta é clonada de forma síncrona, antes de o corpo ser lido.** Esperar primeiro pelo `caches.open()` e clonar depois é o defeito clássico: a essa altura o corpo já pode estar seguindo para a página, e o `clone()` lança.
4. **`precache` é idempotente e tolerante URL a URL**: um único 404 na lista não pode abortar uma instalação.
5. **Baixar dentro do SW é justamente o ponto do `servePrecache`.** O trabalho vai embrulhado em `event.waitUntil`, então sobrevive às navegações; uma busca do lado da página é abortada no instante em que a pessoa sai, e um recurso grande recomeça do zero na próxima visita.
