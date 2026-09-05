---
description: 'Uma superfície experimental de raspadinha em que arrastar sobre um canvas de cobertura revela o conteúdo por baixo, via API de Pointer Events.'
---

# Scratch

Superfície experimental de raspadinha que desenha, dentro do shadow DOM, um `<canvas>` de cobertura em tamanho cheio sobre uma camada de revelação. Arrastar pelo canvas apaga a cobertura com composição `destination-out` ao longo do caminho real que o ponteiro traça, e raspar área suficiente revela o que está embaixo. O host é `display: block`, então dê a ele largura e altura explícitas.

> **Use quando** precisar de uma superfície experimental de raspadinha em que arrastar apaga um canvas de cobertura e revela qualquer conteúdo por baixo. Funciona igual com mouse, toque e caneta graças à API de Pointer Events.

> ⚠️ **Experimental**: este componente está em andamento. Trate-o como uma interação divertida, não como um widget de produção robusto.

## Início rápido

### Uso básico

O que você põe dentro do `<r-scratch>` é o conteúdo revelado (um valor, uma imagem, um `<r-icon>`, vários elementos), projetado pelo slot padrão na camada abaixo da cobertura, exatamente como a projeção de conteúdo em qualquer outro componente do ranui.

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">Você ganhou 50 moedas!</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">Você ganhou 50 moedas!</r-scratch>
```

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão  | Descrição                                                                                  |
| ----------- | --------- | ------- | ------------------------------------------------------------------------------------------ |
| `disabled`  | `boolean` | `false` | Desativa a raspagem (`pointer-events: none` no canvas, mais uma guarda nos manipuladores). |
| `sheet`     | `string`  | `''`    | CSS injetado no shadow DOM do componente.                                                  |

### Estado desabilitado `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">Você ganhou 50 moedas!</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">Você ganhou 50 moedas!</r-scratch>
```

### Estilos externos `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## Interação

O componente **não** despacha nenhum evento personalizado: não há nada a que ligar um listener. Em vez disso, a raspagem é conduzida inteiramente por listeners internos de [Pointer Events](https://developer.mozilla.org/pt-BR/docs/Web/API/Pointer_events) registrados no canvas, então mouse, toque e caneta compartilham o mesmo caminho de código:

- `pointerdown`: arma a raspagem e apaga um pequeno toque bem onde o ponteiro caiu (assim até um toque sem arrasto revela alguma coisa).
- `pointermove`: enquanto armado, traça uma **linha conectada** (não toques isolados) do ponto anterior ao atual com `globalCompositeOperation = 'destination-out'`, de modo que um arrasto rápido revela um rastro contínuo em vez de pontilhado, e acumula a área raspada pelo caminho.
- `pointerup` / `pointercancel`: desarma a raspagem; assim que a área acumulada passa de **35% da área em pixels do canvas**, toda a cobertura é limpa com `clearRect`, revelando por completo a camada de baixo (um limiar deliberadamente generoso de "raspe um pouco e ele termina sozinho", a experiência habitual de raspadinha, em vez de exigir apagar a cobertura inteira à mão).

As coordenadas do ponteiro são mapeadas pela resolução real do buffer de desenho do canvas (veja abaixo), então a raspagem acompanha corretamente o dedo ou o cursor, seja qual for o tamanho CSS do elemento ou a densidade de pixels da tela. Todos os manipuladores não fazem nada enquanto `disabled` estiver presente, e o `touch-action: none` no canvas impede que um arrasto por toque também role a página.

Alguns casos-limite específicos de dispositivo são tratados explicitamente, em vez de deixados ao que a "unificação" de mouse, toque e caneta faz por padrão:

- **Mouse**: só o botão principal (esquerdo) começa uma raspagem; arrastar com o botão direito ou clicar com o do meio, não.
- **Multitoque**: o primeiro dedo que desce comanda o traço; um segundo dedo que toca no meio da raspagem é ignorado até o primeiro levantar, em vez de os dois escreverem ao mesmo tempo no mesmo estado de desenho.
- **Gestos interrompidos**: se o sistema retomar a captura do ponteiro no meio do arrasto sem nunca disparar `pointerup` (visto em alguns WebViews do Android quando um gesto de voltar do sistema interrompe a raspagem), um listener de `lostpointercapture` reinicia o estado interno assim mesmo; sem isso o estado continuaria armado e o próximo movimento de ponteiro, sem relação nenhuma, seguiria desenhando em silêncio.

### Resolução do canvas

A resolução interna do canvas é sincronizada com o tamanho CSS realmente renderizado × `devicePixelRatio` (ao conectar e de novo a cada `resize` da janela), em vez de ficar no 300×150 fixo do navegador. Isso mantém a cobertura nítida em telas HiDPI e mantém exato o mapeamento de coordenadas entre ponteiro e canvas em qualquer tamanho; um redimensionamento reinicia a raspagem em andamento (o buffer necessariamente se limpa quando muda de dimensões).

## Slots

| Slot     | Descrição                                                 |
| -------- | --------------------------------------------------------- |
| (padrão) | O conteúdo revelado, projetado na camada sob a cobertura. |

## Estilos

Este componente **não expõe nenhum `::part()`**, mas as cores das suas duas camadas são variáveis CSS movidas por tokens de tema. O shadow DOM dele são três camadas fixas:

| Classe                       | Papel                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | Contêiner relativo em tamanho cheio (`width: 100%; height: 100%`)                                                                                       |
| `.ran-scratch-ticket-award`  | A camada de revelação, `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`; guarda o slot padrão        |
| `.ran-scratch-ticket-canvas` | O canvas de cobertura, `z-index: 2`; preenchido com `--ran-scratch-cover-background` (padrão `var(--ran-color-text-secondary, #6b6b6b)`), posto no host |

As duas cores passam por tokens de tema com um valor de reserva literal, então se adaptam sozinhas aos modos claro e escuro e podem ser sobrescritas com `--ran-scratch-award-background` / `--ran-scratch-cover-background`. Dimensione o host com `width` e `height` comuns.

## Boas práticas

- **Sempre dimensione o host**: ele é `display: block` e não tem tamanho próprio; dê a ele `width` e `height` explícitos, ou as camadas internas a `100%` colapsam para zero.
- **Qualquer conteúdo revelado serve**: texto, uma imagem, um `<r-icon>`, vários elementos. Coloque no slot o que o prêmio de fato é; não há uma API fixa de ícone + tamanho para contornar.
- **Funciona com mouse, toque e caneta**: Pointer Events unifica os três, então ele responde do mesmo jeito no desktop e no celular.
- **Trate como experimental**: ainda está em andamento; não conte com o comportamento dele em produção.
