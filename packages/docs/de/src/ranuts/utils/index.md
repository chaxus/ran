---
description: 'Überblick über die Hilfsfunktionen von ranuts: funktionale Helfer (debounce, throttle, memoize, compose) sowie Werkzeuge für Zeichenketten, Objekte, Zahlen und Farbe.'
---

# Hilfsfunktionen

## Funktionale Programmierung

| Methode  | Beschreibung                         | Details                   |
| -------- | ------------------------------------ | ------------------------- |
| debounce | Entprellende Funktion (debounce)     | [debounce](./debounce.md) |
| throttle | Drosselnde Funktion (throttle)       | [throttle](./throttle.md) |
| memoize  | Funktion zum Merken von Ergebnissen  | [memoize](./memoize.md)   |
| noop     | Funktion, die nichts tut             | [noop](./noop.md)         |
| compose  | Setzt Middleware-Funktionen zusammen | [compose](./compose.md)   |

## Zeichenketten

| Methode                        | Beschreibung                                                                                    | Details                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| md5                            | MD5-Hashfunktion                                                                                | [md5](./md5.md)                                     |
| randomString / getRandomString | Erzeugt eine zufällige Zeichenkette                                                             | [randomString](./random_string.md)                  |
| clearBr                        | Entfernt Leerzeichen, HTML-Tags und Zeilenumbrüche aus einer Zeichenkette                       | [clearBr](./clear_br.md)                            |
| clearStr                       | Entfernt Leerzeichen an den Rändern, URL-Kodierung und Anführungszeichen aus einer Zeichenkette | [clearStr](./clear_str.md)                          |
| truncate                       | Kürzt eine Zeichenkette mit Auslassungspunkten, ohne Unicode zu zerreißen                       | [truncate](./truncate.md)                           |
| strParse                       | Liest eine Zeichenkette als Objekt ein                                                          | [strParse](./str_parse.md)                          |
| toString                       | Wandelt einen Wert in den Typ Zeichenkette um                                                   | [toString](./to_string.md)                          |
| transformText                  | Wandelt einen ArrayBuffer in Text um                                                            | [transformText](./transform_text.md)                |
| checkEncoding                  | Erkennt die Zeichenkodierung von Uint8Array-Daten                                               | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | Holt ganze Sätze heraus, die Schlüsselwörter enthalten                                          | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | Sagt, ob ein Wert vom Typ Zeichenkette ist                                                      | [isString](./is_string.md)                          |

## Objekte

| Methode              | Beschreibung                                             | Details                         |
| -------------------- | -------------------------------------------------------- | ------------------------------- |
| merge / mergeExports | Führt Objekte zusammen; Export-Objekt mit trägen Gettern | [merge](./merge.md)             |
| isEqual              | Vergleicht zwei Werte tief auf Gleichheit                | [isEqual](./is_equal.md)        |
| cloneDeep            | Klont Objekte oder Arrays in die Tiefe                   | [cloneDeep](./clone_deep.md)    |
| querystring          | Wandelt ein Objekt in den Abfrageteil einer URL um       | [querystring](./querystring.md) |
| filterObj            | Filtert ein Objekt                                       | [filterObj](./filter_obj.md)    |
| formatJson           | Formatiertes JSON                                        | [formatJson](./format_json.md)  |

## Zahlen

| Methode                                                            | Beschreibung                                                | Details                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------- |
| range                                                              | Hält eine Zahl im angegebenen Bereich                       | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | Interpolation und Wertebereichswechsel nach Shader-Art      | [range](./range.md)                      |
| mathjs                                                             | Funktion für exaktes Rechnen mit Zahlen                     | [mathjs](./mathjs.md)                    |
| perToNum                                                           | Wandelt eine Prozentangabe als Zeichenkette in eine Zahl um | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | Formt eine Zahl zu einer Zeichenkette mit Einheit           | [transformNumber](./transform_number.md) |
| addNumSym                                                          | Setzt einer Zahl das Plus- oder Minuszeichen voran          | [addNumSym](./add_num_sym.md)            |

