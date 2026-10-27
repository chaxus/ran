<!-- source: 2546d093271a44411b5a6a28a982efbdc0c4a805 -->

# Padrão de interação

Este arquivo é dono do **comportamento observável**, independentemente do domínio ou do tratamento visual da tela.
[DESIGN.md](./DESIGN.md) é dono da aparência; o anfitrião, da implementação. Para quem contribui com o ranui,
o [CODING.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md) fornece o adaptador de engenharia.
Use o [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md) só para uma tarefa de várias etapas em que ele se aplique.
Estas regras gerais não pressupõem nenhuma infraestrutura de fluxo de trabalho.

Cada regra tem um ID e um nível. **MUST** é um defeito quando descumprida e indica a prova exigida;
**SHOULD** é o padrão, e quem se desvia dele declara o motivo naquele caso; **MAY** é opcional.
O [índice de regras](./RULES.md) lista todas as regras graduadas com suas provas.

## 1. Entradas, rascunhos e intenção

- **X-INPUT-1 · MUST** Mantenha rótulos, pré-requisitos e mensagens de validação perto do campo que afetam.
  _Proof: browser_
- **X-INPUT-2 · SHOULD** Diferencie um valor ausente de um serviço indisponível e explique por que o envio não
  está disponível quando o pré-requisito não for óbvio.
- **X-INPUT-3 · SHOULD** Use a semântica de entrada nativa e o autocomplete adequados e preserve as convenções
  de edição da plataforma; ofereça atalhos de teclado onde ajudarem.

| Transição                              | Comportamento esperado                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Vazio → formulário válido              | Habilite a ação de envio correspondente; mantenha os controles de contexto utilizáveis             |
| Enviar → em execução                   | Dispare uma única vez; mostre o estado ocupado sem mover o foco de forma inesperada                |
| Em execução → novas edições            | Especifique se as edições afetam este trabalho, um trabalho posterior ou um rascunho guardado      |
| Falha → restaurar                      | Restaurar só preenche os campos de novo; não os envia                                              |
| Falha → tentar de novo                 | Tentar de novo dispara outra vez; preserve o escopo original ou pergunte sobre o contexto alterado |
| Mudança de configurações/fonte → volta | Mantenha a entrada não concluída e a seleção da pessoa sempre que possível                         |

- **X-INPUT-4 · MUST** Enviar dispara uma vez por ativação, e Restaurar só preenche os campos de novo, sem
  enviá-los. _Proof: unit_
- **X-INPUT-5 · SHOULD** Siga as demais linhas da tabela de transições de entrada.
- **X-INPUT-6 · MUST** Enter só envia onde a convenção documentada do campo pede isso, e nunca durante uma
  composição de IME (confira `isComposing`). A entrada de várias linhas continua funcionando. _Proof: browser_
- **X-INPUT-7 · MUST** O ditado atualiza o texto e nunca envia por conta própria; o texto que existia antes da
  captura é mantido. _Proof: browser_
- **X-INPUT-8 · MUST** Não reconstrua um campo com foco por causa de uma resposta de busca, uma atualização de
  stream, um redimensionamento ou uma mudança de status. _Proof: browser_
- **X-INPUT-9 · MUST** A intenção mais recente vence: uma consulta antiga nunca substitui resultados mais novos,
  e a prévia de um arquivo nunca aparece sob outro. _Proof: unit_
- **X-INPUT-10 · SHOULD** Implemente X-INPUT-9 com os mecanismos de identidade assíncrona e de cancelamento do
  anfitrião; quem contribui com o ranui pode consultar o
  [CODING §3](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership).
- **X-INPUT-11 · MUST** Prometa persistência só depois que ela der certo; um rascunho guardado não é um
  rascunho salvo. _Proof: unit_
- **X-INPUT-12 · MUST** Destaque as correspondências de busca com nós de texto seguros ou escape equivalente,
  nunca inserindo a consulta como HTML. _Proof: unit_
- **X-INPUT-13 · SHOULD** Mantenha texto suficiente em volta de uma correspondência destacada para explicar por
  que o item correspondeu.

## 2. Controles alcançáveis e foco previsível

- **X-FOCUS-1 · SHOULD** Construa controles com semântica nativa e contratos de componentes suportados.
- **X-FOCUS-2 · MUST** Toda ação que só tem ícone tem um nome acessível. _Proof: browser_
- **X-FOCUS-3 · MUST** Uma ação secundária revelada no hover também é revelada com o foco do teclado e tem um
  caminho de toque persistente em entradas imprecisas. _Proof: browser_
