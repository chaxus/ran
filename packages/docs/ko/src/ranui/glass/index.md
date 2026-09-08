---
description: '배경 블러, 빛을 휘게 하는 SVG 변위, 스페큘러 테두리를 합친 액체 간유리 표면. backdrop-filter를 지원하지 않는 곳에서는 자연스럽게 낮춰 그립니다.'
---

# Glass

액체 같은 간유리 표면입니다. `<r-glass>`는 뒤에 놓인 것을 흐리고 굴절시킵니다. 간유리 느낌은 `backdrop-filter`의 blur와 saturate, 빛이 액체처럼 휘는 부분은 SVG `feDisplacementMap`, 여기에 유리처럼 읽히게 하는 스페큘러 테두리와 하이라이트가 더해집니다. 전부 토큰으로 움직이고, 내용은 기본 슬롯에 넣습니다.

> **이럴 때 씁니다.** 색이 풍부하고 복잡한 콘텐츠 위에 반투명 패널을 얹고 싶을 때(히어로 카드, 떠 있는 툴바, 미디어 위의 오버레이). `displace` 속성이 얼마나 _액체처럼_ 보일지를 정합니다(0은 평평한 간유리판). `backdrop-filter`를 지원하지 않는 곳에서는 모든 효과가 그냥 반투명한 면으로 낮춰집니다.

## 놀이터

무대 위에서 유리를 끌어보고, 속성을 바꿔보고, 그대로의 마크업을 복사하세요. 기본값은 iOS의 간유리 재질 그대로입니다.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> `<r-glass>`는 색이 많고 복잡한 콘텐츠 위에 두세요. 단색 배경 위에서는 효과가 보이지 않습니다.

## 중첩

`<r-glass>`는 겹쳐 쓸 수 있습니다. 하나를 다른 하나 안에 넣으면 재질이 층을 이룹니다(유리 패널 위의 유리 툴바처럼). 각 층은 자기 뒤에 있는 것을 굴절시킵니다.

<ran-demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">바깥 패널</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">중첩된 유리 툴바</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="26">
  <div class="panel">
    바깥 패널
    <r-glass radius="16" displace="6">
      <div class="toolbar">중첩된 유리 툴바</div>
    </r-glass>
  </div>
</r-glass>
```

## API 레퍼런스

### 속성

| 속성          | 타입      | 기본값  | 설명                                                                                                                                                                                                        |
| ------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | 배경 블러 반경(px). 간유리의 정도.                                                                                                                                                                          |
| `saturate`    | `number`  | `180`   | 배경 채도(퍼센트). 유리 너머에 있는 것의 색을 끌어올립니다.                                                                                                                                                 |
| `displace`    | `number`  | `8`     | 액체 굴절의 세기(SVG 변위 스케일). `0`은 평평한 간유리판이고, 값이 클수록 더 일렁입니다.                                                                                                                    |
| `frequency`   | `number`  | `0.005` | 난류의 기본 주파수. 값이 작을수록 크고 부드러운 물결이 됩니다.                                                                                                                                              |
| `radius`      | `number`  | `20`    | 모서리 반경(px).                                                                                                                                                                                            |
| `tint`        | `string`  | 은은함  | 유리 채움의 색조. 임의의 CSS background 값.                                                                                                                                                                 |
| `sheen`       | `boolean` | `false` | 표면을 훑고 지나가는 스페큘러 애니메이션.                                                                                                                                                                   |
| `interactive` | `boolean` | `false` | 호버 시 떠오르고 누르면 줄어드는 반응. 누를 수 있는 유리를 위한 것. 호스트를 키보드로 조작할 수 있는 버튼으로도 만듭니다(`role="button"`, 탭 정지, Enter/Space가 클릭처럼 동작).                            |
| `rim`         | `boolean` | `false` | 더 물리적인 조명감을 위한 스페큘러 테두리와 색수차 가장자리(선택). 항상 WebGL로 먼저(동기적으로) 그리고, 가능하면 배경에서 WebGPU로 조용히 넘어갑니다. 둘 다 없으면 CSS 스페큘러 그러데이션으로 물러납니다. |

### 굴절 `displace`

`displace`는 SVG `feDisplacementMap`의 스케일, 즉 빛이 표면을 지나며 얼마나 세게 휘는지를 정합니다. 그냥 간유리판으로 만들려면 `0`으로 두세요.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass displace="0">…평평한 간유리…</r-glass> <r-glass displace="60">…액체…</r-glass>
```

### 광택과 상호작용

`sheen`은 움직이는 스페큘러 하이라이트를 더하고, `interactive`는 호버 시 떠오름과 탄성 있는 눌림을 더합니다(공용 토큰 `--ran-motion-ease-spring` 사용).

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">올려보고 눌러보세요</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive displace="36">
  <div>올려보고 눌러보세요</div>
