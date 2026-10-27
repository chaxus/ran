<!-- source: 28f660782f4b364a2424b4125d8920431adf8bac -->

# Validação de UI — evidências e decisões

Use este contrato quando um resultado visual ou de interação mudar. O [DESIGN](./DESIGN.md) é dono da
aparência e da composição; o [INTERACTION](./INTERACTION.md), do comportamento observável.
O [índice de interface](./INTERFACE_GUIDE.md) encaminha a tarefa. Leia só as seções aplicáveis.

Cada regra tem um ID e um nível. **MUST** é um defeito quando descumprida e indica a prova exigida;
**SHOULD** é o padrão, e quem se desvia dele declara o motivo naquele caso; **MAY** é opcional.
O [índice de regras](./RULES.md) lista todas as regras graduadas com suas provas.

## Combine o resultado observável

- **V-AGREE-1 · SHOULD** Antes de editar, feche o
  [briefing de design](./DESIGN.md#style-coherence-across-components-and-pages) e registre na mesma nota a
  tarefa, as telas/estados afetados e as expectativas independentes.
- **V-AGREE-2 · SHOULD** Nomeie o responsável relevante, a API pública suportada e os limites de capacidade do
  anfitrião.
- **V-AGREE-3 · SHOULD** Escolha larguras, temas, idiomas e caminhos de entrada a partir da mudança real, sem
  inventar trabalho não relacionado.
- **V-AGREE-4 · SHOULD** Na composição, declare as espinhas de conteúdo/texto/ícone, as colunas de navegação
  intencionais, os limites de clique e as relações verticais.
- **V-AGREE-5 · MUST** Não derive o valor esperado da implementação que está sendo testada.
  _Proof: review_
- **V-AGREE-6 · SHOULD** Revise nesta ordem: tarefa/hierarquia, composição estática, estados combinados
  alcançáveis e, por fim, movimento.
- **V-AGREE-7 · SHOULD** Não acrescente animação para compensar proporções não resolvidas ou uma navegação
  confusa.
- **V-AGREE-8 · SHOULD** Quando uma revisão mudar o design pretendido, atualize primeiro o briefing existente e
  identifique a evidência que motivou a mudança.

Isto é um registro de decisões, não uma nova cerimônia de aprovação para um trabalho que a pessoa já autorizou.

Uma verificação de API/token confirma contratos do código-fonte; uma comparação de imagens confirma pixels; uma
execução de agente confirma se a orientação foi seguida.

- **V-AGREE-9 · SHOULD** Mantenha um único responsável por cada regra.
- **V-AGREE-10 · MUST** Não deixe um tipo de verificação substituir outro: uma verificação de API/token, uma
  comparação de imagens e uma execução de agente estabelecem, cada uma, só o próprio resultado. _Proof: review_
- **V-AGREE-11 · MUST** Uma fixture demonstra o próprio resultado, não a validação de uma aplicação anfitriã
  que ela não renderizou; não a apresente como validação do anfitrião. _Proof: review_

## Prova no navegador

- **V-PROOF-1 · MUST** Ao reproduzir um defeito visível, capture a superfície real em execução antes da
  correção. _Proof: browser_
- **V-PROOF-2 · MUST** Depois da correção, capture o mesmo estado relevante e inspecione o painel inteiro com
  textos realistas e a interface ao redor. _Proof: browser_
- **V-PROOF-3 · MUST** Não ofereça como prova uma maquete, um diff do código, uma asserção alterada ou a captura
  de tela de um build não relacionado. _Proof: review_
- **V-PROOF-4 · SHOULD** Inspecione a composição, e não só a contagem de links: renomear um retorno redundante
  como breadcrumb ainda pode repetir o mesmo contexto e acrescentar uma linha desnecessária ao cabeçalho.
- **V-PROOF-5 · SHOULD** Siga o caminho até os ancestrais passando pelo pai antes de decidir que é preciso mais
  um atalho visível.
- **V-PROOF-6 · MUST** Espere o registro dos componentes, o conteúdo pendente, as fontes e os quadros
  renderizados antes de medir. _Proof: browser_
- **V-PROOF-7 · MUST** Falhe quando um alvo estiver ausente ou tiver tamanho zero. _Proof: browser_
- **V-PROOF-8 · MUST** Registre qualquer tolerância de subpixel e mantenha-a abaixo de um pixel CSS inteiro para
  espinhas exatas (o exemplo do código-fonte usa 0,5px). _Proof: review_
- **V-PROOF-9 · MUST** Em sobreposições ao vivo, verifique se a captura preserva o viewport e inclui o
  gatilho/painel inteiro; uma captura de página inteira pode invalidar um recorte ao provocar refluxo
  responsivo ou reposicionamento de portal. _Proof: browser_
- **V-PROOF-10 · MUST** Meça a camada do defeito: invólucro, conteúdo interno, `Range` do texto renderizado,
  viewport do ícone e alvo real do ponteiro são coisas diferentes. Um `Range` não é a tinta exata do glifo.
  _Proof: browser_
- **V-PROOF-11 · MUST** Trate as shadow parts por meio de pontos de teste suportados; não introduza consultas ao
  shadow DOM em produção para a validação. _Proof: review_
- **V-PROOF-12 · SHOULD** Teste o refluxo afetado, traduções que quebram linha, conteúdo opcional e caminhos de
  entrada.
- **V-PROOF-13 · MUST** Não use uma captura de tela estática como prova de retorno do foco, navegação por
  teclado, descoberta por toque, interrompibilidade ou conclusão assíncrona. _Proof: review_
- **V-PROOF-14 · MUST** Grave uma interação contínua quando o defeito se desenrolar ao longo do tempo.
  _Proof: recording_
- **V-PROOF-15 · MUST** Para uma asserção de layout, prove que ela rejeita o defeito relevante: mova só o texto
  do rótulo enquanto a moldura fica parada, introduza uma margem dobrada ou um texto de ajuda fantasma, ou
  amplie o alvo de um título até o espaço de preenchimento. _Proof: browser_
- **V-PROOF-16 · MUST** Confirme que a mutação venceu a cascata, observe a falha, restaure e observe o sucesso.
  _Proof: browser_
- **V-PROOF-17 · SHOULD** Use mutações relevantes para a tarefa em vez de repetir toda a suíte de exemplo por
  causa de uma correção minúscula.
- **V-PROOF-18 · MUST** Verifique os dados brutos quando mudar a apresentação. _Proof: browser, unit_
- **V-PROOF-19 · MUST** Em código, copie o conteúdo de origem, não o texto do DOM destacado: preserve
  tabulações, linhas em branco, a quebra de linha final e os acréscimos transmitidos. _Proof: unit_
- **V-PROOF-20 · MUST** Verifique de forma independente o sucesso/falha da área de transferência, a seleção
  nativa e a rolagem de linhas longas. _Proof: browser_
- **V-PROOF-21 · MUST** Documente a normalização da seleção feita pelo navegador sem deixar que ela altere o
  conteúdo bruto da área de transferência. _Proof: unit, review_

O [exemplo de layout](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md),
disponível só no código-fonte, traz comandos executáveis e utilitários de geometria. Os consumidores adaptam as
relações dele ao próprio anfitrião; esses helpers não são novas exportações do ranui.

- **V-PROOF-22 · MUST** Não afirme suporte ao zoom nativo do navegador ou à acessibilidade de tamanho de texto a
  partir de um teste de estresse com `zoom` do CSS. _Proof: review_
- **V-PROOF-23 · MUST** Diga quais caminhos continuam sem verificação. _Proof: review_

### Revise o movimento ao longo do tempo

- **V-MOTION-1 · MUST** Quando o movimento mudar, inspecione uma ação contínua em velocidade normal e depois
  reproduza em câmera lenta onde uma transição falhar. _Proof: recording_
- **V-MOTION-2 · MUST** Inclua ativação, estado intermediário, conclusão e o caminho inverso; repita ou inverta a
  entrada antes da conclusão. _Proof: recording_
- **V-MOTION-3 · MUST** Verifique o estado final, o foco, a contagem de eventos e a posição de leitura
  independentemente da animação. _Proof: browser_
- **V-MOTION-4 · MUST** Use a reprodução lenta para diagnosticar descontinuidades, não como benchmark de taxa de
  quadros. _Proof: review_
- **V-MOTION-5 · MUST** Dê ao movimento reduzido uma verificação própria do estado visível, não só uma gravação
  mais curta. _Proof: browser_
- **V-MOTION-6 · SHOULD** Relate um defeito temporal como
  `element → input → observed frame/state → expected continuity`.
- **V-MOTION-7 · SHOULD** Use uma única tarefa real e representativa entre os irmãos afetados para detectar uma
  linguagem de movimento inconsistente.
- **V-MOTION-8 · SHOULD** Confira de novo a composição inteira depois de correções locais.
- **V-MOTION-9 · SHOULD** Guarde as iterações que falharam como diagnóstico, separadas das capturas aceitas.

Estas verificações complementam o vínculo de evidências descrito abaixo.

## Percorra a tarefa

- **V-WALK-1 · SHOULD** Para um fluxo de trabalho ou composição alterados, comece com um objetivo realista,
  descrito sem nomear o controle a ser usado.
- **V-WALK-2 · SHOULD** Cumpra o objetivo a partir do ponto de entrada real até o resultado, a recuperação e a
  volta, conforme o caso.
- **V-WALK-3 · SHOULD** Registre a primeira escolha, qualquer rótulo ambíguo, hesitação ou retrocesso e se o
  resultado deixa claro o próximo passo.

Um caminho com menos cliques não ajuda se as escolhas não estiverem claras.

- **V-WALK-4 · SHOULD** Use conteúdo realista, incluindo um caso longo ou de falha representativo, e não apenas
  um estado vazio bem-acabado.
- **V-WALK-5 · SHOULD** Corrija a estrutura da tarefa e a hierarquia do conteúdo antes de acrescentar efeitos
  decorativos.
- **V-WALK-6 · SHOULD** Relate os problemas observados de maior consequência (até três), com o estado e a
  evidência que mostram cada um.
- **V-WALK-7 · MUST** Não invente achados para cumprir uma cota. _Proof: review_
- **V-WALK-8 · SHOULD** Repita o caminho afetado depois da correção.
- **V-WALK-9 · MUST** Relate um percurso feito por agente como uma busca de defeitos, não como um estudo de
  usabilidade com pessoas. _Proof: review_
- **V-WALK-10 · SHOULD** Ao observar um participante real, deixe-o tentar cumprir o objetivo antes de explicar a
  interface e preserve essa distinção nos resultados abaixo.

## Vincule as evidências ao que de fato rodou

Cada estado revisado recebe um registro compacto com estes campos:

- **V-FRESH-1 · MUST** Runtime: registre a revisão do código/build testada e as entradas modificadas
  relevantes ou a impressão digital delas, incluindo estilos/componentes compartilhados e dados recebidos
  quando afetarem o resultado. Só o HEAD do Git não basta se o build em execução ou a árvore de trabalho forem
  diferentes. _Proof: review_
- **V-FRESH-2 · MUST** Escopo/ambiente: registre a tela afetada/os membros do grupo, a rota/estado, o viewport,
  o tema, o idioma, o navegador e as configurações de entrada ou de movimento reduzido, quando relevantes.
  _Proof: review_
- **V-FRESH-3 · MUST** Mídia: registre os locais das capturas/gravações e a identidade do conteúdo (por exemplo,
  SHA-256), vinculados a esse runtime e estado. _Proof: review_
- **V-FRESH-4 · MUST** Mantenha o antes e o depois separados; nunca sobrescreva a única imagem do antes.
  _Proof: review_
- **V-FRESH-5 · MUST** Revisão: registre o que a verificação automática e a inspeção do agente de fato
  estabeleceram, separado de qualquer decisão humana e de qualquer estado não verificado. _Proof: review_
- **V-FRESH-6 · MAY** Use um registro curto em Markdown; um manifesto existente pode fornecer esses campos.
- **V-FRESH-7 · SHOULD** Não acrescente um novo serviço de evidências nem um framework de configuração para uma
  mudança comum.
- **V-FRESH-8 · MUST** Mantenha os hashes ao lado dos arquivos ou num manifesto referenciado, para que o vínculo
  declarado possa ser conferido de forma independente. _Proof: review_

**Uma revisão vale só para as evidências e o escopo de runtime que inspecionou.**

- **V-FRESH-9 · MUST** Considere obsoleta a revisão afetada depois de substituir uma imagem, editar uma gravação,
  mudar os membros de um grupo ou alterar entradas de runtime relevantes. _Proof: review_
- **V-FRESH-10 · MUST** Depois de mudar um estilo/componente compartilhado, atualize todos os estados afetados,
  refaça o build se preciso e então inspecione as novas evidências. _Proof: browser, review_
- **V-FRESH-11 · MUST** Não apresente nenhuma captura antiga como prova atual. _Proof: review_
- **V-FRESH-12 · MUST** Ao manter evidências de runtime após uma edição só de documentação ou uma mudança de
  código não relacionada, registre por que o escopo de dependências dela não foi afetado. _Proof: review_

Capturas antigas podem ficar como histórico. Uma edição só de documentação ou uma mudança de código não
relacionada mantém válidas as evidências de runtime idênticas, então recapturar tudo só porque o HEAD mudou é
desnecessário.

## Relate a autoridade com veracidade

| Resultado                | Quem/o que pode estabelecê-lo                                                             | O que ele não estabelece                   |
| ------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| Verificações automáticas | Saída recente de comandos ou asserções no navegador para o runtime declarado              | Qualidade visual ou uma decisão humana     |
| Revisão visual do agente | O agente inspecionou as capturas atuais e a interação afetada                             | A aceitação pelo usuário                   |
| Decisão humana           | A decisão de um usuário real, com a referência da mensagem/ação e o escopo das evidências | A aceitação de evidências alteradas depois |

- **V-REPORT-1 · MUST** Mantenha esses três resultados separados, mesmo num relatório de um parágrafo.
  _Proof: review_
- **V-REPORT-2 · MUST** Afirme cada resultado só a partir da fonte que a tabela acima indica, e nunca para o que
  a tabela diz que ele não estabelece. _Proof: review_
- **V-REPORT-3 · SHOULD** Use desfechos explícitos como `automated: passed`,
  `agent review: passed with limits`, `human: not requested`.
- **V-REPORT-4 · MUST** Se a revisão humana foi pedida e ainda não saiu, diga `pending`.
  _Proof: review_
- **V-REPORT-5 · MUST** Se um usuário rejeitou, mantenha `rejected` e o achado até que esse usuário revise o
  escopo atualizado. _Proof: review_
- **V-REPORT-6 · MUST** Um agente pode relatar a correção que fez e as verificações recentes, mas nunca inventa
  a decisão de um usuário nem anula uma rejeição humana. _Proof: review_
- **V-REPORT-7 · MUST** Evite um“aceito”, “aprovado”ou“验收通过”sem atribuição. _Proof: review_

A autorização do usuário controla se é possível fazer push, atualizar um PR ou tomar outra ação externa.
Este documento não acrescenta nenhuma etapa geral de aprovação humana.

- **V-REPORT-8 · SHOULD** Conclua e entregue o trabalho autorizado relatando com veracidade
  `not requested`/`pending`.
- **V-REPORT-9 · SHOULD** Pergunte só quando faltar a autorização de fato ou uma decisão de produto necessária.
- **V-REPORT-10 · MUST** Nunca rotule a verificação visual do próprio agente como “aceito pelo usuário”. _Proof: review_

Uma nota de entrega mínima pode ser:

> Runtime e escopo: build/código …; estado/ambiente …; impressão digital das entradas relevantes …
> Evidências: antes/depois/interação …; identidades registradas em …
> Automático: comandos/resultados …
> Revisão do agente: desfecho observado, achado ou limite restante …
> Decisão humana: não solicitada / pendente / decisão real e referência …
> Não verificado: …; PR/atualização autorizados: …

## Regressão das próprias orientações

Controles determinísticos verificam o avaliador sem chamadas de modelo; execuções ao vivo exigem um harness de
agente disponível e não são uma etapa obrigatória para cada edição de texto.

- **V-EVAL-1 · SHOULD** Para uma avaliação ao vivo opcional ou autorizada pela tarefa de mudanças em skills,
  roteamento ou validação, use os
  [seis cenários de agente](https://github.com/chaxus/ran/tree/main/plugins/ran/evals), disponíveis só no
  código-fonte.
- **V-EVAL-2 · MUST** Congele tarefas, fixtures, ferramentas e rubricas independentes antes das execuções ao vivo.
  _Proof: review_
- **V-EVAL-3 · MUST** Use sessões novas com modelo/configurações equivalentes. _Proof: review_
- **V-EVAL-4 · MUST** Fixe as orientações de base e as candidatas em workspaces separados. _Proof: review_
- **V-EVAL-5 · MUST** Guarde o trabalho real do agente, os prompts, as verificações de resultado e as
  evidências. _Proof: review_
- **V-EVAL-6 · MUST** Registre os acertos da base como controles e as falhas da candidata como falhas.
  _Proof: review_
- **V-EVAL-7 · MUST** Não mostre aos executores os limiares do avaliador nem os patches de correção.
  _Proof: review_

Verificações de rejeição/restauração com defeitos plantados estabelecem a sensibilidade do avaliador.

- **V-EVAL-8 · MUST** Afirme comportamento nessas tarefas só a partir de execuções ao vivo de agentes;
  correspondência de texto, respostas escritas à mão ou expectativas de teste corrigidas não são evidência
  disso. _Proof: review_
- **V-EVAL-9 · MUST** Inspecione o julgamento visual independentemente das verificações mecânicas. _Proof: review_
- **V-EVAL-10 · MUST** Relate o tamanho da amostra, as ferramentas e as condições não cobertas. _Proof: review_
- **V-EVAL-11 · MUST** Seis tarefas bem-sucedidas não provam confiabilidade entre modelos; não afirme isso com
  base nelas. _Proof: review_
