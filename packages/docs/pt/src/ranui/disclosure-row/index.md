---
description: 'O DisclosureRow do ranui (<r-disclosure-row>) é uma linha "título · resumo" que se expande para revelar um corpo, com um brilho corrente enquanto o trabalho por trás dela roda.'
---

# DisclosureRow

A moldura de uma linha `[início] título · resumo` que se expande para revelar um corpo. É a linha compartilhada por `<r-reasoning>` e `<r-tool-card>`, para que uma transcrição com os dois tenha uma só linguagem de expansão em vez de duas.

> **Use quando** tiver uma linha compacta que represente algo maior (uma chamada de ferramenta, uma cadeia de raciocínio, um grupo de registros) e o detalhe valer a pena ficar escondido até alguém pedir.

## Início rápido

### Uso básico

<Demo column>
  <r-disclosure-row heading="Ler arquivo" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">O corpo aparece quando a linha está aberta.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Ler arquivo" summary="packages/ranui/index.ts" expandable>
  <div>O corpo aparece quando a linha está aberta.</div>
</r-disclosure-row>
```

O **heading é a metade esquerda, de largura fixa**, e o **summary é a metade direita, que corta o excesso**, então uma coluna de linhas se alinha pela mesma espinha, por mais comprido que seja cada resumo. Um resumo vazio leva o separador junto.

### Enquanto o trabalho corre

`busy` desenha um brilho que varre a linha. Um giro só indica que algo, em algum lugar, está acontecendo; uma varredura sobre a linha aponta qual linha ainda está trabalhando.

<Demo column>
  <r-disclosure-row heading="Rodar testes" summary="2351 passaram" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Rodar testes" summary="2351 passaram" expandable></r-disclosure-row>
</Demo>

### Com um indicador no começo

O slot `leading` e a seta compartilham a mesma célula da grade, então trocar um pelo outro não custa layout nenhum e o título nunca desliza sob o ponteiro.

Sem nada no `leading`, a seta fica sempre à vista, já que ela é a única marca dizendo a quem lê que a linha abre. Com conteúdo no começo, a seta aparece no hover, no foco ou enquanto está aberta, e o resto do tempo quem aparece é o indicador de estado.

<Demo column>
  <r-disclosure-row heading="Compilar" summary="falhou em 4,2 s" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">O pacote passou do limite de tamanho.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Compilar" summary="falhou em 4,2 s" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>O pacote passou do limite de tamanho.</div>
</r-disclosure-row>
```

## Referência da API

### Propriedades

