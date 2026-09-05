---
description: 'A linguagem de design do ranui e a referência completa dos tokens dela: todos os `--ran-*` globais, com a escada de cores do Geist em claro e escuro, os papéis semânticos, espaço, tamanhos, tipografia, raio, elevação, empilhamento, movimento, foco e as primitivas de pele.'
---

# Design system

A **linguagem de design** com que o ranui é feito, e o catálogo **completo** dos tokens que a expressam: toda propriedade personalizada `--ran-*` global que a biblioteca declara, com o valor dela nos dois temas. Os componentes leem esses tokens em vez de escrever valores na mão, então sobrescrever um deles reestiliza tudo que o consome.

Três páginas respondem a três perguntas diferentes, e são separadas de propósito:

| Página                                               | Responde                                                |
| ---------------------------------------------------- | ------------------------------------------------------- |
| **Design system** (esta página)                      | _O que_ os tokens são: o vocabulário                    |
| [Diretrizes de design](/pt/src/ranui/design-guides/) | _Como escolher_ entre eles ao montar uma tela           |
| [Tematização](/pt/src/ranui/theme/)                  | _Como trocá-los e sobrescrevê-los_ em tempo de execução |

> **Use quando** precisar do nome ou do valor de um token (um papel de cor, um passo de espaço, um tamanho de ícone, um nível de sombra, uma curva de aceleração) ou quiser entender por que as escalas têm o formato que têm.

## A linguagem: Geist

