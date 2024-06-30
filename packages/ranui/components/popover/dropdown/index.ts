import type { Chain } from "ranuts/utils"
import { create } from "ranuts/utils"
import less from "./index.less?inline"
import { HTMLElementSSR, createCustomError } from "@/utils/index"

export class PopoverDropdown extends HTMLElementSSR()! {
  _slot: Chain
  _shadowDom: ShadowRoot
  popoverContent: Chain
  popoverArrow: Chain
  popoverInner: Chain
  popoverInnerBlock: Chain
  constructor() {
    super()
    this._slot = create("slot").setAttribute("class", "slot")
    this.popoverArrow = create("div").setAttribute("class", "ran-popover-content-arrow")
    this.popoverInnerBlock = create("div").setAttribute("class", "ran-popover-inner-block").addChild(this._slot)
    this.popoverInner = create("div").setAttribute("class", "ran-popover-content-inner").addChild(this.popoverInnerBlock)
    this.popoverContent = create("div")
      .setStyle("-webkit-tap-highlight-color", "transparent")
      .setStyle("outline", "0")
      .setAttribute("class", "ran-popover-content")
      .listen("click", this.clickContent)
      .addChild([this.popoverArrow, this.popoverInner])
    const shadowRoot = this.attachShadow({ mode: "closed" })
    this._shadowDom = shadowRoot
    const style = create("style").setTextContent(less)
    shadowRoot.appendChild(style.element)
    shadowRoot.appendChild(this.popoverContent.element)
  }
  clickContent = (e: Event): void => {
    e.stopPropagation()
  }
}

function Custom() {
  if (typeof document !== "undefined" && !customElements.get("r-popover-dropdown")) {
    customElements.define("r-popover-dropdown", PopoverDropdown)
    return PopoverDropdown
  } else {
    return createCustomError("document is undefined or r-select is exist")
  }
}

export default Custom()
