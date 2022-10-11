function Component() {
   const template = document.createElement('template');
   const slot = document.createElement('slot');
   const div = document.createElement('div');
   div.setAttribute('class', 'class');
   slot.setAttribute('name', 'name');
   div.appendChild(slot);
   template.appendChild(div);
   class CustomElement extends HTMLElement {
       static get observedAttributes() { return ['disabled'] }
       _div: HTMLElement;
       constructor() {
           super();
           this._div = div.cloneNode(true) as HTMLElement
           const shadowRoot = this.attachShadow({ mode: 'closed' });
           shadowRoot.appendChild(this._div);
       }
       connectedCallback() {

       }
       disconnectCallback() {

       }
       attributeChangedCallback (name:string, oldValue:string, newValue:string) {

       }
   }
window.customElements.define('r-tab', CustomElement)
}
export default Component()