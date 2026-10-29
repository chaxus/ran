---
description: 'Eine flüssige Glasfläche: Material wählen, und sie mattiert, was dahinter liegt, und bricht es an einem linsenförmigen Rand. Über einem Bild oder Video bricht sie mit WebGL2 die Pixel selbst.'
---

# Glass

Eine flüssige Glasfläche. Wähle ein `material`, und die Scheibe ist fertig: Sie mattiert, was dahinter liegt, bricht es an einem gekrümmten Rand wie eine Linse, trennt die Farben am Rand leicht auf und beleuchtet die Kante. Jeder einzelne Wert lässt sich mit einem gleichnamigen Attribut überschreiben. Der Inhalt kommt in den Default-Slot und erhält eine Farbe, die auf dem Glas lesbar ist.

> **Einsetzen, wenn** eine Fläche über reichem, farbigem Inhalt liegt: eine Hero-Karte, eine schwebende Werkzeugleiste, eine Ebene über Medien. Über einem flachen Hintergrund gibt es nichts zu brechen, und der Effekt verschwindet.

## Spielwiese

Zieh das Glas, wechsle Material und Hintergrund und kopiere das Markup. Der Ausschnitt enthält nur, was vom Material abweicht.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## Materialien

Vier Materialien decken die meisten Fälle ab. `regular` ist der Standard.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| Material  | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## Über einem Bild

Füge `backdrop` hinzu, wenn das Glas über einem `<img>` oder `<video>` liegt. Ohne Wert nimmt es das erste Bild oder Video im Elternelement des Glases; ein Selektor benennt ein anderes. Das Glas liest dann die Pixel dieses Elements mit WebGL2 und bricht jede Wellenlänge um ihren eigenen Betrag, in jeder Engine mit WebGL2, während der CSS-Weg Licht nur in Chromium bricht. Das Bild bleibt in der Seite, sodass sein Alt-Text und der umgebende Inhalt unverändert bleiben.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

Ein Bild von einem anderen Origin braucht `crossorigin` und eine CORS-Antwort, um lesbar zu sein; sonst behält das Glas seine CSS-Mattierung.

## Ton und Tinte

`tone` sagt, was hinter dem Glas liegt. Auf dunklem oder farbigem Hintergrund wird der Rand beleuchtet und der Inhalt ist weiß; auf hellem verschwindet ein weißer Rand, also wird der Rand abgedunkelt und der Inhalt dunkel. Über einem `backdrop`-Bild folgt der Ton der Helligkeit der verdeckten Fläche, sofern du ihn nicht setzt. Der aktive Ton steht als `:state(light)` und `:state(dark)` zur Verfügung, und `--ran-glass-ink` überschreibt die Inhaltsfarbe.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## Verschachtelung

`<r-glass>` lässt sich kombinieren: Verschachtle eines im anderen für geschichtete Materialien, etwa eine Glas-Werkzeugleiste auf einem Glas-Panel. Jede Ebene bricht, was hinter ihr liegt.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API-Referenz

### Eigenschaften

