import { HTMLElementMock } from './builder';

/**
 * Rendering utility for RanUI components in SSR environments.
 * It takes a component instance and returns its HTML string representation,
 * including Declarative Shadow DOM (DSD) templates.
 *
 * @param component The RanUI component instance (e.g. new Button())
 * @returns HTML string with DSD
 */
/**
 * Rendering utility for RanUI components in SSR environments.
 */
export const renderToString = (component: any): string => {
  if (!component) return '';

  // Heuristic to find the tag name if it's a RanUI component
  // In our project, classes are often named after the component (e.g., Button -> r-button)
  // or we can check the tagName property of the Mock
  let tagName = '';
  if (component.tagName && component.tagName !== 'div') {
    tagName = component.tagName;
  } else {
    const className = component.constructor.name.toLowerCase();
    const tagMap: Record<string, string> = {
      button: 'r-button',
      icon: 'r-icon',
      input: 'r-input',
      select: 'r-select',
      checkbox: 'r-checkbox',
      progress: 'r-progress',
      loading: 'r-loading',
      skeleton: 'r-skeleton',
      modal: 'r-modal',
      tabs: 'r-tabs',
      tabpane: 'r-tab',
      radar: 'r-radar',
      player: 'r-player',
      popover: 'r-popover',
      content: 'r-content',
      form: 'r-form',
      scratchticket: 'r-scratch',
      colorpicker: 'r-colorpicker',
      math: 'r-math',
    };
    tagName = tagMap[className] || 'div';
  }

  if (typeof component.serialize === 'function') {
    return component.serialize(tagName);
  }

  if (component instanceof HTMLElementMock) {
    return component.serialize(tagName);
  }
  return '';
};

/**
 * Convenience helper to render a tag with attributes and children manually.
 */
export const h = (tag: string, props: Record<string, string> = {}, ...children: any[]): string => {
  const el = new HTMLElementMock(tag);
  Object.entries(props).forEach(([k, v]) => el.setAttribute(k, v));
  children.forEach((child) => {
    if (child) el.appendChild(child);
  });
  return el.serialize();
};
