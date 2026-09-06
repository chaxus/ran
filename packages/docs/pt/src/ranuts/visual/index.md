# visual

Um motor de desenho 2D ao estilo do PixiJS. Monte um grafo de cena com formas e desenhe-o por um de três motores de fundo (Canvas2D, WebGL ou WebGPU), escolhido em tempo de execução.

O motor é feito em camadas: **`Application`** (ciclo de vida e laço de desenho), abaixo o **`Renderer`** (o motor de fundo), e então um grafo de cena que vai de **`Container`** (um grupo) até **`Graphics`** (algo desenhável). Você acrescenta nós ao `app.stage` e o renderizador os desenha.

> **Só navegador.** O `ranuts/visual` precisa de um `HTMLCanvasElement` de verdade e de um contexto de GPU ou de Canvas. No Node ele não roda.

## Importar

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## Primeiros passos

Crie uma aplicação, desenhe um retângulo com preenchimento e contorno mais um círculo, e ponha o laço de desenho para rodar.

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create é assíncrono: o motor de fundo do WebGPU inicializa o dispositivo
// de forma assíncrona e isso precisa terminar antes do primeiro desenho.
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// Um retângulo: preenchimento vermelho e contorno azul de 4px.
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// Um círculo.
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// Acrescente os desenháveis ao stage, o ancestral de tudo o que é desenhado.
app.stage.addChild(rect);
app.stage.addChild(circle);

