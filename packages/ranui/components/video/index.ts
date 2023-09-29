const fetchAB = (url: string) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.send();
  });
};

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-video')) {
    class Video extends HTMLElement {
      static get observedAttributes() {
        return ['disabled', 'icon', 'effect'];
      }
      _video: HTMLVideoElement;
      _contain: HTMLDivElement;
      _iconElement?: HTMLElement;
      _slot: HTMLSlotElement;
      totalTime: number;
      presentTime: number;
      canplay: boolean;
      constructor(options: Record<string, string>) {
        super();
        this._slot = document.createElement('slot');
        this._contain = document.createElement('div');
        this._video = this.initialize(options);
        this._contain.setAttribute('class', 'contain');
        this._contain.appendChild(this._slot);
        this._slot.setAttribute('class', 'slot');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._video);
        this.totalTime = 0;
        this.presentTime = 0;
        this.canplay = false;
      }
      get icon() {
        return this.getAttribute('icon');
      }
      set icon(value) {
        if (value) {
          this.setAttribute('icon', value);
        }
      }
      initialize = (options: Record<string, string>) => {
        const { src } = options;
        const video = document.createElement('video');
        const source = document.createElement('source');
        source.setAttribute('src', src);
        video.textContent = '您的浏览器不支持 video 标签。';
        video.appendChild(source);
        video.setAttribute('loop', 'true');
        video.muted = true;
        video.setAttribute('autoplay', 'true');
        video.setAttribute('width', '100%');
        video.setAttribute('preload', 'auto');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-orientation', 'portrait');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('controls', 'false');
        video.controls = false;
        video.setAttribute('initial-time', '0.01');
        Object.keys(options).forEach((key) => {
          video.setAttribute(key, options[key]);
        });
        return video;
      };
      sourceOpen = (assetURL: string) => {
        return function (this: MediaSource) {
          const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
          const sourceBuffer = this.addSourceBuffer(mimeCodec);
          fetchAB(assetURL).then((buf) => {
            if (buf instanceof Buffer) {
              sourceBuffer.appendBuffer(buf);
            }
          });
        };
      };
      videoUrlToBlob = (src: string, source: HTMLSourceElement) => {
        const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
          const mediaSource = new MediaSource();
          source.setAttribute('src', URL.createObjectURL(mediaSource));
          mediaSource.addEventListener('sourceopen', this.sourceOpen(src));
        } else {
          console.error('Unsupported MIME type or codec: ', mimeCodec);
        }
      };
      
      ranloadedmetadata = () => {
        this.totalTime = this._video.duration;
      };

      ranCanplay = () => {
        this.canplay = true;
      };
      ranPlay = () => {};
      ranPlaying = () => {
        this.presentTime = this._video.currentTime;
      };
      ranPause = () => {};
      ranEnded = () => {};
      ranWaiting = () => {};
      videoMountEvent = () => {
        const video = this._video;
        video.addEventListener('loadedmetadata', this.ranloadedmetadata);
        video.addEventListener('loadeddata', this.ranCanplay);
        video.addEventListener('play', this.ranPlay);
        video.addEventListener('waiting', this.ranWaiting);
        video.addEventListener('playing', this.ranPlaying);
        video.addEventListener('pause', this.ranPause);
        video.addEventListener('ended', this.ranEnded);
      };
      videoUnmountEvent = () => {
        const video = this._video;
        if (video) {
          video.removeEventListener('loadedmetadata', this.ranloadedmetadata);
          video.removeEventListener('play', this.ranPlay);
          video.removeEventListener('playing', this.ranPlaying);
          video.removeEventListener('pause', this.ranPause);
          video.removeEventListener('waiting', this.ranWaiting);
          video.removeEventListener('ended', this.ranEnded);
          video.removeEventListener('loadeddata', this.ranCanplay);
        }
      };
      handlePlay = () => {
        this._video.play();
      };
      handlePause = () => {
        this._video.pause();
      };
      connectedCallback() {
        this.videoMountEvent();
      }
      disconnectCallback() {
        this.videoUnmountEvent();
      }
      attributeChangedCallback(name: string, old: string, fresh: string) {}
    }
    customElements.define('r-video', Video);
    return Video;
  }
}

export default Custom();
