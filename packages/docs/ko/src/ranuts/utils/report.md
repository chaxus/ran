# report / setReportUrl / createData

텔레메트리 비컨을 직접 정한 엔드포인트로 보냅니다.

## API

### setReportUrl(config)

시작할 때 한 번, 기본 엔드포인트를 설정합니다. URL 문자열이나 다음 객체를 받습니다.

| 필드           | 설명                                                        | 타입     |
| -------------- | ----------------------------------------------------------- | -------- |
| `url`          | 자기 `url`을 갖지 않은 모든 `report()`가 쓸 기본 엔드포인트 | `string` |
| `userIdCookie` | 사용자 id가 든 쿠키. `createData()`가 담아 갑니다           | `string` |

### getReportUrl()

설정된 엔드포인트, 없으면 `''`.

### report({ url?, type?, payload })

`payload`를 보냅니다. `navigator.sendBeacon`을 먼저 쓰고, 안 되면 1x1 이미지 요청으로 물러섭니다. 어느 한 가지 방법이라도 받아들이면 `true`, 아무것도 보내지 못하면 `false`를 반환합니다. 엔드포인트를 설정하지 않은 경우도 `false`입니다.

### createData(params?)

정해진 겉봉을 꾸립니다. 이벤트 id, 페이지 URL, 타임스탬프, 리퍼러, 뷰포트, 사용자 에이전트에 더해, `userIdCookie`를 설정했다면 `userId`도 들어갑니다. 넘긴 `params`는 맨 마지막에 적용됩니다. SSR에서는 `{}`를 반환합니다.

## 예시

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## 참고

1. **기본 엔드포인트는 일부러 두지 않았습니다.** 라이브러리로서는 여러분의 텔레메트리가 어디로 가야 하는지 알 길이 없으니, `report()`는 넘겨짚지 않고 `false`를 반환합니다.
2. **어떤 방법을 쓸지는 `sendBeacon`이 실제로 성공했는지로 가릅니다.** `navigator`가 있는지로 가리지 않습니다. `sendBeacon`은 브라우저의 대기열이 한도를 넘을 때도 `false`를 돌려주며, 그 경우도 이미지 비컨으로 넘어갑니다.
3. **`createData()`는 이벤트마다 부르세요.** 설정할 때 한 번이 아닙니다. 이 함수는 도는 그 순간의 URL과 타임스탬프를 찍어 둡니다. 핸들러 밖으로 빼면 이후의 모든 이벤트가 페이지를 불러오던 때의 상태를 보고하게 됩니다.

::: warning 0.3에서 getHost를 갈음했습니다
`getHost()`는 사라졌습니다. 이 저장소 작성자의 도메인을 코드에 박아 넣고 그것으로 로그 엔드포인트를 만들었는데, 손대다 만 흔적 탓에 출력이 말 그대로 `'//log.'`(닿을 수 없는 호스트)까지 망가져 있었습니다. 그래서 `url`을 명시하지 않은 보고는 모두 소리 없이 허공으로 던져졌습니다. `createData()` 역시 코드에 박힌 `chaxus_prod` 쿠키를 더는 읽지 않습니다. 대신 `userIdCookie`를 설정하세요.
:::
