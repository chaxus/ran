---
description: 'Uma superfície de vidro líquido: escolha um material e ela fosca e curva o que está atrás numa borda de lente. Sobre uma imagem ou vídeo, refrata os próprios pixels com WebGL2.'
---

# Glass

Uma superfície de vidro líquido. Escolha um `material` e o painel está pronto: ele fosca o que está atrás, curva isso numa borda arredondada como faz uma lente, separa levemente as cores na beirada e ilumina a borda. Qualquer valor isolado pode ser sobrescrito por um atributo de mesmo nome. O conteúdo vai no slot padrão e recebe uma cor de tinta legível sobre o vidro.

> **Use quando** um painel fica sobre conteúdo rico e colorido: um cartão de destaque, uma barra de ferramentas flutuante, uma camada sobre mídia. Sobre um fundo liso não há nada para curvar e o efeito desaparece.

## Playground

Arraste o vidro, troque o material e o fundo e copie a marcação. O trecho só traz o que difere do material.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## Materiais

Quatro materiais cobrem a maioria dos usos. `regular` é o padrão.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| Material  | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## Sobre uma imagem

Adicione `backdrop` quando o vidro estiver sobre um `<img>` ou `<video>`. Sem valor, ele usa a primeira imagem ou vídeo do pai do vidro; um seletor aponta outro. O vidro então lê os pixels desse elemento com WebGL2 e refrata cada comprimento de onda na sua própria medida, em qualquer motor com WebGL2, enquanto o caminho CSS só curva a luz no Chromium. A imagem continua na página, então o texto alternativo e o conteúdo ao redor não mudam.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

Uma imagem de outra origem precisa de `crossorigin` e de uma resposta CORS para ser lida; caso contrário, o vidro mantém o fosco CSS.

## Tom e tinta

`tone` diz o que está atrás do vidro. Sobre um fundo escuro ou colorido, a borda é iluminada e o conteúdo é branco; sobre um claro, uma borda branca some, então a borda é sombreada e o conteúdo fica escuro. Sobre uma imagem `backdrop`, o tom acompanha o brilho da área coberta, a menos que você o defina. O tom em vigor está disponível como `:state(light)` e `:state(dark)`, e `--ran-glass-ink` substitui a cor do conteúdo.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## Aninhamento

O `<r-glass>` se compõe: aninhe um dentro do outro para ter materiais em camadas, como uma barra de ferramentas de vidro sobre um painel de vidro. Cada camada curva o que está atrás dela.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## Referência da API

### Propriedades

