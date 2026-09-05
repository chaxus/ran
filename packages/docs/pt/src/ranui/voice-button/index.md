---
description: 'Um botão de microfone para um compositor de texto que informa o que foi ouvido, deixa o aplicativo decidir para onde o texto vai e nunca envia em nome de quem fala.'
---

# Voice Button

Ditado para um compositor de texto, sobre a API Web Speech.

> **Use quando** quiser a fala como _mais uma_ forma de preencher um campo de texto, não como
> substituta. Digitar precisa continuar disponível: um caminho só por voz exclui quem tem uma
> diferença de fala, quem está numa sala barulhenta e quem usa um navegador sem reconhecimento
> algum.

Um botão de microfone, e nada além. Ele cuida da captura e informa o que ouviu; para onde esse texto
vai é decisão de quem o usa, porque um componente que também escrevesse num campo teria de saber em
qual, se acrescenta ou substitui, e o que fazer com o cursor: três respostas que mudam a cada
aplicativo.

## Início rápido

```html
<r-voice-button label="Iniciar ditado" active-label="Parar ditado"></r-voice-button>
```

```ts
const mic = document.createElement('r-voice-button');
mic.label = 'Iniciar ditado';
mic.activeLabel = 'Parar ditado';
const input = document.querySelector('textarea');
let base = '';

mic.addEventListener('voicestart', () => {
  // Um espaço entre o que foi digitado e o que foi dito, a menos que já exista um.
  base = input.value === '' || /\s$/.test(input.value) ? input.value : `${input.value} `;
});

mic.addEventListener('voiceresult', (event) => {
  input.value = base + event.detail.transcript;
});

composer.append(mic);
```

## As decisões por trás disso

### Ele informa a captura inteira, não o fragmento mais novo

Resultados provisórios são **revisados** conforme o reconhecimento avança: "你好" vira "你好世界",
e não chega um segundo evento carregando "世界". Quem acrescentasse cada evento terminaria com
`你好你好世界`. Lembre o texto que já estava no campo e concatene uma única vez.

### Ele não envia

O reconhecimento erra com frequência suficiente para que confirmar em nome de quem fala tire dela a
revisão de que precisa. Isto preenche a caixa e para por aí. Enviar continua sendo um ato
deliberado.

### Ele se esconde onde não existe reconhecimento

O Firefox não traz reconhecimento de fala, nem qualquer navegador em que a API esteja ausente.
Quando o reconhecimento não é suportado, o elemento se esconde com `hidden` em vez de se
desabilitar com `disabled`: `disabled` dá a entender que o recurso existe mas está temporariamente
indisponível, enquanto remover o botão é exato quando o recurso não existe nesta plataforma.
Mostrar um botão que nunca vai funcionar convidaria a um toque que não faz nada, e depois exigiria
uma explicação.

### Só dois dos quatro erros valem a pena mostrar

| Tipo       | O que é                         | Mostrar?               |
| ---------- | ------------------------------- | ---------------------- |
| `denied`   | o microfone foi recusado        | **sim** (dá para agir) |
| `failed`   | qualquer outra coisa deu errado | **sim**                |
| `noSpeech` | uma pausa em silêncio           | não                    |
| `aborted`  | uma parada por código           | não                    |

Os dois últimos chegam pelo mesmo canal de uma falha real e não são uma. Trazê-los à tona mostraria
um erro depois de toda captura comum, não só das falhas de verdade.

### Acessibilidade

O **nome acessível muda com o estado**, não só o ícone, e o `aria-pressed` carrega a alternância: um
leitor de tela anuncia "Parar ditado, pressionado", não um ícone. **Escape descarta** uma captura em
vez de confirmá-la, que é o que quer quem percebe no meio da frase que falou a coisa errada.

O estado de escuta é transmitido por borda, preenchimento _e_ um anel, então não depende só da cor. O
anel é o único movimento e é decoração; `prefers-reduced-motion` o remove sem perder informação.

### O idioma segue a página

`lang` é lido **a cada captura** e assume por padrão o do documento, então um aplicativo que troca de
idioma no meio da sessão dita no idioma que está exibindo.

## Referência da API

### Propriedades

| Propriedade   | Tipo      | Padrão                | Descrição                                                                                                              |
| ------------- | --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `lang`        | `string`  | o do documento        | Etiqueta BCP 47 do idioma falado. Lida a cada captura.                                                                 |
| `continuous`  | `boolean` | `true`                | Continua ouvindo através das pausas em vez de parar na primeira.                                                       |
| `disabled`    | `boolean` | `false`               | Desabilita o botão: `start()` é ignorado e o botão interno fica desabilitado. Não interrompe uma captura em andamento. |
| `label`       | `string`  | `'Start voice input'` | Nome acessível enquanto ocioso.                                                                                        |
| `activeLabel` | `string`  | `'Stop voice input'`  | Nome acessível enquanto ouve.                                                                                          |
| `listening`   | `boolean` | `false`               | Somente leitura, refletido: estilize com `:host([listening])`.                                                         |
| `supported`   | `boolean` | —                     | Somente leitura. Se esta plataforma consegue reconhecer fala.                                                          |
| `sheet`       | `string`  | `''`                  | CSS injetado no shadow DOM do elemento.                                                                                |

### Métodos

`start()` · `stop()` (mantém o que foi reconhecido) · `abort()` (descarta) · `toggle()`.

O `toggle()` lê o estado do próprio reconhecedor, e não o atributo refletido: uma captura que tenha
começado sem informar deixaria os dois em desacordo, e a próxima ativação tentaria abrir uma segunda
captura, seria recusada e não faria nada.

### Eventos

| Evento        | Detail                    | Disparado quando                          |
| ------------- | ------------------------- | ----------------------------------------- |
| `voicestart`  | —                         | uma captura começa                        |
| `voiceresult` | `{ transcript, isFinal }` | chega texto ou ele é revisado             |
| `voiceerror`  | `{ kind, detail }`        | a plataforma informa um problema          |
| `voiceend`    | —                         | a captura termina, seja qual for o motivo |

### Partes

`button`, `icon`.

## Estilos

O `<r-voice-button>` expõe **20 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-voice-button {
  --ran-voice-background: var(--ran-color-bg-subtle);
}
```

Partes: `button` · `hint` · `icon`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#voice-button); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Veja também

- [`createSpeechRecognizer`](../../ranuts/utils/): o reconhecedor que isto envolve
- [Conversation](../conversation/): a transcrição em que uma mensagem ditada aterrissa
