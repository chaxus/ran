---
description: 'O FanGallery do ranui (<r-fan-gallery>) abre os seus filhos em leque como uma mão de cartas: abre com uma mola na primeira vez que entra na vista e levanta o filho sob o ponteiro ou com o foco.'
---

# FanGallery

Abre os seus filhos em leque como uma mão de cartas. Cada filho gira em torno de um ponto
abaixo da linha, por isso o grupo lê-se como um único objeto e não como uma faixa.

> **Use quando** algumas capas, capturas de ecrã ou cartões devem ler-se como um conjunto, e
> mostrar cada um por inteiro importa menos do que mostrar que há vários. Para conteúdo que o
> leitor precise de comparar lado a lado, use uma grelha.

## Início rápido

### Uso básico

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

Os filhos são os seus próprios elementos. Links, botões e imagens mantêm os seus papéis, os seus
nomes e o seu lugar na ordem de tabulação; a galeria apenas os move.

### Abertura

`spread` é o ângulo em graus entre o primeiro e o último filho. `0` deixa-os todos empilhados
uns sobre os outros.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## Movimento

- **Abertura.** Até a galeria entrar na vista pela primeira vez, os filhos ficam empilhados, por
  isso o da frente é legível desde o início. Quando chega, o leque abre com uma mola, um filho
  após o outro. Abre uma vez por página; sair e voltar com o scroll não o repete.
- **Ponteiro e foco.** O filho sob o ponteiro, ou com o foco, levanta-se e passa para a frente, e
  os vizinhos rodam um pouco para o lado. A resposta é imediata, e um gesto novo continua a partir
  de onde o anterior tinha chegado.
- **Movimento reduzido.** Com `prefers-reduced-motion: reduce` o leque está aberto desde o início e
  cada alteração é aplicada sem transição.

## Referência da API

### Propriedades

| Propriedade | Atributo | Tipo     | Padrão | Descrição                                                  |
| ----------- | -------- | -------- | ------ | ---------------------------------------------------------- |
| `spread`    | `spread` | `string` | `'24'` | Ângulo em graus entre o primeiro e o último filho, aberto. |
| `sheet`     | `sheet`  | `string` | `''`   | CSS injetado no shadow root.                               |

### Partes

| Parte   | Elemento                                      |
| ------- | --------------------------------------------- |
| `stage` | A grelha onde todos os filhos são empilhados. |

### Estilos

| Token                       | Padrão           | O que faz                                                         |
| --------------------------- | ---------------- | ----------------------------------------------------------------- |
| `--ran-fan-gallery-padding` | `--ran-space-10` | Espaço à volta do stage para onde rodam os cantos.                |
| `--ran-fan-gallery-pivot`   | `320px`          | A que distância abaixo da linha os filhos giram. Menor abre mais. |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | Quanto o filho sob o ponteiro ou com o foco se desloca para fora. |

A galeria tem a altura do seu filho mais alto. Os cantos rodados ultrapassam o stage, por isso
deixe espaço à volta ou aumente `--ran-fan-gallery-padding`.
