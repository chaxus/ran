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

| Importação                                        | Contém                                                                       | Ambiente           |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| `ranuts`                                          | O barril raiz: a superfície de utils e visual                                | navegador + node   |
| [`ranuts/utils`](/pt/ranuts/utils/)               | DOM/BOM, strings, objetos, números, cor, tempo, armazenamento, …             | navegador + node   |
| [`ranuts/visual`](/pt/ranuts/visual/)             | Motor de desenho 2D (Canvas / WebGL / WebGPU)                                | **só navegador**   |
| [`ranuts/i18n`](/pt/ranuts/i18n/)                 | Motor de tradução: dicionários planos, troca em tempo de execução            | navegador + node   |
| [`ranuts/sw`](/pt/ranuts/sw/)                     | Estratégias de cache e a metade do protocolo de pré-cache que fica no worker | **service worker** |
| [`ranuts/vnode`](/pt/ranuts/vnode/)               | DOM virtual no estilo do Snabbdom                                            | navegador          |
| [`ranuts/stream`](/pt/ranuts/stream/)             | Análise de SSE, dobra de fluxos de modelos, orçamento de tokens              | navegador + node   |
| [`ranuts/conversation`](/pt/ranuts/conversation/) | Registro de eventos → nós de conversa desenháveis                            | navegador + node   |

## O que tem dentro

**Funcional**: [debounce](/pt/ranuts/utils/debounce) · [throttle](/pt/ranuts/utils/throttle) ·
[once / singleFlight](/pt/ranuts/utils/memoize) ·
[QuestQueue](/pt/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/pt/ranuts/utils/with_timeout) ·
[compose](/pt/ranuts/utils/compose)

**Dados**: [cloneDeep](/pt/ranuts/utils/clone_deep) · [isEqual](/pt/ranuts/utils/is_equal) ·
[merge](/pt/ranuts/utils/merge) · [filterObj](/pt/ranuts/utils/filter_obj) ·
[formatar e analisar números](/pt/ranuts/utils/parse_number) ·
[conversão e mistura de cor](/pt/ranuts/utils/color)

**Texto**: [truncate](/pt/ranuts/utils/truncate) ·
[detectLanguage](/pt/ranuts/utils/detect_language) ·
[resolveLocale](/pt/ranuts/utils/resolve_locale) ·
[segmentByRanges](/pt/ranuts/utils/segment) · [paginate](/pt/ranuts/utils/paginate) ·
[escapeHtml](/pt/ranuts/utils/escape_html)

**Navegador**: [armazenamento](/pt/ranuts/utils/local_storage) ·
[IndexedDB](/pt/ranuts/utils/web_db) · [cliente de worker](/pt/ranuts/utils/worker_client) ·
[ponte de postMessage](/pt/ranuts/bridge/) · [prefetch](/pt/ranuts/utils/prefetch) ·
[detecção de dispositivo](/pt/ranuts/utils/current_device) ·
[desempenho](/pt/ranuts/utils/get_performance) · [ZIP](/pt/ranuts/utils/zip) ·
[gravação de áudio](/pt/ranuts/utils/audio_recorder) ·
[voz para texto](/pt/ranuts/utils/speech)

**IA e chat**: [stream](/pt/ranuts/stream/) · [conversation](/pt/ranuts/conversation/) ·
[i18n](/pt/ranuts/i18n/)

**Desenho**: [motor 2D](/pt/ranuts/visual/) · [DOM virtual](/pt/ranuts/vnode/) ·
[auxiliares de canvas](/pt/ranuts/utils/canvas) · [tween](/pt/ranuts/utils/tween)

Isto é uma seleção. A [referência da API](/pt/ranuts/api) tem **todas** as exportações com assinatura e descrição, geradas do código-fonte para que não possam ficar desatualizadas.

## Para onde ir depois

| Se você quer…                                        | Leia                                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Descobrir se uma função existe, e qual a assinatura  | [Referência da API](/pt/ranuts/api)                                     |
| Decidir entre duas utilidades parecidas              | [Escolher uma utilidade](/pt/ranuts/choosing/)                          |
| Passear por categoria                                | [Índice de utilidades](/pt/ranuts/utils/)                               |
| Desenhar a resposta de um modelo que chega em stream | [stream](/pt/ranuts/stream/) → [conversation](/pt/ranuts/conversation/) |
| Construir interface por cima                         | [ranui](/pt/ranui/)                                                     |

Os dois pacotes levam um `CLAUDE.md` dentro do tarball do npm: orientação para agentes de código, legível direto do `node_modules` e sem acesso à rede.
