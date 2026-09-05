---
description: 'Una superficie experimental de rasca y gana donde arrastrar sobre un canvas de cubierta revela el contenido de debajo, mediante la API de Pointer Events.'
---

# Scratch

Superficie experimental de rasca y gana que dibuja, dentro de su shadow DOM, un `<canvas>` de cubierta a tamaño completo sobre una capa de revelado. Arrastrar sobre el canvas borra la cubierta con composición `destination-out` a lo largo del camino real que traza tu puntero, y rascar suficiente área revela lo que hay debajo. El host es `display: block`, así que dale un ancho y un alto explícitos.

> **Úsalo cuando** necesites una superficie experimental de rasca y gana en la que arrastrar borre un canvas de cubierta y revele cualquier contenido debajo. Funciona igual con ratón, dedo y lápiz gracias a la API de Pointer Events.

> ⚠️ **Experimental**: este componente está en construcción. Trátalo como una interacción divertida, no como un widget de producción endurecido.

## Inicio rápido

### Uso básico

Lo que pongas dentro de `<r-scratch>` es el contenido revelado (un importe, una imagen, un `<r-icon>`, varios elementos), proyectado por el slot por defecto a la capa que hay bajo la cubierta, exactamente igual que la proyección de contenido en cualquier otro componente de ranui.

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">¡Has ganado 50 monedas!</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">¡Has ganado 50 monedas!</r-scratch>
```

## Referencia de la API

### Propiedades

| Propiedad  | Tipo      | Por defecto | Descripción                                                                                          |
| ---------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false`     | Desactiva el rascado (`pointer-events: none` en el canvas y, además, una guarda en los manejadores). |
| `sheet`    | `string`  | `''`        | CSS inyectado en el shadow DOM del componente.                                                       |

### Estado deshabilitado `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">¡Has ganado 50 monedas!</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">¡Has ganado 50 monedas!</r-scratch>
```

### Estilos externos `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## Interacción

El componente **no** despacha ningún evento personalizado: no hay nada a lo que enlazar un listener. En su lugar, el rascado lo gobiernan por completo unos listeners internos de [Pointer Events](https://developer.mozilla.org/es/docs/Web/API/Pointer_events) registrados en el canvas, así que ratón, dedo y lápiz comparten el mismo camino de código:

- `pointerdown`: arma el rascado y borra un pequeño toque justo donde ha caído el puntero (así incluso un toque sin arrastre revela algo).
- `pointermove`: mientras está armado, traza una **línea conectada** (no toques sueltos) del punto anterior al actual con `globalCompositeOperation = 'destination-out'`, de modo que un arrastre rápido revela un rastro continuo en vez de punteado, y acumula el área rascada sobre la marcha.
- `pointerup` / `pointercancel`: desarma el rascado; en cuanto el área acumulada supera el **35% del área en píxeles del canvas**, toda la cubierta se limpia con `clearRect` y la capa de debajo queda a la vista (un umbral deliberadamente generoso de «rasca un poco y se termina solo», la experiencia habitual de un rasca y gana, en vez de exigir borrar la cubierta entera a mano).

Las coordenadas del puntero se mapean a través de la resolución real del búfer de dibujo del canvas (véase abajo), así que el rascado sigue correctamente a tu dedo o cursor sea cual sea el tamaño CSS del elemento o la densidad de píxeles de la pantalla. Todos los manejadores no hacen nada mientras `disabled` esté puesto, y `touch-action: none` en el canvas impide que un arrastre táctil desplace además la página.

Unos cuantos casos límite específicos de cada dispositivo se tratan explícitamente, en vez de dejarlos a lo que la «unificación» de ratón, dedo y lápiz haga por defecto:

- **Ratón**: solo el botón principal (izquierdo) inicia un rascado; un arrastre con el botón derecho o el central, no.
- **Multitáctil**: el primer dedo que baja gobierna el trazo; un segundo dedo que toca a mitad del rascado se ignora hasta que el primero se levanta, en vez de que ambos escriban a la vez en el mismo estado de dibujo.
- **Gestos interrumpidos**: si el sistema recupera la captura del puntero a media pasada sin llegar a disparar `pointerup` (visto en algunos WebView de Android cuando un gesto de retroceso del sistema interrumpe el rascado), un listener de `lostpointercapture` reinicia igualmente el estado interno; de otro modo ese estado seguiría armado y el siguiente movimiento de puntero, sin relación alguna, continuaría dibujando en silencio.

### Resolución del canvas

La resolución interna del canvas se sincroniza con su tamaño CSS realmente renderizado × `devicePixelRatio` (al conectarse y de nuevo en cada `resize` de la ventana), en vez de quedarse en el 300×150 fijo del navegador. Así la cubierta se ve nítida en pantallas HiDPI y el mapeo de coordenadas puntero-canvas se mantiene exacto a cualquier tamaño; un cambio de tamaño reinicia el rascado en curso (el búfer se limpia necesariamente al cambiar sus dimensiones).

## Slots

| Slot          | Descripción                                                    |
| ------------- | -------------------------------------------------------------- |
| (por defecto) | El contenido revelado, proyectado en la capa bajo la cubierta. |

## Estilos

Este componente **no expone ningún `::part()`**, pero los colores de sus dos capas son variables CSS gobernadas por tokens de tema. Su shadow DOM son tres capas fijas:

| Clase                        | Papel                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | Contenedor relativo a tamaño completo (`width: 100%; height: 100%`)                                                                                           |
| `.ran-scratch-ticket-award`  | La capa de revelado, `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`; contiene el slot por defecto        |
| `.ran-scratch-ticket-canvas` | El canvas de cubierta, `z-index: 2`; relleno con `--ran-scratch-cover-background` (por defecto `var(--ran-color-text-secondary, #6b6b6b)`), puesto en el host |

Ambos colores pasan por tokens de tema con un valor de reserva literal, así que se adaptan solos al modo claro u oscuro y se pueden sobrescribir con `--ran-scratch-award-background` / `--ran-scratch-cover-background`. Dimensiona el host con `width` y `height` normales.

## Buenas prácticas

- **Dimensiona siempre el host**: es `display: block` y no tiene tamaño propio; dale un `width` y un `height` explícitos o sus capas internas al `100%` se colapsan a cero.
- **Vale cualquier contenido revelado**: texto, una imagen, un `<r-icon>`, varios elementos. Pon en el slot lo que sea el premio de verdad; no hay una API fija de icono + tamaño que sortear.
- **Funciona con ratón, dedo y lápiz**: Pointer Events unifica los tres, así que responde igual en escritorio y en móvil.
- **Trátalo como experimental**: sigue en construcción; no confíes en su comportamiento para producción.
