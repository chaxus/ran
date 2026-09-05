---
description: 'Uma âncora ciente do roteador que intercepta a navegação dentro do aplicativo e deixa os links externos passarem para o navegador.'
---

# Link

Âncora ciente do roteador que desenha um `<a>` em volta do conteúdo em slot e intercepta a navegação dentro do aplicativo.

> **Use quando** precisar de uma âncora que roteie caminhos internos pelo roteador do ranui e deixe os links externos passarem para o navegador: o `<r-link>` intercepta a navegação interna e faz `push`/`replace` por você.

## Início rápido

### Uso básico

<Demo>
  <r-link href="/getting-started">Primeiros passos</r-link>
</Demo>

```html
<r-link href="/getting-started">Primeiros passos</r-link>
```

Quando um `href` interno é clicado, o link entrega o caminho ao roteador do ranui ativo (`push`, ou `replace` quando o atributo `replace` está presente). Links externos (`https://`, `//`, `mailto:`, `tel:`) e cliques com modificadores (botão do meio, Ctrl/Cmd/Shift/Alt) passam para o navegador como de costume. Quando nenhum roteador está registrado, ele despacha em vez disso um evento `ran-navigate` que borbulha e é `composed`.

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão  | Descrição                                                                                      |
| ----------- | --------- | ------- | ---------------------------------------------------------------------------------------------- |
| `href`      | `string`  | `''`    | Destino da navegação. Caminhos internos são roteados no app; URLs externas navegam normalmente |
| `replace`   | `boolean` | `false` | Quando presente, a navegação interna substitui a entrada atual do histórico (somente leitura)  |
| `sheet`     | `string`  | `''`    | CSS injetado no shadow DOM do link                                                             |

### Destino `href`

Caminhos internos são roteados dentro do app; URLs absolutas e links `mailto:` / `tel:` navegam normalmente.

<Demo>
  <r-link href="/docs">Link interno</r-link>
  <r-link href="https://example.com">Link externo</r-link>
</Demo>

```html
<r-link href="/docs">Link interno</r-link> <r-link href="https://example.com">Link externo</r-link>
```

### Substituir o histórico `replace`

Atributo booleano. Quando presente, a navegação interna substitui a entrada atual do histórico (`router.replace`) em vez de acrescentar uma nova.

<Demo>
  <r-link href="/settings" replace>Substituir entrada</r-link>
</Demo>

```html
<r-link href="/settings" replace>Substituir entrada</r-link>
```

### Estilos externos `sheet`

CSS injetado no shadow DOM do link. Segue a mesma convenção `sheet` de todos os outros componentes do ranui. Como o `<a>` clicável vive dentro do shadow root, use `sheet` para dar a ele um modelo de caixa (`display`, `padding`, `width`) quando quiser que o host pareça um botão ou um cartão.

<Demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">Link com espaçamento</r-link>
</Demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">Link com espaçamento</r-link>
```

## Slots

| Slot     | Descrição                                                     |
| -------- | ------------------------------------------------------------- |
| (padrão) | Conteúdo do link, projetado no `<a>` do shadow (texto ou nós) |

## Eventos

| Evento         | Detail                               | Quando                                                                                    |
| -------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace: boolean }` | Um link interno é clicado e nenhum roteador do ranui está ativo. Borbulha e é `composed`. |

```html
<r-link href="/docs">Docs</r-link>

<script>
  const link = document.createElement('r-link');
  link.href = '/docs';
  link.textContent = 'Docs';
  link.addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
  nav.append(link);
</script>
```

## Boas práticas

- **Navegação interna**: use um `href` relativo à raiz (por exemplo `/docs`) para que o roteador cuide dele dentro do app.
- **Links externos**: URLs absolutas e `mailto:` / `tel:` passam para o navegador; nenhuma configuração extra é necessária.
- **Substituir o histórico**: acrescente `replace` a links que não devem criar uma entrada para o botão voltar (redirecionamentos, troca de abas).
- **Estado ativo**: o host estiliza `:host([active]) a` (negrito + sublinhado), então defina o atributo `active` para marcar o link atual.
- **Como botão ou cartão**: coloque a superfície (fundo, borda, raio) no host e injete o modelo de caixa do `<a>` (`display`, `padding`, `width`) pelo `sheet`, para que toda a área seja clicável.
- **Temas**: o `<a>` lê os tokens globais `--ran-color-link`, `--ran-color-primary` (anel de foco) e `--ran-radius-sm`; sobrescreva esses tokens em vez de esperar variáveis `--ran-link-*` próprias do componente (não existem).