Os tokens do ranui se baseiam no [Geist](https://vercel.com/geist), o design system de código aberto da Vercel. Toda escala de cor é uma escada de funções fixas, uma por degrau, não um conjunto de tons para escolher: o degrau 200 não é "um cinza um pouco mais escuro", é "o fundo do hover". Fixada a função de um degrau, escolher a cor de um estado de interação vira uma consulta, não um julgamento.

O ranui adota essa escada como as escalas `--ran-*` dele, põe tokens semânticos por cima e traz **Geist Sans / Geist Mono** como tipografias padrão.

## Duas camadas {#two-layers}

**Camada 1: a paleta base.** As escalas cruas abaixo. Raramente consumidas direto.

**Camada 2: os tokens semânticos.** `--ran-color-*` e companhia, mapeados sobre a camada 1. **Consuma esta camada.** O modo escuro redefine só a camada 1, então todo token semântico vira pelo `var()` sem nenhuma sobrescrita escura por componente em lugar algum da biblioteca.

```
--ran-gray-1000        →  #171717 (claro)  /  #ededed (escuro)   ← camada 1, vira
--ran-color-text       →  var(--ran-gray-1000)                    ← camada 2, acompanha
--ran-btn-color        →  var(--ran-color-text, …)                ← token de componente
```

Essa corrente é a arquitetura inteira: mude um degrau base e ele se propaga por toda parte; mude um token semântico e muda um papel; mude um token de componente e muda um elemento.

## Cor

### A escada {#the-ladder}

Toda escala de matiz vai de `100` a `1000`, e cada degrau tem uma função fixa:

| Degrau | Papel                     | Degrau | Papel                             |
| ------ | ------------------------- | ------ | --------------------------------- |
| 100    | Fundo padrão              | 600    | Borda ativa                       |
| 200    | Fundo do hover            | 700    | Preenchimento sólido (botão/selo) |
| 300    | Fundo ativo (pressionado) | 800    | Preenchimento sólido (hover)      |
| 400    | Borda padrão              | 900    | Texto e ícones secundários        |
| 500    | Borda do hover            | 1000   | Texto e ícones principais         |

### Fundos

| Token                  | Claro                                                           | Escuro                                                          | Serve para                |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------- |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Fundo da página           |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Zonas discretas da página |

### Cinza — `--ran-gray-100..1000`

A escala que está por trás do texto, das bordas e das superfícies.

| Degrau | Claro                                                           | Escuro                                                          |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100    | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200    | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300    | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400    | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500    | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600    | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700    | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800    | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900    | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000   | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### Cinza alfa — `--ran-gray-alpha-100..1000`

Translúcida, então se sobrepõe a qualquer superfície: a escolha certa para um véu, uma lavagem de hover ou um separador que precisa pousar sobre conteúdo desconhecido.

| Degrau | Claro                                                                        | Escuro                                                                       |
| ------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100    | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200    | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300    | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400    | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500    | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600    | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700    | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800    | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900    | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000   | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### Azul — `--ran-blue-100..1000`

Reservado para os links e o anel de foco.

| Degrau | Claro                                                           | Escuro                                                          |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100    | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200    | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300    | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400    | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500    | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600    | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700    | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800    | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900    | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000   | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### Vermelho — `--ran-red-100..1000`

Perigo e erros.

| Degrau | Claro                                                           | Escuro                                                          |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100    | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200    | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300    | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400    | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500    | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600    | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700    | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800    | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900    | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000   | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### Âmbar — `--ran-amber-100..1000`

Avisos.

| Degrau | Claro                                                           | Escuro                                                          |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100    | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200    | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300    | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400    | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500    | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600    | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700    | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800    | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900    | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000   | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### Verde — `--ran-green-100..1000`

Sucesso.

| Degrau | Claro                                                           | Escuro                                                          |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100    | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200    | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300    | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400    | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500    | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600    | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700    | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800    | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900    | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000   | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### Tokens semânticos de cor

A camada que os componentes de fato leem. Tudo aqui se resolve pelas escalas de cima, então vira com o tema sozinho.

| Token                          | Resolve para                                                                                                                               | Papel                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                     | Fundo da página                           |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                     | Zonas discretas da página                 |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (escuro)                                                                                                 | Cartões, superfícies                      |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                           | Preenchimentos recuados ou apagados       |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                           | Superfície do hover                       |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                           | Superfície ativa (pressionada)            |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                          | Texto principal                           |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                           | Texto secundário                          |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                           | Texto desabilitado                        |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                           | Borda padrão                              |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                           | Borda mais discreta                       |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                           | Borda do hover                            |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                           | Borda ativa                               |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                          | A ação principal (monocromática)          |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` (escuro) | Hover do primário                         |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` (escuro) | Primário pressionado                      |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                     | A tinta **sobre** uma superfície primária |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                          | Sucesso                                   |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                          | Aviso                                     |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                            | Perigo / erro                             |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                           | Links                                     |

`--ran-color-primary-hover` / `-active` são os dois literais da camada semântica: eles caminham em direção ao fundo da página em vez de ao longo de uma escala, então o modo escuro os redefine direto.

### O que cada acento significa

- **O primário é monocromático**: preto no branco no claro, branco no preto no escuro (o tom de marca do Geist, `<r-button type="primary">`). O texto e os ícones em cima usam `--ran-color-primary-text`, que vira junto. Não há um token de "contraste" separado: o primário _é_ a ação de maior contraste.
- **O azul é reservado** para os links (`--ran-color-link`) e o anel de foco. Não é um primário alternativo.
- **Verde = sucesso · âmbar = aviso · vermelho = perigo.** Um significado para cada.

Não existe `--ran-color-error`; o token é `--ran-color-danger`. Um `var()` que nomeia uma propriedade nunca declarada não resolve em nada e a declaração inteira é descartada em silêncio — por isso o nome errado merece ser conferido nesta tabela em vez de adivinhado.

## Espaço {#spacing}

Os vãos entre as coisas: `padding`, `margin`, `gap`. Uma unidade base de 4px com **nove valores**, nem um a mais:

| Token           | Valor | Token            | Valor |
| --------------- | ----- | ---------------- | ----- |
| `--ran-space-1` | 4px   | `--ran-space-8`  | 32px  |
| `--ran-space-2` | 8px   | `--ran-space-10` | 40px  |
| `--ran-space-3` | 12px  | `--ran-space-16` | 64px  |
| `--ran-space-4` | 16px  | `--ran-space-24` | 96px  |
| `--ran-space-6` | 24px  |                  |       |

O número é o múltiplo de 4px, então a escala pula: não existe `--ran-space-5`. É esse o ponto: um conjunto limitado é o que produz o ritmo de uma página.

## Tamanhos

As dimensões do próprio elemento: tamanhos de ícone, alturas de controle, controles pequenos quadrados ou retangulares.

| Token          | Valor | Normalmente                                       |
| -------------- | ----- | ------------------------------------------------- |
| `--ran-size-1` | 16px  | A caixa de um checkbox, um ícone pequeno em linha |
| `--ran-size-2` | 18px  | —                                                 |
| `--ran-size-3` | 20px  | Ícone dentro de um controle                       |
| `--ran-size-4` | 24px  | Botão de ícone numa barra de ferramentas          |
| `--ran-size-5` | 28px  | Altura de um controle compacto                    |
| `--ran-size-6` | 30px  | —                                                 |
| `--ran-size-7` | 32px  | Altura de controle padrão                         |

**Esta é uma escala separada da de espaço de propósito**, e misturá-las é um erro conferido por máquina (`sizing-scale`). As duas têm faixas e progressões diferentes (uma escala de espaço que dobra a partir de 4px produz valores esquisitos para ícones e controles), e quem usa precisa poder reajustar uma sem perturbar a outra: um ícone ficar maior não deveria também alargar todo vão que por acaso divida o mesmo valor em pixels. Quando um degrau coincide numericamente com um de espaço (`--ran-size-4` e `--ran-space-6` são ambos 24px), é coincidência, não apelido.

Uma dimensão genuinamente única que nenhum outro componente compartilha (o `min-width` de um menu, digamos) continua sendo um token de componente comum, com o próprio valor reserva literal, em vez de ser forçada num degrau.

## Tipografia {#typography}

| Token               | Valor                                                            |
| ------------------- | ---------------------------------------------------------------- |
| `--ran-font-family` | Geist / Geist Sans, e depois a pilha de interface do sistema     |
| `--ran-font-mono`   | Geist Mono, e depois `ui-monospace`, SF Mono, Menlo, Consolas, … |
| `--ran-font-size`   | `14px` (o tamanho base)                                          |
| `--ran-line-height` | `1.5715`                                                         |

O texto é organizado por **papel**, e o papel fixa de uma vez a fonte, o tamanho, o peso e a altura de linha:

| Papel       | Uso                                  | Token de peso                                                                  | Tokens de tamanho                            |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------- |
| **heading** | Títulos                              | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px)    |
| **label**   | Uma linha, para percorrer de relance | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)         |
| **copy**    | Corpo de várias linhas               | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)             |
| **button**  | Texto de botão                       | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)              |
| **mono**    | Código, dados, antetítulos           | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | toma emprestados os tamanhos de label / copy |

