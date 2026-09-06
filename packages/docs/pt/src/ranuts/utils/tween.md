# Funções de suavização (tween)

Sete famílias de suavização, cada uma com sua forma `easeIn` e sua forma `easeOut`. São matemática pura: sem DOM e sem um laço de animação próprio. Você entrega o tempo atual a partir do seu próprio quadro e recebe de volta o valor que aquele quadro deve usar.

Os parâmetros seguem a convenção clássica de Robert Penner:

- `t`: tempo atual (quanto já passou)
- `b`: valor inicial
- `c`: variação do valor (o valor final é `b + c`)
- `d`: duração

Todas as funções limitam por dentro em `t >= d`, então chamá-las depois do fim devolve o valor final em vez de extrapolar para fora da faixa.

## Uso

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // de 0 a 300 em 600 ms
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## Curvas disponíveis

| Exportação | Curva             | Sensação                                    |
| ---------- | ----------------- | ------------------------------------------- |
| `quad`     | quadrática (`t²`) | A aceleração mais suave; uma escolha segura |
| `cubic`    | cúbica (`t³`)     | Bem mais viva que a `quad`                  |
| `quart`    | quártica (`t⁴`)   | Aceleração forte                            |
| `quint`    | quíntica (`t⁵`)   | Muito forte; o fim domina o movimento       |
| `sine`     | senoidal          | A mais suave de todas, quase não se percebe |
| `expo`     | exponencial       | Quase parada, e de repente dispara          |
| `circ`     | circular          | Começo lento, fim muito abrupto             |

## API

Todas as exportações têm a mesma forma:

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### Parâmetros

| Parâmetro | Descrição                           | Tipo     | Padrão      |
| --------- | ----------------------------------- | -------- | ----------- |
| `t`       | Tempo decorrido                     | `number` | Obrigatório |
| `b`       | Valor inicial                       | `number` | Obrigatório |
| `c`       | Variação do valor (o fim é `b + c`) | `number` | Obrigatório |
| `d`       | Duração                             | `number` | Obrigatório |

#### Retorna

| Argumento | Descrição               | Tipo     |
| --------- | ----------------------- | -------- |
| `value`   | O valor no instante `t` | `number` |

## Notas

`easeIn` começa devagar e acelera; `easeOut` começa rápido e freia. Numa interface que responde a uma ação da pessoa, `easeOut` costuma ficar melhor: o elemento se move na hora e assenta, em vez de hesitar primeiro.

Com agradecimento a [zhangxinxu/Tween](https://github.com/zhangxinxu/Tween).
