---
description: 'Uma superfície de seção de página com um título acessível e um subtítulo opcionais acima de um corpo em slot.'
---

# Section

Superfície de seção de página com um título e um subtítulo opcionais acima de um corpo em slot.

> **Use quando** precisar rotular uma região importante da página com um título acessível de nível 2 e, se quiser, um subtítulo acima do conteúdo. O `<r-section>` fornece a linha de cabeçalho e a superfície do corpo.

## Início rápido

### Uso básico

<ran-demo align="stretch">
  <r-section heading="Título da seção" subtitle="Uma linha curta descrevendo esta seção.">
    <p style="margin: 0;">O conteúdo do corpo vai no slot padrão.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Título da seção" subtitle="Uma linha curta descrevendo esta seção.">
  <p>O conteúdo do corpo vai no slot padrão.</p>
</r-section>
```

## Referência da API

### Propriedades

| Propriedade | Tipo     | Padrão | Descrição                                             |
| ----------- | -------- | ------ | ----------------------------------------------------- |
| `heading`   | `string` | `''`   | Título da seção, renderizado como título ARIA nível 2 |
| `subtitle`  | `string` | `''`   | Linha de apoio abaixo do título                       |
| `sheet`     | `string` | `''`   | CSS injetado no shadow DOM da seção                   |

A linha de cabeçalho (título + subtítulo) fica totalmente oculta quando `heading` e `subtitle` estão vazios.

### Título `heading`

O título da seção, renderizado como título ARIA de nível 2 (`role="heading"`, `aria-level="2"`). Fica oculto quando vazio.

<ran-demo align="stretch">
  <r-section heading="Apenas um título">
    <p style="margin: 0;">Conteúdo do corpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Apenas um título">
  <p>Conteúdo do corpo.</p>
</r-section>
```

### Subtítulo `subtitle`

Uma linha de apoio abaixo do título. Fica oculta quando vazia.

<ran-demo align="stretch">
  <r-section heading="Título" subtitle="Texto de subtítulo de apoio.">
    <p style="margin: 0;">Conteúdo do corpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Título" subtitle="Texto de subtítulo de apoio.">
  <p>Conteúdo do corpo.</p>
</r-section>
```

### CSS do shadow `sheet`

CSS injetado no shadow DOM da seção, seguindo a mesma convenção `sheet` de todos os outros componentes do ranui.

<ran-demo align="stretch">
  <r-section heading="Seção com tema" subtitle="Título recolorido pelo sheet." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">Conteúdo do corpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Seção com tema" sheet=".ran-section-heading { color: #006bff; }">
  <p>Conteúdo do corpo.</p>
</r-section>
```

## Slots

| Slot       | Descrição                                        |
| ---------- | ------------------------------------------------ |
| _(padrão)_ | Conteúdo do corpo, abaixo da linha de cabeçalho. |

## Partes CSS

| Parte      | Descrição                                    |
| ---------- | -------------------------------------------- |
| `header`   | A linha que envolve título e subtítulo       |
| `heading`  | O elemento de título ARIA de nível 2         |
| `subtitle` | A linha de subtítulo de apoio                |
| `body`     | O invólucro do corpo em torno do slot padrão |

Variáveis CSS expostas: `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## Boas práticas

- **Títulos de seção**: defina `heading` para rotular cada região importante da página.
- **Contexto**: use `subtitle` para uma linha curta de apoio; omita ambos para obter uma superfície lisa, sem linha de cabeçalho.
- **Acessibilidade**: o título é exposto como título ARIA de nível 2, então participa do esquema do documento; mantenha-o significativo.
- **Temas**: prefira as variáveis CSS `--ran-section-*` ou os seletores `::part()` ao atributo `sheet` quando o estilo for reutilizável.
