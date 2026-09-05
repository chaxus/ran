---
description: 'Eine flüssige Milchglasfläche aus Hintergrundunschärfe, lichtbrechender SVG-Verschiebung und einem spekularen Rand — mit sauberem Rückfall, wo backdrop-filter fehlt.'
---

# Glass

Eine flüssige Milchglasfläche. `<r-glass>` mattiert und bricht, was dahinter liegt: `backdrop-filter` mit blur und saturate für das Matte, ein SVG-`feDisplacementMap` für die flüssige Lichtbrechung, dazu ein spekularer Rand und ein Glanzlicht, damit es als Glas gelesen wird. Alles ist token-getrieben; der Inhalt kommt in den Default-Slot.

> **Einsetzen, wenn** du eine durchscheinende Fläche über farbigem, unruhigem Inhalt willst (eine Hero-Karte, eine schwebende Werkzeugleiste, eine Ebene über einem Video). Das Attribut `displace` bestimmt, wie _flüssig_ es wirkt (0 ist eine flache Mattglasscheibe). Wo `backdrop-filter` fehlt, fallen alle Effekte auf eine schlichte durchscheinende Fläche zurück.

## Spielwiese

Zieh das Glas über die Bühne, stelle jedes Attribut ein und kopiere das genaue Markup. Die Vorgabewerte sind die Anmutung des matten iOS-Materials.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> Lege `<r-glass>` über farbigen oder unruhigen Inhalt: über einem einfarbigen Hintergrund ist der Effekt unsichtbar.

## Verschachtelung

`<r-glass>` lässt sich zusammensetzen: Verschachtele eines im anderen für geschichtete Materialien (etwa eine gläserne Werkzeugleiste auf einer gläsernen Fläche). Jede Schicht bricht, was hinter ihr liegt.

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">Äußere Fläche</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">Verschachtelte Glasleiste</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    Äußere Fläche
    <r-glass radius="16" displace="6">
      <div class="toolbar">Verschachtelte Glasleiste</div>
    </r-glass>
  </div>
</r-glass>
```

## API-Referenz

### Eigenschaften

| Eigenschaft   | Typ       | Standard | Beschreibung                                                                                                                                                                                                                                                                                |
| ------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`     | Radius der Hintergrundunschärfe in px (wie matt es wird).                                                                                                                                                                                                                                   |
| `saturate`    | `number`  | `180`    | Sättigung des Hintergrunds in Prozent: hebt die Farbe dessen an, was hinter dem Glas liegt.                                                                                                                                                                                                 |
| `displace`    | `number`  | `8`      | Stärke der flüssigen Brechung (Skala der SVG-Verschiebung). `0` ist eine flache Mattglasscheibe, höhere Werte wellen stärker.                                                                                                                                                               |
| `frequency`   | `number`  | `0.005`  | Grundfrequenz der Turbulenz: kleinere Werte ergeben größere, weichere Wellen.                                                                                                                                                                                                               |
| `radius`      | `number`  | `20`     | Eckenradius in px.                                                                                                                                                                                                                                                                          |
| `tint`        | `string`  | dezent   | Farbton der Glasfüllung: ein beliebiger CSS-background-Wert.                                                                                                                                                                                                                                |
| `sheen`       | `boolean` | `false`  | Animierter spekularer Streifzug über die Fläche.                                                                                                                                                                                                                                            |
| `interactive` | `boolean` | `false`  | Anheben beim Überfahren und Zusammenziehen beim Drücken, für anklickbares Glas. Macht den Host außerdem zu einer tastaturbedienbaren Schaltfläche: `role="button"`, Tabstopp, Enter/Leertaste wirken wie ein Klick.                                                                         |
| `rim`         | `boolean` | `false`  | Optionaler spekularer Rand plus chromatische Kante für eine physikalischer wirkende Beleuchtung. Zuerst WebGL (immer, synchron), im Hintergrund transparent auf WebGPU gehoben, sofern vorhanden. Fällt auf den reinen CSS-Spekulargradienten zurück, wenn keines von beiden verfügbar ist. |

### Brechung `displace`

`displace` steuert die Skala des SVG-`feDisplacementMap`: wie stark sich das Licht durch die Fläche krümmt. Setze es auf `0` für eine schlichte Mattglasscheibe.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</Demo>

```html
<r-glass displace="0">…flach matt…</r-glass> <r-glass displace="60">…flüssig…</r-glass>
```

### Schimmer und Interaktion

`sheen` legt ein wanderndes spekulares Glanzlicht darüber; `interactive` fügt ein Anheben beim Überfahren und ein federndes Drücken hinzu (über das gemeinsame Token `--ran-motion-ease-spring`).

<Demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">Überfahren und drücken</div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass sheen interactive displace="36">
  <div>Überfahren und drücken</div>
</r-glass>
```

### Rim — spekulare GPU-Kante (optional)

`rim` legt eine zweite Glanzschicht auf: einen spekularen Rand, beleuchtet aus einer festen Richtung oben links, dazu einen dezenten chromatischen (RGB) Saum an der abgerundeten Kante der Fläche. Anders als die Brechung durch `displace` **tastet er den Hintergrund nie ab**: Der Shader kennt nur Breite, Höhe und Eckenradius der Fläche selbst und kostet daher keinen der Kompromisse bei Bedienbarkeit und Barrierefreiheit, die ein GPU-Ansatz mit vollständiger Hintergrunderfassung mit sich brächte (siehe [Hinweise](#notes)). Es ist eine rein dekorative Schicht über demselben `backdrop-filter`-Matt; ein- oder auszuschalten ändert nie, was hinter dem Glas liegt oder wie es abgetastet wird.

Gezeichnet wird zuerst mit WebGL (synchron, läuft praktisch in jedem Browser, sodass der Rand sein eigenes erstes Bild nie verzögert), und im Hintergrund transparent auf WebGPU gehoben, wenn der Browser es hat (gleicher Effekt, pixelgleiche Ausgabe). Ist keine der beiden GPU-APIs verfügbar (sehr alte Browser, abgeschaltet, SSR), greift der reine CSS-Spekulargradient; es gibt keinen kaputten oder leeren Zustand, den das Design abfangen müsste.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">ohne rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…nur der CSS-Spekulargradient…</r-glass>
<r-glass rim>…GPU-Rand + chromatische Kante (WebGL, hebt auf WebGPU)…</r-glass>
```

### CSS-Parts und Tokens

Gestalte das Innenleben über `::part(glass)`, `::part(specular)` und (wenn `rim` gesetzt ist) `::part(rim)`, oder überschreibe die `--ran-glass-*`-Custom-Properties:

| Token                                         | Wofür                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| `--ran-glass-blur`                            | Radius der Hintergrundunschärfe.                                             |
| `--ran-glass-saturate`                        | Sättigung des Hintergrunds.                                                  |
| `--ran-glass-radius`                          | Eckenradius.                                                                 |
| `--ran-glass-tint`                            | Hintergrund der Füllung.                                                     |
| `--ran-glass-border`                          | Randlinie.                                                                   |
| `--ran-glass-shadow`                          | Schattenstapel (Glanz + Tiefe).                                              |
| `--ran-glass-specular-background`             | Hintergrund des spekularen Glanzlichts.                                      |
| `--ran-glass-specular-opacity`                | Stärke des Glanzlichts.                                                      |
| `--ran-glass-reduced-transparency-background` | Ersatzfläche, wenn die Systemeinstellung „Transparenz reduzieren“ aktiv ist. |
| `--ran-glass-reduced-transparency-shadow`     | Ersatzschatten im selben Zustand.                                            |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## Hinweise {#notes}

- **Abtasten des Hintergrunds.** `<r-glass>` bricht das DOM dahinter über `backdrop-filter`, sodass markierbarer Text, laufende Videos und bedienbare Elemente hinter dem Glas weiter funktionieren. `rim` (oben) ist eine rein dekorative GPU-Schicht, berechnet aus der Form der Fläche selbst: Sie tastet den Hintergrund nie ab.
- **Lesbarkeit.** Halte Fließtext auf einer deckenden inneren Fläche; verlasse dich für den Kontrast nicht allein auf das Glas.
- **Reduzierte Transparenz.** `<r-glass>` reagiert auf die Systemeinstellung „Transparenz reduzieren“ / „Kontrast erhöhen“ (`prefers-reduced-transparency: reduce`): Statt zu mattieren und zu brechen wechselt es auf eine deckende, themenbewusste Fläche (standardmäßig `--ran-color-bg-elevated`). Native Bedienelemente tun das von selbst; dies ist das Gegenstück für ein Custom Element.
- **Brechung über Browser hinweg.** Der flüssige `feDisplacementMap`-Effekt wird derzeit nur in Chromium gezeichnet: Safari und Firefox verwerfen diesen Teil des `backdrop-filter`-Werts und behalten das Matt aus blur / saturate / brightness — ein legitimer, wenn auch flacherer Rückfall, kein kaputter Zustand.
- **Bewegung.** Die Fläche animiert ausschließlich `transform`, nie Farbe, sodass ein Wechsel zwischen hellem und dunklem Thema in einem Bild erledigt ist. Schimmer und Drücken achten auf `prefers-reduced-motion`.
