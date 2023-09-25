# Build your own React

> 翻译：<https://pomb.us/build-your-own-react/>

我们将从零开始写一个 React，遵循真正的 React 代码和架构，但没有那些优化和一些非必须的功能。

- Step I: The createElement Function
- Step II: The render Function
- Step III: Concurrent Mode
- Step IV: Fibers
- Step V: Render and Commit Phases
- Step VI: Reconciliation
- Step VII: Function Components
- Step VIII: Hooks

# Step IV: Fibers

为了组织这些执行单元，我们需要一个数据结构：一个 fiber 树。

每一个元素对应一个 fiber，每一个 fiber 又对应一个执行单元。

假设我们要像这样渲染一个元素：

```js
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container,
);
```

在 render 函数中，我们创建了根 fiber，并且设置它作为 nextUnitOfWork。剩下的工作放在 performUnitOfWork 中。它将为每一个 fiber 做三件事情：

1. 添加元素到 DOM 上
2. 为元素的子元素创建 fiber
3. 选择并返回下一个执行单元

fiber 这种数据结构的目标之一是为了方便的查找下一个执行单元。这也是为什么每一个 fiber 会 link 它的第一个子元素，它的下一个兄弟元素，和他的父元素。

当我们完成一个 fiber 的执行后，如果它有子元素，那么它的子元素将是下一个执行单元。

如果这个 fiber 没有子元素，那么我们会找它的下一个兄弟元素作为执行单元。

如果这个 fiber 没有子元素和下一个兄弟元素，那么我们会去找它的舅舅元素，就是它的父元素的下一个兄弟元素。

如果它的父元素没有下一个元素，那我们会去递归的寻找它的父元素，直到我们找他它父元素的下一个兄弟元素，或者直接递归到根节点。如果递归到了根节点，说明我们执行完成了所有的单元。

接下来开始写代码：

在 render 函数，我们 通过 nextUnitOfWork 设置 fiber 的根节点

然后，当浏览器有空闲的时候，执行我们准备好的 workLoop ，并从根节点开始

首先，我们创建一个新的节点，并添加到它的 dom 属性中。我们保持追踪 dom 节点在 fiber.dom 属性。

```js
if (!fiber.dom) {
  fiber.dom = createElement(fiber);
}
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

然后对于当前元素的子元素，会对每一个子元素创建一个 fiber

```js
const elements = fiber.props.children
  let index = 0
  let prevSibling = null
​
  while (index < elements.length) {
    const element = elements[index]
​
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
  }
```

然后将它们添加到 fiber 树中，作为子节点还是兄弟节点。区别在于是否是第一个子节点

```js
let index = 0;
let prevSibling;
while (index < elements.length) {
  const element = elements[index];
  const newFiber: Fiber = {
    type: element.type,
    props: element.props,
    parent: fiber,
  };
  if (index === 0) {
    fiber.child = newFiber;
  } else {
    if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
  }
  prevSibling = newFiber;
  index++;
}
```

最后，我们返回下一个工作单元，首先寻找它的子元素，然后是兄弟元素，然后是舅舅元素，直到根节点。

```js
if (fiber.child) {
  return fiber.child;
}
let nextFiber = fiber;
while (nextFiber) {
  if (nextFiber.sibling) {
    return nextFiber.sibling;
  }
  nextFiber = nextFiber.parent;
}
```

# Step V: Render and Commit 阶段

我们还有另一个问题

每次处理一个元素时，我们都会向 DOM 添加一个新节点。而且，请记住，浏览器可能会在我们完成整个树的渲染之前中断我们的工作。在这种情况下，用户将看到一个不完整的 UI。我们不希望那样。

因此，我们需要从这里删除改变 DOM 的部分。

```js
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

相反，我们将跟踪纤维树的根。我们称其为进展中的工作根或 wipRoot。

一旦我们完成了所有的工作(我们知道这一点是因为没有下一个工作单元)，我们就把整个纤维树提交给 DOM。

我们在 commitRoot 函数中完成它。这里我们递归地将所有节点附加到 dom。

# Step VI: Reconciliation

到目前为止，我们只向 DOM 添加了内容，那么更新或删除节点呢?

这就是我们现在要做的，我们需要将我们在渲染函数中接收到的元素与我们提交给 DOM 的最后一个纤维树进行比较。

因此，在完成提交之后，我们需要保存对“提交到 DOM 的最后一个光纤树”的引用。我们称之为 currenroot。

我们还为每根纤维添加了交替特性。该属性是指向旧纤维的链接，即我们在前一个提交阶段提交给 DOM 的纤维。
