function Component() {
    const template = document.createElement('template');
    const slot = document.createElement('slot');
    const form = document.createElement('form');
    form.setAttribute('class', 'r-form');
    slot.setAttribute('name', 'r-form_content');
    form.appendChild(slot);
    template.appendChild(form);
    class CustomElement extends HTMLElement {
        _form: HTMLFormElement;
        constructor() {
            super();
            this._form = form.cloneNode(true) as HTMLFormElement
            const shadowRoot = this.attachShadow({ mode: 'closed' });
            const jsonData: Record<string, any> = {}
            const formData = new FormData(this._form)
            formData.forEach((value, key) => {
                if (!jsonData[key]) {
                    jsonData[key] = formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key);
                }
            });
            this._form.addEventListener("submit", () => {
                this.value = JSON.stringify(jsonData)
            });
            shadowRoot.appendChild(this._form);
        }
        get value() {
            return this.getAttribute("value");
        }
        set value(value) {
            if (value !== null) this.setAttribute("value", value);
        }
    }
    window.customElements.define('r-form', CustomElement)
}
export default Component()