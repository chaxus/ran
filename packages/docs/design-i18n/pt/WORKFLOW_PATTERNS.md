<!-- source: a963396e1b2e40d4006461f2894dc37ba86beeb5 -->

# Padrões de fluxo de trabalho opcionais

Estas receitas se aplicam **só quando a tarefa ganha com elas**. Um formulário, uma página de busca ou um
editor comum não precisa, por padrão, de filas, conexões de conta nem histórico de versões.
O [DESIGN.md](./DESIGN.md) é dono da aparência; o [INTERACTION.md](./INTERACTION.md), do comportamento geral.
O anfitrião é dono da engenharia; a [engenharia do ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)
é um adaptador de biblioteca opcional. São decisões da aplicação anfitriã,
não APIs de componente adicionais, garantias de armazenamento nem serviços embutidos.

Cada regra tem um ID e um nível. **MUST** é um defeito quando descumprida e indica a prova exigida;
**SHOULD** é o padrão, e quem se desvia dele declara o motivo naquele caso; **MAY** é opcional.
O [índice de regras](./RULES.md) lista todas as regras graduadas com suas provas.

- **W-RECIPE-1 · SHOULD** Para cada receita escolhida, estabeleça o que a aplicação suporta antes de escolher
  os controles.
- **W-RECIPE-2 · SHOULD** Mantenha o estado de trabalhos, configuração, fontes selecionadas e revisões nos
  responsáveis que já existem. As telas leem esse estado e disparam comandos em vez de duplicar clientes de
  serviço e flags de requisição em cada painel.

## 1. Trabalho em lote e filas

**Use quando:** as pessoas ganham ao preparar outra importação, upload ou exportação enquanto um trabalho roda.
**Contrato do anfitrião:** disparo, preparação, concorrência/preempção, confirmação de cancelamento,
escritas parciais, prevenção de duplicatas e persistência.

| Estado                        | Ação principal                       | Contrato a definir                                                      |
| ----------------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Pronto                        | Enviar arquivos / Exportar relatório | Escopo, destino e prevenção de envio duplicado                          |
| Em execução                   | Cancelar, se houver suporte          | O que para, o que fica e se alguma escrita foi efetivada                |
| Em execução com trabalho novo | Adicionar à fila, se houver suporte  | O trabalho ativo continua rodando; a nova entrada é mantida (W-QUEUE-2) |
| Fila pausada                  | Retomar fila                         | Editar um item pendente não o dispara nem retoma a fila                 |
| Falha                         | Tentar de novo / Restaurar entradas  | Use os desfechos distintos de INTERACTION §5                            |

- **W-QUEUE-1 · SHOULD** Defina o contrato de cada estado da tabela de fila acima.
- **W-QUEUE-2 · MUST** Um trabalho novo nunca substitui nem cancela em silêncio o trabalho ativo. Sem suporte a
  fila, mantenha a nova entrada e explique a restrição. _Proof: unit_
- **W-QUEUE-3 · MUST** Editar um item pendente numa fila pausada não o dispara nem retoma a fila. _Proof: unit_
- **W-QUEUE-4 · SHOULD** Resuma o trabalho na fila em uma linha, como “2 na fila” ou “Pausada · 2 na fila”.
- **W-QUEUE-5 · SHOULD** Recolha os detalhes da fila quando não forem necessários; expanda em linhas, não em
  cartões aninhados.
- **W-QUEUE-6 · MUST** Cada linha tem um item identificável e oferece só as ações suportadas: Editar, Remover ou
  Executar agora. _Proof: browser_
- **W-QUEUE-7 · SHOULD** Defina se Executar agora espera, passa na frente ou roda em paralelo.
- **W-QUEUE-8 · SHOULD** Represente a preparação dentro da linha em vez de acrescentar um painel grande cheio de
  comandos desabilitados.
- **W-QUEUE-9 · MUST** Editar a fila preserva o rascunho atual, e cancelar a edição o restaura.
  _Proof: unit_
- **W-QUEUE-10 · MUST** A reconexão não dispara automaticamente o trabalho na fila, a menos que o usuário tenha
  escolhido essa política. _Proof: unit_
- **W-QUEUE-11 · SHOULD** Aplique as [regras gerais de foco e cancelamento](./INTERACTION.md) ao remover uma
  linha, recolher a fila ou parar um trabalho.

## 2. Configurações conscientes das capacidades e trabalho offline

