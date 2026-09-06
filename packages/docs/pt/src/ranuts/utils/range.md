# range

Mantém um número dentro de um mínimo e um máximo dados.

## API

### range

#### Retorna

| Argumento | Descrição           | Tipo     |
| --------- | ------------------- | -------- |
| `number`  | O número já contido | `number` |

#### Parâmetros

| Parâmetro | Descrição         | Tipo     | Padrão      |
| --------- | ----------------- | -------- | ----------- |
| `num`     | O número a conter | `number` | Obrigatório |
| `min`     | Valor mínimo      | `number` | `0`         |
| `max`     | Valor máximo      | `number` | `1`         |

## Exemplo

### Uso básico

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (contido no máximo)
console.log(range(-5, 0, 10)); // 0 (contido no mínimo)
```

### Conter uma porcentagem

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### Uma faixa própria

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (fora da faixa, então é contido)
```

### Conter um valor de cor

```js
import { range } from 'ranuts';

const red = 300; // um valor RGB deveria ir de 0 a 255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## Notas

1. **Como contém**: se o número for menor que o mínimo, devolve o mínimo; se for maior que o máximo, devolve o máximo; fora isso, devolve o valor como está.
2. **Faixa padrão**: de 0 a 1, cômoda para porcentagens e proporções.
3. **Quando usar**: é comum para limitar o que a pessoa digita e para calcular valores de progresso ou de cor.

## Interpolação e remapeamento

Interpolação e remapeamento de faixas ao estilo dos shaders: as mesmas peças que o `mix`, o `clamp` e o `smoothstep` do GLSL oferecem. Servem para suavizar animações, para levar uma posição de rolagem até uma opacidade, ou para converter entre faixas numéricas sem relação entre si.

### clamp

Faz o mesmo que o `range` acima, mas com a ordem de argumentos do GLSL: `clamp(value, min, max)` contra `range(num, min, max)`. Foi acrescentado junto com o resto deste grupo por coerência; escolha a ordem que ler melhor onde você escrever.

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` interpola de `a` para `b` conforme `t` (`t=0` → `a`, `t=1` → `b`). `inverseLerp(a, b, value)` é o inverso: dado um `value` entre `a` e `b`, diz onde ele fica, de `0` a `1`. Nenhuma das duas contém: se `value` cair fora de `[a, b]`, `t` (ou o resultado) sai de `0..1`.

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — não é contido
```

#### Parâmetros

| Função                     | Parâmetro | Descrição             | Tipo     |
| -------------------------- | --------- | --------------------- | -------- |
| `lerp(a, b, t)`            | `a`, `b`  | Valor inicial e final | `number` |
|                            | `t`       | Fator de interpolação | `number` |
| `inverseLerp(a, b, value)` | `a`, `b`  | Valor inicial e final | `number` |
|                            | `value`   | O valor consultado    | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` leva `value` de `[a1, a2]` para `[b1, b2]` de forma linear, sem conter. `fit` é a versão que contém: o mesmo remapeamento e, depois, contido na faixa de saída.

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — fora de [0,10], logo também fora de [0,100]

fit(15, 0, 10, 0, 100); // 100 — contido na faixa de saída
```

### linearstep / smoothstep

As duas sobem de `0` a `1` conforme `x` vai de `edge0` a `edge1`, e contêm fora desse trecho. `linearstep` é uma reta; `smoothstep` é a curva de Hermite suavizada do GLSL (`3t² - 2t³`), uma entrada e saída suaves em vez de uma rampa reta, e a escolha usual para animações e para os esmaecimentos de um shader.

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5 (o meio coincide; a curva difere no resto)
smoothstep(0, 1, 0.1); // 0.028 — suavizado, demora mais a sair do 0 que o 0.1 do linearstep
```

#### Notes

1. **Não contêm: `lerp`, `inverseLerp`, `remap`.** Dê a elas um `value` ou um `t` fora da faixa esperada e você recebe um resultado extrapolado, não um erro nem um valor contido.
2. **Contêm: `fit`, `linearstep`, `smoothstep`.** Estas três devolvem sempre um valor dentro da faixa de saída.
3. `linearstep(edge0, edge1, x)` com `edge0 === edge1` devolve `0` para `x < edge0` e `1` nos demais casos, em vez de dividir por zero.
