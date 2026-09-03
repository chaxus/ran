# adoptStyles / adoptSheetText

把 CSS 注入 Shadow DOM，优先走 **Constructable Stylesheets**：同一段 CSS 只解析一次，之后被所有组件实例**按引用**共享，一千个实例也只有一份解析结果。不支持时两者都降级为注入 `<style>` 标签。

两个函数都是 SSR 安全的（没有 `document` 时直接返回），且幂等。

## 使用

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

组件的**静态**样式。降级路径按 **root** 去重：一个 shadowRoot 只保留一个带标记的 `<style>`，先到先得。组件的静态样式在一个 root 内只应该有一份，第二次调用说明调用方写错了。

#### 参数

| 参数         | 说明                        | 类型         | 默认值                 |
| ------------ | --------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 目标 shadow root            | `ShadowRoot` | 必填                   |
| `cssText`    | 样式文本                    | `string`     | 必填                   |
| `marker`     | 降级 `<style>` 上的标记属性 | `string`     | `'data-adopted-style'` |

#### 返回

无返回值（`void`）

### adoptSheetText

运行时传入的**动态**样式（例如组件的 `sheet` 属性）。与 `adoptStyles` 的唯一区别在降级路径的去重口径：这里按 **cssText** 去重，同一个 root 可以叠加多段互不相同的动态样式，相同的那段只注入一次。

#### 参数

| 参数         | 说明                        | 类型         | 默认值                 |
| ------------ | --------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 目标 shadow root            | `ShadowRoot` | 必填                   |
| `cssText`    | 样式文本                    | `string`     | 必填                   |
| `marker`     | 降级 `<style>` 上的标记属性 | `string`     | `'data-adopted-sheet'` |

#### 返回

无返回值（`void`）

## 常量

| 名称                   | 值                     | 含义                                |
| ---------------------- | ---------------------- | ----------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | `adoptStyles` 降级标签的默认标记    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | `adoptSheetText` 降级标签的默认标记 |

`marker` 参数的存在是为了让上层库给自己注入的样式打上品牌标记，之后还能找回来。比如 ranui 传的是 `data-ranui` 和 `data-ranui-sheet`。
