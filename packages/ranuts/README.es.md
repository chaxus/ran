# ranuts

Biblioteca experimental de utilidades, con las funciones y herramientas de siempre

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

---

## ⚠️ Antes de empezar

Esta es una **biblioteca experimental de utilidades** en sus primeras etapas. Funciona, pero está pensada sobre todo para aprender y experimentar.

**Lo esencial:**

- 🚧 **En sus primeras etapas**: las funcionalidades todavía se están escribiendo y puliendo
- 🧪 **Experimental**: las API pueden cambiar a menudo
- 📚 **Con el aprendizaje por delante**: sobre todo para aprender utilidades de JavaScript y TypeScript

## Instalación

Con npm:

```console
npm install ranuts@latest --save
```

## Documentación

[Unas cuantas funciones y herramientas de uso corriente](https://ran.chaxus.com/es/src/ranuts/)

**Para agentes de IA y LLM:** empieza por [CLAUDE.md](./CLAUDE.md) (la orientación: puntos de entrada, límites del entorno, convenciones) y sigue con [docs/API.md](./docs/API.md) (referencia generada de todos los símbolos exportados, con firmas y descripciones; para regenerarla, `npm run doc:api`).

O instala la **skill de Claude Code** ya hecha desde el marketplace de plugins `ran`: le da al asistente el mapa de importaciones, el inventario de `ranuts/utils`, ejemplos de uso y las convenciones, y lo lleva a la referencia de la API que viaja dentro del paquete:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

A partir de ahí Claude la usa sola (o la invocas tú con `/ranuts:ranuts`).

## Uso

Importa solo lo que necesites. Puedes elegir entre:

- `ranuts/utils` — DOM/BOM, cadenas, objetos, números, color, tiempo, almacenamiento, binario y zip, worker e IndexedDB, ayudas de i18n
- `ranuts/node` — servidor HTTP, enrutador, WebSocket, fs, flujos, middleware (**solo Node**)
- `ranuts/visual` — motor de dibujo 2D (Canvas / WebGL / WebGPU, **solo navegador**)
- `ranuts/sw` — estrategias de caché y la mitad del protocolo de precarga que vive en el service worker (**solo service worker**)
- `ranuts/vnode` — DOM virtual al estilo de Snabbdom
- `ranuts/stream` — lectura de Server-Sent Events, un plegado neutral respecto al proveedor de la respuesta de un modelo en streaming, y el presupuesto de tokens que decide cuándo un historial deja de caber
- `ranuts/conversation` — proyecta un registro de eventos de solo añadidura en nodos de conversación dibujables
- `ranuts/i18n` — el motor de i18n a solas, sin el resto de `utils`

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

Importación completa (que arrastra muchos módulos que no necesitas; mejor importa solo lo que uses)

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

## Cómo contribuir

Toda contribución es bienvenida, vengas a aprender o a programar. Es un proyecto experimental, así que ten paciencia con el ritmo del desarrollo.

## Quienes han contribuido

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Visitas

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## Varios

[Licencia (MIT)](/LICENSE)
