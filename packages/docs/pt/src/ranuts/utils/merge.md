# merge

Funde objetos: copia as propriedades do segundo para o primeiro.

## API

### merge

#### Retorna

| Argumento | Descrição                           | Tipo     |
| --------- | ----------------------------------- | -------- |
| `Object`  | O objeto fundido (que é o primeiro) | `Object` |

#### Parâmetros

| Parâmetro | Descrição                                                  | Tipo     | Padrão      |
| --------- | ---------------------------------------------------------- | -------- | ----------- |
| `a`       | Objeto de destino (é alterado)                             | `Object` | Obrigatório |
| `b`       | Objeto de origem (suas propriedades são copiadas para `a`) | `Object` | Opcional    |

## Exemplo

### Uso básico

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (o objeto original foi alterado)
console.log(result === obj1); // true (devolve o objeto original)
```

### Fundir objetos de configuração

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

### Passar um único argumento

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (devolve como está)
```

## Notas

1. **Altera o objeto original**: em vez de criar um novo, esta função mexe direto no primeiro.
2. **Fusão rasa**: funde apenas um nível; não desce até os objetos aninhados.
3. **Sobrescrita**: se os dois tiverem a mesma chave, o valor do segundo cobre o do primeiro.
4. **Valor devolvido**: o primeiro objeto (já alterado).

## mergeExports

Apesar do nome, é outra ferramenta: a partir de um mapa de getters, monta um objeto de exportações **avaliado preguiçosamente e congelado**, em vez de copiar valores comuns. Cada getter roda no máximo uma vez, no primeiro acesso, e daí em diante o resultado fica guardado, por meio do mesmo invólucro `once` que o `ranuts/utils` exporta à parte. Objetos comuns aninhados são fundidos (e congelados) recursivamente; qualquer coisa que não seja um getter ou um objeto aninhado lança uma exceção.

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

lazyModule.expensive; // escreve 'computing...' e então devolve o resultado
lazyModule.expensive; // devolve o resultado guardado e não escreve mais nada
```

#### Notes

1. **Não é uma fusão de uso geral.** Para valores comuns, use `merge`; `mergeExports` serve para montar um objeto com formato de módulo em que algumas propriedades custam caro e só devem ser calculadas se forem mesmo lidas.
2. **O resultado fica congelado** (`Object.freeze`), e toda propriedade definida é `configurable: false`, de modo que o objeto devolvido não pode ser reatribuído nem receber novas propriedades.
3. **Qualquer outra coisa lança.** Um valor que não seja nem um getter nem um objeto comum aninhado (um array, uma função, um primitivo atribuído direto) lança `Exposed values must be either
a getter or a nested object`.
