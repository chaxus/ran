import lock from '@/assets/icons/lock.svg'
import ranuts from 'ranuts';
const { str2Xml } = ranuts;

function Component() {
    class CustomElement extends HTMLElement {
        static get observedAttributes() { return ['disabled'] }
        _div: HTMLElement;
        constructor() {
            super();
            this._div = document.createElement('div')
            const shadowRoot = this.attachShadow({ mode: 'closed' });
            shadowRoot.appendChild(this._div);
        }
        get name() {
            return this.getAttribute("name");
        }
        set name(value) {
            if (value) {
                this.setAttribute("name", value);
            }
        }
        /**
         * @description: 根据name熟悉加载对应的svg
         */
        loadSvg = async () => {
            if (this.name) {
                // vite 对动态导入的一些限制 https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
                try {
                    const result = await import(`../../assets/icons/${this.name}.svg`)
                    if (result && result.default && result.default.status) {
                        const { data } = result.default
                        const svg = str2Xml(data, 'image/svg+xml')
                        this._div.appendChild(svg)
                    }
                } catch (error) {
                    console.warn('\n', ` couldn't be loaded by r-icon`)
                }

            }
        }
        connectedCallback() {
            this.loadSvg()

        }
        disconnectCallback() {

        }
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === "name") {
                this.loadSvg()
            }
        }
    }
    window.customElements.define('r-icon', CustomElement)
}
export default Component()