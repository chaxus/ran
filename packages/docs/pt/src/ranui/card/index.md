---
description: 'Um contêiner de conteúdo estruturado com zonas de cabeçalho, corpo e rodapé, apresentado como uma superfície com borda no estilo Geist para agrupar conteúdo relacionado.'
---

# Card

Um contêiner de conteúdo estruturado com zonas de cabeçalho, corpo e rodapé para agrupar conteúdo relacionado. Cartões são superfícies com borda no estilo Geist (o fundo da página mais uma borda de 1px, não um preenchimento cinza) e permanecem inertes ao passar o mouse, a menos que você opte por `hoverable`.

> **Use quando** precisar agrupar conteúdo relacionado numa superfície com borda com zonas de título, descrição, corpo e rodapé: o `<r-card>` dá esses slots mais um estado interativo opcional com `hoverable`.

## Início rápido

### Uso básico

<ran-demo>
  <r-card heading="Título do cartão" description="Subtítulo opcional" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">O conteúdo do corpo vai no slot padrão.</p>
    <a slot="footer" href="#">Ver notas</a>
  </r-card>
</ran-demo>

```html
<r-card heading="Título do cartão" description="Subtítulo opcional">
  <span slot="extra">tag</span>
  <p>O conteúdo do corpo vai no slot padrão.</p>
  <a slot="footer" href="#">Ver notas</a>
</r-card>
```

## Referência da API

### Propriedades

| Propriedade   | Tipo      | Padrão  | Descrição                                                                 |
| ------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `heading`     | `string`  | `''`    | Título do cartão, exibido no topo do cabeçalho. Fica oculto quando vazio. |
| `description` | `string`  | `''`    | Subtítulo desenhado abaixo do título. Fica oculto quando vazio.           |
| `hoverable`   | `boolean` | `false` | Cartão interativo: o mouse escurece a borda e eleva a sombra.             |
| `sheet`       | `string`  | `''`    | CSS injetado no shadow DOM do cartão.                                     |

### Título `heading`

O título do cartão, exibido no topo do cabeçalho. Fica oculto quando vazio.

<ran-demo>
  <r-card heading="Apenas um título" style="max-width: 360px;">
    <p style="margin: 0;">Conteúdo do corpo.</p>
  </r-card>
</ran-demo>

```html
<r-card heading="Apenas um título">
  <p>Conteúdo do corpo.</p>
</r-card>
```

### Descrição `description`

Um subtítulo desenhado abaixo do título. Fica oculto quando vazio. Quando nem `title` nem `description` estão definidos, o cabeçalho inteiro some.

<ran-demo>
  <r-card heading="Título" description="Um subtítulo curto de apoio" style="max-width: 360px;">
    <p style="margin: 0;">Conteúdo do corpo.</p>
  </r-card>
</ran-demo>

```html
<r-card heading="Título" description="Um subtítulo curto de apoio">
  <p>Conteúdo do corpo.</p>
</r-card>
```

### Cartão interativo `hoverable`

Cartões não reagem ao mouse por padrão. Acrescente o atributo `hoverable` nos cartões que são de fato clicáveis: ao passar o mouse, a borda escurece um passo na escala de cinzas (`--ran-color-border` → `--ran-color-border-hover`) e a superfície ganha a sombra elevada discreta (`--ran-shadow-elevated`).

<ran-demo>
  <r-card hoverable heading="Cartão com hover" description="Passe o mouse" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">A borda escurece e o cartão sobe um pouco.</p>
  </r-card>
</ran-demo>

```html
<r-card hoverable heading="Cartão com hover" description="Passe o mouse">
  <p>A borda escurece e o cartão sobe um pouco.</p>
</r-card>
```

`hoverable` é puramente visual: reserve-o para cartões que respondem a cliques e deixe inertes os não interativos.

### Estilos externos `sheet`

CSS injetado no shadow DOM do cartão. Segue a mesma convenção `sheet` de todos os outros componentes do ranui.

```html
<r-card heading="Cartão com tema" sheet=".ran-card { background: #f6ffed; }">
  <p>Conteúdo do corpo.</p>
</r-card>
```

## Slots

| Slot       | Descrição                                                           |
| ---------- | ------------------------------------------------------------------- |
| _(padrão)_ | Conteúdo do corpo, desenhado no corpo do cartão.                    |
| `extra`    | Lado direito do cabeçalho: selos, links ou ações.                   |
| `footer`   | Conteúdo do rodapé. O rodapé fica oculto até este slot receber nós. |

## Partes CSS

O cartão expõe estes ganchos `::part()` para estilização externa:

| Parte         | Descrição                           |
| ------------- | ----------------------------------- |
| `card`        | O contêiner externo do cartão.      |
| `header`      | A linha de cabeçalho.               |
| `title`       | O texto do título.                  |
| `description` | O texto do subtítulo.               |
| `extra`       | O slot `extra` do cabeçalho.        |
| `body`        | A região do corpo (slot padrão).    |
| `footer`      | A região do rodapé (slot `footer`). |

Estas variáveis CSS podem ser sobrescritas: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-border-color`, `--ran-card-shadow`, `--ran-card-hover-border-color`, `--ran-card-hover-shadow` (as duas últimas valem com `hoverable`), `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## Eventos

O cartão é um contêiner passivo e não despacha eventos personalizados.

## Boas práticas

- **Título e descrição**: use `title` para o título e `description` para um subtítulo curto de apoio; omita ambos para esconder o cabeçalho por completo.
- **Conteúdo do corpo**: coloque o conteúdo principal no slot padrão.
- **Ações no cabeçalho**: use o slot `extra` para selos, links ou ações alinhados à direita do cabeçalho.
- **Rodapé**: use o slot `footer` para ações ou links secundários; ele fica oculto até você colocar conteúdo nele.
- **Resposta ao hover**: acrescente `hoverable` apenas a cartões clicáveis; cartões não interativos não devem reagir ao mouse.
- **Temas**: prefira variáveis CSS e `::part()` ao atributo `sheet` quando o estilo for reutilizável.
