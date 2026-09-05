---
description: 'O Popover do ranui (<r-popover>) revela um cartão flutuante ao passar o cursor ou clicar: para dicas, menus e conteúdo contextual.'
---

# Popover

Componente de popover que revela uma camada flutuante em forma de balão quando o gatilho recebe o cursor ou é clicado.

> **Use quando** precisar de um painel flutuante que abra ao passar o cursor por um gatilho ou ao clicar nele. O `<r-popover>` posiciona e portaliza o painel `<r-content>` e já deixa a acessibilidade ligada.

## Início rápido

### Uso básico

O gatilho fica no slot padrão; o conteúdo flutuante é envolvido por um elemento `<r-content>` aninhado.

<Demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>este é o conteúdo</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>este é o conteúdo</div>
  </r-content>
</r-popover>
```

## Referência da API

### Propriedades

| Propriedade           | Tipo     | Padrão    | Descrição                                                                                                                                       |
| --------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | Posição do painel em relação ao gatilho: `top`, `bottom`, `left`, `right`, cada um com o sufixo opcional `-start` (padrão), `-center` ou `-end` |
| `trigger`             | `string` | `'hover'` | Como o painel abre: `hover` ou `click` (o manipulador de `click` é sempre ligado)                                                               |
| `getPopupContainerId` | `string` | `''`      | `id` do elemento dentro do qual posicionar o painel (lido na abertura; não é refletido)                                                         |
| `sheet`               | `string` | `''`      | CSS injetado no shadow DOM do componente                                                                                                        |

### Modo de abertura `trigger`

<Demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### Posição `placement`

<Demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### Alinhamento `placement="<lado>-<alinhamento>"`

Só o lado alinha a borda inicial do painel com a do gatilho. Acrescente `-center` ou `-end` quando ele precisar ficar centralizado no gatilho ou rente à borda final dele — é o que um menu ancorado à ponta direita de uma barra de topo quer, para abrir para dentro em vez de sair da tela e ser empurrado de volta pelo deslocamento. O sufixo sobrevive a uma inversão automática: `bottom-end` vira `top-end`, não `top`.

<Demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — o mesmo que bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## Slots

| Componente    | Slot     | Descrição                                                                                              |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `<r-popover>` | (padrão) | O elemento gatilho mais o invólucro `<r-content>`                                                      |
| `<r-content>` | (padrão) | O conteúdo do painel flutuante; esses filhos são portalizados para `document.body` e exibidos ao abrir |

Ambos os componentes expõem um único slot padrão sem nome; não há slots nomeados.

## Estado de abertura `open`

`open` é o estado do painel, refletido como atributo do mesmo jeito que em `<details open>` e `<dialog open>`. Nada o deduz do `display` do painel, que fica atrás do estado pelo tempo da animação de saída — assim o atributo, o `aria-expanded` e o que está na tela não podem se contradizer.

```html
<r-popover id="pop" trigger="click">
  <r-button>Gatilho</r-button>
  <r-content><div>Conteúdo</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // ou pop.show()
  pop.open = false; // ou pop.hide()
  pop.toggle();
</script>
```

`show()`, `hide()` e `toggle()` são invólucros finos sobre ele. `closePopover()` permanece como apelido de `hide()`.

## Eventos

O `<r-popover>` dispara quatro eventos em torno das transições do painel, nenhum deles com `detail`:

| Evento       | Quando                                                   |
| ------------ | -------------------------------------------------------- |
| `show`       | O painel está prestes a aparecer.                        |
| `after-show` | Ele apareceu e a animação de entrada, se houver, acabou. |
| `hide`       | O painel está prestes a fechar.                          |
| `after-hide` | Ele fechou e a animação de saída, se houver, acabou.     |

O que se espera é a própria animação da folha de estilos, não uma duração copiada para o script — então sob `prefers-reduced-motion` (onde não há animação a tocar) o `after-hide` vem logo depois do `hide`, em vez de após um atraso fixo.

De resto, quem conduz é a interação padrão do DOM:

- **Abrir**: `mouseenter` (quando `trigger` inclui `hover`), `click`, ou pressionar `Enter` / `Espaço` com o foco nele.
- **Fechar**: `mouseleave` (modo hover), pressionar `Escape`, ou um `click` em outro ponto do documento.

Internamente, o elemento companheiro `<r-content>` observa a própria subárvore com um `MutationObserver` e emite um `CustomEvent` `change` (`detail: { type, value: { content, mutation } }`) que o popover consome para manter o painel em sincronia. Isso é detalhe de implementação, não API pública.

A acessibilidade é ligada automaticamente: o host recebe `tabindex="0"`, `aria-haspopup="dialog"` e um `aria-expanded` que alterna entre `"false"` e `"true"` conforme o painel abre e fecha.

## Boas práticas

- **Elemento gatilho**: coloque um controle focável (por exemplo `<r-button>`) como gatilho, para que abrir e fechar pelo teclado funcione.
- **Invólucro do conteúdo**: envolva sempre o conteúdo do painel em `<r-content>`: filhos soltos, fora do `<r-content>`, não aparecem como painel flutuante.
- **Tamanho em linha**: o host é `display: block`; acrescente `style="display: inline-block;"` (ou coloque-o em um contexto de linha) para que ele encolha até o tamanho do gatilho.
- **Posição**: `placement` é uma preferência, não uma garantia: quando o gatilho está perto da borda da janela e falta espaço do lado preferido, o painel inverte sozinho para o lado oposto e desliza pelo eixo transversal para continuar na tela. Essa inversão automática só vale para o posicionamento padrão no nível do `body`.
- **Contêiner delimitado**: use `getPopupContainerId` para ancorar o painel dentro de um contêiner específico de rolagem ou posicionamento quando o posicionamento padrão no nível do `body` não servir. Nesse modo não há inversão nem deslocamento, então escolha um `placement` que caiba no contêiner. O sufixo de alinhamento continua valendo ali, exatamente como no portal para o `body`.
