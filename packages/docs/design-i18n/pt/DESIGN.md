<!-- source: 59d6fe1249b0ecc5391f8f7b84c17470a00a3023 -->

# Ran Design

Métodos de design para o produto anfitrião e a tecnologia que ele já usa. Leia só as seções relevantes,
partindo do [índice de tarefas](./INTERFACE_GUIDE.md). Tokens da biblioteca e a mecânica de APIs pertencem
ao adaptador de implementação, não a este método portátil.

Cada regra tem um ID e um nível. **MUST** é um defeito quando descumprida e indica a prova exigida;
**SHOULD** é o padrão, e quem se desvia dele declara o motivo naquele caso; **MAY** é opcional.
O [índice de regras](./RULES.md) lista todas as regras graduadas com suas provas.

## 1. Cor — uma escada de estados, não uma paleta

- **D-COLOR-1 · SHOULD** Escolha papéis semânticos para conteúdo, superfícies, limites, ações e status.
- **D-COLOR-2 · SHOULD** Defina juntos os estados padrão, hover, ativo, desabilitado e foco.
- **D-COLOR-3 · SHOULD** Resolva os valores claro/escuro pelos tokens oficiais do anfitrião e verifique o
  contraste na composição real.

Acentos de marca dependem do contexto.

## 2. Espaçamento — uma escala limitada e com ritmo

- **D-SPACE-1 · SHOULD** Use a escala de espaçamento que o anfitrião já tem.
- **D-SPACE-2 · SHOULD** Use espaços curtos para agrupar partes relacionadas e espaços maiores para separar
  tarefas ou regiões.
- **D-SPACE-3 · SHOULD** Defina o preenchimento interno antes dos espaços externos.
- **D-SPACE-4 · SHOULD** Não copie as dimensões de um produto de referência sem avaliar conteúdo, densidade
  e método de entrada.

## 3. Tipografia — escolha um papel, não um tamanho

- **D-TYPE-1 · SHOULD** Escolha papéis de título, rótulo, corpo, ação e código com tamanho, peso e altura de
  linha coerentes, e mantenha uma única fonte de verdade para cada papel.
- **D-TYPE-2 · SHOULD** Verifique os sistemas de escrita reais, as métricas das fontes de reserva e conteúdos
  longos.
- **D-TYPE-3 · SHOULD** Estabeleça a hierarquia com tipografia antes de recorrer a contêineres decorativos.

## 4. Raio e elevação

- **D-ELEV-1 · SHOULD** Coordene os raios de cantos aninhados com o recuo real: raio interno = raio externo −
  recuo. Quando o resultado for 2px ou menos, as formas já não parecem concêntricas; dê à forma interna o
  raio do próprio papel dela, ou nenhum.

Um cartão com raio de 16px e 8px de preenchimento dá ao painel interno um raio de 8px. O mesmo cartão com
16px de preenchimento não deixa nada a herdar, então o painel usa o raio que o próprio papel dele pede.

- **D-ELEV-2 · SHOULD** Use a elevação para explicar uma camada flutuante, não importância, por meio dos
  papéis de empilhamento do anfitrião, e verifique as sobreposições contra a interface ao redor.

## 5. Movimento — de preferência, nenhum

As durações abaixo são uma heurística inicial.

- **D-MOTION-1 · SHOULD** Use os tokens de movimento do sistema anfitrião e verifique frequência, continuidade
  e movimento reduzido na tarefa real.

| Duração | Uso                                                                             |
| ------- | ------------------------------------------------------------------------------- |
| 0ms     | Feedback frequente de hover, foco e teclado; mudanças que já são entendidas     |
| ~150ms  | Movimento pequeno, opcional e com propósito, não um atraso de hover obrigatório |
| ~200ms  | Movimento de menu/popover quando esclarece a troca de camada                    |
| ~300ms  | Movimento de diálogo quando ajuda a orientar                                    |

**Princípio:** o propósito e a frequência decidem se o movimento merece tempo.

- **D-MOTION-2 · SHOULD** Em interações repetidas, dê feedback imediato por padrão; uma mudança maior não é,
  por si só, motivo para animar.
- **D-MOTION-3 · SHOULD** Use os tokens existentes para movimentos com propósito e mantenha-os rápidos e
  interrompíveis. O movimento reduzido é graduado em D-MOTION-10 e D-ACCESS-5.

### Contrato de movimento funcional

- **D-MOTION-4 · SHOULD** Especifique o gatilho, a mudança de estado e o destino antes de escolher um efeito.
- **D-MOTION-5 · MUST** O movimento preserva o conteúdo não relacionado, os rascunhos e a posição de leitura. _Proof: recording_
- **D-MOTION-6 · SHOULD** Dê uma linguagem de movimento comum a componentes irmãos que tenham o mesmo
  sentido de interação; consistência não exige que todo componente seja animado.
- **D-MOTION-7 · MUST** Quando houver movimento, uma nova intenção pode interrompê-lo ou revertê-lo a partir
  da apresentação atual, sem salto, conclusão obsoleta ou ativação duplicada. _Proof: recording_
- **D-MOTION-8 · MUST** O feedback continua imediato; a animação não bloqueia a entrada. _Proof: recording_
- **D-MOTION-9 · SHOULD** Ao inserir ou remover elementos, evite espremer o texto de forma visível ou passar
  controles que estão saindo por cima de ações ativas; coordene opacidade e layout para que o resultado
  continue legível.
- **D-MOTION-10 · MUST** O movimento reduzido mantém um estado final visível e compreensível. _Proof: browser_
- **D-MOTION-11 · MAY** Use uma mola; ela não precisa ultrapassar o alvo.

