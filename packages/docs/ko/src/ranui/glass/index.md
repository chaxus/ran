---
description: '액체 유리 표면. 재질을 고르면 뒤에 놓인 것을 흐리고 렌즈 같은 가장자리에서 휘게 합니다. 이미지나 영상 위에서는 WebGL2로 픽셀 자체를 굴절시킵니다.'
---

# Glass

액체 유리 표면입니다. `material`만 고르면 유리가 완성됩니다. 뒤에 놓인 것을 흐리게 하고, 곡면 가장자리에서 렌즈처럼 휘게 하며, 테두리에서 색을 살짝 가르고 가장자리를 비춥니다. 개별 값은 같은 이름의 속성으로 덮어쓸 수 있습니다. 내용은 기본 슬롯에 넣으며, 유리 위에서 잘 읽히는 색이 입혀집니다.

> **이럴 때 씁니다.** 색이 풍부한 콘텐츠 위에 패널이 놓일 때(히어로 카드, 떠 있는 툴바, 미디어 위의 오버레이). 평평한 배경 위에서는 휘게 할 것이 없어 효과가 사라집니다.

## 놀이터

유리를 끌어 옮기고, 재질과 배경을 바꾸고, 마크업을 복사하세요. 스니펫에는 재질과 다른 값만 담깁니다.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## 재질

대부분의 용도는 네 가지 재질로 충분합니다. 기본값은 `regular`입니다.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| 재질      | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## 이미지 위에서

유리가 `<img>`나 `<video>` 위에 놓일 때는 `backdrop`을 추가합니다. 값이 없으면 유리의 부모에 있는 첫 번째 이미지나 영상을 쓰고, 선택자를 쓰면 다른 요소를 지정합니다. 그러면 유리는 그 요소의 픽셀을 WebGL2로 읽어 파장마다 다른 양만큼 굴절시킵니다. CSS 경로는 Chromium에서만 빛을 휘게 하지만, 이 방식은 WebGL2가 있는 모든 엔진에서 동작합니다. 이미지는 페이지에 그대로 남으므로 alt 텍스트와 주변 콘텐츠는 바뀌지 않습니다.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

교차 출처 이미지를 읽으려면 `crossorigin`과 CORS 응답이 필요합니다. 그렇지 않으면 유리는 CSS 흐림을 유지합니다.

## 톤과 잉크

`tone`은 유리 뒤에 무엇이 있는지를 나타냅니다. 어둡거나 색이 진한 배경에서는 가장자리가 밝게 비치고 내용은 흰색입니다. 밝은 배경에서는 흰 가장자리가 보이지 않으므로 가장자리에 그늘을 넣고 내용은 어두운 색이 됩니다. `backdrop` 이미지 위에서는 직접 지정하지 않는 한 덮인 영역의 밝기를 따릅니다. 현재 적용된 톤은 `:state(light)`와 `:state(dark)`로 잡을 수 있고, `--ran-glass-ink`로 내용 색을 덮어쓸 수 있습니다.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## 중첩

`<r-glass>`는 조합할 수 있습니다. 유리 패널 위의 유리 툴바처럼 하나를 다른 하나 안에 넣으면 겹친 재질이 됩니다. 각 층은 자기 뒤에 있는 것을 휘게 합니다.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API 레퍼런스

### 속성