**Use quando:** uma tarefa oferece provedores, modos, dispositivos ou capacidades dependentes de rede distintos.
**Contrato do anfitrião:** armazenamento da configuração, uma operação de verificação real, alcançabilidade e
dependências locais de runtime.

- **W-SETTINGS-1 · MUST** Salvar a configuração e verificar a disponibilidade são ações separadas com desfechos
  separados, e cada uma mostra o que realizou. _Proof: unit, browser_
- **W-SETTINGS-2 · SHOULD** Derive os controles da capacidade e do estado, não de um único booleano `connected`.

Uma conta de armazenamento remoto, um serviço de banco de dados ou um conversor local podem estar configurados
sem estarem utilizáveis no momento.

| Estado                          | O que o usuário entende                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Não configurado                 | Falta uma escolha ou credencial obrigatória                                          |
| Configurado, não verificado     | As configurações estão salvas; a disponibilidade ainda não foi confirmada            |
| Verificado                      | Uma verificação real deu certo para esta configuração; registre quando               |
| Autorização necessária/expirada | Reconecte a conta sem descartar o trabalho salvo                                     |
| Serviço inalcançável            | A configuração salva não prova que o serviço está alcançável agora                   |
| Dispositivo offline             | As operações de rede estão indisponíveis; o trabalho local disponível pode continuar |

- **W-SETTINGS-3 · SHOULD** Torne cada estado da tabela de configurações acima distinguível para o usuário.
- **W-SETTINGS-4 · MUST** Reconectar uma conta cuja autorização é necessária ou expirou mantém o trabalho salvo.
  _Proof: unit_
- **W-SETTINGS-5 · MUST** Invalide a verificação quando mudarem configurações relevantes de endpoint, conta ou
  credencial. _Proof: unit_
- **W-SETTINGS-6 · SHOULD** Trate os eventos online/offline do navegador como indícios, não como prova de que um
  endpoint específico funciona.
- **W-SETTINGS-7 · SHOULD** Revele as configurações do caminho escolhido. Um caminho de conversão local pode
  precisar de controles de cache/download/dispositivo; um caminho remoto, de controles de endpoint/conta.
