---
description: 'Una primitiva de panel flotante de bajo nivel que aporta el posicionamiento y el z-index sobre los que se construyen r-popover y r-select.'
---

# Dropdown

Una primitiva de panel flotante de bajo nivel: una superficie redondeada y elevada con una flecha direccional opcional. Lleva el z-index de las capas superpuestas y es la pieza que `r-popover` y `r-select` posicionan y portalizan a `<body>`.

> **Úsalo cuando** necesites un panel flotante de bajo nivel para construir capas como popovers o menús de selección: `<r-dropdown>` ya lleva el z-index y la flecha, así que no tienes que fabricar el posicionamiento a mano.

## Inicio rápido

### Uso básico

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Contenido del panel flotante</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">Contenido del panel flotante</div>
</r-dropdown>
```

## Referencia de la API

### Propiedades

| Propiedad | Tipo     | Por defecto | Descripción                                                                        |
| --------- | -------- | ----------- | ---------------------------------------------------------------------------------- |
| `arrow`   | `string` | `''`        | Lado de la flecha: `top`, `bottom`, `left`, `right`. Omítelo para no tener flecha. |
| `transit` | `string` | `''`        | Clase de animación reflejada en el panel mientras el atributo esté puesto          |
| `sheet`   | `string` | `''`        | CSS inyectado en el shadow DOM del componente                                      |

### Dirección de la flecha `arrow`

Dibuja una flecha que apunta desde uno de los lados del panel. Omite el atributo para no tener flecha.

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### Animación de entrada `transit`

Un nombre de clase CSS reflejado en el panel para reproducir una animación de entrada o de salida. El componente trae estas: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

La clase vive exactamente lo que vive el atributo: quien lo pone decide cuándo termina la animación, y quitar el atributo quita la clase. (Antes expiraba sola tras unos 300 ms, una duración escrita en el JS además de en la hoja de estilos. Ese temporizador quitaba lo que dijera `transit` en el momento en que se disparaba, no la clase que él mismo había añadido, así que invertir la dirección dentro de esa ventana dejaba la primera clase pegada al panel para siempre, con `-in` y `-out` aplicados a la vez.)

`getAnimationTarget()` devuelve el elemento sobre el que la animación corre de verdad. Está dentro del shadow root, así que `getAnimations()` sobre el host no informa de nada y `{ subtree: true }` no cruza el límite. El código que espera a que termine la transición del panel debe llamar a `getAnimationTarget()` en lugar de hurgar en el árbol del shadow buscando un nombre de clase.

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Entra animado al conectarse</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">Entra animado al conectarse</div>
</r-dropdown>
```

### Estilos externos `sheet`

CSS inyectado en el shadow DOM del panel. Sigue la misma convención `sheet` que usan todos los demás componentes de ranui.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">Panel con estilo propio</div>
</r-dropdown>
```

## Eventos

`r-dropdown` es una superficie pasiva y no despacha eventos personalizados. Quien lo consume (por ejemplo `r-popover` o `r-select`) es quien lo posiciona, lo muestra y lo oculta.

## Slots

| Slot          | Descripción                               |
| ------------- | ----------------------------------------- |
| (por defecto) | El contenido del panel, dibujado tal cual |

## Partes CSS

| Parte      | Descripción                                            |
| ---------- | ------------------------------------------------------ |
| `dropdown` | La superficie del panel, para darle estilo desde fuera |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

Cualquier propiedad visual se puede sobrescribir con los tokens `--ran-dropdown-*`, por ejemplo `--ran-dropdown-background`, `--ran-dropdown-border-radius`, `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width` y `--ran-dropdown-host-z-index`. La flecha es un SVG en línea escalado por su propio `viewBox`, así que `--ran-dropdown-arrow-width`/`-height` cambian el tamaño del triángulo de verdad, no el de una caja vacía a su alrededor:

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## Buenas prácticas

- **Primitiva de bajo nivel**: usa `r-dropdown` directamente solo cuando necesites un panel flotante propio; para los casos habituales prefiere `r-popover` o `r-select`.
- **Dale tamaño al host**: el panel toma por defecto `width` y `height: 100%` del host, así que dale al host un tamaño y una posición explícitos, y luego portalízalo.
- **Apilado**: el host lleva `--ran-z-dropdown` (`1100`), de modo que se apila por encima de los diálogos; sobrescríbelo con `--ran-dropdown-host-z-index` si hace falta.
- **La flecha se centra en sí misma por defecto**: `r-dropdown` no sigue a ningún elemento «disparador» externo: solo cuenta con las dimensiones de su propio panel. Sin nadie que lo posicione, `arrow="top"`/`"bottom"` se centra respecto al ancho del propio panel; ese es el valor correcto para usar `r-dropdown` a secas (como en las demos de arriba). `r-popover` se apoya sobre `r-dropdown` precisamente para añadir el seguimiento del disparador: mide el elemento disparador real y devuelve un desplazamiento en píxeles mediante `--ran-dropdown-arrow-anchor-offset`, empujando la flecha para que apunte al centro del disparador incluso cuando el panel es más ancho y se alinea por un borde en vez de centrarse en él. Quien construya su propio panel con seguimiento de disparador sobre `r-dropdown` puede definir esa variable directamente en lugar de rehacer la lógica de posicionamiento de `r-popover`.
- **Importar**: cárgalo con `import 'ranui'` (registra todos los componentes) o con el independiente `import 'ranui/dropdown'`.
