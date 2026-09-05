---
description: 'O ranuts é uma biblioteca de utilidades em JavaScript/TypeScript pronta para tree-shaking: DOM/BOM, auxiliares para strings, objetos, números e cor, armazenamento, streaming, um motor de desenho 2D e um DOM virtual.'
---

# ranuts

Uma biblioteca de utilidades para o navegador e para o Node, publicada como **pontos de entrada independentes e prontos para tree-shaking**. Importe do subcaminho que tem o que você precisa e o resto nunca chega ao seu pacote. Tudo é TypeScript, e cada exportação é documentada a partir do código-fonte.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **código**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## Pontos de entrada

| Importação                                            | Contém                                                                       | Ambiente           |
| ----------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| `ranuts`                                              | O barril raiz: a superfície de utils e visual                                | navegador + node   |
| [`ranuts/utils`](/pt/src/ranuts/utils/)               | DOM/BOM, strings, objetos, números, cor, tempo, armazenamento, …             | navegador + node\* |
| [`ranuts/node`](/pt/src/ranuts/node/)                 | Servidor HTTP, roteador, WebSocket, fs, streams, middleware                  | **só node**        |
| [`ranuts/visual`](/pt/src/ranuts/visual/)             | Motor de desenho 2D (Canvas / WebGL / WebGPU)                                | **só navegador**   |
| [`ranuts/i18n`](/pt/src/ranuts/i18n/)                 | Motor de tradução: dicionários planos, troca em tempo de execução            | navegador + node   |
| [`ranuts/sw`](/pt/src/ranuts/sw/)                     | Estratégias de cache e a metade do protocolo de pré-cache que fica no worker | **service worker** |
| [`ranuts/vnode`](/pt/src/ranuts/vnode/)               | DOM virtual no estilo do Snabbdom                                            | navegador          |
| [`ranuts/stream`](/pt/src/ranuts/stream/)             | Análise de SSE, dobra de fluxos de modelos, orçamento de tokens              | navegador + node   |
| [`ranuts/conversation`](/pt/src/ranuts/conversation/) | Registro de eventos → nós de conversa desenháveis                            | navegador + node   |

\* O `ranuts/utils` é largo: quase tudo nele é voltado ao navegador, mas os auxiliares puros rodam em qualquer lugar. **Não importe `ranuts/node` em código de navegador.** Ele puxa `fs` / `http` / `child_process`.

## O que tem dentro

**Funcional**: [debounce](/pt/src/ranuts/utils/debounce) · [throttle](/pt/src/ranuts/utils/throttle) ·
[once / singleFlight](/pt/src/ranuts/utils/memoize) ·
[QuestQueue](/pt/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/pt/src/ranuts/utils/with_timeout) ·
[compose](/pt/src/ranuts/utils/compose)

**Dados**: [cloneDeep](/pt/src/ranuts/utils/clone_deep) · [isEqual](/pt/src/ranuts/utils/is_equal) ·
[merge](/pt/src/ranuts/utils/merge) · [filterObj](/pt/src/ranuts/utils/filter_obj) ·
[formatar e analisar números](/pt/src/ranuts/utils/parse_number) ·
[conversão e mistura de cor](/pt/src/ranuts/utils/color)

**Texto**: [md5](/pt/src/ranuts/utils/md5) · [truncate](/pt/src/ranuts/utils/truncate) ·
[detectLanguage](/pt/src/ranuts/utils/detect_language) ·
[resolveLocale](/pt/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/pt/src/ranuts/utils/segment) · [paginate](/pt/src/ranuts/utils/paginate) ·
[escapeHtml](/pt/src/ranuts/utils/escape_html)

**Navegador**: [armazenamento](/pt/src/ranuts/utils/local_storage) ·
[IndexedDB](/pt/src/ranuts/utils/web_db) · [cliente de worker](/pt/src/ranuts/utils/worker_client) ·
[ponte de postMessage](/pt/src/ranuts/bridge/) · [prefetch](/pt/src/ranuts/utils/prefetch) ·
[detecção de dispositivo](/pt/src/ranuts/utils/current_device) ·
[desempenho](/pt/src/ranuts/utils/get_performance) · [ZIP](/pt/src/ranuts/utils/zip) ·
[gravação de áudio](/pt/src/ranuts/utils/audio_recorder) ·
[voz para texto](/pt/src/ranuts/utils/speech)

**IA e chat**: [stream](/pt/src/ranuts/stream/) · [conversation](/pt/src/ranuts/conversation/) ·
[i18n](/pt/src/ranuts/i18n/)

**Desenho**: [motor 2D](/pt/src/ranuts/visual/) · [DOM virtual](/pt/src/ranuts/vnode/) ·
[auxiliares de canvas](/pt/src/ranuts/utils/canvas) · [tween](/pt/src/ranuts/utils/tween)

**Node**: [servidor HTTP e roteador](/pt/src/ranuts/node/) ·
[operações com arquivos](/pt/src/ranuts/file/write_file) ·
[tipos MIME](/pt/src/ranuts/mime_type/mime_type)

Isto é uma seleção. A [referência da API](/pt/src/ranuts/api) tem **todas** as exportações com assinatura e descrição, geradas do código-fonte para que não possam ficar desatualizadas.

## Para onde ir depois

| Se você quer…                                        | Leia                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Descobrir se uma função existe, e qual a assinatura  | [Referência da API](/pt/src/ranuts/api)                                         |
| Decidir entre duas utilidades parecidas              | [Escolher uma utilidade](/pt/src/ranuts/choosing/)                              |
| Passear por categoria                                | [Índice de utilidades](/pt/src/ranuts/utils/)                                   |
| Desenhar a resposta de um modelo que chega em stream | [stream](/pt/src/ranuts/stream/) → [conversation](/pt/src/ranuts/conversation/) |
| Construir interface por cima                         | [ranui](/pt/src/ranui/)                                                         |

Os dois pacotes levam um `CLAUDE.md` dentro do tarball do npm: orientação para agentes de código, legível direto do `node_modules` e sem acesso à rede.
