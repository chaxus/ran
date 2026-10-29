---
description: 'Como aplicar o ranui numa tela: escolha um papel e deixe o token dar o valor, projete todos os estados alcançáveis e confira o que de fato foi desenhado.'
---

# Diretrizes de design

Como aplicar o ranui numa tela real: escolha um papel e um estado, e deixe os tokens darem os valores.

As regras em si ficam em dois lugares, e esta página aponta para eles em vez de repeti-las: o
[guia de design](/src/design/guide), para o método que vale em qualquer produto, e o
[adaptador de implementação do ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md),
para os tokens, níveis e regras de componentes do ranui. Os dois são distribuídos em `node_modules/ranui/docs/DESIGN.md`. O
[design system](/pt/src/ranui/design-system/) lista cada token e o seu valor, a
[tematização](/pt/src/ranui/theme/) cobre as sobrescritas em tempo de execução e a
[arquitetura da informação](/pt/src/ranui/information-architecture/) cobre a estrutura da página.

> **Use quando** for escolher cor, espaço, tipografia, profundidade ou movimento para uma tela feita com elementos `<r-*>`.

## Princípios

1. **Clareza antes de personalidade.** Primeiro, a tarefa principal e a ação principal precisam ser inconfundíveis.
2. **Reutilize os controles existentes.** `r-button`, `r-input`, `r-select` e `r-modal` já trazem o comportamento de formulário,
   teclado e acessibilidade; mude o estilo deles em vez de recriá-los.
3. **Decida por papel e estado.** "O que é este texto?" tem resposta; "que tamanho fica bom?" não
   tem. O token do papel dá o valor, e esse valor acompanha o tema.
4. **Projete todos os estados alcançáveis e olhe o resultado.** O estado padrão é um entre oito, e uma
   sombra que ninguém vê só aparece num navegador.

São pontos de partida. Afaste-se de um quando a tela ficar melhor com isso, e diga por quê.

## Escolher uma cor

