# createHandoff

Passa um valor (um `File`, um `Blob`, qualquer coisa clonável estruturadamente) de uma página para a seguinte dentro da mesma origem.

Um `File` que a pessoa escolheu na página A não consegue viajar até a página B. Não cabe numa URL e não é serializável; o `sessionStorage` só aceita strings. O IndexedDB guarda como estão os valores clonáveis estruturadamente, então a página A deixa o valor e navega, e a página B o retira.

## API

### createHandoff(options)

| Parâmetro   | Descrição                                                   | Tipo     | Padrão      |
| ----------- | ----------------------------------------------------------- | -------- | ----------- |
| `dbName`    | Nome do banco; os dois lados precisam usar o mesmo          | `string` | Obrigatório |
| `storeName` | Nome do repositório de objetos, criado na primeira abertura | `string` | `'files'`   |
| `key`       | Chave sob a qual o único valor pendente é guardado          | `string` | `'pending'` |

#### Retorna

| Método       | Descrição                                                               |
| ------------ | ----------------------------------------------------------------------- |
| `put(value)` | Guarda um valor para a próxima página. `false` se não conseguiu guardar |
| `take()`     | Retira o valor pendente e o apaga. `null` se não houver nada pendente   |

## Exemplo

### A página de entrada passa um arquivo para o app

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### O app o retira

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // null ao recarregar: o valor já foi consumido
}
```

## Notas

1. **Ler destrói.** O `take()` apaga o valor dentro da mesma transação em que o lê. É isso que impede que recarregar a página reabra o mesmo arquivo, e o que faz uma URL `?open=local` velha não encontrar nada.

2. **Duas abas não podem vencer as duas.** Como a leitura e a exclusão dividem uma só transação, uma disputa entre abas entrega o valor a exatamente uma delas.

3. **`put` resolve na confirmação, não no pedido de escrita.** O valor só fica seguro quando a transação é confirmada, e a página costuma sair logo em seguida.

4. **As falhas são discretas.** Um IndexedDB ausente ou bloqueado (renderização no servidor, modo privado, um quadro de terceiros) faz `put` resolver como `false` e `take` como `null`. Uma página que apenas _tentou_ entregar algo não pode quebrar porque não havia armazenamento.

5. **O repositório é criado na versão 1** por quem abrir o banco primeiro; o outro lado o encontra pronto.

6. **Um valor por vez.** Isto é uma passagem de bastão, não uma fila: um segundo `put` sobrescreve o valor pendente. Use [`WebDB`](/pt/src/ranuts/utils/web_db) quando precisar de armazenamento de verdade.
