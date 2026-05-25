import scratchCss from './index.less?inline';
import { Div, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { ensureShadowElement, ensureShadowRoot } from '@/utils/component';

class ScratchTicket extends RanElement {
  scratchTicketContainer: HTMLDivElement;
  scratchTicket: HTMLCanvasElement;
  state: { touchStart: boolean; scratchArea: number };
  scratchAward: HTMLDivElement;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, scratchCss);
    const scratchTicketContainer = ensureShadowElement(this._shadowDom, '.ran-scratch-ticket', () => {
      const scratchTicket = View('canvas')
        .class('ran-scratch-ticket-canvas')
        .style('width', '100%')
        .style('height', '100%')
        .build() as HTMLCanvasElement;
      const scratchAward = Div().class('ran-scratch-ticket-award').build() as HTMLDivElement;
      return Div().class('ran-scratch-ticket').children(scratchTicket, scratchAward).build() as HTMLDivElement;
    });
    const scratchAward = scratchTicketContainer.querySelector('.ran-scratch-ticket-award') as HTMLDivElement;
    const scratchTicket = scratchTicketContainer.querySelector('.ran-scratch-ticket-canvas') as HTMLCanvasElement;

    this.scratchTicketContainer = scratchTicketContainer;
    this.scratchAward = scratchAward;
    this.scratchTicket = scratchTicket;

    this.state = {
      touchStart: false,
      scratchArea: 0,
    };
  }
  touchStartScratch = (e: TouchEvent): void => {
    console.log('eeeeee', e);
    this.state.touchStart = true;
  };
  touchMoveScratch = (): void => {
    // debugger;
    if (this.state.touchStart) {
      // const rect = this.scratchTicket.getBoundingClientRect();
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
  attributeChangedCallback(): void {
    if (!this._shadowDom.contains(this.scratchTicketContainer)) {
      this._shadowDom.appendChild(this.scratchTicketContainer);
    }
    this.drawScratchTicket();
  }
}

export default ScratchTicket;

defineSSR('r-scratch', ScratchTicket as unknown as new () => HTMLElement);
