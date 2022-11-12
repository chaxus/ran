import failImage from "@/assets/image/failImage";


function Custom() {
  if (typeof window !== "undefined" && !customElements.get("r-img")) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ["fallback"];
      }
      _image: HTMLImageElement | undefined;
      _container: Element;
      constructor() {
        super();
        this._container = document.createElement("div");
        this._container.setAttribute("class", "r-image");
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(this._container);
      }
      get fallback() {
        return this.getAttribute("fallback") || failImage;
      }
      set fallback(value) {
        if (value) {
          this.setAttribute("fallback", value);
        } else {
          this.removeAttribute("fallback");
        }
      }
    
      listenFallback(name: string, value: string) {
        if (name === "fallback" && this._image) {
          if (value) {
            this._image.setAttribute("fallback", value);
          } else {
            this._image.removeAttribute("fallback");
          }
        }
      }
    
      connectedCallback() {
        const src = this.getAttribute("src") || "";
        this._image = new Image();
        this._image.src = src;
        this._image.addEventListener("error", () => {
          if (this._image && this.fallback) {
            this._image.src = this.fallback;
          }
        });
        this._image.addEventListener("load", () => {
          if (this._image) {
            this._container.appendChild(this._image);
          }
        });
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.listenFallback(name, newValue);
      }
    }
    customElements.define("r-img", CustomElement);
  }
}

export default Custom();
