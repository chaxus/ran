---
description: 'Como dar forma a uma página de alta densidade antes de escolher o primeiro token: as três perguntas que fixam a página, o esqueleto que responde à principal e onde vai cada tipo de informação.'
---

# Arquitetura da informação

Que **forma** uma página assume. Isso se decide antes de qualquer cor ou espaçamento.

As outras páginas desta seção respondem perguntas sobre as peças. Esta responde a que vem
antes: com tudo o que a tela precisa carregar, o que a pessoa veio fazer e qual arranjo
permite que ela faça?

| Página                                                     | Responde                                            |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| **Arquitetura da informação** (esta página)                | _Que forma_ a página deve ter                       |
| [Design system](/pt/src/ranui/design-system/)              | _O que_ são os tokens: o vocabulário                |
| [Diretrizes de design](/pt/src/ranui/design-guides/)       | _Como escolher_ entre eles ao montar uma tela       |
| [Temas](/pt/src/ranui/theme/)                              | _Como trocar e sobrescrever_ em tempo de execução   |

> **Use quando** estiver começando uma tela que precisa carregar vários objetos, vários
> estados e as relações entre eles: um console, um painel, um backoffice, uma bancada de
> trabalho, uma página de monitoramento. Não uma landing page nem um formulário de conversão
> única, que se ganham ou se perdem pela persuasão e não por alguém conseguir julgar bem em
> meio a informação densa.

Ter todos os dados não é ter a página desenhada. Uma tela pode exibir cada campo que a API
devolve, com filtros, etiquetas de status e ações em lote, e ainda assim deixar quem lê sem
saber o que olhar primeiro. Não falta informação: falta ordem.

## Três perguntas antes de qualquer componente {#three-questions}

1. **Qual é a única coisa que precisa ser vista na chegada?** Essa é a informação principal
   da página.
2. **O que mais precisa estar visível para que ela faça sentido?** Os recursos relacionados,
   os modelos relacionados, o contexto.
3. **O que a pessoa faz em seguida?** Julgar algo, agir sobre algo ou continuar pensando em
   algo.

Responda as três antes de abrir a lista de componentes. Uma página com essas três respostas
claras raramente erra a forma; uma que as pula acaba organizada em torno da resposta da API.

**Uma página, um modelo principal.** Modelos de apoio podem ajudar a entender ou a operar o
principal. Não podem disputar a primeira tela com ele.

## A forma segue a tarefa, não o payload {#shape}

Dois atalhos produzem quase todas as páginas malformadas:

- O endpoint devolveu um array, então virou tabela.
- A rota carrega um ID, então virou página de detalhe.

Nenhum dos dois é razão. O mesmo objeto assume outra forma sob outra tarefa: uma issue é uma
**coleção** enquanto você busca, um **fluxo de status** enquanto você a trabalha, uma
**thread de discussão** enquanto colabora e uma **sequência de eventos** enquanto audita. Um
registro ter campo de data diz que há uma data nos dados. Não diz que a página é um calendário.

## Como escolher o esqueleto {#skeletons}

Escolha o arranjo que responde à pergunta principal com o menor número de conversões mentais.

| A pergunta diante de quem lê                            | O que precisa ficar junto                             | Esqueleto                   |
| --------------------------------------------------------- | ------------------------------------------------------ | ---------------------------- |
| Em que estes diferem?                                   | Os campos comparados, em colunas fixas                | Tabela de comparação        |
| Qual é, para eu abrir?                                  | Nome, identificador, status                           | Lista / catálogo de recursos |
| Qual é, se a imagem me diz?                             | A imagem primeiro, nome e campos ao redor             | Grade de cartões            |
| O que é este objeto e como ele está agora?              | Identidade, status, ação principal e então atributos  | Detalhe em seções           |
| A que ele pertence?                                     | Caminho, pai, irmãos                                  | Árvore hierárquica          |
| O que depende disto e o que quebra se mudar?            | Montante e jusante, raio de impacto                   | Lista de adjacência         |
| Em que passo estou e o que vem depois?                  | Etapa, entrada atual, os passos seguintes             | Fluxo em etapas             |
| Em que estágio está cada item, se movê-lo _é_ o trabalho | O estágio como coluna, identidade e bloqueios no cartão | Kanban                      |
| Por que travou?                                         | Resumo da etapa, depois resultado por passo, depois o log bruto | Rastreamento com drill-down |
| Está saudável e até onde vai o estrago?                 | Nome do objeto, status e o evento que o mudou         | Mural de status             |
| O que aconteceu, em que ordem e por quem?               | Momento, autor, tipo de evento                        | Linha do tempo de eventos   |
| Quem disse o quê e como foi respondido?                 | Autor, mensagem, estrutura de respostas               | Thread de discussão         |
| O que mudou, antes contra depois?                       | As duas versões, lado a lado                          | Visão de diferenças         |
| Qual é a tendência e onde está a anomalia?              | A métrica, sua linha de base, a entrada para o detalhe | Painel de indicadores       |
| Quando isto está ocupado e quando conflita?             | Início, fim e duração em um mesmo eixo                | Calendário / agenda         |
| No que eu trabalho em seguida?                          | A fila de um lado, o item do outro                    | Bancada mestre-detalhe      |
| Que regras valem e o que elas afetam?                   | O ajuste, seu alcance, sua consequência               | Formulário de configuração  |
| O que este texto diz?                                   | O corpo em ordem, com um sumário ao lado              | Documento contínuo          |
| Onde está?                                              | Posição, limites, distribuição                        | Mapa / tela                 |