Veja a [pesquisa opcional sobre acabamento de componentes](./REFERENCE_RESEARCH.md#component-craft-设计垂点--wxaddesign)
para exemplos e limites, e a [validação ao longo do tempo](./ACCEPTANCE.md#review-motion-over-time) para a prova.

- **D-MOTION-12 · SHOULD** Deixe as paletas de tema se acomodarem de forma coerente. Evite transições
  implícitas de paleta ou `transition: all`; ative-as explicitamente só onde o anfitrião pretende e verifica
  um efeito coordenado.
- **D-MOTION-13 · MUST** Valores factuais e conteúdo legível aparecem imediatamente ao voltar a uma superfície
  de trabalho, sem contadores animados. _Proof: browser_
- **D-MOTION-16 · SHOULD** Não repita entradas decorativas de título a cada volta a uma superfície de trabalho.
- **D-MOTION-17 · SHOULD** Escolha o movimento de entrada pelo que a região contém, conforme a tabela abaixo.
  Escalone em ordem de leitura dentro de uma região, não pela página inteira.

| A região contém                                                  | Entrada                                                                                                 | Depois                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Texto, títulos, valores, formulários, navegação, chamadas à ação | Nenhuma: presente desde a primeira pintura (D-MOTION-13)                                                | Nenhum                                                               |
| Um visual decorativo ao lado do texto: ícones, diagrama, esboço  | Só transformação, uma vez, na primeira vez que entra na tela; nenhuma se já estiver visível ao carregar | Um loop explicativo pode rodar enquanto estiver na tela (D-CRAFT-19) |
| Uma maquete de produto ou demonstração ao vivo                   | Nenhuma para o conteúdo; uma demonstração de carregamento pode se mover (D-MOTION-14)                   | Conduzido pela própria interação de quem lê                          |
| Um indicador de status                                           | Nenhuma                                                                                                 | Um pulso só enquanto a atividade estiver em andamento (D-MOTION-15)  |

Com movimento reduzido, toda região começa no estado final (D-MOTION-10).

- **D-MOTION-14 · MAY** Uma demonstração de carregamento pode se mover para demonstrar o carregamento.
- **D-MOTION-15 · MUST** Um pulso de status só aparece enquanto a atividade está em andamento. _Proof: review_

## 6. Conteúdo — o texto faz parte do sistema

- **D-COPY-1 · SHOULD** Botões nomeiam o resultado. Inclua o objeto quando o contexto não o deixar claro:
  "Publicar projeto", "Remover membro". Num objeto ou diálogo claramente nomeado, "Salvar" ou "Excluir" basta;
  evite o genérico "OK". Veja [o texto conforme o contexto](#words-are-part-of-the-interface).
- **D-COPY-2 · SHOULD** Erros dizem **o que aconteceu** e depois **como resolver**. ✅ "Falha no build: o pacote
  passa do limite de tamanho. Reduza-o ou aumente o limite." ❌ "A operação falhou, tente novamente."
- **D-COPY-3 · SHOULD** Confirmações e toasts informam a **mudança** concluída. ✅ "Projeto excluído".
  ❌ "Operação realizada com sucesso".
- **D-COPY-4 · MUST** Mostre o feedback de conclusão só depois que a operação for confirmada. _Proof: unit, browser_
- **D-COPY-5 · SHOULD** Seja específico; cada frase elimina adivinhação em vez de acrescentá-la.

## 7. Acessibilidade — o sistema atende a todos

- **D-ACCESS-1 · MUST** O texto mantém contraste suficiente com o fundo (**WCAG AA**). _Proof: browser_
- **D-ACCESS-2 · MUST** Nunca sinalize um estado só com cor; combine-a com um ícone ou texto (por exemplo,
  rótulos ✓ / ✕, não apenas verde/vermelho). _Proof: review_
- **D-ACCESS-3 · MUST** Todo elemento interativo tem um **anel de foco visível** adequado à sua superfície;
  nunca o remova por "limpeza visual". _Proof: browser_
- **D-ACCESS-4 · MUST** **Navegação completa por teclado**: nada depende só do mouse. _Proof: browser_
- **D-ACCESS-5 · MUST** Respeite `prefers-reduced-motion`. _Proof: browser_
- **D-ACCESS-6 · MUST** Quando o anfitrião aceita os dois esquemas de cor, a renderização inicial segue
  `prefers-color-scheme`. _Proof: browser_

## 8. Entrada e viewport — celular e desktop, os dois

- **D-INPUT-1 · MUST** Dê suporte a mouse, teclado e toque em larguras estreitas e largas. _Proof: browser_
- **D-INPUT-2 · MUST** Reorganize os controles em vez de esconder o único caminho para uma ação. _Proof: browser_
- **D-INPUT-3 · MUST** Uma affordance de hover tem uma alternativa por clique/toque. _Proof: browser_
- **D-INPUT-4 · MUST** Arrastes usam Pointer Events, incluindo o cancelamento. _Proof: browser_
- **D-INPUT-5 · MUST** Restrinja `touch-action` à superfície real de arraste e combine-o com um handler de
  verdade; a rolagem comum continua funcionando no resto. _Proof: browser_
- **D-INPUT-6 · SHOULD** Prefira limites relativos ao conteúdo/viewport (`min()`, `max()`, `clamp()`) a
  breakpoints arbitrários.
- **D-INPUT-7 · SHOULD** Use os breakpoints que o anfitrião já tem e só introduza um papel compartilhado
  justificado quando surgirem necessidades repetidas.

Uma posição medida fica desatualizada depois de um redimensionamento, de um refluxo do contêiner ou de uma rolagem.

- **D-INPUT-8 · SHOULD** Teste o redimensionamento até um layout estreito, não só o carregamento nele.
- **D-INPUT-9 · MUST** O posicionamento de uma sobreposição acompanha o gatilho enquanto ela estiver aberta. _Proof: browser_

O anfitrião é dono da mecânica de ciclo de vida; a [engenharia do ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership) é um adaptador de implementação.

- **D-INPUT-10 · SHOULD** Teste gestos reais de ponteiro/toque, a alternativa ao hover e os caminhos de
  teclado onde forem afetados; conferir dois esquemas de cor não comprova paridade de entrada.

## 9. Composição — a página, não o componente

- **D-COMP-1 · SHOULD** Escolha primeiro a estrutura de página do §10; depois componha os componentes dela
  com estas regras.

### Coerência de estilo entre componentes e páginas

- **D-COMP-2 · SHOULD** Antes de implementar, registre um briefing de design curto na nota de tarefa existente
  ou com o responsável pelo design do produto. Use o sistema existente; uma correção pequena só precisa das
  decisões afetadas. O briefing resolve cada decisão aplicável da tabela abaixo (D-COMP-2).

"Premium", "moderno" ou "parecido com o Claude" é uma direção a investigar, não uma especificação implementável.

| Decisão                 | O que o briefing resolve                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tarefa e hierarquia     | O conteúdo real, a ação principal e o primeiro foco de leitura; o que pode recuar ou desaparecer.                                                       |
| Proporção               | Papéis tipográficos/alturas de linha, largura do texto, densidade dos controles, peso dos ícones e espinhas de alinhamento com tokens do anfitrião.     |
| Linguagem de superfície | Quais regiões precisam de contenção, relações de raio/recuo aninhados, papéis semânticos de acento e de elevação.                                       |
| Composição de estados   | Um padrão representativo mais conteúdo longo, pendente/falha e caminhos de entrada estreitos; inclua estados combinados.                                |
| Movimento               | A mudança de estado que ele explica, gatilho e frequência, comportamento de interrupção/reversão e resultado com movimento reduzido; "nenhum" é válido. |
| Decisão de referência   | Onde houver uma referência, o link para a fonte, o princípio adotado e a adaptação que a tarefa do anfitrião exige.                                     |
| Validação               | O resultado observável e as telas/gravações reais capazes de demonstrá-lo ou refutá-lo.                                                                 |

- **D-COMP-4 · SHOULD** Reaproveite o briefing entre componentes irmãos e a moldura da documentação; mude a
  ênfase conforme a tarefa.

Uniformidade não significa controles do mesmo tamanho nem seções encaixotadas em todo lugar.

- **D-COMP-5 · SHOULD** Mantenha uma demonstração expressiva visivelmente distinta da moldura da documentação.
- **D-COMP-6 · SHOULD** Atualize o briefing antes de mudar a direção visual; não reescreva o padrão em silêncio
  para justificar uma implementação reprovada na revisão.
- **D-COMP-7 · SHOULD** Compare um quadro estático composto e representativo com outro conteúdo real antes de
  animá-lo; depois inspecione a mudança de estado e o caminho de volta em velocidade normal.

Uma cor em comum, sozinha, não reconcilia proporções, peso de ícones, contenção ou movimento inconsistentes.

- **D-COMP-8 · SHOULD** Quando um exemplo parecer importado de outro produto, corrija essa relação no
  token/componente/estilo responsável em vez de acrescentar um remendo específico da página.
- **D-COMP-9 · SHOULD** Mantenha observações de referências e limites de validação no
  [índice de pesquisa](./REFERENCE_RESEARCH.md#style-coherence-and-transition-research) opcional.

### Estrutura antes de contêineres

- **D-BOX-1 · SHOULD** **Recorra a espaçamento, alinhamento, peso e uma linha fina antes de uma caixa.**

Um contêiner afirma que o conteúdo dele é um objeto à parte. A maioria das regiões precisa de um fundo, uma
linha fina e espaçamento intencional — nada mais.

- **D-BOX-2 · SHOULD** Reserve a caixa para **um objeto genuinamente separado**: o palco de uma demonstração
  ao vivo, uma sobreposição, um painel que flutua. Não para um bloco de código, uma tabela, uma linha de
  lista, um link de anterior/próximo ou uma célula de galeria.
- **D-BOX-3 · SHOULD** **Evite contêineres aninhados redundantes e preenchimento dobrado.** Um cartão dentro
  de um painel com preenchimento não precisa de outra moldura decorativa nem de outro recuo.
- **D-BOX-4 · SHOULD** Mantenha controles ou superfícies aninhados que sejam funcionalmente necessários e
  coordene os raios deles com o recuo real; conter algo, por si só, não é motivo para acrescentar uma caixa.
- **D-BOX-5 · SHOULD** **Todo limite persistente precisa de uma função própria.** Comece com títulos,
  alinhamento e proximidade para agrupar o conteúdo. Acrescente borda, preenchimento de superfície ou
  elevação só quando essa estrutura deixar um limite real pouco claro.
- **D-BOX-6 · SHOULD** Não repita o mesmo agrupamento com moldura de painel, cartão aninhado, linhas entre
  itens e mais um recuo ao mesmo tempo.

Linhas discretas continuam sendo hierarquia extra; diminuir o contraste delas ou encurtá-las não torna
necessário um cercado redundante.

A tabela abaixo aplica D-BOX-5 e D-BOX-8.

- **D-BOX-8 · MUST** Mantenha os indicadores de foco do teclado e de seleção persistente; nunca os remova para
  deixar o layout em repouso mais quieto. _Proof: browser_

| Limite                       | Mantenha quando ele comunica                                                             | Remova quando ele só repete                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Moldura de campo/controle    | Onde é possível digitar valores ou fazer uma seleção                                     | Um invólucro decorativo em volta de comandos que já são legíveis                              |
| Moldura ou divisor de região | Um viewport independente, um limite de redimensionamento ou uma grande mudança de tarefa | Um título e um espaço que já deixam o mesmo grupo claro                                       |
| Superfície aninhada          | Uma camada flutuante distinta, uma prévia, uma área de soltar ou um limite de interação  | Mais um contêiner dentro de um painel de configurações já estabelecido                        |
| Contorno de foco/seleção     | Foco do teclado ou estado de seleção persistente                                         | Mantenha este indicador de estado mesmo que o layout em repouso parecesse mais quieto sem ele |

- **D-BOX-9 · SHOULD** Revise o painel ou a página inteira, não só o grupo recortado. Para cada contorno,
  preenchimento ou separador estável que restar, nomeie a relação ou a interação que ele comunica e veja o
  que fica ambíguo se ele for removido.

A moldura é opcional; um controle alcançável e reconhecível, não.

### A ênfase é um orçamento

**Cor, peso, selos, preenchimentos e elevação são escassos.** Se tudo é enfatizado,
nada parece importante.

- **D-COMP-10 · SHOULD** Estabeleça a prioridade primeiro com estrutura e proximidade, e gaste a ênfase na
  única coisa que a merece.

**A elevação explica o empilhamento, não a importância.**

- **D-ELEV-3 · SHOULD** Reserve sombras para superfícies que realmente flutuam sobre o conteúdo: popovers,
  menus, diálogos, notificações. Não ponha sombra em todo cartão.

### O espaçamento carrega significado

A escala do §2 não é só um ritmo; cada degrau expressa uma relação.

Escolha o degrau pelo que o espaço _significa_ (D-SPACE-2):

| Relação                        | Espaçamento relativo               |
| ------------------------------ | ---------------------------------- |
| Partes de um mesmo controle    | O menor espaço intencional         |
| Controles muito relacionados   | Espaço de grupo compacto           |
| Um grupo de conteúdo           | Ritmo de grupo                     |
| Grupos separados               | Separação maior                    |
| Limite de uma região principal | A separação intencional mais forte |

**De dentro para fora:** o preenchimento do próprio componente é decidido antes do espaço entre
componentes (D-SPACE-3). **Espaço menor significa relação mais próxima** — é a única coisa que o ritmo
vertical comunica.

- **D-SPACE-6 · SHOULD** Não desfaça a relação expressa por um espaço com um divisor decorativo.

### Ritmo vertical entre telas irmãs

- **D-SPACE-7 · SHOULD** Repita relações, não alturas fixas. Escolha os espaços entre título/descrição,
  campo/dica, grupo e região na escala do anfitrião conforme a relação entre eles.

São decisões de composição, não dimensões universais de componentes.

- **D-SPACE-8 · SHOULD** Deixe as traduções crescerem naturalmente e não reserve uma linha vazia para uma
  descrição que não existe.
- **D-SPACE-9 · SHOULD** Dê a cada espaço um único responsável: a pilha do pai ou uma margem explícita do
  filho. Zere as margens locais de títulos/parágrafos em vez de somá-las ao espaço do pai.
- **D-SPACE-10 · SHOULD** Leve em conta o preenchimento próprio dos controles, o colapso de margens e o espaço
  da linha de base de elementos em linha; não compense com transformações nem com texto menor.
- **D-SPACE-11 · SHOULD** Posicione as dicas junto ao campo/ação que elas explicam.
- **D-SPACE-12 · MUST** Textos de ajuda ocultos não deixam espaço acidental. _Proof: browser_
- **D-SPACE-16 · SHOULD** Uma linha de status assíncrono reservada tem propósito e limites declarados.
  Meça os dois eixos depois que o conteúdo se acomodar; [ACCEPTANCE](./ACCEPTANCE.md) gradua isso como V-PROOF-6.

`next.top - previous.bottom` mede a separação entre molduras, não o espaço de glifos/caixas de linha.

- **D-SPACE-14 · SHOULD** Mantenha entrelinha, preenchimento e linhas finas distintos: 16px de preenchimento
  mais uma linha de 1px não formam um token de espaçamento de 17px.
- **D-SPACE-15 · SHOULD** Use expectativas independentes e teste quebra de linha, redimensionamento,
  visibilidade de ajuda/erro e a densidade relevante.

[ACCEPTANCE](./ACCEPTANCE.md#browser-proof) é dono das verificações de acomodação e de mutação para margens
dobradas, linhas fantasmas e desvios só no texto.

### A largura de leitura rege o texto, não a coluna

- **D-TYPE-4 · SHOULD** **Escolha uma largura de linha legível para o sistema de escrita e a fonte reais.**

Para prosa em alfabeto latino, 60–75 caracteres por linha é uma heurística inicial, não uma faixa universal
para todo sistema de escrita.

- **D-TYPE-5 · SHOULD** Revise texto realista nas larguras, níveis de zoom e fontes de reserva suportados;
  texto CJK e com escritas mistas exige julgamento próprio.

A [apresentação visual da WCAG](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
também trata o CJK à parte no critério de nível AAA; isso não é um padrão obrigatório da biblioteca.

- **D-TYPE-6 · SHOULD** Deixe que tabela, bloco de código, palco de demonstração ou imagem mantenha a largura
  de que o conteúdo precisa. Limite os elementos de texto, não a coluna que os contém.
- **D-TYPE-7 · SHOULD** **Declare a largura de leitura em `rem`, nunca em `em`.**

`em` é resolvido a partir do tamanho de fonte do próprio elemento, então quanto maior o texto, mais longa a
linha — exatamente o contrário do desejado.

- **D-TYPE-8 · SHOULD** **Construa a hierarquia com tipografia antes de recorrer a uma caixa.**

Um degrau a mais de tamanho e um degrau a menos de cor transformam um título e sua primeira frase em título e
linha fina, sem contêiner nem borda novos.

### Se o layout diz que duas coisas são um objeto, o espaçamento precisa concordar

**Uma borda compartilhada, um raio compartilhado e um espaço entre eles são uma contradição.**

- **D-ALIGN-1 · SHOULD** Decida se os elementos são um objeto ou dois e faça toda propriedade dizer a mesma
  coisa.
- **D-ALIGN-2 · SHOULD** **Quando um valor precisa ser igual a outro, dê um nome a ele.** Um espaço que o
  filho precisa subtrair não é um literal em dois lugares; é uma propriedade personalizada referenciada duas vezes.

### Reserve uma coluna só quando houver conteúdo para ela

**Uma coluna declarada incondicionalmente continua sendo uma coluna, mesmo nas páginas que não têm nada
para colocar nela.**

- **D-ALIGN-3 · SHOULD** Condicione a trilha à presença real do elemento (`:has()`), não a um tipo de página
  que você supõe que o implique.

### Alinhamento é estrutura, não acabamento

- **D-ALIGN-4 · SHOULD** **Nomeie cada espinha de alinhamento e a geometria que ela alinha.** Diga quais
  irmãos compartilham cada uma; inclua cabeçalhos, texto do corpo, linhas, ações e conteúdo vazio/carregando/erro.

Uma espinha de conteúdo da página, uma coluna de navegação e uma espinha de rótulos de formulário aninhado
podem ser diferentes de propósito.

- **D-ALIGN-5 · SHOULD** Um botão de voltar mais um espaço pode estabelecer uma coluna de título separada: não
  trate em silêncio esse título como alinhado ao texto do corpo.
- **D-ALIGN-6 · MUST** A ausência de um ícone ou selo opcional nunca tira os rótulos da coluna declarada.
  _Proof: browser_
- **D-ALIGN-7 · SHOULD** Um nível aninhado volta exatamente à espinha do pai quando termina.
  Compare as caixas certas. São medições separadas, mesmo quando por acaso coincidem; medir a camada do
  defeito é graduado em [ACCEPTANCE](./ACCEPTANCE.md) como V-PROOF-10.

| Geometria         | O que medir                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Moldura           | A border box do invólucro/host obtida com `getBoundingClientRect()`                                                                |
| Conteúdo          | A borda interna depois da borda e do preenchimento reais, incluindo invólucros aninhados                                           |
| Texto             | Um `Range` do DOM em volta dos nós de texto do rótulo renderizado; use os retângulos da primeira/última linha quando houver quebra |
| Viewport do ícone | A caixa do SVG/viewbox ou da imagem; a tinta do glifo pode ser assimétrica dentro dela                                             |
| Área de clique    | O alvo real do evento e sua superfície de hover/foco; verifique pontos perto das bordas                                            |

Uma moldura de botão alinhada com um parágrafo não prova que o texto está alinhado: o preenchimento interno
pode mover o rótulo enquanto a moldura fica parada. O `Range` dá a geometria tipográfica, não a tinta exata do glifo.

- **D-ALIGN-9 · SHOULD** Inspecione separadamente as correções ópticas de glifos.
  Em web components, meça o host, as shadow parts documentadas e o texto inserido em slots por meio de pontos
  de teste suportados. V-PROOF-11 em [ACCEPTANCE](./ACCEPTANCE.md) é dono disso, inclusive da proibição de
  consultas ao shadow DOM em produção e de supor que o CSS do documento atravessa essa fronteira.
- **D-ALIGN-11 · SHOULD** **Mantenha a área de clique de um comando de cabeçalho separada do preenchimento do
  layout.** Um gatilho de título/menu abraça o conteúdo mais um preenchimento intencional, limitado pela
  largura disponível. Deixe uma trilha flex/grid separada absorver o espaço restante.
- **D-ALIGN-12 · SHOULD** Defina o truncamento/quebra e o comportamento das ações vizinhas para traduções longas.
- **D-ALIGN-13 · MUST** A área de clique do gatilho de título não se estende pelo espaço livre do cabeçalho
  (por exemplo, via `flex: 1` no botão de título), a menos que D-ALIGN-14 se aplique. _Proof: browser_
- **D-ALIGN-14 · SHOULD** Uma linha que intencionalmente é selecionável em toda a largura tem outro papel;
  registre esse contrato explicitamente.
- **D-ALIGN-15 · MAY** Alvos para ponteiros imprecisos podem ser maiores.
- **D-ALIGN-22 · SHOULD** O preenchimento de hover de um alvo ampliado fica sobre o conteúdo do próprio
  controle, não sobre conteúdo não relacionado.
- **D-ALIGN-16 · SHOULD** **Conte cada recuo do ancestral comum até o texto visível.** O preenchimento do pai,
  o de painéis aninhados, o preenchimento interno de um controle, bordas e colunas de navegação, tudo
  contribui.
- **D-ALIGN-17 · SHOULD** Remova um recuo redundante no responsável por ele em vez de anulá-lo com uma margem
  negativa sem explicação.
- **D-ALIGN-18 · SHOULD** Estados vazios mantêm a espinha de conteúdo e a largura da região; espaço extra para
  respirar nunca cria uma segunda borda esquerda nem faz uma ação compacta ocupar a região inteira.
- **D-ALIGN-19 · SHOULD** Mantenha recuos e tamanhos de alvo específicos do produto como aliases da aplicação,
  não como novos valores de base nem padrões universais de componentes.
- **D-ALIGN-20 · SHOULD** **Quando duas bordas ou espaços do layout devem ser iguais, um pixel de diferença é
  um defeito.** A correção óptica de glifos (D-ALIGN-21) é a única tolerância.
- **D-ALIGN-21 · SHOULD** Trate a correção óptica de um glifo assimétrico como uma decisão separada e
  documentada de asset/componente, reutilizada nos tamanhos suportados, enquanto os espaços entre irmãos, as
  linhas de base e as espinhas continuam exatos.

A correção óptica não é licença para empurrar as margens da página até a captura de tela parecer equilibrada.

### Seleção, links e outras mentiras semânticas

- **D-SEM-1 · MUST** **A seleção é um estado persistente e nunca se parece com hover.** _Proof: browser_

O hover é passageiro; se o item atual é marcado com o mesmo preenchimento do hover, a interface tem dois
nomes para uma mesma aparência.

- **D-SEM-2 · MUST** **Os papéis de ação e de link continuam distinguíveis.** _Proof: browser_
- **D-SEM-3 · SHOULD** Verifique links em linha contra a prosa ao redor, inclusive em temas em que as cores de
  ação e de corpo por acaso coincidem.

**Um link leva para outro lugar; um botão age.**

- **D-SEM-4 · MUST** Tudo o que altera o estado da aplicação é um botão, seja qual for a aparência.
  _Proof: review, browser_
- **D-SEM-5 · SHOULD** Um link com formato de botão não leva sublinhado.

### Hierarquia de comandos em painéis restritos

- **D-CMD-1 · SHOULD** **Remova cercados redundantes de grupos sem apagar a affordance dos controles.**

Títulos, alinhamento e proximidade estabelecem grupos dentro de um painel de configurações; sozinhos, porém,
deixam um ícone e um rótulo sem aparência de clicáveis.

- **D-CMD-2 · SHOULD** Use linhas planas quando um padrão reconhecível de menu/lista já transmite a ação; não
  as exija em todo contexto.
- **D-CMD-3 · SHOULD** Dê a um comando isolado que precise disso uma superfície de botão discreta própria ou um
  contorno funcional, visível antes do hover em todos os temas suportados.
- **D-CMD-4 · SHOULD** Deixe que o formato do próprio botão identifique o alvo; um cartão envolvente, um
  preenchimento de grupo esmaecido e linhas entre itens ainda passam pelo teste de limite com função própria (D-BOX-5).
- **D-CMD-5 · MUST** A descoberta inicial não depende só de hover, cursores de ponteiro, rótulos com verbo ou
  foco do teclado. _Proof: browser_
- **D-CMD-6 · SHOULD** Inspecione o painel inteiro em repouso com o ponteiro afastado, incluindo o uso por toque.
- **D-CMD-7 · MUST** Hover, pressionado, desabilitado e foco do teclado continuam distinguíveis depois que o
  controle é descoberto. _Proof: browser_
- **D-CMD-8 · SHOULD** Quebre rótulos traduzidos longos dentro de uma coluna de comandos em vez de formar uma
  nuvem horizontal irregular de botões.
- **D-CMD-9 · MUST** Não acrescente setas de navegação a comandos imediatos. _Proof: review_
- **D-CMD-10 · SHOULD** Declare quais colunas visíveis são compartilhadas com caixas de seleção ou controles
  vizinhos: meça as bordas de ícones/caixas de seleção e os Ranges de texto, não só os retângulos dos botões ou
  o alinhamento dentro do grupo de comandos.
- **D-CMD-11 · MAY** Um alvo de clique pode avançar sobre uma margem própria para preservar essas colunas; dê
  nome a essa extensão.
- **D-CMD-12 · MUST** Um alvo de clique estendido fica dentro do seu painel, não se sobrepõe a outros alvos e
  mantém o foco visível. _Proof: browser_
- **D-CMD-13 · SHOULD** Separe comandos destrutivos de ações de recuperação e de transferência.
- **D-CMD-14 · SHOULD** Deixe que o rótulo e o ícone de perigo comuniquem a intenção sem um grande contorno
  vermelho em cada comando em repouso; reserve o preenchimento de perigo mais forte para a confirmação explícita.
- **D-CMD-15 · MUST** Comandos destrutivos mantêm confirmação, cancelamento, retorno do foco e proteção contra
  ação durante o processamento. _Proof: browser_
- **D-CMD-16 · SHOULD** Valide um painel de comandos no estado em repouso, não só no estado de hover.

A validação cobre a descoberta em repouso, as colunas compartilhadas declaradas, a hierarquia de limites no
painel inteiro, os limites dos alvos, o corte de rótulos, o contraste e os estados de interação.

- **D-CMD-17 · SHOULD** Inspecione também a renderização real: uma verificação automática de diferença de
  superfície pega preenchimentos de controle invisíveis, mas não prova que as pessoas reconhecem a ação.
- **D-CMD-18 · SHOULD** Reaproveite os papéis de base e os requisitos de alvo para entrada imprecisa; esta
  orientação não altera nenhum padrão de componente.

### Um produto, um conjunto de tokens

- **D-TOKEN-1 · SHOULD** Use os tokens semânticos oficiais do produto. Aliases podem melhorar a legibilidade,
  mas devem ser resolvidos a partir dessa fonte em vez de inventar uma paleta concorrente.
- **D-TOKEN-2 · SHOULD** Coordene componentes de terceiros pelas APIs de tema suportadas e verifique o
  resultado composto.

### A densidade segue os papéis dos controles

Espaçamento, dimensões intrínsecas e alvos de clique resolvem problemas diferentes. Um glifo pequeno pode ter
um alvo de botão nativo maior.

- **D-TOKEN-3 · SHOULD** Meça os limites reais de clique, o foco e os espaços vizinhos.
- **D-TOKEN-4 · SHOULD** Derive aliases repetidos do anfitrião a partir dos tokens de base, não de dimensões de
  uma aplicação copiadas para a biblioteca inteira.
- **D-TOKEN-5 · SHOULD** Escolha os limites dos alvos para o método de entrada real sem aumentar todos os
  glifos nem reservar espaço para controles ocultos. Use as APIs públicas de tema suportadas.
- **D-TOKEN-6 · MUST** Dê nome acessível aos controles que só têm ícone. _Proof: browser_
- **D-TOKEN-7 · SHOULD** Documente as exceções legítimas de geometria de viewport, linhas finas, ilustrações e
  correções ópticas.

### Avalie o acabamento com evidências

O acabamento decorre da clareza da tarefa, não de um pacote pronto de cartões, desfoque ou entradas animadas.

- **D-CRAFT-1 · SHOULD** Escolha uma direção visual deliberada usando objetos, textos e estados realistas; uma
  casca vazia genérica não estabelece a qualidade do produto.

Interfaces de trabalho exigem leitura prolongada e ações frequentes; páginas de marketing podem pedir outra
composição.

- **D-CRAFT-2 · SHOULD** Avalie a menor intervenção contra conteúdo, idioma, dispositivo e uso repetido reais.

As referências primárias respondem a perguntas específicas:
[hierarquia do Linear](https://linear.app/now/behind-the-latest-design-refresh),
[tipografia do Geist](https://vercel.com/geist/typography),
[alinhamento óptico](https://craft.gustavofior.com/optical-alignment) e
[interrompibilidade](https://craft.gustavofior.com/interruptibility).

- **D-CRAFT-3 · SHOULD** Adapte os princípios delas aos tokens e às capacidades reais do anfitrião; não copie
  os tamanhos em pixels de um produto nem importe receitas como regras.
- **D-CRAFT-4 · SHOULD** Trate referências como insumos para decisões, não como conjuntos adicionais de
  instruções; por exemplo, [Don't Make Me Think](https://sensible.com/dont-make-me-think/) orienta a leitura
  rápida, a hierarquia e escolhas claras.

[taste-skill](https://github.com/leonxlnx/taste-skill) orienta a direção deliberada e a crítica;
[ryugi](https://github.com/Innei/ryugi) orienta o trabalho executável e as evidências recentes.

- **D-CRAFT-5 · SHOULD** Uma preferência de estilo precisa de contexto; um requisito identifica a tarefa ou o
  contrato observável que ele protege.
- **D-CRAFT-6 · SHOULD** Escolha referências pelo trabalho que elas apoiam: identidade de logo/aplicativo,
  composição de marketing e interações de trabalho frequentes resolvem problemas diferentes.
- **D-CRAFT-7 · SHOULD** Registre o padrão observado e a adaptação feita; verifique o resultado com conteúdo
  real.

O [índice de pesquisa](./REFERENCE_RESEARCH.md) opcional relaciona fontes a perguntas e demonstra essa
tradução sem acrescentar outro conjunto de regras.

- **D-CRAFT-8 · SHOULD** Quando a direção não estiver definida, compare duas variantes pequenas no anfitrião
  real, com o mesmo conteúdo, largura e tema, mudando uma dimensão por vez. Explique o que cada diferença faz
  pela tarefa.

Uma direção clara ou uma correção pequena seguem direto; não há ritual de aprovação obrigatório.

- **D-CRAFT-9 · SHOULD** Equilibre títulos curtos de forma progressiva com `text-wrap: balance`, preservando a
  quebra normal.
- **D-CRAFT-10 · MUST** Títulos não têm quebras de linha manuais que dependam do idioma e não são cortados
  para preservar uma captura de tela. _Proof: browser_
- **D-CRAFT-11 · SHOULD** Verifique custo e suporte antes de usar `pretty` em conteúdo dinâmico longo.
- **D-CRAFT-12 · SHOULD** Use algarismos tabulares para estabilizar a largura dos dígitos, se a fonte os oferecer.
- **D-CRAFT-13 · SHOULD** Reserve uma coluna adequada para mudanças na quantidade de dígitos, como 99 → 100.
- **D-CRAFT-14 · MUST** Uma mudança na quantidade de dígitos nunca trunca o valor. _Proof: browser_
- **D-CRAFT-15 · SHOULD** Corrija glifos assimétricos num asset/componente reutilizável, preservando as
  espinhas exatas do layout.
- **D-CRAFT-16 · SHOULD** Derive a geometria de cantos aninhados a partir do recuo real; antes, remova
  qualquer superfície aninhada desnecessária.
- **D-CRAFT-17 · SHOULD** Dê uma função ao movimento: feedback imediato para o que é frequente, transições
  interrompíveis, movimento reduzido e troca instantânea de tema. Veja o §5.
- **D-CRAFT-18 · MUST** Um encanto opcional nunca atrasa a digitação nem esconde o status. _Proof: recording_
- **D-CRAFT-19 · SHOULD** Pause a decoração fora da tela e meça o desempenho com conteúdo realista antes de
  adotar efeitos custosos.

### As palavras fazem parte da interface

- **D-COPY-6 · SHOULD** Evite rótulos e descrições secundários desnecessários. Deixe o layout explicar.
- **D-COPY-7 · SHOULD** Um título, um agrupamento, a proximidade ou um controle óbvio não precisam de outra
  frase repetindo o propósito deles.
- **D-COPY-8 · SHOULD** Remova o texto que não traz nenhuma decisão, restrição ou consequência nova; não o
  substitua por um selo ou tooltip decorativo.
- **D-COPY-9 · MUST** Preserve nomes acessíveis, rótulos de campo, unidades, erros e avisos de risco.
  _Proof: browser_
- **D-COPY-10 · SHOULD** Preserve as orientações úteis para o primeiro uso e teste se a tarefa continua
  compreensível.
- **D-COPY-11 · SHOULD** Deixe o contexto dar o contexto: `Users` em vez de `User Management`; não repita no
  corpo de um diálogo a pergunta que ele já faz.
- **D-COPY-12 · SHOULD** Nomeie resultados (`Save`, `Move`, `Delete`), não gestos (`Click to save`). Inclua o
  objeto só quando o contexto não o deixar claro.
- **D-COPY-13 · MUST** `Cancel` sai sem confirmar nada. _Proof: browser_
- **D-COPY-14 · SHOULD** Use maiúscula só no início da frase, sem ponto final em rótulos curtos e com ponto
  final em frases explicativas.
- **D-COPY-15 · SHOULD** Use um único `…` quando uma ação precisar de mais informações antes de ser concluída;
  reserve TUDO EM MAIÚSCULAS para status curtos, sobretítulos e siglas.

### Lista de revisão de uma superfície composta

- **D-REVIEW-1 · SHOULD** Aplique estas perguntas à superfície afetada e aos estados alcançáveis que mudaram.
  Ignore variantes irrelevantes; um remendo pequeno não exige redesenhar páginas não relacionadas. Um "não"
  dentro do escopo é um achado.

1. Quem chega pela primeira vez reconhece o propósito e a ação principal sem adivinhar?
2. O rótulo, o estado e o resultado de cada controle descrevem um único desfecho coerente?
3. A ênfase é escassa — o essencial recebe o peso enquanto cor, selos e botões primários continuam raros?
4. Dá para fazer menos: algum ponto de entrada, opção ou estado pode sair sem enfraquecer a tarefa?
5. As espinhas nomeadas estão exatas na camada visível de texto/conteúdo, inclusive em estados aninhados e vazios, com colunas de navegação intencionais e sem preenchimento dobrado?
6. Controles vizinhos compartilham as colunas de ícone/texto declaradas?
7. As áreas de clique dos títulos abraçam o conteúdo?
8. As relações verticais repetidas usam espaços consistentes com um único responsável, inclusive com texto quebrado e conteúdo de ajuda/erro oculto?
9. O texto corrido é confortável nos sistemas de escrita, fontes e níveis de zoom reais, e tudo o que **não** é texto corrido está livre desse limite de largura?
10. Todo elemento que parece parte de um objeto concorda — borda, raio **e** espaçamento — e toda coluna reservada tem de fato conteúdo? Cada moldura, preenchimento ou divisor persistente comunica um limite próprio em vez de aninhar de novo o mesmo grupo?
11. Ela se sustenta nos estados alterados relevantes: vazio, carregando, falha, traduções longas, largura estreita, temas suportados, movimento reduzido e **RTL**, onde forem afetados?
12. Em mudanças de layout ou de interação, a superfície afetada foi conferida num navegador real nas larguras e temas relevantes? As ações isoladas são reconhecíveis antes do hover, inclusive no uso por toque, sem cercados redundantes de grupos?

Uma captura de tela do caminho feliz não prova comportamento de teclado, foco, conteúdo dinâmico,
redimensionamento nem recuperação de falhas.

- **D-REVIEW-2 · SHOULD** Siga [ACCEPTANCE](./ACCEPTANCE.md) para expectativas independentes, identidade real
  do runtime/captura, medições no navegador e resultados separados de automação, agente e pessoas.

O [exemplo de navegador](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md),
disponível só no código-fonte, traz comandos de configuração e detalhes de utilitários de teste; eles não são
APIs públicas do pacote.

## 10. Arquitetura da informação — a forma antes da composição

- **D-IA-1 · SHOULD** Escolha a estrutura antes da composição em consoles, dashboards e bancadas de trabalho
  densos em informação.

Dados completos de uma API não são um design de página: quem lê ainda precisa de uma ordem clara para
entender os objetos, o estado e as relações deles, e então agir.

- **D-IA-2 · SHOULD** Dê a páginas de conversão única e landing pages uma estrutura de tarefa própria em vez
  de um modelo de console denso.

### Responda a três perguntas antes de nomear um componente

- **D-IA-3 · SHOULD** Tenha as três respostas antes de escolher componentes.

1. **O que a pessoa precisa ver ao chegar?** Essa é a informação principal.
2. **O que mais precisa estar visível para que isso faça sentido?** Recursos relacionados, modelos relacionados, contexto.
3. **O que ela faz em seguida?** Julga, age ou continua pensando.

- **D-IA-4 · SHOULD** **Uma página tem exatamente um modelo principal.** Modelos de apoio podem ajudar a
  entendê-lo ou operá-lo; não podem disputar a primeira tela.
- **D-IA-5 · SHOULD** Prefira uma próxima escolha clara e sem ambiguidade a um limite arbitrário de cliques.
  Teste se as pessoas reconhecem a próxima ação, não apenas se o destino é alcançável.

### A forma segue a tarefa, não os dados recebidos

- **D-IA-6 · SHOULD** Escolha um esqueleto a partir da pergunta de quem lê, não de um array da API ou de um ID
  de rota, usando a tabela abaixo.

| Tarefa                                               | Forma útil                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Comparar valores/diferenças                          | Tabela ou diff                                                   |
| Reconhecer/abrir um recurso                          | Lista; grade de imagens só quando as imagens o identificam       |
| Entender o estado atual de um objeto                 | Detalhe dividido em seções                                       |
| Entender posse/dependências                          | Árvore ou lista de adjacência; grafo só quando o caminho importa |
| Planejar o próximo passo / mover trabalho por etapas | Fluxo de etapas / kanban quando mover é o próprio trabalho       |
| Auditar o que aconteceu, quando e por quem           | Linha do tempo ou detalhamento de rastreamento                   |
| Discutir ou ler texto contínuo                       | Conversa ou documento                                            |
| Avaliar saúde, tendências ou anomalias               | Painel de status ou dashboard                                    |
| Encontrar ocupação/conflitos ou localização          | Calendário ou mapa/canvas                                        |
| Trabalhar no próximo item / alterar regras           | Bancada mestre-detalhe / formulário de configuração              |

- **D-IA-7 · SHOULD** Não confunda eventos históricos com passos futuros, um filtro com kanban, ou prosa
  ordenada com uma grade de campos. Uma data, sozinha, não justifica um calendário.
- **D-IA-8 · SHOULD** Ofereça várias visualizações só quando cada uma atender a uma tarefa distinta que
  compense manter seus filtros, estados e ações.

### Cada tipo de informação tem seu lugar

- **D-IA-9 · SHOULD** Comece pela identidade e pelo status na região de título ou resumo, e mantenha ações,
  feedback e evidências ao lado do assunto deles, como mostra a tabela abaixo.

| Informação | Lugar certo                                                      | Lugar errado                         |
| ---------- | ---------------------------------------------------------------- | ------------------------------------ |
| Identidade | Título, resumo do objeto                                         | A última coluna, ou atrás de uma aba |
| Status     | Região de título ou de resumo                                    | Só encontrável num campo de detalhe  |
| Atributos  | Corpo do detalhe, agrupado como as pessoas pensam                | Achatado na ordem dos campos da API  |
| Relações   | Região ou aba própria; posse, dependência e referência distintas | Misturado à tabela de atributos      |
| Alterações | Região de diff, linha do tempo                                   | Mostrado só como o valor novo        |
| Evidências | Ao lado do julgamento, expansível                                | Uma página de log em outro lugar     |
| Ações      | A principal na região de título, as demais ao lado do objeto     | Enterradas em "mais"                 |
| Feedback   | Ao lado da ação, mantendo o contexto da tarefa                   | Um toast global solto do seu assunto |

- **D-IA-10 · SHOULD** **Cada fato tem exatamente um lugar oficial.** Nos outros lugares aparece um resumo ou
  um ponto de entrada com link de volta para ele.
- **D-IA-11 · SHOULD** Siga a ordem de leitura padrão: identidade da página → status atual ou exceção →
  tarefa principal e ação principal → a informação de que o julgamento precisa → relações, alterações,
  evidências → informação secundária e ações pouco frequentes.
- **D-IA-12 · SHOULD** **Uma ação principal por região de tarefa**, e ela é o próximo passo mais provável, não
  o mais destrutivo (o §9, "A ênfase é um orçamento", define quanto peso ela pode ter).

### Densidade é informação útil, não controles por centímetro

Apertar o espaçamento aumenta a densidade visual e deixa a densidade efetiva onde estava. Remover campos
irrelevantes e reunir a comparação num só lugar aumenta a densidade de verdade.

- **D-IA-13 · SHOULD** **Use no máximo dois níveis de densidade vizinhos numa página**: espaçoso para o
  primeiro uso e confirmações arriscadas, padrão para a maioria das listas e detalhes, compacto para bancadas
  de especialistas.
- **D-IA-14 · MAY** O preenchimento de contêineres e a altura de linha podem diminuir.
- **D-IA-15 · MUST** Texto de corpo legível, anel de foco visível e tamanho do alvo de ponteiro não diminuem
  com a densidade (§7, §8). _Proof: browser_

### Contêineres não consertam a estrutura

- **D-IA-16 · SHOULD** **Um único retorno contextual por tela.** Não mostre juntos um “Voltar ao chat” externo
  e um “Voltar aos artefatos” interno.
- **D-IA-17 · SHOULD** A tela de detalhe volta ao pai imediato.
- **D-IA-18 · MUST** Os ancestrais continuam alcançáveis pela hierarquia de rotas ou por breadcrumbs com
  nomes claros. _Proof: browser_
- **D-IA-19 · SHOULD** Verifique o percurso completo, incluindo o retorno do foco e nomes de destino longos
  traduzidos.
- **D-IA-27 · MUST** Voltar ao pai devolve o foco ao item de origem. _Proof: browser_
- **D-IA-20 · MUST** Se o texto não couber, reorganize-o ou use um destino mais curto e com sentido; reticências
  ou tooltip nunca escondem a única indicação de destino. _Proof: browser_
- **D-IA-21 · SHOULD** Escolha uma única composição para o contexto do pai. Não acrescente um breadcrumb só
  para renomear um atalho de retorno redundante, nem repita esse pai como um item inerte acima do comando de
  retorno.

Quando voltar pelo pai já leva ao ancestral, esse percurso preserva o acesso sem acrescentar mais uma linha
ao cabeçalho do detalhe.

- **D-IA-22 · SHOULD** Use breadcrumbs quando a própria hierarquia ajudar na tarefa.

**Um modal não é uma camada de navegação.**

- **D-IA-23 · SHOULD** Dê uma rota a tudo o que precise de link copiável, histórico, comparação lado a lado
  ou trabalho que sobreviva a uma atualização da página.
- **D-IA-24 · SHOULD** Reserve o modal para uma confirmação curta ou um único campo, o popover ou menu para
  contexto passageiro e a linha de divulgação para a divulgação progressiva.
- **D-IA-25 · SHOULD** **Abas carregam visualizações equivalentes de um mesmo objeto** — a conversa dele, as
  verificações, o diff —, nunca módulos não relacionados; isso é trabalho da navegação.
- **D-IA-26 · SHOULD** Se a biblioteca escolhida não tiver uma primitiva adequada, use elementos semânticos
  existentes e tokens do anfitrião; verifique a interação exigida em vez de inventar APIs sem suporte.

## Lista de verificação (antes de publicar a UI)

- **D-VERIFY-1 · SHOULD** Escolha as verificações pela superfície afetada, pelas variantes suportadas e pelo
  comportamento alterado; não crie fluxos não relacionados só para cumprir a lista.

O CI do repositório continua rodando todos os seus gates.

- **D-VERIFY-2 · SHOULD** A tarefa principal e a ação principal são inconfundíveis.

Mudanças de layout/tema afetadas funcionam nas larguras **estreitas e largas** relevantes e nos temas suportados (D-INPUT-1).
Mouse e toque funcionam: arrastes usam Pointer Events e todo `trigger="hover"` tem uma alternativa por toque (D-INPUT-3,
D-INPUT-4). Teclado e foco visível são cobertos por D-ACCESS-3 e D-ACCESS-4.

- **D-VERIFY-5 · SHOULD** Teste todos os **estados** alterados (hover, ativo, foco, desabilitado, carregando,
  vazio, erro).
- **D-VERIFY-7 · SHOULD** Cubra os casos-limite relevantes: texto longo, números grandes e os sistemas de
  escrita/idiomas suportados pelo anfitrião.
- **D-VERIFY-8 · SHOULD** O espaçamento vem da escala; a tipografia usa um papel; a cor usa tokens semânticos.
- **D-VERIFY-9 · SHOULD** Rode as verificações aplicáveis do anfitrião e inspecione evidências reais no navegador.
- **D-VERIFY-10 · SHOULD** O texto segue o §6.

Sinais de estado só por cor são cobertos por D-ACCESS-2.

- **D-VERIFY-12 · SHOULD** Numa superfície densa: um modelo principal, o esqueleto escolhido pela pergunta e
  não pelos dados recebidos, e cada fato com um único lugar oficial (§10).