- **X-FOCUS-4 · SHOULD** Mantenha visíveis as ações essenciais de recuperação em vez de revelá-las no hover.
- **X-FOCUS-5 · MUST** Controles desabilitados ficam quietos no hover e não podem disparar nada. _Proof: browser_
- **X-FOCUS-6 · MUST** A caixa do alvo e o anel de foco mantêm tamanho e posição enquanto um rótulo ou status
  muda. _Proof: browser_
- **X-FOCUS-7 · MUST** Integre por atributos, eventos, slots, variáveis e parts públicos; não modifique shadow
  roots privadas. _Proof: review_
- **X-FOCUS-8 · MUST** Não acrescente paradas de tabulação no host que não levam a lugar nenhum ou duplicam um
  controle interno. _Proof: browser_
- **X-FOCUS-9 · MUST** Um diálogo composto coloca o foco inicial dentro de si, mantém Tab e Shift+Tab dentro
  dele, fecha com Escape e Cancelar, ativa a ação padrão com Enter e devolve o foco a quem o abriu quando
  fecha. _Proof: browser_
- **X-FOCUS-10 · SHOULD** Quando uma armadilha de foco não alcança um controle (por exemplo, um botão em shadow
  fechada num rodapé), corrija a integração suportada ou coloque botões nativos no slot suportado.
- **X-FOCUS-11 · MUST** Uma região recolhida continua identificando o conteúdo e o estado dela, e a divulgação
  nunca esconde um erro acionável não resolvido. _Proof: browser_
- **X-FOCUS-12 · MUST** Recolher uma região que contém o foco devolve o foco ao alternador dela; remover o
  objeto em foco move o foco para a próxima ação com sentido ou para um controle pai estável. _Proof: browser_
- **X-FOCUS-13 · MUST** Não mova o foco só porque uma requisição em segundo plano terminou. _Proof: browser_
- **X-FOCUS-14 · SHOULD** Escreva o resumo recolhido para ajudar a decidir se vale expandir; quando o corpo
  expandido já mostra esse conteúdo, omita o resumo repetido e mantenha o título e o estado.

Uma primitiva segura para teclado não torna seguro um diálogo composto; X-FOCUS-9 trata da composição.

## 3. Feedback e posição de leitura

- **X-FEEDBACK-1 · SHOULD** Mostre o feedback ao lado do objeto sobre o qual se agiu. Um aviso de “Copiado” ao
  lado de Copiar é mais fácil de associar do que uma notificação global solta; um toast serve para mudanças
  que vão além do objeto atual ou para feedback que, de outro modo, passaria despercebido.
- **X-FEEDBACK-2 · MUST** Mostre a confirmação de sucesso só depois que a operação der certo (em Copiar, depois
  do sucesso na área de transferência) e trate a rejeição localmente, mantendo a geometria do botão e o foco.
  _Proof: browser_
- **X-FEEDBACK-3 · MUST** O feedback assíncrono pertence ao instantâneo de origem da operação: quando o conteúdo
  muda enquanto Copiar está pendente, a conclusão antiga nunca marca o conteúdo novo como “Copiado”, e o
  feedback obsoleto é removido ou identificado como obsoleto. _Proof: unit, browser_
- **X-FEEDBACK-4 · MUST** Não anuncie cada caractere transmitido às tecnologias assistivas.
  _Proof: browser_
- **X-FEEDBACK-5 · MUST** Logs ao vivo e resultados em streaming só acompanham o fim enquanto a pessoa está no
  conteúdo mais recente; rolar para longe suspende o acompanhamento, e “Ir para o mais recente” o restaura sem
  roubar a posição de leitura. _Proof: recording_
- **X-FEEDBACK-6 · SHOULD** Use um contrato de acompanhar/fixar suportado pelo anfitrião ou pelo componente
  escolhido e mantenha o estado do trabalho e da persistência na aplicação; um log de leitura que só cresce
  não é um gerenciador de trabalhos.

Para X-FEEDBACK-3, teste sucesso e falha atrasados com uma atualização de stream no meio, não só um atraso
isolado.

## 4. Progresso, falha e recuperação

- **X-RECOVER-1 · SHOULD** Nomeie uma fase conhecida (“Lendo arquivos”, “Verificando permissões”, “Gravando
  exportação”) em vez de mostrar só um spinner, e anuncie mudanças de fase relevantes, não cada tique do relógio.
- **X-RECOVER-2 · MUST** Mostre uma porcentagem só quando houver um denominador mensurável; o tempo decorrido
  é secundário e nunca é apresentado como estimativa de conclusão. _Proof: review_
