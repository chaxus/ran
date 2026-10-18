<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Componentes de interfaz y herramientas TypeScript para aplicaciones web.</p>
<p align="center"><a href="https://ran.chaxus.com/es/">Documentación</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <b>Español</b> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran es un conjunto de bibliotecas para crear interfaces web. Permite construir formularios, paneles y páginas de contenido con componentes HTML, reutilizar funciones del navegador y de procesamiento de datos, o componer vistas DOM reactivas directamente en TypeScript.

Cada paquete se puede instalar por separado. El [sitio de documentación](./packages/docs/) y la [demo de IM](./packages/im/) muestran cómo se combinan en aplicaciones completas.

## Elige un paquete

| Paquete                                         | Qué puedes crear                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.es.md)          | Interfaces con elementos HTML personalizados: entradas, selectores, diálogos, tablas, Markdown y reproductores multimedia. Incluye temas y herramientas de renderizado en servidor. |
| [ranuts](./packages/ranuts/README.es.md)        | Flujos de navegador y datos: conversiones de color y datos binarios, almacenamiento, análisis SSE y estado de respuestas en streaming.                                              |
| [@alixex/ranview](./packages/ranview/README.md) | Vistas DOM con constructores encadenables y señales reactivas; instantáneas HTML estáticas para renderizado en servidor.                                                            |

## Prueba ranui

Instálalo en una aplicación de navegador con un empaquetador compatible con ESM:

```sh
npm install ranui
```

Añade esto a la entrada JavaScript de la aplicación. Crea un botón que responde al clic:

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = 'Guardar';
button.addEventListener('click', () => {
  button.textContent = 'Guardado';
});
document.body.append(button);
```

Los componentes usan elementos personalizados y eventos estándar del navegador, sin requerir el runtime de React o Vue. Importa otros componentes desde sus propias entradas, como `ranui/input`. Consulta los [ejemplos de componentes](https://ran.chaxus.com/es/src/ranui/) para ver etiquetas, eventos y personalización, o el [ejemplo de script independiente](./packages/ranui/README.es.md#iife--cdn) para usarlos sin empaquetador.

## Desarrollo del repositorio

Usa Node 24+ y pnpm 11.6.0.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Cada paquete incluye sus guías y ejemplos. Lee las [normas del repositorio](./AGENTS.md) antes de contribuir y las [instrucciones de publicación](./docs/RELEASING.md) al preparar los paquetes.

## Licencia

[MIT](./LICENSE)
