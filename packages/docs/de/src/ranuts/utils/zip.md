# zip

ZIP-Archive lesen und ändern, ohne Abhängigkeiten, mit dem DEFLATE der Plattform selbst.

ZIP ist der Behälter hinter OOXML (`.docx`, `.xlsx`, `.pptx`), EPUB, ODF und Browser-Erweiterungen. „Hol mir eine Datei aus diesem Archiv“ und „schreib eine Datei in diesem Archiv neu“ kommen ständig vor, und eine vollständige ZIP-Bibliothek ist dafür eine schwere Abhängigkeit. Beide Aufgaben brauchen nur das zentrale Verzeichnis und DEFLATE, und DEFLATE steckt inzwischen in jedem Browser als `DecompressionStream`.

## API

| Funktion                           | Beschreibung                                                                |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | Liest das zentrale Verzeichnis als `ZipEntry[]`; `[]`, wenn es kein ZIP ist |
| `readZipEntry(bytes, nameOrEntry)` | Entpackt einen Eintrag; `null`, wenn er fehlt oder nicht unterstützt wird   |
| `zipHasEntry(bytes, name)`         | Ob es einen Eintrag mit genau diesem Namen gibt                             |
| `rewriteZip(bytes, options)`       | Baut das Archiv neu, mit ersetzten oder zusätzlichen Einträgen              |
| `createZip(files)`                 | Baut ein Archiv von Grund auf, jeder Eintrag STORED                         |
| `crc32(data)`                      | Der IEEE-CRC32, die Prüfsumme, die ZIP je Eintrag ablegt                    |
| `inflateRaw(data)`                 | Entpackt rohe DEFLATE-Bytes (ohne zlib- oder gzip-Hülle)                    |

### `rewriteZip` options

| Option      | Beschreibung                                                                                | Standard     |
| ----------- | ------------------------------------------------------------------------------------------- | ------------ |
| `filter`    | Welche Einträge entpackt und an `transform` gereicht werden                                 | alle Dateien |
| `transform` | `(data, entry) => Uint8Array \| string \| null`; bei `null` bleibt der Eintrag unangetastet | —            |
| `inject`    | Ganz neue Einträge zum Anhängen: `{ name, data }[]`                                         | —            |

### `ZipEntry`

| Feld                                        | Beschreibung                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `name`                                      | Der Pfad innerhalb des Archivs, etwa `word/document.xml`                  |
| `compression`                               | `ZIP_STORED` (0) oder `ZIP_DEFLATE` (8)                                   |
| `crc`, `compressedSize`, `uncompressedSize` | So, wie sie im zentralen Verzeichnis stehen                               |
| `modTime`, `modDate`                        | Zeitstempel im gepackten MS-DOS-Format; bleibt beim Neuschreiben erhalten |
| `directory`                                 | Ob der Name auf `/` endet                                                 |
| `dataStart`                                 | Wo die komprimierten Bytes in der Quelle beginnen                         |

## Beispiel

### Eine Datei aus einer `.docx` lesen

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### Auflisten, was drinsteckt

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### Alle XML-Teile anpassen und eine Datei hinzufügen

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### Eingebettete Medien als Object-URLs herausholen

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### Einen Behälter bauen

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## Hinweise

1. **Liest STORED und DEFLATE.** Andere Kompressionsverfahren tauchen in `readZipEntries` durchaus auf, aber `readZipEntry` gibt dafür `null` zurück, statt zu raten.

2. **Neu Geschriebenes bleibt unkomprimiert.** Ersetzte und eingefügte Einträge werden als STORED abgelegt, die Ausgabe ist also größer als die Eingabe. Unangetastete Einträge behalten ihre ursprünglichen komprimierten Bytes, wörtlich kopiert. Für Ändern-und-Weitergeben ist das der richtige Handel, fürs Archivieren der falsche.

3. **Hat sich nichts geändert, gibt `rewriteZip` das ursprüngliche Array zurück** – auch dann, wenn eine Transformation identische Bytes liefert. Dieser Weg kostet nichts, und das Ergebnis lässt sich mit `===` vergleichen.

4. **Die Größen stammen aus dem zentralen Verzeichnis, nie aus den lokalen Kopfdaten.** Archive, die ein Streaming-Writer erzeugt hat, setzen Bit 3 der Allzweck-Flags und lassen im lokalen Kopf Nullen stehen; die echten Werte füllen sie _hinter_ den komprimierten Bytes in einen Datendeskriptor. Den lokalen Kopfdaten zu trauen ist die häufigste Art, wie ein selbstgeschriebener ZIP-Leser an echten Dateien scheitert; `rewriteZip` schreibt außerdem frische lokale Kopfdaten und löscht dieses Flag, sodass seine Ausgabe auch von strengen Parsern gelesen wird.

5. **Scheitert die Transformation, bleibt der Eintrag erhalten.** Wirft `transform`, oder nutzt der Eintrag ein nicht unterstütztes Verfahren, wird der ursprüngliche Inhalt unverändert durchgereicht – ein Neuschreiben darf niemals Daten verlieren, die es nicht verstanden hat.

6. **Kein ZIP64, keine Verschlüsselung, keine Mehrteiligkeit.** Archive über 4 GiB oder mit mehr als 65535 Einträgen liegen außerhalb. `readZipEntries` gibt für alles, was es nicht lesen kann, `[]` zurück, statt zu werfen – wer es aufruft, sieht sich meist eine fremde, hochgeladene Datei an.

7. **`inflateRaw` braucht `DecompressionStream`**: in allen aktuellen Browsern und ab Node 18 vorhanden. Wo die API fehlt, wirft es.