| Eigenschaft   | Typ       | Standard     | Beschreibung                                                                                                                                                                                                      |
| ------------- | --------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular`    | `thin`, `regular`, `thick` oder `clear`: setzt alle optischen Werte darunter auf einmal.                                                                                                                          |
| `blur`        | `number`  | vom Material | Mattierungsradius, in px.                                                                                                                                                                                         |
| `saturate`    | `number`  | vom Material | Sättigung dessen, was dahinter liegt, in Prozent.                                                                                                                                                                 |
| `displace`    | `number`  | vom Material | Wie weit der Rand den Hintergrund nach innen zieht, in px. `0` ist eine flache Scheibe.                                                                                                                           |
| `bevel`       | `number`  | vom Material | Breite des gekrümmten Randbands, das Licht bricht, in px.                                                                                                                                                         |
| `dispersion`  | `number`  | vom Material | Wie weit sich die Farben am Rand auftrennen, in Prozent von `displace`.                                                                                                                                           |
| `specular`    | `number`  | vom Material | Stärke der Glanzlichter, in Prozent.                                                                                                                                                                              |
| `radius`      | `number`  | `20`         | Eckenradius, in px.                                                                                                                                                                                               |
| `tint`        | `string`  | vom Material | Füllung über der Mattierung: ein beliebiger CSS-Hintergrundwert.                                                                                                                                                  |
| `tone`        | `string`  | `dark`       | `dark` oder `light`: was hinter dem Glas liegt. Über einem `backdrop` ungesetzt, folgt es dem Bild.                                                                                                               |
| `backdrop`    | `string`  | —            | Bricht ein `<img>` oder `<video>` mit WebGL2. Leer nimmt das erste im Elternelement; ein Selektor benennt ein anderes.                                                                                            |
| `rim`         | `boolean` | `false`      | Ein per GPU beleuchteter Rand: Außen- und Innenwand, Haupt- und Fülllicht, Glitzer. Hängt nur von der Form der Fläche ab.                                                                                         |
| `sheen`       | `boolean` | `false`      | Ein Glanzlicht, das über die Oberfläche streicht.                                                                                                                                                                 |
| `interactive` | `boolean` | `false`      | Anheben beim Hover und Rückmeldung beim Drücken, für klickbares Glas. Macht den Host außerdem zu einem per Tastatur bedienbaren Button: `role="button"`, ein Tab-Stopp, Enter und Leertaste wirken wie ein Klick. |

### Brechung `displace`

`displace` legt fest, wie weit der Rand das Dahinterliegende zur Mitte zieht, sodass der Hintergrund direkt innerhalb des Rands über ihn gedehnt wird, so wie ein dicker konvexer Rand vergrößert. `bevel` legt fest, wie breit dieses gekrümmte Band ist. Oberhalb der halben Bevel-Breite faltet der Rand das Bild auf sich selbst zurück, wie es der Rand echten dicken Glases tut.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### Schimmer und Interaktion

`sheen` fügt ein wanderndes Glanzlicht hinzu; `interactive` fügt ein Anheben beim Hover und ein Drücken, das ohne Nachfedern zurückkehrt hinzu.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — spekulare GPU-Kante (optional)

`rim` zeichnet den Rand auf der GPU: eine helle Außenwand und eine schwächere Innenwand dort, wo der Bevel auf die flache Fläche trifft, beleuchtet von einem Hauptlicht von oben links und einem schwachen Fülllicht von unten rechts, mit einer Dicke, die entlang des Rands variiert, und gelegentlichem Glitzern. Bei `light`-Ton werden die Wände stattdessen abgedunkelt. Den Hintergrund tastet es nie ab: Der Shader kennt nur Größe, Radius und Bevel der Fläche. Es rendert zuerst mit WebGL, wechselt im Hintergrund zu WebGPU, wenn der Browser es hat, und lässt das CSS-Glanzlicht unangetastet, wenn keins von beiden verfügbar ist.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### CSS-Parts und Tokens

Gestalte das Innere mit `::part(glass)`, `::part(specular)`, `::part(refraction)` und, wenn `rim` gesetzt ist, `::part(rim)`, oder überschreibe die Custom Properties `--ran-glass-*`:

| Token                                         | Wofür                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| `--ran-glass-ink`                             | Inhaltsfarbe. Standardmäßig Weiß, auf hellem Ton nahezu Schwarz.             |
| `--ran-glass-tint`                            | Füllung über der Mattierung.                                                 |
| `--ran-glass-border`                          | Randlinie.                                                                   |
| `--ran-glass-shadow`                          | Schattenstapel (Glanz und Tiefe).                                            |
| `--ran-glass-brightness`                      | Helligkeit dessen, was dahinter liegt.                                       |
| `--ran-glass-specular-background`             | Hintergrund des CSS-Glanzlichts.                                             |
| `--ran-glass-specular-opacity`                | Stärke des CSS-Glanzlichts; überschreibt `specular` für diese Ebene.         |
| `--ran-glass-reduced-transparency-background` | Ersatzfläche, wenn die Systemeinstellung „Transparenz reduzieren“ aktiv ist. |
| `--ran-glass-reduced-transparency-shadow`     | Ersatzschatten im selben Zustand.                                            |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## Hinweise {#notes}

- **Zwei Wege.** Ohne `backdrop` mattiert `backdrop-filter` die echte Seite hinter dem Glas, sodass Text, Video und Bedienelemente dahinter weiter funktionieren; der linsenförmige, farbgetrennte Rand ist ein SVG-Filter, der in Chromium rendert, Safari und Firefox behalten die Mattierung. Mit `backdrop` bricht WebGL2 dieses eine Bild oder Video in jeder Engine, die WebGL2 hat.
- **Lesbarkeit.** Der Inhalt nimmt `--ran-glass-ink`. Halte langen Text auf einer deckenden inneren Fläche, statt dich für den Kontrast auf das Glas zu verlassen.
- **Reduzierte Transparenz.** Unter der Systemeinstellung „Transparenz reduzieren“ oder „Kontrast erhöhen“ (`prefers-reduced-transparency: reduce`) wird das Glas zu einer deckenden, themenbewussten Fläche (`--ran-color-bg-elevated`), ohne Mattierung, Brechung oder Glanzlichter.
- **Bewegung.** Die Fläche animiert nur `transform`, sodass ein Themenwechsel in einem Bild erledigt ist. Schimmer und Drücken achten auf `prefers-reduced-motion`.
- **Kosten.** Die SVG-Linsenkarte wird neu erzeugt, wenn sich Größe, Radius oder Bevel der Fläche ändern. Die WebGL-Brechung prüft Fläche und Bild einmal pro Frame, solange sie sichtbar ist, und zeichnet nur, wenn sich eines davon bewegt hat.
