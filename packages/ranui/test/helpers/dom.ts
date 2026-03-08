export const resetDom = (): void => {
  document.body.innerHTML = '';
};

export const mount = <T extends HTMLElement>(element: T): T => {
  document.body.appendChild(element);
  return element;
};
