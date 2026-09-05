# i18n

Eine Internationalisierungs-Engine ohne Framework-Bindung: ein kleiner reaktiver Kern (`I18nCore`) mit optionalem globalem Singleton (`createI18n` / `useI18n`). Nichts hier fasst das DOM an — binde es an die Oberfläche, wie du magst.

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

Es wird auch aus `ranuts/utils` weitergereicht. Importiere aus `ranuts/i18n`, wenn du nur die i18n brauchst: Dieser Einstiegspunkt trägt allein die Engine und ihre beiden Helfer, statt dessen, was das breite `utils`-Barrel sonst noch mitzieht.

## Verwendung

```ts
import { createI18n, useI18n } from 'ranuts/i18n';

createI18n({
  messages: {
    en: { 'hero.title': 'Hello, {name}', 'nav.docs': 'Docs' },
    zh: { 'hero.title': '你好，{name}', 'nav.docs': '文档' },
  },
  fallbackLocale: 'en',
  persist: true,
  detectNavigator: true,
});

const i18n = useI18n()!;
i18n.t('hero.title', { name: 'Ada' }); // "Hello, Ada"
i18n.setLocale('zh');
i18n.t('hero.title', { name: 'Ada' }); // "你好，Ada"
```

Die Wörterbücher sind **flach**: `t()` schlägt direkt `messages[locale][key]` nach, die Schlüssel sind also wörtliche Zeichenketten wie `'hero.title'` und keine verschachtelten Objekte.

## Anfangssprache

Einmal im Konstruktor aufgelöst, in dieser Reihenfolge:

1. Die im `localStorage` gespeicherte Wahl (nur bei aktivem `persist`, und nur wenn es für diese Sprache ein Wörterbuch gibt)
2. `config.locale`
3. Die Sprachen des Browsers (nur bei aktivem `detectNavigator`)
4. `fallbackLocale`

Schritt 3 läuft über [`resolveLocale`](/de/src/ranuts/utils/resolve_locale), das die vollständige geordnete Liste `navigator.languages` liest statt nur `navigator.language`: Wessen erste Wahl nicht unter deinen Wörterbüchern ist, bekommt trotzdem die zweite, statt gleich auf die Ersatzsprache zu fallen.

## Interpolation

`t(key, params)` ersetzt `{param}`-Platzhalter in einem einzigen Durchgang von links nach rechts und folgt damit der Formatzeichenketten-Konvention von Rusts `format!`, Pythons `str.format` und .NETs `String.Format`:

::: v-pre

| Eingabe                           | Ausgabe                                                                   |
| --------------------------------- | ------------------------------------------------------------------------- |
| `{{`                              | ein wörtliches `{`                                                        |
| `}}`                              | ein wörtliches `}`                                                        |
| `{name}`                          | `params.name`, in Text umgewandelt                                        |
| `{name}` ohne passenden Parameter | bleibt unangetastet, ein verirrter Platzhalter ist so sichtbar statt leer |

:::

Ein einzelnes `{` / `}` oder eine Gruppe mit Leerzeichen wie `{ x }` ist **kein** Platzhalter und wird wörtlich ausgegeben — CSS, JSON oder Codeschnipsel in einer Nachricht kommen also unversehrt durch. Um einen Wert in wörtliche Klammern zu setzen, verdopple das äußere Paar: <code v-pre>{{{name}}}</code>.

## Typisierte Wörterbücher

Übergib die Form deines Wörterbuchs als Typargument, und jeder `t()`-Aufruf wird zur Übersetzungszeit geprüft. Ohne das verkommt ein umbenannter oder vertippter Schlüssel stillschweigend zu „zeichne den Schlüssel selbst": Die lesende Person sieht `agentModelFirstDownlaod`, wo ein Satz stehen sollte, und bis dahin schlägt nichts fehl.

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // wird noch übersetzt — das ist in Ordnung
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // Übersetzungsfehler

