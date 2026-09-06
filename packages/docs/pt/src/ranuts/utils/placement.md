# computePlacement

Posiciona um painel flutuante (menu suspenso, popover, dica) em relação ao retângulo de uma âncora: se falta espaço no lado preferido e sobra no oposto, ele vira para o oposto e depois desliza pelo eixo transversal para não sair de um limite. Faz o mesmo que os middleware `flip` e `shift` do Floating UI, sem a dependência.

Geometria pura: nunca toca no DOM. Você passa resultados de `getBoundingClientRect()` e ele devolve as coordenadas a escrever.

## Uso

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` é o lado de fato usado, já com a virada aplicada; use-o para escolher
// a classe de animação de entrada ou a direção da seta.
```

## API

### computePlacement

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| ------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `options.anchor` | Retângulo da âncora (o gatilho), em coordenadas da viewport (por exemplo, `getBoundingClientRect()`) | `{ top, left, width, height }` | Obrigatório |
| `options.floating` | O tamanho do próprio painel flutuante | `{ width, height }` | Obrigatório |
| `options.placement` | Lado preferido. Vira para o oposto quando falta espaço e sobra do outro lado | `'top' \| 'bottom' \| 'left' \| 'right'` | Obrigatório |
| `options.offset` | Folga mantida entre a âncora e o painel flutuante, em px | `number` | `0` |
| `options.boundary` | Região dentro da qual o painel precisa ficar, em coordenadas da viewport | `{ top, left, width, height }` | A viewport da janela |
| `options.padding` | Folga mínima entre o painel e a borda do limite ao deslizá-lo, em px | `number` | `8` |

#### Retorna

| Argumento | Descrição | Tipo |
| ----------- | --------------------------------------------------------- | ---------------------------------------- |
| `top` | O `top` resolvido, no mesmo espaço de coordenadas de `anchor` | `number` |
| `left` | O `left` resolvido, no mesmo espaço de coordenadas de `anchor` | `number` |
| `placement` | O lado de fato usado, já com a virada | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Notas

1. **As coordenadas são sempre relativas à viewport**, o mesmo espaço de `anchor`. Se você posiciona o painel com `position: absolute` em relação ao documento, some você mesmo `scrollX` e `scrollY` ao escrever o estilo (veja o exemplo acima).
2. **Sem diagramação real, sem virada nem deslize.** Quando `anchor` ou `floating` tem largura ou altura zero (jsdom, que nunca diagrama de verdade, ou um painel lido antes de o conteúdo assentar), as contas de espaço «detectariam» uma colisão falsa a cada chamada. Por isso o `computePlacement` pula virada e deslize por inteiro e devolve como está o `placement` que lhe pediram.
3. **O deslize é pulado quando o painel é maior que o próprio limite**: prendê-lo só o empurraria para fora da tela do outro lado.
4. É usado por dentro pelo `r-popover` e pelo `r-select` do `ranui`, para manter na tela um menu suspenso portado para o `body`.
