---
description: 'Der ranui-Player (<r-player>) umschließt ein natives <video> mit einer einheitlichen Steuerleiste: Wiedergabe, Ziehen im Fortschritt, Lautstärke, Tempo und Vollbild, dazu HLS/DASH/FLV/WebRTC-Streaming.'
---

# Player

Ein natives `<r-player>`-Medienelement, das ein `<video>` mit einer einheitlichen Steuerleiste, Ziehen im Fortschritt, Lautstärkeregelung, Wiedergabetempo, Vollbild und HLS/DASH/FLV/WebRTC-Streaming umschließt.

> **Einsetzen, wenn** du einen Videoplayer mit eingebauter Steuerleiste, Ziehen im Fortschritt, Wiedergabetempo, Vollbild und HLS/DASH/FLV/WebRTC-Streaming brauchst. `<r-player>` umschließt ein `<video>` und läuft unverändert in jedem Framework.

Auf Web Components gebaut, mit `hls.js`/`dashjs`/`mpegts.js`, die für ihr jeweiliges Format bei Bedarf nachgeladen werden — derselbe Player läuft also unverändert in jedem Framework. Die Fähigkeiten, direkt aus dem Quelltext:

- Ziehbare Fortschrittsleiste mit Puffer-Anzeige und Zeit-Tooltip beim Überfahren
- Lautstärkeregelung und Stummschalten
- Auswahl des Wiedergabetempos
- Vollbild umschalten (und `Esc` zum Verlassen)
- Bild-in-Bild umschalten: Die Schaltfläche erscheint nur, wenn der Browser es tatsächlich unterstützt
- AirPlay-/Remote-Playback-Schaltfläche: die browsereigene Geräteauswahl, per Feature-Erkennung wie bei Bild-in-Bild
- Gesten auf Mobilgeräten: Doppeltippen auf die linke oder rechte Hälfte springt ∓10s, senkrechtes Wischen auf der rechten Hälfte regelt die Lautstärke (nur Touch; Maus und Stift bleiben unberührt)
- Ziehen mit Finger, Stift oder Maus: Der Punkt auf der Leiste nutzt für alle drei eine einzige Pointer-Events-Umsetzung; nimmt der Browser den Zeiger mitten im Ziehen zurück, endet das Ziehen ohne Sprung, denn der Zeiger wurde nie an einer selbst gewählten Stelle losgelassen
- Vorschaubild beim Ziehen: Setze `thumbnails` auf die URL eines WebVTT-Sprite-Sheet-Manifests, und über dem Zeit-Tooltip erscheint ein zugeschnittenes Vorschaubild
- `poster` / `autoplay` / `loop` / `muted`: übliche `<video>`-Attribute, direkt durchgereicht
- Untertitel: Setze die Eigenschaft `tracks`; die Darstellung übernimmt der Browser selbst, dazu eine Sprachauswahl, die sich die Wahl der zuschauenden Person merkt
- Fehler und Wiederholen: bei fatalen Wiedergabefehlern ein `Modal.error()`-Dialog, standardmäßig an, abschaltbar über `disable-error-modal`
- Wiedergabe fortsetzen: über `remember-position` aktivierbar, im `localStorage` je `src` gespeichert
- QoE-Kennzahlen: `getMetrics()` leitet aus dem vorhandenen Ereignisstrom Anzahl und Dauer der Nachladepausen, die Zeit bis zum ersten Bild, die Zahl der Qualitätswechsel und der Fehler ab
- HLS- (`.m3u8`) und DASH-Wiedergabe (`.mpd`) mit automatischem Bitratenwechsel und manueller Qualitätsauswahl; FLV / rohes MPEG-TS (`.flv`/`.ts`) über `mpegts.js`. Jede Engine lädt bei Bedarf nach, ohne Einrichtung. Erzwinge eine bestimmte Engine (oder wechsle zurück zum schlichten `<video src>`) über das Attribut `format`, wenn sich die Endung einer URL nicht erschnüffeln lässt.
- WebRTC-Livewiedergabe mit geringer Latenz über WHEP (`format="webrtc"`, `src` ist die URL eines WHEP-Endpunkts): keine Bibliotheksabhängigkeit, `RTCPeerConnection` ist eine native Browser-API.
- Tastaturkürzel: `Leertaste` abspielen/pausieren, `Pfeil links` / `Pfeil rechts` 5s springen, `Escape` Vollbild verlassen, `Pos1`/`Ende`/Pfeile auf der fokussierten Leiste

