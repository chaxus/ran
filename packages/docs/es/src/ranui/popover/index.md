---
description: 'El Popover de ranui (<r-popover>) despliega una tarjeta flotante al pasar el cursor o al hacer clic: para tooltips, menús y contenido contextual.'
---

# Popover

Componente de popover que despliega una capa flotante en forma de burbuja cuando se pasa el cursor por el disparador o se hace clic en él.

> **Úsalo cuando** necesites un panel flotante que se abra al pasar el cursor por un disparador o al hacer clic en él. `<r-popover>` posiciona y portaliza su panel `<r-content>` y te deja la accesibilidad ya conectada.

## Inicio rápido

### Uso básico

El disparador va en el slot por defecto; el contenido flotante se envuelve en un elemento `<r-content>` anidado.

<ran-demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>este es el contenido</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>este es el contenido</div>
  </r-content>
</r-popover>
```

## Referencia de la API

### Propiedades

| Propiedad             | Tipo     | Por defecto | Descripción                                                                                                                                             |
| --------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`     | Posición del panel respecto al disparador: `top`, `bottom`, `left`, `right`, cada uno con el sufijo opcional `-start` (por defecto), `-center` o `-end` |
| `trigger`             | `string` | `'hover'`   | Cómo se abre el panel: `hover` o `click` (el manejador de `click` siempre se enlaza)                                                                    |
| `getPopupContainerId` | `string` | `''`        | `id` del elemento dentro del cual posicionar el panel (se lee al abrir; no se refleja)                                                                  |
| `sheet`               | `string` | `''`        | CSS inyectado en el shadow DOM del componente                                                                                                           |

### Modo de apertura `trigger`

<ran-demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### Posición `placement`

<ran-demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### Alineación `placement="<lado>-<alineación>"`

Un lado a secas alinea el borde inicial del panel con el del disparador. Añade `-center` o `-end` cuando deba quedar centrado sobre el disparador, o a ras de su borde final: eso es lo que quiere un menú anclado al extremo derecho de una barra superior, que así se abre hacia dentro en vez de salirse y ser empujado de vuelta por el desplazamiento. El sufijo sobrevive a un volteo automático: `bottom-end` se convierte en `top-end`, no en `top`.

<ran-demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — igual que bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## Slots

| Componente    | Slot          | Descripción                                                                                         |
| ------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `<r-popover>` | (por defecto) | El elemento disparador más el envoltorio `<r-content>`                                              |
| `<r-content>` | (por defecto) | El contenido del panel flotante; estos hijos se portalizan a `document.body` y se muestran al abrir |

Ambos componentes exponen un único slot por defecto sin nombre; no hay slots con nombre.

## Estado de apertura `open`

`open` es el estado del panel, reflejado como atributo igual que en `<details open>` y `<dialog open>`. Nada lo deduce del `display` del panel, que va por detrás del estado lo que dure la animación de salida, así que el atributo, `aria-expanded` y lo que se ve en pantalla no pueden contradecirse.

```html
<r-popover id="pop" trigger="click">
  <r-button>Disparador</r-button>
  <r-content><div>Contenido</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // o pop.show()
  pop.open = false; // o pop.hide()
  pop.toggle();
</script>
```

`show()`, `hide()` y `toggle()` son envoltorios finos sobre él. `closePopover()` se mantiene como alias de `hide()`.

## Eventos

`<r-popover>` dispara cuatro eventos alrededor de las transiciones del panel; ninguno lleva `detail`:

| Evento       | Cuándo                                                    |
| ------------ | --------------------------------------------------------- |
| `show`       | El panel está a punto de aparecer.                        |
| `after-show` | Ya apareció y terminó la animación de entrada, si la hay. |
| `hide`       | El panel está a punto de cerrarse.                        |
| `after-hide` | Ya se cerró y terminó la animación de salida, si la hay.  |

Lo que se espera es la animación de la propia hoja de estilos, no una duración copiada al script, así que bajo `prefers-reduced-motion` (donde no hay animación que reproducir) `after-hide` sigue a `hide` de inmediato en vez de tras un retardo fijo.

Por lo demás, lo gobierna la interacción estándar del DOM:

- **Abrir**: `mouseenter` (cuando `trigger` incluye `hover`), `click`, o pulsar `Enter` / `Espacio` con el foco puesto.
- **Cerrar**: `mouseleave` (modo hover), pulsar `Escape`, o un `click` en otra parte del documento.

Por dentro, el elemento acompañante `<r-content>` vigila su propio subárbol con un `MutationObserver` y emite un `CustomEvent` `change` (`detail: { type, value: { content, mutation } }`) que el popover consume para mantener el panel sincronizado. Es un detalle de implementación, no una API pública.

La accesibilidad se conecta sola: el host recibe `tabindex="0"`, `aria-haspopup="dialog"` y un `aria-expanded` que alterna entre `"false"` y `"true"` conforme el panel se abre y se cierra.

## Buenas prácticas

- **Elemento disparador**: pon un control enfocable (por ejemplo `<r-button>`) como disparador, para que abrir y cerrar con el teclado funcione.
- **Envoltorio del contenido**: envuelve siempre el contenido del panel en `<r-content>`: los hijos sueltos que no estén dentro de `<r-content>` no se muestran como panel flotante.
- **Tamaño en línea**: el host es `display: block`; añade `style="display: inline-block;"` (o colócalo en un contexto en línea) para que se encoja hasta el disparador.
- **Posición**: `placement` es una preferencia, no una garantía: cuando el disparador está cerca del borde de la ventana y al lado preferido le falta sitio, el panel voltea solo al lado opuesto y se desplaza por el eje transversal para no salirse de la pantalla. Este volteo automático solo se aplica al posicionamiento por defecto a nivel de `body`.
- **Contenedor acotado**: usa `getPopupContainerId` para anclar el panel dentro de un contenedor concreto de desplazamiento o posicionamiento cuando el posicionamiento por defecto a nivel de `body` no sirva. En ese modo no se aplican volteo ni desplazamiento, así que elige un `placement` que quepa en el contenedor. El sufijo de alineación sí se aplica ahí, exactamente igual que en el portal a `body`.
