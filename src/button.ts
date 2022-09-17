function RButton() {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  slot.setAttribute('name', 'btn-content')
  template.appendChild(slot)
  class Button extends HTMLElement {
    constructor() {
      super();
      // 获取模板内容
      const templateContent = template.content;
      // 组件内容
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const btn = document.createElement('button');
      // 克隆一份 防止重复使用 污染
      btn.appendChild(templateContent.cloneNode(true));
      btn.setAttribute('class', 'xu-button');
      // 定义并获取按钮类型  primary | warning | default
      const type: Record<string, string> = {
        'primary': '#06c',
        'warning': 'red',
        'default': '#f0f0f0'
      }
      const attribute = this.getAttribute('type') || ''
      const btnType = Object.keys(type).includes(attribute) ? attribute : 'default';
      const btnColor = btnType === 'default' ? '#888' : '#fff';

      // 创建样式
      const style = document.createElement('style');
      // 为shadow Dom添加样式
      style.textContent = `
        .xu-button {
          position: relative;
          margin-right: 3px;
          display: inline-block;
          padding: 6px 20px;
          border-radius: 30px;
          background-color: ${type[btnType]};
          color: ${btnColor};
          outline: none;
          border: none;
          box-shadow: inset 0 5px 10px rgba(0,0,0, .3);
          cursor: pointer;
        }
      `
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(btn);
    }
  }
  window.customElements.define('xu-button', Button);

}

export default RButton()
