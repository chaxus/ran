# ranuts

Utilidades TypeScript para APIs del navegador, datos, flujos y renderizado 2D.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Inicio rápido

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

Elige una entrada según el entorno y la tarea. Algunas utilidades necesitan objetos globales del navegador; importar el paquete no hace que todas funcionen en el servidor.

| Paquete               | Uso                                                         |
| --------------------- | ----------------------------------------------------------- |
| `ranuts/utils`        | DOM/BOM, color, binarios, almacenamiento y otras utilidades |
| `ranuts/i18n`         | Internacionalización independiente                          |
| `ranuts/stream`       | Análisis SSE y estado de respuestas en streaming            |
| `ranuts/conversation` | Proyección del registro de eventos de conversación          |
| `ranuts/visual`       | Renderizado 2D; navegador                                   |
| `ranuts/vnode`        | DOM virtual; navegador                                      |
| `ranuts/sw`           | Estrategias de caché de Service Worker                      |

## IIFE / CDN

Para una etiqueta script clásica, usa un IIFE independiente. Sustituye VERSION por una versión publicada; no necesitas bundler ni cargador de módulos.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

El IIFE de utilidades expone `ranuts_utils`; el completo `dist/iife/index.iife.js` expone `ranuts`. Sustituye VERSION por una versión publicada.

## Documentación

- [ranuts](https://ran.chaxus.com/es/src/ranuts/)
- [API](./docs/API.md)
- [Referencia para mantenedores y agentes](./CLAUDE.md)

## Contribuir

[Referencia para mantenedores y agentes](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Licencia

[MIT](./LICENSE)