- **W-SETTINGS-8 · MUST** Oculte os campos irrelevantes **e as mensagens de status obsoletas deles**. _Proof: browser_
- **W-SETTINGS-9 · SHOULD** Cabeçalhos de configurações, grupos de campos, linhas de conta e estados
  indisponíveis/vazios mantêm as espinhas de conteúdo e de navegação nomeadas no
  [contrato de alinhamento do DESIGN](./DESIGN.md#alignment-is-structure-not-polish).
- **W-SETTINGS-10 · SHOULD** Mantenha um comando de título/menu abraçando o conteúdo; uma trilha separada absorve
  o espaço de preenchimento do cabeçalho.
- **W-SETTINGS-11 · SHOULD** Conte o preenchimento de painéis e controles aninhados até os rótulos visíveis antes
  de declarar regiões alinhadas.
- **W-SETTINGS-12 · MUST** Trocar de modo preserva a configuração dos outros modos. _Proof: unit_
- **W-SETTINGS-13 · SHOULD** Mantenha fácil de encontrar o caminho de volta para outro modo.
- **W-SETTINGS-14 · SHOULD** Explique o destino dos dados antes de compartilhá-los.
- **W-SETTINGS-15 · MUST** Um endpoint de API configurado não é apresentado como uma conta autorizada.
  _Proof: review_
- **W-SETTINGS-16 · MUST** Offline, mantenha o conteúdo salvo e os rascunhos quando os dados e a implementação
  deles estiverem disponíveis. _Proof: unit, browser_
- **W-SETTINGS-17 · SHOULD** Offline, mantenha prévias, edição e exportações disponíveis quando os dados e a
  implementação delas estiverem disponíveis.
- **W-SETTINGS-18 · SHOULD** Offline, oculte descobertas ou promoções que dependem só da rede e não oferecem
  nenhum caminho útil; mantenha os objetos conectados existentes com um estado de indisponível compreensível.
- **W-SETTINGS-19 · SHOULD** Não trate um recurso em cache como prova de que todas as dependências de runtime
  estão presentes.
- **W-SETTINGS-20 · SHOULD** Ofereça um ponto de continuação deliberado depois de reconectar.

## 3. Conexões de conta e fontes externas

**Use quando:** o trabalho lê ou grava dados fora do objeto atual, sejam locais ou remotos.
**Contrato do anfitrião:** escopos de autorização, identidade, verificações de acesso, revogação, credenciais,
procedência e retenção de cópias importadas. Um endereço de endpoint não estabelece acesso a uma conta.

Primitivas de apresentação não fornecem implantação de OAuth, cofre de credenciais, backend de conectores
nem garantias de armazenamento. Uma tela de conexão bem-acabada não substitui o contrato de autorização do anfitrião.

- **W-ACCOUNT-1 · SHOULD** Diferencie a autorização da conta, o acesso à fonte selecionada e o uso por uma
  operação específica.
- **W-ACCOUNT-2 · SHOULD** Peça só as permissões necessárias.
- **W-ACCOUNT-3 · SHOULD** Explique leituras, escritas e destino antes da autorização ou do compartilhamento.
- **W-ACCOUNT-4 · MUST** A identidade da conta, a reconexão e a revogação/desconexão são alcançáveis pela UI de
  conexão. _Proof: browser_
- **W-ACCOUNT-5 · MUST** Desconectar interrompe o acesso futuro. _Proof: unit_
- **W-ACCOUNT-6 · SHOULD** Explique à parte o que acontece com as cópias importadas ao desconectar.
- **W-ACCOUNT-7 · MUST** Mantenha credenciais fora de URLs, logs e prévias. _Proof: review_
- **W-ACCOUNT-8 · SHOULD** Mostre a procedência e a atualidade das fontes selecionadas, seja um arquivo local, um
  registro de banco de dados ou um documento na nuvem.
- **W-ACCOUNT-9 · MUST** Remover uma fonte afeta o trabalho posterior, não as evidências históricas. _Proof: unit_
- **W-ACCOUNT-10 · MUST** Erros de permissão, dados desatualizados e cópias em cache offline têm estados
  diferentes. _Proof: unit_
- **W-ACCOUNT-11 · MUST** Trate o conteúdo importado como dado não confiável, não como permissão para executar
  comandos. _Proof: review_
- **W-ACCOUNT-12 · MUST** Deixe explícitas as escritas e os destinos delas antes que aconteçam.
  _Proof: browser_
- **W-ACCOUNT-13 · SHOULD** Ajuste a etapa de revisão antes de uma escrita ao impacto dela.

## 4. Resultados, prévias e revisões

**Use quando:** uma exportação, um documento transformado ou um rascunho tem identidade e destino que vão além
de uma mensagem de status passageira.
**Contrato do anfitrião:** identidade do resultado/revisão, versão da fonte, escopo do alvo, confirmação de
efetivação, tratamento de conflitos e qualquer histórico reversível.

- **W-REVISION-1 · SHOULD** Prefira uma prévia/editor adequado para conteúdo substancial.
- **W-REVISION-2 · MUST** Ofereça Comparar, Aplicar ou Desfazer só quando o anfitrião der suporte. _Proof: review_
- **W-REVISION-3 · SHOULD** Resuma o resultado e identifique a revisão, a fonte e o destino dele quando forem
  relevantes.
- **W-REVISION-4 · SHOULD** Mantenha as ações suportadas de Copiar, Exportar, Comparar ou Aplicar ao lado do
  resultado correspondente.
- **W-REVISION-5 · MUST** Separe pré-visualizar de aplicar e nomeie o alvo e o escopo antes da alteração.
  _Proof: browser_
- **W-REVISION-6 · MUST** Se os dados de origem mudaram, compare/faça rebase ou gere de novo antes de aplicar;
  edições mais novas nunca são sobrescritas em silêncio. _Proof: unit_
- **W-REVISION-7 · SHOULD** Confirme o estado salvo/aplicado e a saída recuperável conforme
  [o padrão de interação](./INTERACTION.md).

## Aplicando uma receita

- **W-APPLY-1 · MUST** Mantenha só os estados e ações que o anfitrião consegue honrar. _Proof: review_
- **W-APPLY-2 · SHOULD** Uma tela bem-acabada não substitui um contrato de serviço ausente; declare esse
  pré-requisito com clareza.

As transições-chave já têm regras MUST com prova de unidade: trabalho pausado continua pausado (W-QUEUE-3),
configuração alterada invalida a verificação (W-SETTINGS-5), remover uma fonte afeta só o trabalho futuro
(W-ACCOUNT-9) e revisões obsoletas não podem sobrescrever edições novas (W-REVISION-6). Os testes delas cobrem
trabalho interrompido e offline quando relevante.
