import failImage from '@/assets/image/failImage'

function Component() {
    const template = document.createElement("template");
    const container = document.createElement('div');
    container.setAttribute('class', 'r-image');
    template.appendChild(container)
    class CustomElement extends HTMLElement {
        _container: Element;
        constructor() {
            super();
            this._container = container.cloneNode(true) as HTMLElement
            const shadowRoot = this.attachShadow({ mode: "closed" });
            shadowRoot.appendChild(this._container);
        }
        connectedCallback() {
            const src = this.getAttribute('src') || ''
            const image = new Image()
            image.src = src
            image.addEventListener('error', () => {
                image.src = failImage
            })
            image.addEventListener('load', () => {
                this._container.appendChild(image)
            })
        }
    }
    window.customElements.define('r-img', CustomElement)
}
export default Component()


