---
description: 'O Player do ranui (<r-player>) envolve um <video> nativo com uma barra de controle unificada: reprodução, arraste do progresso, volume, velocidade e tela cheia, com streaming HLS/DASH/FLV/WebRTC.'
---

# Player

Um elemento de mídia nativo `<r-player>` que envolve um `<video>` com uma barra de controle unificada, arraste do progresso, controle de volume, velocidade de reprodução, tela cheia e streaming HLS/DASH/FLV/WebRTC.

> **Use quando** precisar de um reprodutor de vídeo com barra de controle embutida, arraste do progresso, velocidade de reprodução, tela cheia e streaming HLS/DASH/FLV/WebRTC. O `<r-player>` envolve um `<video>` e roda igual em qualquer framework.

Construído sobre Web Components, com `hls.js`/`dashjs`/`mpegts.js` carregados sob demanda para os respectivos formatos, então o mesmo reprodutor roda igual em qualquer framework. Recursos tirados do código-fonte:

- Barra de progresso arrastável, com indicador de buffer e dica de tempo ao passar o cursor
- Controle de volume e alternância de mudo
- Escolha da velocidade de reprodução
- Alternância de tela cheia (e `Esc` para sair)
- Alternância de picture-in-picture: o botão só é desenhado quando o navegador realmente suporta
- Botão de AirPlay / reprodução remota: o próprio seletor de dispositivos do navegador, detectado por recurso do mesmo jeito que o picture-in-picture
- Gestos no celular: toque duplo na metade esquerda ou direita para avançar ∓10s, deslize vertical na metade direita para o volume (só toque; a interação com mouse ou caneta não é afetada)
- Arraste com toque, caneta ou mouse: o ponto do progresso usa uma única implementação de Pointer Events para os três; se o navegador tomar de volta o ponteiro no meio do arraste, o arraste termina sem saltar, já que o ponteiro nunca foi solto numa posição escolhida por quem assiste
- Pré-visualização em miniatura ao arrastar: aponte `thumbnails` para a URL de um manifesto WebVTT de folha de sprites e uma miniatura recortada aparece acima da dica da barra
- `poster` / `autoplay` / `loop` / `muted`: atributos padrão de `<video>`, repassados direto
- Legendas: defina a propriedade `tracks`; o navegador desenha as legendas nativamente e um seletor de idioma lembra a escolha de quem assiste
- Erro e nova tentativa: um diálogo `Modal.error()` em falhas fatais de reprodução, ligado por padrão, desligado com `disable-error-modal`
- Retomar a reprodução: ligue com `remember-position`, salvo no `localStorage` com chave por `src`
- Métricas de QoE: `getMetrics()` deriva do fluxo de eventos já existente a contagem e a duração dos rebuffers, o tempo até o primeiro quadro, a contagem de trocas de qualidade e a de erros
- Reprodução HLS (`.m3u8`) e DASH (`.mpd`) com troca automática de bitrate e seletor manual de qualidade; reprodução FLV / MPEG-TS cru (`.flv`/`.ts`) por `mpegts.js`. Cada motor carrega sob demanda, sem configuração. Force um motor específico (ou volte ao `<video src>` simples) pelo atributo `format` quando a extensão da URL não puder ser farejada.
- Reprodução ao vivo de baixa latência por WebRTC via WHEP (`format="webrtc"`, `src` é a URL de um endpoint WHEP): sem dependência de biblioteca, `RTCPeerConnection` é uma API nativa do navegador.
- Atalhos de teclado: `Espaço` reproduzir/pausar, `Seta esquerda` / `Seta direita` avançar 5s, `Escape` sair da tela cheia, `Home`/`End`/setas na barra em foco

## Início rápido

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> O elemento é desenhado como `display: block`. Dê a ele largura e altura explícitas (estilo em linha ou CSS) para que o vídeo tenha uma caixa a preencher.

## Referência da API

### Propriedades

