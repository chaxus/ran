---
description: 'Panorama das funções utilitárias do ranuts: auxiliares funcionais (debounce, throttle, memoize, compose) mais utilitários de string, objeto, número e cor.'
---

# Funções utilitárias

## Programação funcional

| Método   | Descrição                    | Detalhe                   |
| -------- | ---------------------------- | ------------------------- |
| debounce | Função de debounce           | [debounce](./debounce.md) |
| throttle | Função de throttle           | [throttle](./throttle.md) |
| memoize  | Função de memoização         | [memoize](./memoize.md)   |
| noop     | Função que não faz nada      | [noop](./noop.md)         |
| compose  | Compõe funções de middleware | [compose](./compose.md)   |

## Strings

| Método                         | Descrição                                                         | Detalhe                                             |
| ------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------- |
| md5                            | Função de hash MD5                                                | [md5](./md5.md)                                     |
| randomString / getRandomString | Gera uma string aleatória                                         | [randomString](./random_string.md)                  |
| clearBr                        | Tira espaços, tags HTML e quebras de linha de uma string          | [clearBr](./clear_br.md)                            |
| clearStr                       | Tira espaços das pontas, codificação de URL e aspas de uma string | [clearStr](./clear_str.md)                          |
| truncate                       | Encurta uma string com reticências, sem quebrar o Unicode         | [truncate](./truncate.md)                           |
| strParse                       | Interpreta uma string e devolve um objeto                         | [strParse](./str_parse.md)                          |
| toString                       | Converte um valor para o tipo string                              | [toString](./to_string.md)                          |
| transformText                  | Converte um ArrayBuffer em texto                                  | [transformText](./transform_text.md)                |
| checkEncoding                  | Detecta a codificação de caracteres de dados Uint8Array           | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | Extrai frases inteiras que contêm palavras-chave                  | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | Diz se um valor é do tipo string                                  | [isString](./is_string.md)                          |

## Objetos

| Método               | Descrição                                                   | Detalhe                         |
| -------------------- | ----------------------------------------------------------- | ------------------------------- |
| merge / mergeExports | Funde objetos; objeto de exportação com getters preguiçosos | [merge](./merge.md)             |
| isEqual              | Compara dois valores em profundidade para ver se são iguais | [isEqual](./is_equal.md)        |
| cloneDeep            | Clona objetos ou arrays em profundidade                     | [cloneDeep](./clone_deep.md)    |
| querystring          | Converte um objeto na query string de uma URL               | [querystring](./querystring.md) |
| filterObj            | Filtra um objeto                                            | [filterObj](./filter_obj.md)    |
| formatJson           | JSON formatado                                              | [formatJson](./format_json.md)  |

## Números

| Método                                                             | Descrição                                         | Detalhe                                  |
| ------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------- |
| range                                                              | Prende um número dentro da faixa indicada         | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | Interpolação e remapeamento no estilo dos shaders | [range](./range.md)                      |
| mathjs                                                             | Função de cálculo numérico exato                  | [mathjs](./mathjs.md)                    |
| perToNum                                                           | Converte uma string de porcentagem em número      | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | Converte um número numa string com unidades       | [transformNumber](./transform_number.md) |
| addNumSym                                                          | Põe o sinal de positivo ou negativo num número    | [addNumSym](./add_num_sym.md)            |

## Cor

| Método                                                                                      | Descrição                                                         | Detalhe                          |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| hexToRgb                                                                                    | Converte uma cor hexadecimal em RGB                               | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | Converte valores RGB numa cor hexadecimal                         | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | Gera um objeto de cor aleatório                                   | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | Classe Color, classes de valor, conversões e gerador de paletas   | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | Mistura e correção de cor no estilo dos shaders (canais de 0 a 1) | [Color](./color.md)              |

## Tempo

| Método                                | Descrição                                             | Detalhe                                   |
| ------------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| formatDuration                        | Converte um tempo em segundos numa string formatada   | [formatDuration](./time_format.md)        |
| formatRelative                        | Descreve um instante em relação a agora («há 3 dias») | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | Interpreta as linhas de tempo de legendas WebVTT      | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | Converte uma marca de tempo num objeto Date           | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | Obtém uma marca de tempo de alta precisão             | [performanceTime](./performance_time.md)  |

## Detecção de dispositivo

| Método        | Descrição                         | Detalhe                              |
| ------------- | --------------------------------- | ------------------------------------ |
| isMobile      | Diz se o dispositivo é móvel      | [isMobile](./is_mobile.md)           |
| isWeiXin      | Diz se o navegador é o do WeChat  | [isWeiXin](./is_weixin.md)           |
| isClient      | Diz se o ambiente é o do cliente  | [isClient](./is_client.md)           |
| isSafari      | Diz se o navegador é o Safari     | [isSafari](./is_safari.md)           |
| currentDevice | Obtém o tipo de dispositivo atual | [currentDevice](./current_device.md) |

## Manipulação do DOM

