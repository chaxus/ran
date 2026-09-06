# Die Ausführungszeit messen

Manchmal muss man messen, wie lange eine Funktion braucht, um die Leistung zu beurteilen — dafür gibt es `startTask` und `taskEnd`. Drei weitere Arten, die Zeit zu nehmen, werden ebenfalls vorgestellt:

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask` und `taskEnd`

### 1. startTask

Vor dem Beginn der Aufgabe aufrufen.

#### Rückgabe

| Parameter | Beschreibung        | Typ             |
| --------- | ------------------- | --------------- |
| taskId    | Kennung der Aufgabe | `unique symbol` |

### 2. taskEnd

Am Ende der Aufgabe aufrufen; braucht die Kennung, die `startTask` zurückgegeben hat.

#### Optionen

| Parameter | Beschreibung        | Typ             | Standard     |
| --------- | ------------------- | --------------- | ------------ |
| taskId    | Kennung der Aufgabe | `unique symbol` | Erforderlich |

#### Rückgabe

| Parameter | Beschreibung                       | Typ      |
| --------- | ---------------------------------- | -------- |
| `time`    | Wie lange die Aufgabe gedauert hat | `number` |

### 3. Beispiel

```js
const taskId = startTask();

// irgendetwas tun

const time = taskEnd(taskId);

console.log('Dauer der Aufgabe:', time);
```

## II. new Date().getTime()

`new Date().getTime()` gibt eine Zahl zurück: die Millisekunden vom 1. Januar 1970, 00:00:00 UTC (koordinierte Weltzeit) bis zu dem Zeitpunkt, den das Datumsobjekt darstellt. Damit die Laufzeit von JS zu messen hat zwei Haken:

1. In manchen Fällen reicht die Genauigkeit von einer Millisekunde nicht.
2. Der Zeitpunkt, den `new Date()` einliest, kann sich zwischen Browsern und Geräten unterscheiden. [MDN-Dokumentation](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > Wegen der Unterschiede und Ungereimtheiten zwischen den Browsern wird dringend davon abgeraten, Datumszeichenketten mit dem Date-Konstruktor einzulesen (oder mit dem gleichwertigen Date.parse). Für Datumsangaben im Format RFC 2822 gibt es nur herkömmliche Unterstützung. Beim Format ISO 8601 werden reine Datumszeichenketten (etwa „1970-01-01“) als UTC und nicht als Ortszeit behandelt, anders als Zeichenketten anderer Formate.

## III. `console.time()`, `console.timeEnd()`

Startet eine Stoppuhr, um die Dauer eines Vorgangs zu verfolgen. Jede Stoppuhr braucht einen eigenen Namen, und eine Seite kann bis zu 10.000 davon gleichzeitig laufen lassen. Ruft man `console.timeEnd()` mit dem Namen der Stoppuhr auf, gibt der Browser die vergangene Zeit in Millisekunden aus. Gegenüber `new Date().getTime()` ist das genauer: bis auf 0,001 Millisekunden (etwa 0.134ms).

## IV. `performance.now()`

`performance.now()` liefert die Zeit mit einer Genauigkeit bis in den Mikrosekundenbereich und hängt nicht an der Systemzeit (die Systemuhr kann von Hand gestellt oder von NTP und anderer Software verändert werden). Außerdem entspricht `performance.timing.navigationStart + performance.now()` ungefähr `Date.now()`. Um die Laufzeit von JS zu messen, ist `performance.now()` daher die empfehlenswertere Wahl.

> Hinweis: Zum Schutz vor Timing-Angriffen und vor Fingerprinting kann die Genauigkeit von `performance.now()` je nach Browser-Einstellung verringert werden. In `Firefox` ist die Einstellung `privacy.reduceTimerPrecision` standardmäßig aktiv, mit dem Vorgabewert `1ms`. Schaltet man `privacy.resistFingerprinting` ein, ändert sich die Genauigkeit auf 100 ms oder auf den Wert von `privacy.resistFingerprinting.reduceTimerPrecision.microseconds` — je nachdem, welcher größer ist.
