# ranuts

Biblioteca experimental de utilitários, com as funções e ferramentas do dia a dia

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

---

## ⚠️ Antes de começar

Esta é uma **biblioteca experimental de utilitários** ainda no começo. Ela funciona, mas foi pensada sobretudo para aprender e experimentar.

**O essencial:**

- 🚧 **No começo**: os recursos ainda estão sendo escritos e lapidados
- 🧪 **Experimental**: as APIs podem mudar com frequência
- 📚 **Com o aprendizado em primeiro lugar**: serve principalmente para aprender utilitários de JavaScript e TypeScript

## Instalação

Com o npm:

```console
npm install ranuts@latest --save
```

## Documentação

[Algumas funções e ferramentas de uso corrente](https://ran.chaxus.com/pt/src/ranuts/)

**Para agentes de IA e LLMs:** comece pelo [CLAUDE.md](./CLAUDE.md) (a orientação geral: pontos de entrada, limites do ambiente, convenções) e siga para o [docs/API.md](./docs/API.md) (referência gerada de todos os símbolos exportados, com assinaturas e descrições; para regerar, `npm run doc:api`).

Ou instale a **skill do Claude Code** já pronta no marketplace de plugins `ran`: ela entrega ao assistente o mapa de importações, o inventário do `ranuts/utils`, exemplos de uso e as convenções, e o leva à referência da API que vai dentro do pacote:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

Daí em diante o Claude a usa sozinho (ou você a invoca com `/ranuts:ranuts`).

## Uso

Importe só o que precisar. Dá para escolher entre:

- `ranuts/utils` — DOM/BOM, strings, objetos, números, cor, tempo, armazenamento, binário e zip, worker e IndexedDB, auxiliares de i18n
- `ranuts/node` — servidor HTTP, roteador, WebSocket, fs, fluxos, middleware (**só Node**)
- `ranuts/visual` — motor de desenho 2D (Canvas / WebGL / WebGPU, **só navegador**)
- `ranuts/sw` — estratégias de cache e a metade do protocolo de pré-cache que vive no service worker (**só service worker**)
- `ranuts/vnode` — DOM virtual ao estilo do Snabbdom
- `ranuts/stream` — leitura de Server-Sent Events, uma dobra neutra quanto ao provedor da resposta de um modelo em streaming, e o orçamento de tokens que decide quando um histórico deixa de caber
- `ranuts/conversation` — projeta um registro de eventos só de acréscimo em nós de conversa desenháveis
- `ranuts/i18n` — o motor de i18n sozinho, sem o resto do `utils`

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

Importação completa (que arrasta um monte de módulos desnecessários; melhor importar só o que for usar)

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('window resized');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('window resized');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## Como contribuir

Toda contribuição é bem-vinda, você venha aprender ou programar. É um projeto experimental, então tenha paciência com o ritmo do desenvolvimento.

## Quem contribuiu

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Visitas

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## Diversos

[Licença (MIT)](/LICENSE)