## Farbe

| Methode                                                                                     | Beschreibung                                                     | Details                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------- |
| hexToRgb                                                                                    | Wandelt einen hexadezimalen Farbwert in RGB um                   | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | Wandelt RGB-Werte in einen hexadezimalen Farbwert um             | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | Erzeugt ein zufälliges Farbobjekt                                | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | Color-Klasse, Wertklassen, Umrechnungen, Palettengenerator       | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | Farbmischung und -korrektur nach Shader-Art (Kanäle von 0 bis 1) | [Color](./color.md)              |

## Zeit

| Methode                               | Beschreibung                                                      | Details                                   |
| ------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| formatDuration                        | Wandelt eine Zeit in Sekunden in eine formatierte Zeichenkette um | [formatDuration](./time_format.md)        |
| formatRelative                        | Beschreibt einen Zeitpunkt im Verhältnis zu jetzt („vor 3 Tagen“) | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | Liest die Zeitzeilen von WebVTT-Untertiteln                       | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | Wandelt einen Zeitstempel in ein Date-Objekt um                   | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | Liefert einen hochauflösenden Zeitstempel                         | [performanceTime](./performance_time.md)  |

## Geräteerkennung

| Methode       | Beschreibung                              | Details                              |
| ------------- | ----------------------------------------- | ------------------------------------ |
| isMobile      | Sagt, ob das Gerät mobil ist              | [isMobile](./is_mobile.md)           |
| isWeiXin      | Sagt, ob der Browser der von WeChat ist   | [isWeiXin](./is_weixin.md)           |
| isClient      | Sagt, ob die Umgebung die des Clients ist | [isClient](./is_client.md)           |
| isSafari      | Sagt, ob der Browser Safari ist           | [isSafari](./is_safari.md)           |
| currentDevice | Liefert die aktuelle Geräteart            | [currentDevice](./current_device.md) |

## Arbeiten mit dem DOM

| Methode                                | Beschreibung                                                        | Details                                                 |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | Fügt einem DOM-Element einen CSS-Klassennamen hinzu                 | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | Nimmt einem DOM-Element einen CSS-Klassennamen weg                  | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | Erzeugt ein DocumentFragment                                        | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | Maskiert HTML-Sonderzeichen                                         | [escapeHtml](./escape_html.md)                          |
| Chain                                  | Verkettbare Klasse für Arbeiten am DOM                              | [Chain](./chain.md)                                     |
| create                                 | Hilfsfunktion zum Erzeugen von DOM-Elementen                        | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | Eingegrenzte Listener-Verwaltung und Doppeltipp-Erkennung           | [EventManager](./event_manager.md)                      |
| adoptStyles                            | Schiebt Stylesheet-Text in eine Shadow Root                         | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | Klappt oder verschiebt ein schwebendes Panel gegenüber seinem Anker | [computePlacement](./placement.md)                      |
| setFontSize2html                       | Viewport-Skalierung über flexibles rem für mobile Layouts           | [setFontSize2html](./set_font_size.md)                  |

## Medien

| Methode                | Beschreibung                            | Details                               |
| ---------------------- | --------------------------------------- | ------------------------------------- |
| AudioRecorder          | Nimmt Mikrofonton in ein `Blob` auf     | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | Sprache zu Text über die Web Speech API | [createSpeechRecognizer](./speech.md) |

## Speicher

| Methode             | Beschreibung                          | Details                                   |
| ------------------- | ------------------------------------- | ----------------------------------------- |
| localStorageGetItem | Liest einen Wert aus dem localStorage | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | Legt einen Wert im localStorage ab    | [localStorageSetItem](./local_storage.md) |

## URL und Abfrageparameter

| Methode           | Beschreibung                            | Details                                        |
| ----------------- | --------------------------------------- | ---------------------------------------------- |
| getAllQueryString | Holt die Abfrageparameter aus einer URL | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | Kodiert eine URL sicher                 | [encodeUrl](./encode_url.md)                   |
| appendUrl         | Hängt Abfrageparameter an eine URL an   | [appendUrl](./append_url.md)                   |

