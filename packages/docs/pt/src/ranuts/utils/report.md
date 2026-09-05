# report / setReportUrl / createData

Envia balizas de telemetria para o seu próprio endpoint.

## API

### setReportUrl(config)

Configure o endpoint padrão uma vez, na inicialização. Aceita uma URL como string, ou um objeto:

| Campo | Descrição | Tipo |
| -------------- | ----------------------------------------------------------- | -------- |
| `url` | Endpoint padrão para todo `report()` que não traga a própria `url` | `string` |
| `userIdCookie` | Cookie com o id do usuário, que o `createData()` recolhe | `string` |

### getReportUrl()

O endpoint configurado, ou `''`.

### report({ url?, type?, payload })

Envia `payload`. Prefere o `navigator.sendBeacon` e, se não der, recorre a uma requisição de imagem de 1x1. Devolve `true` quando algum transporte aceitou e `false` quando nada conseguiu enviar, inclusive quando nenhum endpoint foi configurado.

### createData(params?)

Monta o envelope padrão: id do evento, URL da página, carimbo de tempo, referenciador, viewport e user agent, mais `userId` quando `userIdCookie` está configurado. Seus `params` são aplicados por último. Sob renderização no servidor devolve `{}`.

## Exemplo

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## Notas

1. **Não há endpoint padrão, e isso é de propósito.** Uma biblioteca não tem como saber para onde vai a sua telemetria, então `report()` devolve `false` em vez de chutar.
2. **O transporte é escolhido conforme o `sendBeacon` tenha de fato dado certo**, não conforme exista `navigator`. O `sendBeacon` também devolve `false` quando a fila do navegador passa da cota; esse caso igualmente cai na baliza de imagem.
3. **Chame `createData()` a cada evento, não uma vez na configuração.** Ele fotografa a URL e o carimbo de tempo no instante em que roda; tirá-lo de dentro do manipulador faz todos os eventos seguintes relatarem o estado do carregamento da página.

::: warning Substitui o getHost na 0.3
`getHost()` não existe mais. Ele montava um endpoint de log a partir de um domínio escrito no código, o do autor deste repositório, e uma edição pela metade já havia degradado a saída para o literal `'//log.'` (que não é um host alcançável), de modo que todo relatório sem uma `url` explícita era despachado em silêncio para o nada. O `createData()` também não lê mais um cookie `chaxus_prod` escrito no código; configure `userIdCookie` no lugar.
:::
