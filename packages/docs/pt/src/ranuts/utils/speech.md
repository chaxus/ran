# createSpeechRecognizer / isSpeechRecognitionSupported

Um invólucro em volta do `SpeechRecognition` da Web Speech API, a contraparte do [`AudioRecorder`](./audio_recorder.md), que captura **bytes** de áudio; este aqui pede à plataforma que transforme a fala em **texto**.

Vale a pena embrulhar a API nativa uma vez em vez de mexer nela direto: no WebKit ela ainda leva prefixo (`webkitSpeechRecognition`), não aparece no `lib.dom.d.ts` e relata coisas que nem são acontecimentos (uma pausa em silêncio, um `stop()` que você mesmo chamou) pelo mesmo canal de erros de um microfone negado.

## Uso

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // relido a cada captura, não uma vez só
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('O acesso ao microfone foi negado');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // esconder o botão do microfone logo de cara
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

Devolve `boolean`. A conferência acontece na chamada, não fica guardada no carregamento do módulo; então dá para importar este módulo durante a renderização no servidor e fazer a conferência quando a página hidratar.

### `createSpeechRecognizer(options?)`

Monta um `SpeechRecognizer` reaproveitável. O `start()` cria toda vez uma instância nativa nova, então qualquer opção passada como **função** (`lang`, em especial) é relida no início de cada captura, em vez de congelar no momento da criação.

#### Parâmetros (`SpeechRecognizerOptions`)

| Opção            | Descrição                                                                             | Tipo                                             | Padrão |
| ---------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ | ------ |
| `lang`           | Etiqueta BCP 47 (`'en-US'`, `'zh-CN'`), ou uma função lida no início de cada captura  | `string \| (() => string)`                       | `''`   |
| `continuous`     | Continuar ouvindo através das pausas em vez de parar na primeira                      | `boolean`                                        | `true` |
| `interimResults` | Emitir resultados parciais enquanto a pessoa fala                                     | `boolean`                                        | `true` |
| `onResult`       | Chamado com a transcrição de **toda a captura até ali** e com se ela é definitiva     | `(transcript: string, isFinal: boolean) => void` | `-`    |
| `onError`        | Chamado com um erro já classificado                                                   | `(error: SpeechError) => void`                   | `-`    |
| `onStart`        | Dispara quando uma captura começa                                                     | `() => void`                                     | `-`    |
| `onEnd`          | Dispara uma vez por captura, tenha ela acabado como for (parada, vencida ou com erro) | `() => void`                                     | `-`    |

#### `SpeechRecognizer`

| Membro      | Descrição                                                                                             | Tipo               |
| ----------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| `supported` | `false` quando a plataforma não tem reconhecimento de fala; aí nenhum método faz nada                 | `boolean` (getter) |
| `active`    | Se há uma captura em andamento                                                                        | `boolean` (getter) |
| `start()`   | Começa uma captura. É ignorado se já houver uma em andamento                                          | `() => void`       |
| `stop()`    | Encerra a captura atual; o que já foi reconhecido fica, e em seguida vem o `onEnd`                    | `() => void`       |
| `abort()`   | Encerra a captura atual e descarta os resultados pendentes                                            | `() => void`       |
| `toggle()`  | Começa se estiver parado e para se estiver em andamento: justo o que um único botão de microfone pede | `() => void`       |

#### `SpeechError`

| Campo    | Descrição                                                                                                                                     | Tipo              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `kind`   | `'denied'` (microfone negado, vale mostrar), `'noSpeech'` / `'aborted'` (rotina, em geral não vale a pena mostrar), `'failed'` (todo o resto) | `SpeechErrorKind` |
| `detail` | A string `error` crua vinda do evento da plataforma                                                                                           | `string`          |

## Notas

1. **Não existe em todo lugar.** O Firefox não implementa `SpeechRecognition` de jeito nenhum; confira sempre `recognizer.supported` (ou `isSpeechRecognitionSupported()`) antes de oferecer um microfone, em vez de supor que o construtor existe.
2. **`supported` e `active` são getters, reavaliados a cada acesso**, e não valores tomados uma vez na criação. Isso importa se `createSpeechRecognizer()` rodar antes de existirem `window` ou o construtor com prefixo do fabricante (renderização no servidor, uma chamada logo no escopo do módulo, antes da hidratação): o reconhecedor pega a API de verdade assim que ela aparece, em vez de ficar preso para sempre dizendo `supported === false`.
3. **A transcrição do `onResult` é acumulada**, não incremental: é o texto inteiro da captura até ali, revisado conforme os resultados provisórios firmam. Não concatene você mesmo.
4. Instanciar o reconhecedor nativo ou chamar o `start()` dele pode lançar de forma síncrona (por uma restrição da Permissions-Policy, ou pelo `InvalidStateError` do Chrome quando já há uma captura em andamento); o `createSpeechRecognizer` captura isso e avisa por `onError` e `onEnd` em vez de deixar escapar.