## Cookies

| Methode         | Beschreibung                                     | Details                                    |
| --------------- | ------------------------------------------------ | ------------------------------------------ |
| getCookie       | Liefert den Wert des angegebenen Cookies         | [getCookie](./get_cookie.md)               |
| getCookieByName | Liefert einen Cookie-Wert per regulärem Ausdruck | [getCookieByName](./get_cookie_by_name.md) |

## Bilder

| Methode              | Beschreibung                        | Details                                              |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | Wandelt eine Bilddatei in Base64 um | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | Prüft die Maße einer Bilddatei      | [isImageSize](./is_image_size.md)                    |

## Leistung

| Methode        | Beschreibung                                | Details                                |
| -------------- | ------------------------------------------- | -------------------------------------- |
| getPerformance | Liefert die Leistungskennzahlen der Seite   | [getPerformance](./get_performance.md) |
| getFrame       | Ermittelt die Bildrate                      | [getFrame](./get_frame.md)             |
| getPixelRatio  | Liefert das Auflösungsverhältnis des Canvas | [getPixelRatio](./get_pixel_ratio.md)  |

## Netzwerk

| Methode            | Beschreibung                                                          | Details                            |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------- |
| imageRequest       | Misst die Netzlatenz über eine Bildanfrage                            | [imageRequest](./image_request.md) |
| networkSpeed       | Misst Ping und Schwankung des Netzes                                  | [networkSpeed](./network_speed.md) |
| connection         | Liefert Angaben zur aktuellen Netzverbindung                          | [connection](./connection.md)      |
| getStatus / status | Nachschlagen in beide Richtungen zwischen HTTP-Statuscode und Meldung | [getStatus](./status.md)           |

## Browser

| Methode                              | Beschreibung                                          | Details                                   |
| ------------------------------------ | ----------------------------------------------------- | ----------------------------------------- |
| getWindow                            | Liefert die Größe des sichtbaren Fensters             | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | Erzeugt eine Object-URL; holt eine URL als rohe Bytes | [createObjectURL](./create_object_url.md) |

## Skripte laden

| Methode      | Beschreibung                                 | Details                             |
| ------------ | -------------------------------------------- | ----------------------------------- |
| scriptOnLoad | Fügt script- oder link-Tags zur Laufzeit ein | [scriptOnLoad](./script_on_load.md) |

## Fehlerbehandlung

| Methode         | Beschreibung                                            | Details                                   |
| --------------- | ------------------------------------------------------- | ----------------------------------------- |
| handleConsole   | Fängt Aufrufe der console-Methoden ab und behandelt sie | [handleConsole](./handle_console.md)      |
| handleError     | Globale Fehlerbehandlung                                | [handleError](./handle_error.md)          |
| handleFetchHook | Fängt fetch-Anfragen ab und behandelt sie               | [handleFetchHook](./handle_fetch_hook.md) |

## Sonstiges

| Methode            | Beschreibung                                         | Details                                  |
| ------------------ | ---------------------------------------------------- | ---------------------------------------- |
| TOTP               | Generator für zeitbasierte Einmalkennwörter          | [TOTP](./totp.md)                        |
| createSignal       | Erzeugt ein reaktives Signal                         | [createSignal](./create_signal.md)       |
| setMime / MimeType | Setzt oder aktualisiert die Zuordnung von MIME-Typen | [setMime](./set_mime.md)                 |
| getExtensions      | Liefert die Dateiendungen zu einem MIME-Typ          | [getExtensions](./get_extensions.md)     |
| SyncHook           | Klasse für synchrone Ereignis-Hooks                  | [SyncHook](./sync_hook.md)               |
| durationHandler    | Erzeugt eine verzögert ausgeführte Funktion          | [durationHandler](./duration_handler.md) |
