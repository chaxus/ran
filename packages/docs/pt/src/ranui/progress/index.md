---
description: 'O Progress do ranui (<r-progress>) mostra o avanço de uma tarefa como uma barra, com um puxador arrastável opcional.'
---

# Progress

Barra de progresso para mostrar o avanço de uma tarefa, com um puxador arrastável opcional.

> **Use quando** precisar de uma barra que mostre o avanço de uma tarefa. Use o `<r-progress>` como está para progresso somente leitura, ou `type="drag"` quando o usuário precisar definir o valor por um puxador arrastável.

## Início rápido

<ran-demo>
  <r-progress percent="40%"></r-progress>
</ran-demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **Dica**: `r-progress` é um elemento de bloco sem largura intrínseca. Dentro de uma linha flex ele pode colapsar para largura zero; dê a ele uma largura explícita (por exemplo `style="width:100%"`) ou coloque-o num contexto de bloco.

## Referência da API

### Propriedades

| Propriedade | Tipo     | Padrão      | Descrição                                                              |
| ----------- | -------- | ----------- | ---------------------------------------------------------------------- |
| `percent`   | `string` | `'0'`       | Progresso atual; aceita número ou porcentagem. Limitado por `total`.   |
| `total`     | `string` | `'100'`     | Progresso total; aceita número ou porcentagem.                         |
| `type`      | `string` | `'primary'` | Tipo da barra: `primary` (estática) ou `drag` (clicável / arrastável). |
| `dot`       | `string` | `'true'`    | Se o puxador de arraste aparece: `true` ou `false`.                    |
| `sheet`     | `string` | `''`        | CSS injetado no shadow DOM do componente.                              |

### Valor do progresso `percent`

Define o progresso atual. Aceita um número ou uma string de porcentagem e não pode passar de `total`. Quando `total` não é definido, o padrão é `100` (ou seja, `percent` é lido como porcentagem de 100).

<ran-demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### Progresso total `total`

Define o denominador de `percent`. Números e porcentagens são aceitos, então `percent="30" total="1000"` preenche a barra em 3%.

<ran-demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### Tipo da barra `type`

- `primary`: barra de progresso estática. É o padrão quando `type` não é definido.
- `drag`: barra clicável e arrastável. Clicar na trilha ou arrastar o puxador atualiza `percent` e dispara um evento `change`. Arrastar o puxador exige `dot="true"`.

<ran-demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### Puxador de arraste `dot`

Liga e desliga o puxador. Ele só é desenhado quando `dot="true"` **e** `type="drag"`; numa barra `primary` estática é omitido de propósito, então ali `dot` não tem efeito visível.

<ran-demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## Eventos

### `change`

Despachado no tipo `drag` sempre que o usuário clica na trilha ou arrasta o puxador, atualizando `percent`. O objeto `detail` carrega:

| Campo     | Tipo     | Descrição       |
| --------- | -------- | --------------- |
| `value`   | `string` | Progresso atual |
| `percent` | `string` | Progresso atual |
| `total`   | `string` | Progresso total |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## Partes CSS

| Parte   | Descrição                        |
| ------- | -------------------------------- |
| `track` | A trilha do progresso (o fundo). |
| `fill`  | A porção preenchida da trilha.   |
| `dot`   | O puxador de arraste.            |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## Boas práticas

- **Barras estáticas**: use o `type="primary"` padrão para exibir progresso somente leitura.
- **Barras interativas**: use `type="drag"` quando o usuário puder definir o valor, e escute o evento `change`.
- **Porcentagem ou número**: combine `percent` e `total` à vontade, passando números crus quando corresponderem a um total conhecido, ou porcentagens para controle direto.
- **Largura no layout**: envolva a barra num contêiner de bloco ou defina uma largura explícita para que ela não colapse em layouts flex.