| Propriedade           | Tipo                  | Padrão  | Descrição                                                                                                                                                                                                                                                                                |
| --------------------- | --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                 | `string`              | `''`    | URL do recurso de vídeo. Mudá-la recarrega o reprodutor. O motor (HLS/nativo) é detectado sozinho pela extensão.                                                                                                                                                                         |
| `format`              | `string`              | `''`    | Força um motor específico (`hls` / `dash` / `flv` / `webrtc` / `native`) em vez de detectar pela extensão de `src`. Útil para URLs de streaming sem extensão ou assinadas; **obrigatório** para `webrtc` (um endpoint WHEP não tem extensão a detectar). Mudá-lo recarrega o reprodutor. |
| `volume`              | `string`              | `''`    | Volume inicial numa escala de `0` a `100`, a mesma de `setVolume()`/`getVolume()`.                                                                                                                                                                                                       |
| `currentTime`         | `string`              | `''`    | Posição inicial de reprodução, em segundos. Também aceito em minúsculas como `currenttime`.                                                                                                                                                                                              |
| `playbackRate`        | `string`              | `''`    | Multiplicador de velocidade (por exemplo `1`, `1.5`, `2`). Também aceito em minúsculas como `playbackrate`.                                                                                                                                                                              |
| `debug`               | `string`              | `''`    | Quando verdadeiro, registra no console todo evento `change` interno e os avisos.                                                                                                                                                                                                         |
| `sheet`               | `string`              | `''`    | Texto CSS injetado no shadow DOM do componente, para estilos próprios.                                                                                                                                                                                                                   |
| `poster`              | `string`              | `''`    | URL da imagem exibida antes de a reprodução começar. Repassada direto para `<video poster>`.                                                                                                                                                                                             |
| `autoplay`            | `boolean`             | `false` | Atributo booleano: a presença significa `true`, igual ao `<video autoplay>` nativo. Os navegadores em geral exigem `muted` para que a reprodução automática realmente comece sem um gesto da pessoa.                                                                                     |
| `loop`                | `boolean`             | `false` | Atributo booleano: repete a reprodução ao terminar, igual ao `<video loop>` nativo.                                                                                                                                                                                                      |
| `muted`               | `boolean`             | `false` | Atributo booleano: começa sem som. Por dentro, isso põe o volume em `0` (para o ícone e o controle concordarem) **e** ativa a flag nativa `<video>.muted` (para satisfazer a política de autoplay mudo do navegador). Remover o atributo restaura o volume anterior.                     |
| `thumbnails`          | `string`              | `''`    | URL de um manifesto WebVTT de folha de sprites; mostra uma miniatura recortada acima da dica da barra. Veja [Pré-visualização em miniatura](#thumbnail-scrubbing-preview-thumbnails) abaixo. Independente de `src`: só é rebuscado quando este atributo muda.                            |
| `disable-error-modal` | `boolean`             | `false` | Desliga o diálogo embutido de erro e nova tentativa. Os erros continuam chegando pelos eventos `change` `error`/`sourceerror`, então dá para montar a sua própria interface por cima.                                                                                                    |
| `remember-position`   | `boolean`             | `false` | Liga o retomar da reprodução: salva a posição atual no `localStorage` (com chave por `src`) ao pausar ou quando a aba fica oculta, restaura na próxima carga do mesmo `src` e apaga quando a reprodução termina.                                                                         |
| `tracks`              | `PlayerTrackConfig[]` | `[]`    | Faixas de legenda. **Só propriedade de JS, sem atributo correspondente** (o reprodutor limpa o próprio DOM leve a cada carga, então filhos `<track>` declarativos seriam removidos antes de fazerem efeito). Veja [Legendas](#subtitles-cc-tracks) abaixo.                               |

> Atributos observados (por `observedAttributes`): `src`, `format`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `thumbnails`, `autoplay`, `loop`, `muted`, `disable-error-modal`, `remember-position`.

### Fonte de vídeo `src`

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### Ao vivo por WebRTC `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

Para transmissões ao vivo de baixa latência, defina `format="webrtc"` e aponte `src` para um endpoint **WHEP** (WebRTC-HTTP Egress Protocol), do tipo que o Cloudflare Stream, o egress do LiveKit, o Millicast e plataformas parecidas expõem. Não há dependência de biblioteca: `RTCPeerConnection` e `fetch` são APIs nativas do navegador, então, ao contrário de HLS/DASH/FLV, este motor não tem nenhum pedaço a baixar. Um endpoint WHEP não tem extensão de arquivo a detectar, então `format="webrtc"` é **obrigatório**; nunca é deduzido de `src`.

Por baixo: cria uma `RTCPeerConnection` com transceptores de áudio e vídeo `recvonly`, espera a coleta de ICE, faz `POST` da oferta SDP para `src` (`Content-Type: application/sdp`), aplica a resposta SDP do corpo e liga o fluxo que chega por `video.srcObject`. Encerrar a reprodução faz `DELETE` do recurso de sessão que o servidor devolveu no cabeçalho `Location`. O escopo é propositalmente modesto: ICE sem trickle (com um teto de alguns segundos e, depois, seguindo com os candidatos que tiver) em vez do mecanismo de trickle por PATCH do WHEP, e sem ler o cabeçalho `Link: rel="ice-server"` para as dicas de STUN/TURN do servidor; a maioria das implantações WHEP diretamente alcançáveis funciona sem nenhum dos dois. Como no FLV, não há seletor de qualidade: o WHEP não tem uma seleção multibitrate padrão do lado do cliente, então o `qualitySwitchCount` de `getMetrics()` fica em `0` com este motor.

### Volume inicial `volume`

O valor vai numa escala de `0` a `100`.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### Posição inicial `currentTime`

Segundos desde o começo da mídia.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### Velocidade de reprodução `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### Registro de depuração `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### Pôster, autoplay, laço e mudo

```html
<r-player
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  poster="/ran/hls/poster.jpg"
  autoplay
  muted
  loop
></r-player>
```

### Picture-in-picture

O botão de PiP na barra de controle só aparece quando `document.pictureInPictureEnabled` é verdadeiro. Não sobra um botão morto nos navegadores que não têm suporte. Alterne pelo código com `togglePip()`.

### AirPlay / reprodução remota

O botão de transmitir aparece quando o navegador expõe a Remote Playback API padronizada (`videoElement.remote.prompt()`, Chrome/Edge) ou o `webkitShowPlaybackTargetPicker()` do Safari (AirPlay); nos demais casos ele fica escondido, não desabilitado — a mesma regra de melhoria progressiva do picture-in-picture. Abra o seletor de dispositivos pelo código com `showRemotePlaybackPicker()`.

### Gestos no celular

Só toque, ligados por padrão, sem atributo para habilitar: toque duplo na metade esquerda do vídeo volta 10 segundos, toque duplo na metade direita avança 10 (um breve `-10s`/`+10s` confirma), e arrastar na vertical na metade direita ajusta o volume. A interação com mouse e caneta fica totalmente intacta. Um toque simples continua alternando reproduzir e pausar, apenas com o mesmo atraso usado para detectar o toque duplo, de modo que um toque duplo para avançar nunca deixa o toque do meio piscar a reprodução. Dispara um evento `change` `gestureseek` (`{ direction, seconds }`) ao lado do já existente `volume` do deslize.

### Pré-visualização em miniatura `thumbnails` {#thumbnail-scrubbing-preview-thumbnails}

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` aponta para um manifesto WebVTT cujas legendas seguem a convenção de folha de sprites que o YouTube e o Video.js usam: o texto de cada legenda é uma referência de imagem mais um fragmento `#xywh=x,y,w,h` que identifica o recorte dela dentro de uma folha compartilhada:

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

A referência de imagem é resolvida em relação à URL do próprio arquivo VTT, então uma folha de sprites ao lado do manifesto não precisa de caminho absoluto. Passar o cursor (ou arrastar) na barra mostra a legenda que cobre aquele instante como miniatura recortada acima da dica de tempo; nada é desenhado quando `thumbnails` não está definido, nem antes de o manifesto carregar. O manifesto é buscado e analisado uma vez por mudança de `thumbnails`, independente de `src`: trocar de qualidade ou de fonte não o busca de novo.

### Legendas `tracks` {#subtitles-cc-tracks}

```js
const player = document.createElement('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
stage.append(player);
```

Cada entrada vira um `<track>` nativo no `<video>` de baixo; o desenho das legendas é inteiramente do navegador, o reprodutor não pinta nada próprio. Um seletor de idioma (um `<r-select>`, com a mesma interação do seletor de qualidade) aparece na barra de controle com **Off** mais uma entrada por faixa; o idioma escolhido é lembrado no `localStorage` e aplicado sozinho na próxima vez que qualquer `<r-player>` da página receber faixas (preferência global, não por vídeo), recaindo na faixa com `default: true` se nada tiver sido salvo ainda. Definir `tracks = []` remove o seletor e todas as faixas. `setSubtitleLanguage(lang)` define o idioma ativo pelo código (`lang` é um `srclang`, ou `'off'`).

### Erro e nova tentativa

Ligado por padrão. Um erro fatal do motor de streaming ou um evento `error` do `<video>` nativo abre um diálogo `Modal.error()` (carregado sob demanda: o `r-modal` nem é baixado até algo realmente falhar) com um botão de **Tentar de novo** que recarrega o reprodutor. Defina `disable-error-modal` para desligar isso e tratar os erros você mesmo pelos eventos `change` `error`/`sourceerror`. Erros não fatais do motor (que o hls.js recupera internamente) nunca abrem o diálogo.

### Retomar a reprodução `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

Salva `getCurrentTime()` no `localStorage` (com chave por `src`) no `pause` e sempre que a aba fica oculta (`visibilitychange`, mais confiável que `beforeunload`), restaura na próxima carga daquele mesmo `src` e apaga quando o vídeo chega ao `ended`. É pulado em silêncio se a posição salva estiver a menos de 2 segundos da duração: um vídeo terminado recomeça do zero em vez de "retomar" no próprio fim. Só a posição é lembrada; preferências de volume, velocidade e legenda são opções à parte.

### Métricas de QoE {#qoe-metrics}

```js
const player = document.createElement('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
stage.append(player);
```

`getMetrics()` devolve um retrato, em objeto simples, derivado do mesmo fluxo de eventos `change` documentado abaixo; não há rastreamento separado a ativar:

| Campo                | Tipo             | Descrição                                                                                       |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `rebufferCount`      | `number`         | Número de transições `waiting`→`playing` (travadas que depois se recuperaram).                  |
| `rebufferDuration`   | `number`         | Tempo total (ms) travado em todos os rebuffers.                                                 |
| `firstFrameMs`       | `number \| null` | ms desde que o `src` atual começa a carregar até o primeiro quadro reproduzível; `null` até lá. |
| `qualitySwitchCount` | `number`         | Número de níveis de qualidade que a pessoa escolheu no seletor.                                 |
| `errorCount`         | `number`         | Número de eventos `error`/`sourceerror`.                                                        |

O retrato é reiniciado sempre que um novo `src`/`format` carrega. Ele sempre descreve a fonte **atual**, não um acumulado entre fontes.

## Métodos

O reprodutor expõe controles imperativos na instância do elemento:

| Método                                     | Descrição                                                                                                                          |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `play(time?)`                              | Começa a reprodução, opcionalmente saltando para `time` (segundos).                                                                |
| `pause()`                                  | Pausa a reprodução.                                                                                                                |
| `getCurrentTime()`                         | Posição atual de reprodução, em segundos.                                                                                          |
| `setCurrentTime(seconds)`                  | Salta para uma posição.                                                                                                            |
| `getTotalTime()`                           | Duração total da mídia, em segundos.                                                                                               |
| `getVolume()` / `setVolume(v)`             | Lê ou define o volume numa escala de `0` a `100`, a mesma do atributo `volume`.                                                    |
| `getPlaybackRate()` / `setPlaybackRate(n)` | Lê ou define o multiplicador de velocidade.                                                                                        |
| `customRequestFullscreen()`                | Entra em tela cheia. Devolve uma `Promise`.                                                                                        |
| `customExitFullscreen()`                   | Sai da tela cheia. Devolve uma `Promise`.                                                                                          |
| `togglePip()`                              | Entra ou sai do picture-in-picture. Não faz nada se não houver suporte ou fonte carregada.                                         |
| `setSubtitleLanguage(lang)`                | Define a faixa de legenda ativa pelo `srclang`, ou `'off'` para desligar.                                                          |
| `getMetrics()`                             | Lê o retrato atual das [métricas de QoE](#qoe-metrics).                                                                            |
| `showRemotePlaybackPicker()`               | Abre o seletor de dispositivos de AirPlay / reprodução remota do navegador. Não faz nada se não houver suporte ou fonte carregada. |

## Eventos

O reprodutor despacha um único CustomEvent `change`. Toda transição interna de estado (os eventos de mídia nativos e as próprias ações da interface do reprodutor) desemboca ali, então você assina uma vez e ramifica por `detail.type`.

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` é a própria instância de <r-player>
  });
</script>
```

### Conteúdo do `detail`

| Propriedade   | Tipo      | Descrição                              |
| ------------- | --------- | -------------------------------------- |
| `type`        | `string`  | O nome da mudança que ocorreu.         |
| `data`        | `unknown` | O valor ou evento associado à mudança. |
| `currentTime` | `number`  | Tempo de reprodução atual (segundos).  |
| `duration`    | `number`  | Duração total da mídia (segundos).     |
| `tag`         | `Element` | A instância de `<r-player>`.           |

### Valores de `detail.type`

Estados de mídia nativos repassados do `<video>` de baixo:

| Tipo             | Descrição                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `canplay`        | Há dados suficientes para começar a tocar.                                                                                             |
| `canplaythrough` | Dá para tocar até o fim sem parar para carregar.                                                                                       |
| `complete`       | Desenho concluído.                                                                                                                     |
| `durationchange` | O valor de `duration` mudou.                                                                                                           |
| `emptied`        | A mídia foi esvaziada ou recarregada.                                                                                                  |
| `ended`          | A reprodução chegou ao fim.                                                                                                            |
| `error`          | Ocorreu um erro de mídia (também abre o diálogo embutido de erro e nova tentativa, a menos que `disable-error-modal` esteja definido). |
| `loadstart`      | O navegador começou a carregar a mídia.                                                                                                |
| `loadedmetadata` | Os metadados carregaram.                                                                                                               |
| `loadeddata`     | O primeiro quadro carregou.                                                                                                            |
| `progress`       | Disparado periodicamente enquanto o recurso carrega.                                                                                   |
| `ratechange`     | A velocidade de reprodução mudou.                                                                                                      |
| `seeking`        | Um salto começou.                                                                                                                      |
| `seeked`         | Um salto terminou.                                                                                                                     |
| `stalled`        | O navegador tenta buscar dados, mas nada chega.                                                                                        |
| `suspend`        | O carregamento da mídia foi suspenso.                                                                                                  |
| `timeupdate`     | `currentTime` mudou.                                                                                                                   |
| `volumechange`   | O volume do elemento de vídeo mudou.                                                                                                   |
| `waiting`        | A reprodução travou esperando dados.                                                                                                   |
| `play`           | A reprodução começou.                                                                                                                  |
| `playing`        | A reprodução voltou depois de carregar ou de uma pausa.                                                                                |
| `pause`          | A reprodução pausou.                                                                                                                   |

Ações próprias do reprodutor:

| Tipo               | `data`                   | Descrição                                                                                                                                                                                                                                      |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `volume`           | `number` (`0`–`100`)     | O volume mudou pela barra de controle ou pelo botão de mudo.                                                                                                                                                                                   |
| `speed`            | `number`                 | A velocidade mudou pelo seletor de velocidade.                                                                                                                                                                                                 |
| `fullscreen`       | `boolean`                | Entrou (`true`) ou saiu (`false`) da tela cheia.                                                                                                                                                                                               |
| `pictureinpicture` | `boolean`                | Entrou (`true`) ou saiu (`false`) do picture-in-picture; dispara tanto por `togglePip()` quanto pelos controles da própria janela de PiP do navegador.                                                                                         |
| `subtitlechange`   | `string`                 | O idioma da legenda mudou pelo seletor ou por `setSubtitleLanguage()`: um `srclang`, ou `'off'`.                                                                                                                                               |
| `resume`           | `number`                 | Uma posição salva foi restaurada em silêncio na carga (`remember-position`); `data` é o tempo restaurado, em segundos.                                                                                                                         |
| `levelsready`      | `{ levels }`             | O manifesto do motor de streaming foi analisado; os níveis de qualidade já estão disponíveis.                                                                                                                                                  |
| `sourceerror`      | `{ fatal, detail }`      | Ocorreu um erro do motor de streaming (recai no `src` cru; um erro **fatal** também abre o diálogo de erro e nova tentativa, a menos que `disable-error-modal` esteja definido; os não fatais são a recuperação interna do motor e não abrem). |
| `qualityswitch`    | `{ level }`              | A pessoa escolheu um nível de qualidade no seletor.                                                                                                                                                                                            |
| `gestureseek`      | `{ direction, seconds }` | Um gesto de toque duplo para avançar foi disparado (`direction` é `'forward'`/`'backward'`).                                                                                                                                                   |

## Slots

O reprodutor não aceita conteúdo em slot: ele limpa os próprios filhos do DOM leve (`this.innerHTML = ''`) no construtor e de novo a cada carga de fonte. Para sobreposições próprias, estilize o reprodutor pelo atributo `sheet`.

## Estilos

O `<r-player>` expõe **136 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-player {
  --ran-player-tip-background: var(--ran-color-bg-subtle);
}
```

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#player); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Tamanho**: o host é `display: block` e não tem tamanho intrínseco; dê sempre largura e altura explícitas, senão o vídeo colapsa.
- **Motores de streaming**: fontes `.m3u8` (HLS), `.mpd` (DASH) e `.flv`/`.ts` (FLV/MPEG-TS via `mpegts.js`) carregam o motor delas sob demanda e sozinhas; nada a configurar. Se a extensão da URL não puder ser farejada (URLs de CDN sem extensão ou assinadas), defina o atributo `format` explicitamente (por exemplo `format="dash"`) em vez de confiar na detecção. WebRTC (`format="webrtc"`) é sempre explícito: um endpoint WHEP não tem o que farejar.
- **Um ouvinte só**: prefira um único ouvinte de `change` com um `switch (detail.type)` a tentar pendurar muitos manipuladores; todo o estado passa pelo `change`.
- **Unidades de volume**: `volume` (o atributo), `setVolume()`/`getVolume()` e a carga da mudança `volume` usam todos uma única escala de `0` a `100`. Só o `<video>.volume` nativo de baixo vai de `0` a `1`; o reprodutor converte nessa única fronteira.
- **Picture-in-picture é melhoria progressiva**: o botão fica escondido, não desabilitado, quando o navegador não tem suporte; não conte com ele estar sempre no DOM.
- **Estilos próprios**: use o atributo `sheet` para injetar CSS no shadow DOM; o reprodutor não expõe identificadores `::part()` próprios.

## Planos

O `<r-player>` está em desenvolvimento ativo; veja o [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md) no repositório para o que vem a seguir.
