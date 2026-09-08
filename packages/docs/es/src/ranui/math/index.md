---
description: 'Renderiza fórmulas matemáticas en LaTeX como MathML nativo con Temml, sin canvas, sin SVG y sin el runtime de KaTeX.'
---

# Math

Renderiza fórmulas matemáticas LaTeX de alta calidad en páginas HTML mediante Temml, compiladas directamente a MathML nativo.

> **Úsalo cuando** necesites renderizar una fórmula LaTeX como matemática de bloque en una página HTML. `<r-math>` compone la expresión de su atributo `latex` con [Temml](https://temml.org/), que compila LaTeX a MathML y deja que el propio navegador lo maquete (sin canvas ni SVG, sin runtime de KaTeX).

## Inicio rápido

### Uso básico

<ran-demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</ran-demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## Referencia de la API

### Propiedades

| Propiedad  | Tipo      | Por defecto | Descripción                                                                                   |
| ---------- | --------- | ----------- | --------------------------------------------------------------------------------------------- |
| `latex`    | `string`  | `''`        | La fórmula LaTeX a renderizar. Se pasa por este atributo, no como texto en el slot.           |
| `display`  | `string`  | `'block'`   | `block` (matemática de bloque) o `inline` (matemática en línea).                              |
| `font`     | `string`  | `''`        | Ponlo en `system` para omitir la tipografía Latin Modern Math incluida y usar la del sistema. |
| `macros`   | `string`  | `''`        | Un objeto JSON con macros de Temml. Un JSON inválido se ignora en silencio.                   |
| `wrap`     | `string`  | `''`        | Salto de línea flexible de Temml: `none`, `tex` o `=`.                                        |
| `copy`     | `boolean` | `false`     | Muestra un botón de copiar. `copy` a secas copia el LaTeX; `copy="mathml"` copia el MathML.   |
| `download` | `boolean` | `false`     | Muestra un botón o menú para descargar la fuente (`.tex`) o el MathML (`.mml`).               |
| `sheet`    | `string`  | `''`        | CSS inyectado en el shadow DOM del componente.                                                |

> 💡 **Nota**: el getter de la propiedad `latex` decodifica su valor con `decodeURIComponent`, así que las fórmulas codificadas en URI se decodifican antes de renderizar. Pasar la fórmula como texto en el slot no tiene efecto; solo se renderiza el atributo `latex`.

### Fórmula `latex`

<ran-demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</ran-demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### Estilos externos `sheet`

<ran-demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</ran-demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## Eventos

| Evento     | detail                             | Se dispara cuando                                                |
| ---------- | ---------------------------------- | ---------------------------------------------------------------- |
| `render`   | `{ ok: true }`                     | La fórmula se renderizó correctamente.                           |
| `error`    | `{ message: string }`              | Temml no pudo analizar la fórmula (LaTeX inválido, por ejemplo). |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | El botón copió la fuente o el MathML al portapapeles.            |
| `download` | `{ format: 'source' \| 'mathml' }` | El botón de descarga guardó un archivo `.tex` o `.mml`.          |

## Estilos

`<r-math>` expone **16 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Partes: `button` · `error` · `math` · `menu` · `render` · `toolbar`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#math); cuál usar lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Pasa la fórmula por `latex`**: define la fórmula en el atributo `latex`; el texto del slot no se renderiza.
- **Escapa las barras invertidas en JavaScript**: al asignar `latex` desde una cadena JS, recuerda que `\` debe escaparse (por ejemplo `'\\frac{1}{2}'`).
- **Gestiona los fallos de análisis**: escucha `error` (o mira el cuadro `::part(error)` renderizado) en lugar de dar por hecho que toda fórmula es LaTeX válido.
- **Maquetación propia con `sheet`**: usa el atributo `sheet` para sobrescribir la disposición interna de `.ran-math` cuando haga falta.
