---
description: 'Um gráfico de radar (ou de teia) para comparar várias métricas de um mesmo conjunto de dados num canvas 2D.'
---

# Radar

Gráfico de radar para comparar várias métricas de um mesmo conjunto de dados num canvas bidimensional.

> **Use quando** precisar de um gráfico de radar para comparar várias métricas de um conjunto de dados. Passe ao `<r-radar>` um array JSON de nomes de eixo e pontuações pelo atributo `abilitys`.

## Início rápido

### Uso básico

Os dados vêm pelo atributo `abilitys` como uma **string JSON** (um array de objetos). Como atributos HTML só podem guardar strings, o valor precisa ser JSON válido; ele é analisado internamente com `JSON.parse`. O host `<r-radar>` não tem tamanho próprio, então dê a ele largura e altura explícitas.

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

Você também pode definir os dados de forma imperativa pela propriedade JS `abilitys`, que aceita um array (convertido de volta em string no atributo) ou uma string JSON:

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: 'Vida', scoreRate: 10 },
  { abilityName: 'Ataque', scoreRate: 90 },
  { abilityName: 'Defesa', scoreRate: 20 },
];
chart.append(radar);
```

## Referência da API

### Propriedades

| Propriedade    | Tipo               | Padrão                                       | Descrição                                                        |
| -------------- | ------------------ | -------------------------------------------- | ---------------------------------------------------------------- |
| `abilitys`     | `string` / `Array` | `''`                                         | Dados do gráfico como string JSON (ou array pela propriedade JS) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | Cor dos polígonos concêntricos da grade                          |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | Cor dos eixos e da borda externa                                 |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | Cor de preenchimento da região de dados                          |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | Cor do contorno da região e dos pontos de vértice                |
| `sheet`        | `string`           | `''`                                         | CSS injetado no shadow DOM do componente                         |

Cada entrada do array `abilitys` aceita estas chaves:

| Chave             | Tipo     | Obrigatória | Descrição                                               |
| ----------------- | -------- | ----------- | ------------------------------------------------------- |
| `abilityName`     | `string` | Sim         | Texto do rótulo do eixo                                 |
| `scoreRate`       | `number` | Sim         | Valor naquele eixo; a grade vai no máximo até `100`     |
| `backgroundColor` | `string` | Não         | Cor de fundo do rótulo (padrão transparente)            |
| `fontSize`        | `number` | Não         | Tamanho da fonte do rótulo (padrão escalado ao gráfico) |
| `fontColor`       | `string` | Não         | Cor do texto do rótulo (padrão `--ran-color-text`)      |
| `fontFamily`      | `string` | Não         | Família tipográfica do rótulo (padrão `SimHei`)         |

> Nota: `colorPolygon`, `colorLine`, `fillColor` e `strokeColor` são lidos sem diferenciar maiúsculas, então desenham certo tanto se o atributo já estiver lá quanto se mudar depois da montagem; atualizar qualquer um deles redesenha o gráfico. Para um estilo que siga o tema, prefira as variáveis CSS mais abaixo.

### Dados do gráfico `abilitys`

O estilo do rótulo por eixo (`backgroundColor`, `fontSize`, `fontColor`) pode ser definido em entradas específicas:

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Vida","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Vida","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

### Cor da grade `colorPolygon`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

### Cor dos eixos `colorLine`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

### Preenchimento da região `fillColor`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

### Contorno da região `strokeColor`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defesa","scoreRate":"20"},{"abilityName":"Maestria elemental","scoreRate":"50"},{"abilityName":"Chance de crítico","scoreRate":"80"},{"abilityName":"Dano crítico","scoreRate":"50"}]'
></r-radar>
```

### Dados de exemplo completos

Como um `attribute` de HTML só consegue carregar uma `string`, os dados que você passa precisam ser uma string `json`, convertida de volta num array de objetos com `JSON.parse`; um `JSON` malformado não pode ser analisado:

```json
[
  {
    "abilityName": "Vida",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "Ataque",
    "scoreRate": "90"
  },
  {
    "abilityName": "Defesa",
    "scoreRate": "20"
  },
  {
    "abilityName": "Maestria elemental",
    "scoreRate": "50"
  },
  {
    "abilityName": "Chance de crítico",
    "scoreRate": "80"
  },
  {
    "abilityName": "Dano crítico",
    "scoreRate": "50"
  }
]
```

### Variáveis CSS

As cores do gráfico também podem ser definidas (de forma reativa ao tema) por propriedades personalizadas de CSS no host:

| Variável                    | Padrão                                | Descrição                         |
| --------------------------- | ------------------------------------- | --------------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | Cor da grade                      |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | Cor dos eixos                     |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | Preenchimento da região de dados  |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | Contorno da região de dados       |
| `--ran-radar-width`         | `100%`                                | Largura do contêiner do canvas    |
| `--ran-radar-height`        | `100%`                                | Altura do contêiner do canvas     |
| `--ran-radar-display`       | `block`                               | `display` do contêiner do canvas  |
| `--ran-radar-position`      | `relative`                            | `position` do contêiner do canvas |

A cor do texto dos rótulos também recorre ao token de tema `--ran-color-text`, então os rótulos continuam legíveis nos modos claro e escuro.

## Eventos

Nenhum. O `<r-radar>` não despacha eventos personalizados.

## Boas práticas

- **Dimensionamento**: o host não tem tamanho próprio; sempre defina `width`/`height` explícitos (pelo `style` ou pelas variáveis `--ran-radar-width`/`--ran-radar-height`). O gráfico se redesenha sozinho quando o contêiner muda de tamanho, via `ResizeObserver`.
- **Formato dos dados**: passe JSON válido em `abilitys`; JSON malformado é registrado e não pode ser analisado. Use a propriedade JS `abilitys` quando trabalhar com arrays de verdade no código.
- **Escala**: `scoreRate` é medido contra um máximo fixo de `100`; normalize seus valores para essa faixa.
- **Temas**: os atributos de cor (`colorPolygon`, `colorLine`, `fillColor`, `strokeColor`) são reativos e redesenham o gráfico quando mudam após a montagem. Prefira as variáveis CSS `--ran-radar-*` quando quiser que as cores sigam sozinhas o tema claro ou escuro.
