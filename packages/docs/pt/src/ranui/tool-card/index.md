---
description: 'Desenha uma chamada de ferramenta e o resultado dela a partir de uma intenção declarada (generic, terminal ou diff) em vez de uma marcação que a ferramenta teve de escolher.'
---

# Tool Card

Desenha uma chamada de ferramenta e o resultado dela a partir de uma **intenção declarada**, não de marcação.

> **Use quando** estiver mostrando o que um agente ou um job de fato fez (um comando de shell, uma
> edição de arquivo, uma busca) e quiser que a ferramenta diga _o que ela é_ enquanto a superfície
> decide como isso aparece.

Uma ferramenta que devolve HTML escolheu um renderizador, um tema e um layout em nome da interface —
e faz isso justamente no único lugar (o resultado que o modelo vê) onde assuntos de interface não
cabem. Declarar uma intenção mantém os dois separados: a mesma chamada pode ser desenhada aqui como
um bloco de terminal, como uma linha só numa transcrição compacta e como um destino de salto num
editor, sem que a ferramenta saiba que qualquer um deles existe.

## Início rápido

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.createElement('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …quando a chamada retorna
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';

conversation.append(card);
```

## Tipos de cartão

### `generic`

O padrão, e também o caso de reserva. Título, uma tabela opcional de chave/valor com os argumentos
que valha a pena mostrar, e conteúdo de resultado opcional.

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

A chamada _é_ um comando de shell. `title` é o comando; `description` e `cwd` aparecem acima da
saída. Um `exitCode` diferente de zero é mostrado; zero não.

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

A chamada cria ou modifica arquivos. Cada entrada aparece como hunks no estilo unified com as duas
margens, calculados pelo `diffLines` de [ranuts/utils](../../ranuts/utils/). **Um `oldText` nulo
significa que o arquivo está sendo criado** — que é o que uma view no momento da chamada sabe, já
que quem chama não tem conteúdo anterior para ler.

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## Duas regras que mordem

Estas views são calculadas numa chamada ao vivo **e de novo quando um log é reproduzido**. Todo o
resto decorre disso.

- **Uma view é função pura dos argumentos da chamada** (mais o resultado, numa view de resultado).
  Sem E/S, sem relógio, sem estado de sessão; caso contrário, a reprodução discorda do que o usuário
  viu originalmente.
- **Um cartão não reconhecido degrada; nunca lança.** Um tipo de cartão de um produtor mais novo, ou
  um valor corrompido no armazenamento, é desenhado como `generic` com o título que tiver, e uma view
  malformada é desenhada vazia. A exibição não pode ser capaz de quebrar uma reprodução.

## Localizações

Qualquer `locations` numa chamada vira botões que disparam `locationclick`, para que um editor possa
acompanhar:

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## Referência da API

### Propriedades

| Propriedade | Tipo                                | Padrão      | Descrição                                            |
| ----------- | ----------------------------------- | ----------- | ---------------------------------------------------- |
| `call`      | `ToolCallView \| null`              | `null`      | A view pendente, derivada dos argumentos da chamada. |
| `result`    | `ToolResultView \| null`            | `null`      | A view concluída. Substitui a pendente.              |
| `status`    | `'running' \| 'success' \| 'error'` | `'running'` | É refletido, então o estilo pode se apoiar nele.     |
| `open`      | `boolean`                           | `false`     | Se o corpo está aberto.                              |
| `sheet`     | `string`                            | `''`        | CSS injetado no shadow DOM do elemento.              |

Um valor de `status` desconhecido é lido de volta como `running`.

### Eventos

| Evento          | Detail                       | Disparado quando                     |
| --------------- | ---------------------------- | ------------------------------------ |
| `locationclick` | `{ location: ToolLocation }` | Uma referência a arquivo é acionada. |

### Partes

`card`, `header`, `status`, `title`, `toggle`, `body`, `description`, `exit`, `input`,
`output`, `file`, `path`, `hunk`, `line`, `locations`, `location`.

As linhas de diff carregam um `data-kind` de `context`, `added` ou `removed`.

### Acessibilidade

O cabeçalho é um `<button type="button">` de verdade com `aria-expanded`, então é alcançável e
operável pelo teclado sem fiação extra.

## Estilos

O `<r-tool-card>` expõe **24 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#tool-card); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Veja também

- [Conversation](../conversation/): use isto como alvo de `mount` para a view de uma chamada
- [ranuts/utils](../../ranuts/utils/): `diffLines`, que desenha o cartão `diff`
