export const sleep = (ms = 10): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function mountElement<T extends HTMLElement>(tagName: string, attributes: Record<string, string> = {}) {
  const element = document.createElement(tagName) as T;
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  document.body.appendChild(element);
  await sleep();
  return element;
}

export function mockRect(element: Element, rect: Partial<DOMRect>): void {
  element.getBoundingClientRect = () =>
    ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      ...rect,
    }) as DOMRect;
}
