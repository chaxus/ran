import { HTMLElementSSR } from '@/utils/index';

class ScratchTicket extends (HTMLElementSSR()!) {
  scratchTicketContainer: HTMLDivElement;
  scratchTicket: HTMLCanvasElement;
  state: { touchStart: boolean; scratchArea: number };
  scratchAward: HTMLDivElement;
  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
  }
  constructor() {
    super();
    this.scratchTicketContainer = document.createElement('div');
    this.scratchTicketContainer.setAttribute('class', 'ran-scratch-ticket');
    this.scratchAward = document.createElement('div');
    this.scratchAward.setAttribute('class', 'ran-scratch-ticket-award');
    this.scratchTicket = document.createElement('canvas');
    this.scratchTicket.setAttribute('class', 'ran-scratch-ticket-canvas');
    this.scratchTicket.style.setProperty('width', '100%');
    this.scratchTicket.style.setProperty('height', '100%');
    // this.scratchAward.appendChild(this.scratchTicket);
    this.scratchTicketContainer.appendChild(this.scratchTicket);
    this.scratchTicketContainer.appendChild(this.scratchAward);
    // const shadowRoot = this.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.textContent = `
    :host{
        position: relative;
        display: block;
    }
    .ran-scratch-ticket{
        position: relative;
        display: block;
        width:100%;
        height:100%;
    }
    .ran-scratch-ticket-award{
        position: absolute;
        top:0px;
        left:0px;
        display: block;
        width:100%;
        height:100%;
        background:#000;
        z-index:1;
    }
    .ran-scratch-ticket-canvas{
        position: absolute;
        top:0px;
        left:0px;
        display: block;
        width:100%;
        height:100%;
        z-index:2;
    }
    `;
    document.body.appendChild(style);
    // shadowRoot.appendChild(this.scratchTicketContainer);
    this.state = {
      touchStart: false,
      scratchArea: 0,
    };
  }
  touchStartScratch = (e: TouchEvent): void => {
    console.log('eeeeee', e);
    this.state.touchStart = true;
  };
  touchMoveScratch = (e: TouchEvent): void => {
    // debugger;
    if (this.state.touchStart) {
      const rect = this.scratchTicket.getBoundingClientRect();
      const ctx = this.scratchTicket.getContext('2d');
      if (!ctx) return;
      //   const x = e.touches[0].clientX - rect.left;
      //   const y = e.touches[0].clientY - rect.top;
      this.state.scratchArea += 30;
      ctx.beginPath();
      ctx.arc(100, 100, 30, 0, 2 * Math.PI);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.closePath();
    }
  };
  touchEndScratch = (): void => {
    this.state.touchStart = false;
    const { width, height } = this.scratchTicket;
    const ctx = this.scratchTicket.getContext('2d');
    if (!ctx) return;
    if (this.state.scratchArea > width * height * 0.03) {
      this.state.scratchArea = 0;
      ctx.clearRect(0, 0, width, height);
    }
  };
  drawScratchTicket = (): void => {
    const ctx = this.scratchTicket.getContext('2d');
    if (!this.scratchTicketContainer || !ctx) return;
    const revealImg = new Image();
    revealImg.src = '';
    revealImg.onload = () => {
      ctx.drawImage(revealImg, 0, 0, this.scratchTicket.width, this.scratchTicket.height);
    };
    this.scratchTicket.addEventListener('touchstart', this.touchStartScratch);
    this.scratchTicket.addEventListener('touchmove', this.touchMoveScratch);
    this.scratchTicket.addEventListener('touchend', this.touchEndScratch);
  };
  connectedCallback(): void {}
  disconnectCallback(): void {}
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.appendChild(this.scratchTicketContainer);
    this.drawScratchTicket();
  }
}

export default ScratchTicket;
