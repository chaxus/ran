# WebDB

Eine Promise-Hülle um IndexedDB. Das native IndexedDB baut auf Ereignis-Callbacks und Transaktionen: Jedes Lesen oder Schreiben sind fünf Schritte (öffnen → Transaktion → objectStore → Anfrage → `onsuccess`/`onerror`). `WebDB` schrumpft das auf `await db.add({ storeName, data })`.

## API

### new WebDB(options)

| Parameter | Beschreibung                                                                          | Typ                | Standard     |
| --------- | ------------------------------------------------------------------------------------- | ------------------ | ------------ |
| `dbName`  | Name der Datenbank                                                                    | `string`           | Erforderlich |
| `version` | Version des Schemas; erhöhe sie, sobald sich `stores` ändert                          | `number`           | `1`          |
| `stores`  | Object Stores und Indizes, deklariert und beim Upgrade angelegt                       | `IDBStoreSchema[]` | `[]`         |
| `upgrade` | Notausgang für Migrationen, die das Schema nicht ausdrücken kann; läuft nach `stores` | `Function`         | —            |

Jede Methode erfüllt sich oder lehnt ab mit derselben Form, `IDBResult`; die aufrufende Seite muss also nur `error` prüfen.

| Methode                                              | Beschreibung                                         |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `openDataBase()`                                     | Öffnet (und aktualisiert bei Bedarf)                 |
| `closeDataBase()`                                    | Schließt und gibt den Griff frei                     |
| `refreshDatabase()`                                  | Schließt und öffnet wieder                           |
| `deleteDatabase()`                                   | Löscht die Datenbank                                 |
| `add({ storeName, data })`                           | Fügt ein; scheitert, wenn der Schlüssel schon da ist |
| `update({ storeName, data })`                        | Put: einfügen oder überschreiben                     |
| `readByKey({ storeName, key })`                      | Liest einen Datensatz                                |
| `readAll({ storeName, query?, count? })`             | Liest alle Datensätze                                |
| `readByCursor({ storeName, keyRange?, direction? })` | Läuft mit einem Cursor durch                         |
| `count({ storeName, query? })`                       | Zählt Datensätze                                     |
| `delete({ storeName, key })`                         | Löscht einen Datensatz                               |
| `clear({ storeName })`                               | Leert einen Store                                    |

### `db.collection<T>(name)`

Ein typisierter, nachsichtiger Griff auf einen einzelnen Store. Er bindet den Store-Namen einmal und gibt schlichte Werte zurück statt `IDBResult`.

| Element       | Rückgabe             | Bei Fehlschlag |
| ------------- | -------------------- | -------------- |
| `get(key)`    | `Promise<T \| null>` | `null`         |
| `all()`       | `Promise<T[]>`       | `[]`           |
| `count()`     | `Promise<number>`    | `0`            |
| `add(value)`  | `Promise<boolean>`   | `false`        |
| `put(value)`  | `Promise<boolean>`   | `false`        |
| `remove(key)` | `Promise<boolean>`   | `false`        |
| `clear()`     | `Promise<boolean>`   | `false`        |

```js
const notes = db.collection('books_notes');
await notes.put(note); // false, wenn es misslang
const all = await notes.all(); // [], wenn es misslang
```

::: warning Wähle die richtige Ebene
Jede dieser Methoden **schluckt den Fehler**. Für das, was die meisten Anwendungen in IndexedDB ablegen (wie weit gelesen wurde, Entwürfe, Zwischenspeicher), ist das die richtige Voreinstellung: Ein misslungenes Lesen soll die Funktion schmälern, nicht die Ansicht umwerfen. Sie ist die falsche Voreinstellung, wenn das Schreiben _selbst_ die Handlung ist (ein Dokument speichern, einen Kauf abschließen): Ruf dort die oben genannten Methoden auf, die `IDBResult` liefern, und kümmere dich um den Fehlschlag.
:::

## Beispiel

```js
import { WebDB } from 'ranuts';

const db = new WebDB({
  dbName: 'read',
  version: 4,
  stores: [
    { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
    { name: 'notes', options: { keyPath: 'id' } },
  ],
});

await db.openDataBase();
await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
const { data } = await db.readByKey({ storeName: 'books', key: '1' });
```

## Hinweise

1. **Stores lassen sich nur innerhalb einer Upgrade-Transaktion anlegen**: Deshalb werden sie vorab deklariert, statt sie nach dem Öffnen der Datenbank zu erzeugen. Einen fehlenden Store oder Index anzulegen ist idempotent — dasselbe `stores`-Array über Versionen hinweg beizubehalten ist also unbedenklich.
2. **Ein Versionsrückschritt heilt sich selbst.** Öffnet man mit einer niedrigeren Version, als auf der Platte liegt, fliegt ein `VersionError`; `WebDB` liest die tatsächliche Version daraus heraus, gleicht sich an und öffnet erneut, statt den Fehler nach außen zu geben.
3. **Diese Verbindung blockiert nie ein Upgrade.** Jedes Öffnen meldet `onversionchange` an; verlangt also ein anderer Tab oder Worker eine höhere Version, schließt sich diese Verbindung von selbst.
4. **Kombiniere es mit `singleFlight`**, damit gleichzeitige Aufrufer sich ein einziges Öffnen teilen: `const ready = singleFlight(() => db.openDataBase())`.