Dois tokens existem só para um papel pousar direito:

| Token                           | Valor     | Por quê                                                             |
| ------------------------------- | --------- | ------------------------------------------------------------------- |
| `--ran-text-heading-tracking`   | `-0.03em` | Títulos precisam de espacejamento mais fechado em tamanhos grandes. |
| `--ran-text-button-line-height` | `1`       | Centralização vertical nítida dentro de um controle de altura fixa. |

O Geist limita o peso em 600 (semibold). A ênfase vem do tamanho e do espaço, não de uma tipografia mais pesada. Não existe `--ran-text-copy-3`: o degrau de 12px é `--ran-text-label-3`.

### Fontes

O ranui hospeda as duas famílias por conta própria (peso variável 100–900, SIL OFL 1.1), então uma única importação as carrega sem depender de CDN:

```js
import 'ranui/fonts'; // empacotadores
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

Sem ela, os tokens recaem nas pilhas de fontes do sistema; tudo continua funcionando, só que sem as famílias do Geist.

## Raio

| Token               | Valor    | Serve para                       |
| ------------------- | -------- | -------------------------------- |
| `--ran-radius-sm`   | `6px`    | Controles: botão, campo, seletor |
| `--ran-radius-md`   | `12px`   | Cartões, diálogos                |
| `--ran-radius-lg`   | `16px`   | Superfícies grandes              |
| `--ran-radius-full` | `9999px` | Pílulas, avatares                |

## Elevação

A sombra é um **papel**, não enfeite. Escolha o nível pelo que o elemento é. O modo escuro substitui os três, porque uma sombra afinada para uma página branca some numa preta.

| Token                   | Serve para                                                                   | Claro                                                           | Escuro                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | Superfícies no fluxo que também têm borda: `r-card`, `r-section`             | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | Camadas passageiras sobre o conteúdo: menu suspenso, seletor, popover, aviso | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | Diálogos que bloqueiam: `r-modal`                                            | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

Camadas sem borda contam só com a sombra para se separar, então os níveis de camada flutuante carregam peso de verdade; uma camada que cai no nível elevado parece plana e pregada à página.

## Empilhamento {#stacking}

Camadas flutuantes são portalizadas para o `<body>`, então precisam de um nível explícito:

| Token              | Padrão | Serve para                                                                                                      |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000` | Diálogos que bloqueiam e a máscara deles                                                                        |
| `--ran-z-dropdown` | `1100` | Menu suspenso / seletor / popover: **acima** do modal, para que um select dentro de um diálogo continue visível |
| `--ran-z-message`  | `1200` | Avisos e notificações: sempre por cima                                                                          |

