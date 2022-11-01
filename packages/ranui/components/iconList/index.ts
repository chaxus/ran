import ranuts from 'ranuts';
// 存在问题vite resolveId时期获取的import路径会变短，其中alias解析的路径会被丢失
// id---> /Users/ranzhouhang/Documents/code/ran/packages/ranui/assets/icons|importFile?dir 
// id---> /assets/icons|importFile?dir
// import iconList from '@/assets/icons|importFile?dir';

class CustomElement extends HTMLElement {
    static get observedAttributes() { return ['path'] }
    _svg?: HTMLElement;
    _div: HTMLElement;
    constructor() {
        super();
        this._div = document.createElement('div')
        this._div.setAttribute('class', 'icon-list')
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._div);
    }
    get path() {
        return this.getAttribute("name");
    }
    set path(value) {
        if (value) this.setAttribute("name", value);
    }
    /**
     * @description: 根据name属性加载对应的svg
     */
    loadSvg = async () => {
        // console.log('fdsa',iconList);
    }
    connectedCallback() {
        this.loadSvg()

    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (newValue !== oldValue) {
        }
    }
}

function Custom() {
    if (!customElements.get("r-icon-list")) {
        customElements.define("r-icon-list", CustomElement);
    }
}

export default Custom()