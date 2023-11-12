function Skeleton() {
  if (typeof window !== 'undefined' && !customElements.get('r-skeleton')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['disabled'];
      }
      _div: HTMLElement;
      constructor() {
        super();
        this._div = document.createElement('div');
        this._div.setAttribute('class', 'ran-skeleton');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._div);
      }
      connectedCallback() {}
      disconnectCallback() {}
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {}
    }

    window.customElements.define('r-skeleton', CustomElement);
  }
}
export default Skeleton();
