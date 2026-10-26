# spring / stagger / observeEntry

Primitivas de movimento que deixam o desenho com você: uma mola resolvida de forma exata (também como easing CSS `linear()`), atrasos escalonados, uma entrada na tela de disparo único e a preferência de movimento reduzido do leitor. Nenhuma tem laço de animação próprio, então funcionam igualmente com Web Animations, transições CSS ou o seu `requestAnimationFrame`.

## API

### spring(options?)

Retorna `{ at, duration, easing }`. `at(seconds)` é o progresso de 0 a 1 (uma mola subamortecida passa de 1 antes de assentar); `duration` é o tempo até ficar a menos de 0,1% do alvo; `easing` é a mesma curva como string CSS `linear()` nessa duração.

| Opção       | Descrição                                                      | Padrão |
| ----------- | -------------------------------------------------------------- | ------ |
| `stiffness` | Força em direção ao alvo; maior é mais rápido                  | `170`  |
| `damping`   | Resistência; abaixo de `2 * sqrt(stiffness * mass)` ultrapassa | `26`   |
| `mass`      | Inércia                                                        | `1`    |
| `velocity`  | Velocidade inicial, em progresso por segundo                   | `0`    |

### stagger(index, count, options?)

Atraso em segundos do item `index` de `count`, começando pelo primeiro, pelo último ou pelo centro (`from`).

### observeEntry(element, options)

Chama `onEnter` uma vez, quando o topo do elemento passa por `line` (fração da altura da janela a partir do topo), e para de observar. Recebe `{ reduced }`: se for `true`, mostre o estado final sem animar. Retorna uma função para parar antes.

### prefersReducedMotion()

`true` quando o leitor pediu movimento reduzido; `false` onde não há window (SSR, Node).

## Exemplo

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## Notas

1. **O conteúdo aparece sem script.** Anime _a partir de_ um deslocamento com `fill: 'backwards'` em vez de esconder elementos no CSS, assim um script com falha ou o movimento reduzido deixam tudo no lugar.
2. **Sem IntersectionObserver, `observeEntry` entra na hora** em vez de deixar o elemento esperando.
3. **A mola é exata, não por passos,** então as mesmas opções dão a mesma curva em qualquer taxa de quadros.
