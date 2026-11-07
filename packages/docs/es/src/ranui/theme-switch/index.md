---
description: 'Un select de temas de color (system / light / dark) conectado a la API de tema de ranui.'
---

# ThemeSwitch

Un **select** compacto de temas de color (**system / light / dark**) conectado a la
[API de tema](/es/ranui/theme/) de ranui. Elegir una opción llama a `setTheme()`, persiste en
`ran-theme` y mantiene sincronizadas todas las instancias. El estilo / vidrio líquido es otro eje:
usa `<r-surface-switch>`.

> **Usar cuando** necesites un control listo de tema de color.

## Inicio rápido

### Uso básico

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

Llama a `initTheme()` una vez al cargar la página.

```js
import { initTheme } from 'ranui';
initTheme();
```

## Referencia de API

### Propiedades

| Propiedad | Tipo                            | Predeterminado | Descripción                                              |
| --------- | ------------------------------- | -------------- | -------------------------------------------------------- |
| `value`   | `'system' \| 'light' \| 'dark'` | `'system'`     | Tema actual de `getTheme()`. Asignarlo aplica y persiste. |
| `sheet`   | `string`                        | `''`           | CSS inyectado en el Shadow DOM.                          |

### Atributos de localización

| Atributo       | Predeterminado | Descripción                 |
| -------------- | -------------- | --------------------------- |
| `label`        | `'Theme'`      | `aria-label` del select.    |
| `label-system` | `'System'`     | Texto de la opción system.  |
| `label-light`  | `'Light'`      | Texto de la opción light.   |
| `label-dark`   | `'Dark'`       | Texto de la opción dark.    |

## Eventos

| Evento   | Detail                                     | Descripción                                      |
| -------- | ------------------------------------------ | ------------------------------------------------ |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Al elegir un tema. Burbujea y cruza Shadow DOM. |

## Partes CSS

| Parte                       | Descripción           |
| --------------------------- | --------------------- |
| `select`                    | El `r-select` interno.|
| `option`                    | Cada `r-option`.      |
| `system` / `light` / `dark` | Las opciones.         |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
