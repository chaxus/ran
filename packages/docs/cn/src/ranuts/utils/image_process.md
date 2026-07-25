# 图像处理

基于 canvas 的图像处理工具。每个变换返回的是**离屏 canvas** 而不是 dataURL，这样多个变换可以串起来，不必每步都编码解码一次 PNG。

## 使用

```ts
import { getImage, cutRound, opacity } from 'ranuts/utils';

const img = await getImage('/avatar.png');
const rounded = cutRound(img, 24);
const faded = opacity(rounded, 0.5);
document.body.appendChild(faded as HTMLCanvasElement);
```

## API

### getImage

按路径加载图片，解码完成后 resolve。

#### 参数

| 参数  | 说明     | 类型     | 默认值 |
| ----- | -------- | -------- | ------ |
| `src` | 图片路径 | `string` | 必填   |

#### 返回

| 参数      | 说明             | 类型                 |
| --------- | ---------------- | -------------------- |
| `promise` | 加载好的图片元素 | `Promise<ImgSource>` |

::: tip
reject 出去的是原始的 error **事件**而非 `Error` 对象。`<img>` 的 `onerror` 拿不到失败原因 —— 跨域时浏览器刻意不透露 —— 包装成 `Error` 只会造出一条假的错误信息。
:::

### cutRound

把图片裁成圆角。

#### 参数

| 参数     | 说明         | 类型        | 默认值 |
| -------- | ------------ | ----------- | ------ |
| `img`    | 待裁剪的图片 | `ImgSource` | 必填   |
| `radius` | 圆角半径     | `number`    | 必填   |

#### 返回

| 参数     | 说明        | 类型        |
| -------- | ----------- | ----------- |
| `canvas` | 离屏 canvas | `ImgSource` |

### opacity

给图片整体叠加透明度。

优先走 `ctx.filter`（GPU 加速）；浏览器不支持时降级为逐像素改写 alpha 通道。降级路径会跳过 alpha 已经是 `0` 的像素，避免把完全透明的区域算出非零值。

#### 参数

| 参数      | 说明          | 类型        | 默认值 |
| --------- | ------------- | ----------- | ------ |
| `img`     | 待处理的图片  | `ImgSource` | 必填   |
| `opacity` | 透明度，0 – 1 | `number`    | 必填   |

#### 返回

| 参数     | 说明        | 类型        |
| -------- | ----------- | ----------- |
| `canvas` | 离屏 canvas | `ImgSource` |

### getMatrix

生成二维高斯权重矩阵，权重之和归一化为 `1`。

归一化是必须的：不归一化时卷积会整体改变图像亮度。`sigma` 默认取 `radius / 3`，这样高斯曲线在半径处已衰减到接近 0，截断带来的误差可以忽略。

#### 参数

| 参数     | 说明     | 类型     | 默认值       |
| -------- | -------- | -------- | ------------ |
| `radius` | 模糊半径 | `number` | 必填         |
| `sigma`  | 标准差   | `number` | `radius / 3` |

#### 返回

| 参数     | 说明                                        | 类型       |
| -------- | ------------------------------------------- | ---------- |
| `matrix` | 长度 `(2r+1)²` 的一维矩阵，行优先，和为 `1` | `number[]` |

## 类型

```ts
type ImgSource = HTMLImageElement | HTMLCanvasElement;
```

## 相关

- [convertImageToBase64](/cn/src/ranuts/utils/convert_image_to_base64) —— `File` → base64 dataURL
- [isImageSize](/cn/src/ranuts/utils/is_image_size) —— 校验图片尺寸