useI18n<Messages>()?.t('cancel'); // denselben Typ zurückgeben, damit die Prüfung bleibt
```

Drei Einzelheiten machen das brauchbar und nicht bloß vorhanden:

1. **Jede Sprache ist `Partial`.** Eine laufende Übersetzung ist der Normalfall; die Ersatzsprache deckt ab, was eine Sprache noch nicht gefüllt hat.
2. **Der Typ kommt aus dem Typargument, nie aus den Daten.** `messages` ist in `NoInfer` gehüllt, Sprachen mit unterschiedlichen Schlüsselmengen können TypeScript also nicht dazu bringen, ihre _Schnittmenge_ abzuleiten. Sonst würde ein Schlüssel, den nur die Ersatzsprache definiert, an jeder Aufrufstelle abgelehnt, und eine unvollständige Übersetzung bräche den Build, statt zur Laufzeit zurückzufallen.
3. **Ein `interface` funktioniert, nicht nur ein `type`.** Die Einschränkung lautet `StringValues<T>` (`{ [K in keyof T]: string }`) statt `Record<string, string>`, weil TypeScript implizite Indexsignaturen nur Typaliassen gibt: Die naheliegende Einschränkung hätte jeden Verwender gezwungen, sein Wörterbuch als `type` neu zu schreiben.

Das Typargument wegzulassen erhält das untypisierte Verhalten exakt: Das voreingestellte `MessageDict` ist `Record<string, string>`, dessen `keyof` `string` ist.

## Konfiguration

| Feld              | Beschreibung                                                             | Typ              | Standard       |
| ----------------- | ------------------------------------------------------------------------ | ---------------- | -------------- |
| `locale`          | Anfangssprache. Eine gespeicherte Wahl sticht sie, wenn `persist` an ist | `string`         | `-`            |
| `fallbackLocale`  | Sprache, die greift, wenn ein Schlüssel in der aktiven Sprache fehlt     | `string`         | `'en'`         |
| `messages`        | Sprache → Schlüssel → Zeichenkette                                       | `LocaleMessages` | `{}`           |
| `persist`         | Speichert die aktive Sprache im `localStorage`                           | `boolean`        | `false`        |
| `storageKey`      | `localStorage`-Schlüssel, wenn `persist` an ist                          | `string`         | `'ran-locale'` |
| `detectNavigator` | Setzt die Anfangssprache aus den Spracheinstellungen des Browsers        | `boolean`        | `false`        |

## API

### createI18n

Erzeugt und registriert das globale Singleton.

#### Parameter

| Parameter | Beschreibung            | Typ          | Standard |
| --------- | ----------------------- | ------------ | -------- |
| `config`  | Siehe **Konfiguration** | `I18nConfig` | `{}`     |

#### Rückgabe

| Argument | Beschreibung     | Typ        |
| -------- | ---------------- | ---------- |
| `i18n`   | Die neue Instanz | `I18nCore` |

### useI18n

Gibt die aktive globale Instanz zurück, oder `null`, wenn keine erzeugt wurde.

#### Rückgabe

| Argument | Beschreibung                   | Typ                |
| -------- | ------------------------------ | ------------------ |
| `i18n`   | Die aktive Instanz oder `null` | `I18nCore \| null` |

### I18nCore

| Element                     | Beschreibung                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `t(key, params?)`           | Übersetzt; fällt auf die Ersatzsprache und dann auf den Schlüssel selbst zurück              |
| `locale` / `getLocale()`    | Die aktive Sprache                                                                           |
| `setLocale(locale)`         | Wechselt die Sprache, speichert (falls an) und benachrichtigt. Ohne Änderung passiert nichts |
| `addMessages(locale, dict)` | Führt ein Wörterbuch in eine Sprache ein und legt sie bei Bedarf an                          |
| `getMessages(locale?)`      | Das Wörterbuch einer Sprache, oder `{}`                                                      |
| `availableLocales`          | Sprachen, für die ein Wörterbuch angemeldet ist                                              |
| `onChange(fn)`              | Abonniert Sprachwechsel; gibt eine Funktion zum Abbestellen zurück                           |
| `destroy()`                 | Entfernt alle Abonnenten                                                                     |

## SSR

Sicher. Jeder Zugriff auf `localStorage` und `navigator` ist abgesichert, eine Instanz während des Server-Renderings zu erzeugen fällt also auf `config.locale` oder `fallbackLocale` durch.
