---
description: 'As Tabs do ranui (<r-tabs>), um Web Component nativo utilizável em qualquer framework, organizam o conteúdo em painéis alternáveis.'
---

# Tab

Contêiner com abas que alterna entre painéis. Componha `<r-tabs>` como contêiner com um ou mais painéis `<r-tab>` dentro dele.

> **Use quando** precisar de um contêiner com abas que alterne entre painéis. Componha `<r-tabs>` com filhos `<r-tab>`, cada um fornecendo um `label` de cabeçalho e o corpo do painel.

## Início rápido

### Uso básico

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Cada `<r-tab>` vira um painel; o `label` dele é desenhado como o botão do cabeçalho, e o conteúdo colocado no slot é o corpo do painel. Escolher um cabeçalho desliza o painel correspondente para a vista.

## Referência da API

### Propriedades de `r-tabs`

O contêiner. Abriga a fila de cabeçalhos, o indicador de ativo e a área de conteúdo dos painéis.

| Propriedade | Tipo      | Padrão                  | Descrição                                                                 |
| ----------- | --------- | ----------------------- | ------------------------------------------------------------------------- |
| `active`    | `string`  | primeira aba habilitada | O `r-key` da aba ativa no momento                                         |
| `type`      | `string`  | `'flat'`                | Estilo do cabeçalho: `flat`, `line`                                       |
| `align`     | `string`  | `'start'`               | Alinhamento do cabeçalho: `start`, `center`, `end`                        |
| `effect`    | `boolean` | `false`                 | Liga a ondulação nos botões de cabeçalho e esconde o indicador deslizante |
| `sheet`     | `string`  | `''`                    | Texto CSS injetado no shadow DOM                                          |

> O setter de `active` aceita uma string de chave; atribuir `null` remove o atributo. Quando não há `active`, a primeira aba não desabilitada é selecionada na montagem.

### Propriedades de `r-tab`

Um único painel. Seus atributos são lidos pelo `<r-tabs>` pai para montar o botão de cabeçalho correspondente.

| Propriedade | Tipo      | Padrão  | Descrição                                                             |
| ----------- | --------- | ------- | --------------------------------------------------------------------- |
| `label`     | `string`  | `''`    | Texto exibido no cabeçalho da aba                                     |
| `r-key`     | `string`  | índice  | Identificador único dentro de um `<r-tabs>`; comparado com `active`   |
| `icon`      | `string`  | —       | Nome de `r-icon` exibido antes do rótulo                              |
| `iconSize`  | `string`  | —       | Tamanho do ícone do cabeçalho                                         |
| `disabled`  | `boolean` | `false` | Torna a aba não selecionável                                          |
| `effect`    | `boolean` | —       | Efeito de ondulação no cabeçalho (normalmente vem do `effect` do pai) |
| `sheet`     | `string`  | `''`    | Texto CSS injetado no shadow DOM                                      |

> O getter/setter da propriedade `key` lê e escreve o atributo `r-key` (o nome simples `key` é evitado por ser um campo reservado). Defina `label` e `r-key` antes de o elemento se conectar: mudanças nesses dois atributos não são reprocessadas depois que os cabeçalhos são montados.

### Estilo do cabeçalho `type`

`flat` (padrão) mostra um sublinhado deslizante como indicador; `line` desenha cabeçalhos com borda.

<ran-demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Alinhamento do cabeçalho `align`

Alinha a fila de cabeçalhos. O padrão é `start`.

<ran-demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### Aba ativa: `active` e `r-key`

- `r-key` é um atributo de `<r-tab>` que dá a cada painel uma identidade estável dentro do mesmo `<r-tabs>`. Quando omitido, recai no índice do painel.
- `active` é um atributo de `<r-tabs>` que escolhe a aba ativa inicial: aparece o painel cujo `r-key` é igual a `active`.

Sem chaves explícitas, `active` corresponde ao índice começando em zero:

<ran-demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Com valores `r-key` explícitos (painéis sem chave recaem no índice):

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> Todo `r-key` dentro de um mesmo `<r-tabs>` precisa ser único: chaves duplicadas ou ausentes em alguns painéis lançam um erro enquanto os cabeçalhos são montados.

### Painel desabilitado `disabled`

Um `<r-tab>` desabilitado não pode ser selecionado e é pulado ao escolher a aba ativa padrão.

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### Ícone do cabeçalho: `icon` e `iconSize`

O `<r-tab>` aceita um atributo `icon` (um nome de `r-icon`) desenhado antes do rótulo; `iconSize` define o tamanho dele.

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Efeito de ondulação `effect`

Coloque `effect` no `<r-tabs>` para ligar a ondulação de clique nos botões de cabeçalho. Com `effect` ativo, o sublinhado deslizante fica escondido.

<ran-demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## Slots

| Elemento | Slot     | Descrição                                          |
| -------- | -------- | -------------------------------------------------- |
| `r-tabs` | (padrão) | Aceita os painéis `<r-tab>`                        |
| `r-tab`  | (padrão) | O corpo do painel, exibido quando a aba está ativa |

## Parts CSS

O `r-tabs` expõe:

| Part           | Descrição                                       |
| -------------- | ----------------------------------------------- |
| `tabs`         | Invólucro raiz                                  |
| `header`       | Invólucro da fila de cabeçalhos                 |
| `nav`          | A tablist que contém os itens de cabeçalho      |
| `indicator`    | A linha do sublinhado deslizante                |
| `content`      | Janela do conteúdo dos painéis                  |
| `content-wrap` | A trilha deslizante que segura todos os painéis |

O `r-tab` expõe:

| Part      | Descrição                    |
| --------- | ---------------------------- |
| `content` | O slot de conteúdo do painel |

## Eventos

### `change`

O `<r-tabs>` despacha um `CustomEvent` `change` quando um atributo observado muda, mais notavelmente quando a aba ativa troca. `event.detail.active` é a chave ativa atual (o `r-key` do `<r-tab>` selecionado, ou o índice dele quando não há `r-key`).

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('aba ativa:', e.detail.active);
});
tabbar.append(tabs);
```

O `<r-tab>` não despacha nenhum evento personalizado.

## Estilos

O `<r-tabs>` expõe **10 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Partes: `content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#tab); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Identidade estável**: dê a cada `<r-tab>` um `r-key` único e conduza a seleção pelo `active` do `<r-tabs>`, em vez de depender de índices posicionais.
- **Escolha de estilo**: use `type="line"` para uma faixa de abas com borda, no estilo documento; `type="flat"` (padrão) para o sublinhado deslizante mínimo.
- **Alinhamento**: use `align="center"` ou `align="end"` para reposicionar a fila de cabeçalhos em contêineres largos.
- **Painéis desabilitados**: marque com `disabled` os painéis indisponíveis; eles são pulados tanto nos cliques quanto na seleção padrão.
- **Navegação pelo teclado**: a fila de cabeçalhos é uma tablist WAI-ARIA: as setas movem entre as abas (com `Home`/`End`), e só a aba ativa entra na ordem de tabulação.
