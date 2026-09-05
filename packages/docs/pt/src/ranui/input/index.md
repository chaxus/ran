---
description: 'O Input do ranui (<r-input>) é o controle de formulário básico para digitar com o teclado, com tipos, tamanhos e validação, feito como Web Component nativo para qualquer framework.'
---

# Input

Componente de entrada para digitar conteúdo pelo teclado: o controle de formulário mais básico.

> **Use quando** precisar de um campo de texto com rótulo fixo em cima, ícone à esquerda, estado e mensagem de validação, e participação em formulários nativos: o `<r-input>` cobre entrada de texto, senha e números.

## Início rápido

### Uso básico

<Demo column>
  <r-input placeholder="Digite algo"></r-input>
</Demo>

```html
<r-input placeholder="Digite algo"></r-input>
```

## Referência da API

### Propriedades

| Propriedade   | Tipo      | Padrão  | Descrição                                                                   |
| ------------- | --------- | ------- | --------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | Legenda fixa desenhada acima do campo                                       |
| `placeholder` | `string`  | `''`    | Texto de espaço reservado, repassado ao `<input>` nativo                    |
| `value`       | `string`  | `''`    | Valor do campo; refletido como atributo e repassado ao formulário           |
| `disabled`    | `boolean` | `false` | Se o campo está desabilitado                                                |
| `type`        | `string`  | `''`    | Tipo nativo repassado ao controle interno (`text`, `password`, `number`, …) |
| `icon`        | `string`  | `''`    | Nome do ícone inicial dentro do campo (desenhado como `r-icon`)             |
| `name`        | `string`  | `''`    | Nome do campo quando ele participa de um formulário                         |
| `status`      | `string`  | `''`    | Estado de validação: `error`, `warning`                                     |
| `message`     | `string`  | `''`    | Texto de apoio ou de validação desenhado abaixo do campo                    |
| `min`         | `string`  | `''`    | Valor mínimo; repassado ao `<input>` interno quando `type="number"`         |
| `max`         | `string`  | `''`    | Valor máximo; repassado ao `<input>` interno quando `type="number"`         |
| `step`        | `string`  | `''`    | Passo do valor; repassado ao `<input>` interno quando `type="number"`       |
| `required`    | `boolean` | `false` | Repassado ao `<input>` interno para que a validação nativa se aplique       |
| `sheet`       | `string`  | `''`    | CSS injetado no shadow root                                                 |

### Rótulo `label`

