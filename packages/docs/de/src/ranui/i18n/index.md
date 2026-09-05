---
description: 'Eine Internationalisierungs-Engine ohne Framework-Bindung: ein kleiner Kern mit optionalem globalem Singleton, ohne Kopplung ans DOM.'
---

# i18n

Eine Internationalisierungs-Engine ohne Framework-Bindung. Sie folgt demselben Entwurf wie der [Router](/de/src/ranui/router/): ein kleiner Kern (`I18nCore`) mit optionalem globalem Singleton (`createI18n` / `useI18n`) und ohne Kopplung ans DOM — wie du sie an die Oberfläche bindest, bleibt dir überlassen.

> **Einsetzen, wenn** du in einer ranui-Anwendung zur Laufzeit die Sprache umschalten willst. Rufe `createI18n` einmal auf, lies Zeichenketten dann mit `useI18n().t(key, params)` und wechsle die Sprache mit `setLocale`. Es hängt weder an einem Framework noch am DOM und läuft daher in schlichtem JS, in jedem Framework und im SSR.

Die Engine kommt als eigener Einstiegspunkt **`ranui/i18n`**: Ihr Import registriert **kein** einziges Custom Element, sodass eine Seite, die nur Übersetzungen braucht, nie die Komponentenbibliothek mitzieht. Dieselben Exporte gibt es auch im obersten `ranui`-Barrel.

## Schnellstart

Erzeuge das i18n-Singleton beim Start einmal, dann übersetzt du überall:

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // Jede Sprache ist ein FLACHES Wörterbuch — Schlüssel werden wörtlich nachgeschlagen, nicht verschachtelt.
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // greift, wenn ein Schlüssel in der aktiven Sprache fehlt
  persist: true, // merkt sich die Wahl unter dem localStorage-Schlüssel 'ran-locale'
  detectNavigator: true, // setzt die Startsprache aus den Spracheinstellungen des Browsers
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // speichert und benachrichtigt die Abonnenten
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` sucht `messages[activeLocale][key]`, dann `messages[fallbackLocale][key]`, und gibt schließlich den `key` selbst zurück, wenn es beides nicht gibt. `{param}`-Platzhalter in der Zeichenkette werden aus dem zweiten Argument gefüllt. Weil der Zugriff auf eine flache Map geht, **sind die Schlüssel wörtliche Zeichenketten**: Schreibe `'hero.title'` als einen Schlüssel, nicht als verschachteltes `{ hero: { title } }`.

## Parameter (Interpolation)

Ja, Nachrichten nehmen Parameter zur Laufzeit. Setze Platzhalter im Stil `{name}` in die Zeichenkette und übergib die Werte als zweites Argument an `t()`; jedes `{param}` wird durch den passenden Wert ersetzt:

```js
createI18n({
  messages: {
    en: {
      'cart.summary': '{count} items · ${total}',
      greeting: 'Welcome back, {user}!',
    },
    zh: {
      'cart.summary': '{count} 件商品 · ¥{total}',
      greeting: '欢迎回来，{user}！',
    },
  },
});