### Pares que se confundem {#swapped-pairs}

- **Linha do tempo ou etapas.** A linha do tempo conta o que já aconteceu, em ordem. As etapas
  dizem onde você está e o que vem. São parecidas e apontam para direções opostas no tempo.
- **Kanban ou filtro.** Kanban cabe quando mover um cartão _é_ a ação. Se as colunas são
  condições de filtro salvas, você construiu um filtro que custa um arrasto.
- **Calendário ou linha do tempo.** O calendário responde ocupação e conflito; a linha do tempo
  responde ordem. A data do registro não escolhe entre os dois; a pergunta escolhe.
- **Grade de cartões ou tabela.** Ou a imagem é a âncora de reconhecimento ou não é. Se a
  escolha se faz comparando números, uma miniatura na primeira coluna soterra os campos que
  decidem.
- **Grafo ou lista de adjacência.** Desenhe o grafo só quando o caminho ou a propagação forem o
  próprio julgamento. Caso contrário, uma lista agrupada de montante e jusante se lê mais rápido.
- **Documento ou grade de campos.** Prosa lida em ordem continua prosa. Picar cada parágrafo em
  um cartão ou em um par chave-valor destrói justamente o que a tornava legível.

Não construa as três visões porque dá. Cada visão extra é outro conjunto de filtros, outro
mapeamento de status e outro conjunto de ações para manter em sincronia. Acrescente a segunda
quando o segundo uso for realmente frequente, não por precaução.

## Onde vai cada tipo de informação {#placement}

| Informação      | Responde                        | Fica em                                                             | Não pode terminar em                          |
| ---------------- | ------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| **Identidade**  | O que é isto?                   | Título, resumo do objeto                                            | A última coluna ou atrás de uma aba           |
| **Status**      | Como está agora?                | Região de título ou de resumo                                       | Localizável só em um campo de detalhe         |
| **Atributos**   | Como ele é?                     | Corpo do detalhe, agrupado como as pessoas pensam                   | Achatado na ordem dos campos da API           |
| **Relações**    | Com o que se conecta?           | Região ou aba própria, com posse, dependência e referência distintas | Misturado na tabela de atributos              |
| **Mudanças**    | O que difere de antes?          | Região de diferenças, linha do tempo                                | Mostrado apenas como o valor novo             |
| **Evidência**   | Por que esse julgamento se sustenta? | Ao lado do julgamento, expansível                                   | Uma página de log em outro lugar              |
| **Ações**       | O que posso fazer agora?        | A principal na região de título, o resto junto ao objeto            | Enterradas em «mais»                          |
| **Retorno**     | O que aquilo fez?               | Junto à ação, preservando o contexto da tarefa                      | Um aviso global solto do que ele trata        |

**Cada fato tem exatamente um lugar autoritativo.** Nos demais entra um resumo ou uma entrada
que aponta de volta.

## Ordem de leitura {#reading-order}

```text
Identidade da página
→ status atual ou exceção
→ tarefa principal e ação principal
→ a informação de que o julgamento precisa
→ relações, mudanças, evidência
→ informação secundária e ações pouco frequentes
```

- **Um único título principal visual por página.** Os títulos de seção avançam por semântica,
  não por um tamanho de fonte fingindo hierarquia.
- **No máximo uma ação principal por região de tarefa.** O botão principal é o próximo passo
  mais provável, não o mais destrutivo. O perigoso ganha semântica de perigo, não o maior peso
  visual.
- Cor de aviso e de perigo é para estados que realmente pedem atenção. Uma página toda verde já
  gastou o próprio sinal.
- Selos, etiquetas e faixas dividem um mesmo orçamento de atenção. Destaque só o que mudaria
  uma decisão.

## Densidade {#density}

Densidade não é quantos controles cabem por centímetro quadrado, e sim quanta informação
_utilizável_ alguém leva em um olhar. Apertar o espaçamento sobe a densidade visual e deixa a
efetiva onde estava; tirar campos irrelevantes e pôr a comparação em um lugar só sobe a de
verdade.

