import { falseList, isDisabled } from '@/utils/index'

class CustomError {
  message: string
  constructor(message: string = 'document is undefined or r-button is exist') {
    this.message = message
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-button')) {
    class Button extends HTMLElement {
      static get observedAttributes() {
        return ['disabled', 'icon', 'effect', 'iconSize', 'sheet']
      }
      _btn: HTMLDivElement
      _iconElement?: HTMLElement
      _slot: HTMLSlotElement
      _shadowDom: ShadowRoot
      constructor() {
        super()
        this._slot = document.createElement('slot')
        this._btn = document.createElement('div')
        this._btn.setAttribute('class', 'btn')
        this._btn.appendChild(this._slot)
        this._slot.setAttribute('class', 'slot')
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        this._shadowDom = shadowRoot
        shadowRoot.appendChild(this._btn)
      }
      get sheet() {
        return this.getAttribute('sheet')
      }
      set sheet(value) {
        this.setAttribute('sheet', value || '')
      }
      get disabled() {
        return isDisabled(this)
      }
      set disabled(value: boolean | string | undefined | null) {
        if (!value || value === 'false') {
          this.removeAttribute('disabled')
        } else {
          this.setAttribute('disabled', '')
        }
      }
      get iconSize() {
        return this.getAttribute('iconSize')
      }
      set iconSize(value: string | undefined | null) {
        if (!value || value === 'false') {
          this.removeAttribute('iconSize')
        } else {
          this.setAttribute('iconSize', value)
          this.setIcon()
        }
      }
      get icon() {
        return this.getAttribute('icon')
      }
      set icon(value: string | null) {
        if (!value || value === 'false') {
          this.removeAttribute('icon')
        } else {
          this.setAttribute('icon', value)
          this.setIcon()
        }
      }
      get effect() {
        return this.getAttribute('effect')
      }
      set effect(value: string | null) {
        if (falseList.includes(value) || !value) {
          this.removeAttribute('effect')
        } else {
          this.setAttribute('effect', value)
        }
      }
      /**
       * @description: 设置button的icon
       * @return {*}
       */
      setIcon = () => {
        if (this.icon) {
          // 获取button的尺寸
          const { width, height } = this._slot.getBoundingClientRect()
          const size = Math.min(width, height)
          if (this._iconElement) {
            // 如果有_iconElement，只用设置name和size
            this._iconElement.setAttribute('name', this.icon)
          } else {
            // 创建icon，设置name,size,color
            this._iconElement = document.createElement('r-icon')
            this._iconElement.setAttribute('name', this.icon)
            this._iconElement.setAttribute('color', 'currentColor')
            this._iconElement.setAttribute('class', 'icon')
            // 添加到btn元素的首位
            this._slot.insertAdjacentElement('beforebegin', this._iconElement)
          }
          if (this.iconSize) {
            this._iconElement.setAttribute('size', this.iconSize)
          } else {
            this._iconElement.setAttribute('size', `${size - 5}`)
          }
        }
      }
      mousedown = (event: MouseEvent) => {
        if (!this.disabled || this.disabled === 'false') {
          const { left, top } = this.getBoundingClientRect()
          this.style.setProperty('--ran-x', event.clientX - left + 'px')
          this.style.setProperty('--ran-y', event.clientY - top + 'px')
        }
      }
      mouseLeave = () => {
        setTimeout(() => {
          this.style.removeProperty('--ran-x')
          this.style.removeProperty('--ran-y')
        }, 300)
      }
      handlerExternalCss() {
        if (this.sheet) {
          try {
            const sheet = new CSSStyleSheet()
            sheet.insertRule(this.sheet)
            this._shadowDom.adoptedStyleSheets = [sheet]
          } catch (error) {
            console.error(
              `Failed to parse the rule in CSSStyleSheet: ${this.sheet}`,
            )
          }
        }
      }
      connectedCallback() {
        this._btn.addEventListener('mousedown', this.mousedown)
        this._btn.addEventListener('mouseleave', this.mouseLeave)
        this.handlerExternalCss()
        this.setIcon()
      }
      disconnectCallback() {
        this._btn.removeEventListener('mousedown', this.mousedown)
        this._btn.removeEventListener('mouseleave', this.mouseLeave)
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === 'disabled' && this._btn) {
          if (!newValue || newValue === 'false') {
            this._btn.setAttribute('disabled', '')
          } else {
            this._btn.removeAttribute('disabled')
          }
        }
        if (name === 'icon' && this._btn && oldValue !== newValue)
          this.setIcon()
        if (name === 'iconSize' && this._btn && oldValue !== newValue)
          this._btn.setAttribute('iconSize', newValue)
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue)
          this.handlerExternalCss()
      }
    }
    customElements.define('r-button', Button)
    return Button
  } else {
    return CustomError
  }
}

export default Custom()