const i18n = useI18n();
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 items · $59.9"
i18n.t('greeting', { user: 'Ada' }); // → "Welcome back, Ada!"
```

Im Einzelnen:

- Die Platzhalter-Syntax ist `{word}` (Buchstaben, Ziffern, `_`). Werte dürfen Zeichenketten oder Zahlen sein; Zahlen werden in Text umgewandelt.
- Ein Platzhalter ohne passenden Schlüssel **bleibt stehen** (`{oops}` erscheint wörtlich in der Ausgabe) — ein fehlender Parameter fällt so auf, statt stillschweigend leer zu bleiben.
- Die Interpolation läuft nach dem Rückgriff auf die Ersatzsprache, dieselben Parameter greifen also unabhängig davon, welche Sprache die Zeichenkette tatsächlich geliefert hat.
- Pluralformen sowie Zahl- und Datumsformatierung sind nicht eingebaut; baue sie mit `Intl.NumberFormat` / `Intl.PluralRules` und übergib die fertig formatierte Zeichenkette als Parameter.

## Geschweifte Klammern maskieren

Eine einzelne `{` oder `}`, oder eine Gruppe mit Leerzeichen wie `{ color: red }`, ist **kein** Platzhalter und geht unverändert durch — CSS, JSON und Codeschnipsel in einer Nachricht sind also von Haus aus sicher. Mehrdeutig ist nur ein wörtliches `{word}`, das du unverändert zeigen willst. Um es zu maskieren, **verdoppelst du die Klammern** (dieselbe Konvention wie bei Rusts `format!`, Pythons `str.format` und .NETs `String.Format`):

::: v-pre

```js
const i18n = useI18n(); // die Nachrichten unten gelten als registriert

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"  (nicht interpoliert)
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"  (Wert in wörtlichen Klammern)
```

| In der Nachricht | Ausgabe                                     |
| ---------------- | ------------------------------------------- |
| `{{`             | `{`                                         |
| `}}`             | `}`                                         |
| `{name}`         | der Parameter `name`, sonst `{name}`        |
| `{ name }`       | `{ name }` (Leerzeichen → kein Platzhalter) |
| `{`              | `{` (einzelne Klammer)                      |

Die Maskierung geschieht im selben Durchgang von links nach rechts wie die Interpolation und wirkt, ob du Parameter übergibst oder nicht — `{{` und `}}` bedeuten also immer wörtliche Klammern.

> Das Verdoppeln ist dieselbe Konvention wie bei Rusts `format!`, Pythons `str.format` und .NETs `String.Format`, es braucht also kein neues Escape-Zeichen. Wenn du echte Plural-, Genus- oder Zahlgrammatik brauchst, formatiere mit `Intl.*` und übergib das Ergebnis als Parameter.

:::

## Auf Sprachwechsel reagieren

`onChange` feuert nach jedem `setLocale`; nutze es, um bereits gezeichnete Zeichenketten neu zu setzen:

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // deine t()-Aufrufe erneut ausführen
});

// später, wenn die Ansicht verschwindet
unsubscribe();
```

## Nachrichten nachladen

Lade das Wörterbuch einer Sprache bei Bedarf (etwa je Sprache codegetrennt) und führe es zusammen:

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // wird in ein vorhandenes 'fr'-Wörterbuch eingefügt
i18n.setLocale('fr');
```

## Komponententexte lokalisieren

Die Komponenten lesen **nicht** selbst aus dieser Engine. Das ist Absicht: Eine Komponente, die direkt aus einem globalen Singleton läse, bände jeden Verwender an eine Instanz und ein Schlüsselschema — und eine Seite, die eine einzige Schaltfläche importiert, zöge die Übersetzungsschicht gleich mit. Stattdessen ist **jede sichtbare Zeichenkette eine Eingabe**: ein Attribut, eine Eigenschaft, eine Option oder Slot-Inhalt. ranui zu lokalisieren heißt also, die Ausgabe von `t()` dort einzusetzen, wo die Zeichenkette ohnehin hingehört:

```js
const i18n = useI18n(); // die Nachrichten unten gelten als registriert

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

Die meisten Komponenten haben überhaupt keinen eigenen Text: Er kommt über Slots und Attribute, die du ohnehin schreibst. Eine Handvoll bringt eine englische Vorgabe für eine Zeichenkette mit, die sonst nirgends herkommt — meist zugängliche Namen:

| Komponente                                        | Eingebautes Englisch                                                                                                       | Überschreiben mit                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | Titel `Confirm`, Schaltflächen `OK` / `Cancel`                                                                             | den Optionen `title`, `okText`, `cancelText`         |
| `Modal.info` / `.success` / `.warning` / `.error` | Titel `Info` / `Success` / `Warning` / `Error`                                                                             | der Option `title`                                   |
| `<r-theme-switch>`                                | aria-labels `Theme`, `System theme`, `Light theme`, `Dark theme`                                                           | `label`, `label-system`, `label-light`, `label-dark` |
| `<r-voice-button>`                                | aria-labels `Start voice input` / `Stop voice input`; Hinweise `Release to keep · slide up to cancel`, `Release to cancel` | `label`, `active-label`, `hold-hint`, `cancel-hint`  |
| `<r-reasoning>`                                   | Kopfzeilen-Beschriftung `Reasoning`                                                                                        | `label`                                              |
| `<r-token-meter>`                                 | Beschriftung `Context`                                                                                                     | `label`                                              |
| `<r-colorpicker>`                                 | aria-labels `Choose color`, `Hue`, `Alpha opacity`                                                                         | `label`, `hue-label`, `alpha-label`                  |

Praktisch bewährt es sich, sie bei jedem Sprachwechsel von einer Stelle aus neu zu setzen, damit derselbe Code beim Start und nach einem Wechsel läuft:

```js
const i18n = useI18n();

const applyLabels = () => {
  document.querySelectorAll('r-voice-button').forEach((el) => {
    el.setAttribute('label', i18n.t('voice.start'));
    el.setAttribute('active-label', i18n.t('voice.stop'));
  });
};

applyLabels();
i18n.onChange(applyLabels);
```

Denk daran, `document.documentElement.lang` mitzuführen: Danach richten sich Browser, Screenreader und `:lang()`-Selektoren.

## API

`createI18n(config)` erzeugt und registriert das globale Singleton (einmal aufrufen); `useI18n()` gibt es zurück, oder `null`, wenn `createI18n` noch nicht gelaufen ist.

### `I18nConfig`

| Feld              | Typ              | Standard          | Beschreibung                                                                                                                                                                                                                           |
| ----------------- | ---------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`              | `locale → { key → string }`. Jedes Wörterbuch ist flach.                                                                                                                                                                               |
| `locale`          | `string`         | die Ersatzsprache | Startsprache (eine gespeicherte Wahl sticht sie, wenn Speichern an ist).                                                                                                                                                               |
| `fallbackLocale`  | `string`         | `'en'`            | Sprache, die befragt wird, wenn ein Schlüssel in der aktiven Sprache fehlt.                                                                                                                                                            |
| `persist`         | `boolean`        | `false`           | Speichert die aktive Sprache im `localStorage`.                                                                                                                                                                                        |
| `storageKey`      | `string`         | `'ran-locale'`    | localStorage-Schlüssel, wenn `persist` an ist.                                                                                                                                                                                         |
| `detectNavigator` | `boolean`        | `false`           | Setzt die Startsprache aus den Spracheinstellungen des Browsers. Liest die vollständige geordnete Liste `navigator.languages`, sodass jemand ohne Wörterbuch für die erste Wahl immer noch die zweite bekommt statt der Ersatzsprache. |

### Methoden von `I18nCore`

| Methode                     | Rückgabe      | Beschreibung                                                                  |
| --------------------------- | ------------- | ----------------------------------------------------------------------------- |
| `t(key, params?)`           | `string`      | Übersetzt; fällt auf die Ersatzsprache und dann auf den Schlüssel zurück.     |
| `setLocale(locale)`         | `void`        | Wechselt die Sprache; speichert (falls an) und benachrichtigt die Abonnenten. |
| `getLocale()`               | `string`      | Die aktive Sprache.                                                           |
| `onChange(handler)`         | `() => void`  | Abonniert Sprachwechsel; gibt eine Funktion zum Abbestellen zurück.           |
| `addMessages(locale, dict)` | `void`        | Führt weitere Nachrichten in eine Sprache ein.                                |
| `getMessages(locale?)`      | `MessageDict` | Liest das Wörterbuch einer Sprache (Standard: die aktive).                    |
| `availableLocales`          | `string[]`    | Sprachen, für die ein Wörterbuch registriert ist.                             |
| `destroy()`                 | `void`        | Entfernt alle Abonnenten.                                                     |

**Typen**

```ts
type MessageDict = Record<string, string>; // flach: 'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

Der Kern ist SSR-sicher: Zugriffe auf `localStorage` und `navigator` sind abgesichert, sodass `createI18n` und `t` beim Rendern auf dem Server laufen, ohne zu werfen. Speicherung und Browsersprach-Erkennung tun auf dem Server schlicht nichts und greifen, sobald der Code im Browser läuft.
