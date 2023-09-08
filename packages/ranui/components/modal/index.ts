function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-modal')) {
    class CustomModal extends HTMLElement {
      constructor() {
        super()
      }
    }
    customElements.define('r-modal', CustomModal)
  }
}

export default Custom()
