<!-- source: 28f660782f4b364a2424b4125d8920431adf8bac -->

# UI 验收：证据与决定

视觉或交互结果有变化时，使用这份契约。[DESIGN](./DESIGN.md) 负责外观和组合；[INTERACTION](./INTERACTION.md) 负责可观察的行为。[界面索引](./INTERFACE_GUIDE.md)负责分派任务。只读适用的章节。

每条规则都有 ID 和等级。**MUST** 违反即为缺陷，并注明验证方式；**SHOULD** 是默认做法，偏离时要说明这次的理由；**MAY** 可选。[规则索引](./RULES.md)列出了所有分级规则及其验证方式。

## 先对可观察的结果达成一致

- **V-AGREE-1 · SHOULD** 动手修改之前，先落定[设计简报](./DESIGN.md#style-coherence-across-components-and-pages)，并在同一份记录里写明受影响的任务、视图／状态和独立预期。
- **V-AGREE-2 · SHOULD** 写明相关的归属方、受支持的公开 API 和宿主能力的边界。
- **V-AGREE-3 · SHOULD** 根据实际改动选择宽度、主题、语言和输入路径，不要编造无关的工作。
- **V-AGREE-4 · SHOULD** 涉及组合时，写明内容／文字／图标对齐线、有意设置的导航栏、点击边界和纵向关系。
- **V-AGREE-5 · MUST** 预期值不能从被测实现中推导。_Proof: review_
- **V-AGREE-6 · SHOULD** 按顺序评审：任务／层级、静态组合、可达的组合状态，最后是动效。
- **V-AGREE-7 · SHOULD** 不要用动画弥补没解决的比例问题或不清晰的导航。
- **V-AGREE-8 · SHOULD** 评审改变了预期设计时，先更新现有简报，并注明促成这次修改的证据。

这是一份决策记录，不是给用户已经授权的工作再加一道审批仪式。

API／令牌检查验证源码契约；图片比对验证像素；智能体运行验证指南是否被遵循。

- **V-AGREE-9 · SHOULD** 每条规则只有一个归属方。
- **V-AGREE-10 · MUST** 不要用一种检查顶替另一种：API／令牌检查、图片比对和智能体运行各自只能证明自己那一项结果。_Proof: review_
- **V-AGREE-11 · MUST** fixture 只证明它自己的结果，不代表它没渲染过的宿主应用通过了验收；不要把它当作宿主验收来声称。_Proof: review_

## 浏览器证据

- **V-PROOF-1 · MUST** 复现可见缺陷时，在修复之前截取实际运行的界面。_Proof: browser_
- **V-PROOF-2 · MUST** 修复之后，截取同一个相关状态，并用真实的文案和周围的界面框架检查整个面板。_Proof: browser_
- **V-PROOF-3 · MUST** 不要拿设计稿、源码 diff、改过的断言或无关构建的截图当证据。_Proof: review_
- **V-PROOF-4 · SHOULD** 除了数链接个数，也要检查组合：把多余的返回入口改名为面包屑，仍可能重复同一个上下文，并多出一行不必要的标题栏。
- **V-PROOF-5 · SHOULD** 决定需要另一个可见的快捷入口之前，先沿父级追踪祖先页面是否可达。
- **V-PROOF-6 · MUST** 测量之前，等待组件注册、待加载内容、字体和渲染帧都完成。_Proof: browser_
- **V-PROOF-7 · MUST** 目标缺失或尺寸为零时判定失败。_Proof: browser_
- **V-PROOF-8 · MUST** 记录所有亚像素容差；对精确的对齐线，容差保持在一个完整 CSS 像素以下（源码示例使用 0.5px）。_Proof: review_
- **V-PROOF-9 · MUST** 对打开中的浮层，确认截取时视口保持不变，并包含完整的触发元素／面板；整页截图可能引发响应式重排或 portal 重新定位，让裁切失效。_Proof: browser_
- **V-PROOF-10 · MUST** 测量缺陷所在的那一层：包裹层、内层内容、渲染后的文字 Range、图标视口和实际的指针目标各不相同。Range 不是精确的字形墨迹。_Proof: browser_
- **V-PROOF-11 · MUST** 通过受支持的测试接口处理 shadow part；不要为了验收在生产代码里引入 shadow 查询。_Proof: review_
- **V-PROOF-12 · SHOULD** 测试受影响的重排、换行的译文、可选内容和输入路径。
- **V-PROOF-13 · MUST** 不要用静态截图证明焦点归还、键盘导航、触屏下的可发现性、可打断性或异步结果的落定。_Proof: review_
- **V-PROOF-14 · MUST** 缺陷随时间展开时，录下连续的交互。_Proof: recording_
- **V-PROOF-15 · MUST** 对布局断言，要证明它能拒绝相关的缺陷：外框不动、只移动标签文字；引入双重外边距／幽灵辅助信息；或把标题目标扩展到填充区域。_Proof: browser_
- **V-PROOF-16 · MUST** 确认变异在层叠中生效，观察到失败，再恢复并观察到成功。_Proof: browser_
- **V-PROOF-17 · SHOULD** 使用与任务相关的变异，而不是为一个小修复把整套示例重跑一遍。
- **V-PROOF-18 · MUST** 修改展示方式时，验证原始数据。_Proof: browser, unit_
- **V-PROOF-19 · MUST** 对代码，复制源数据，而不是高亮后的 DOM 文本：保留制表符、空行、末尾换行和流式追加的内容。_Proof: unit_
- **V-PROOF-20 · MUST** 分别验证剪贴板的成功／失败、原生选区和长行滚动。_Proof: browser_
- **V-PROOF-21 · MUST** 记录浏览器对选区的规范化处理，但不让它改变剪贴板里的原始数据。_Proof: unit, review_

仅在源码中提供的[布局示例](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)包含可运行的命令和几何工具。使用方把其中的关系适配到自己的宿主；这些辅助函数不是 ranui 新的导出。

- **V-PROOF-22 · MUST** 不要凭 CSS zoom 压力测试就声称支持浏览器原生缩放或文字大小的无障碍设置。_Proof: review_
- **V-PROOF-23 · MUST** 说明哪些路径仍未验证。_Proof: review_

### 在时间维度上评审动效

- **V-MOTION-1 · MUST** 对变化的动效，先以正常速度检查一次连续操作，再在过渡出问题的地方慢速回放。_Proof: recording_
- **V-MOTION-2 · MUST** 包括触发、中间状态、完成和反向路径；在完成之前重复或反向输入。_Proof: recording_
- **V-MOTION-3 · MUST** 独立于动画验证最终状态、焦点、事件次数和阅读位置。_Proof: browser_
- **V-MOTION-4 · MUST** 慢速回放用来诊断不连续，不用作帧率基准。_Proof: review_
- **V-MOTION-5 · MUST** 减弱动效要有单独的可见状态检查，而不只是一段更短的录屏。_Proof: browser_
- **V-MOTION-6 · SHOULD** 时间维度的缺陷按 `element → input → observed frame/state → expected continuity` 的格式报告。
- **V-MOTION-7 · SHOULD** 在受影响的兄弟组件上用同一个有代表性的真实任务，检查动效语言是否一致。
- **V-MOTION-8 · SHOULD** 局部修复之后，再检查一遍完整的组合。
- **V-MOTION-9 · SHOULD** 失败的迭代保留下来作为诊断材料，与通过验收的截取分开存放。

这些检查是对下文已有证据绑定的补充。

## 走一遍任务

- **V-WALK-1 · SHOULD** 对变化的工作流或组合，从一个真实目标开始，描述目标时不说出要用哪个控件。
- **V-WALK-2 · SHOULD** 视情况从实际入口出发完成目标，经过结果、恢复和返回。
- **V-WALK-3 · SHOULD** 记录第一个选择、任何含糊的标签、犹豫或回退，以及结果是否让下一步清晰。

选项不清楚时，点击路径再短也没用。

- **V-WALK-4 · SHOULD** 使用真实内容，包括一个有代表性的长内容或失败的情况，而不只是一个精致的空状态。
- **V-WALK-5 · SHOULD** 先修正任务结构和内容层级，再加装饰效果。
- **V-WALK-6 · SHOULD** 报告影响最大的观察到的问题（最多三个），并附上能说明每个问题的状态和证据。
- **V-WALK-7 · MUST** 不要为了凑数编造发现。_Proof: review_
- **V-WALK-8 · SHOULD** 修正之后重走受影响的路径。
- **V-WALK-9 · MUST** 智能体走查按缺陷排查来报告，而不是当作人工可用性研究。_Proof: review_
- **V-WALK-10 · SHOULD** 观察真实参与者时，先让他们尝试完成目标，再解释界面，并在下文的结果中保留这一区别。

## 证据要绑定实际运行的版本

每个评审过的状态都有一份简短记录，包含以下字段：

- **V-FRESH-1 · MUST** 运行时：记录测试所用的源码修订／构建，以及相关的未提交输入或其指纹；共享样式／组件和传入数据影响结果时也要包括在内。如果运行中的构建或工作区与 Git HEAD 不同，只记 HEAD 是不够的。_Proof: review_
- **V-FRESH-2 · MUST** 范围／环境：视情况记录受影响的视图／分组成员、路由／状态、视口、主题、语言区域、浏览器，以及输入方式或减弱动效设置。_Proof: review_
- **V-FRESH-3 · MUST** 媒体：记录截图／录屏的位置和内容身份（例如 SHA-256），并与对应的运行时和状态关联。_Proof: review_
- **V-FRESH-4 · MUST** 修复前后的证据分开保存；绝不覆盖唯一的修复前截图。_Proof: review_
- **V-FRESH-5 · MUST** 评审：记录自动化检查和智能体检查实际确认了什么，与人工决定以及任何未验证的状态分开。_Proof: review_
- **V-FRESH-6 · MAY** 可以用一份简短的 Markdown 记录；现有的清单文件也可以提供这些字段。
- **V-FRESH-7 · SHOULD** 不要为普通改动新增证据服务或配置框架。
- **V-FRESH-8 · MUST** 哈希值放在文件旁边或某个被引用的清单文件里，让声称的绑定关系可以被独立核对。_Proof: review_

**评审只对它检查过的证据和运行时范围有效。**

- **V-FRESH-9 · MUST** 替换图片、编辑录屏、改变分组成员或改变相关的运行时输入之后，受影响的评审视为过期。_Proof: review_
- **V-FRESH-10 · MUST** 共享样式／组件改动之后，刷新每个受影响的状态，需要时重新构建，再检查新的证据。_Proof: browser, review_
- **V-FRESH-11 · MUST** 不拿旧的截取当作当前的证据。_Proof: review_
- **V-FRESH-12 · MUST** 只改文档或改了无关源码、仍沿用运行时证据时，记录为什么它的依赖范围不受影响。_Proof: review_

旧的截取可以作为历史保留。只改文档或改了无关源码时，相同的运行时证据依然有效，所以没必要仅凭 HEAD 变化就重新截取全部内容。

## 如实报告由谁确认

| 结果           | 谁／什么可以确认                               | 它不能确认什么         |
| -------------- | ---------------------------------------------- | ---------------------- |
| 自动化检查     | 针对声明的运行时，新鲜的命令输出或浏览器断言   | 视觉质量或人工决定     |
| 智能体视觉评审 | 智能体检查了当前的截取和受影响的交互           | 用户验收               |
| 人工决定       | 真实用户的决定，附带其消息／操作引用和证据范围 | 对之后变化的证据的验收 |

- **V-REPORT-1 · MUST** 这三种结果分开报告，哪怕报告只有一段话。_Proof: review_
- **V-REPORT-2 · MUST** 每种结果只能依据上表列出的来源声称，绝不用于上表说它不能确认的内容。_Proof: review_
- **V-REPORT-3 · SHOULD** 使用明确的结论，例如 `automated: passed`、`agent review: passed with limits`、`human: not requested`。
- **V-REPORT-4 · MUST** 请求了人工评审但尚未完成时，写 `pending`。 _Proof: review_
- **V-REPORT-5 · MUST** 用户拒绝了，就保留 `rejected` 和对应的发现，直到该用户评审更新后的范围。_Proof: review_
- **V-REPORT-6 · MUST** 智能体可以报告自己的修正和新的检查结果，但绝不编造用户的决定，也不撤销人工的拒绝。_Proof: review_
- **V-REPORT-7 · MUST** 避免没有注明出处的「accepted」「approved」或「验收通过」。_Proof: review_

是否推送、更新 PR 或执行其他外部操作，由用户授权决定。本文不额外设置一道笼统的人工审批关卡。

- **V-REPORT-8 · SHOULD** 完成并交付已授权的工作，同时如实报告 `not requested`／`pending`。
- **V-REPORT-9 · SHOULD** 只有缺少实际授权或必要的产品决定时才询问。
- **V-REPORT-10 · MUST** 绝不把智能体自己的视觉检查标成「用户已验收」。_Proof: review_

一份最简的交付说明可以是：

> 运行时和范围：构建／源码 …；状态／环境 …；相关输入指纹 …
> 证据：修复前／修复后／交互 …；身份记录在 …
> 自动化：命令／结果 …
> 智能体评审：观察到的结果、遗留的发现或局限 …
> 人工决定：未请求／待定／实际决定及引用 …
> 未验证：…；已授权的 PR／更新：…

## 指南本身的回归

确定性的对照组无需调用模型就能检验评估器；实时运行需要可用的智能体运行环境，并不是每次修改文字都必须通过的关卡。

- **V-EVAL-1 · SHOULD** 对主动选择或任务授权的 skill／路由／验收改动做实时评估时，使用仅在源码中提供的[六个智能体场景](https://github.com/chaxus/ran/tree/main/plugins/ran/evals)。
- **V-EVAL-2 · MUST** 实时运行之前，冻结任务、fixture、工具和独立的评分标准。_Proof: review_
- **V-EVAL-3 · MUST** 使用全新会话，模型和设置保持一致。_Proof: review_
- **V-EVAL-4 · MUST** 基线指南和候选指南固定在各自独立的工作区里。_Proof: review_
- **V-EVAL-5 · MUST** 保留智能体的实际工作、提示词、结果检查和证据。_Proof: review_
- **V-EVAL-6 · MUST** 基线的通过记为对照，候选的失败记为失败。_Proof: review_
- **V-EVAL-7 · MUST** 不要让执行者看到评估器的阈值或修复补丁。_Proof: review_

植入缺陷后的拒绝／恢复检查，用来确认评估器的灵敏度。

- **V-EVAL-8 · MUST** 关于这些任务上的行为，只能依据实时的智能体运行来声称；文字匹配、手写的答案或改过的测试预期都不能作为证据。_Proof: review_
- **V-EVAL-9 · MUST** 视觉判断独立于机械检查单独检查。_Proof: review_
- **V-EVAL-10 · MUST** 报告样本量、工具和未覆盖的条件。_Proof: review_
- **V-EVAL-11 · MUST** 六个成功的任务证明不了跨模型的可靠性；不要据此声称。_Proof: review_
