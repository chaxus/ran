---
description: 'Uma saída de rota que mostra o conteúdo do slot apenas enquanto o caminho atual casa com um padrão, para usar dentro do r-router.'
---

# Route

Um elemento de saída de rota. Colocado dentro de um [`r-router`](../router/), ele mostra o conteúdo do slot quando o caminho atual casa com o padrão de `path` e o esconde caso contrário.

> **Use quando** precisar de uma saída de rota que mostre o conteúdo apenas enquanto o caminho atual casa com um padrão (com suporte a `:param` e `*`). Coloque o `<r-route>` dentro de um `<r-router>` para montar uma troca de views no cliente.

## Início rápido

### Uso básico

Um `r-route` cujo `path` é `/` casa com o caminho padrão, então o conteúdo dele aparece sozinho:

<Demo>
  <r-route path="/">
    <p>Este conteúdo aparece quando o caminho atual casa.</p>
  </r-route>
</Demo>

```html
<r-route path="/">
  <p>Este conteúdo aparece quando o caminho atual casa.</p>
</r-route>
```

### Dentro de um roteador

Usadas dentro de um [`r-router`](../router/), várias rotas funcionam como uma chave: o roteador sincroniza cada filho `r-route` na navegação, exibindo aqueles cujo `path` casa e escondendo o resto:

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

O contêiner `r-router` e a API JavaScript `createRouter` / `RouterCore` (navegação, guardas, transições de view) estão documentados na [página do Router](../router/).

## Referência da API

### Propriedades

| Propriedade | Tipo                     | Padrão  | Descrição                                                               |
| ----------- | ------------------------ | ------- | ----------------------------------------------------------------------- |
| `path`      | `string`                 | `'/'`   | Padrão comparado ao caminho atual. Aceita segmentos `:param` e `*`      |
| `exact`     | `boolean`                | `false` | Somente leitura. Com o atributo `exact` presente, exige casamento exato |
| `params`    | `Record<string, string>` | `{}`    | Somente leitura. Os parâmetros capturados no casamento atual            |
| `sheet`     | `string`                 | `''`    | CSS injetado no shadow DOM do componente                                |

### Casamento de caminho `path`

O `path` é dividido por `/` e compilado numa expressão regular, segmento a segmento:

- um segmento começando por `:` captura um parâmetro nomeado (casa com um segmento do caminho)
- um segmento `*` casa com todo o restante do caminho
- qualquer outro segmento casa literalmente

Sem `exact`, o padrão casa com o caminho como **prefixo** (segmentos finais são permitidos). Com `exact`, só um casamento completo é aceito.

```
/users            casa com /users, /users/42, /users/42/profile
/users (exact)    casa apenas com /users
/users/:id        captura :id → params.id
/*                casa com tudo
```

Leia os parâmetros capturados na propriedade somente leitura `params` (cada valor vem decodificado com `decodeURIComponent`):

```js
const route = document.createElement('r-route');
route.path = '/users/:id';
router.append(route);
route.params; // p. ex. { id: '42' } assim que o roteador casa esta rota
```

### Casamento exato `exact`

Atributo booleano. Quando presente, a saída casa apenas com um caminho exato (sem casamento por prefixo): `path="/users" exact` casa com `/users`, mas não com `/users/42`.

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### CSS externo `sheet`

CSS injetado no shadow DOM do componente, seguindo a mesma convenção `sheet` de todos os outros componentes do ranui.

### Slots

O slot padrão (sem nome) guarda o conteúdo exibido enquanto a rota está ativa. Quando o caminho não casa, o host recebe `hidden` e o conteúdo não aparece.

```html
<r-route path="/about">
  <!-- slot padrão: exibido apenas enquanto /about está ativo -->
  <h2>About</h2>
</r-route>
```

## Eventos

### `routematch`

Dispara quando esta saída se torna ativa (o `path` dela casa com o caminho atual). Ele **borbulha**. `event.detail` é `{ path, params }`:

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  // Escute antes de montar uma rota construída do mesmo jeito
  const route = document.createElement('r-route');
  route.path = '/users/:id';
  route.addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
  router.append(route);
</script>
```

## Estilos

O `r-route` não expõe identificadores `::part()` nem variáveis CSS `--ran-route-*` próprias. O host é um elemento `display: block` comum que colapsa para `display: none` enquanto está escondido. Use o atributo `sheet` ou estilize o host diretamente para personalizá-lo.

Importe com `import 'ranui'` (registra todos os componentes) ou com o independente `import 'ranui/route'`.

## Boas práticas

- **Monte dentro do `r-router`**: o `r-route` só alterna na navegação quando tem um ancestral [`r-router`](../router/) para sincronizá-lo.
- **Use `exact` na raiz**: dê ao `path="/"` o atributo `exact` para que ele não case por prefixo com todas as outras rotas.
- **Ordene do específico ao geral**: coloque por último uma rota coringa `path="/*"`, já que uma rota sem `exact` casa pelo prefixo.
- **Leia `params`, não analise a URL**: capture os segmentos dinâmicos com `:param` e leia-os da propriedade `params`.
- **Reaja à ativação com `routematch`**: use o evento `routematch`, que borbulha, para disparar o carregamento de dados quando uma rota fica ativa.
