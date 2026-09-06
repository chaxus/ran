# AudioRecorder

Nimmt Mikrofonton in einen `Blob` auf und umgeht dabei einen echten Browser-Fehler, statt bloß `MediaRecorder` einzupacken.

Chrome (und die Chromium-Browser) schreibt die WEBM-Dateien aus `MediaRecorder` ohne die Metadaten zur Dauer: Die Datei spielt, aber Springen und Anzeigen der Länge misslingen, bis der ganze Blob einmal dekodiert wurde. `AudioRecorder` fordert das Mikrofon an, nimmt auf und flickt beim `stop()` das Dauer-Feld des WEBM-Containers an Ort und Stelle, bevor es den `Blob` herausgibt — die Aufnahme verhält sich also sofort wie eine gewöhnliche Audiodatei.

Bytes aufzunehmen und Sprache zu erkennen sind zwei verschiedene Dinge. Sieh dir [`createSpeechRecognizer`](./speech.md) an, wenn du in Wahrheit eine Abschrift willst und keine Audiodatei.

## Verwendung

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // fragt sofort nach dem Mikrofon

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

Fordert `getUserMedia({ audio: true })` an, sobald es erzeugt wird, und beginnt aufzunehmen, sobald die Erlaubnis vorliegt. Es gibt keinen eigenen Schritt zum „Scharfstellen“: Das Erzeugen **ist** die Abfrage der Erlaubnis.

### `start()`

Nimmt die Aufnahme wieder auf, falls sie mit `pause()` angehalten war. Gibt den zugrunde liegenden `MediaRecorder` zurück, oder `undefined`, solange der Mikrofon-Stream noch nicht bereit ist.

### `pause()`

Hält eine laufende Aufnahme an. Gibt den zugrunde liegenden `MediaRecorder` zurück, sonst `undefined`.

### `stop()`

Beendet die Aufnahme und gibt den aufgenommenen `Blob` synchron zurück — noch bevor die Container-Korrektur (`fixDuration`) tatsächlich gelaufen ist. Die Dauer zu flicken braucht den vollständigen Puffer, und den gibt es erst, wenn das `stop`-Ereignis des zugrunde liegenden `MediaRecorder` gefeuert hat. In der Praxis fällt das nur ins Gewicht, wenn du den Rückgabewert von `recorder.stop()` in genau diesem Augenblick liest statt einen Moment später; auf den nächsten Microtask zu warten oder `recorder.blob` zu lesen, nachdem sich die Folge aus `dataavailable` und `stop` gelegt hat, ist die sichere Reihenfolge.

## Hinweise

1. **Ein Rekorder, ein Stream.** Es gibt kein `destroy()` und keinen Abbau; ist die Erlaubnis einmal erteilt, bleibt die Mikrofonspur offen, solange die Komponente lebt. Erzeuge nicht je Aufnahme einen neuen `AudioRecorder`, sondern nutze einen weiter und ruf `start()` und `stop()`.
2. **Die Erlaubnis wird beim Erzeugen erfragt, nicht bei `start()`.** Willst du die Abfrage des Browsers hinauszögern, bis die Person wirklich auf Aufnehmen klickt, zögere das Erzeugen des `AudioRecorder` selbst hinaus, nicht bloß den Aufruf von `start()`.
3. **Die Dauer-Korrektur fasst nur `audio/webm` an.** Andere MIME-Typen, die der Browser wählen könnte (`audio/mp4`, `audio/ogg`, `audio/wav`, `audio/aac`), kommen unverändert zurück.
4. Fehler während `getUserMedia` (verweigerte Erlaubnis, kein Mikrofon) landen in der Konsole, statt geworfen oder über einen Callback gemeldet zu werden. Prüfe in deiner eigenen Oberfläche, ob die `MediaDevices`-Abfrage tatsächlich erscheint, statt dich darauf zu verlassen, dass diese Klasse eine Verweigerung meldet.