| Método                                 | Descrição                                                 | Detalhe                                                 |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | Põe uma classe CSS num elemento do DOM                    | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | Tira uma classe CSS de um elemento do DOM                 | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | Cria um DocumentFragment                                  | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | Escapa os caracteres especiais do HTML                    | [escapeHtml](./escape_html.md)                          |
| Chain                                  | Classe encadeável para manipular o DOM                    | [Chain](./chain.md)                                     |
| create                                 | Função auxiliar para criar elementos do DOM               | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | Registro de ouvintes com escopo e detecção de toque duplo | [EventManager](./event_manager.md)                      |
| adoptStyles                            | Injeta texto de folha de estilos num shadow root          | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | Vira ou desloca um painel flutuante em relação à âncora   | [computePlacement](./placement.md)                      |
| setFontSize2html                       | Escala da viewport com rem flexível para leiautes móveis  | [setFontSize2html](./set_font_size.md)                  |

## Mídia

| Método                 | Descrição                             | Detalhe                               |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| AudioRecorder          | Grava o áudio do microfone num `Blob` | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | Voz em texto pela Web Speech API      | [createSpeechRecognizer](./speech.md) |

## Armazenamento

| Método              | Descrição                       | Detalhe                                   |
| ------------------- | ------------------------------- | ----------------------------------------- |
| localStorageGetItem | Lê um valor do localStorage     | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | Guarda um valor no localStorage | [localStorageSetItem](./local_storage.md) |

## URL e parâmetros

| Método            | Descrição                                   | Detalhe                                        |
| ----------------- | ------------------------------------------- | ---------------------------------------------- |
| getAllQueryString | Extrai os parâmetros de consulta de uma URL | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | Codifica uma URL com segurança              | [encodeUrl](./encode_url.md)                   |
| appendUrl         | Acrescenta parâmetros de consulta a uma URL | [appendUrl](./append_url.md)                   |

## Cookies

| Método          | Descrição                                        | Detalhe                                    |
| --------------- | ------------------------------------------------ | ------------------------------------------ |
| getCookie       | Obtém o valor do cookie indicado                 | [getCookie](./get_cookie.md)               |
| getCookieByName | Obtém o valor de um cookie por expressão regular | [getCookieByName](./get_cookie_by_name.md) |

## Imagens

| Método               | Descrição                                   | Detalhe                                              |
| -------------------- | ------------------------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | Converte um arquivo de imagem para Base64   | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | Valida as dimensões de um arquivo de imagem | [isImageSize](./is_image_size.md)                    |

## Desempenho

| Método         | Descrição                                 | Detalhe                                |
| -------------- | ----------------------------------------- | -------------------------------------- |
| getPerformance | Obtém as métricas de desempenho da página | [getPerformance](./get_performance.md) |
| getFrame       | Calcula a taxa de quadros                 | [getFrame](./get_frame.md)             |
| getPixelRatio  | Obtém a razão de resolução do Canvas      | [getPixelRatio](./get_pixel_ratio.md)  |

## Rede

| Método             | Descrição                                                         | Detalhe                            |
| ------------------ | ----------------------------------------------------------------- | ---------------------------------- |
| imageRequest       | Mede a latência da rede por uma requisição de imagem              | [imageRequest](./image_request.md) |
| networkSpeed       | Mede o ping e a variação da rede                                  | [networkSpeed](./network_speed.md) |
| connection         | Obtém informações da conexão de rede atual                        | [connection](./connection.md)      |
| getStatus / status | Consulta nos dois sentidos entre código de status HTTP e mensagem | [getStatus](./status.md)           |

## Navegador

| Método                               | Descrição                                          | Detalhe                                   |
| ------------------------------------ | -------------------------------------------------- | ----------------------------------------- |
| getWindow                            | Obtém o tamanho da janela visível                  | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | Cria uma object URL; baixa uma URL como bytes crus | [createObjectURL](./create_object_url.md) |

## Carregamento de scripts

| Método       | Descrição                                       | Detalhe                             |
| ------------ | ----------------------------------------------- | ----------------------------------- |
| scriptOnLoad | Insere tags script ou link em tempo de execução | [scriptOnLoad](./script_on_load.md) |

## Tratamento de erros

| Método          | Descrição                                             | Detalhe                                   |
| --------------- | ----------------------------------------------------- | ----------------------------------------- |
| handleConsole   | Intercepta e trata as chamadas aos métodos do console | [handleConsole](./handle_console.md)      |
| handleError     | Tratamento global de erros                            | [handleError](./handle_error.md)          |
| handleFetchHook | Intercepta e trata as requisições fetch               | [handleFetchHook](./handle_fetch_hook.md) |

## Outras

| Método             | Descrição                                        | Detalhe                                  |
| ------------------ | ------------------------------------------------ | ---------------------------------------- |
| TOTP               | Gerador de senhas de uso único baseadas no tempo | [TOTP](./totp.md)                        |
| createSignal       | Cria um sinal reativo                            | [createSignal](./create_signal.md)       |
| setMime / MimeType | Define ou atualiza a tabela de tipos MIME        | [setMime](./set_mime.md)                 |
| getExtensions      | Obtém as extensões de um tipo MIME               | [getExtensions](./get_extensions.md)     |
| SyncHook           | Classe de gancho de eventos síncrono             | [SyncHook](./sync_hook.md)               |
| durationHandler    | Cria uma função de execução adiada               | [durationHandler](./duration_handler.md) |
