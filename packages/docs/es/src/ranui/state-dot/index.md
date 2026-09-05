---
description: 'El StateDot de ranui (<r-state-dot>) es un indicador de ciclo de vida de 8px (idle, running, success, warning, error) dibujado como un halo y un núcleo en un solo elemento.'
---

# StateDot

Un indicador de ciclo de vida de 8px: un halo y un núcleo en un mismo elemento, ambos
`currentColor`, de modo que un estado es una regla de color y no dos tokens.

> **Úsalo cuando** una fila necesite mostrar en qué punto está un trabajo (en cola, en curso,
> terminado, fallido) sin gastar una línea entera en ello. Es el punto que usan tanto
> `<r-tool-card>` como la marca de compactación.

## Inicio rápido

### Uso básico

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` late; el resto están quietos. Un valor desconocido se dibuja como `idle` en lugar de
desaparecer, así que un estado que tu productor añadió y la página aún no conoce sigue
ocupando su sitio en la fila.

### Junto a una etiqueta

El punto solo codifica el estado mediante el color; no explica qué significa ese color. Nunca
dejes que el color sea lo único que distingue dos filas. Consulta la
[guía de diseño](/es/src/ranui/design-guides/#accessibility).

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>Ejecutando pruebas</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>2 pruebas fallidas</span>
  </div>
</Demo>

## Referencia de la API

### Propiedades

| Propiedad | Atributo | Tipo                                                       | Por defecto | Descripción                                                    |
| --------- | -------- | ---------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `state`   | `state`  | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'`    | Qué paso del ciclo mostrar. Los valores desconocidos → `idle`. |
| `label`   | `label`  | `string`                                                   | `''`        | Nombre accesible. Véase más abajo.                             |
| `sheet`   | `sheet`  | `string`                                                   | `''`        | CSS inyectado en el shadow root.                               |

### Accesibilidad

**El punto es `aria-hidden` hasta que le das un `label`.** Un punto junto a una fila que ya
expresa su resultado en texto es ruido para un lector de pantalla: anunciar «en curso» dos
veces no ayuda a nadie. Define `label` solo cuando el punto sea el _único_ portador del estado:

```html
<!-- El texto ya lo dice: deja el punto en silencio -->
<r-state-dot state="error"></r-state-dot> <span>La compilación falló</span>

<!-- El punto está solo en la celda: dale nombre -->
<r-state-dot state="error" label="La compilación falló"></r-state-dot>
```

### Partes

| Parte | Elemento       |
| ----- | -------------- |
| `dot` | El punto en sí |

### Estilos

Cada estado es **un** color: el halo es ese color al 16% y el núcleo es una reducción del 60%
del mismo, ambos pintados desde `currentColor`. Así, un estado es un token, no dos:

| Token                           | Por defecto                        |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running` hace latir el núcleo en lugar de girarlo (a 8px, un icono que gira es demasiado
pequeño para leerse como rotación), y el latido se detiene bajo `prefers-reduced-motion`.
