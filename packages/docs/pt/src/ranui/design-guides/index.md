---
description: 'Regras de design para montar telas com o ranui: escolha um papel e deixe o token dar o valor, projete todos os estados alcançáveis e verifique o que de fato foi desenhado.'
---

# Diretrizes de design

As regras que uma tela feita de componentes ranui deve seguir para que se leia como **um sistema** e não como um monte de peças.

Esta página trata de **julgamento**: a qual token recorrer, o que conferir antes de publicar. O catálogo de tokens em si é o [design system](/pt/src/ranui/design-system/); trocar e sobrescrever em tempo de execução é a [tematização](/pt/src/ranui/theme/). A versão completa destas regras, a que é verificada por máquina, está no repositório como [`packages/ranui/docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md).

> **Use quando** estiver diagramando uma página ou montando um componente da sua aplicação com elementos `<r-*>` e precisar decidir uma cor, um espaço, um tamanho de texto, uma sombra ou uma duração de animação. A resposta curta é sempre a mesma: **escolha um papel e deixe o token dar o valor.**

## Princípios

1. **Clareza antes de personalidade.** A tarefa principal e a ação principal precisam ser inconfundíveis antes de qualquer outra consideração.
2. **Componha, não reinvente.** Recorra a `r-button`, `r-input`, `r-select` e `r-modal` antes de montar uma primitiva com `div`: esses componentes já trazem o foco, o teclado e o comportamento ARIA que você teria de deduzir de novo.
3. **Tokens, nunca valores crus.** Um código hexadecimal, um espaço de `20px` ou uma sombra escolhida a dedo são decisões que não vão acompanhar o tema.
4. **Decida por papel e estado, não a olho.** "O que é este texto?" (título / rótulo / corpo / botão) tem resposta; "que tamanho fica bom?" não tem.
5. **Projete todos os estados alcançáveis.** Padrão, hover, ativo, foco, desabilitado, carregando, vazio, erro: o estado padrão é um entre oito.
6. **Verifique o que foi desenhado.** No claro _e_ no escuro, estreito _e_ largo, com mouse _e_ com o dedo. Uma revisão não pega uma sombra que não dá para ver.

Ordem de prioridade quando duas regras puxam para lados diferentes: **objetivos de quem usa → evidência verificada → estas diretrizes → padrões já publicados → heurísticas gerais.**

## Escolher uma cor

A cor é atribuída por **papel e estado**, nunca escolhida a olho. A [escada](/pt/src/ranui/design-system/#the-ladder) já fixa como ficam o hover e o estado ativo; o seu trabalho é nomear o papel.

| O elemento é…                            | Use                                                            |
| ---------------------------------------- | -------------------------------------------------------------- |
| O fundo de uma página ou superfície      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Algo sob o ponteiro ou sendo pressionado | `--ran-color-bg-hover` / `-bg-active`                          |
| Texto                                    | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Uma borda                                | `--ran-color-border` / `-hover` / `-active`                    |
| A ação para a qual a tela existe         | `--ran-color-primary` (com `--ran-color-primary-text` em cima) |
| Um estado                                | `--ran-color-success` / `-warning` / `-danger`                 |
| Um link                                  | `--ran-color-link`                                             |

**Cada acento tem um único sentido.** O primário é monocromático (preto no branco no claro, branco no preto no escuro), então não use azul para ele: o azul é dos links e do anel de foco. Verde é sucesso, âmbar é aviso, vermelho é perigo; usar vermelho para dar ênfase deixa você sem como usá-lo depois para perigo.

**Três regras que evitam quebras silenciosas:**

- Nunca escreva à mão um hexadecimal ou um `rgb()` para um valor que deveria acompanhar o tema.
- Um valor reserva precisa nomear **um token que vira com o tema**: `var(--ran-color-text, var(--ran-gray-1000))`, nunca `var(--ran-color-text, #171717)`: um literal só do modo claro some no escuro.
- Um valor reserva precisa nomear um token que **exista**. Um `var()` sobre uma propriedade não declarada não resolve em nada, a declaração inteira é descartada e o elemento fica com o que herdou, o que costuma parecer _quase_ certo. (`--ran-color-error` não existe; é `--ran-color-danger`.)

## Espaço e ritmo

Tire cada espaço da [escala de nove valores](/pt/src/ranui/design-system/#spacing) e deixe a distância significar alguma coisa:

- **8px** entre elementos dentro de um grupo.
- **16px** entre grupos.
- **32–40px** entre seções.

Não invente `20px` nem `28px`. É o conjunto limitado que produz o ritmo da página; um único espaço fora da escala é o que o quebra. Mantenha espinhas compartilhadas entre regiões (bordas, linhas de base e colunas que se alinham) e confira o alinhamento contra os pixels desenhados, não a olho.

## Escolher a tipografia

Pergunte que **papel** o texto cumpre (título, rótulo, corpo, botão, monoespaçado) e a fonte, o tamanho, o peso e a altura de linha saem todos da [escala tipográfica](/pt/src/ranui/design-system/#typography). Não escolha pixels crus caso a caso.

Um papel é uma ferramenta, não uma lei: um texto decorativo genuinamente único (uma camada de brilho para um gesto, um peso extra no link ativo) fica melhor com um token próprio de componente do que forçado no papel mais próximo.

## Profundidade: sombra e empilhamento

**Escolha o nível de sombra pelo que o elemento é** (superfície no fluxo, camada flutuante ou diálogo que bloqueia) e certifique-se de que ela é de fato perceptível. Uma sombra que não se vê não dá pista de profundidade nenhuma, e uma camada flutuante que cai no nível de cartão parece pregada à página.

**Embutir camadas do ranui na sua própria moldura.** A [escada de z-index](/pt/src/ranui/design-system/#stacking) começa em 1000 justamente para passar por cima da moldura comum de uma página. Uma camada portalizada, portanto, não precisa de ajuda sua. Mas uma camada com `position: fixed` que fica dentro do próprio shadow DOM (o diálogo do `r-modal`) só escapa até o **contexto de empilhamento** ancestral mais próximo, então, se você envolver o conteúdo embutido em algo que crie um (`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), o nível de empilhamento desse invólucro tem de subir para o diálogo ficar acima de novo. Restrinja essa subida ao momento em que uma camada está _de fato_ aberta:

```css
.embed {
  isolation: isolate; /* barato: não tem z-index próprio, então nada é promovido */
}
/* Suba só enquanto houver uma camada real aberta — nunca "por via das dúvidas" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Um `z-index` geral no invólucro eleva _tudo_ que há dentro (inclusive conteúdo totalmente estático) acima do seu cabeçalho fixo por toda a vida da rolagem. Esse defeito chegou a ser publicado neste mesmo site. Case também `closing`, não só `open`: a máscara continua pintando pelo tempo da transição depois que o `open` some.

## Movimento {#motion}

Quanto maior a mudança, mais tempo ela recebe; abaixo desse limiar, não anime. A resposta ao hover e ao estado ativo fica em torno de 150ms, os menus em 200ms, os diálogos em 300ms, e uma mudança que já é óbvia recebe 0ms. Respeite `prefers-reduced-motion`.

**Nunca deixe uma propriedade da paleta fazer transição.** O CSS não sabe _por que_ uma cor mudou, então uma `transition` em `background-color`, `color`, `border-color`, `box-shadow`, `fill` ou `stroke` também dispara quando o **tema** vira, com cada elemento desbotando no próprio ritmo enquanto o resto da página já trocou. Anime propriedades de movimento (`transform`, `opacity`, geometria) em vez disso. `transition: all` e atalhos pelados como `transition: 0.2s` significam _tudo_, propriedades da paleta incluídas; ambos são proibidos nos estilos do próprio ranui e são má ideia nos seus.

## Estados e textos

Todo estado alcançável faz parte do design: **hover, ativo, foco, desabilitado, carregando, vazio, erro**. Mapeie-os na escada: hover → `bg-hover` / `border-hover`; ativo → `bg-active`; desabilitado → `text-disabled` mais opacidade reduzida; foco → o anel de foco.

Nada que não seja interativo pode parecer interativo. O `r-card` só reage ao hover com o atributo `hoverable`; deixe-o de fora nos cartões que não são clicáveis.

O texto também é parte do sistema:

- **Os botões** levam uma ação **e** um objeto. ✅ "Excluir membro" ❌ "Excluir", "OK".
- **Os erros** dizem o que aconteceu e depois como resolver. ✅ "A compilação falhou: o pacote passou do limite de tamanho. Reduza-o ou aumente o limite." ❌ "A operação falhou, tente de novo."
- **Confirmações e avisos** enunciam a mudança, não o sucesso. ✅ "Projeto excluído" ❌ "Excluído com sucesso" (o aviso aparecer já diz que deu certo).
- Deixe o contexto tirar a redundância: um diálogo intitulado "Excluir projeto" não precisa de um botão escrito "Excluir o projeto permanentemente, para sempre".

## Acessibilidade {#accessibility}

- Atenda ao contraste **WCAG AA** do texto contra o fundo dele.
- **Nunca sinalize um estado só com cor**: acompanhe-a de um ícone, um rótulo ou texto.
- Todo elemento interativo mantém um **anel de foco visível** (`--ran-focus-ring`, ou `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`). Nunca o remova por capricho estético.
- **Tudo é alcançável pelo teclado.** Nada é exclusivo do mouse.
- Respeite `prefers-reduced-motion` e `prefers-color-scheme`.

## Mouse e toque, estreito e largo

Nem a forma de apontar nem o tamanho da janela é o alvo secundário.

- Arrastos, controles deslizantes e gestos usam **Pointer Events** (`pointerdown` / `pointermove` / `pointerup` / `pointercancel`), nunca só `mouse*`, junto de `touch-action: none` na superfície exata que se arrasta. Um CSS que declara `touch-action: none` sem um manipulador de ponteiro por trás é um controle quebrado, não uma linha inofensiva.
- **Uma pista que só aparece no hover precisa de uma alternativa para o toque.** `trigger="hover"` no `r-select` ou no `r-popover` recai para clique em dispositivos de toque; o que você construir tem de fazer o mesmo.
- Prefira **medidas relativas à janela** (`%`, `min()`, `max()`, `clamp()`, `vw`/`vh`, por exemplo `min(560px, calc(100vw - 32px))`) a inventar um ponto de quebra. O ranui não tem um token compartilhado de pontos de quebra, então todo corte fixo é um número solto que alguém vai ter de manter.
- **Nunca esconda no celular o único jeito de fazer alguma coisa.** Reorganize em vez de recorrer a `display: none`.
- **Uma posição medida só está certa até o próximo refluxo.** Tudo que vier de `getBoundingClientRect()` envelhece ao redimensionar, ao refluxo do contêiner e (para um painel portalizado) ao rolar. Meça de novo nesses eventos, não só na interação que provocou a primeira medição. Carregar a página numa largura estreita exercita o layout inicial; não exercita o _redimensionar até_ ela, que é onde essa classe de defeito de fato aparece.

## O que a biblioteca cobra de forma mecânica

Nove destas regras são conferidas pelo `pnpm -F ranui verify:design`, que a CI roda sobre o código do próprio ranui: valores reserva de cor inseguros no escuro, literais de cor crus, a escala de espaços, a escala de tamanhos, laços de arrasto só para mouse, regras de `display` em `:host` que quebram o `hidden`, valores reserva que nomeiam tokens não declarados, componentes que consultam a própria árvore shadow e árvores shadow construídas fora do construtor. As violações conhecidas ficam travadas num arquivo de referência, então não dá para acrescentar uma nova nem desfazer uma correção em silêncio.

Essa checagem cobre a biblioteca, não o seu aplicativo, mas os defeitos que ela pega (um valor reserva nomeando um token inexistente; uma cor que só funciona no modo claro) são exatamente os que parecem bem numa revisão, então vale aplicar as mesmas regras ao seu próprio CSS.

## Lista antes de publicar interface

- [ ] Tarefa principal e ação principal são inconfundíveis.
- [ ] Funciona no **claro e no escuro**, em larguras **estreitas e amplas**.
- [ ] Funciona com **mouse e toque**; todo gatilho por hover tem alternativa de toque.
- [ ] Todos os estados exercitados: hover, ativo, foco, desabilitado, carregando, vazio, erro.
- [ ] Teclado e foco verificados; o foco aparece em todo lugar.
- [ ] Casos-limite: textos longos, números grandes, os dois idiomas.
- [ ] Espaços da escala, tipografia por papel, cor de tokens semânticos.
- [ ] Nenhuma propriedade da paleta numa `transition`; nenhum `transition: all`.
- [ ] O texto nomeia o objeto; nada sinaliza estado só com cor.
