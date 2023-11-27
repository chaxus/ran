import {
  SyncHook,
  addClassToElement,
  createDocumentFragment,
  range,
  removeClassToElement,
  throttle,
  timeFormat,
} from "ranuts";
import "@/assets/js/hls.js";
import type { Progress } from "@/components/progress";
import "./index.less";

const PLAY_STATE_LIST = ["play", "playing", "timeupdate"];

interface Context {
  action: SyncHook;
  currentState: string;
  duration: number;
  currentTime: number;
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
}

const SPEED = [
  { label: "2.0X", value: 2.0 },
  { label: "1.5X", value: 1.5 },
  { label: "1.0X", value: 1 },
  { label: "0.75X", value: 0.75 },
  { label: "0.5X", value: 0.5 },
];

function Custom() {
  if (typeof document !== "undefined" && !customElements.get("r-player")) {
    class RanPlayer extends HTMLElement {
      public ctx: Context;
      private _player: HTMLDivElement;
      private _container: HTMLDivElement;
      private _slot: HTMLSlotElement;
      private _playerController: HTMLDivElement;
      private _playerBtn: HTMLDivElement;
      private _progress: HTMLDivElement;
      private _progressDot: HTMLDivElement;
      private _progressWrap: HTMLDivElement;
      private _progressWrapValue: HTMLDivElement;
      private requestAnimationFrameId?: number;
      private moveProgress: { percentage: number; mouseDown: boolean };
      private _playerControllerBottom: HTMLDivElement;
      private _playerControllerBottomRight: HTMLDivElement;
      private _playerControllerBottomLeft: HTMLDivElement;
      private _playerControllerBottomPlayBtn: HTMLDivElement;
      private _playerControllerBottomTimeCurrent: HTMLDivElement;
      private _playerControllerBottomTimeDuration: HTMLDivElement;
      private _playerControllerBottomTimeDivide: HTMLDivElement;
      private _playControllerBottomClarity: HTMLDivElement;
      private _playControllerBottomSpeed: HTMLDivElement;
      private _playControllerBottomSpeedIcon: HTMLDivElement;
      private _playControllerBottomSpeedProgress: Progress;
      private _playControllerBottomRightFullScreen: HTMLDivElement;
      private _playControllerBottomVolume: HTMLDivElement;
      private _playControllerBottomSpeedPopover: HTMLElement;
      private controllerBarTimeId?: NodeJS.Timeout;
      private clarityList?: {
        definition: string;
        label: string;
        value: string;
        url: string;
      }[];
      private _playerTip: HTMLDivElement;
      private _playerTipTime: HTMLDivElement;
      private _playerTipText: HTMLDivElement;
      private _volume?: number;
      private _video?: HTMLVideoElement;
      private _hls: any;
      static get observedAttributes(): string[] {
        return ["src", "volume", "playTime", "playbackRate"];
      }
      /**
       * @description: 初始化view和video的全局上下文
       * @return {*}
       */
      constructor() {
        super();
        this._player = document.createElement("div");
        this._container = document.createElement("div");
        this._slot = document.createElement("slot");
        this._playerBtn = document.createElement("div");
        this._progress = document.createElement("div");
        this._progressWrap = document.createElement("div");
        this._progressWrapValue = document.createElement("div");
        this._progressDot = document.createElement("div");
        this._playerControllerBottom = document.createElement("div");
        this._playerControllerBottomRight = document.createElement("div");
        this._playerControllerBottomLeft = document.createElement("div");
        this._player.setAttribute("class", "ran-player");
        this._player.setAttribute("data-growing-ignore", "true");
        // play and pause
        this._playerBtn.setAttribute("class", "ran-player-play-btn");
        // progress
        this._progress.setAttribute("class", "ran-player-controller-progress");
        this._progressWrap.setAttribute(
          "class",
          "ran-player-controller-progress-wrap"
        );
        this._progressWrapValue.setAttribute(
          "class",
          "ran-player-controller-progress-wrap-value"
        );
        this._progressDot.setAttribute(
          "class",
          "ran-player-controller-progress-dot"
        );
        // play and pause btn, current / total time
        this._playerControllerBottom.setAttribute(
          "class",
          "ran-player-controller-bottom"
        );
        this._playerControllerBottomRight.setAttribute(
          "class",
          "ran-player-controller-bottom-right"
        );
        this._playerControllerBottomLeft.setAttribute(
          "class",
          "ran-player-controller-bottom-left"
        );
        this._playerControllerBottomPlayBtn = document.createElement("div");
        this._playerControllerBottomPlayBtn.setAttribute(
          "class",
          "ran-player-controller-bottom-left-btn"
        );
        this._playerControllerBottomTimeCurrent = document.createElement("div");
        this._playerControllerBottomTimeCurrent.setAttribute(
          "class",
          "ran-player-controller-bottom-left-time-current"
        );
        this._playerControllerBottomTimeDivide = document.createElement("div");
        this._playerControllerBottomTimeDivide.setAttribute(
          "class",
          "ran-player-controller-bottom-left-time-divide"
        );
        this._playerControllerBottomTimeDuration = document.createElement(
          "div"
        );
        this._playerControllerBottomTimeDuration.setAttribute(
          "class",
          "ran-player-controller-bottom-left-time-duration"
        );
        // clarity
        this._playControllerBottomClarity = document.createElement("div");
        this._playControllerBottomClarity.setAttribute(
          "class",
          "ran-player-controller-bottom-right-clarity"
        );
        // speed
        this._playControllerBottomSpeed = document.createElement("div");
        this._playControllerBottomSpeed.setAttribute(
          "class",
          "ran-player-controller-bottom-right-speed"
        );
        this._playControllerBottomSpeedPopover = document.createElement(
          "ran-popover"
        );
        this._playControllerBottomSpeedPopover.setAttribute("value", "1");
        const Fragment = document.createDocumentFragment();
        this._playControllerBottomSpeedPopover.appendChild(Fragment);
        this._playControllerBottomSpeed.appendChild(
          this._playControllerBottomSpeedPopover
        );
        // volume
        this._playControllerBottomVolume = document.createElement("div");
        this._playControllerBottomVolume.setAttribute(
          "class",
          "ran-player-controller-bottom-right-volume"
        );
        this._playControllerBottomSpeedProgress = <Progress>document.createElement(
          "r-progress"
        );
        this._playControllerBottomSpeedProgress.setAttribute(
          "class",
          "ran-player-controller-bottom-right-volume-progress"
        );
        this._playControllerBottomSpeedProgress.setAttribute("percent", "0.5");
        this._playControllerBottomSpeedProgress.setAttribute("type", "drag");
        this._playControllerBottomSpeedIcon = document.createElement("div");
        this._playControllerBottomSpeedIcon.setAttribute(
          "class",
          "ran-player-controller-bottom-right-volume-icon ran-player-controller-bottom-right-volume-icon-volume"
        );
        // fullscreen
        this._playControllerBottomRightFullScreen = document.createElement(
          "div"
        );
        this._playControllerBottomRightFullScreen.setAttribute(
          "class",
          "ran-player-controller-bottom-right-full"
        );
        // controller
        this._playerController = document.createElement("div");
        this._playerController.setAttribute("class", "ran-player-controller");
        this._playerTip = document.createElement("div");
        this._playerTip.setAttribute("class", "ran-player-controller-tip");
        this._playerTipTime = document.createElement("div");
        this._playerTipTime.setAttribute(
          "class",
          "ran-player-controller-tip-time"
        );
        this._playerTipText = document.createElement("div");
        this._playerTipText.setAttribute(
          "class",
          "ran-player-controller-tip-text"
        );
        this._playerTip.appendChild(
          createDocumentFragment([this._playerTipTime, this._playerTipText])!
        );
        this._playerController.appendChild(
          createDocumentFragment([
            this._playerTip,
            this._progress,
            this._playerControllerBottom,
          ])!
        );
        // container
        this._player.appendChild(
          createDocumentFragment([
            this._container,
            this._slot,
            this._playerBtn,
            this._playerController,
          ])!
        );
        this._progressWrap.appendChild(this._progressWrapValue);
        this._progress.appendChild(
          createDocumentFragment([this._progressWrap, this._progressDot])!
        );
        this._playerControllerBottom.appendChild(
          createDocumentFragment([
            this._playerControllerBottomLeft,
            this._playerControllerBottomRight,
          ])!
        );
        this._playerControllerBottomLeft.appendChild(
          createDocumentFragment([
            this._playerControllerBottomPlayBtn,
            this._playerControllerBottomTimeCurrent,
            this._playerControllerBottomTimeDivide,
            this._playerControllerBottomTimeDuration,
          ])!
        );
        this._playControllerBottomVolume.appendChild(
          createDocumentFragment([
            this._playControllerBottomSpeedIcon,
            this._playControllerBottomSpeedProgress,
          ])!
        );
        this._playerControllerBottomRight.appendChild(
          createDocumentFragment([
            this._playControllerBottomClarity,
            this._playControllerBottomSpeed,
            this._playControllerBottomVolume,
            this._playControllerBottomRightFullScreen,
          ])!
        );
        // ctx
        this.ctx = {
          currentTime: 0,
          duration: 0,
          currentState: "",
          action: new SyncHook(),
          volume: 0.5,
          playbackRate: 1,
          fullScreen: false,
        };
        this.moveProgress = {
          percentage: 0,
          mouseDown: false,
        };
      }
      get src(): string {
        return this.getAttribute("src") || "";
      }
      set src(value: string) {
        this.setAttribute("src", value || "");
      }
      get volume(): string {
        return this.getAttribute("volume") || "";
      }
      set volume(value: string) {
        this.setAttribute("volume", value || "");
      }
      /**
       * @description: 初始化 video 和更新 video 方法
       * @return {*}
       */
      private updatePlayer = () => {
        const { Hls } = window;
        if (!this.contains(this._player)) {
          this.appendChild(this._player);
        }
        if (this._hls) {
          this._hls.destroy();
          this._hls = undefined;
        }
        this._video = document.createElement("video");
        this._video.setAttribute("class", "ran-player-video");
        if (Hls?.isSupported() && this.src) {
          this._hls = new Hls();
          this._hls.loadSource(this.src);
          this._hls.attachMedia(this._video);
          this._container.appendChild(this._video);
          this._video.parentElement?.setAttribute(
            "class",
            "ran-player-contain"
          );
          this.resize();
        }
        this.listenEvent();
      };
      private change = (name: string, value: unknown): void => {
        const currentTime = this.getCurrentTime();
        const duration = this.getTotalTime();
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              type: name,
              data: value,
              currentTime,
              duration,
              tag: this._video,
            },
          })
        );
      };
      private onCanplay = (e: Event) => {
        this.ctx.currentState = e.type;
        removeClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-pause"
        );
        addClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-play"
        );
        this.change("canplay", e);
      };
      private onCanplaythrough = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("canplaythrough", e);
      };
      private onComplete = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("complete", e);
      };
      private onDurationchange = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("durationchange", e);
      };
      private onEmptied = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("emptied", e);
      };
      private onEnded = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("ended", e);
      };
      private onError = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("error", e);
      };
      private onLoadedmetadata = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("loadedmetadata", e);
      };
      private onLoadstart = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("loadstart", e);
      };
      private onProgress = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("progress", e);
      };
      private onRatechange = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("ratechange", e);
      };
      private onSeeked = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("seeked", e);
      };
      private onSeeking = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("seeking", e);
      };
      private onStalled = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("stalled", e);
      };
      private onSuspend = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("suspend", e);
      };
      private onLoadeddata = (e: Event) => {
        this.ctx.currentState = e.type;
        const duration = this.getTotalTime();
        this.ctx.duration = Math.floor(duration * 1000) / 1000;
        this._playerControllerBottomTimeCurrent.innerText = "0.00";
        this._playerControllerBottomTimeDivide.innerText = "/";
        this._playerControllerBottomTimeDuration.innerText = timeFormat(
          this.ctx.duration
        );
        this.change("loadeddata", e);
      };
      private onTimeupdate = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("timeupdate", e);
      };
      private onVolumechange = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("volumechange", e);
      };
      private onWaiting = (e: Event) => {
        this.ctx.currentState = e.type;
        this.change("waiting", e);
      };
      private onPlay = (e: Event) => {
        this.ctx.currentState = e.type;
        this.requestAnimationFrame(this.updateCurrentProgress);
        removeClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-play"
        );
        addClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-pause"
        );
        this.showControllerBar();
        this.change("play", e);
      };
      private onPlaying = (e: Event) => {
        this.ctx.currentState = e.type;
        this._playerBtn.style.setProperty("display", "none");
        removeClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-play"
        );
        addClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-pause"
        );
        this.requestAnimationFrame(this.updateCurrentProgress);
        this.showControllerBar();
        this.change("playing", e);
      };
      private onPause = (e: Event) => {
        this.ctx.currentState = e.type;
        this._playerBtn.style.setProperty("display", "block");
        this.change("pause", e);
        removeClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-pause"
        );
        addClassToElement(
          this._playerControllerBottomPlayBtn,
          "ran-player-controller-bottom-left-btn-play"
        );
        this.cancelAnimationFrame();
        this._playerController.style.setProperty("opacity", "1");
        if (this.controllerBarTimeId) {
          clearTimeout(this.controllerBarTimeId);
          this.controllerBarTimeId = undefined;
        }
      };
      private clearListenerEvent = () => {
        if (!this._video) return;
        this._video.removeEventListener("canplay", this.onCanplay);
        this._video.removeEventListener(
          "canplaythrough",
          this.onCanplaythrough
        );
        this._video.removeEventListener("complete", this.onComplete);
        this._video.removeEventListener(
          "durationchange",
          this.onDurationchange
        );
        this._video.removeEventListener("emptied", this.onEmptied);
        this._video.removeEventListener("ended", this.onEnded);
        this._video.removeEventListener("error", this.onError);
        this._video.removeEventListener("loadeddata", this.onLoadeddata);
        this._video.removeEventListener(
          "loadedmetadata",
          this.onLoadedmetadata
        );
        this._video.removeEventListener("loadstart", this.onLoadstart);
        this._video.removeEventListener("pause", this.onPause);
        this._video.removeEventListener("play", this.onPlay);
        this._video.removeEventListener("playing", this.onPlaying);
        this._video.removeEventListener("progress", this.onProgress);
        this._video.removeEventListener("ratechange", this.onRatechange);
        this._video.removeEventListener("seeked", this.onSeeked);
        this._video.removeEventListener("seeking", this.onSeeking);
        this._video.removeEventListener("stalled", this.onStalled);
        this._video.removeEventListener("suspend", this.onSuspend);
        this._video.removeEventListener("timeupdate", this.onTimeupdate);
        this._video.removeEventListener("volumechange", this.onVolumechange);
        this._video.removeEventListener("waiting", this.onWaiting);
      };
      /**
       * @description: 用户行为和 video 之间的交互
       * @return {*}
       */
      private listenEvent = () => {
        if (!this._video) return;
        this.clearListenerEvent();
        this._video.addEventListener("canplay", this.onCanplay);
        this._video.addEventListener("canplaythrough", this.onCanplaythrough);
        this._video.addEventListener("complete", this.onComplete);
        this._video.addEventListener("durationchange", this.onDurationchange);
        this._video.addEventListener("emptied", this.onEmptied);
        this._video.addEventListener("ended", this.onEnded);
        this._video.addEventListener("error", this.onError);
        this._video.addEventListener("loadeddata", this.onLoadeddata);
        this._video.addEventListener("loadedmetadata", this.onLoadedmetadata);
        this._video.addEventListener("loadstart", this.onLoadstart);
        this._video.addEventListener("pause", this.onPause);
        this._video.addEventListener("play", this.onPlay);
        this._video.addEventListener("playing", this.onPlaying);
        this._video.addEventListener("progress", this.onProgress);
        this._video.addEventListener("ratechange", this.onRatechange);
        this._video.addEventListener("seeked", this.onSeeked);
        this._video.addEventListener("seeking", this.onSeeking);
        this._video.addEventListener("stalled", this.onStalled);
        this._video.addEventListener("suspend", this.onSuspend);
        this._video.addEventListener("timeupdate", this.onTimeupdate);
        this._video.addEventListener("volumechange", this.onVolumechange);
        this._video.addEventListener("waiting", this.onWaiting);
      };
      private showControllerBar = (e?: MouseEvent): void => {
        if (e) {
          const dom = e.target as HTMLElement;
          if (dom.classList.value.includes("ran-player-controller")) {
            this._playerController.style.setProperty("opacity", "1");
            if (this.controllerBarTimeId) {
              clearTimeout(this.controllerBarTimeId);
              this.controllerBarTimeId = undefined;
            }
            return;
          }
        }
        if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
          this._playerController.style.setProperty("opacity", "1");
          if (this.controllerBarTimeId) {
            clearTimeout(this.controllerBarTimeId);
            this.controllerBarTimeId = undefined;
          }
          this.controllerBarTimeId = setTimeout(() => {
            this._playerController.style.setProperty("opacity", "0");
            clearTimeout(this.controllerBarTimeId);
            this.controllerBarTimeId = undefined;
          }, 2000);
        } else {
          this._playerController.style.setProperty("opacity", "1");
          if (this.controllerBarTimeId) {
            clearTimeout(this.controllerBarTimeId);
            this.controllerBarTimeId = undefined;
          }
        }
      };
      /**
       * @description: 进度条点击事件
       * @param {MouseEvent} e
       * @return {*}
       */
      private progressClick = (e: MouseEvent): void => {
        const rect = this._progressWrap.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = range(offsetX / this._progress.offsetWidth);
        this.setCurrentTIme(this.ctx.duration * percentage);
        this.updateCurrentProgress();
      };
      /**
       * @description: 进度条鼠标按下事件
       * @param {MouseEvent} e
       * @return {*}
       */
      private progressDotMouseDown = (e: MouseEvent): void => {
        this._playerBtn.style.setProperty("display", "none");
        this.moveProgress.mouseDown = true;
        this.cancelAnimationFrame();
      };
      /**
       * @description: 进度条鼠标移动事件
       * @param {MouseEvent} e
       * @return {*}
       */
      private progressDotMouseMove = (e: MouseEvent): void => {
        this.showControllerBar(e);
        if (!this.moveProgress.mouseDown) return;
        const rect = this._progress.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - 9;
        const percentage = range(offsetX / this._progress.offsetWidth);
        this._progressWrapValue.style.setProperty(
          "transform",
          `scaleX(${percentage})`
        );
        this._progressDot.style.setProperty(
          "transform",
          `translateX(${percentage * this._progress.offsetWidth}px)`
        );
        this.moveProgress.percentage = Math.floor(percentage * 100) / 100;
      };
      /**
       * @description: 进度条鼠标松开事件
       * @param {MouseEvent} e
       * @return {*}
       */
      private progressDotMouseUp = (e: MouseEvent): void => {
        if (!this.moveProgress.mouseDown) return;
        const percentage = this.moveProgress.percentage;
        this.setCurrentTIme(this.ctx.duration * percentage);
        this.play();
        this.moveProgress.mouseDown = false;
        this.requestAnimationFrame(this.updateCurrentProgress);
      };
      /**
       * @description: 更新页面样式
       * @param {Function} fn
       * @return {*}
       */
      private requestAnimationFrame = (fn: Function): void => {
        if (this.requestAnimationFrameId) return;
        this.requestAnimationFrameId = window.requestAnimationFrame(() => {
          fn();
          this.requestAnimationFrameId &&
            cancelAnimationFrame(this.requestAnimationFrameId);
          this.requestAnimationFrameId = undefined;
          this.requestAnimationFrame(fn);
        });
      };
      /**
       * @description: 取消页面动画
       * @param {Function} fn
       * @return {*}
       */
      private cancelAnimationFrame = (): void => {
        if (!this.requestAnimationFrameId) return;
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = undefined;
      };
      /**
       * @description: 更新进度条
       * @param {*} void
       * @return {*}
       */
      private updateCurrentProgress = (): void => {
        const currentTime = this.getCurrentTime();
        this.ctx.currentTime = currentTime;
        const { duration } = this.ctx;
        this._progressWrapValue.style.setProperty(
          "transform",
          `scaleX(${currentTime / duration})`
        );
        this._progressDot.style.setProperty(
          "transform",
          `translateX(${(currentTime / duration) * this._progress.offsetWidth
          }px)`
        );
        this._playerControllerBottomTimeCurrent.innerText = timeFormat(
          currentTime
        );
      };
      private changeAttribute = (
        k: string,
        o: string,
        n: string,
        attribute: string,
        callback: Function
      ) => {
        if (k === attribute && o !== n) throttle(callback)();
      };
      /**
       * @description: 点击整个视频时，触发的事件
       * @param {*} void
       * @return {*}
       */
      private dispatchClickPlayerContainerAction = (e: Event): void => {
        e.stopPropagation();
        e.preventDefault();
        if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
          this.pause();
          this._playerBtn.style.setProperty("display", "block");
        } else {
          this.play();
          this._playerBtn.style.setProperty("display", "none");
        }
      };
      /**
       * @description: 空格事件
       * @param {KeyboardEvent} e
       * @return {*}
       */
      private SpaceKeyDown = (e: KeyboardEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        const { currentTime, duration } = this.ctx;
        if (e.code === "Space") {
          this.dispatchClickPlayerBtnAction(e);
        }
        if (e.code === "Escape") {
          document
            .exitFullscreen()
            .then(() => {
              this.ctx.fullScreen = false;
            })
            .catch((error) => {
              console.log(`exit full screen error:${error}`);
            });
        }
        if (e.code === "ArrowLeft") {
          const time = range(currentTime - 5, 0, duration);
          this.setCurrentTIme(time);
          this.play();
        }
        if (e.code === "ArrowRight") {
          const time = range(currentTime + 5, 0, duration);
          this.setCurrentTIme(time);
          this.play();
        }
      };
      /**
       * @description: 点击player-btn，触发的事件
       * @param {*} void
       * @return {*}
       */
      private dispatchClickPlayerBtnAction = (e: Event): void => {
        e.stopPropagation();
        e.preventDefault();
        if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
          this.pause();
          this._playerBtn.style.setProperty("display", "block");
        } else {
          this.play();
          this._playerBtn.style.setProperty("display", "none");
        }
      };
      private changeSpeedProgress = (e: Event): void => {
        if (this._video) {
          this.setVolume((<CustomEvent>e).detail.value);
          this.change("volume", (<CustomEvent>e).detail.value);
          if ((<CustomEvent>e).detail.value > 0) {
            this._volume = (<CustomEvent>e).detail.value;
          }
        }
      };
      private openFullScreen = (): void => {
        if (!this.ctx.fullScreen) {
          this._player
            .requestFullscreen()
            .then(() => {
              this.ctx.fullScreen = true;
            })
            .catch((error) => {
              console.log(`full screen error:${error}`);
            });
        } else {
          document
            .exitFullscreen()
            .then(() => {
              this.ctx.fullScreen = false;
            })
            .catch((error) => {
              console.log(`exit full screen error:${error}`);
            });
        }
      };
      private changeSpeed = (e: CustomEvent): void => {
        this.change("speed", e.detail.value);
        this.setPlaybackRate(e.detail.value);
      };
      private progressMouseEnter = (e: MouseEvent): void => {
        this._playerTip.style.setProperty("opacity", "1");
        const rect = this._progress.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        if (this._playerTipText.innerText) {
          this._playerTip.style.setProperty(
            "transform",
            `translate(calc(${offsetX}px - 50%),-20px)`
          );
        } else {
          this._playerTip.style.setProperty(
            "transform",
            `translateX(calc(${offsetX}px - 50%))`
          );
        }
        this._playerTipTime.innerText = timeFormat(
          (offsetX / this._progress.clientWidth) * this.ctx.duration
        );
      };
      private progressMouseLeave = (e: MouseEvent): void => {
        if (
          (e.target as HTMLElement).classList.contains(
            "ran-player-controller-progress-wrap-dot"
          )
        ) {
          return;
        }
        this._playerTip.style.setProperty("opacity", "0");
      };
      private progressMouseMove = (e: MouseEvent): void => {
        const rect = this._progress.getBoundingClientRect();
        this._playerTip.style.setProperty("opacity", "1");
        const offsetX = e.clientX - rect.left;
        if (this._playerTipText.innerText) {
          this._playerTip.style.setProperty(
            "transform",
            `translate(calc(${offsetX}px - 50%),-20px)`
          );
        } else {
          this._playerTip.style.setProperty(
            "transform",
            `translateX(calc(${offsetX}px - 50%))`
          );
        }
        this._playerTipTime.innerText = timeFormat(
          (offsetX / this._progress.clientWidth) * this.ctx.duration
        );
      };
      private changePlayerVolume = (): void => {
        if (!this._video) return;
        const { volume } = this.ctx;
        if (volume > 0) {
          addClassToElement(
            this._playControllerBottomSpeedIcon,
            "ran-player-controller-bottom-right-volume-icon-mute"
          );
          removeClassToElement(
            this._playControllerBottomSpeedIcon,
            "ran-player-controller-bottom-right-volume-icon-volume"
          );
          this._playControllerBottomSpeedProgress.setAttribute("percent", "0");
          this.setVolume(0);
          this.change("volume", 0);
        } else {
          addClassToElement(
            this._playControllerBottomSpeedIcon,
            "ran-player-controller-bottom-right-volume-icon-volume"
          );
          removeClassToElement(
            this._playControllerBottomSpeedIcon,
            "ran-player-controller-bottom-right-volume-icon-mute"
          );
          this._playControllerBottomSpeedProgress.setAttribute(
            "percent",
            `${this._volume || 0.5}`
          );
          this.setVolume(0.5);
          this.change("volume", this._volume || 0.5);
        }
      };
      private resize = (): void => {
        if (this._video) {
          const { width, height } = this._player.getBoundingClientRect();
          this._video.style.setProperty("width", `${width}px`);
          this._video.style.setProperty("height", `${height}px`);
        }
        this.updateCurrentProgress();
      };
      private fullScreenChange = (): void => {
        if (document.fullscreenElement?.classList.contains("ran-player")) {
          this.change("fullscreen", true);
          this.ctx.fullScreen = true;
        } else {
          this.change("fullscreen", false);
          this.ctx.fullScreen = false;
        }
      };
      public getPlaybackRate = () => {
        if (this._video) {
          this.ctx.playbackRate = this._video.playbackRate || 0;
        }
        return this.ctx.playbackRate;
      };
      public setPlaybackRate = (n: number) => {
        if (this._video) {
          this.ctx.playbackRate = n;
          this._video.playbackRate = n;
        }
        return this.ctx.playbackRate;
      };
      public setVolume = (n: number) => {
        if (this._video) {
          this.ctx.volume = n;
          this._video.volume = n;
        }
        return this.ctx.volume;
      };
      public getVolume = () => {
        if (this._video) {
          this.ctx.volume = this._video.volume || 0;
        }
        return this.ctx.volume;
      };
      public setCurrentTIme = (n: number) => {
        if (this._video) {
          this.ctx.currentTime = n;
          this._video.currentTime = n;
        }
        return this.ctx.currentTime;
      };
      public getCurrentTime = (): number => {
        if (this._video) {
          this.ctx.currentTime = this._video.currentTime || 0;
        }
        return this.ctx.currentTime;
      };
      public getTotalTime = (): number => {
        if (this._video) {
          this.ctx.duration = this._video.duration || 0;
        }
        return this.ctx.duration;
      };
      public play = (n?: number): void => {
        if (this._video) {
          if (n !== undefined && n >= 0) {
            this.ctx.currentTime = n;
            this._video.currentTime = n;
          }
          this._video.play();
        }
      };
      public pause = () => {
        if (this._video) {
          this._video.pause();
        }
      };
      connectedCallback(): void {
        this._container.addEventListener(
          "click",
          this.dispatchClickPlayerContainerAction
        );
        this._playerBtn.addEventListener(
          "click",
          this.dispatchClickPlayerBtnAction
        );
        document.body.addEventListener("keydown", this.SpaceKeyDown);
        this._progressDot.addEventListener(
          "mousedown",
          this.progressDotMouseDown
        );
        this._playerControllerBottomPlayBtn.addEventListener(
          "click",
          this.dispatchClickPlayerBtnAction
        );
        this._progress.addEventListener("click", this.progressClick);
        this._progress.addEventListener("mouseenter", this.progressMouseEnter);
        this._progress.addEventListener("mousemove", this.progressMouseMove);
        this._progress.addEventListener("mouseleave", this.progressMouseLeave);
        this._player.addEventListener("mousemove", this.progressDotMouseMove);
        this._player.addEventListener("mouseup", this.progressDotMouseUp);
        this._playControllerBottomSpeedProgress.addEventListener(
          "change",
          this.changeSpeedProgress
        );
        this._playControllerBottomRightFullScreen.addEventListener(
          "click",
          this.openFullScreen
        );
        // this._playControllerBottomSpeedPopover.addEventListener('change', this.changeSpeed);
        this._playControllerBottomSpeedIcon.addEventListener(
          "click",
          this.changePlayerVolume
        );
        document.addEventListener("fullscreenchange", this.fullScreenChange);
        window.addEventListener("resize", this.resize);
        this.updatePlayer();
      }
      disconnectCallback(): void {
        this._container.removeEventListener(
          "click",
          this.dispatchClickPlayerContainerAction
        );
        this._playerBtn.removeEventListener(
          "click",
          this.dispatchClickPlayerBtnAction
        );
        this._playerControllerBottomPlayBtn.removeEventListener(
          "click",
          this.dispatchClickPlayerBtnAction
        );
        this.cancelAnimationFrame();
        document.removeEventListener("keydown", this.SpaceKeyDown);
        this._progress.removeEventListener("click", this.progressClick);
        this._progress.removeEventListener(
          "mouseenter",
          this.progressMouseEnter
        );
        this._progress.removeEventListener("mousemove", this.progressMouseMove);
        this._progress.removeEventListener(
          "mouseleave",
          this.progressMouseLeave
        );
        this._progressDot.removeEventListener(
          "mousedown",
          this.progressDotMouseDown
        );
        this._player.removeEventListener(
          "mousemove",
          this.progressDotMouseMove
        );
        this._player.removeEventListener("mouseup", this.progressDotMouseUp);
        this._playControllerBottomSpeedProgress.removeEventListener(
          "change",
          this.changeSpeedProgress
        );
        this._playControllerBottomRightFullScreen.removeEventListener(
          "click",
          this.openFullScreen
        );
        window.removeEventListener("resize", this.resize);
        document.removeEventListener("fullscreenchange", this.fullScreenChange);
      }
      attributeChangedCallback(k: string, o: string, n: string): void { }
    }
    customElements.define("r-player", RanPlayer);
    return RanPlayer;
  }
}

export default Custom();
