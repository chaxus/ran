/* eslint-disable n/no-unsupported-features/node-builtins */
import {
  SyncHook,
  addClassToElement,
  createDocumentFragment,
  generateThrottle,
  range,
  removeClassToElement,
  timeFormat,
} from 'ranuts/utils';
import '@/assets/js/hls.js';
import type { Progress } from '@/components/progress';
import '@/components/select';
import { HTMLElementSSR } from '@/utils/index';
import './index.less';

const PLAY_STATE_LIST = ['play', 'playing', 'timeupdate'];

const throttle = generateThrottle();

type Callback = (...args: unknown[]) => unknown;
type EventName = string | symbol;
type EventItem = {
  name?: string | symbol;
  callback: Callback;
  initialCallback?: Callback;
};

export declare class SHook {
  private _events;
  constructor();
  tap: (eventName: EventName, eventItem: EventItem | Callback) => void;
  call: (eventName: EventName, ...args: Array<unknown>) => void;
  callSync: (eventName: EventName, ...args: Array<unknown>) => Promise<void>;
  once: (eventName: EventName, eventItem: EventItem | Callback) => void;
  off: (eventName: EventName, eventItem: EventItem | Callback) => void;
}

export interface HlsPlayer {
  startLoad(): () => void;
  off: (s: string, f: Function) => void;
  on: (s: string, f: Function) => void;
  loadSource: (s: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  destroy: () => void;
}

export interface Level {
  audioCodec: string;
  bitrate: number;
  height: number;
  width: number;
  name: string;
  url: string;
  videoCodec: string;
}

export interface Context {
  action: SHook;
  currentState: string;
  duration: number;
  currentTime: number;
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
  levels: Partial<Level>[];
  url: string;
  levelMap: Map<string, string>;
  clarity: string;
}

interface Hls {
  Events: {
    MANIFEST_LOADED: 'hlsManifestLoaded';
    ERROR: 'error';
  };
  isSupported: () => boolean;
}

type HLS = Hls & (new () => HlsPlayer);

declare global {
  interface Window {
    Hls: HLS;
  }
}

const SPEED = [
  { label: '2.0X', value: 2.0 },
  { label: '1.5X', value: 1.5 },
  { label: '1.0X', value: 1 },
  { label: '0.8X', value: 0.8 },
  { label: '0.5X', value: 0.5 },
];

export class RanPlayer extends (HTMLElementSSR()!) {
  public ctx: Context;
  _player: HTMLDivElement;
  _container: HTMLDivElement;
  _slot: HTMLSlotElement;
  _playerController: HTMLDivElement;
  _playerBtn: HTMLDivElement;
  _progress: HTMLDivElement;
  _progressDot: HTMLDivElement;
  _progressWrap: HTMLDivElement;
  _progressWrapValue: HTMLDivElement;
  requestAnimationFrameId?: number;
  moveProgress: { percentage: number; mouseDown: boolean };
  _playerControllerBottom: HTMLDivElement;
  _playerControllerBottomRight: HTMLDivElement;
  _playerControllerBottomLeft: HTMLDivElement;
  _playerControllerBottomPlayBtn: HTMLDivElement;
  _playerControllerBottomTimeCurrent: HTMLDivElement;
  _playerControllerBottomTimeDuration: HTMLDivElement;
  _playerControllerBottomTimeDivide: HTMLDivElement;
  _playControllerBottomClarity: HTMLElement;
  _playControllerBottomSpeed: HTMLDivElement;
  _playControllerBottomSpeedIcon: HTMLDivElement;
  _playControllerBottomVolumeProgress: Progress;
  _playControllerBottomRightFullScreen: HTMLDivElement;
  _playControllerBottomVolume: HTMLDivElement;
  _playControllerBottomSpeedPopover: HTMLElement;
  controllerBarTimeId?: NodeJS.Timeout;
  _playerTip: HTMLDivElement;
  _playerTipTime: HTMLDivElement;
  _playerTipText: HTMLDivElement;
  _volume?: number;
  _video?: HTMLVideoElement;
  _hls?: HlsPlayer;
  static get observedAttributes(): string[] {
    return ['src', 'volume', 'currentTime', 'playbackRate', 'debug'];
  }
  /**
   * @description: 初始化 view 和 video 的全局上下文
   * @return {*}
   */
  constructor() {
    super();
    // 如果有子元素，进行置空
    this.innerHTML = '';
    this._player = document.createElement('div');
    this._container = document.createElement('div');
    this._slot = document.createElement('slot');
    this._playerBtn = document.createElement('div');
    this._progress = document.createElement('div');
    this._progressWrap = document.createElement('div');
    this._progressWrapValue = document.createElement('div');
    this._progressDot = document.createElement('div');
    this._playerControllerBottom = document.createElement('div');
    this._playerControllerBottomRight = document.createElement('div');
    this._playerControllerBottomLeft = document.createElement('div');
    this._player.setAttribute('class', 'ran-player');
    this._player.setAttribute('id', 'ran-player' + `${performance.now()}`.replace('.', ''));
    // play and pause
    this._playerBtn.setAttribute('class', 'ran-player-play-btn');
    // progress
    this._progress.setAttribute('class', 'ran-player-controller-progress');
    this._progressWrap.setAttribute('class', 'ran-player-controller-progress-wrap');
    this._progressWrapValue.setAttribute('class', 'ran-player-controller-progress-wrap-value');
    this._progressDot.setAttribute('class', 'ran-player-controller-progress-dot');
    // play and pause btn, current / total time
    this._playerControllerBottom.setAttribute('class', 'ran-player-controller-bottom');
    this._playerControllerBottomRight.setAttribute('class', 'ran-player-controller-bottom-right');
    this._playerControllerBottomLeft.setAttribute('class', 'ran-player-controller-bottom-left');
    this._playerControllerBottomPlayBtn = document.createElement('div');
    this._playerControllerBottomPlayBtn.setAttribute('class', 'ran-player-controller-bottom-left-btn');
    this._playerControllerBottomTimeCurrent = document.createElement('div');
    this._playerControllerBottomTimeCurrent.setAttribute('class', 'ran-player-controller-bottom-left-time-current');
    this._playerControllerBottomTimeDivide = document.createElement('div');
    this._playerControllerBottomTimeDivide.setAttribute('class', 'ran-player-controller-bottom-left-time-divide');
    this._playerControllerBottomTimeDuration = document.createElement('div');
    this._playerControllerBottomTimeDuration.setAttribute('class', 'ran-player-controller-bottom-left-time-duration');
    // speed
    this._playControllerBottomSpeed = document.createElement('div');
    this._playControllerBottomSpeed.setAttribute('class', 'ran-player-controller-bottom-right-speed');
    this._playControllerBottomSpeedPopover = document.createElement('r-select');
    this._playControllerBottomSpeedPopover.setAttribute('value', '1');
    this._playControllerBottomSpeedPopover.setAttribute('trigger', 'hover,click');
    this._playControllerBottomSpeedPopover.setAttribute('type', 'text');
    this._playControllerBottomSpeedPopover.setAttribute('placement', 'top');
    const id = this._player.getAttribute('id');
    id && this._playControllerBottomSpeedPopover.setAttribute('getPopupContainerId', id);
    this._playControllerBottomSpeedPopover.setAttribute('dropdownclass', 'video-speed-dropdown');
    this._playControllerBottomSpeedPopover.addEventListener('change', this.changeSpeed);
    const Fragment = document.createDocumentFragment();
    SPEED.forEach((item) => {
      const { label, value } = item;
      const option = document.createElement('r-option');
      option.innerHTML = label;
      option.setAttribute('value', `${value}`);
      Fragment.appendChild(option);
    });
    this._playControllerBottomSpeedPopover.appendChild(Fragment);
    this._playControllerBottomSpeed.appendChild(this._playControllerBottomSpeedPopover);
    // volume
    this._playControllerBottomVolume = document.createElement('div');
    this._playControllerBottomVolume.setAttribute('class', 'ran-player-controller-bottom-right-volume');
    this._playControllerBottomVolumeProgress = document.createElement('r-progress') as Progress;
    this._playControllerBottomVolumeProgress.setAttribute(
      'class',
      'ran-player-controller-bottom-right-volume-progress',
    );
    this._playControllerBottomVolumeProgress.setAttribute('percent', '0.5');
    this._playControllerBottomVolumeProgress.setAttribute('type', 'drag');
    this._playControllerBottomSpeedIcon = document.createElement('div');
    this._playControllerBottomSpeedIcon.setAttribute(
      'class',
      'ran-player-controller-bottom-right-volume-icon ran-player-controller-bottom-right-volume-icon-volume',
    );
    // clarity
    this._playControllerBottomClarity = document.createElement('div');
    this._playControllerBottomClarity.setAttribute('class', 'ran-player-controller-bottom-right-clarity');
    // fullscreen
    this._playControllerBottomRightFullScreen = document.createElement('div');
    this._playControllerBottomRightFullScreen.setAttribute('class', 'ran-player-controller-bottom-right-full');
    // controller
    this._playerController = document.createElement('div');
    this._playerController.setAttribute('class', 'ran-player-controller');
    this._playerTip = document.createElement('div');
    this._playerTip.setAttribute('class', 'ran-player-controller-tip');
    this._playerTipTime = document.createElement('div');
    this._playerTipTime.setAttribute('class', 'ran-player-controller-tip-time');
    this._playerTipText = document.createElement('div');
    this._playerTipText.setAttribute('class', 'ran-player-controller-tip-text');
    this._playerTip.appendChild(createDocumentFragment([this._playerTipTime, this._playerTipText])!);
    this._playerController.appendChild(
      createDocumentFragment([this._playerTip, this._progress, this._playerControllerBottom])!,
    );
    // container
    this._player.appendChild(
      createDocumentFragment([this._container, this._slot, this._playerBtn, this._playerController])!,
    );
    this._progressWrap.appendChild(this._progressWrapValue);
    this._progress.appendChild(createDocumentFragment([this._progressWrap, this._progressDot])!);
    this._playerControllerBottom.appendChild(
      createDocumentFragment([this._playerControllerBottomLeft, this._playerControllerBottomRight])!,
    );
    this._playerControllerBottomLeft.appendChild(
      createDocumentFragment([
        this._playerControllerBottomPlayBtn,
        this._playerControllerBottomTimeCurrent,
        this._playerControllerBottomTimeDivide,
        this._playerControllerBottomTimeDuration,
      ])!,
    );
    this._playControllerBottomVolume.appendChild(
      createDocumentFragment([this._playControllerBottomSpeedIcon, this._playControllerBottomVolumeProgress])!,
    );
    this._playerControllerBottomRight.appendChild(
      createDocumentFragment([
        this._playControllerBottomClarity,
        this._playControllerBottomSpeed,
        this._playControllerBottomVolume,
        this._playControllerBottomRightFullScreen,
      ])!,
    );
    // ctx
    this.ctx = {
      currentTime: 0, // 当前时间
      duration: 0, // 总时长
      currentState: '', // 当前视频状态
      action: new SyncHook(), // 不同时期触发的状态
      volume: 0.5, // 当前音量
      playbackRate: 1, // 当前倍速
      clarity: '', // 当前清晰度
      fullScreen: false, // 是否全屏
      levels: [], // 清晰度列表
      url: '', // 当前播放的地址
      levelMap: new Map(), // 清晰度和名字的映射关系
    };
    this.moveProgress = {
      percentage: 0,
      mouseDown: false,
    };
  }
  get src(): string {
    return this.getAttribute('src') || '';
  }
  set src(value: string) {
    this.setAttribute('src', value || '');
  }
  get debug(): string {
    return this.getAttribute('debug') || '';
  }
  set debug(value: string) {
    this.setAttribute('debug', value || '');
  }
  get volume(): string {
    return this.getAttribute('volume') || '';
  }
  set volume(value: string) {
    this.setAttribute('volume', value || '');
  }
  get currentTime(): string {
    return this.getAttribute('currentTime') || '';
  }
  set currentTime(value: string) {
    this.setAttribute('currentTime', value || '');
  }
  get playbackRate(): string {
    return this.getAttribute('playbackRate') || '';
  }
  set playbackRate(value: string) {
    this.setAttribute('playbackRate', value || '');
  }
  changeClarityToSetVideo = (): void => {
    const { currentTime, playbackRate, volume, currentState } = this.ctx;
    this.setCurrentTime(currentTime);
    this.setPlaybackRate(playbackRate);
    this.setVolume(volume);
    if (PLAY_STATE_LIST.includes(currentState)) {
      this.play();
    } else {
      this.pause();
    }
  };
  changeClarity = (e: Event): void => {
    this.ctx.clarity = (e as CustomEvent).detail.value;
    const url = this.ctx.levelMap.get((e as CustomEvent).detail.value);
    if (url && this._hls) {
      this._hls.loadSource(url);
      this._hls.startLoad();
      this.changeClarityToSetVideo();
    }
  };
  createClaritySelect = (): void => {
    const { levels } = this.ctx;
    this._playControllerBottomClarity.innerHTML = '';
    if (levels.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    levels.forEach((item) => {
      const { name, url } = item;
      if (!name || !url) return;
      this.ctx.levelMap.set(name, url);
      const option = document.createElement('r-option');
      option.setAttribute('value', name);
      option.innerHTML = name;
      Fragment.appendChild(option);
    });
    const select = document.createElement('r-select');
    select.setAttribute('value', this.ctx.clarity || 'Auto');
    select.appendChild(Fragment);
    select.setAttribute('type', 'text');
    select.setAttribute('trigger', 'hover,click');
    select.setAttribute('placement', 'top');
    const id = this._player.getAttribute('id');
    id && select.setAttribute('getPopupContainerId', id);
    select.setAttribute('dropdownclass', 'video-clarity-dropdown');
    select.addEventListener('change', this.changeClarity);
    this._playControllerBottomClarity.appendChild(select);
  };
  manifestLoaded = (type: string, data: { levels: Level[]; url: string }): void => {
    if (type === 'hlsManifestLoaded') {
      const { url, levels = [] } = data;
      if (levels.length <= 0) return;
      levels.forEach((item) => {
        if (this.ctx.levelMap.get(item.name) === item.url) return;
        this.ctx.levels.push(item);
      });
      if (!this.ctx.levelMap.get('Auto')) {
        this.ctx.levels.push({ name: 'Auto', url });
        this.ctx.levelMap.set('Auto', url);
      }
      this.ctx.url = url;
      this.createClaritySelect();
      this.change('hlsManifestLoaded', { data });
    }
  };
  /**
   * @description: 初始化 video 和更新 video 方法
   * @return {*}
   */
  updatePlayer = (): void => {
    const Hls = window.Hls;
    // 如果有子元素，进行置空
    this.innerHTML = '';
    if (!this.contains(this._player)) this.appendChild(this._player);
    if (this._hls) {
      this._hls.destroy();
      this._hls = undefined;
    }
    this._video = document.createElement('video');
    this._video.setAttribute('class', 'ran-player-video');
    this._video.setAttribute('preload', 'auto');
    this._video.setAttribute('x5-video-player-type', 'h5');
    this._video.setAttribute('x5-video-orientation', 'portrait');
    this._video.setAttribute('webkit-playsinline', 'true');
    this._video.setAttribute('playsinline', 'true');
    this._video.setAttribute('controls', 'false');
    this._video.controls = false;
    this._video.setAttribute('initial-time', '0.01');
    try {
      if (this._video.canPlayType('application/vnd.apple.mpegurl') && this.src) {
        this._video.src = this.src;
      } else if (Hls?.isSupported() && this.src) {
        this._hls = new Hls();
        if (this._hls) {
          this._hls.off(Hls.Events.MANIFEST_LOADED, this.manifestLoaded);
          this._hls.on(Hls.Events.MANIFEST_LOADED, this.manifestLoaded);
          this._hls.off(Hls.Events.ERROR, this.hlsError);
          this._hls.on(Hls.Events.ERROR, this.hlsError);
          this._hls.loadSource(this.src);
          this._hls.attachMedia(this._video);
        }
        this._container.appendChild(this._video);
        this._video.parentElement?.setAttribute('class', 'ran-player-contain');
      }
      this.listenEvent();
    } catch (error) {
      console.log('r-player update player error:', error);
    }
  };
  hlsError = (event: unknown, data: unknown): void => {
    this.change('hlsError', { event, data });
    if (this._video) {
      this._video.src = this.src;
    }
  };
  change = (name: string, value: unknown): void => {
    const currentTime = this.getCurrentTime();
    const duration = this.getTotalTime();
    this.debug && console.log(name, value);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          type: name,
          data: value,
          currentTime,
          duration,
          tag: this,
        },
      }),
    );
  };
  onCanplay = (e: Event): void => {
    this.ctx.currentState = e.type;
    removeClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-pause');
    addClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-play');
    this.change('canplay', e);
    this.resize();
  };
  onCanplaythrough = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('canplaythrough', e);
  };
  onComplete = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('complete', e);
  };
  onDurationchange = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('durationchange', e);
  };
  onEmptied = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('emptied', e);
  };
  onEnded = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('ended', e);
  };
  onError = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('error', e);
  };
  onLoadedmetadata = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('loadedmetadata', e);
  };
  onLoadstart = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('loadstart', e);
  };
  onProgress = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('progress', e);
  };
  onRatechange = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('ratechange', e);
  };
  onSeeked = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('seeked', e);
  };
  onSeeking = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('seeking', e);
  };
  onStalled = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('stalled', e);
  };
  onSuspend = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('suspend', e);
  };
  onLoadeddata = (e: Event): void => {
    this.ctx.currentState = e.type;
    const duration = this.getTotalTime();
    this.ctx.duration = duration;
    this._playerControllerBottomTimeCurrent.innerText = '00:00';
    this._playerControllerBottomTimeDivide.innerText = '/';
    this._playerControllerBottomTimeDuration.innerText = timeFormat(this.ctx.duration);
    this.change('loadeddata', e);
  };
  onTimeupdate = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('timeupdate', e);
  };
  onVolumechange = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('volumechange', e);
  };
  onWaiting = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('waiting', e);
  };
  onPlay = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.requestAnimationFrame(this.updateCurrentProgress);
    removeClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-play');
    addClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-pause');
    this.showControllerBar();
    this.change('play', e);
  };
  onPlaying = (e: Event): void => {
    this.ctx.currentState = e.type;
    this._playerBtn.style.setProperty('display', 'none');
    removeClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-play');
    addClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-pause');
    this.requestAnimationFrame(this.updateCurrentProgress);
    this.showControllerBar();
    this.change('playing', e);
  };
  onPause = (e: Event): void => {
    this.ctx.currentState = e.type;
    this._playerBtn.style.setProperty('display', 'block');
    this.change('pause', e);
    removeClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-pause');
    addClassToElement(this._playerControllerBottomPlayBtn, 'ran-player-controller-bottom-left-btn-play');
    this.cancelAnimationFrame();
    this._playerController.style.setProperty('opacity', '1');
    if (this.controllerBarTimeId) {
      clearTimeout(this.controllerBarTimeId);
      this.controllerBarTimeId = undefined;
    }
  };
  clearListenerEvent = (): void => {
    if (!this._video) return;
    this._video.removeEventListener('canplay', this.onCanplay);
    this._video.removeEventListener('canplaythrough', this.onCanplaythrough);
    this._video.removeEventListener('complete', this.onComplete);
    this._video.removeEventListener('durationchange', this.onDurationchange);
    this._video.removeEventListener('emptied', this.onEmptied);
    this._video.removeEventListener('ended', this.onEnded);
    this._video.removeEventListener('error', this.onError);
    this._video.removeEventListener('loadeddata', this.onLoadeddata);
    this._video.removeEventListener('loadedmetadata', this.onLoadedmetadata);
    this._video.removeEventListener('loadstart', this.onLoadstart);
    this._video.removeEventListener('pause', this.onPause);
    this._video.removeEventListener('play', this.onPlay);
    this._video.removeEventListener('playing', this.onPlaying);
    this._video.removeEventListener('progress', this.onProgress);
    this._video.removeEventListener('ratechange', this.onRatechange);
    this._video.removeEventListener('seeked', this.onSeeked);
    this._video.removeEventListener('seeking', this.onSeeking);
    this._video.removeEventListener('stalled', this.onStalled);
    this._video.removeEventListener('suspend', this.onSuspend);
    this._video.removeEventListener('timeupdate', this.onTimeupdate);
    this._video.removeEventListener('volumechange', this.onVolumechange);
    this._video.removeEventListener('waiting', this.onWaiting);
  };
  /**
   * @description: 用户行为和 video 之间的交互
   * @return {*}
   */
  listenEvent = (): void => {
    if (!this._video) return;
    this.clearListenerEvent();
    this._video.addEventListener('canplay', this.onCanplay);
    this._video.addEventListener('canplaythrough', this.onCanplaythrough);
    this._video.addEventListener('complete', this.onComplete);
    this._video.addEventListener('durationchange', this.onDurationchange);
    this._video.addEventListener('emptied', this.onEmptied);
    this._video.addEventListener('ended', this.onEnded);
    this._video.addEventListener('error', this.onError);
    this._video.addEventListener('loadeddata', this.onLoadeddata);
    this._video.addEventListener('loadedmetadata', this.onLoadedmetadata);
    this._video.addEventListener('loadstart', this.onLoadstart);
    this._video.addEventListener('pause', this.onPause);
    this._video.addEventListener('play', this.onPlay);
    this._video.addEventListener('playing', this.onPlaying);
    this._video.addEventListener('progress', this.onProgress);
    this._video.addEventListener('ratechange', this.onRatechange);
    this._video.addEventListener('seeked', this.onSeeked);
    this._video.addEventListener('seeking', this.onSeeking);
    this._video.addEventListener('stalled', this.onStalled);
    this._video.addEventListener('suspend', this.onSuspend);
    this._video.addEventListener('timeupdate', this.onTimeupdate);
    this._video.addEventListener('volumechange', this.onVolumechange);
    this._video.addEventListener('waiting', this.onWaiting);
  };
  showControllerBar = (e?: MouseEvent): void => {
    if (e) {
      const dom = e.target as HTMLElement;
      if (dom.classList.value.includes('ran-player-controller')) {
        this._playerController.style.setProperty('opacity', '1');
        if (this.controllerBarTimeId) {
          clearTimeout(this.controllerBarTimeId);
          this.controllerBarTimeId = undefined;
        }
        return;
      }
    }
    if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
      this._playerController.style.setProperty('opacity', '1');
      if (this.controllerBarTimeId) {
        clearTimeout(this.controllerBarTimeId);
        this.controllerBarTimeId = undefined;
      }
      this.controllerBarTimeId = setTimeout(() => {
        this._playerController.style.setProperty('opacity', '0');
        clearTimeout(this.controllerBarTimeId);
        this.controllerBarTimeId = undefined;
      }, 2000);
    } else {
      this._playerController.style.setProperty('opacity', '1');
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
  progressClick = (e: MouseEvent): void => {
    const rect = this._progressWrap.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = range(offsetX / this._progress.offsetWidth);
    this.setCurrentTime(this.ctx.duration * percentage);
    this.updateCurrentProgress();
  };
  /**
   * @description: 进度条鼠标按下事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseDown = (): void => {
    this._playerBtn.style.setProperty('display', 'none');
    this.moveProgress.mouseDown = true;
    this.cancelAnimationFrame();
  };
  /**
   * @description: 进度条鼠标移动事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseMove = (e: MouseEvent): void => {
    this.showControllerBar(e);
    if (!this.moveProgress.mouseDown) return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - 9;
    const percentage = range(offsetX / this._progress.offsetWidth);
    this._progressWrapValue.style.setProperty('transform', `scaleX(${percentage})`);
    this._progressDot.style.setProperty('transform', `translateX(${percentage * this._progress.offsetWidth}px)`);
    this.moveProgress.percentage = Math.floor(percentage * 100) / 100;
  };
  /**
   * @description: 进度条鼠标松开事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseUp = (): void => {
    if (!this.moveProgress.mouseDown) return;
    const percentage = this.moveProgress.percentage;
    this.setCurrentTime(this.ctx.duration * percentage);
    this.play();
    this.moveProgress.mouseDown = false;
    this.requestAnimationFrame(this.updateCurrentProgress);
  };
  /**
   * @description: 更新页面样式
   * @param {Function} fn
   * @return {*}
   */
  requestAnimationFrame = (fn: Function): void => {
    if (this.requestAnimationFrameId) return;
    this.requestAnimationFrameId = window.requestAnimationFrame(() => {
      fn();
      this.requestAnimationFrameId && cancelAnimationFrame(this.requestAnimationFrameId);
      this.requestAnimationFrameId = undefined;
      this.requestAnimationFrame(fn);
    });
  };
  /**
   * @description: 取消页面动画
   * @param {Function} fn
   * @return {*}
   */
  cancelAnimationFrame = (): void => {
    if (!this.requestAnimationFrameId) return;
    cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = undefined;
  };
  /**
   * @description: 更新进度条
   * @param {*} void
   * @return {*}
   */
  updateCurrentProgress = (): void => {
    const currentTime = this.getCurrentTime();
    this.ctx.currentTime = currentTime;
    const { duration } = this.ctx;
    this._progressWrapValue.style.setProperty('transform', `scaleX(${currentTime / duration})`);
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${(currentTime / duration) * this._progress.offsetWidth}px)`,
    );
    if (currentTime >= 0) {
      this._playerControllerBottomTimeCurrent.innerText = timeFormat(currentTime);
    }
  };
  changeAttribute = (k: string, o: string, n: string, attribute: string, callback: Function): void => {
    if (k === attribute && o !== n) throttle(callback)();
  };
  /**
   * @description: 点击整个视频时，触发的事件
   * @param {*} void
   * @return {*}
   */
  dispatchClickPlayerContainerAction = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
      this.pause();
      this._playerBtn.style.setProperty('display', 'block');
    } else {
      this.play();
      this._playerBtn.style.setProperty('display', 'none');
    }
  };
  /**
   * @description: 空格事件
   * @param {KeyboardEvent} e
   * @return {*}
   */
  SpaceKeyDown = (e: KeyboardEvent): void => {
    const { currentTime, duration } = this.ctx;
    if (e.code === 'Space') {
      this.dispatchClickPlayerBtnAction(e);
    }
    if (e.code === 'Escape') {
      this.customExitFullscreen()
        .then(() => {
          this.ctx.fullScreen = false;
        })
        .catch((error) => {
          console.log(`exit full screen error:${error}`);
        });
    }
    if (e.code === 'ArrowLeft') {
      const time = range(currentTime - 5, 0, duration);
      this.setCurrentTime(time);
      this.play();
    }
    if (e.code === 'ArrowRight') {
      const time = range(currentTime + 5, 0, duration);
      this.setCurrentTime(time);
      this.play();
    }
  };
  /**
   * @description: 点击 player-btn，触发的事件
   * @param {*} void
   * @return {*}
   */
  dispatchClickPlayerBtnAction = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    if (PLAY_STATE_LIST.includes(this.ctx.currentState)) {
      this.pause();
      this._playerBtn.style.setProperty('display', 'block');
    } else {
      this.play();
      this._playerBtn.style.setProperty('display', 'none');
    }
  };
  changeVolumeProgress = (e: Event): void => {
    if (this._video) {
      this.setVolume((e as CustomEvent).detail.value);
      this.change('volume', (e as CustomEvent).detail.value);
      if ((e as CustomEvent).detail.value > 0) {
        this._volume = (e as CustomEvent).detail.value;
      }
    }
  };
  customRequestFullscreen = (): Promise<void> => {
    return (
      this._player.requestFullscreen() ||
      this._player.mozRequestFullScreen() ||
      this._player.msRequestFullscreen() ||
      this._player.oRequestFullscreen() ||
      this._player.webkitRequestFullscreen() ||
      this._player.webkitEnterFullscreen()
    );
  };
  customExitFullscreen = (): Promise<void> => {
    return (
      document.exitFullscreen() ||
      document.msExitFullscreen() ||
      document.mozCancelFullScreen() ||
      document.oCancelFullScreen() ||
      document.webkitExitFullscreen()
    );
  };
  openFullScreen = (): void => {
    if (!this.ctx.fullScreen) {
      this.customRequestFullscreen()
        .then(() => {
          this.resize();
          this.ctx.fullScreen = true;
        })
        .catch((error) => {
          console.log(`full screen error:${error}`);
        });
    } else {
      this.customExitFullscreen()
        .then(() => {
          this.resize();
          this.ctx.fullScreen = false;
        })
        .catch((error) => {
          console.log(`exit full screen error:${error}`);
        });
    }
  };
  changeSpeed = (e: Event): void => {
    this.change('speed', (e as CustomEvent).detail.value);
    this.setPlaybackRate((e as CustomEvent).detail.value);
  };
  progressMouseEnter = (e: MouseEvent): void => {
    this._playerTip.style.setProperty('opacity', '1');
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    if (this._playerTipText.innerText) {
      this._playerTip.style.setProperty('transform', `translate(calc(${offsetX}px - 50%),-20px)`);
    } else {
      this._playerTip.style.setProperty('transform', `translateX(calc(${offsetX}px - 50%))`);
    }
    this._playerTipTime.innerText = timeFormat((offsetX / this._progress.clientWidth) * this.ctx.duration);
  };
  progressMouseLeave = (e: MouseEvent): void => {
    if ((e.target as HTMLElement).classList.contains('ran-player-controller-progress-wrap-dot')) {
      return;
    }
    this._playerTip.style.setProperty('opacity', '0');
  };
  progressMouseMove = (e: MouseEvent): void => {
    const rect = this._progress.getBoundingClientRect();
    this._playerTip.style.setProperty('opacity', '1');
    const offsetX = e.clientX - rect.left;
    if (this._playerTipText.innerText) {
      this._playerTip.style.setProperty('transform', `translate(calc(${offsetX}px - 50%),-20px)`);
    } else {
      this._playerTip.style.setProperty('transform', `translateX(calc(${offsetX}px - 50%))`);
    }
    this._playerTipTime.innerText = timeFormat((offsetX / this._progress.clientWidth) * this.ctx.duration);
  };
  changePlayerVolume = (): void => {
    if (!this._video) return;
    const { volume } = this.ctx;
    if (volume > 0) {
      addClassToElement(this._playControllerBottomSpeedIcon, 'ran-player-controller-bottom-right-volume-icon-mute');
      removeClassToElement(
        this._playControllerBottomSpeedIcon,
        'ran-player-controller-bottom-right-volume-icon-volume',
      );
      this._playControllerBottomVolumeProgress.setAttribute('percent', '0');
      this.setVolume(0);
      this.change('volume', 0);
    } else {
      addClassToElement(this._playControllerBottomSpeedIcon, 'ran-player-controller-bottom-right-volume-icon-volume');
      removeClassToElement(this._playControllerBottomSpeedIcon, 'ran-player-controller-bottom-right-volume-icon-mute');
      this._playControllerBottomVolumeProgress.setAttribute('percent', `${this._volume || 0.5}`);
      this.setVolume(0.5);
      this.change('volume', this._volume || 0.5);
    }
  };
  resize = (): void => {
    if (this._video) {
      const { width, height } = this._player.getBoundingClientRect();
      this._video.style.setProperty('width', `${width}px`);
      this._video.style.setProperty('height', `${height}px`);
      if (document.body.clientWidth < 500) {
        this._playControllerBottomVolume.style.setProperty('display', 'none');
      } else {
        this._playControllerBottomVolume.style.setProperty('display', 'flex');
      }
    }
    this.updateCurrentProgress();
  };
  fullScreenChange = (): void => {
    if (document.fullscreenElement?.classList.contains('ran-player')) {
      this.change('fullscreen', true);
      this.ctx.fullScreen = true;
    } else {
      this.change('fullscreen', false);
      this.ctx.fullScreen = false;
    }
  };
  public getPlaybackRate = (): number => {
    if (this._video) {
      this.ctx.playbackRate = this._video.playbackRate || 0;
    }
    return this.ctx.playbackRate;
  };
  public setPlaybackRate = (n: number): number => {
    if (this._video) {
      this.ctx.playbackRate = n;
      this._video.playbackRate = n;
    }
    return this.ctx.playbackRate;
  };
  public setVolume = (n: number): number => {
    if (this._video) {
      this.ctx.volume = n;
      this._video.volume = n;
    }
    return this.ctx.volume;
  };
  public getVolume = (): number => {
    if (this._video) {
      this.ctx.volume = this._video.volume || 0;
    }
    return this.ctx.volume;
  };
  public setCurrentTime = (n: number): number => {
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
  public pause = (): void => {
    if (this._video) {
      this._video.pause();
    }
  };
  connectedCallback(): void {
    this._container.addEventListener('click', this.dispatchClickPlayerContainerAction);
    this._playerBtn.addEventListener('click', this.dispatchClickPlayerBtnAction);
    this.addEventListener('keydown', this.SpaceKeyDown);
    this._progressDot.addEventListener('mousedown', this.progressDotMouseDown);
    this._playerControllerBottomPlayBtn.addEventListener('click', this.dispatchClickPlayerBtnAction);
    this._progress.addEventListener('click', this.progressClick);
    this._progress.addEventListener('mouseenter', this.progressMouseEnter);
    this._progress.addEventListener('mousemove', this.progressMouseMove);
    this._progress.addEventListener('mouseleave', this.progressMouseLeave);
    this._player.addEventListener('mousemove', this.progressDotMouseMove);
    this._player.addEventListener('mouseup', this.progressDotMouseUp);
    this._playControllerBottomVolumeProgress.addEventListener('change', this.changeVolumeProgress);
    this._playControllerBottomRightFullScreen.addEventListener('click', this.openFullScreen);
    this._playControllerBottomSpeedIcon.addEventListener('click', this.changePlayerVolume);
    document.addEventListener('fullscreenchange', this.fullScreenChange);
    window.addEventListener('resize', this.resize);
    this.updatePlayer();
  }
  disconnectCallback(): void {
    this._container.removeEventListener('click', this.dispatchClickPlayerContainerAction);
    this._playerBtn.removeEventListener('click', this.dispatchClickPlayerBtnAction);
    this._playerControllerBottomPlayBtn.removeEventListener('click', this.dispatchClickPlayerBtnAction);
    this.cancelAnimationFrame();
    this.removeEventListener('keydown', this.SpaceKeyDown);
    this._progress.removeEventListener('click', this.progressClick);
    this._progress.removeEventListener('mouseenter', this.progressMouseEnter);
    this._progress.removeEventListener('mousemove', this.progressMouseMove);
    this._progress.removeEventListener('mouseleave', this.progressMouseLeave);
    this._progressDot.removeEventListener('mousedown', this.progressDotMouseDown);
    this._player.removeEventListener('mousemove', this.progressDotMouseMove);
    this._player.removeEventListener('mouseup', this.progressDotMouseUp);
    this._playControllerBottomVolumeProgress.removeEventListener('change', this.changeVolumeProgress);
    this._playControllerBottomRightFullScreen.removeEventListener('click', this.openFullScreen);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('fullscreenchange', this.fullScreenChange);
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-player')) {
    customElements.define('r-player', RanPlayer);
    return RanPlayer;
  }
}

export default Custom();
