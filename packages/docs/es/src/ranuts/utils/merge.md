# merge

Fusiona objetos: copia las propiedades del segundo en el primero.

## API

### merge

#### Devuelve

| Argumento | Descripción                             | Tipo     |
| --------- | --------------------------------------- | -------- |
| `Object`  | El objeto fusionado (que es el primero) | `Object` |

#### Parámetros

| Parámetro | Descripción                                        | Tipo     | Por defecto |
| --------- | -------------------------------------------------- | -------- | ----------- |
| `a`       | Objeto de destino (se modifica)                    | `Object` | Obligatorio |
| `b`       | Objeto de origen (sus propiedades se copian a `a`) | `Object` | Opcional    |

## Ejemplo

### Uso básico

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (el objeto original quedó modificado)
console.log(result === obj1); // true (devuelve el objeto original)
```

### Fusionar objetos de configuración

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### Pasar un solo argumento

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (lo devuelve tal cual)
```

## Notas

1. **Modifica el objeto original**: en vez de crear uno nuevo, esta función cambia directamente el primero.
2. **Fusión superficial**: solo fusiona un nivel; no baja a los objetos anidados.
3. **Sobrescritura**: si ambos tienen la misma clave, el valor del segundo pisa al del primero.
4. **Valor devuelto**: el primer objeto (ya modificado).

## mergeExports

Pese al nombre, es otra herramienta: a partir de un mapa de captadores construye un objeto de exportaciones **evaluado de forma perezosa y congelado**, en lugar de copiar valores llanos. Cada captador corre como mucho una vez, la primera vez que se accede a él, y a partir de ahí el resultado queda guardado, mediante el mismo envoltorio `once` que `ranuts/utils` exporta por separado. Los objetos llanos anidados se fusionan (y se congelan) de forma recursiva; cualquier cosa que no sea un captador o un objeto anidado lanza una excepción.

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // escribe 'computing...' y luego devuelve el resultado
lazyModule.expensive; // devuelve el resultado guardado, ya no escribe nada
```

#### Notes

1. **No es una fusión de uso general.** Para valores llanos usa `merge`; `mergeExports` sirve para construir un objeto con forma de módulo en el que algunas propiedades cuestan de calcular y solo deberían calcularse si de verdad se leen.
2. **El resultado queda congelado** (`Object.freeze`), y toda propiedad definida es `configurable: false`, de modo que al objeto devuelto no se le puede reasignar nada ni añadirle propiedades.
3. **Cualquier otra cosa lanza.** Un valor que no sea ni un captador ni un objeto llano anidado (un array, una función, un primitivo asignado directamente) lanza `Exposed values must be either
a getter or a nested object`.
