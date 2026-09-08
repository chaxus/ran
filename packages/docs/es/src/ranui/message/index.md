---
description: 'La API Message de ranui muestra avisos globales (info, success, warning, error, toast) de forma imperativa, dibujados como una capa ligera.'
---

# Message

Componente de aviso global para resultados de operaciones, invocado de forma imperativa a través de la API `message` y dibujado como un aviso que se puede descartar.

> **Úsalo cuando** necesites un aviso pasajero y que se cierre solo para confirmar el resultado de una operación. Llama a la API imperativa `message.info` / `success` / `warning` / `error` / `toast` en vez de colocar marcado.

## Inicio rápido

<ran-demo>
  <r-button type="primary" onclick="message.info('Esto es un aviso')">Mostrar mensaje</r-button>
</ran-demo>

```html
<r-button type="primary" onclick="message.info('Esto es un aviso')">Mostrar mensaje</r-button>
```

Normalmente se llama a Message desde JavaScript. El objeto global `message` se registra en `window` (también disponible como `window.ranui.message`) en cuanto se carga el módulo del componente.

```js
message.info('Esto es un aviso');
message.success('Proyecto eliminado');
```

## Referencia de la API

### Métodos globales

Cada método añade un aviso y lo cierra solo tras `duration` milisegundos (por defecto `3000`). Los cinco comparten la misma firma.

| Método              | Descripción                                               |
| ------------------- | --------------------------------------------------------- |
| `message.info()`    | Aviso informativo neutro (icono azul de información)      |
| `message.success()` | Aviso de éxito (icono verde de comprobación)              |
| `message.warning()` | Aviso de advertencia (icono ámbar), anunciado con firmeza |
| `message.error()`   | Aviso de error (icono rojo), anunciado con firmeza        |
| `message.toast()`   | Aviso oscuro y liso, sin icono                            |

### Firma de los métodos

Cada método acepta o una `string` (el contenido) o un objeto de opciones.

```js
// 1. Pasa una cadena: solo el contenido, se cierra tras 3000 ms
message.info('Esto es un aviso');

// 2. Pasa un objeto de opciones
message.info({
  content: 'Esto es un aviso',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### Opciones

| Opción         | Tipo                        | Por defecto     | Descripción                                                                       |
| -------------- | --------------------------- | --------------- | --------------------------------------------------------------------------------- |
| `content`      | `string`                    | —               | Texto que se muestra (obligatorio al pasar un objeto)                             |
| `duration`     | `number`                    | `3000`          | Retardo en milisegundos antes de cerrarse solo                                    |
| `close`        | `() => void`                | —               | Callback que se dispara tras retirar el aviso                                     |
| `top`          | `number \| string`          | `8`             | Distancia de la pila de avisos al borde superior del contenedor (un número es px) |
| `zIndex`       | `number \| string`          | `1200`          | Orden de apilado del contenedor de avisos                                         |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | Devuelve el elemento en el que se monta la pila de avisos                         |

> Pasar `null`, `undefined` o ningún argumento no hace nada: no se muestra nada.

### Atributos del elemento `r-message`

Cada aviso es un custom element `<r-message>`. La API global define estos atributos por ti, pero también se pueden usar directamente.

| Atributo  | Tipo     | Por defecto | Descripción                                                                                          |
| --------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `type`    | `string` | —           | Uno de `info`, `success`, `warning`, `error`, `toast`. Elige icono, color y el rol de la región ARIA |
| `content` | `string` | —           | Texto dibujado dentro del aviso                                                                      |
| `sheet`   | `string` | `''`        | CSS inyectado en el shadow DOM del componente                                                        |

## Tipos de mensaje `type`

<ran-demo>
  <r-button onclick="message.info('Esto es un aviso')">Aviso informativo</r-button>
  <r-button onclick="message.success('Esto es un aviso')">Aviso de éxito</r-button>
  <r-button onclick="message.warning('Esto es un aviso')">Aviso de advertencia</r-button>
  <r-button onclick="message.error('Esto es un aviso')">Aviso de error</r-button>
  <r-button onclick="message.toast('Esto es un aviso')">Aviso toast</r-button>
</ran-demo>

```html
<r-button onclick="message.info('Esto es un aviso')">Aviso informativo</r-button>
<r-button onclick="message.success('Esto es un aviso')">Aviso de éxito</r-button>
<r-button onclick="message.warning('Esto es un aviso')">Aviso de advertencia</r-button>
<r-button onclick="message.error('Esto es un aviso')">Aviso de error</r-button>
<r-button onclick="message.toast('Esto es un aviso')">Aviso toast</r-button>
```

## Duración a medida `duration`

<ran-demo>
  <r-button onclick="message.info({ content: 'Dura 6 s', duration: 6000 })">Aviso de 6 segundos</r-button>
  <r-button onclick="message.info({ content: 'Dura 1 s', duration: 1000 })">Aviso de 1 segundo</r-button>
</ran-demo>

```html
<r-button onclick="message.info({ content: 'Dura 6 s', duration: 6000 })">Aviso de 6 segundos</r-button>
<r-button onclick="message.info({ content: 'Dura 1 s', duration: 1000 })">Aviso de 1 segundo</r-button>
```

## Callback de cierre `close`

El callback `close` se ejecuta después de retirar el aviso del DOM.

<ran-demo>
  <r-button onclick="message.success({ content: 'Guardado', close: () => message.info('Aviso cerrado') })">Mensaje encadenado</r-button>
</ran-demo>

```html
<r-button onclick="message.success({ content: 'Guardado', close: () => message.info('Aviso cerrado') })"
  >Mensaje encadenado</r-button
>
```

```js
message.success({
  content: 'Guardado',
  close: () => {
    // se ejecuta una vez descartado el aviso
    console.log('toast closed');
  },
});
```

## Colocación a medida `top` / `zIndex` / `getContainer`

<ran-demo>
  <r-button onclick="message.info({ content: 'Desplazado hacia abajo', top: 120 })">Desplazar desde arriba</r-button>
</ran-demo>

```js
message.info({
  content: 'Desplazado hacia abajo',
  top: 120, // distancia desde el borde superior del contenedor
  zIndex: 1300, // orden de apilado
  getContainer: () => document.querySelector('#app'), // punto de montaje propio
});
```

## Estilos

La pila de avisos vive en un contenedor portalizado al body; cada `<r-message>` dibuja su contenido dentro de un shadow DOM cuya superficie se puede tematizar con variables CSS (todas con valores de reserva razonables).

| Variable CSS                          | Por defecto                    | Descripción                       |
| ------------------------------------- | ------------------------------ | --------------------------------- |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | Fondo de la superficie del aviso  |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | Radio de esquina del aviso        |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | Elevación del aviso               |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | Color del texto del aviso         |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | z-index de la pila                |
| `--ran-message-top`                   | `8px`                          | Distancia de la pila desde arriba |

## Buenas prácticas

- **Nombra el cambio**: escribe el texto del aviso como un resultado, «Proyecto eliminado» o «Cambios guardados», no un vago «Éxito».
- **Éxito e información**: usa `message.success` / `message.info` para confirmaciones que no bloquean.
- **Errores y advertencias**: usa `message.error` / `message.warning`; estos escalan a una región ARIA viva asertiva, de modo que los lectores de pantalla interrumpen.
- **Sé breve**: un aviso se cierra solo, así que reserva el contenido largo o accionable para un diálogo.
- **Ajusta la duración con moderación**: sube `duration` para mensajes largos, pero evita volver permanente un aviso pasajero.
