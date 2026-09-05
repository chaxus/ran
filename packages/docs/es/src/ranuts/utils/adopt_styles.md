# adoptStyles / adoptSheetText

Inyecta CSS en un Shadow DOM, con preferencia por las **Constructable Stylesheets**: un mismo CSS se analiza una sola vez y luego se comparte _por referencia_ entre todas las instancias del componente, de modo que mil instancias siguen teniendo un único resultado analizado. Donde no estén disponibles, ambas recurren a inyectar una etiqueta `<style>`.

Las dos son seguras en el servidor (retornan de inmediato cuando no hay `document`) e idempotentes.

## Uso

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

Para los estilos **estáticos** de un componente. La vía alternativa evita duplicados por **raíz**: un shadow root guarda exactamente una etiqueta `<style>` marcada, y manda quien escriba primero. Los estilos estáticos de un componente deben existir una vez por raíz, así que una segunda llamada significa que quien llamó se equivocó.

#### Parámetros

| Parámetro    | Descripción                                          | Tipo         | Por defecto            |
| ------------ | ---------------------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | El shadow root de destino                            | `ShadowRoot` | Obligatorio            |
| `cssText`    | El texto del estilo                                  | `string`     | Obligatorio            |
| `marker`     | Atributo que marca la etiqueta `<style>` alternativa | `string`     | `'data-adopted-style'` |

#### Devuelve

Sin valor de retorno (`void`)

### adoptSheetText

Para los estilos **dinámicos** que llegan en tiempo de ejecución (la propiedad `sheet` de un componente, por ejemplo). Lo único que cambia respecto a `adoptStyles` es sobre qué evita duplicados la vía alternativa: aquí es el **cssText**, así que una misma raíz puede apilar varias hojas dinámicas distintas mientras que una idéntica se inyecta una sola vez.

#### Parámetros

| Parámetro    | Descripción                                          | Tipo         | Por defecto            |
| ------------ | ---------------------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | El shadow root de destino                            | `ShadowRoot` | Obligatorio            |
| `cssText`    | El texto del estilo                                  | `string`     | Obligatorio            |
| `marker`     | Atributo que marca la etiqueta `<style>` alternativa | `string`     | `'data-adopted-sheet'` |

#### Devuelve

Sin valor de retorno (`void`)

## Constantes

| Nombre                 | Valor                  | Significado                                                      |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | Marca por defecto de la etiqueta alternativa de `adoptStyles`    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | Marca por defecto de la etiqueta alternativa de `adoptSheetText` |

El parámetro `marker` existe para que una librería pueda firmar los estilos que inyecta y volver a encontrarlos después. ranui, por ejemplo, pasa `data-ranui` y `data-ranui-sheet`.