- **X-RECOVER-3 · MUST** Um erro responde o que falhou, se algo mudou e o que fazer em seguida, e promete só o
  que o anfitrião consegue garantir. _Proof: review_
- **X-RECOVER-4 · MUST** Preserve a entrada em memória quando o armazenamento falhar e informe a falha de
  persistência à parte. _Proof: unit_
- **X-RECOVER-5 · SHOULD** Coloque diagnósticos sem credenciais em detalhes opcionais.
- **X-RECOVER-6 · SHOULD** Dê a uma falha uma única recuperação coerente, não linhas e toasts duplicados.
- **X-RECOVER-7 · MUST** Um timeout não prova que houve rollback: descubra se uma operação de escrita foi
  efetivada antes de tentar de novo, usando o contrato de idempotência ou de deduplicação do anfitrião quando
  houver. _Proof: unit_

Por exemplo: “A importação parou antes de salvar. Os arquivos selecionados continuam aqui. Tente importar de novo.”

| Condição                            | Resposta útil                                                          | Evite                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Nenhum conteúdo de arquivo legível  | Escolher outro arquivo, ou continuar sem ele se houver suporte         | Tratar toda ação como se exigisse o texto do documento                                  |
| Rede interrompida                   | Preservar entradas/saída parcial; tentar de novo quando houver conexão | Limpar o formulário ou declarar a aplicação inteira inutilizável                        |
| Permissão ou configuração rejeitada | Explicar a categoria; link para a conta/configuração relevante         | Loops automáticos de nova tentativa para uma permissão ausente ou configuração inválida |
| Cancelado pela pessoa               | Marcar como cancelado; manter a saída recuperável                      | Estilo vermelho de falha ou reiniciar um trabalho pausado                               |
| Contexto mudou                      | Identificar a saída obsoleta; atualizar com os dados atuais            | Aplicar em silêncio um resultado antigo a um documento mais novo                        |

## 5. Cancelar, tentar de novo e concluir são desfechos diferentes

- **X-CANCEL-1 · MUST** Mantenha Cancelar e Enviar alcançáveis de forma independente quando ambos forem
  suportados, com nomes acessíveis claros e posições estáveis. _Proof: browser_
- **X-CANCEL-2 · MUST** Um pedido de cancelamento não é um cancelamento confirmado: mostre o estado pendente até
  a confirmação e, quando o cliente só puder parar de esperar, diga isso em vez de afirmar que o trabalho parou.
  _Proof: unit_
- **X-CANCEL-3 · MUST** O cancelamento não é mostrado como falha. _Proof: browser_
- **X-CANCEL-4 · MUST** Tentar de novo dispara o trabalho outra vez sem ampliar o escopo nem trocar de destino em
  silêncio; Restaurar só preenche de novo as entradas editáveis. _Proof: unit_
- **X-CANCEL-5 · MUST** Informe o sucesso de salvar ou aplicar só depois que a escrita for confirmada, e mantenha
  a saída parcial recuperável. _Proof: unit_
- **X-CANCEL-6 · MUST** Ofereça Desfazer só quando o anfitrião puder de fato reverter a operação, e nunca prometa
  que Cancelar desfaz uma escrita concluída. _Proof: review_

## 6. Verifique o que uma pessoa consegue observar

- **X-VERIFY-1 · SHOULD** Escolha a evidência pelo defeito, usando as camadas abaixo, em vez de rodar todos os
  testes possíveis para uma mudança pequena.
- **X-VERIFY-2 · SHOULD** Inclua os caminhos offline e de falha quando a tarefa depender de trabalho externo.
- **X-VERIFY-3 · SHOULD** Informe o commit testado e quaisquer pré-requisitos externos pendentes.

| Camada de evidência | Regressão relevante                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| Unidade/estado      | Cancelamento, respostas atrasadas, identidade de escopo e tentar de novo versus restaurar                    |
| Integração          | O rascunho sobrevive a uma ida e volta de contexto; uma falha coerente; caminho de teclado da sobreposição   |
| Navegador real      | Dimensões/linhas de base/overflow calculados, caixas de alvo, foco, hover desabilitado e IME                 |
| Entre superfícies   | Formulários, busca, histórico, configurações, importação/exportação, prévias e confirmações afetados         |
| Variantes           | Temas, larguras, redimensionamento, teclado/entrada imprecisa, traduções/RTL e movimento reduzido relevantes |

Auditorias estáticas não provam a restauração do foco, a cascata vencedora nem a preservação da posição de leitura.
Quem contribui com a biblioteca usa a [lista de verificação do CODING](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request);
aplicações consumidoras usam os comandos relevantes do anfitrião, não os comandos do checkout do código-fonte do ranui.
