---
description: 'Una cadena de razonamiento plegable que se despliega mientras el razonamiento llega en streaming y se pliega cuando termina, hasta que el lector decida otra cosa.'
---

# Reasoning

Una cadena de razonamiento plegable.

> **Úsalo cuando** un modelo exponga su razonamiento por separado de su respuesta y quieras
> que el lector lo vea suceder sin tenerlo en pantalla después.

El razonamiento es la única parte de una respuesta que el lector quiere ver mientras ocurre y
casi nunca quiere conservar. Por eso el elemento se despliega mientras `streaming` está puesto
y se pliega cuando se quita.

**Hasta que el lector lo toca.** En cuanto él mismo lo despliega o lo pliega, el comportamiento
automático se detiene para siempre. La misma regla de propiedad rige el desplazamiento en
[`createBottomFollower`](../../ranuts/utils/), y por el mismo motivo: una interfaz que vuelve a
decidir una y otra vez algo que el lector ya decidió es peor que una que nunca decidió nada.
Asignar `open` desde código también cuenta como tomar el control, porque el código actúa en
nombre de alguien que ya tiene una opinión.

## Inicio rápido

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.createElement('r-reasoning');

reasoning.streaming = true; // se despliega
reasoning.content += delta; // crece a la vista
reasoning.duration = 4200; // «4.2s» junto a la etiqueta
reasoning.streaming = false; // se pliega, salvo que el lector interviniera

conversation.append(reasoning);
```

`ranuts/stream` ya mantiene `reasoning-delta` separado de `text-delta`, así que una vista puede
alimentar esto directamente desde una instantánea:

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## Detalles que conviene saber

- **Las duraciones por debajo del segundo no se muestran.** Al lector le importa que fue rápido,
  no que fueron 340 ms.
- **La etiqueta late mientras hay streaming**, así que un pensamiento largo y silencioso no se
  lee como un atasco. `prefers-reduced-motion` apaga la animación sin quitar la información.
- **El slot por defecto sustituye al texto renderizado**, para quien quiera `<r-markdown>` en el
  cuerpo en lugar de texto plano.

## Referencia de la API

### Propiedades

| Propiedad   | Tipo             | Por defecto   | Descripción                                                             |
| ----------- | ---------------- | ------------- | ----------------------------------------------------------------------- |
| `content`   | `string`         | `''`          | El texto del razonamiento. Asignarlo repetidamente es la vía streaming. |
| `streaming` | `boolean`        | `false`       | Si el razonamiento sigue llegando.                                      |
| `open`      | `boolean`        | `false`       | Si el cuerpo está desplegado.                                           |
| `label`     | `string`         | `'Reasoning'` | Texto del resumen.                                                      |
| `duration`  | `number \| null` | `null`        | Milisegundos pensando. Se oculta por debajo de un segundo.              |
| `sheet`     | `string`         | `''`          | CSS inyectado en el shadow DOM del elemento.                            |

Un `duration` que no sea un número finito y no negativo se lee como `null`.

### Slots

| Slot          | Descripción                                             |
| ------------- | ------------------------------------------------------- |
| (por defecto) | Sustituye el texto renderizado por tu propio contenido. |

### Partes

`reasoning`, `summary`, `marker`, `label`, `meta`, `body`, `text`.

### Accesibilidad

El resumen es un `<button type="button">` de verdad con `aria-expanded`, así que se alcanza y se
maneja desde el teclado sin cableado adicional.

## Estilos

`<r-reasoning>` expone **4 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Partes: `body` · `row` · `text`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#reasoning); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Véase también

- [Conversation](../conversation/): monta esto como la fila de razonamiento de una transcripción
- [ranuts/stream](../../ranuts/stream/): de dónde sale `reasoning-delta`
