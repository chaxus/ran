# getAllQueryString

Holt alle Abfrageparameter aus einer URL und macht ein Objekt daraus.

## API

### getAllQueryString

#### Rückgabe

| Argument | Beschreibung                     | Typ                      |
| -------- | -------------------------------- | ------------------------ |
| `Object` | Objekt mit den Abfrageparametern | `Record<string, string>` |

#### Parameter

| Parameter | Beschreibung                                                        | Typ      | Standard |
| --------- | ------------------------------------------------------------------- | -------- | -------- |
| `url`     | Zu zerlegende URL (optional, standardmäßig die der aktuellen Seite) | `string` | Optional |

## Beispiel

### Grundlegende Verwendung

```js
import { getAllQueryString } from 'ranuts';

// Angenommen, die aktuelle URL lautet https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### Eine bestimmte URL zerlegen

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### Einen bestimmten Parameter lesen

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`Seite: ${page}, Anzahl: ${limit}`);
```

### Kodierte Parameter

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (von allein dekodiert)
```

## Hinweise

1. **Ein Flag ohne Wert behält seinen Platz.** `?embed` und `?embed=` ergeben beide `{ embed: '' }`. Vor 0.3 fiel jeder Parameter ohne Wert weg, wodurch sich `?readonly` und `?embed` (die übliche Schreibweise eines booleschen Flags) nicht davon unterscheiden ließen, dass der Parameter fehlt. Lies solche Flags mit [`queryFlag`](/de/src/ranuts/utils/query_flag).

2. **Ein Fragment sickert nie in den letzten Wert.** `?lang=en#section` ergibt `{ lang: 'en' }`.

3. **Getrennt wird nur am ersten `=`**, ein Wert darf also eines enthalten: `?next=/a?b=1` ergibt `{ next: '/a?b=1' }`.

4. **Dekodierung**: Schlüssel und Werte werden prozentdekodiert, und `+` wird zum Leerzeichen — genau wie bei `URLSearchParams`. Eine fehlerhafte Maskierung wie `%zz` bleibt wörtlich stehen, statt den Parameter fallen zu lassen, damit ein schlechter Wert nicht die anderen verdeckt.

5. **Server-Umgebung**: gibt `{}` zurück, wenn es kein `window` gibt und keine `url` übergeben wurde. Übergib eine URL, um es in einem Build-Skript zu benutzen.

6. **Standard-URL**: ohne `url` wird `window.location.href` genommen.

7. **Doppelte Parameter**: nur der letzte Wert bleibt.
