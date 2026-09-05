---
description: 'O Skeleton do ranui (<r-skeleton>) exibe um espaço reservado com brilho que ocupa o lugar do conteúdo enquanto ele carrega.'
---

# Skeleton

Gráfico de espaço reservado que ocupa o lugar do conteúdo enquanto ele carrega, com uma animação de brilho.

> **Use quando** precisar de uma barra reservada com brilho para segurar o espaço do conteúdo durante o carregamento. Dimensione o pai do `<r-skeleton>` para casar com o conteúdo real e troque-o quando os dados chegarem.

## Início rápido

### Uso básico

O esqueleto se estica para ocupar a largura do elemento pai e tem `16px` de altura por padrão.

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### A largura segue o pai

Como o esqueleto é `width: 100%`, controle o comprimento dele dimensionando o contêiner em que ele vive.

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### Empilhar espaços reservados

Combine vários esqueletos para imitar um bloco de texto ou um parágrafo.

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## Referência da API

### Propriedades

| Propriedade | Tipo     | Padrão | Descrição                                                          |
| ----------- | -------- | ------ | ------------------------------------------------------------------ |
| `sheet`     | `string` | `''`   | CSS injetado no shadow DOM do componente para sobrescrever estilos |

### Estilo próprio `sheet`

Passe uma string de CSS por `sheet` para sobrescrever a aparência do esqueleto dentro do shadow DOM dele.

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### Variáveis CSS

O esqueleto também expõe propriedades personalizadas de CSS para temas sem `sheet`:

| Variável                                    | Padrão                         | Descrição                         |
| ------------------------------------------- | ------------------------------ | --------------------------------- |
| `--ran-skeleton-height`                     | `16px`                         | Altura da barra                   |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | Cor de fundo base (sem brilho)    |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | Raio dos cantos                   |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | Gradiente do reflexo em movimento |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | Duração de uma passada do brilho  |

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## Eventos

Nenhum. O esqueleto não despacha eventos personalizados.

## Slots

Nenhum. O esqueleto desenha apenas a própria barra e não projeta conteúdo de slots.

## Boas práticas

- **Case com o layout**: dimensione o contêiner pai para que cada esqueleto tenha a largura do conteúdo real que ele representa.
- **Imite a forma**: empilhe vários esqueletos com espaçamentos consistentes para representar texto de várias linhas ou linhas de uma lista.
- **Use variáveis para temas**: prefira as variáveis CSS `--ran-skeleton-*` para ajustes simples; use `sheet` apenas quando precisar de seletores que as variáveis não cobrem.
- **Troque ao carregar**: substitua os esqueletos pelo conteúdo real assim que os dados chegarem, em vez de deixá-los animando indefinidamente.
