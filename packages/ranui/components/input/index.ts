import { HTMLElementSSR, createCustomError, falseList, isDisabled } from '@/utils/index';
import '@/components/icon/index';

export class Input extends (HTMLElementSSR()!) {
  static get observedAttributes(): string[] {
    return [
      'label',
      'disabled',
      'name',
      'placeholder',
      'type',
      'icon',
      'value',
      'status', // error warning normal
      'prefix', // 前缀
      'suffix', // 后缀
      'allowclear', // 清除 icon
      'count', // 计算输入的数量
      'maxlength',
      'showcount',
      'onPressEnter', // 按下回车的回调
      'variant', // filled borderless
      'minrows', // 当 type 等于 TextArea 时
      'maxrows',
    ];
  }
  _input: HTMLDivElement;
  _label: HTMLLabelElement | undefined;
  _inputContent: HTMLInputElement;
  _icon: HTMLElement | undefined;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._input = document.createElement('div');
    this._input.setAttribute('class', 'ran-input');
    this._input.setAttribute('part', 'ran-input');
    this._inputContent = document.createElement('input');
    this._inputContent.setAttribute('class', 'ran-input-content');
    this._inputContent.setAttribute('part', 'ran-input-content');
    this._input.appendChild(this._inputContent);
    shadowRoot.appendChild(this._input);
  }
  /**
   * @description: 获取 input 的值
   * @return {String}
   */
  get value(): string {
    return this.getAttribute('value') || '';
  }
  /**
   * @description: 设置 input 的值
   * @param {String} value
   */
  set value(value: string) {
    if (!isDisabled(this) && value) {
      this.setAttribute('value', value);
      this._input.setAttribute('value', value);
    } else {
      this.removeAttribute('value');
      this._input.removeAttribute('value');
    }
  }
  /**
   * @description: 获取 input 的占位字符
   * @return {String}
   */
  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }
  /**
   * @description: 设置 input 的占位字符
   * @param {String} value
   */
  set placeholder(value: string) {
    if (value) {
      this.setAttribute('placeholder', value);
    } else {
      this.removeAttribute('placeholder');
    }
  }
  /**
   * @description: input 是否为必选
   * @return {String}
   */
  get required(): string {
    return this.getAttribute('required') || '';
  }
  /**
   * @description: 设置 input 是否为必选，除非设置成 false，否则都是必填
   * @param {*} value
   */
  set required(value: string) {
    if (!value || value === 'false') {
      this.removeAttribute('required');
    } else {
      this.setAttribute('required', '');
    }
  }
  /**
   * @description: 获取 input 上 disabled 属性
   * @return {String | null}
   */
  get disabled(): string {
    return `${isDisabled(this)}`;
  }
  /**
   * @description: 设置 input 的 disabled 属性
   * @param {String} value
   */
  set disabled(value: string) {
    if (falseList.includes(value)) {
      this.removeAttribute('disabled');
      this._input.removeAttribute('disabled');
      this._inputContent.removeAttribute('disabled');
    } else {
      this.setAttribute('disabled', '');
      this._input.setAttribute('disabled', '');
      this._inputContent.setAttribute('disabled', '');
    }
  }
  /**
   * @description: 获取类似于 Metiral Design 的输入体验。
   */
  get label(): string {
    return this.getAttribute('label') || '';
  }
  /**
   * @description: 设置类似于 Metiral Design 的输入体验。
   */
  set label(value: string) {
    this.setAttribute('label', value);
  }
  /**
   * @description: 获取 input 框的状态
   */
  get status(): string {
    return this.getAttribute('status') || '';
  }
  /**
   * @description: 设置 input 框的状态
   */
  set status(value: string) {
    if (value) {
      this.setAttribute('status', value);
      this._input.setAttribute('status', value);
    } else {
      this.removeAttribute('status');
      this._input.removeAttribute('status');
    }
  }
  /**
   * @description: 与 form 组件联动时，收集的属性名
   * @return {String}
   */
  get name(): string {
    return this.getAttribute('name') || '';
  }
  /**
   * @description: 设置 name 属性
   * @param {string} value
   */
  set name(value: string) {
    this.setAttribute('name', value);
  }
  /**
   * @description: 当 input 类型为 number 类型时，可以获取 min 属性
   * @return {String}
   */
  get min(): string {
    return this.getAttribute('min') || '';
  }
  /**
   * @description: 当 input 类型为 number 类型时，设置 min 属性
   * @param {string} value
   */
  set min(value: string) {
    if (this.type === 'number') this.setAttribute('min', value);
  }
  /**
   * @description: 当 input 类型为 number 类型时，可以获取 max 属性
   * @return {String}
   */
  get max(): string {
    return this.getAttribute('max') || '';
  }
  /**
   * @description: 当 input 类型为 number 类型时，设置 max 属性
   * @param {string} value
   */
  set max(value: string) {
    if (this.type === 'number') this.setAttribute('max', value);
  }
  /**
   * @description: 当 input 类型为 number 类型时，可以获取 step 属性
   * @return {String}
   */
  get step(): string {
    return this.getAttribute('step') || '';
  }
  /**
   * @description: 当 input 类型为 number 类型时，设置 step 属性
   * @param {string} value
   */
  set step(value: string) {
    if (this.type === 'number') this.setAttribute('step', value);
  }
  /**
   * @description: 获取一个 icon
   * @return {String}
   */
  get icon(): string {
    return this.getAttribute('icon') || '';
  }
  /**
   * @description: 设置 icon 来表示标识
   * @param {string|null} value
   */
  set icon(value: string) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }
  /**
   * @description: 获取前面的 icon
   * @return {String}
   */
  get prefix(): string {
    return this.getAttribute('prefix') || '';
  }
  /**
   * @description: 设置前面的 icon 来表示标识
   * @param {string|null} value
   */
  set prefix(value: string) {
    if (value) {
      this.setAttribute('prefix', value);
    } else {
      this.removeAttribute('prefix');
    }
  }
  /**
   * @description: 获取后面的 icon
   * @return {String}
   */
  get suffix(): string {
    return this.getAttribute('suffix') || '';
  }
  /**
   * @description: 设置后面的 icon 来表示标识
   * @param {string|null} value
   */
  set suffix(value: string) {
    if (value) {
      this.setAttribute('suffix', value);
    } else {
      this.removeAttribute('suffix');
    }
  }
  /**
   * @description: 获取 input 的类型
   * @return {string|null}
   */
  get type(): string {
    return this.getAttribute('type') || '';
  }
  /**
   * @description: 设置 input 的类型
   * @param {string|null} value
   */
  set type(value: string) {
    if (value) {
      this.setAttribute('type', value);
    } else {
      this.removeAttribute('type');
    }
  }
  /**
   * @description: 原生的 input 方法
   * @param {Event} event
   */
  customInput = (event: Event): void => {
    event.stopPropagation();
    event.preventDefault();
    const { target, data = '' } = event as InputEvent;
    this.value = (target as HTMLInputElement)?.value || data || '';
    // 增加 onchange 事件
    this.customChange();
    // 默认 input 事件
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value: this.value,
        },
      }),
    );
  };
  /**
   * @description: 增加 change 方法，同时兼容大小写的情况
   */
  customChange = (): void => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value,
        },
      }),
    );
  };
  /**
   * @description: 监听 placeholder 属性函数
   * @param {string} name
   * @param {string} value
   */
  listenPlaceholder = (name: string, value: string): void => {
    if (name === 'placeholder' && this._inputContent) {
      if (value != null) {
        this._inputContent.setAttribute('placeholder', value);
      } else {
        this._inputContent.removeAttribute('placeholder');
      }
    }
  };
  /**
   * @description: 监听 label 属性函数
   * @param {string} name
   * @param {string} value
   */
  listenLabel = (name: string, value: string): void => {
    if (name === 'label' && this._inputContent) {
      if (value != null) {
        if (this._label) {
          this._label.innerHTML = value;
        } else {
          this._label = document.createElement('label');
          this._label.innerHTML = value;
          this._label.setAttribute('class', 'ran-input-label');
          this._label.setAttribute('part', 'ran-input-label');
          this._input.appendChild(this._label);
        }
      } else {
        this._input.removeAttribute('label');
        if (this._label) {
          this._input.removeChild(this._label);
          this._label = undefined;
        }
      }
    }
  };
  /**
   * @description: 监听 type 属性
   * @param {string} name
   * @param {string} value
   */
  listenType = (name: string, value: string): void => {
    if (name === 'type' && this._inputContent) {
      if (value) {
        this._inputContent.setAttribute('type', value);
      } else {
        this._inputContent.removeAttribute('type');
        this._inputContent.removeAttribute('min');
        this._inputContent.removeAttribute('max');
        this._inputContent.removeAttribute('step');
      }
    }
  };
  /**
   * @description: 监听 status 属性
   * @param {string} name
   * @param {string} value
   */
  listenStatus = (name: string, value: string): void => {
    if (name === 'status' && this._input) {
      if (value) {
        this._input.setAttribute('status', value);
      } else {
        this._input.removeAttribute('status');
      }
    }
  };
  /**
   * @description: 监听 disabled 属性
   * @param {string} name
   * @param {string} value
   */
  listenDisabled = (name: string, value: string): void => {
    if (name === 'disabled' && this._input) {
      if (falseList.includes(value)) {
        this._input.removeAttribute('disabled');
      } else {
        this._input.setAttribute('disabled', '');
        this._inputContent.setAttribute('disabled', '');
      }
    }
  };
  /**
   * @description:  监听 icon 属性
   * @param {string} name
   * @param {string} value
   */
  listenIcon = (name: string, value: string, oldValue: string): void => {
    if (name === 'icon' && value && value !== oldValue) {
      this.removeAttribute('label');
      this.setAttribute('icon', value);
      this.dealIcon();
    }
  };
  /**
   * @description: 处理 icon 属性的问题
   */
  dealIcon = (): void => {
    if (!this._icon) {
      this._icon = document.createElement('r-icon');
      this._icon.setAttribute('class', 'ran-icon');
      this._inputContent.insertAdjacentElement('beforebegin', this._icon);
    }
    this.icon && this._icon.setAttribute('name', this.icon);
  };
  /**
   * @description: 聚合监听事件
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  listenEvent = (name: string, oldValue: string, newValue: string): void => {
    this.listenPlaceholder(name, newValue);
    this.listenLabel(name, newValue);
    this.listenStatus(name, newValue);
    this.listenDisabled(name, newValue);
    this.listenIcon(name, newValue, oldValue);
    if (name === 'value' && oldValue !== newValue) {
      this._inputContent.value = newValue;
      this._input.setAttribute('value', newValue);
    }
  };
  connectedCallback(): void {
    // 如果一开始就设置了 input 的值，则初始化 input 的值
    if (this.value) {
      this._inputContent.value = this.value;
      this._input.setAttribute('value', this.value);
    }
    if (this.status) {
      this._input.setAttribute('status', this.status);
    }
    if (isDisabled(this)) {
      this._input.setAttribute('disabled', '');
      this._inputContent.setAttribute('disabled', '');
    }
    if (this.type) {
      this._inputContent.setAttribute('type', this.type);
    }
    this._inputContent.addEventListener('input', this.customInput);
    if (document.readyState === 'complete') {
      this.dealIcon();
    }
  }
  disconnectCallback(): void {
    this._inputContent.removeEventListener('input', this.customInput);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.listenEvent(name, oldValue, newValue);
  }
}

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-input')) {
    customElements.define('r-input', Input);
    return Input;
  } else {
    return createCustomError('document is undefined or r-input is exist');
  }
}

export default Custom();