| Propriedade  | Atributo     | Tipo      | Padrão  | Descrição                                                        |
| ------------ | ------------ | --------- | ------- | ---------------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`    | A metade esquerda da linha, de largura fixa.                     |
| `summary`    | `summary`    | `string`  | `''`    | A metade direita, que corta o excesso. Vazia, leva o separador junto. |
| `open`       | `open`       | `boolean` | `false` | Se o corpo está à vista. É refletido, então `:has([open])` funciona. |
| `expandable` | `expandable` | `boolean` | `false` | Se a linha tem um corpo que valha a pena abrir.                  |
| `busy`       | `busy`       | `boolean` | `false` | Se o trabalho que esta linha representa ainda está rodando.      |
| `tone`       | `tone`       | `string`  | `''`    | `error` colore o resumo; qualquer outro valor é o tom comum.     |
| `name`       | `name`       | `string`  | `''`    | Agrupa linhas, de modo que abrir uma feche as demais.            |
| `sheet`      | `sheet`      | `string`  | `''`    | CSS injetado no shadow root.                                     |

::: warning O atributo é `heading`, não `title`
`title` é um atributo nativo de `HTMLElement` que o navegador desenha como dica de tela, então um componente que o usasse para um título faria toda instância brotar uma dica repetindo o texto que já está na tela — e nada desliga isso depois de definido. `<r-card>` e `<r-modal>` levam a mesma troca de nome pelo mesmo motivo.
:::

### Eventos

| Evento                   | Detail              | Despacho                        | Descrição                                     |
| ------------------------ | ------------------- | ------------------------------- | --------------------------------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | borbulha, composed, cancelável  | A linha está prestes a abrir ou fechar.       |
| `disclosuretoggle`       | `{ open: boolean }` | borbulha, composed              | A linha abriu ou fechou.                      |

::: warning O evento é `disclosuretoggle`, não `toggle`
`toggle` é o que o `<details>` dispara, e o `ToggleEvent` dele carrega `oldState` / `newState` em vez de um `detail`; um ouvinte tipado pelo nome da plataforma não acha nada ali dentro. Leia o estado do elemento: `row.open`.
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

O `disclosurebeforetoggle` dispara primeiro e pode ser recusado, e é isso que torna dizíveis "busque o corpo na primeira vez que abrir" e "recuse-se a fechar enquanto uma edição não estiver salva". A plataforma não tem equivalente: o `<details>` dispara só o `toggle` de depois, e o pedido por um `beforetoggle` cancelável nele continua aberto.

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // segure fechada até o corpo estar lá
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

Só um toque o dispara. Um `row.open = true` pelo código é a aplicação mudando de ideia sozinha, e não há a quem perguntar.

### Uma linha de cada vez

`name` agrupa linhas do mesmo jeito que `name` agrupa `<details>`: abrir uma fecha as outras. O grupo é o documento inteiro, e as linhas não precisam ser irmãs.

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### Acessibilidade

Uma linha só é um controle quando tem algo a abrir. Com `expandable`, a linha carrega `role="button"`, um ponto de tabulação, `aria-expanded` e um `aria-controls` apontando para o corpo; sem ele, não carrega nada disso, porque anunciar uma linha de texto como botão convida a um toque que não faz nada. `busy` define `aria-busy`, então a varredura não é o único sinal de que o trabalho continua.

Um corpo fechado é recortado em vez de removido, para que possa animar. Ele também recebe `inert` e seu conteúdo é pulado com `content-visibility: hidden`, o que o mantém fora da ordem de tabulação e do caminho de desenho enquanto está fechado.

A linha tem 24px de altura, exatamente o mínimo da WCAG 2.5.8, e as linhas se empilham sem folga. Num ponteiro grosso, a altura padrão vai para 32px, porque a área de toque não pode crescer além da linha sem invadir a linha de cima, o que trocaria um alvo pequeno por um alvo errado. Definir `--ran-disclosure-row-height` fixa a altura em qualquer tipo de entrada.

### Slots

| Slot      | Conteúdo                                                                       |
| --------- | ------------------------------------------------------------------------------ |
| `default` | O corpo, revelado enquanto estiver `open`.                                     |
| `leading` | Um indicador antes do título, normalmente `<r-state-dot>`.                     |
| `heading` | Marcação para a metade esquerda, substituindo o texto puro do atributo `heading`. |
| `summary` | Marcação para a metade direita, substituindo o texto puro do atributo `summary`. |

`heading` e `summary` recebem strings simples como atributos, que é o que a linha de uma chamada de ferramenta costuma precisar. Quando a metade tiver de carregar marcação — código, um link, uma abreviação — coloque no slot. O texto do atributo é o conteúdo reserva do slot, então o que você põe no slot simplesmente o substitui:

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

O conteúdo do slot conta como uma metade da linha, então o separador aparece e some do mesmo jeito que com os atributos.

### Parts

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## Estilos

O `<r-disclosure-row>` expõe **15 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#disclosure-row); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Dê um corpo à linha, ou não a torne expansível.** Uma seta que abre para um espaço vazio não serve para nada; deixe `expandable` de fora e a linha continua sendo uma linha só.
- **Mantenha o título num vocabulário fixo** (`Ler arquivo`, `Rodar testes`, `Buscar`) e ponha a parte variável no resumo. É isso que faz uma coluna de linhas ser percorrível de relance.
- **Acompanhe `tone="error"` de palavras, nunca só de cor**: o resumo deveria dizer o que falhou.