Uma legenda fixa desenhada acima do campo: sempre visível, nunca se sobrepõe ao conteúdo vizinho e não desloca o layout ao receber foco (rótulos alinhados no topo também fazem o formulário ser preenchido mais rápido do que os embutidos ou flutuantes; veja [a pesquisa com rastreamento ocular de Luke Wroblewski](https://www.lukew.com/ff/entry.asp?504=)).

<Demo column>
  <r-input label="Nome de usuário"></r-input>
</Demo>

```html
<r-input label="Nome de usuário"></r-input>
```

### Espaço reservado `placeholder`

Comporta-se igual ao atributo `placeholder` nativo.

<Demo column>
  <r-input placeholder="Digite o nome de usuário"></r-input>
</Demo>

```html
<r-input placeholder="Digite o nome de usuário"></r-input>
```

### Valor `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### Estado desabilitado `disabled`

<Demo column>
  <r-input label="Nome de usuário" disabled></r-input>
</Demo>

```html
<r-input label="Nome de usuário" disabled></r-input>
```

### Ícone `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### Tipos de entrada `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="Senha"></r-input>
  <r-input type="number" placeholder="Número"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="Senha"></r-input>
<r-input type="number" placeholder="Número"></r-input>
```

### Estado `status`

Use `status` sempre junto de uma `message`, para que o estado seja comunicado pelo texto e não só pela cor.

<Demo column>
  <r-input status="error" label="Nome de usuário" message="Este campo é obrigatório"></r-input>
  <r-input status="warning" label="Nome de usuário" message="Confira este valor"></r-input>
</Demo>

```html
<r-input status="error" label="Nome de usuário" message="Este campo é obrigatório"></r-input>
<r-input status="warning" label="Nome de usuário" message="Confira este valor"></r-input>
```

### Mensagem de apoio `message`

Desenha texto de apoio ou de validação abaixo do campo.

<Demo column>
  <r-input label="E-mail" message="Nunca vamos compartilhar seu e-mail"></r-input>
</Demo>

```html
<r-input label="E-mail" message="Nunca vamos compartilhar seu e-mail"></r-input>
```

### Nome do campo `name`

```html
<r-input name="username" label="Nome de usuário"></r-input>
```

## Eventos

Os dois eventos são despachados como `CustomEvent` levando o valor atual em `detail`.

| Evento   | Quando dispara                                            | `detail`            |
| -------- | --------------------------------------------------------- | ------------------- |
| `input`  | A cada tecla (espelha o `input` nativo)                   | `{ value: string }` |
| `change` | Ao confirmar ou perder o foco (espelha o `change` nativo) | `{ value: string }` |

### Evento de digitação `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="Nome de usuário"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Nome de usuário');
input.addEventListener('input', (event) => {
  console.log('Digitando:', event.detail.value);
});
```

### Evento de mudança `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="Nome de usuário"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Nome de usuário');
input.addEventListener('change', (event) => {
  console.log('O valor mudou:', event.detail.value);
});
```

## Associação a formulários {#form-association}

O `r-input` é um elemento personalizado associado a formulários (`static formAssociated = true`). Ele anexa `ElementInternals` e repassa seu valor via `setFormValue`, então o campo é recolhido por `new FormData(form)` quando é descendente real de um `<form>` nativo; defina `name` para dar uma chave ao valor. Veja [Formulários](/pt/src/ranui/form/) para o auxiliar `serializeForm()`, que transforma um envio em um objeto simples.

```html
<form>
  <r-input name="username" label="Nome de usuário"></r-input>
</form>
```

**Reinício**: um `form.reset()` nativo (ou um `<button type="reset">`) restaura o valor que o campo tinha quando se conectou pela primeira vez, implementado por `formResetCallback()`, um dos ganchos de ciclo de vida que o navegador chama sozinho em um elemento personalizado associado a formulários.

**Validação**: definir `required` torna um campo vazio inválido via `ElementInternals.setValidity()`; `form.checkValidity()` / `form.reportValidity()` enxergam isso, e enviar mostra o balão de validação nativo do navegador ancorado no campo. Campos `disabled` nunca bloqueiam a validação, igual a um `<input>` nativo. O `r-input` também expõe os métodos e propriedades de sempre de um campo nativo: `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`.

```html
<form>
  <r-input name="username" label="Nome de usuário" required></r-input>
  <button type="submit">Enviar</button>
</form>
```

## Parts CSS

Expostos por `::part()` para estilização externa.

| Part      | Elemento                                                   |
| --------- | ---------------------------------------------------------- |
| `input`   | O invólucro do campo                                       |
| `content` | O controle `<input>` nativo interno                        |
| `label`   | O rótulo fixo acima do campo (existe quando há `label`)    |
| `message` | O texto de apoio ou validação (existe quando há `message`) |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## Estilos

O `<r-input>` expõe **61 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Partes: `content` · `input` · `label` · `message`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#input); qual usar é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Rótulos**: acrescente um `label` com sentido para que o campo tenha um nome acessível.
- **Espaços reservados**: use `placeholder` como dica de digitação, não como substituto do rótulo.
- **Estado e mensagem**: use `status` junto de `message` para que o estado não seja sinalizado só pela cor.
- **Ícones**: acrescente um `icon` pertinente para o campo ser reconhecido mais rápido.
- **Tipos**: escolha o `type` adequado ao conteúdo (`text`, `password`, `number`, …).
- **Formulários**: defina `name` ao recolher o valor dentro de um formulário.
