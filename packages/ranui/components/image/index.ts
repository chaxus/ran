function RImage() {
    const template = document.createElement("template");
    const slot = document.createElement('slot')
    const div = document.createElement('div');
    div.setAttribute('class', 'r-btn r-btn_default');
    slot.setAttribute('name', 'r-btn_content')
    div.appendChild(slot)
    template.appendChild(div)
    class Img extends HTMLElement {
        _div: Element;
        constructor() {
            super();
            this._div = div.cloneNode(true) as HTMLElement
            const shadowRoot = this.attachShadow({ mode: "closed" });
            shadowRoot.appendChild(this._div);
        }
        connectedCallback() {

        }
    }
    window.customElements.define('r-image', Img)
}
export default RImage()


