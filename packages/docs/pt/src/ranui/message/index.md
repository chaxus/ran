---
description: 'A API Message do ranui mostra avisos globais (info, success, warning, error, toast) de forma imperativa, desenhados como uma camada leve.'
---

# Message

Componente de aviso global para resultados de operações, chamado de forma imperativa pela API `message` e desenhado como um aviso que pode ser dispensado.

> **Use quando** precisar de um aviso passageiro, que se fecha sozinho, para confirmar o resultado de uma operação. Chame a API imperativa `message.info` / `success` / `warning` / `error` / `toast` em vez de colocar marcação.

## Início rápido

<Demo>
  <r-button type="primary" onclick="message.info('Isto é um aviso')">Mostrar mensagem</r-button>
</Demo>

```html
<r-button type="primary" onclick="message.info('Isto é um aviso')">Mostrar mensagem</r-button>
```

Normalmente o Message é chamado pelo JavaScript. O objeto global `message` é registrado em `window` (também disponível como `window.ranui.message`) assim que o módulo do componente carrega.

```js
message.info('Isto é um aviso');
message.success('Projeto excluído');
```

## Referência da API

### Métodos globais

Cada método acrescenta um aviso e o fecha sozinho depois de `duration` milissegundos (padrão `3000`). Os cinco compartilham a mesma assinatura.

| Método              | Descrição                                                |
| ------------------- | -------------------------------------------------------- |
| `message.info()`    | Aviso informativo neutro (ícone azul de informação)      |
| `message.success()` | Aviso de sucesso (ícone verde de confirmação)            |
| `message.warning()` | Aviso de advertência (ícone âmbar), anunciado com ênfase |
| `message.error()`   | Aviso de erro (ícone vermelho), anunciado com ênfase     |
| `message.toast()`   | Aviso escuro e simples, sem ícone                        |

### Assinatura dos métodos

Cada método aceita ou uma `string` (o conteúdo) ou um objeto de opções.

```js
// 1. Passe uma string: só o conteúdo, fecha depois de 3000 ms
message.info('Isto é um aviso');

// 2. Passe um objeto de opções
message.info({
  content: 'Isto é um aviso',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### Opções

| Opção          | Tipo                        | Padrão          | Descrição                                                                       |
| -------------- | --------------------------- | --------------- | ------------------------------------------------------------------------------- |
| `content`      | `string`                    | —               | Texto exibido (obrigatório ao passar um objeto)                                 |
| `duration`     | `number`                    | `3000`          | Atraso em milissegundos até fechar sozinho                                      |
| `close`        | `() => void`                | —               | Callback disparado depois que o aviso é removido                                |
| `top`          | `number \| string`          | `8`             | Distância da pilha de avisos ao topo do contêiner (um número é tratado como px) |
| `zIndex`       | `number \| string`          | `1200`          | Ordem de empilhamento do contêiner de avisos                                    |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | Devolve o elemento em que a pilha de avisos é montada                           |

> Passar `null`, `undefined` ou nenhum argumento não faz nada: nada é exibido.

### Atributos do elemento `r-message`

Cada aviso é um custom element `<r-message>`. A API global define esses atributos por você, mas eles também podem ser usados diretamente.

| Atributo  | Tipo     | Padrão | Descrição                                                                                         |
| --------- | -------- | ------ | ------------------------------------------------------------------------------------------------- |
| `type`    | `string` | —      | Um de `info`, `success`, `warning`, `error`, `toast`. Escolhe ícone, cor e o papel da região ARIA |
| `content` | `string` | —      | Texto desenhado dentro do aviso                                                                   |
| `sheet`   | `string` | `''`   | CSS injetado no shadow DOM do componente                                                          |

## Tipos de mensagem `type`

<Demo>
  <r-button onclick="message.info('Isto é um aviso')">Aviso informativo</r-button>
  <r-button onclick="message.success('Isto é um aviso')">Aviso de sucesso</r-button>
  <r-button onclick="message.warning('Isto é um aviso')">Aviso de advertência</r-button>
  <r-button onclick="message.error('Isto é um aviso')">Aviso de erro</r-button>
  <r-button onclick="message.toast('Isto é um aviso')">Aviso toast</r-button>
</Demo>

```html
<r-button onclick="message.info('Isto é um aviso')">Aviso informativo</r-button>
<r-button onclick="message.success('Isto é um aviso')">Aviso de sucesso</r-button>
<r-button onclick="message.warning('Isto é um aviso')">Aviso de advertência</r-button>
<r-button onclick="message.error('Isto é um aviso')">Aviso de erro</r-button>
<r-button onclick="message.toast('Isto é um aviso')">Aviso toast</r-button>
```

## Duração própria `duration`

<Demo>
  <r-button onclick="message.info({ content: 'Fica 6 s', duration: 6000 })">Aviso de 6 segundos</r-button>
  <r-button onclick="message.info({ content: 'Fica 1 s', duration: 1000 })">Aviso de 1 segundo</r-button>
</Demo>

```html
<r-button onclick="message.info({ content: 'Fica 6 s', duration: 6000 })">Aviso de 6 segundos</r-button>
<r-button onclick="message.info({ content: 'Fica 1 s', duration: 1000 })">Aviso de 1 segundo</r-button>
```

## Callback de fechamento `close`

O callback `close` roda depois que o aviso é removido do DOM.

<Demo>
  <r-button onclick="message.success({ content: 'Salvo', close: () => message.info('Aviso fechado') })">Mensagem encadeada</r-button>
</Demo>

```html
<r-button onclick="message.success({ content: 'Salvo', close: () => message.info('Aviso fechado') })"
  >Mensagem encadeada</r-button
>
```

```js
message.success({
  content: 'Salvo',
  close: () => {
    // roda quando o aviso é dispensado
    console.log('toast closed');
  },
});
```

## Posicionamento próprio `top` / `zIndex` / `getContainer`

<Demo>
  <r-button onclick="message.info({ content: 'Empurrado para baixo', top: 120 })">Deslocar do topo</r-button>
</Demo>

```js
message.info({
  content: 'Empurrado para baixo',
  top: 120, // distância do topo do contêiner
  zIndex: 1300, // ordem de empilhamento
  getContainer: () => document.querySelector('#app'), // ponto de montagem próprio
});
```

## Estilos

A pilha de avisos vive num contêiner levado para o body; cada `<r-message>` desenha o conteúdo dentro de um shadow DOM cuja superfície pode receber tema por variáveis CSS (todas com valores de reserva sensatos).

| Variável CSS                          | Padrão                         | Descrição                     |
| ------------------------------------- | ------------------------------ | ----------------------------- |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | Fundo da superfície do aviso  |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | Raio de canto do aviso        |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | Elevação do aviso             |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | Cor do texto do aviso         |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | z-index da pilha              |
| `--ran-message-top`                   | `8px`                          | Distância da pilha até o topo |

## Boas práticas

- **Diga o que mudou**: escreva o texto do aviso como um resultado, "Projeto excluído" ou "Alterações salvas", não um vago "Sucesso".
- **Sucesso / informação**: use `message.success` / `message.info` para confirmações que não bloqueiam.
- **Erros / advertências**: use `message.error` / `message.warning`; eles sobem para uma região ARIA viva assertiva, então leitores de tela interrompem.
- **Seja breve**: um aviso se fecha sozinho, então reserve conteúdo longo ou que exija ação para um diálogo.
- **Ajuste a duração com parcimônia**: aumente `duration` para mensagens longas, mas evite tornar permanente um retorno passageiro.