## Schnellstart

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> Das Element wird als `display: block` gezeichnet. Gib ihm eine ausdrückliche Breite und Höhe (per Inline-Stil oder CSS), damit das Video einen Kasten zum Füllen hat.

## API-Referenz

### Eigenschaften

| Eigenschaft           | Typ                   | Standard | Beschreibung                                                                                                                                                                                                                                                                                  |
| --------------------- | --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                 | `string`              | `''`     | URL der Videoquelle. Sie zu ändern lädt den Player neu. Die Engine (HLS/nativ) wird anhand der Endung selbst erkannt.                                                                                                                                                                         |
| `format`              | `string`              | `''`     | Erzwingt eine bestimmte Engine (`hls` / `dash` / `flv` / `webrtc` / `native`), statt sie an der Endung von `src` zu erkennen. Nützlich bei endungslosen oder signierten Streaming-URLs; für `webrtc` **erforderlich** (ein WHEP-Endpunkt hat keine Endung). Es zu ändern lädt den Player neu. |
| `volume`              | `string`              | `''`     | Anfangslautstärke auf einer Skala von `0` bis `100`, derselben wie bei `setVolume()`/`getVolume()`.                                                                                                                                                                                           |
| `currentTime`         | `string`              | `''`     | Anfängliche Wiedergabeposition in Sekunden. Auch klein geschrieben als `currenttime` akzeptiert.                                                                                                                                                                                              |
| `playbackRate`        | `string`              | `''`     | Tempofaktor (etwa `1`, `1.5`, `2`). Auch klein geschrieben als `playbackrate` akzeptiert.                                                                                                                                                                                                     |
| `debug`               | `string`              | `''`     | Bei einem wahren Wert werden jedes interne `change`-Ereignis und Warnungen in der Konsole protokolliert.                                                                                                                                                                                      |
| `sheet`               | `string`              | `''`     | CSS-Text, der für eigene Gestaltung in das Shadow DOM der Komponente eingefügt wird.                                                                                                                                                                                                          |
| `poster`              | `string`              | `''`     | URL des Bildes, das vor der Wiedergabe gezeigt wird. Geht direkt an `<video poster>`.                                                                                                                                                                                                         |
| `autoplay`            | `boolean`             | `false`  | Boolesches Attribut: Seine Anwesenheit bedeutet `true`, wie beim nativen `<video autoplay>`. Browser verlangen in der Regel `muted`, damit die automatische Wiedergabe ohne Zutun wirklich startet.                                                                                           |
| `loop`                | `boolean`             | `false`  | Boolesches Attribut: Am Ende beginnt die Wiedergabe von vorn, wie beim nativen `<video loop>`.                                                                                                                                                                                                |
| `muted`               | `boolean`             | `false`  | Boolesches Attribut: startet stumm. Intern setzt das die Lautstärke auf `0` (damit Symbol und Regler übereinstimmen) **und** das native Flag `<video>.muted` (damit die Autoplay-Regel des Browsers erfüllt ist). Das Attribut zu entfernen stellt die vorherige Lautstärke wieder her.       |
| `thumbnails`          | `string`              | `''`     | URL eines WebVTT-Sprite-Sheet-Manifests; zeigt über dem Zeit-Tooltip ein zugeschnittenes Vorschaubild. Siehe [Vorschaubild beim Ziehen](#thumbnail-scrubbing-preview-thumbnails) weiter unten. Unabhängig von `src`: neu geladen nur, wenn sich dieses Attribut selbst ändert.                |
| `disable-error-modal` | `boolean`             | `false`  | Schaltet den eingebauten Fehler-und-Wiederholen-Dialog ab. Fehler erreichen dich weiterhin über die `change`-Ereignisse `error`/`sourceerror`, du kannst also eine eigene Oberfläche darüberlegen.                                                                                            |
| `remember-position`   | `boolean`             | `false`  | Aktiviert das Fortsetzen: Speichert die aktuelle Position beim Pausieren und wenn der Tab ausgeblendet wird im `localStorage` (Schlüssel je `src`), stellt sie beim nächsten Laden derselben `src` wieder her und löscht sie, sobald die Wiedergabe endet.                                    |
| `tracks`              | `PlayerTrackConfig[]` | `[]`     | Untertitelspuren. **Nur JS-Eigenschaft, ohne passendes Attribut** (der Player leert bei jedem Laden sein eigenes Light DOM, deklarative `<track>`-Kinder wären also entfernt, bevor sie wirken). Siehe [Untertitel](#subtitles-cc-tracks) weiter unten.                                       |

> Beobachtete Attribute (aus `observedAttributes`): `src`, `format`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `thumbnails`, `autoplay`, `loop`, `muted`, `disable-error-modal`, `remember-position`.

### Videoquelle `src`

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### WebRTC-Livewiedergabe `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

Für Livestreams mit geringer Latenz setzt du `format="webrtc"` und richtest `src` auf einen **WHEP**-Endpunkt (WebRTC-HTTP Egress Protocol), wie ihn Cloudflare Stream, LiveKits Egress, Millicast und ähnliche Plattformen bereitstellen. Es gibt keine Bibliotheksabhängigkeit: `RTCPeerConnection` und `fetch` sind native Browser-APIs, anders als bei HLS/DASH/FLV hat diese Engine also kein Paket nachzuladen. Ein WHEP-Endpunkt trägt keine Dateiendung zum Erkennen, deshalb ist `format="webrtc"` **erforderlich**; es wird nie aus `src` abgeleitet.

Unter der Haube: Es entsteht eine `RTCPeerConnection` mit `recvonly`-Transceivern für Audio und Video, dann wird auf das Sammeln der ICE-Kandidaten gewartet, das SDP-Angebot per `POST` an `src` geschickt (`Content-Type: application/sdp`), die SDP-Antwort aus dem Antwortkörper angewandt und der eingehende Stream über `video.srcObject` angehängt. Beim Beenden wird die Sitzungsressource per `DELETE` entfernt, die der Server im `Location`-Header zurückgab. Der Umfang ist bewusst bescheiden: ICE ohne Trickle (nach einigen Sekunden abgebrochen, dann mit den vorhandenen Kandidaten weiter) statt WHEPs PATCH-basiertem Trickle-Verfahren, und kein Auswerten des `Link: rel="ice-server"`-Headers für vom Server angebotene STUN/TURN-Hinweise; die meisten direkt erreichbaren WHEP-Installationen laufen ohne beides. Wie bei FLV gibt es keine Qualitätsauswahl: WHEP kennt keine standardisierte clientseitige Auswahl mehrerer Bitraten, deshalb bleibt `qualitySwitchCount` in `getMetrics()` bei dieser Engine auf `0`.

### Anfangslautstärke `volume`

Der Wert liegt auf einer Skala von `0` bis `100`.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### Anfängliche Wiedergabeposition `currentTime`

Sekunden ab Beginn des Mediums.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### Wiedergabetempo `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### Diagnoseprotokoll `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### Poster, Autoplay, Schleife, stumm

```html
<r-player
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  poster="/ran/hls/poster.jpg"
  autoplay
  muted
  loop
></r-player>
```

### Bild-in-Bild

Die PiP-Schaltfläche in der Steuerleiste erscheint nur, wenn `document.pictureInPictureEnabled` wahr ist. In Browsern ohne Unterstützung bleibt keine tote Schaltfläche zurück. Programmatisch schaltest du sie mit `togglePip()` um.

### AirPlay / Remote Playback

Die Übertragen-Schaltfläche erscheint, wenn der Browser entweder die standardisierte Remote Playback API (`videoElement.remote.prompt()`, Chrome/Edge) oder Safaris `webkitShowPlaybackTargetPicker()` (AirPlay) bereitstellt; überall sonst wird sie ausgeblendet, nicht deaktiviert — dieselbe Regel der schrittweisen Verbesserung wie bei Bild-in-Bild. Die Geräteauswahl öffnest du programmatisch mit `showRemotePlaybackPicker()`.

### Gesten auf Mobilgeräten

Nur mit dem Finger, standardmäßig an, kein Attribut zum Einschalten: Doppeltippen auf die linke Hälfte springt 10 Sekunden zurück, auf die rechte 10 Sekunden vor (ein kurzes `-10s`/`+10s` bestätigt es), und senkrechtes Ziehen auf der rechten Hälfte regelt die Lautstärke. Maus- und Stiftbedienung bleiben völlig unangetastet. Ein einfacher Tipp schaltet weiterhin zwischen Abspielen und Pause um, nur verzögert um dasselbe Zeitfenster, mit dem ein Doppeltipp erkannt wird — ein Doppeltipp zum Springen lässt den Tipp dazwischen also nie die Wiedergabe flackern. Beim Wischen wird neben dem bestehenden `volume`-Ereignis ein `gestureseek`-`change`-Ereignis (`{ direction, seconds }`) ausgelöst.

### Vorschaubild beim Ziehen `thumbnails` {#thumbnail-scrubbing-preview-thumbnails}

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` verweist auf ein WebVTT-Manifest, dessen Einträge der Sprite-Sheet-Konvention von YouTube und Video.js folgen: Der Text jedes Eintrags ist ein Bildverweis plus ein `#xywh=x,y,w,h`-Fragment, das seinen Ausschnitt aus einem gemeinsamen Sprite Sheet benennt:

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

Der Bildverweis wird relativ zur URL der VTT-Datei aufgelöst, ein Sprite Sheet neben dem Manifest braucht also keinen absoluten Pfad. Beim Überfahren (oder Ziehen) der Leiste erscheint der Eintrag, der jenen Zeitpunkt abdeckt, als zugeschnittenes Vorschaubild über dem bestehenden Zeit-Tooltip; ohne gesetztes `thumbnails` oder vor dem Laden des Manifests wird nichts gezeichnet. Das Manifest wird je Änderung von `thumbnails` einmal geholt und ausgewertet, unabhängig von `src`: Ein Wechsel der Qualität oder der Quelle lädt es nicht erneut.

### Untertitel `tracks` {#subtitles-cc-tracks}

```js
const player = document.createElement('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
stage.append(player);
```

Jeder Eintrag wird zu einem nativen `<track>` am darunterliegenden `<video>`; die Darstellung übernimmt vollständig der Browser, der Player zeichnet nichts Eigenes. In der Steuerleiste erscheint eine Sprachauswahl (ein `<r-select>`, mit derselben Bedienung wie die Qualitätsauswahl) mit **Off** und einem Eintrag je Spur; die gewählte Sprache wird im `localStorage` gemerkt und beim nächsten Mal automatisch angewandt, wenn irgendein `<r-player>` auf der Seite Spuren erhält (globale Einstellung, nicht je Video), mit Rückfall auf die Spur mit `default: true`, solange nichts gespeichert ist. `tracks = []` entfernt die Auswahl und alle Spuren. `setSubtitleLanguage(lang)` setzt die aktive Sprache aus dem Code (`lang` ist ein `srclang` oder `'off'`).

### Fehler und Wiederholen

Standardmäßig an. Ein fataler Fehler der Streaming-Engine oder ein `error`-Ereignis des nativen `<video>` öffnet einen `Modal.error()`-Dialog (nachgeladen: `r-modal` wird gar nicht erst geholt, bevor tatsächlich etwas fehlschlägt) mit einer Schaltfläche **Wiederholen**, die den Player neu lädt. Setze `disable-error-modal`, um das abzuschalten und Fehler stattdessen selbst über die `change`-Ereignisse `error`/`sourceerror` zu behandeln. Nicht fatale Engine-Fehler (die hls.js intern auffängt) lösen den Dialog nie aus.

### Wiedergabe fortsetzen `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

Speichert `getCurrentTime()` beim `pause` und immer dann, wenn der Tab ausgeblendet wird (`visibilitychange`, verlässlicher als `beforeunload`), im `localStorage` (Schlüssel je `src`), stellt es beim nächsten Laden derselben `src` wieder her und löscht es, sobald das Video `ended` erreicht. Stillschweigend übersprungen, wenn die gespeicherte Position innerhalb von 2 Sekunden vor dem Ende liegt: Ein zu Ende geschautes Video beginnt lieber von vorn, als an seinem eigenen Ende „fortgesetzt“ zu werden. Gemerkt wird nur die Position; Lautstärke, Tempo und Untertitel sind getrennte Einstellungen.

### QoE-Kennzahlen {#qoe-metrics}

```js
const player = document.createElement('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
stage.append(player);
```

`getMetrics()` liefert als einfaches Objekt eine Momentaufnahme, abgeleitet aus demselben `change`-Ereignisstrom, der unten beschrieben ist; eine gesonderte Erfassung muss man nicht einschalten:

| Feld                 | Typ              | Beschreibung                                                                              |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `rebufferCount`      | `number`         | Anzahl der Übergänge `waiting`→`playing` (Stockungen, die sich wieder erholt haben).      |
| `rebufferDuration`   | `number`         | Gesamtzeit (ms), die über alle Nachladepausen hinweg gestockt wurde.                      |
| `firstFrameMs`       | `number \| null` | ms vom Ladebeginn der aktuellen `src` bis zum ersten abspielbaren Bild; bis dahin `null`. |
| `qualitySwitchCount` | `number`         | Anzahl der Qualitätsstufen, die über die Auswahl gewählt wurden.                          |
| `errorCount`         | `number`         | Anzahl der `error`/`sourceerror`-Ereignisse.                                              |

Die Momentaufnahme wird zurückgesetzt, sobald eine neue `src`/`format` lädt. Sie beschreibt immer die **aktuelle** Quelle, keine laufende Summe über mehrere Quellen.

## Methoden

Der Player stellt an der Elementinstanz imperative Steuerungen bereit:

| Methode                                    | Beschreibung                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `play(time?)`                              | Startet die Wiedergabe, optional mit Sprung zu `time` (Sekunden).                                                   |
| `pause()`                                  | Pausiert die Wiedergabe.                                                                                            |
| `getCurrentTime()`                         | Aktuelle Wiedergabeposition in Sekunden.                                                                            |
| `setCurrentTime(seconds)`                  | Springt an eine Position.                                                                                           |
| `getTotalTime()`                           | Gesamtdauer des Mediums in Sekunden.                                                                                |
| `getVolume()` / `setVolume(v)`             | Liest oder setzt die Lautstärke auf einer Skala von `0` bis `100`, derselben wie das Attribut `volume`.             |
| `getPlaybackRate()` / `setPlaybackRate(n)` | Liest oder setzt den Tempofaktor.                                                                                   |
| `customRequestFullscreen()`                | Wechselt ins Vollbild. Gibt ein `Promise` zurück.                                                                   |
| `customExitFullscreen()`                   | Verlässt das Vollbild. Gibt ein `Promise` zurück.                                                                   |
| `togglePip()`                              | Wechselt in Bild-in-Bild oder heraus. Tut nichts ohne Unterstützung oder geladene Quelle.                           |
| `setSubtitleLanguage(lang)`                | Setzt die aktive Untertitelspur über `srclang`, oder `'off'` zum Abschalten.                                        |
| `getMetrics()`                             | Liest die aktuelle Momentaufnahme der [QoE-Kennzahlen](#qoe-metrics).                                               |
| `showRemotePlaybackPicker()`               | Öffnet die AirPlay-/Remote-Playback-Geräteauswahl des Browsers. Tut nichts ohne Unterstützung oder geladene Quelle. |

## Ereignisse

Der Player sendet ein einziges `change`-CustomEvent. Jeder interne Zustandsübergang (die nativen Medienereignisse und die eigenen Bedienaktionen des Players) mündet dort, du abonnierst also einmal und verzweigst über `detail.type`.

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` ist die <r-player>-Instanz selbst
  });
</script>
```

### Inhalt von `detail`

| Eigenschaft   | Typ       | Beschreibung                                       |
| ------------- | --------- | -------------------------------------------------- |
| `type`        | `string`  | Der Name der eingetretenen Änderung.               |
| `data`        | `unknown` | Der zur Änderung gehörende Wert bzw. das Ereignis. |
| `currentTime` | `number`  | Aktuelle Wiedergabezeit (Sekunden).                |
| `duration`    | `number`  | Gesamtdauer des Mediums (Sekunden).                |
| `tag`         | `Element` | Die `<r-player>`-Instanz.                          |

### Werte von `detail.type`

Native Medienzustände, weitergereicht vom darunterliegenden `<video>`:

| Typ              | Beschreibung                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `canplay`        | Genug Daten, um mit dem Abspielen zu beginnen.                                                                                                |
| `canplaythrough` | Kann ohne Nachladepause bis zum Ende abgespielt werden.                                                                                       |
| `complete`       | Darstellung abgeschlossen.                                                                                                                    |
| `durationchange` | Der Wert von `duration` hat sich geändert.                                                                                                    |
| `emptied`        | Medium geleert oder neu geladen.                                                                                                              |
| `ended`          | Die Wiedergabe hat das Ende erreicht.                                                                                                         |
| `error`          | Ein Medienfehler ist aufgetreten (öffnet auch den eingebauten Fehler-und-Wiederholen-Dialog, sofern `disable-error-modal` nicht gesetzt ist). |
| `loadstart`      | Der Browser hat begonnen, das Medium zu laden.                                                                                                |
| `loadedmetadata` | Die Metadaten sind geladen.                                                                                                                   |
| `loadeddata`     | Das erste Bild ist geladen.                                                                                                                   |
| `progress`       | Wird während des Ladens der Ressource regelmäßig ausgelöst.                                                                                   |
| `ratechange`     | Das Wiedergabetempo hat sich geändert.                                                                                                        |
| `seeking`        | Ein Sprung hat begonnen.                                                                                                                      |
| `seeked`         | Ein Sprung ist abgeschlossen.                                                                                                                 |
| `stalled`        | Der Browser versucht Daten zu holen, es kommt aber nichts an.                                                                                 |
| `suspend`        | Das Laden des Mediums wurde unterbrochen.                                                                                                     |
| `timeupdate`     | `currentTime` hat sich geändert.                                                                                                              |
| `volumechange`   | Die Lautstärke des Videoelements hat sich geändert.                                                                                           |
| `waiting`        | Die Wiedergabe stockt und wartet auf Daten.                                                                                                   |
| `play`           | Die Wiedergabe hat begonnen.                                                                                                                  |
| `playing`        | Die Wiedergabe wurde nach dem Puffern oder einer Pause fortgesetzt.                                                                           |
| `pause`          | Die Wiedergabe wurde pausiert.                                                                                                                |

Player-eigene Aktionen:

| Typ                | `data`                   | Beschreibung                                                                                                                                                                                                                                                                        |
| ------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `volume`           | `number` (`0`–`100`)     | Die Lautstärke wurde über die Steuerleiste oder das Stummschalten geändert.                                                                                                                                                                                                         |
| `speed`            | `number`                 | Das Tempo wurde über die Tempoauswahl geändert.                                                                                                                                                                                                                                     |
| `fullscreen`       | `boolean`                | Vollbild betreten (`true`) oder verlassen (`false`).                                                                                                                                                                                                                                |
| `pictureinpicture` | `boolean`                | Bild-in-Bild betreten (`true`) oder verlassen (`false`); wird sowohl bei `togglePip()` als auch bei den Bedienelementen des browsereigenen PiP-Fensters ausgelöst.                                                                                                                  |
| `subtitlechange`   | `string`                 | Die Untertitelsprache wurde über die Auswahl oder `setSubtitleLanguage()` geändert: ein `srclang` oder `'off'`.                                                                                                                                                                     |
| `resume`           | `number`                 | Eine gespeicherte Position wurde beim Laden stillschweigend wiederhergestellt (`remember-position`); `data` ist die wiederhergestellte Zeit in Sekunden.                                                                                                                            |
| `levelsready`      | `{ levels }`             | Das Manifest der Streaming-Engine wurde ausgewertet; die Qualitätsstufen stehen bereit.                                                                                                                                                                                             |
| `sourceerror`      | `{ fatal, detail }`      | Ein Fehler der Streaming-Engine ist aufgetreten (fällt auf die rohe `src` zurück; ein **fataler** Fehler öffnet zusätzlich den Fehler-und-Wiederholen-Dialog, sofern `disable-error-modal` nicht gesetzt ist; nicht fatale sind die interne Erholung der Engine und tun das nicht). |
| `qualityswitch`    | `{ level }`              | Es wurde eine Qualitätsstufe aus der Auswahl gewählt.                                                                                                                                                                                                                               |
| `gestureseek`      | `{ direction, seconds }` | Eine Doppeltipp-Geste zum Springen wurde ausgelöst (`direction` ist `'forward'`/`'backward'`).                                                                                                                                                                                      |

## Slots

Der Player nimmt keinen Slot-Inhalt auf: Er leert im Konstruktor und bei jedem Laden einer Quelle seine eigenen Light-DOM-Kinder (`this.innerHTML = ''`). Für eigene Überlagerungen gestalte den Player stattdessen über das Attribut `sheet`.

## Styling

`<r-player>` stellt **136 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die er aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes Element oder das Element selbst:

```css
r-player {
  --ran-player-tip-background: var(--ran-color-bg-subtle);
}
```

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#player); welches Token das richtige ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Größe**: Der Host ist `display: block` und hat keine eigene Größe; gib ihm immer eine ausdrückliche Breite und Höhe, sonst fällt das Video zusammen.
- **Streaming-Engines**: Quellen mit `.m3u8` (HLS), `.mpd` (DASH) und `.flv`/`.ts` (FLV/MPEG-TS über `mpegts.js`) laden ihre Engine je selbsttätig und bei Bedarf; einzurichten ist nichts. Lässt sich die Endung einer URL nicht erschnüffeln (endungslose oder signierte CDN-URLs), setze das Attribut `format` ausdrücklich (etwa `format="dash"`), statt dich auf die Erkennung zu verlassen. WebRTC (`format="webrtc"`) ist immer ausdrücklich: An einem WHEP-Endpunkt gibt es nichts zu erschnüffeln.
- **Ein einziger Listener**: Nimm lieber einen einzelnen `change`-Listener mit `switch (detail.type)`, als viele Handler anzuhängen; aller Zustand fließt durch `change`.
- **Einheiten der Lautstärke**: `volume` (das Attribut), `setVolume()`/`getVolume()` und die Nutzlast der `volume`-Änderung nutzen alle eine einzige Skala von `0` bis `100`. Nur das darunterliegende native `<video>.volume` reicht von `0` bis `1`; der Player rechnet an genau dieser einen Stelle um.
- **Bild-in-Bild ist schrittweise Verbesserung**: Ohne Unterstützung wird die Schaltfläche ausgeblendet, nicht deaktiviert; verlass dich nicht darauf, dass sie immer im DOM steht.
- **Eigene Gestaltung**: Nimm das Attribut `sheet`, um CSS ins Shadow DOM einzufügen; der Player selbst stellt keine `::part()`-Griffe bereit.

## Fahrplan

`<r-player>` wird aktiv weiterentwickelt; was als Nächstes geplant ist, steht in [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md) im Repository.
