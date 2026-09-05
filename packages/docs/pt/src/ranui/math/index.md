---
description: 'Renderiza fórmulas matemáticas em LaTeX como MathML nativo usando o Temml, sem canvas, sem SVG e sem o runtime do KaTeX.'
---

# Math

Renderiza fórmulas matemáticas LaTeX de alta qualidade em páginas HTML com o Temml, compiladas direto para MathML nativo.

> **Use quando** precisar renderizar uma fórmula LaTeX como matemática de bloco numa página HTML. O `<r-math>` compõe a expressão do atributo `latex` com o [Temml](https://temml.org/), que compila LaTeX para MathML e deixa o próprio navegador diagramar (sem canvas nem SVG, sem runtime do KaTeX).

## Início rápido

### Uso básico

<Demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</Demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão    | Descrição                                                                                |
| ----------- | --------- | --------- | ---------------------------------------------------------------------------------------- |
| `latex`     | `string`  | `''`      | A fórmula LaTeX a renderizar. Vem por este atributo, não pelo texto do slot.             |
| `display`   | `string`  | `'block'` | `block` (matemática de bloco) ou `inline` (matemática em linha).                         |
| `font`      | `string`  | `''`      | Use `system` para dispensar a fonte Latin Modern Math embutida e usar a do sistema.      |
| `macros`    | `string`  | `''`      | Um objeto JSON com macros do Temml. JSON inválido é ignorado silenciosamente.            |
| `wrap`      | `string`  | `''`      | Quebra de linha flexível do Temml: `none`, `tex` ou `=`.                                 |
| `copy`      | `boolean` | `false`   | Mostra um botão de copiar. `copy` sozinho copia o LaTeX; `copy="mathml"` copia o MathML. |
| `download`  | `boolean` | `false`   | Mostra um botão ou menu para baixar a fonte (`.tex`) e/ou o MathML (`.mml`).             |
| `sheet`     | `string`  | `''`      | CSS injetado no shadow DOM do componente.                                                |

> 💡 **Nota**: o getter da propriedade `latex` decodifica o valor com `decodeURIComponent`, então fórmulas codificadas em URI são decodificadas antes da renderização. Passar a fórmula como texto no slot não tem efeito; só o atributo `latex` é renderizado.

### Fórmula `latex`

<Demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</Demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### Estilos externos `sheet`

<Demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</Demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## Eventos

| Evento     | detail                             | Disparado quando                                                 |
| ---------- | ---------------------------------- | ---------------------------------------------------------------- |
| `render`   | `{ ok: true }`                     | A fórmula foi renderizada com sucesso.                           |
| `error`    | `{ message: string }`              | O Temml não conseguiu analisar a fórmula (LaTeX inválido).       |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | O botão copiou a fonte ou o MathML para a área de transferência. |
| `download` | `{ format: 'source' \| 'mathml' }` | O botão de download salvou um arquivo `.tex` ou `.mml`.          |

## Estilos

O `<r-math>` expõe **16 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Partes: `button` · `error` · `math` · `menu` · `render` · `toolbar`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#math); qual usar está no [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Passe a fórmula por `latex`**: defina a fórmula no atributo `latex`; o texto do slot não é renderizado.
- **Escape as barras invertidas em JavaScript**: ao atribuir `latex` a partir de uma string JS, lembre que `\` precisa ser escapada (por exemplo `'\\frac{1}{2}'`).
- **Trate falhas de análise**: escute `error` (ou verifique a caixa `::part(error)` renderizada) em vez de supor que toda fórmula é LaTeX válido.
- **Layout próprio com `sheet`**: use o atributo `sheet` para sobrescrever o layout interno de `.ran-math` quando precisar.