A escada começa em 1000 para passar por cima da moldura comum de uma página (barras de navegação e fundos costumam viver nas dezenas). Sobrescreva um nível no `:root`, ou por componente (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`), nunca com `!important`.

## Movimento

| Token                        | Valor   | Uso                                |
| ---------------------------- | ------- | ---------------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | Transições de hover e estado ativo |
| `--ran-motion-duration-base` | `0.2s`  | Popovers, menus                    |
| `--ran-motion-duration-slow` | `0.35s` | Aparições maiores                  |

| Token de aceleração          | Curva                               | Caráter                                                            |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | De entrada e saída, de uso geral                                   |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | Rápida, sem passar do ponto: interruptores                         |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | Passa levemente do ponto: botões, cartões                          |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | Passa do ponto de forma brincalhona: curtir, adicionar ao carrinho |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | Calma, sem passar do ponto: aparições, layout                      |

A família spring é destilada de molas afinadas do SwiftUI (response/damping reduzidos a uma bézier de uma só ultrapassagem).

**Combine-as só com propriedades de movimento**: `transform`, `opacity`, a geometria da caixa. As propriedades da paleta (`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`) de propósito não trazem transição padrão, porque o CSS não distingue uma interação de uma troca de tema: qualquer desvanecimento que você acrescente a uma cor também dispara quando o claro vira escuro. Mesmo assim, todo componente expõe um gancho `--ran-*-transition` caso você queira ligar de volta.

## Foco

| Token                            | Valor                                                                | Para                                                            |
| -------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | O anel padrão, como `box-shadow`                                |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | A cor do anel para uma superfície que é escura nos _dois_ temas |

O anel tem duas camadas: uma interna da cor do fundo e uma externa azul, então ele continua visível sobre qualquer superfície, e continua azul em vez de acompanhar o primário, agora monocromático.

`--ran-focus-ring-inverse-color` **de propósito não é redefinido no modo escuro**: ele existe para um componente cuja própria superfície é escura fixa, seja qual for o tema da página (a barra de controle do `r-player`, sobre um vídeo qualquer), e essa superfície não muda quando a página muda.

## Primitivas de pele

Os poucos valores estruturais que os componentes compartilham e que não são cor, tamanho nem tipografia. Mantidos no mínimo de propósito: esta camada já foi bem maior e quase tudo dela saiu junto com os pacotes de tema.

| Token                           | Valor                        | Para                                                                                   |
| ------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | A espessura de borda que os componentes desenham                                       |
| `--ran-skin-border-style`       | `solid`                      | O estilo de borda que os componentes desenham                                          |
| `--ran-skin-border-image-width` | `4px`                        | O recuo do `border-image-slice`, compartilhado por button/checkbox/input/modal/message |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | A sombra de superfície elevada, indireta para que uma pele possa mudá-la               |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | A família que os componentes usam, indireta do mesmo jeito                             |

## O que o modo escuro redefine

`data-ran-theme="dark"` no `<html>` (ou em qualquer subárvore, veja [tematização](/pt/src/ranui/theme/)) redefine **a paleta base e nada mais**, com três exceções que não conseguem se resolver por uma escala:

- a camada 1 inteira: cada degrau de cinza, cinza alfa, azul, vermelho, âmbar e verde, e os dois fundos;
- `--ran-color-bg-elevated`, que no escuro aponta para `--ran-gray-100` para um cartão se levantar de uma página preta em vez de sumir nela;
- `--ran-color-primary-hover` / `-active`, que são literais e não referências a uma escala;
- os três níveis de sombra, reafinados para um fundo escuro.

Todo o resto (qualquer outro token semântico, cada tamanho, cada duração) é definido uma única vez.

## Tokens de componente

Abaixo da camada semântica, todo componente expõe os próprios ganchos, nomeados assim:

```
--ran-{component}-{element}[-{state}]-{property}
```

por exemplo `--ran-btn-hover-background`, `--ran-select-search-active-border-width`. Por padrão eles recaem nos tokens semânticos: `var(--ran-btn-background, var(--ran-color-primary, #171717))`, então sobrescrever um token semântico alcança todos eles, e sobrescrever um de componente estreita a mudança para um elemento só.

A lista completa, gerada, é o [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) no repositório; a API por elemento está [aqui](/pt/src/ranui/api). Para saber como aplicá-los, veja [Tematização](/pt/src/ranui/theme/#customizing-tokens).

## Usar os tokens no seu próprio CSS {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

Três regras mantêm isso seguro no escuro:

1. **Nada de hexadecimal cru** para algo que deva acompanhar o tema.
2. **Um valor reserva precisa nomear um token que vire**: `var(--ran-color-text, var(--ran-gray-1000))`, nunca `var(--ran-color-text, #171717)`.
3. **Um valor reserva precisa nomear um token que exista**, ou a declaração é descartada e o elemento fica em silêncio com o que herdou.

> Todo token global que a biblioteca declara está listado nesta página, e um teste unitário falha se algum for acrescentado sem ser documentado aqui. Os tokens de escopo de componente são gerados à parte, no [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md).
