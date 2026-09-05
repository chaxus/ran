---
description: 'O Button do ranui (<r-button>) é um Web Component independente de framework que dispara ações imediatas, com vários tipos, tamanhos e estados de carregamento ou desabilitado.'
---

# Button

Componente de botão para disparar ações imediatas, com vários estilos e estados.

> **Use quando** precisar de um controle clicável com estilos prontos (primary, contrast, warning, text) além de estado desabilitado e ícones: recorra ao `<r-button>` em vez de estilizar um `<button>` cru.

## Início rápido

### Uso básico

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão      | Descrição                                                          |
| ----------- | --------- | ----------- | ------------------------------------------------------------------ |
| `type`      | `string`  | `'default'` | Tipo do botão: `default`, `primary`, `contrast`, `warning`, `text` |
| `disabled`  | `boolean` | `false`     | Se o botão está desabilitado                                       |
| `icon`      | `string`  | `''`        | Nome do ícone do botão                                             |
| `effect`    | `boolean` | `true`      | Se o efeito de ondulação ao clicar é exibido                       |

### Tipos de botão `type`

<Demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</Demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` é a ação monocromática (vinda da linguagem de design Geist): preto sobre branco no modo claro, branco sobre preto no modo escuro. Aqui o azul não carrega significado de marca; ele fica reservado para links e para o anel de foco. Ele se apoia nos tokens `--ran-color-primary*` (`--ran-color-primary`, `-hover`, `-active` e `--ran-color-primary-text` para a tinta invertida); veja [Tema e tokens](/pt/src/ranui/theme/).

### Estado desabilitado `disabled`

<Demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</Demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### Botão com ícone `icon`

> 💡 **Dica**: para posicionar o ícone com precisão, use o componente Icon diretamente.

<Demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### Controle do efeito `effect`

A ondulação ao clicar vem ligada. Defina `effect="false"` para um botão simples, sem ela. Os dois botões abaixo diferem apenas nesse atributo, então você pode compará-los clicando em cada um. A ondulação é um efeito para dispositivos apontadores e só é desenhada a partir de uma largura de viewport de 1024px.

<Demo>
  <r-button type="primary" icon="home">Com ondulação (padrão)</r-button>
  <r-button type="primary" icon="home" effect="false">Sem ondulação</r-button>
</Demo>

```html
<r-button type="primary" icon="home">Com ondulação (padrão)</r-button>
<r-button type="primary" icon="home" effect="false">Sem ondulação</r-button>
```

Apenas o valor literal `false` desliga a ondulação; `effect="true"` e qualquer outro valor a deixam ligada. Pelo código, atribua a propriedade como booleano: `button.effect = false`.

## Eventos

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## Estilos

O `<r-button>` expõe **43 propriedades personalizadas de CSS** próprias: `--ran-btn-background`, `--ran-btn-color`, `--ran-btn-border-color`, suas variantes `hover` e `active`, as três da variante `warning`, além dos tokens semânticos que ele lê do tema.

```css
/* um botão, ou todos os botões dentro de um escopo */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

Quando a mudança não for específica do botão, recorra a um token **semântico**: sobrescrever `--ran-color-primary` muda a aparência da ação principal em toda parte, não só aqui.

Partes: `button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#button); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Ações principais**: use `type="primary"` (monocromático: preto sobre branco / branco sobre preto)
- **Ações perigosas**: use `type="warning"`
- **Ações secundárias**: use `type="text"`
- **Estado desabilitado**: use `disabled` quando a ação não estiver disponível
- **Ícones**: acrescente ícones pertinentes para melhorar a experiência