// Põe o laço do requestAnimationFrame para rodar (ou chame app.render() para um quadro só).
app.start();
```

## API

### `Application`

O ponto de entrada do motor. Ele é dono do canvas, do renderizador e da raiz do grafo de cena (`stage`).

Prefira a fábrica assíncrona **`Application.create(...)`** ao `new Application(...)`: o motor de fundo do WebGPU inicializa o dispositivo de forma assíncrona e isso precisa terminar antes do primeiro desenho. Canvas e WebGL resolvem na hora, então a fábrica é segura e uniforme para os três.

#### `Application.create(options)`

`static async`. Constrói uma `Application` e espera a inicialização assíncrona do renderizador.

##### Parâmetros

| Parâmetro | Descrição                           | Tipo                  | Padrão      |
| --------- | ----------------------------------- | --------------------- | ----------- |
| `options` | Opções de configuração da aplicação | `IApplicationOptions` | Obrigatório |

##### Devolve

| Valor                  | Descrição                   | Tipo                   |
| ---------------------- | --------------------------- | ---------------------- |
| `Promise<Application>` | A aplicação já inicializada | `Promise<Application>` |

#### Properties

| Propriedade   | Descrição                                                                     | Tipo                |
| ------------- | ----------------------------------------------------------------------------- | ------------------- |
| `stage`       | A raiz do grafo de cena. Acrescente aqui todo nó que você quer ver desenhado. | `Container`         |
| `view`        | O elemento canvas em que se desenha.                                          | `HTMLCanvasElement` |
| `eventSystem` | A distribuição de ponteiro e de eventos, presa ao canvas e ao stage.          | `EventSystem`       |

#### Methods

| Método     | Descrição                                                    | Devolve |
| ---------- | ------------------------------------------------------------ | ------- |
| `render()` | Desenha um único quadro do `stage`.                          | `void`  |
| `start()`  | Põe para rodar o laço de desenho do `requestAnimationFrame`. | `void`  |
| `stop()`   | Para o laço de desenho que o `start()` pôs a rodar.          | `void`  |

#### `IApplicationOptions`

| Campo             | Descrição                                                         | Tipo                | Padrão                 |
| ----------------- | ----------------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | Qual motor de fundo usar. Se for omitido, recai no Canvas.        | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | O canvas de destino. Se for omitido, cria-se um `<canvas>` solto. | `HTMLCanvasElement` | um canvas novo         |
| `backgroundColor` | O fundo do canvas. Aceita qualquer string de cor CSS.             | `string`            | —                      |
| `backgroundAlpha` | Opacidade do fundo, de `0` a `1`.                                 | `number`            | —                      |
| `debug`           | Escreve no console qual motor de fundo foi escolhido.             | `boolean`           | `false`                |

### `Container`

Um nó de agrupamento, a ideia de «grupo» do grafo de cena. Guarda filhos e o estado de transformação, mas ele mesmo não desenha nada; desenháveis como o `Graphics` o estendem. Acrescente um `Container` para montar subárvores que se movem, escalam e giram juntas.

#### Methods

| Método               | Descrição                                                                   | Devolve   |
| -------------------- | --------------------------------------------------------------------------- | --------- |
| `addChild(child)`    | Acrescenta um filho (`Container`) ao fim. Se ele já tinha pai, troca o pai. | `void`    |
| `removeChild(child)` | Tira um filho de `children`.                                                | `void`    |
| `sortChildren()`     | Reordena `children` por `zIndex` (só quando é preciso).                     | `void`    |
| `containsPoint(p)`   | Verifica se um `Point` cai dentro do `hitArea` deste nó.                    | `boolean` |

#### Propriedades de transformação e exibição

Elas moram no nó base comum (`Vertex`) e estão disponíveis em qualquer `Container` ou `Graphics`.

| Propriedade        | Descrição                                                               | Tipo                     |
| ------------------ | ----------------------------------------------------------------------- | ------------------------ |
| `children`         | Os nós filhos (array só de leitura).                                    | `Container[]`            |
| `parent`           | O nó pai, se estiver preso.                                             | `Container \| undefined` |
| `x` / `y`          | A posição, no sistema de coordenadas do pai.                            | `number`                 |
| `position`         | O ponto de posição (`{ x, y }`).                                        | `ObservablePoint`        |
| `scale`            | O ponto de escala (`{ x, y }`).                                         | `ObservablePoint`        |
| `pivot`            | O ponto de pivô para giro e escala.                                     | `ObservablePoint`        |
| `skew`             | O ponto de inclinação.                                                  | `ObservablePoint`        |
| `rotation`         | Giro em **radianos**.                                                   | `number`                 |
| `angle`            | Giro em **graus** (anda junto com `rotation`).                          | `number`                 |
| `alpha`            | Opacidade do nó, de `0` a `1` (vai se multiplicando árvore abaixo).     | `number`                 |
| `visible`          | Com `false`, o nó e sua subárvore são pulados.                          | `boolean`                |
| `zIndex`           | A ordem de desenho entre irmãos.                                        | `number`                 |
| `hitArea`          | Forma opcional usada nos testes de acerto.                              | `Shape \| null`          |
| `cursor`           | O jeito do cursor quando ele aponta para o nó.                          | `Cursor`                 |
| `structureVersion` | Versão da estrutura da cena (só na raiz); guia o rastreio do que mudou. | `number`                 |

### `Graphics`

Um desenhável que estende o `Container`. Defina um preenchimento, um estilo de linha ou ambos, e depois chame um método de forma. Quase todos os métodos devolvem `this`, então as chamadas encadeiam.

#### Estilo

| Método                             | Descrição                                                                               | Devolve    |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | Começa a preencher com `color` (string CSS, padrão `'#000000'`) e `alpha` (padrão `1`). | `Graphics` |
| `endFill()`                        | Para de preencher.                                                                      | `Graphics` |
| `lineStyle(width, color?, alpha?)` | Define o contorno: `width` px, `color` (padrão `'#000000'`), `alpha` (padrão `1`).      | `Graphics` |
| `lineStyle(options)`               | Define o contorno a partir de um objeto `ILineStyleOptions`.                            | `Graphics` |
| `resetLineStyle()`                 | Devolve o contorno atual aos valores padrão.                                            | `void`     |

#### Formas

| Método                                         | Descrição                                                          | Devolve    |
| ---------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| `drawRect(x, y, width, height)`                | Retângulo.                                                         | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | Retângulo de cantos arredondados.                                  | `Graphics` |
| `drawCircle(x, y, radius)`                     | Círculo com centro em `(x, y)`.                                    | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | Elipse com centro em `(x, y)`.                                     | `Graphics` |
| `drawPolygon(points)`                          | Polígono fechado a partir de um array plano `[x0, y0, x1, y1, …]`. | `Graphics` |

#### Traçados

| Método                                                      | Descrição                                                        | Devolve    |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | Começa um subtraçado novo em `(x, y)`.                           | `Graphics` |
| `lineTo(x, y)`                                              | Linha reta até `(x, y)`.                                         | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | Curva de Bézier quadrática (partida em segmentos).               | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | Curva de Bézier cúbica (partida em segmentos).                   | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | Arco de circunferência.                                          | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | Arco tangente às duas retas que passam pelos pontos de controle. | `Graphics` |
| `closePath()`                                               | Fecha o subtraçado atual.                                        | `Graphics` |
| `clear()`                                                   | Apaga toda a geometria e devolve os estilos ao estado inicial.   | `Graphics` |
| `containsPoint(p)`                                          | Verifica se um `Point` cai dentro da geometria desenhada.        | `boolean`  |

#### `IFillStyleOptions`

| Campo     | Descrição                                 | Tipo      | Padrão      |
| --------- | ----------------------------------------- | --------- | ----------- |
| `color`   | Cor de preenchimento (qualquer cor CSS).  | `string`  | `'#ffffff'` |
| `alpha`   | Opacidade do preenchimento, de `0` a `1`. | `number`  | `1`         |
| `visible` | Se o preenchimento é desenhado.           | `boolean` | `false`     |

#### `ILineStyleOptions`

Estende `IFillStyleOptions` e acrescenta:

| Campo   | Descrição                         | Tipo        | Padrão            |
| ------- | --------------------------------- | ----------- | ----------------- |
| `width` | Espessura do contorno, em px.     | `number`    | `0`               |
| `cap`   | O acabamento das pontas da linha. | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | A junção entre linhas.            | `LINE_JOIN` | `LINE_JOIN.MITER` |

### Enumerações

#### `RENDERER_TYPE`

Escolhe o motor de fundo de desenho por meio de `IApplicationOptions.prefer`.

| Membro    | Valor      | Descrição                           |
| --------- | ---------- | ----------------------------------- |
| `CANVAS`  | `'canvas'` | Motor de fundo Canvas2D (o padrão). |
| `WEB_GL`  | `'webgl'`  | Motor de fundo WebGL.               |
| `WEB_GPU` | `'webgpu'` | Motor de fundo WebGPU.              |

#### `SHAPE_TYPE`

Os tipos de forma que os métodos de desenho do `Graphics` produzem.

| Membro              | Valor                 |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| Membro   | Valor      |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| Membro  | Valor     |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### Constantes

| Constante          | Valor   | Descrição                                                      |
| ------------------ | ------- | -------------------------------------------------------------- |
| `MAX_VERTEX_COUNT` | `65536` | Número máximo de vértices que cada buffer de lote aceita.      |
| `BYTES_PER_VERTEX` | `12`    | Bytes por vértice (2 `Float32` de posição e 4 `Uint8` de cor). |

## Motores de fundo

O motor de fundo é escolhido por `IApplicationOptions.prefer` (um `RENDERER_TYPE`); se for omitido, usa-se o Canvas.

- O **`CANVAS`** desenha direto pela API do Canvas2D (`fillRect`, `arc`, `ctx.stroke()`, …).
- O **`WEB_GL`** e o **`WEB_GPU`** compartilham a mesma esteira `BatchRenderer`: as formas são partidas em triângulos, empacotadas num único buffer de vértices intercalado e desenhadas numa chamada só.

Os três aceitam **qualquer cor CSS**: hexadecimal (`#rgb` ou `#rrggbb`), cores com nome, `rgb()` e `hsl()` são todas resolvidas do mesmo jeito.

> **A geometria do contorno muda conforme o motor de fundo, e isso é de propósito.** No Canvas, as pontas e as junções de linha são desenhadas pelo `ctx.stroke()` nativo do navegador; no WebGL e no WebGPU, por uma triangulação própria. Os dois não coincidem pixel a pixel.
