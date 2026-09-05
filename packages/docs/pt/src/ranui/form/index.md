---
description: 'Como montar formulários com o ranui: r-input, r-checkbox e r-select funcionam direto dentro de um <form> nativo, sem componente invólucro.'
---

# Forms

O ranui não traz nenhum componente que envolva o `<form>`. `r-input`, `r-checkbox` e `r-select` são eles próprios [Form-Associated Custom Elements](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_components/Using_form-associated_custom_elements) (cada um chama `attachInternals()` e repassa o valor por `ElementInternals.setFormValue()`), então já funcionam dentro de um `<form>` nativo: `new FormData(form)` os recolhe, `form.reset()` restaura o estado anterior à interação e um campo `required` bloqueia o envio e mostra a validação nativa do navegador ancorada no campo. Nada disso precisa de marcação própria do ranui.

> **Use quando** estiver montando um formulário com `r-input`/`r-checkbox`/`r-select`: use um `<form>` de verdade e recorra ao `serializeForm()` (abaixo) se quiser os valores enviados como objeto simples em vez de escrever à mão a iteração do `FormData`.

## Início rápido

Os três tipos de campo, enviados por um `<form>` comum. Mude um campo e envie para ver o resultado abaixo. Esta demonstração monta o objeto com o próprio `FormData`/`Object.fromEntries` do navegador (sem importar nada); o `serializeForm()`, apresentado a seguir, faz o mesmo e mais uma coisa que o `Object.fromEntries` não faz: um nome de campo repetido volta como array em vez de guardar silenciosamente só o último valor.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="Usuário" placeholder="Digite o usuário"></r-input>
    <r-select name="role" label="Papel" style="width: 100%" defaultValue="member">
      <r-option value="member">Membro</r-option>
      <r-option value="admin">Administrador</r-option>
    </r-select>
    <r-checkbox name="subscribe">Assinar a newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Enviar</button></r-button>
  </form>
</Demo>

> Como conta a seção [Layout](#layout) mais abaixo: os campos não têm layout próprio no nível
> do formulário, então todos os exemplos desta página (inclusive este) definem o próprio CSS
> do `<form>` (`display: flex; flex-direction: column; gap: …`). Omiti-lo empilha os campos no
> fluxo normal sem espaçamento entre eles, o que parece quebrado ou sobreposto em vez de um
> formulário.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Usuário" placeholder="Digite o usuário"></r-input>
  <r-select name="role" label="Papel" defaultValue="member">
    <r-option value="member">Membro</r-option>
    <r-option value="admin">Administrador</r-option>
  </r-select>
  <r-checkbox name="subscribe">Assinar a newsletter</r-checkbox>
  <button type="submit">Enviar</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // um <form> de verdade, caso contrário, navega a página
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

Recolhe os campos nomeados de um `<form>` num objeto simples via `FormData`: o código repetitivo que todo mundo escreve à mão para transformar um envio em algo que possa passar por `JSON.stringify` ou ir como corpo de um fetch. É uma função comum, sem dependência dos campos do ranui em particular; serve para qualquer `<form>` de verdade.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

Um campo com mais de um valor sob o mesmo `name` (por exemplo, várias caixas de seleção com o mesmo nome) volta como array; todo o resto volta como valor único.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## Layout {#layout}

Os campos não têm layout de formulário por padrão: estilize o seu próprio `<form>` com CSS comum:

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="Nome"></r-input>
    <r-input name="last" label="Sobrenome"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continuar</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="Nome"></r-input>
  <r-input name="last" label="Sobrenome"></r-input>
  <button type="submit">Continuar</button>
</form>
```

## Validação e reinício

`r-input`, `r-checkbox` e `r-select` aceitam `required` (que bloqueia o envio e dispara o balão de validação nativo do navegador, exatamente como um campo nativo), além de `checkValidity()`, `reportValidity()`, `validity` e `validationMessage`. Um `form.reset()` nativo (ou um `<button type="reset">`) devolve cada campo ao estado anterior à interação por meio de `formResetCallback()`. Veja a documentação de cada campo ([Input](/pt/src/ranui/input/#form-association), [Checkbox](/pt/src/ranui/checkbox/#form-association), [Select](/pt/src/ranui/select/#form-association)) para os detalhes.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Usuário" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Enviar</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Usuário" required></r-input>
  <button type="submit">Enviar</button>
</form>
```

## Por que não existe um invólucro `<r-form>`?

Um `<form>` nativo já basta: os componentes de campo do ranui funcionam dentro de um deles diretamente, sem invólucro. O `serializeForm()` preenche a única lacuna real: transformar um envio num objeto simples.