| Propriedade   | Tipo      | Padrão      | Descrição                                                                                                                                                                                                         |
| ------------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular`   | `thin`, `regular`, `thick` ou `clear`: define de uma vez todos os valores ópticos abaixo.                                                                                                                         |
| `blur`        | `number`  | do material | Raio do fosco, em px.                                                                                                                                                                                             |
| `saturate`    | `number`  | do material | Saturação do que está atrás, em porcentagem.                                                                                                                                                                      |
| `displace`    | `number`  | do material | Quanto a borda puxa o fundo para dentro, em px. `0` é uma chapa plana.                                                                                                                                            |
| `bevel`       | `number`  | do material | Largura da faixa curva da borda que desvia a luz, em px.                                                                                                                                                          |
| `dispersion`  | `number`  | do material | Quanto as cores se separam na borda, como porcentagem de `displace`.                                                                                                                                              |
| `specular`    | `number`  | do material | Intensidade dos brilhos, em porcentagem.                                                                                                                                                                          |
| `radius`      | `number`  | `20`        | Raio dos cantos, em px.                                                                                                                                                                                           |
| `tint`        | `string`  | do material | Preenchimento sobre o fosco: qualquer valor CSS de fundo.                                                                                                                                                         |
| `tone`        | `string`  | `dark`      | `dark` ou `light`: o que está atrás do vidro. Sem definir sobre um `backdrop`, acompanha a imagem.                                                                                                                |
| `backdrop`    | `string`  | —           | Refrata um `<img>` ou `<video>` com WebGL2. Vazio usa o primeiro do pai; um seletor aponta outro.                                                                                                                 |
| `rim`         | `boolean` | `false`     | Uma borda iluminada por GPU: paredes externa e interna, uma luz principal e uma de preenchimento, reflexos. Depende só da forma do painel.                                                                        |
| `sheen`       | `boolean` | `false`     | Um brilho que varre a superfície.                                                                                                                                                                                 |
| `interactive` | `boolean` | `false`     | Elevação ao passar o cursor e retorno ao pressionar, para vidro clicável. Também transforma o host num botão operável pelo teclado: `role="button"`, uma parada de tabulação, Enter e Espaço agem como um clique. |

### Refração `displace`

`displace` define quanto a borda puxa o que está atrás em direção ao centro, de modo que o fundo logo dentro da beirada se estica sobre ela, como uma borda convexa grossa amplia. `bevel` define a largura dessa faixa curva. Acima da metade do bevel, a borda dobra a imagem de volta sobre si mesma, como faz a beirada de um vidro grosso de verdade.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### Brilho e interação

`sheen` adiciona um brilho em movimento; `interactive` adiciona uma elevação ao passar o cursor e um pressionar que volta ao lugar sem ressalto.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — borda especular por GPU (opcional)

`rim` desenha a borda na GPU: uma parede externa brilhante e uma interna mais fraca onde o bevel encontra a face plana, iluminadas por uma luz principal vinda do canto superior esquerdo e um preenchimento fraco vindo do inferior direito, com espessura que varia ao longo da borda e reflexos ocasionais. Num tom `light`, as paredes são sombreadas em vez disso. Nunca amostra o fundo: o shader só conhece o tamanho, o raio e o bevel do painel. Renderiza primeiro em WebGL, passa para WebGPU em segundo plano quando o navegador tem suporte e deixa o brilho CSS como está quando nenhum dos dois existe.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### Parts e tokens CSS

Estilize o interior com `::part(glass)`, `::part(specular)`, `::part(refraction)` e, quando `rim` está ativo, `::part(rim)`, ou sobrescreva as propriedades personalizadas `--ran-glass-*`:

| Token                                         | Para que serve                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `--ran-glass-ink`                             | Cor do conteúdo. Branco por padrão, ou quase preto num tom claro.                    |
| `--ran-glass-tint`                            | Preenchimento sobre o fosco.                                                         |
| `--ran-glass-border`                          | Contorno da borda.                                                                   |
| `--ran-glass-shadow`                          | Pilha de sombras (especular e profundidade).                                         |
| `--ran-glass-brightness`                      | Brilho do que está atrás.                                                            |
| `--ran-glass-specular-background`             | Fundo do brilho CSS.                                                                 |
| `--ran-glass-specular-opacity`                | Intensidade do brilho CSS; substitui `specular` nessa camada.                        |
| `--ran-glass-reduced-transparency-background` | Superfície alternativa quando a opção de sistema "reduzir transparência" está ativa. |
| `--ran-glass-reduced-transparency-shadow`     | Sombra alternativa nesse mesmo estado.                                               |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## Notas {#notes}

- **Dois caminhos.** Sem `backdrop`, o `backdrop-filter` fosca a página real atrás do vidro, então texto, vídeo e controles atrás dele continuam funcionando; a borda de lente com cores separadas é um filtro SVG que renderiza no Chromium, e Safari e Firefox mantêm o fosco. Com `backdrop`, o WebGL2 refrata aquela única imagem ou vídeo em qualquer motor que tenha WebGL2.
- **Legibilidade.** O conteúdo recebe `--ran-glass-ink`. Mantenha textos longos sobre uma superfície interna opaca em vez de deixar o contraste por conta do vidro.
- **Transparência reduzida.** Com a opção de sistema "reduzir transparência" ou "aumentar contraste" (`prefers-reduced-transparency: reduce`), o vidro vira uma superfície sólida que acompanha o tema (`--ran-color-bg-elevated`), sem fosco, refração nem brilhos.
- **Movimento.** A superfície só faz transição de `transform`, então uma troca de tema se resolve em um quadro. O brilho e o pressionar respeitam `prefers-reduced-motion`.
- **Custo.** O mapa de lente SVG é refeito quando o tamanho, o raio ou o bevel do painel mudam. A refração WebGL verifica o painel e a imagem uma vez por quadro enquanto está visível e só desenha quando um deles se moveu.
