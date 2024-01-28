import { HTMLElementSSR, createCustomError } from '@/utils/index';
import './index.less'


export class Content extends (HTMLElementSSR()!) {
    observer: MutationObserver;
    constructor() {
        super();
        this.observer = new MutationObserver(this.callback);
    }
    callback = (mutations: MutationRecord[], observer: MutationObserver): void => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                // A child node has been added or removed.
                this.onChange(mutation)
            } else if (mutation.type === "attributes") {
                // "The " + mutation.attributeName + " attribute was modified."
                this.onChange(mutation)
            }
        }
    };
    onChange = (mutation: MutationRecord): void => {
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    type: mutation.type,
                    value: { content: this.innerHTML, mutation }
                },
            }),
        );
    }
    connectedCallback(): void {
        this.setAttribute('class', 'ran-content')
        this.observer.observe(this, { attributes: true, childList: true, subtree: true });
    }
    disconnectCallback(): void {
        this.observer.disconnect()
    }
}

function Custom() {
    if (typeof document !== 'undefined' && !customElements.get('r-content')) {
        customElements.define('r-content', Content);
        return Content;
    } else {
        return createCustomError('document is undefined or r-content is exist');
    }
}

export default Custom();