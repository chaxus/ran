# scriptOnLoad

Insere tags `script` ou `link` em tempo de execução e espera todos os recursos carregarem.

## API

### scriptOnLoad

#### Retorna

| Argumento       | Descrição                                                     | Tipo      |
| --------------- | ------------------------------------------------------------- | --------- |
| `Promise<void>` | Promessa resolvida quando todos os recursos tiverem carregado | `Promise` |

#### Parâmetros

| Parâmetro  | Descrição                                            | Tipo          | Padrão      |
| ---------- | ---------------------------------------------------- | ------------- | ----------- |
| `urls`     | Array com as URLs dos recursos                       | `string[]`    | Obrigatório |
| `append`   | Elemento pai onde são inseridos (opcional)           | `HTMLElement` | `body`      |
| `callback` | Callback para quando tudo tiver carregado (opcional) | `Function`    | Opcional    |

## Exemplo

### Uso básico

```js
import { scriptOnLoad } from 'ranuts';

// Carregar um único script
await scriptOnLoad(['https://example.com/script.js']);
console.log('Script carregado');
```

### Carregar vários recursos

```js
import { scriptOnLoad } from 'ranuts';

// Carregar ao mesmo tempo vários scripts e folhas de estilo
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('Todos os recursos carregados');
```

### Usar um callback

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('Recursos carregados; já dá para usar');
});
```

### Carregar uma biblioteca de terceiros em tempo de execução

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // A biblioteca já carregou e pode ser usada
  window.Library.init();
}
```

## Notas

1. **Detecta o tipo sozinho**: pela terminação da URL (`.css`) distingue folha de estilo de script.
2. **Carrega em paralelo**: todos os recursos carregam ao mesmo tempo e a promessa só resolve quando todos terminam.
3. **Onde são inseridos**: por padrão no `body`, mas dá para indicar outro elemento pai.
4. **Promessa e callback**: aceita as duas formas, e elas podem ser combinadas.
