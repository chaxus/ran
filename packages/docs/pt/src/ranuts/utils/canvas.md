# Geometria para Canvas 2D

Construtores de traçado e contas de ângulo para o Canvas 2D. Toda função de traçado **apenas monta o traçado**; ela nunca chama `fill()` nem `stroke()`, então quem a usa decide como pintar.

## Uso

```ts
import { roundRectByArc, getLinearGradient } from 'ranuts/utils';

const ctx = canvas.getContext('2d')!;

roundRectByArc(ctx, 10, 10, 200, 80, 12);
ctx.fillStyle = getLinearGradient(ctx, 10, 10, 200, 80, 'linear-gradient(90deg, #06f, #0cf)');
ctx.fill();
```

## API

### getAngle

De graus para radianos.

#### Parâmetros

| Parâmetro | Descrição       | Tipo     | Padrão      |
| --------- | --------------- | -------- | ----------- |
| `deg`     | Ângulo em graus | `number` | Obrigatório |

#### Retorna

| Argumento | Descrição          | Tipo     |
| --------- | ------------------ | -------- |
| `rad`     | Ângulo em radianos | `number` |

### getArcPointerByDeg

O ponto da circunferência que corresponde a um ângulo.

#### Parâmetros

| Parâmetro | Descrição          | Tipo     | Padrão      |
| --------- | ------------------ | -------- | ----------- |
| `deg`     | Ângulo em radianos | `number` | Obrigatório |
| `r`       | Raio               | `number` | Obrigatório |

#### Retorna

| Argumento | Descrição | Tipo               |
| --------- | --------- | ------------------ |
| `point`   | `[x, y]`  | `[number, number]` |

### getTangentByPointer

A reta tangente num ponto da circunferência.

#### Parâmetros

| Parâmetro | Descrição    | Tipo     | Padrão      |
| --------- | ------------ | -------- | ----------- |
| `x`       | Coordenada x | `number` | Obrigatório |
| `y`       | Coordenada y | `number` | Obrigatório |

#### Retorna

| Argumento | Descrição                  | Tipo            |
| --------- | -------------------------- | --------------- |
| `line`    | `[inclinação, intercepto]` | `Array<number>` |

### roundRectByArc

Traça um retângulo de cantos arredondados. Um raio maior que a metade do lado mais curto é **cortado nessa metade**, de modo que cantos vizinhos nunca se sobrepõem.

#### Parâmetros

| Parâmetro | Descrição             | Tipo                       | Padrão      |
| --------- | --------------------- | -------------------------- | ----------- |
| `ctx`     | Contexto 2D do canvas | `CanvasRenderingContext2D` | Obrigatório |
| `...rest` | `x, y, w, h, r`       | `number[]`                 | Obrigatório |

#### Retorna

Sem valor de retorno (`void`)

### fanShapedByArc

Traça uma fatia de pizza, incluindo o vão que a separa das outras.

#### Parâmetros

| Parâmetro   | Descrição                      | Tipo                       | Padrão      |
| ----------- | ------------------------------ | -------------------------- | ----------- |
| `ctx`       | Contexto 2D do canvas          | `CanvasRenderingContext2D` | Obrigatório |
| `maxRadius` | Raio externo                   | `number`                   | Obrigatório |
| `start`     | Ângulo inicial em radianos     | `number`                   | Obrigatório |
| `end`       | Ângulo final em radianos       | `number`                   | Obrigatório |
| `gutter`    | Largura do vão entre as fatias | `number`                   | Obrigatório |

#### Retorna

Sem valor de retorno (`void`)

### getLinearGradient

Traduz uma string `linear-gradient(...)` do CSS para um `CanvasGradient` do Canvas.

O `createLinearGradient` só aceita um ponto inicial e um final, enquanto o CSS descreve a direção como um ângulo. Por isso a circunferência é dividida em oito setores de 45° e a tangente devolve o ângulo em forma de coordenadas de início e fim sobre a borda do retângulo. As direções por palavra-chave (`to top`, `to bottom`, `to left`, `to right`) são tratadas diretamente.

#### Parâmetros

| Parâmetro    | Descrição                                       | Tipo                       | Padrão      |
| ------------ | ----------------------------------------------- | -------------------------- | ----------- |
| `ctx`        | Contexto 2D do canvas                           | `CanvasRenderingContext2D` | Obrigatório |
| `x`          | x do canto superior esquerdo do retângulo       | `number`                   | Obrigatório |
| `y`          | y do canto superior esquerdo do retângulo       | `number`                   | Obrigatório |
| `w`          | Largura do retângulo                            | `number`                   | Obrigatório |
| `h`          | Altura do retângulo                             | `number`                   | Obrigatório |
| `background` | por exemplo `linear-gradient(90deg, red, blue)` | `string`                   | Obrigatório |

#### Retorna

| Argumento  | Descrição                                                | Tipo             |
| ---------- | -------------------------------------------------------- | ---------------- |
| `gradient` | Pode ser atribuído direto a `fillStyle` ou `strokeStyle` | `CanvasGradient` |

::: warning
As paradas de cor precisam vir sem unidade (`red 0, blue 1`). Uma parada em porcentagem (`red 50%`) é analisada como `NaN` e o `addColorStop` vai lançar.
:::