| 속성          | 타입      | 기본값    | 설명                                                                                                                                                                            |
| ------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular` | `thin`, `regular`, `thick`, `clear` 중 하나. 아래 광학 값을 한 번에 정합니다.                                                                                                   |
| `blur`        | `number`  | 재질 따름 | 흐림 반경(px).                                                                                                                                                                  |
| `saturate`    | `number`  | 재질 따름 | 뒤에 놓인 것의 채도(퍼센트).                                                                                                                                                    |
| `displace`    | `number`  | 재질 따름 | 가장자리가 배경을 안쪽으로 끌어당기는 거리(px). `0`은 평평한 판입니다.                                                                                                          |
| `bevel`       | `number`  | 재질 따름 | 빛을 휘게 하는 곡면 가장자리 띠의 폭(px).                                                                                                                                       |
| `dispersion`  | `number`  | 재질 따름 | 가장자리에서 색이 갈라지는 정도. `displace`에 대한 퍼센트.                                                                                                                      |
| `specular`    | `number`  | 재질 따름 | 하이라이트의 세기(퍼센트).                                                                                                                                                      |
| `radius`      | `number`  | `20`      | 모서리 반경(px).                                                                                                                                                                |
| `tint`        | `string`  | 재질 따름 | 흐림 위에 덮는 채움. 어떤 CSS background 값이든 됩니다.                                                                                                                         |
| `tone`        | `string`  | `dark`    | `dark` 또는 `light`. 유리 뒤에 무엇이 있는지. `backdrop` 위에서 지정하지 않으면 이미지를 따릅니다.                                                                              |
| `backdrop`    | `string`  | —         | `<img>`나 `<video>`를 WebGL2로 굴절시킵니다. 비워 두면 부모의 첫 번째 것을, 선택자를 쓰면 다른 요소를 가리킵니다.                                                               |
| `rim`         | `boolean` | `false`   | GPU로 조명한 가장자리: 바깥 벽과 안쪽 벽, 키 라이트와 필 라이트, 반짝임. 패널의 모양에만 의존합니다.                                                                            |
| `sheen`       | `boolean` | `false`   | 표면을 가로질러 지나가는 하이라이트.                                                                                                                                            |
| `interactive` | `boolean` | `false`   | 클릭할 수 있는 유리를 위한 호버 시 떠오름과 눌림 피드백. 호스트를 키보드로 조작 가능한 버튼으로도 만듭니다: `role="button"`, 탭 이동 대상, Enter와 Space가 클릭처럼 동작합니다. |

### 굴절 `displace`

`displace`는 가장자리가 뒤에 있는 것을 중심 쪽으로 얼마나 끌어당길지를 정합니다. 그래서 테두리 바로 안쪽의 배경이 테두리 위로 늘어나, 두꺼운 볼록 가장자리가 확대해 보이는 것과 같은 모습이 됩니다. `bevel`은 그 곡면 띠의 폭을 정합니다. bevel의 절반을 넘으면 실제 두꺼운 유리의 테두리처럼 가장자리가 상을 뒤집어 접습니다.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### 광택과 상호작용

`sheen`은 움직이는 하이라이트를, `interactive`는 호버 시 떠오름과 되튀는 눌림을 더합니다.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — GPU 스페큘러 가장자리(선택)

`rim`은 가장자리를 GPU로 그립니다. 밝은 바깥 벽과, bevel이 평평한 면과 만나는 곳의 더 희미한 안쪽 벽이 있고, 왼쪽 위에서 오는 키 라이트와 오른쪽 아래의 약한 필 라이트로 비추며, 가장자리를 따라 두께가 달라지고 이따금 반짝입니다. `light` 톤에서는 벽에 빛 대신 그늘이 집니다. 배경은 샘플링하지 않습니다. 셰이더는 패널의 크기, 반경, bevel만 압니다. 먼저 WebGL로 그리고, 브라우저에 WebGPU가 있으면 백그라운드에서 옮겨 가며, 둘 다 없으면 CSS 하이라이트를 그대로 둡니다.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### CSS part와 토큰

내부는 `::part(glass)`, `::part(specular)`, `::part(refraction)`, 그리고 `rim`을 켰을 때 `::part(rim)`으로 스타일을 지정하거나, `--ran-glass-*` 커스텀 속성을 덮어씁니다:

| 토큰                                          | 쓰임                                                            |
| --------------------------------------------- | --------------------------------------------------------------- |
| `--ran-glass-ink`                             | 콘텐츠 색. 기본은 흰색, light 톤에서는 거의 검은색입니다.       |
| `--ran-glass-tint`                            | 흐림 위의 채움.                                                 |
| `--ran-glass-border`                          | 가장자리 테두리.                                                |
| `--ran-glass-shadow`                          | 박스 그림자 묶음(스페큘러와 깊이).                              |
| `--ran-glass-brightness`                      | 뒤에 놓인 것의 밝기.                                            |
| `--ran-glass-specular-background`             | CSS 하이라이트 배경.                                            |
| `--ran-glass-specular-opacity`                | CSS 하이라이트 세기. 그 레이어에서는 `specular`보다 우선합니다. |
| `--ran-glass-reduced-transparency-background` | OS의 "투명도 줄이기" 설정이 켜졌을 때의 대체 표면.              |
| `--ran-glass-reduced-transparency-shadow`     | 같은 상태에서의 대체 그림자.                                    |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## 참고 {#notes}

- **두 가지 경로.** `backdrop`이 없으면 `backdrop-filter`가 유리 뒤의 실제 페이지를 흐리게 하므로, 뒤에 있는 텍스트, 영상, 컨트롤은 그대로 동작합니다. 렌즈 같고 색이 갈라지는 가장자리는 SVG 필터로, Chromium에서 그려지며 Safari와 Firefox에서는 흐림만 남습니다. `backdrop`이 있으면 WebGL2가 있는 모든 엔진에서 WebGL2가 그 이미지나 영상 하나를 굴절시킵니다.
- **가독성.** 내용은 `--ran-glass-ink` 색을 씁니다. 긴 글은 대비를 유리에 맡기지 말고 불투명한 안쪽 면에 두세요.
- **투명도 줄이기.** OS의 "투명도 줄이기"나 "대비 높이기" 설정(`prefers-reduced-transparency: reduce`)에서는 유리가 테마를 따르는 불투명한 면(`--ran-color-bg-elevated`)이 되고, 흐림, 굴절, 하이라이트가 사라집니다.
- **모션.** 표면은 `transform`만 트랜지션하므로 테마 전환이 한 프레임에 끝납니다. 광택과 눌림은 `prefers-reduced-motion`을 따릅니다.
- **비용.** SVG 렌즈 맵은 패널의 크기, 반경, bevel이 바뀔 때 다시 만들어집니다. WebGL 굴절은 보이는 동안 프레임마다 한 번 패널과 이미지를 확인하고, 둘 중 하나가 움직였을 때만 그립니다.
