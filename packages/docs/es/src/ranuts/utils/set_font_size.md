# setFontSize2html

Fija el `font-size` de la raíz `<html>` en proporción al viewport, de modo que un diseño maquetado a un ancho fijo (375px, el habitual en móvil) escale con la pantalla real: la clásica técnica del «rem flexible» para maquetar en móvil con unidades `rem`.

## Uso

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // el ancho de diseño es 375px por defecto
// o, para un diseño maquetado a otro ancho:
setFontSize2html(414);
```

Llámalo una vez al arrancar. Se vuelve a ejecutar solo al redimensionar y al girar la pantalla, así que con una sola llamada basta para toda la vida de la página.

```css
/* Una caja dibujada a 200px en la maqueta de 375px de ancho */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### Parámetros

| Parámetro     | Descripción                                | Tipo     | Por defecto |
| ------------- | ------------------------------------------ | -------- | ----------- |
| `designWidth` | El ancho, en px, al que se hizo la maqueta | `number` | `375`       |

#### Devuelve

Sin valor de retorno (`void`). Como efecto, fija `documentElement.style.fontSize` e instala sus propios escuchadores de `resize` y `orientationchange`.

## Notas

1. **El iPad recibe otra base automáticamente.** Cuando `currentDevice()` detecta un iPad, el ancho de diseño y la proporción pasan a `768` / `1024:768` en lugar de usar el `designWidth` que le pasaste. La función da por hecho una maqueta de móvil y corrige la única excepción frecuente.
2. **No hay forma de desmontarlo.** A diferencia de casi todas las funciones de esta librería que instalan escuchadores, `setFontSize2html` no devuelve nada para cancelarlos. Está pensada para llamarse una vez durante toda la vida de la página, no dentro de un componente que se monta y se desmonta.
3. Necesita `document` y `window`; protege la llamada si el código puede ejecutarse durante el renderizado en servidor.
4. Se usa junto a un paso de compilación de CSS (postcss-pxtorem o similar) que convierta a `rem` los valores en `px` de la maqueta con la misma base. `setFontSize2html` solo fija el tamaño de fuente de la raíz; no convierte tu hoja de estilos.
