import { str2Xml } from 'ranuts';

function Custom() {
    if (typeof window !== "undefined" && !customElements.get("r-icon")) {
        class CustomElement extends HTMLElement {
            static get observedAttributes() { return ['name', 'size', 'color', 'spin'] }
            _svg?: HTMLElement;
            _div: HTMLElement;
            constructor() {
                super();
                this._div = document.createElement('div')
                this._div.setAttribute('class', 'icon')
                const shadowRoot = this.attachShadow({ mode: 'closed' });
                shadowRoot.appendChild(this._div);
            }
            get name() {
                return this.getAttribute("name");
            }
            set name(value) {
                if (value) this.setAttribute("name", value);
            }
            get size() {
                return this.getAttribute("size");
            }
            set size(value) {
                if (value) this.setAttribute("size", value);
            }
            get color() {
                return this.getAttribute("color");
            }
            set color(value) {
                if (value) this.setAttribute("color", value);
            }
            get spin() {
                return this.getAttribute("spin");
            }
            set spin(value) {
                if (value !== null) this.setAttribute("spin", value);
            }
            /**
             * @description: 根据name属性加载对应的svg
             */
            loadSvg = async () => {
                if (this.name) {
                    // vite 对动态导入的一些限制 https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
                    try {
                        const result = await import(`../../assets/icons/${this.name}.svg`)
                        if (result && result.default && result.default._identification) {
                            const { data } = result.default
                            this._svg && this._div.removeChild(this._svg)
                            this._svg = str2Xml(data, 'image/svg+xml')
                            if (this._svg) {
                                this._div.appendChild(this._svg)
                                this.setSize()
                                this.setColor()
                            }
                        }
                    } catch (error) {
                        console.warn('\n', ` couldn't be loaded by r-icon`)
                    }

                }
            }
            /**
             * @description: 设置icon的大小
             */
            setSize = () => {
                if (this._svg && this.size) {
                    this._svg.setAttribute('width', this.size)
                    this._svg.setAttribute('height', this.size)
                }
            }
            /**
            * @description: 设置icon的颜色
            */
            setColor = () => {
                if (this._svg) {
                    this.color ? this._svg.setAttribute('fill', this.color) : this._svg.setAttribute('fill', 'currentColor')
                }
            }
            /**
             * @description: 设置是否旋转和旋转的速度
             */
            setSpin = () => {
                if (this.spin) {
                    this.style.setProperty("animation-duration", `${this.spin}s`);
                }
            }
            connectedCallback() {
                this.loadSvg()

            }
            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                if (newValue !== oldValue) {
                    if (name === "name") this.loadSvg()
                    if (name === "size") this.setSize()
                    if (name === "color") this.setColor()
                    if (name === "spin") this.setSpin()
                }
            }
        }
        customElements.define("r-icon", CustomElement);
    }
}
export default Custom()