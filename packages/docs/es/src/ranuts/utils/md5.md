# md5

Función hash MD5: convierte una cadena en su valor MD5 (una cadena hexadecimal).

## API

### md5

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | ----------------------------------- | -------- |
| `string` | El valor MD5 (cadena hexadecimal) | `string` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | -------------- | -------- | -------- |
| `str` | Cadena a la que aplicar el hash | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### Hash de una contraseña

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### Hash del contenido de un archivo

```js
import { md5 } from 'ranuts';

const fileContent = 'aquí el contenido del archivo';
const fileHash = md5(fileContent);
console.log('Hash del archivo:', fileHash);
```

### Cuando no se pasa una cadena

```js
import { md5 } from 'ranuts';

// Si se pasa algo que no es una cadena, devuelve una cadena aleatoria
const result = md5(123);
console.log(result); // Cadena aleatoria
```

## Notas

1. **Seguridad**: MD5 se considera inseguro y no debe usarse para guardar contraseñas ni en nada delicado. Mejor un algoritmo más sólido, como SHA-256.
2. **Tipo de entrada**: si la entrada no es una cadena, la función devuelve una cadena aleatoria.
3. **Formato de salida**: una cadena hexadecimal de 32 caracteres, en minúsculas.
4. **Rendimiento**: con mucho volumen de datos el cálculo puede tardar, así que conviene hacerlo en un contexto asíncrono.
