---
description: 'Una muestra de color compacta que abre un panel con controles de saturación/luminosidad, tono y transparencia, además de una entrada HEX/RGB.'
---

# Color Picker

Una muestra de color compacta que abre un panel emergente con una paleta de saturación y luminosidad, un deslizador de tono, uno de transparencia y una entrada de valor HEX/RGB. Su `value` acepta y emite cadenas de color CSS estándar.

> **Úsalo cuando** quieras que la gente elija un color con un panel de saturación, tono y transparencia y una entrada HEX/RGB: `<r-colorpicker>` acepta y emite cadenas de color CSS estándar y comunica todos los formatos en `change`.

## Inicio rápido

### Uso básico

<Demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

Haz clic en la muestra (o enfócala y pulsa Intro/Espacio) para abrir el panel. Los deslizadores de tono y transparencia se manejan con el teclado: las flechas avanzan de 1 en 1, Mayús+flecha de 10 en 10, e Inicio/Fin saltan a los extremos.

## Referencia de la API

### Propiedades

| Propiedad  | Tipo      | Por defecto | Descripción                                                                              |
| ---------- | --------- | ----------- | ---------------------------------------------------------------------------------------- |
| `value`    | `string`  | `''`        | El color actual como cadena de color CSS (HEX, `rgb(...)`, `rgba(...)`)                  |
| `disabled` | `boolean` | `false`     | Presente, la muestra no se abre, sale del orden de tabulación y se marca `aria-disabled` |
| `sheet`    | `string`  | `''`        | CSS inyectado en el shadow DOM del componente                                            |

### Valor `value`

El color actual, como cadena de color CSS. A la entrada acepta HEX (`#1677FF`, `#fff`), `rgb(...)` y `rgba(...)`. A la salida, el valor canónico que se lee es una cadena HEX de 6 dígitos cuando el color es totalmente opaco, o una cadena `rgba(...)` cuando la transparencia es menor que 1.

<Demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // lee el color actual
toolbar.append(picker);
```

### Deshabilitado `disabled`

Añade el atributo `disabled` para dejar el selector inerte: la muestra ya no abre el panel (ni con ratón ni con teclado), sale del orden de tabulación y el host se marca con `aria-disabled="true"`. Quitar el atributo restaura la interacción normal.

<Demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // bloquear la interacción
picker.disabled = false; // volver a habilitar
toolbar.append(picker);
```

### Estilos externos `sheet`

CSS inyectado en el shadow DOM del componente. Sigue la misma convención `sheet` que usan todos los demás componentes de ranui.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## Eventos

### `change`

Se dispara cada vez que cambia el color: al arrastrar la paleta, mover un deslizador, editar la entrada de valor o definir el atributo `value`. **Burbujea** y es **composed** (cruza los límites del shadow DOM). `event.detail` lleva el color en todos los formatos:

| Campo   | Tipo     | Ejemplo                                   |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## Partes CSS

La muestra que abre el panel expone dos partes para darle estilo desde fuera del shadow DOM:

| Parte    | Descripción                                             |
| -------- | ------------------------------------------------------- |
| `block`  | El contenedor de la muestra (caja con fondo de tablero) |
| `swatch` | El relleno interior que enseña el color actual          |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

El panel emergente se portaliza a `document.body`, así que sus estilos llevan espacio de nombres (`.ran-color-picker-*`) y viajan con el panel en lugar de vivir en el host.

### Variables CSS

La muestra lee estos tokens:

| Variable                                | Propósito                            |
| --------------------------------------- | ------------------------------------ |
| `--ran-colorpicker-background`          | Fondo de la muestra                  |
| `--ran-colorpicker-border`              | Borde de la muestra                  |
| `--ran-colorpicker-hover-border-color`  | Color del borde al pasar el ratón    |
| `--ran-colorpicker-border-radius`       | Radio de esquina de la muestra       |
| `--ran-colorpicker-block-border-radius` | Radio de esquina del bloque interior |
| `--ran-colorpicker-transition`          | Transición al pasar el ratón         |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## Buenas prácticas

- **Formatos de entrada**: dale a `value` cualquier cadena de color CSS: HEX, `rgb(...)` o `rgba(...)`; el selector la normaliza por dentro.
- **Leer el resultado**: escucha `change` y lee de `event.detail` el formato exacto que necesites (`hex`, `rgb`, `rgba`, `alpha`).
- **Transparencia**: usa una entrada `rgba(...)` o el deslizador de transparencia cuando la necesites; el `value` que se lee pasa a ser una cadena `rgba(...)` en cuanto la transparencia baja de 1.
- **Teclado**: la muestra y ambos deslizadores son enfocables y se manejan con el teclado; no hace falta ratón.
- **Importar**: cárgalo con `import 'ranui'` (registra todos los componentes) o con el independiente `import 'ranui/colorpicker'`.
