---
description: 'Un control segmentado de tres estados (sistema/claro/oscuro) conectado a la API de temas de ranui y sincronizado entre pestañas.'
---

# ThemeSwitch

Un control segmentado de tres estados (**sistema / claro / oscuro**) conectado a la
[API de temas](/es/src/ranui/theme/) de ranui. Al pulsar un segmento se llama a `setTheme()`, se
guarda la elección bajo la clave de localStorage `ran-theme` y se mantienen sincronizadas todas
las instancias de la página (y de otras pestañas).

> **Úsalo cuando** necesites un control segmentado sistema/claro/oscuro ya conectado a la API de temas de ranui. `<r-theme-switch>` se encarga de la persistencia, del seguimiento del sistema y de la sincronización entre pestañas, así que no tienes que fabricar un interruptor a mano.

## Inicio rápido

### Uso básico

<Demo>
  <r-theme-switch></r-theme-switch>
</Demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // o la entrada independiente:
import 'ranui/theme-switch';
```

> 💡 **En este sitio de documentación** el tema lo gobierna el interruptor global de la cabecera,
> que reescribe `data-ran-theme` por su cuenta, así que el sitio puede reiniciar la demo de
> arriba. En tu aplicación, `<r-theme-switch>` es la fuente de verdad.

Llama a `initTheme()` una vez al cargar la página para que la elección guardada se restaure antes
de que se dibuje el control:

```js
import { initTheme } from 'ranui';
initTheme();
```

## Referencia de la API

### Propiedades

| Propiedad | Tipo                            | Por defecto | Descripción                                                                                   |
| --------- | ------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `value`   | `'system' \| 'light' \| 'dark'` | `'system'`  | Selección actual, leída de la API de temas (`getTheme()`). Asignarla aplica y guarda el tema. |
| `sheet`   | `string`                        | `''`        | CSS inyectado en el shadow DOM del componente.                                                |

### Atributos de localización

Los tres botones son solo icono, así que cada uno lleva un `aria-label`. Sobrescríbelos para traducirlos:

| Atributo       | Por defecto      | Descripción                        |
| -------------- | ---------------- | ---------------------------------- |
| `label`        | `'Theme'`        | `aria-label` del grupo de control. |
| `label-system` | `'System theme'` | `aria-label` del botón de sistema. |
| `label-light`  | `'Light theme'`  | `aria-label` del botón claro.      |
| `label-dark`   | `'Dark theme'`   | `aria-label` del botón oscuro.     |

```html
<r-theme-switch
  label="Tema"
  label-system="Tema del sistema"
  label-light="Tema claro"
  label-dark="Tema oscuro"
></r-theme-switch>
```

## Eventos

| Evento   | Detalle                                    | Descripción                                                                 |
| -------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Se dispara cuando el usuario elige un tema. Burbujea y cruza el shadow DOM. |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## Comportamiento

- **Persistencia**: las selecciones pasan por `setTheme()`, así que se guardan en localStorage
  (`ran-theme`) y `initTheme()` las restaura en la siguiente visita.
- **Sincronización entre instancias**: pon un control en la cabecera y otro en el pie; elegir un
  tema en cualquiera actualiza ambos.
- **Sincronización entre pestañas**: un tema cambiado en otra pestaña actualiza este control
  mediante el evento `storage`.
- **Cromo del navegador**: forzar claro u oscuro actualiza `<meta name="theme-color">` al fondo de
  página resuelto, para que el cromo del navegador o de la PWA combine; elegir `system` restaura el
  contenido original de cada meta (que puede llevar condición de medios).

## Partes CSS

| Parte                       | Descripción                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- |
| `switch`                    | La píldora segmentada exterior.                                                   |
| `button`                    | Cada botón de elección (cada uno expone además su nombre de elección como parte). |
| `system` / `light` / `dark` | Los botones de elección individuales.                                             |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

Se pueden sobrescribir estas variables CSS: `--ran-theme-switch-display`,
`--ran-theme-switch-gap`, `--ran-theme-switch-padding`, `--ran-theme-switch-border-color`,
`--ran-theme-switch-radius`, `--ran-theme-switch-background`, `--ran-theme-switch-button-size`,
`--ran-theme-switch-icon-size`, `--ran-theme-switch-button-color`, `--ran-theme-switch-button-hover-color`,
`--ran-theme-switch-button-active-background`, `--ran-theme-switch-button-active-color`,
`--ran-theme-switch-button-focus-outline`.

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## Buenas prácticas

- **Una sola fuente de verdad**: usa `<r-theme-switch>` en lugar de fabricar un interruptor a mano;
  ya se ocupa de la persistencia, del seguimiento del sistema, de la sincronización entre
  instancias y de los metas `theme-color`.
- **Restaura pronto**: llama a `initTheme()` lo antes posible (idealmente en línea, antes del primer
  pintado) para evitar un destello de claro a oscuro.
- **Traduce**: los botones son solo icono; define `label` y `label-*` para interfaces que no estén
  en inglés.
