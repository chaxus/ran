# AudioRecorder

Grava o áudio do microfone num `Blob` e, de quebra, contorna um bug real do navegador em vez de só embrulhar o `MediaRecorder`.

O Chrome (e os navegadores baseados em Chromium) escreve os arquivos WEBM do `MediaRecorder` sem os metadados de duração: o arquivo toca, mas não dá para saltar nele nem mostrar quanto dura até que o blob inteiro tenha sido decodificado uma vez. O `AudioRecorder` pede o microfone, grava e, no `stop()`, remenda no lugar o campo de duração do contêiner WEBM antes de devolver o `Blob`, de modo que a gravação se comporta como um arquivo de áudio comum desde o primeiro instante.

Gravar bytes e reconhecer fala são assuntos separados. Veja [`createSpeechRecognizer`](./speech.md) se o que você quer mesmo é uma transcrição, e não um arquivo de áudio.

## Uso

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // pede acesso ao microfone na hora

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

Pede `getUserMedia({ audio: true })` assim que é construído e começa a gravar assim que a permissão sai. Não há um passo separado para «engatilhar»: construir **é** pedir a permissão.

### `start()`

Retoma a gravação se ela estava em `pause()`. Devolve o `MediaRecorder` de baixo, ou `undefined` enquanto o fluxo do microfone não estiver pronto.

### `pause()`

Pausa uma gravação em curso. Devolve o `MediaRecorder` de baixo, ou `undefined`.

### `stop()`

Para a gravação e devolve o `Blob` gravado de forma síncrona, antes de o conserto do contêiner (`fixDuration`) ter de fato rodado. Remendar a duração exige o buffer inteiro, e ele só existe depois que o evento `stop` do `MediaRecorder` de baixo disparou. Na prática isso só importa se você ler o valor devolvido por `recorder.stop()` exatamente naquele instante em vez de um momento depois; esperar a próxima microtarefa, ou ler `recorder.blob` depois que a sequência `dataavailable`/`stop` assentou, é a ordem segura.

## Notas

1. **Um gravador, um fluxo.** Não há `destroy()` nem desmontagem; depois de concedida a permissão, a trilha do microfone fica aberta enquanto o componente viver. Não construa um `AudioRecorder` por gravação: reaproveite um e chame `start()` e `stop()`.
2. **A permissão é pedida na construção, não no `start()`.** Se quiser adiar a pergunta do navegador até a pessoa clicar em gravar de verdade, adie a construção do próprio `AudioRecorder`, não apenas a chamada a `start()`.
3. **O conserto da duração só mexe em `audio/webm`.** Os outros tipos MIME que o navegador possa escolher (`audio/mp4`, `audio/ogg`, `audio/wav`, `audio/aac`) voltam como estão.
4. Erros durante o `getUserMedia` (permissão negada, sem microfone) vão para o console, em vez de serem lançados ou avisados por um callback. Confira na sua própria interface se a pergunta do `MediaDevices` aparece mesmo, em vez de contar com esta classe para relatar a recusa.
