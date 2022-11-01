
function Modal() {
  const template = document.createElement('template')
  const div = document.createElement('div')
  div.setAttribute('class', 'modal-content')
  const slot = document.createElement('slot')
  slot.setAttribute('name', 'modal-content')
  div.appendChild(slot)
  template?.appendChild(div)
  class Modal extends HTMLElement {
    constructor() {
      super();
      // 获取模板内容
      const templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: 'open' });
      const wrap = document.createElement('div');
      const modal = document.createElement('div');
      const header = document.createElement('header');
      const btnClose = document.createElement('span');
      const mask = document.createElement('div');
      const footer = document.createElement('footer');
      const btnCancel = document.createElement('xu-button');
      const btnOk = document.createElement('xu-button');

      // wrap
      wrap.setAttribute('class', 'wrap');

      // modal
      modal.setAttribute('class', 'xu-modal');

      // header
      let title = this.getAttribute('title');
      header.textContent = title;
      btnClose.setAttribute('class', 'xu-close');
      btnClose.textContent = 'x';
      header.appendChild(btnClose);
      modal.appendChild(header);

      btnClose.addEventListener('click', () => {
        wrap.style.display = 'none';
      })

      // content
      modal.appendChild(templateContent.cloneNode(true));

      // footer
      btnOk.setAttribute('type', 'primary');
      const slot1 = document.createElement('span');
      slot1.setAttribute('slot', 'btn-content');
      slot1.textContent = '确认';
      btnOk.appendChild(slot1);

      const slot2 = document.createElement('span');
      slot2.setAttribute('slot', 'btn-content');
      slot2.textContent = '取消';
      btnCancel.appendChild(slot2);

      footer.appendChild(btnCancel);
      footer.appendChild(btnOk);
      modal.appendChild(footer);

      // mask
      mask.setAttribute('class', 'mask');
      wrap.appendChild(mask);
      wrap.appendChild(modal);

      // 创建样式
      const style = document.createElement('style');
      const width = this.getAttribute('width');
      const isVisible = this.getAttribute('visible');
      // 为shadow Dom添加样式
      style.textContent = `
        .wrap {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          display: ${isVisible === 'true' ? 'block' : 'none'}
        }
        // 忽略部分样式
      `
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(wrap);
    }
    connectedCallback(el: any) {
      console.log('insert dom', el)
    }
    disconnectedCallback() {
      console.log('Custom square element removed from page.');
    }
    adoptedCallback() {
      console.log('Custom square element moved to new page.');
    }
    attributeChangedCallback(name: string, oldValue: string | number | undefined, newValue: string | number | undefined) {
      if (oldValue && this.shadowRoot) {
        const children = [...this.shadowRoot.children] as Array<HTMLElement>
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeName === 'DIV' && children[i]?.className === 'wrap') {
            if (newValue === 'true') {
              children[i].style.display = 'block';
            } else {
              children[i].style.display = 'none';
            }
          }
        }
      }
    }
    // 如果需要在元素属性变化后，触发 attributeChangedCallback()回调函数，
    // 你必须监听这个属性。这可以通过定义observedAttributes() get函数来实现
    static get observedAttributes() {
      return ['visible'];
    }
  }
  if (!customElements.get("r-modal")) {
    customElements.define("r-modal", Modal);
  }
}
export default Modal()