</r-glass>
```

### Rim — GPU 스페큘러 가장자리(선택)

`rim`은 두 번째 하이라이트 층을 더합니다. 왼쪽 위로 고정된 광원에서 비추는 스페큘러 테두리와, 둥근 사각형 경계에 아주 옅게 걸리는 색수차(RGB) 프린지입니다. `displace` 굴절과 달리 **배경을 전혀 샘플링하지 않습니다**. 셰이더는 패널 자신의 너비·높이·모서리 반경만 알기 때문에, 배경 전체를 GPU로 붙잡는 방식이 치러야 할 상호작용과 접근성의 대가를 하나도 치르지 않습니다([참고](#notes)). 같은 `backdrop-filter` 간유리 위에 얹히는 순수한 장식 층이며, 켜고 끄더라도 유리 뒤에 있는 것이나 그것을 샘플링하는 방식은 달라지지 않습니다.

먼저 WebGL로 그리고(동기적이며 사실상 모든 브라우저에서 동작하므로 테두리가 자기 첫 페인트를 늦추는 일이 없습니다), 브라우저가 지원하면 배경에서 조용히 WebGPU로 넘어갑니다(효과는 같고 출력은 픽셀 단위로 동일). 두 GPU API가 모두 없을 때(아주 오래된 브라우저, 비활성화, SSR)는 CSS 스페큘러 그러데이션으로 물러나므로, 디자인에서 감안해야 할 깨진 상태나 빈 상태는 없습니다.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim 없음</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS 스페큘러만…</r-glass> <r-glass rim>…GPU 테두리 + 색수차 가장자리(WebGL, WebGPU로 승격)…</r-glass>
```

### CSS part와 토큰

`::part(glass)`, `::part(specular)`, 그리고 (`rim`을 켰을 때의) `::part(rim)`으로 내부에 스타일을 주거나, `--ran-glass-*` 사용자 정의 속성을 덮어쓰세요.

| 토큰                                          | 쓰임                                               |
| --------------------------------------------- | -------------------------------------------------- |
| `--ran-glass-blur`                            | 배경 블러 반경.                                    |
| `--ran-glass-saturate`                        | 배경 채도.                                         |
| `--ran-glass-radius`                          | 모서리 반경.                                       |
| `--ran-glass-tint`                            | 채움 배경.                                         |
| `--ran-glass-border`                          | 테두리 선.                                         |
| `--ran-glass-shadow`                          | 그림자 묶음(하이라이트 + 깊이).                    |
| `--ran-glass-specular-background`             | 스페큘러 하이라이트 배경.                          |
| `--ran-glass-specular-opacity`                | 스페큘러 세기.                                     |
| `--ran-glass-reduced-transparency-background` | OS의 "투명도 줄이기" 설정이 켜졌을 때의 대체 표면. |
| `--ran-glass-reduced-transparency-shadow`     | 같은 상태에서의 대체 그림자.                       |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## 참고 {#notes}

- **배경 샘플링.** `<r-glass>`는 `backdrop-filter`로 뒤쪽 DOM을 굴절시키므로, 유리 뒤의 선택 가능한 텍스트, 재생 중인 영상, 조작 가능한 요소는 그대로 동작합니다. 위의 `rim`은 패널 자신의 모양만으로 계산되는 순수 장식 GPU 층이라 배경을 샘플링하지 않습니다.
- **가독성.** 본문 텍스트는 불투명한 안쪽 면에 두세요. 대비를 유리에만 맡기지 마세요.
- **투명도 줄이기.** `<r-glass>`는 OS 수준의 "투명도 줄이기 / 대비 높이기" 설정(`prefers-reduced-transparency: reduce`)에 반응해, 흐림과 굴절 대신 불투명하고 테마를 따르는 면(기본값 `--ran-color-bg-elevated`)으로 바뀝니다. 네이티브 컨트롤이 알아서 하는 일을 커스텀 엘리먼트에서 그대로 해주는 것입니다.
- **브라우저별 굴절 차이.** `feDisplacementMap` 액체 효과는 현재 Chromium에서만 그려집니다. Safari와 Firefox는 `backdrop-filter` 값의 그 부분을 버리고 blur / saturate / brightness 간유리만 남기는데, 더 평평해지긴 해도 깨진 상태가 아니라 정당한 대체 표현입니다.
- **모션.** 이 표면은 `transform`만 트랜지션하고 색은 절대 트랜지션하지 않으므로, 라이트/다크 전환이 한 프레임에 끝납니다. 광택과 눌림은 `prefers-reduced-motion`을 따릅니다.
