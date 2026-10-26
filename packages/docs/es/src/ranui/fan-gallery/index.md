---
description: 'El FanGallery de ranui (<r-fan-gallery>) despliega sus hijos en abanico como una mano de cartas: se abre con un resorte la primera vez que entra en la vista y levanta el hijo bajo el puntero o con el foco.'
---

# FanGallery

Despliega sus hijos en abanico como una mano de cartas. Cada hijo gira alrededor de un punto
situado bajo la fila, de modo que el grupo se lee como un solo objeto y no como una tira.

> **Úsalo cuando** unas cuantas portadas, capturas o tarjetas deban leerse como un conjunto, y
> mostrar cada una entera importe menos que mostrar que hay varias. Para contenido que el lector
> deba comparar lado a lado, usa una cuadrícula.

## Inicio rápido

### Uso básico

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

Los hijos son tus propios elementos. Enlaces, botones e imágenes conservan sus roles, sus nombres
y su lugar en el orden de tabulación; la galería solo los mueve.

### Apertura

`spread` es el ángulo en grados entre el primer y el último hijo. Con `0` quedan todos apilados
unos sobre otros.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## Movimiento

- **Apertura.** Hasta que la galería entra en la vista por primera vez, sus hijos están apilados,
  así que el de delante se lee desde el principio. Al llegar, el abanico se abre con un resorte,
  un hijo tras otro. Se abre una vez por página; alejarse y volver con el scroll no lo repite.
- **Puntero y foco.** El hijo bajo el puntero, o el que tiene el foco, se eleva y pasa al frente,
  y sus vecinos se apartan un poco. La respuesta es inmediata, y un gesto nuevo continúa desde
  donde se había quedado el anterior.
- **Movimiento reducido.** Con `prefers-reduced-motion: reduce` el abanico está abierto desde el
  principio y cada cambio se aplica sin transición.

## Referencia de la API

### Propiedades

| Propiedad | Atributo | Tipo     | Por defecto | Descripción                                                   |
| --------- | -------- | -------- | ----------- | ------------------------------------------------------------- |
| `spread`  | `spread` | `string` | `'24'`      | Ángulo en grados entre el primer y el último hijo al abrirse. |
| `sheet`   | `sheet`  | `string` | `''`        | CSS inyectado en el shadow root.                              |

### Partes

| Parte   | Elemento                                    |
| ------- | ------------------------------------------- |
| `stage` | La cuadrícula en la que se apila cada hijo. |

### Estilos

| Token                       | Por defecto      | Qué hace                                                                 |
| --------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `--ran-fan-gallery-padding` | `--ran-space-10` | Espacio alrededor del stage hacia el que giran las esquinas.             |
| `--ran-fan-gallery-pivot`   | `320px`          | A qué distancia bajo la fila giran los hijos. Cuanto menor, más abierto. |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | Cuánto se desplaza hacia fuera el hijo bajo el puntero o con el foco.    |

La galería mide lo mismo que su hijo más alto. Las esquinas giradas desbordan el stage, así que
deja espacio a su alrededor o aumenta `--ran-fan-gallery-padding`.