A [escada](/pt/src/ranui/design-system/#the-ladder) já decide como ficam o hover e o estado ativo;
o seu trabalho é nomear o papel.

| O elemento é…                            | Use                                                            |
| ---------------------------------------- | -------------------------------------------------------------- |
| O fundo de uma página ou superfície      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Algo sob o ponteiro ou sendo pressionado | `--ran-color-bg-hover` / `-bg-active`                          |
| Texto                                    | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Uma borda                                | `--ran-color-border` / `-hover` / `-active`                    |
| A ação para a qual a tela existe         | `--ran-color-primary` (com `--ran-color-primary-text` em cima) |
| Um estado                                | `--ran-color-success` / `-warning` / `-danger`                 |
| Um link                                  | `--ran-color-link`                                             |

**Cada destaque tem um único significado.** O primário é monocromático, então o azul fica para os links e o
anel de foco; verde é sucesso, âmbar é aviso, vermelho é perigo. Usar vermelho para dar ênfase deixa você
sem nada para dizer "perigo" depois.

Um hexadecimal cru, um valor de fallback que não muda com o tema ou um que nomeia um token que não
existe quebra em silêncio no modo escuro ou derruba a declaração inteira; as
[regras de cor](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#ranui-color) do adaptador
explicam cada caso, e o `verify:design` os detecta no código-fonte do próprio ranui.

## Espaço e ritmo

Tire os espaços da [escala de 4px](/pt/src/ranui/design-system/#spacing) e deixe a distância significar alguma coisa:

- **8px** entre elementos dentro de um grupo.
- **16px** entre grupos.
- **24–32px** entre regiões.

Um espaço menor significa uma relação mais próxima, então basta um espaço fora da escala para quebrar o ritmo. Dê a cada
espaço um único responsável: conte a margem do filho e o padding do pai antes de acrescentar um terceiro espaço entre
eles.

## Escolher a tipografia

Pergunte que **papel** o texto cumpre (título, rótulo, corpo, botão, monoespaçado); a fonte, o tamanho, o peso e a
altura de linha saem da [escala tipográfica](/pt/src/ranui/design-system/#typography). Um texto de fato excepcional,
como o aviso de um gesto sobre um vídeo, fica melhor com o próprio token de componente do que forçado ao
papel mais próximo.

## Profundidade: sombra e empilhamento

Escolha o nível de sombra pelo que o elemento é: uma superfície no fluxo, uma camada flutuante ou um diálogo
que bloqueia. Uma camada que cai para o nível dos cartões parece pregada na página.

**Embutir camadas do ranui na sua própria moldura.** A [escada de z-index](/pt/src/ranui/design-system/#stacking)
começa em 1000, então uma camada portalizada passa sozinha por cima da moldura comum da página. Uma camada com `position: fixed`
que fica dentro do próprio shadow DOM (o diálogo do `r-modal`) só escapa até o
**contexto de empilhamento** ancestral mais próximo. Se você envolver o conteúdo embutido em algo que crie um
(`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), suba esse invólucro só enquanto uma
camada estiver de fato aberta:

```css
.embed {
  isolation: isolate; /* cheap: no z-index of its own, so nothing is promoted */
}
/* Escalate only while a real overlay is open — never "just in case" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Um `z-index` permanente no invólucro eleva tudo o que está dentro dele, conteúdo estático incluído, acima do seu
cabeçalho fixo durante toda a rolagem; este site chegou a ser publicado assim uma vez. Combine `closing` além
de `open`: a máscara continua sendo pintada durante a transição de fechamento.

## Movimento {#motion}

O feedback frequente (hover, foco, pressionar) é imediato. Quando o movimento explica uma mudança, o feedback fica
em 0–100ms, a entrada leva 250–400ms e desacelera, e a saída leva 150–200ms e acelera.
Permita interrompê-lo e respeite `prefers-reduced-motion`.

**Nunca deixe uma propriedade de cor fazer transição.** O CSS não sabe _por que_ uma cor mudou, então uma `transition`
em `background-color`, `color`, `border-color`, `box-shadow`, `fill` ou `stroke` também dispara quando o
**tema** vira: cada elemento desbota no próprio ritmo enquanto a página já trocou. Anime
`transform` e `opacity` em vez disso. `transition: all` e um `transition: 0.2s` pelado também incluem a cor.

## Estados e textos

Todo estado alcançável faz parte do design: hover, ativo, foco, desabilitado, carregando, vazio, erro.
O hover corresponde a `bg-hover` / `border-hover`, o ativo a `bg-active` e o foco ao anel de foco. Nada que não
seja clicável deve parecer clicável: o `r-card` só reage ao hover com `hoverable`.

O texto também é parte do sistema:

- **Os botões** nomeiam o resultado, com o objeto quando o contexto não o fornece: "Excluir membro". Um
  diálogo com objeto claro pode dizer "Excluir"; evite um "OK" genérico.
- **Os erros** dizem o que aconteceu e depois como resolver. ✅ "A compilação falhou: o pacote passou do limite de
  tamanho. Reduza-o ou aumente o limite." ❌ "A operação falhou, tente de novo."
- **As confirmações** descrevem a mudança, não o sucesso, e só aparecem depois que ela é confirmada.
  ✅ "Projeto excluído" ❌ "Operação bem-sucedida".
- Deixe o contexto tirar a redundância: um diálogo intitulado "Excluir projeto" não precisa de um botão escrito
  "Excluir o projeto permanentemente, para sempre".

## Acessibilidade {#accessibility}

- Atenda ao contraste **WCAG AA** do texto contra o fundo dele.
- **Nunca sinalize um estado só com cor**: acompanhe-a de um ícone, um rótulo ou texto.
- Todo elemento interativo mantém um **anel de foco visível** (`--ran-focus-ring`, ou
  `outline: 2px solid var(--ran-color-focus); outline-offset: 2px`).
- **Tudo é alcançável pelo teclado.**
- Respeite `prefers-reduced-motion` e `prefers-color-scheme`.

## Mouse e toque, estreito e largo

Nem a forma de apontar nem o tamanho da janela é o alvo secundário.

- Arrastos, sliders e gestos usam **Pointer Events**, com `touch-action: none` na superfície exata de
  arrasto. Um `touch-action: none` sem nenhum manipulador de ponteiro por trás é um controle quebrado.
- **O que só aparece no hover precisa de uma alternativa por toque.** `trigger="hover"` no `r-select` ou no `r-popover`
  vira um clique em dispositivos de toque; tudo o que você construir deve fazer o mesmo.
- Prefira **tamanhos relativos ao viewport** (`min(560px, calc(100vw - 32px))`, `clamp()`) a inventar um
  breakpoint: o ranui não tem token de breakpoint, então cada breakpoint fixo é um número que alguém mantém.
- **Nunca esconda no celular a única forma de fazer algo.** Reorganize em vez disso.
- **Uma posição medida só está certa até o próximo reflow.** Tudo o que vem de
  `getBoundingClientRect()` fica desatualizado ao redimensionar, quando o contêiner se reorganiza e, num painel portalizado, ao
  rolar. Carregar numa largura estreita não testa _redimensionar até_ ela, que é onde isso quebra.

## O que a biblioteca cobra de forma mecânica

`pnpm -F ranui verify:design` verifica nove regras no código-fonte do próprio ranui: fallbacks de cor que não
mudam com o tema, literais de cor crus, as escalas de espaço e de tamanho, arrastos só de mouse, regras de `:host` que quebram
`hidden`, fallbacks que nomeiam tokens não declarados, componentes que buscam na própria árvore shadow e árvores shadow
construídas fora do construtor. Uma linha que quebra uma regra de propósito diz isso com
`design-ok: <rule> <reason>`. As verificações cobrem só as raízes de código configuradas; uma aplicação que
usa o ranui roda as próprias verificações e olha as próprias páginas.

## Exemplos de design {#design-examples}

<DesignIllustrations />

## Evidências e aceitação {#evidence-and-acceptance}

A seção [verificar uma mudança](/src/design/guide#verifying-a-change) do guia diz o que conferir num navegador
real e o que relatar: o que você observou, o que só deduziu e o que não conseguiu conferir.
A revisão de um agente não é a aceitação do usuário.
