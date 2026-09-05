---
description: 'Uma superfície de vidro fosco líquido que combina desfoque do fundo, deslocamento SVG que entorta a luz e uma borda especular, degradando com elegância onde backdrop-filter não existe.'
---

# Glass

Uma superfície de vidro líquido / fosco. O `<r-glass>` fosca e refrata o que estiver atrás: `backdrop-filter` com blur e saturate para o fosco, um `feDisplacementMap` SVG para a luz entortando como em líquido, mais uma borda e um brilho especulares para que aquilo se leia como vidro. Tudo é guiado por tokens; o conteúdo vai no slot padrão.

> **Use quando** quiser um painel translúcido sobre conteúdo rico e colorido (um cartão de destaque, uma barra de ferramentas flutuante, uma camada sobre mídia). O atributo `displace` define o quanto aquilo parece _líquido_ (0 é uma chapa fosca plana). Todos os efeitos degradam para uma superfície translúcida simples onde `backdrop-filter` não existe.

## Playground

Arraste o vidro pelo palco, ajuste cada atributo e copie a marcação exata. Os valores padrão são a aparência do material fosco do iOS.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> Coloque o `<r-glass>` sobre conteúdo colorido ou movimentado: sobre um fundo chapado o efeito é invisível.

## Aninhamento

O `<r-glass>` compõe: aninhe um dentro do outro para materiais em camadas (uma barra de vidro sobre um painel de vidro, por exemplo). Cada camada refrata o que está atrás dela.

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">Painel externo</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">Barra de vidro aninhada</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    Painel externo
    <r-glass radius="16" displace="6">
      <div class="toolbar">Barra de vidro aninhada</div>
    </r-glass>
  </div>
</r-glass>
```

## Referência da API

### Propriedades

| Propriedade   | Tipo      | Padrão  | Descrição                                                                                                                                                                                                                                                                  |
| ------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | Raio do desfoque do fundo, em px (a quantidade de fosco).                                                                                                                                                                                                                  |
| `saturate`    | `number`  | `180`   | Saturação do fundo, em porcentagem: levanta a cor do que está atrás do vidro.                                                                                                                                                                                              |
| `displace`    | `number`  | `8`     | Força da refração líquida (escala do deslocamento SVG). `0` é uma chapa fosca plana; quanto maior, mais ondulado.                                                                                                                                                          |
| `frequency`   | `number`  | `0.005` | Frequência base da turbulência: valores menores dão ondas maiores e mais suaves.                                                                                                                                                                                           |
| `radius`      | `number`  | `20`    | Raio dos cantos, em px.                                                                                                                                                                                                                                                    |
| `tint`        | `string`  | sutil   | Tonalidade do preenchimento do vidro: qualquer valor CSS de background.                                                                                                                                                                                                    |
| `sheen`       | `boolean` | `false` | Varredura especular animada pela superfície.                                                                                                                                                                                                                               |
| `interactive` | `boolean` | `false` | Elevação no hover e escala ao pressionar, para vidro clicável. Também torna o host um botão operável pelo teclado: `role="button"`, ponto de tabulação, Enter/Espaço agem como um clique.                                                                                  |
| `rim`         | `boolean` | `false` | Borda especular e franja cromática opcionais, para uma luz de aparência mais física. Primeiro WebGL (sempre, de forma síncrona), com troca transparente para WebGPU em segundo plano quando disponível. Recai no gradiente especular de CSS quando nenhum dos dois existe. |

### Refração `displace`

`displace` controla a escala do `feDisplacementMap` SVG: com que força a luz entorta ao atravessar a superfície. Coloque `0` para uma chapa fosca sem mais.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</Demo>

```html
<r-glass displace="0">…fosco plano…</r-glass> <r-glass displace="60">…líquido…</r-glass>
```

### Brilho e interação

`sheen` acrescenta um reflexo especular em movimento; `interactive` acrescenta uma elevação no hover e um toque com mola ao pressionar (usando o token compartilhado `--ran-motion-ease-spring`).

<Demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">Passe o cursor e pressione</div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass sheen interactive displace="36">
  <div>Passe o cursor e pressione</div>
</r-glass>
```

