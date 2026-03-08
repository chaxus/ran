import { SyncHook, addClassToElement, generateThrottle, range, removeClassToElement, timeFormat } from 'ranuts/utils';
import '../../assets/js/hls.js';
import type { Progress } from '@/components/progress';
import '@/components/select';
import { PLAY_STATE_LIST, SPEED } from './core/constants';
import {
  bindControllerEvents,
  type PlayerControllerElements,
  type PlayerControllerHandlers,
  unbindControllerEvents,
} from './core/controller';
import { createPlaybackSnapshot, resolveSeekDuration, shouldResumePlayback, type PlaybackSnapshot } from './core/playback';
import { bindMediaEvents, loadVideoSource, unbindMediaEvents, type PlayerMediaHandlers } from './core/media';
import {
  shouldSetLoadingOnSeeking,
  shouldSetLoadingOnWaiting,
  syncCenterPlayVisibility,
  syncPlayButtonState,
} from './core/events';
import { getBufferedPercentage, normalizeProgress } from './core/progress';
import {
  createDefaultPlayerContext,
  createDefaultRuntimeState,
  resetSourceContextState,
  resetTransientRuntimeState,
  type PlayerRuntimeState,
} from './core/state';
import { ensurePlayerView } from './core/view';
import { View } from '@/utils/builder';
import { HTMLElementSSR } from '@/utils/index';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import playerCss from './index.less?inline';

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
  action: SyncHook;
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
  _progressWrapBuffer: HTMLDivElement;
  _progressWrapValue: HTMLDivElement;
  requestAnimationFrameId?: number;
  moveProgress!: { percentage: number; mouseDown: boolean };
  _isSeeking!: boolean;
  _wasPlayingBeforeSeek!: boolean;
  _isBuffering!: boolean;
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
  _shadowDom: ShadowRoot;
  _volume?: number;
  _video?: HTMLVideoElement;
  _hls?: HlsPlayer;
  _pendingPlaybackRestore?: PlaybackSnapshot;
  static get observedAttributes(): string[] {
    return ['src', 'volume', 'currentTime', 'playbackRate', 'debug', 'sheet'];
  }
  /**
   * @description: 初始化 view 和 video 的全局上下文
   * @return {*}
   */
  constructor() {
    super();
    this._shadowDom = this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, playerCss);
    // 如果有子元素，进行置空
    this.innerHTML = '';
    const viewRefs = ensurePlayerView({
      shadowDom: this._shadowDom,
      speedOptions: SPEED,
      onSpeedChange: this.changeSpeed,
    });

    this._player = viewRefs.player;
    this._container = viewRefs.container;
    this._slot = viewRefs.slot;
    this._playerBtn = viewRefs.playerBtn;
    this._progress = viewRefs.progress;
    this._progressWrap = viewRefs.progressWrap;
    this._progressWrapBuffer = viewRefs.progressWrapBuffer;
    this._progressWrapValue = viewRefs.progressWrapValue;
    this._progressDot = viewRefs.progressDot;
    this._playerControllerBottom = viewRefs.playerControllerBottom;
    this._playerControllerBottomRight = viewRefs.playerControllerBottomRight;
    this._playerControllerBottomLeft = viewRefs.playerControllerBottomLeft;
    this._playerControllerBottomPlayBtn = viewRefs.playerControllerBottomPlayBtn;
    this._playerControllerBottomTimeCurrent = viewRefs.playerControllerBottomTimeCurrent;
    this._playerControllerBottomTimeDivide = viewRefs.playerControllerBottomTimeDivide;
    this._playerControllerBottomTimeDuration = viewRefs.playerControllerBottomTimeDuration;
    this._playControllerBottomSpeed = viewRefs.playControllerBottomSpeed;
    this._playControllerBottomSpeedPopover = viewRefs.playControllerBottomSpeedPopover;
    this._playControllerBottomVolume = viewRefs.playControllerBottomVolume;
    this._playControllerBottomVolumeProgress = viewRefs.playControllerBottomVolumeProgress;
    this._playControllerBottomSpeedIcon = viewRefs.playControllerBottomSpeedIcon;
    this._playControllerBottomClarity = viewRefs.playControllerBottomClarity;
    this._playControllerBottomRightFullScreen = viewRefs.playControllerBottomRightFullScreen;
    this._playerController = viewRefs.playerController;
    this._playerTip = viewRefs.playerTip;
    this._playerTipTime = viewRefs.playerTipTime;
    this._playerTipText = viewRefs.playerTipText;
    this.ctx = createDefaultPlayerContext<SyncHook, Partial<Level>>(new SyncHook());
    this.applyRuntimeState(createDefaultRuntimeState<PlaybackSnapshot>());
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
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };
  getRuntimeState = (): PlayerRuntimeState<PlaybackSnapshot> => {
    return {
      moveProgress: this.moveProgress,
      isSeeking: this._isSeeking,
      wasPlayingBeforeSeek: this._wasPlayingBeforeSeek,
      isBuffering: this._isBuffering,
      pendingPlaybackRestore: this._pendingPlaybackRestore,
    };
  };
  applyRuntimeState = (state: PlayerRuntimeState<PlaybackSnapshot>): void => {
    this.moveProgress = state.moveProgress;
    this._isSeeking = state.isSeeking;
    this._wasPlayingBeforeSeek = state.wasPlayingBeforeSeek;
    this._isBuffering = state.isBuffering;
    this._pendingPlaybackRestore = state.pendingPlaybackRestore;
  };
  resetTransientState = (): void => {
    const runtimeState = this.getRuntimeState();
    resetTransientRuntimeState(runtimeState);
    this.applyRuntimeState(runtimeState);
  };
  capturePlaybackSnapshot = (): PlaybackSnapshot => {
    const currentTime = this.getCurrentTime();
    const playbackRate = this.getPlaybackRate() || this.ctx.playbackRate || 1;
    const volume = this.getVolume() || this.ctx.volume;
    const shouldResume = shouldResumePlayback(this._video);
    return createPlaybackSnapshot({
      currentTime,
      playbackRate,
      volume,
      shouldResume,
    });
  };
  restorePlaybackSnapshot = (snapshot: PlaybackSnapshot): void => {
    this.setCurrentTime(snapshot.currentTime);
    this.setPlaybackRate(snapshot.playbackRate);
    this.setVolume(snapshot.volume);
    if (snapshot.shouldResume) {
      this.play();
      return;
    }
    this.pause();
  };
  changeClarity = (e: Event): void => {
    this.ctx.clarity = (e as CustomEvent).detail.value;
    const url = this.ctx.levelMap.get((e as CustomEvent).detail.value);
    if (url && this._hls) {
      this._pendingPlaybackRestore = this.capturePlaybackSnapshot();
      this.setLoadingState(this._pendingPlaybackRestore.shouldResume);
      this._hls.loadSource(url);
      this._hls.startLoad();
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
      const option = View('r-option').attr('value', name).text(name).build() as HTMLElement;
      Fragment.appendChild(option);
    });
    const id = this._player.getAttribute('id');
    const select = View('r-select')
      .attr('value', this.ctx.clarity || 'Auto')
      .attr('type', 'text')
      .attr('trigger', 'hover,click')
      .attr('placement', 'top')
      .attr('dropdownclass', 'video-clarity-dropdown')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', this.changeClarity);
    this._playControllerBottomClarity.appendChild(select);
  };
  manifestLoaded = (type: string, data: { levels: Level[]; url: string }): void => {
    console.log(
      '[r-player] manifestLoaded called, type:',
      type,
      'levels:',
      data?.levels?.length,
      'first level:',
      data?.levels?.[0],
    );
    if (type === 'hlsManifestLoaded') {
      const { url, levels = [] } = data;
      if (levels.length <= 0) return;
      levels.forEach((item) => {
        // HLS.js Level 的 name 字段可能为空，用 height 或 bitrate 作为 fallback
        const name =
          item.name ||
          (item.height ? `${item.height}p` : '') ||
          (item.bitrate ? `${Math.round(item.bitrate / 1000)}k` : '');
        console.log('[r-player] level item:', item, '→ derived name:', name);
        if (!name) return;
        const levelWithName = { ...item, name };
        if (this.ctx.levelMap.get(name) === item.url) return;
        this.ctx.levels.push(levelWithName);
        this.ctx.levelMap.set(name, item.url || url);
      });
      if (!this.ctx.levelMap.get('Auto')) {
        this.ctx.levels.push({ name: 'Auto', url });
        this.ctx.levelMap.set('Auto', url);
      }
      this.ctx.url = url;
      console.log('[r-player] ctx.levels after manifest:', this.ctx.levels);
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
    if (!Hls) {
      console.warn('r-player: Hls.js is not loaded from window.Hls');
    }
    // 重置清晰度状态，避免旧数据干扰新视频的 manifest 加载
    resetSourceContextState(this.ctx);
    this._playControllerBottomClarity.innerHTML = '';
    // 如果有子元素，进行置空
    this.innerHTML = '';
    if (!this._shadowDom.contains(this._player)) this._shadowDom.appendChild(this._player);
    this.setLoadingState(false);
    this.resetTransientState();
    if (this._hls) {
      this._hls.destroy();
      this._hls = undefined;
    }
    this._container.innerHTML = '';
    this._video = View('video')
      .class('ran-player-video')
      .attr('preload', 'auto')
      .attr('x5-video-player-type', 'h5')
      .attr('x5-video-orientation', 'portrait')
      .attr('webkit-playsinline', 'true')
      .attr('playsinline', 'true')
      .attr('controls', 'false')
      .attr('initial-time', '0.01')
      .build() as HTMLVideoElement;
    this._video.controls = false;
    try {
      this._hls = loadVideoSource<HlsPlayer>({
        video: this._video,
        src: this.src,
        Hls,
        onManifestLoaded: this.manifestLoaded,
        onHlsError: this.hlsError,
      });
      if (!this._container.contains(this._video)) {
        this._container.appendChild(this._video);
      }
      this._video.parentElement?.setAttribute('class', 'ran-player-contain');
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
    if (this.debug) {
      console.log(name, value);
    }
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
    this.setLoadingState(false);
    syncPlayButtonState(this._playerControllerBottomPlayBtn, false);
    this.change('canplay', e);
    this.resize();
  };
  onCanplaythrough = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.change('canplaythrough', e);
  };
  onComplete = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('complete', e);
  };
  onDurationchange = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.updateBufferedProgress();
    this.change('durationchange', e);
  };
  onEmptied = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('emptied', e);
  };
  onEnded = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.change('ended', e);
  };
  onError = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.change('error', e);
  };
  onLoadedmetadata = (e: Event): void => {
    this.ctx.currentState = e.type;
    if (this._pendingPlaybackRestore) {
      this.restorePlaybackSnapshot(this._pendingPlaybackRestore);
      this._pendingPlaybackRestore = undefined;
    }
    this.updateBufferedProgress();
    this.change('loadedmetadata', e);
  };
  onLoadstart = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('loadstart', e);
  };
  onProgress = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.updateBufferedProgress();
    this.change('progress', e);
  };
  onRatechange = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('ratechange', e);
  };
  onSeeked = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.change('seeked', e);
  };
  onSeeking = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(
      shouldSetLoadingOnSeeking({
        isDraggingProgress: this.moveProgress.mouseDown,
        video: this._video,
      }),
    );
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
    this.updateBufferedProgress();
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
    this.setLoadingState(
      shouldSetLoadingOnWaiting({
        isSeeking: this._isSeeking,
        video: this._video,
      }),
    );
    this.change('waiting', e);
  };
  onPlay = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.requestAnimationFrame(this.updateCurrentProgress);
    syncPlayButtonState(this._playerControllerBottomPlayBtn, true);
    this.showControllerBar();
    this.change('play', e);
  };
  onPlaying = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    syncCenterPlayVisibility(this._playerBtn, false);
    syncPlayButtonState(this._playerControllerBottomPlayBtn, true);
    this.requestAnimationFrame(this.updateCurrentProgress);
    this.showControllerBar();
    this.change('playing', e);
  };
  onPause = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    syncCenterPlayVisibility(this._playerBtn, !this._isSeeking);
    this.change('pause', e);
    syncPlayButtonState(this._playerControllerBottomPlayBtn, false);
    this.cancelAnimationFrame();
    this._playerController.style.setProperty('opacity', '1');
    if (this.controllerBarTimeId) {
      clearTimeout(this.controllerBarTimeId);
      this.controllerBarTimeId = undefined;
    }
  };
  getMediaHandlers = (): PlayerMediaHandlers => {
    return {
      onCanplay: this.onCanplay,
      onCanplaythrough: this.onCanplaythrough,
      onComplete: this.onComplete,
      onDurationchange: this.onDurationchange,
      onEmptied: this.onEmptied,
      onEnded: this.onEnded,
      onError: this.onError,
      onLoadeddata: this.onLoadeddata,
      onLoadedmetadata: this.onLoadedmetadata,
      onLoadstart: this.onLoadstart,
      onPause: this.onPause,
      onPlay: this.onPlay,
      onPlaying: this.onPlaying,
      onProgress: this.onProgress,
      onRatechange: this.onRatechange,
      onSeeked: this.onSeeked,
      onSeeking: this.onSeeking,
      onStalled: this.onStalled,
      onSuspend: this.onSuspend,
      onTimeupdate: this.onTimeupdate,
      onVolumechange: this.onVolumechange,
      onWaiting: this.onWaiting,
    };
  };
  clearListenerEvent = (): void => {
    if (!this._video) return;
    unbindMediaEvents(this._video, this.getMediaHandlers());
  };
  /**
   * @description: 用户行为和 video 之间的交互
   * @return {*}
   */
  listenEvent = (): void => {
    if (!this._video) return;
    this.clearListenerEvent();
    bindMediaEvents(this._video, this.getMediaHandlers());
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
  setLoadingState = (loading: boolean): void => {
    if (this._isBuffering === loading) return;
    this._isBuffering = loading;
    if (loading) {
      addClassToElement(this._player, 'ran-player-buffering');
      return;
    }
    removeClassToElement(this._player, 'ran-player-buffering');
  };
  updateBufferedProgress = (): void => {
    if (!this._video) return;
    const duration = this.getTotalTime();
    const percentage = getBufferedPercentage(this._video, duration);
    this._progressWrapBuffer.style.setProperty('transform', `scaleX(${percentage})`);
  };
  syncProgressByPercentage = (percentage: number): void => {
    const normalizedPercentage = normalizeProgress(percentage);
    this._progressWrapValue.style.setProperty('transform', `scaleX(${normalizedPercentage})`);
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${normalizedPercentage * this._progress.offsetWidth}px)`,
    );
  };
  seekToPercentage = (percentage: number): void => {
    const durationFromContext = this.ctx.duration;
    const durationFromVideo = this.getTotalTime();
    const duration = resolveSeekDuration(durationFromVideo, durationFromContext);
    if (!Number.isFinite(duration) || duration <= 0) return;
    this.setCurrentTime(duration * normalizeProgress(percentage));
    this.updateCurrentProgress();
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
    this.seekToPercentage(percentage);
  };
  /**
   * @description: 进度条鼠标按下事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseDown = (): void => {
    this._playerBtn.style.setProperty('display', 'none');
    this.moveProgress.mouseDown = true;
    this._isSeeking = true;
    this._wasPlayingBeforeSeek = !!this._video && !this._video.paused && !this._video.ended;
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
    this.syncProgressByPercentage(percentage);
    this.moveProgress.percentage = Math.floor(percentage * 100) / 100;
  };
  progressDotMouseMoveDocument = (e: MouseEvent): void => {
    if (!this.moveProgress.mouseDown) return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - 9;
    const percentage = range(offsetX / this._progress.offsetWidth);
    this.syncProgressByPercentage(percentage);
    this.moveProgress.percentage = Math.floor(percentage * 100) / 100;
  };
  /**
   * @description: 进度条鼠标松开事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseUp = (): void => {
    if (!this.moveProgress.mouseDown) return;
    const shouldResume = this._wasPlayingBeforeSeek;
    this.seekToPercentage(this.moveProgress.percentage);
    this.moveProgress.mouseDown = false;
    this._isSeeking = false;
    this._wasPlayingBeforeSeek = false;
    if (shouldResume) {
      this.play();
      this.requestAnimationFrame(this.updateCurrentProgress);
      return;
    }
    this.pause();
    this.cancelAnimationFrame();
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
      if (this.requestAnimationFrameId) {
        cancelAnimationFrame(this.requestAnimationFrameId);
      }
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
    if (!Number.isFinite(duration) || duration <= 0) {
      this.syncProgressByPercentage(0);
      return;
    }
    this.syncProgressByPercentage(currentTime / duration);
    this.updateBufferedProgress();
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
      const volume = (e as CustomEvent).detail.value / 100;
      this.setVolume(volume);
      this.change('volume', volume);
      if (volume > 0) {
        this._volume = volume;
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
    const speed = Number((e as CustomEvent).detail.value) || 1;
    this.ctx.playbackRate = speed;
    this.change('speed', speed);
    this.setPlaybackRate(speed);
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
  getControllerElements = (): PlayerControllerElements => {
    return {
      host: this,
      container: this._container,
      player: this._player,
      playerBtn: this._playerBtn,
      progress: this._progress,
      progressDot: this._progressDot,
      playBtn: this._playerControllerBottomPlayBtn,
      volumeProgress: this._playControllerBottomVolumeProgress,
      fullScreenBtn: this._playControllerBottomRightFullScreen,
      volumeIcon: this._playControllerBottomSpeedIcon,
    };
  };
  getControllerHandlers = (): PlayerControllerHandlers => {
    return {
      onContainerClick: this.dispatchClickPlayerContainerAction,
      onPlayerBtnClick: this.dispatchClickPlayerBtnAction,
      onKeydown: this.SpaceKeyDown,
      onProgressDotMouseDown: this.progressDotMouseDown,
      onPlayBtnClick: this.dispatchClickPlayerBtnAction,
      onProgressClick: this.progressClick,
      onProgressMouseEnter: this.progressMouseEnter,
      onProgressMouseMove: this.progressMouseMove,
      onProgressMouseLeave: this.progressMouseLeave,
      onPlayerMouseMove: this.progressDotMouseMove,
      onDocumentMouseMove: this.progressDotMouseMoveDocument,
      onDocumentMouseUp: this.progressDotMouseUp,
      onVolumeChange: this.changeVolumeProgress,
      onFullScreenClick: this.openFullScreen,
      onVolumeIconClick: this.changePlayerVolume,
      onFullscreenChange: this.fullScreenChange,
      onResize: this.resize,
    };
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    bindControllerEvents(this.getControllerElements(), this.getControllerHandlers());
    this.updatePlayer();
  }
  disconnectedCallback(): void {
    unbindControllerEvents(this.getControllerElements(), this.getControllerHandlers());
    this.cancelAnimationFrame();
    this.resetTransientState();
    this.setLoadingState(false);
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (k === 'src' && o !== n) {
      this.updatePlayer();
    }
    if (k === 'volume' && o !== n) {
      this.setVolume(Number(n) / 100);
    }
    if (k === 'sheet' && o !== n) {
      this.handlerExternalCss();
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-player')) {
    customElements.define('r-player', RanPlayer);
    return RanPlayer;
  }
}

export default Custom();