| Nível         | Onde cabe                                              | O que compra                                                    |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| **Folgada**   | Primeiro uso, configuração rara, confirmação arriscada | Espaço para explicar, grupos mais separados, prévia do impacto   |
| **Padrão**    | A maioria das listas, detalhes e formulários           | O equilíbrio padrão entre varredura e informação por tela        |
| **Compacta**  | Bancadas de especialistas: monitoramento, operação, auditoria | Larguras de coluna estáveis, textos curtos, eficiência de teclado, visões salvas |

- Use **no máximo dois níveis vizinhos** em uma página. Uma tabela compacta dentro de uma
  página padrão tudo bem; cada região inventando a própria escala não.
- Compacto não é «encolher texto e alvos de toque juntos». O preenchimento do contêiner e a
  altura de linha podem apertar; a legibilidade do corpo, o anel de foco visível e o tamanho do
  alvo de ponteiro não.
- Para usuários especialistas, gestão de colunas, visões salvas, ações em lote e atalhos rendem
  mais do que mostrar mais de uma vez.

## Preservar o contexto da tarefa {#context}

Com o esqueleto escolhido, decida onde mora o conteúdo de apoio:

| Quem lê está…                                          | Dê a ela                                                          |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Alternando entre objetos ou evidências o tempo todo     | Uma divisão mestre-detalhe: a fila de um lado, o item do outro    |
| Dando uma olhada em algo leve e passageiro              | Uma linha expansível (`r-disclosure-row`) ou um popover (`r-popover`) |
| Trabalhando em algo compartilhável ou que precisa de espaço | Uma rota própria                                                  |
| Confirmando, ou digitando um campo só                   | Um modal (`r-modal`)                                              |

**Um modal não é uma camada de navegação.** Tudo que precisar de link copiável, histórico,
comparação lado a lado ou trabalho que sobreviva a um recarregamento ganha rota.

## O que o ranui oferece nesta camada {#with-ranui}

O ranui é deliberadamente neutro quanto à forma da página: entrega primitivos e tokens, não
modelos de página. O que ele dá aqui:

- `r-section` para as faixas em que um esqueleto se divide e `r-card` para uma entrada repetida
  genuinamente independente. Nunca um cartão dentro de outro; agrupe campos de formulário com
  um título ou um divisor.
- `r-tabs` para **visões pares de um mesmo objeto** (sua conversa, suas verificações, seu
  diff), nunca para módulos sem relação: disso cuida a navegação.
- `r-disclosure-row` para divulgação progressiva, `r-popover` e `r-dropdown` para contexto
  passageiro, e `r-modal` só para o que a tabela acima permite.
- `r-state-dot` para status, sempre com o rótulo:
  [nunca só cor](/pt/src/ranui/design-guides/#accessibility).
- `r-skeleton` enquanto a primeira tela carrega, `r-progress` para qualquer coisa longa o
  bastante para gerar dúvida, `r-message` para o resultado.

No ranui **não existe tabela, árvore, calendário, kanban nem linha do tempo**. Ao construir
uma, construa sobre [os tokens](/pt/src/ranui/design-system/) e as
[diretrizes de design](/pt/src/ranui/design-guides/) em vez de levantar um segundo sistema
visual: espaçamento vindo da escala, tipografia por papel, cor de tokens semânticos e todos os
estados alcançáveis desenhados.

## Antipadrões {#anti-patterns}

- Cada campo que o endpoint devolve vira uma linha de detalhe, e identidade, status, relações e
  evidência chegam todas com o mesmo peso.
- Hierarquia fabricada com cartões, cor e espaçamento decorativo, sem dizer nada sobre o que
  ler primeiro.
- Várias ações dividindo o estilo principal, ou uma ação rara instalada na região de título.
- Status, atributos, relações e mudanças misturados em uma tabela, de modo que nenhuma
  comparação se forma.
- Um grafo de relações quando só se queria consultar um nome e um status.
- Um modal carregando um fluxo longo, uma comparação ou algo cujo link alguém vai querer enviar.
- A mesma frase repetida no título, no resumo, na aba e na tabela, sem acrescentar nada novo em
  nenhum deles.

## Checklist antes de publicar uma página

- [ ] A informação principal, a de apoio e a próxima ação estão escritas.
- [ ] O esqueleto foi escolhido a partir da pergunta, não do formato da resposta.
- [ ] A página tem um modelo principal e as visões de apoio servem a ele em vez de competir.
- [ ] Sem ler a especificação, o objeto, seu status e a ação principal ficam claros em cinco
      segundos.
- [ ] A comparação acontece em um lugar só; nada obriga a lembrar um valor entre abas ou páginas.
- [ ] Cada fato tem um lugar autoritativo e os demais apontam para ele.
- [ ] A densidade corresponde à frequência de uso e não aparecem mais de dois níveis vizinhos.
- [ ] Texto longo, números grandes e viewport estreita não quebram a ordem da informação.
- [ ] Todo bloco, campo, etiqueta e botão que não ajuda a julgar foi removido.