### Rim — borda especular por GPU (opcional)

`rim` acrescenta uma segunda camada de reflexo: uma borda especular iluminada de uma direção fixa no canto superior esquerdo, mais uma franja cromática (RGB) discreta na borda arredondada do painel. Diferente da refração de `displace`, ela **nunca amostra o fundo**: o shader só conhece a largura, a altura e o raio de canto do próprio painel, então não custa nenhuma das concessões de interatividade e acessibilidade que uma abordagem de GPU capturando o fundo inteiro traria (veja as [notas](#notes)). É uma camada puramente decorativa sobre o mesmo fosco do `backdrop-filter`; ligar ou desligar nunca muda o que está atrás do vidro nem como aquilo é amostrado.

Desenha primeiro em WebGL (síncrono, funciona em praticamente todo navegador, então a borda nunca atrasa a própria primeira pintura) e troca de forma transparente para WebGPU em segundo plano se o navegador tiver (mesmo efeito, saída idêntica no pixel). Recai no gradiente especular de CSS quando nenhuma das duas APIs de GPU existe (navegadores bem antigos, GPU desativada, SSR); não há estado quebrado ou em branco a contornar no design.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">sem rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…apenas o especular de CSS…</r-glass>
<r-glass rim>…borda por GPU + franja cromática (WebGL, troca para WebGPU)…</r-glass>
```

### Parts e tokens CSS

Estilize as partes internas com `::part(glass)`, `::part(specular)` e (quando `rim` está presente) `::part(rim)`, ou sobrescreva as propriedades personalizadas `--ran-glass-*`:

| Token                                         | Para que serve                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `--ran-glass-blur`                            | Raio do desfoque do fundo.                                                            |
| `--ran-glass-saturate`                        | Saturação do fundo.                                                                   |
| `--ran-glass-radius`                          | Raio dos cantos.                                                                      |
| `--ran-glass-tint`                            | Fundo do preenchimento.                                                               |
| `--ran-glass-border`                          | Linha da borda.                                                                       |
| `--ran-glass-shadow`                          | Pilha de sombras (especular + profundidade).                                          |
| `--ran-glass-specular-background`             | Fundo do reflexo especular.                                                           |
| `--ran-glass-specular-opacity`                | Intensidade do especular.                                                             |
| `--ran-glass-reduced-transparency-background` | Superfície alternativa quando a opção "reduzir transparência" do sistema está ligada. |
| `--ran-glass-reduced-transparency-shadow`     | Sombra alternativa nesse mesmo estado.                                                |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## Notas {#notes}

- **Amostragem do fundo.** O `<r-glass>` refrata o DOM atrás dele via `backdrop-filter`, então texto selecionável, vídeo em reprodução e elementos interativos que ficam atrás continuam funcionando. O `rim` (acima) é uma camada de GPU puramente decorativa, calculada a partir da forma do próprio painel: ela nunca amostra o fundo.
- **Legibilidade.** Mantenha o texto corrido sobre uma superfície interna opaca; não deixe o contraste por conta do vidro.
- **Transparência reduzida.** O `<r-glass>` responde à opção de sistema "reduzir transparência" / "aumentar contraste" (`prefers-reduced-transparency: reduce`): ele troca para uma superfície sólida e ciente do tema (`--ran-color-bg-elevated` por padrão) em vez de foscar e refratar. Os controles nativos fazem isso sozinhos; este é o equivalente para um elemento personalizado.
- **Refração entre navegadores.** O efeito líquido do `feDisplacementMap` hoje só é desenhado no Chromium: Safari e Firefox descartam essa parte do valor de `backdrop-filter` e mantêm o fosco de blur / saturate / brightness, o que é uma alternativa legítima — mais plana, é verdade —, não um estado quebrado.
- **Movimento.** A superfície só faz transição de `transform`, nunca de cor, então a troca entre tema claro e escuro se resolve em um quadro. O brilho e o pressionar respeitam `prefers-reduced-motion`.
