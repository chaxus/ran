# querystring

Wandelt ein Objekt in eine URL-Abfragezeichenkette um.

## API

### querystring

#### Rückgabe

| Argument | Beschreibung            | Typ      |
| -------- | ----------------------- | -------- |
| `string` | Die Abfragezeichenkette | `string` |

#### Parameter

| Parameter | Beschreibung          | Typ      | Standard |
| --------- | --------------------- | -------- | -------- |
| `data`    | Umzuwandelndes Objekt | `Object` | `{}`     |

## Beispiel

### Grundlegende Verwendung

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### Eine URL zusammensetzen

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### Sonderzeichen

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### undefined und null fallen weg

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// Werte, die undefined oder null sind, fallen weg
```

## Hinweise

1. **URL-Kodierung**: Die Werte werden von allein URL-kodiert.
2. **Leere Werte**: `undefined` und `null` werden aussortiert und tauchen in der Zeichenkette nicht auf.
3. **Muss ein Objekt sein**: Wird etwas anderes übergeben, fliegt ein `TypeError`.
4. **Vorverarbeitung**: Schlüssel wie Werte laufen vor dem Kodieren durch `decodeURIComponent`.
