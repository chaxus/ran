import { SyncHook, addClassToElement, range, removeClassToElement, formatDuration } from 'ranuts/utils';
import '../../assets/js/hls.js';
import type { Progress } from '@/components/progress';
import '@/components/select';
import { PLAY_STATE_LIST, SPEED } from './core/constants';
import { bindControllerEvents, type PlayerControllerElements, type PlayerControllerHandlers } from './core/controller';
import {
  createPlaybackSnapshot,
  resolveSeekDuration,
  shouldResumePlayback,
  type PlaybackSnapshot,
} from './core/playback';
import { bindMediaEvents, loadVideoSource, unbindMediaEvents, type PlayerMediaHandlers } from './core/media';
import { buildManifestLevels } from './core/levels';
import { exitDocumentFullscreen, requestElementFullscreen } from './core/fullscreen';
import { shouldSetLoadingOnSeeking, shouldSetLoadingOnWaiting, syncCenterPlayVisibility } from './core/events';
import { getBufferedPercentage, normalizeProgress } from './core/progress';
import {
  createDefaultPlayerContext,
  createDefaultRuntimeState,
  resetSourceContextState,
  resetTransientRuntimeState,
  type PlayerRuntimeState,
} from './core/state';
import { createPlayerVisualSignals, type PlayerVisualSignals } from './core/store';
import { createPlaybackVisualEffects, type PlayerVisualEffectRefs } from './core/effects';
import { exitPip, isPipSupported, requestPip } from './core/pip';
import { ensurePlayerView } from './core/view';
import { EventManager, View } from '@/utils/builder';
import { RanElement, batch } from '@/utils/index';
import { registerIcon } from '@/components/icon';
import pipIcon from '@/assets/icons/pip.svg?raw';
import {
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import playerCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
import { isActivationKey, sliderStepFromKeydown } from '@/utils/a11y';

registerIcon('pip', pipIcon);

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
  /** 0-100, matches the `volume` attribute and `setVolume`/`getVolume` — not the native `<video>.volume` 0-1 scale. */
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

export class RanPlayer extends RanElement {
  public ctx: Context;
  _events = new EventManager();
  _visualSignals!: PlayerVisualSignals;
  _effectDisposers: Array<() => void> = [];
  _player: HTMLDivElement;
  _container: HTMLDivElement;
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
  _isSwitchingSource!: boolean;
  _playerControllerBottom: HTMLDivElement;
  _playerControllerBottomRight: HTMLDivElement;
  _playerControllerBottomLeft: HTMLDivElement;
  _playerControllerBottomPlayBtn: HTMLDivElement;
  _playerControllerBottomTimeCurrent: HTMLDivElement;
  _playerControllerBottomTimeDuration: HTMLDivElement;
  _playerControllerBottomTimeDivide: HTMLDivElement;
  _playControllerBottomClarity: HTMLElement;
  _playControllerBottomSpeed: HTMLDivElement;
  _playControllerBottomVolumeIcon: HTMLDivElement;
  _playControllerBottomVolumeProgress: Progress;
  _playControllerBottomPip: HTMLDivElement;
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
    return [
      'src',
      'volume',
      'currentTime',
      'currenttime',
      'playbackRate',
      'playbackrate',
      'debug',
      'sheet',
      'poster',
      'autoplay',
      'loop',
      'muted',
    ];
  }
  /**
   * @description: 初始化 view 和 video 的全局上下文
   * @return {*}
   */
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, playerCss);
    // 如果有子元素，进行置空
    this.innerHTML = '';
    const viewRefs = ensurePlayerView({
      shadowDom: this._shadowDom,
      speedOptions: SPEED,
      onSpeedChange: this.changeSpeed,
    });

    this._player = viewRefs.player;
    this._container = viewRefs.container;
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
    this._playControllerBottomVolumeIcon = viewRefs.playControllerBottomVolumeIcon;
    this._playControllerBottomPip = viewRefs.playControllerBottomPip;
    this._playControllerBottomClarity = viewRefs.playControllerBottomClarity;
    this._playControllerBottomRightFullScreen = viewRefs.playControllerBottomRightFullScreen;
    this._playerController = viewRefs.playerController;
    this._playerTip = viewRefs.playerTip;
    this._playerTipTime = viewRefs.playerTipTime;
    this._playerTipText = viewRefs.playerTipText;
    this.ctx = createDefaultPlayerContext<SyncHook, Partial<Level>>(new SyncHook());
    this.applyRuntimeState(createDefaultRuntimeState<PlaybackSnapshot>());
    this._visualSignals = createPlayerVisualSignals();
    this._isSwitchingSource = false;
  }
  getVisualEffectRefs = (): PlayerVisualEffectRefs => {
    return {
      playBtn: this._playerControllerBottomPlayBtn,
      progress: this._progress,
      progressValue: this._progressWrapValue,
      progressDot: this._progressDot,
      progressBuffer: this._progressWrapBuffer,
      timeCurrent: this._playerControllerBottomTimeCurrent,
      timeDuration: this._playerControllerBottomTimeDuration,
      volumeIcon: this._playControllerBottomVolumeIcon,
      volumeProgress: this._playControllerBottomVolumeProgress,
    };
  };
  setupEffects = (): void => {
    this._effectDisposers.push(...createPlaybackVisualEffects(this.getVisualEffectRefs(), this._visualSignals));
  };
  disposeEffects = (): void => {
    for (const dispose of this._effectDisposers) dispose();
    this._effectDisposers = [];
  };
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
  get poster(): string {
    return this.getAttribute('poster') || '';
  }
  set poster(value: string) {
    this.setAttribute('poster', value || '');
  }
  get autoplay(): boolean {
    return this.hasAttribute('autoplay');
  }
  set autoplay(value: boolean) {
    setBooleanAttribute(this, 'autoplay', value);
  }
  get loop(): boolean {
    return this.hasAttribute('loop');
  }
  set loop(value: boolean) {
    setBooleanAttribute(this, 'loop', value);
  }
  get muted(): boolean {
    return this.hasAttribute('muted');
  }
  set muted(value: boolean) {
    setBooleanAttribute(this, 'muted', value);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
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
      this.safePlay(true);
      return;
    }
    this.pause();
  };
  changeClarity = (e: Event): void => {
    this.ctx.clarity = (e as CustomEvent).detail.value;
    const url = this.ctx.levelMap.get((e as CustomEvent).detail.value);
    if (url && this._hls) {
      this._pendingPlaybackRestore = this.capturePlaybackSnapshot();
      this._isSwitchingSource = true;
      this.setLoadingState(true);
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
      .aria('label', 'Video quality')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', this.changeClarity);
    this._playControllerBottomClarity.appendChild(select);
  };
  manifestLoaded = (type: string, data: { levels: Level[]; url: string }): void => {
    if (type === 'hlsManifestLoaded') {
      const { url, levels = [] } = data;
      if (levels.length <= 0) return;
      const normalized = buildManifestLevels({ levels, manifestUrl: url, existingLevelMap: this.ctx.levelMap });
      this.ctx.levels.push(...normalized.levels);
      normalized.levelMapEntries.forEach(([name, levelUrl]) => this.ctx.levelMap.set(name, levelUrl));
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
    if (!Hls && this.debug) {
      console.warn('r-player: Hls.js is not loaded from window.Hls');
    }
    // 重置清晰度状态，避免旧数据干扰新视频的 manifest 加载
    resetSourceContextState(this.ctx);
    this._playControllerBottomClarity.innerHTML = '';
    // 如果有子元素，进行置空
    this.innerHTML = '';
    if (!this._shadowDom.contains(this._player)) this._shadowDom.appendChild(this._player);
    this._isSwitchingSource = false;
    this.setLoadingState(false);
    this.resetTransientState();
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
    if (this.poster) this._video.poster = this.poster;
    this._video.autoplay = this.autoplay;
    this._video.loop = this.loop;
    if (this.muted) this.setVolume(0);
    try {
      this._hls = loadVideoSource<HlsPlayer>({
        video: this._video,
        src: this.src,
        Hls,
        existingHls: this._hls,
        onManifestLoaded: this.manifestLoaded,
        onHlsError: this.hlsError,
      });
      if (!this._container.contains(this._video)) {
        this._container.appendChild(this._video);
      }
      this._video.parentElement?.setAttribute('class', 'ran-player-contain');
      this.listenEvent();
    } catch (error) {
      if (this.debug) console.warn('r-player update player error:', error);
    }
  };
  hlsError = (event: unknown, data: unknown): void => {
    this._isSwitchingSource = false;
    this.setLoadingState(false);
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
    this._isSwitchingSource = false;
    this.setLoadingState(false);
    this._visualSignals.isPlaying.setter(false);
    this.change('canplay', e);
    this.resize();
  };
  onCanplaythrough = (e: Event): void => {
    this.ctx.currentState = e.type;
    this._isSwitchingSource = false;
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
    this._isSwitchingSource = false;
    this.setLoadingState(false);
    this.change('ended', e);
  };
  onError = (e: Event): void => {
    this.ctx.currentState = e.type;
    this._isSwitchingSource = false;
    this.setLoadingState(false);
    this.change('error', e);
  };
  onLoadedmetadata = (e: Event): void => {
    this.ctx.currentState = e.type;
    if (this._pendingPlaybackRestore) {
      this.restorePlaybackSnapshot(this._pendingPlaybackRestore);
      this._pendingPlaybackRestore = undefined;
    }
    this._isSwitchingSource = false;
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
    this._isSwitchingSource = false;
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
    const currentTimeWhenSwitching =
      this._isSwitchingSource && this._pendingPlaybackRestore ? this._pendingPlaybackRestore.currentTime : 0;
    // Both setters change in the same tick here — batch so the progress
    // effect (which does a forced-layout `offsetWidth` read) flushes once
    // instead of twice.
    batch(() => {
      this._visualSignals.duration.setter(duration);
      this._visualSignals.currentTime.setter(currentTimeWhenSwitching);
    });
    this._playerControllerBottomTimeDivide.innerText = '/';
    this.change('loadeddata', e);
  };
  onTimeupdate = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.change('timeupdate', e);
  };
  onVolumechange = (e: Event): void => {
    this.ctx.currentState = e.type;
    // Mirrors the visual signal here too — not just `ctx.volume` — so it
    // can't go stale when the native `volumechange` fires from something
    // other than `setVolume()` (an external script touching `video.volume`
    // directly, an OS media key, etc). `getVolume()` already does the
    // 0-1 → 0-100 scale conversion and writes `ctx.volume`; reuse it instead
    // of duplicating the math, then push the same 0-100 value into the
    // signal so it matches the scale `setVolume()` uses.
    const volume = this.getVolume();
    this._visualSignals.volume.setter(volume);
    this.change('volumechange', e);
  };
  onWaiting = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(
      this._isSwitchingSource ||
        shouldSetLoadingOnWaiting({
          isSeeking: this._isSeeking,
          video: this._video,
        }),
    );
    this.change('waiting', e);
  };
  /**
   * @description: 原生 enterpictureinpicture/leavepictureinpicture 事件 —
   * 覆盖浏览器自己的 PiP 悬浮窗控件触发退出的情况，不只是走 togglePip() 这一条路径。
   */
  onEnterPictureInPicture = (e: Event): void => {
    this.change('pictureinpicture', true);
  };
  onLeavePictureInPicture = (e: Event): void => {
    this.change('pictureinpicture', false);
  };
  onPlay = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    this.requestAnimationFrame(this.updateCurrentProgress);
    this._visualSignals.isPlaying.setter(true);
    this.showControllerBar();
    this.change('play', e);
  };
  onPlaying = (e: Event): void => {
    this.ctx.currentState = e.type;
    this._isSwitchingSource = false;
    this.setLoadingState(false);
    syncCenterPlayVisibility(this._playerBtn, false);
    this._visualSignals.isPlaying.setter(true);
    this.requestAnimationFrame(this.updateCurrentProgress);
    this.showControllerBar();
    this.change('playing', e);
  };
  onPause = (e: Event): void => {
    this.ctx.currentState = e.type;
    this.setLoadingState(false);
    syncCenterPlayVisibility(this._playerBtn, !this._isSeeking);
    this.change('pause', e);
    this._visualSignals.isPlaying.setter(false);
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
      onEnterPictureInPicture: this.onEnterPictureInPicture,
      onLeavePictureInPicture: this.onLeavePictureInPicture,
    };
  };
  clearListenerEvent = (): void => {
    if (!this._video) return;
    if (typeof this._video.removeEventListener !== 'function') return;
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
      if (dom?.classList.value.includes('ran-player-controller')) {
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
    // Batched for the same reason as onLoadeddata/updateCurrentProgress —
    // `batch()` absorbs nested calls into whichever batch is already open
    // (e.g. when this runs from inside updateCurrentProgress's batch), so
    // it's always correct to batch here even when called standalone.
    batch(() => {
      this._visualSignals.duration.setter(duration);
      this._visualSignals.bufferedPercentage.setter(percentage);
    });
  };
  syncProgressByPercentage = (percentage: number): void => {
    const normalizedPercentage = normalizeProgress(percentage);
    this._progressWrapValue.style.setProperty('transform', `scaleX(${normalizedPercentage})`);
    this._progressDot.style.setProperty(
      'transform',
      `translateX(${normalizedPercentage * this._progress.offsetWidth}px)`,
    );
    this._progress.setAttribute('aria-valuenow', String(Math.round(normalizedPercentage * 100)));
    this._progress.setAttribute('aria-valuetext', formatDuration(normalizedPercentage * this.ctx.duration));
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
   * @description: ARIA slider keyboard contract for the seek bar — Home/End
   * jump to the ends, ArrowLeft/Down and ArrowRight/Up step (Shift for a
   * coarser step), matching the `role="slider"`/aria-valuemin/valuemax the
   * element already carries (see core/view.ts). Reuses the same percentage
   * scale (0-100) as aria-valuenow and the same `seekToPercentage` seek path
   * the click/drag handlers already use, rather than duplicating seek math.
   * `sliderStepFromKeydown` returning `undefined` means the key isn't part of
   * the slider pattern, so nothing is prevented/handled.
   */
  onProgressKeydown = (e: KeyboardEvent): void => {
    const { currentTime, duration } = this.ctx;
    const hasDuration = Number.isFinite(duration) && duration > 0;
    const currentPercentage = hasDuration ? normalizeProgress(currentTime / duration) * 100 : 0;
    const next = sliderStepFromKeydown(e, { current: currentPercentage, min: 0, max: 100 });
    if (next === undefined) return;
    e.preventDefault();
    this.seekToPercentage(next / 100);
  };
  /**
   * @description: 进度条鼠标按下事件
   * @param {MouseEvent} e
   * @return {*}
   */
  progressDotMouseDown = (): void => {
    this._playerBtn.style.setProperty('display', 'none');
    this.moveProgress.mouseDown = true;
    const duration = this.getTotalTime() || this.ctx.duration;
    const currentTime = this.getCurrentTime();
    this.moveProgress.percentage = duration > 0 ? Math.floor(normalizeProgress(currentTime / duration) * 100) / 100 : 0;
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
      this.safePlay(true);
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
    if (this._isSwitchingSource && this._pendingPlaybackRestore) {
      const duration = this.ctx.duration;
      const currentTime = this._pendingPlaybackRestore.currentTime;
      batch(() => {
        this._visualSignals.duration.setter(duration);
        this._visualSignals.currentTime.setter(currentTime);
      });
      return;
    }
    const currentTime = this.getCurrentTime();
    this.ctx.currentTime = currentTime;
    const { duration } = this.ctx;
    // Single batch covers duration+currentTime here and, when it runs,
    // updateBufferedProgress's own (nested) batch too — nested batches are
    // absorbed by the outermost one, so all the setters this tick share one
    // effect flush instead of two or three.
    batch(() => {
      this._visualSignals.duration.setter(duration);
      this._visualSignals.currentTime.setter(currentTime);
      if (Number.isFinite(duration) && duration > 0) {
        this.updateBufferedProgress();
      }
    });
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
          if (this.debug) console.warn(`exit full screen error:${error}`);
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
  /**
   * Enter/Space activation for the play/pause div — it has no native button
   * semantics, so nothing fires a `click` from the keyboard without this.
   * `dispatchClickPlayerBtnAction` already stops propagation, which also
   * keeps the host's own Space-to-toggle-play handler (`SpaceKeyDown`) from
   * double-firing on the same keystroke.
   */
  onPlayBtnKeydown = (e: KeyboardEvent): void => {
    if (!isActivationKey(e)) return;
    this.dispatchClickPlayerBtnAction(e);
  };
  /**
   * Enter/Space activation for the fullscreen div. Stops propagation itself
   * (unlike `dispatchClickPlayerBtnAction`, `openFullScreen` takes no event) —
   * otherwise Space here would bubble to the host and also toggle play/pause.
   */
  onFullScreenKeydown = (e: KeyboardEvent): void => {
    if (!isActivationKey(e)) return;
    e.preventDefault();
    e.stopPropagation();
    this.openFullScreen();
  };
  changeVolumeProgress = (e: Event): void => {
    if (this._video) {
      const volume = (e as CustomEvent).detail.value;
      this.setVolume(volume);
      this.change('volume', volume);
      if (volume > 0) {
        this._volume = volume;
      }
    }
  };
  customRequestFullscreen = (): Promise<void> => {
    return requestElementFullscreen(this._player);
  };
  customExitFullscreen = (): Promise<void> => {
    return exitDocumentFullscreen(document);
  };
  openFullScreen = (): void => {
    if (!this.ctx.fullScreen) {
      this.customRequestFullscreen()
        .then(() => {
          this.resize();
          this.ctx.fullScreen = true;
        })
        .catch((error) => {
          if (this.debug) console.warn(`full screen error:${error}`);
        });
    } else {
      this.customExitFullscreen()
        .then(() => {
          this.resize();
          this.ctx.fullScreen = false;
        })
        .catch((error) => {
          if (this.debug) console.warn(`exit full screen error:${error}`);
        });
    }
  };
  /**
   * @description: PiP 按钮只在浏览器真正支持时才可见——渐进增强，而不是渲染一个点了没反应的
   * 按钮。`isPipSupported()` 依赖 `document`，SSR/构造阶段拿不到有意义的结果，所以只在
   * `connectedCallback` 里跑一次。
   */
  syncPipButtonVisibility = (): void => {
    const supported = isPipSupported(this._video);
    this._playControllerBottomPip.classList.toggle('ran-player-controller-bottom-right-pip-hidden', !supported);
  };
  togglePip = (): void => {
    if (!this._video) return;
    if (document.pictureInPictureElement === this._video) {
      exitPip().catch((error) => {
        if (this.debug) console.warn(`exit picture-in-picture error:${error}`);
      });
      return;
    }
    requestPip(this._video).catch((error) => {
      if (this.debug) console.warn(`request picture-in-picture error:${error}`);
    });
  };
  changeSpeed = (e: Event): void => {
    const speed = Number((e as CustomEvent).detail.value) || 1;
    const shouldResume = shouldResumePlayback(this._video);
    this.ctx.playbackRate = speed;
    this.change('speed', speed);
    this.setPlaybackRate(speed);
    if (shouldResume) {
      this.safePlay(false);
    }
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
    this._playerTipTime.innerText = formatDuration((offsetX / this._progress.clientWidth) * this.ctx.duration);
  };
  progressMouseLeave = (e: MouseEvent): void => {
    if ((e.target as HTMLElement | null)?.classList.contains('ran-player-controller-progress-wrap-dot')) {
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
    this._playerTipTime.innerText = formatDuration((offsetX / this._progress.clientWidth) * this.ctx.duration);
  };
  changePlayerVolume = (): void => {
    if (!this._video) return;
    const { volume } = this.ctx;
    if (volume > 0) {
      this.setVolume(0);
      this.change('volume', 0);
    } else {
      const restoredVolume = this._volume || 50;
      this.setVolume(restoredVolume);
      this.change('volume', restoredVolume);
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
  /**
   * @description: 0-100 制，和 `volume` 属性、音量滑块一致；`<video>.volume` 是原生 0-1 制，只在这里做换算。
   * 顺带把原生 `<video>.muted` 和"音量是否为 0"绑在一起——这样 `volume=0` 才会真正满足浏览器的
   * "muted autoplay" 免打扰策略（单纯把 volume 设成 0 不等于 `.muted === true`，某些浏览器的
   * autoplay 判定只认后者），而不用再维护一个独立于音量的"是否静音"状态。
   */
  public setVolume = (n: number): number => {
    if (this._video) {
      this.ctx.volume = n;
      this._video.volume = n / 100;
      this._video.muted = n <= 0;
      this._visualSignals.volume.setter(n);
    }
    return this.ctx.volume;
  };
  public getVolume = (): number => {
    if (this._video) {
      this.ctx.volume = (this._video.volume || 0) * 100;
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
  safePlay = (showLoading: boolean): void => {
    if (!this._video) return;
    if (showLoading) this.setLoadingState(true);
    const result = this._video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        this.setLoadingState(false);
      });
    }
  };
  public play = (n?: number): void => {
    if (this._video) {
      if (n !== undefined && n >= 0) {
        this.ctx.currentTime = n;
        this._video.currentTime = n;
      }
      this.safePlay(false);
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
      volumeIcon: this._playControllerBottomVolumeIcon,
      pipBtn: this._playControllerBottomPip,
    };
  };
  getControllerHandlers = (): PlayerControllerHandlers => {
    return {
      onContainerClick: this.dispatchClickPlayerContainerAction,
      onPlayerBtnClick: this.dispatchClickPlayerBtnAction,
      onKeydown: this.SpaceKeyDown,
      onProgressDotMouseDown: this.progressDotMouseDown,
      onPlayBtnClick: this.dispatchClickPlayerBtnAction,
      onPlayBtnKeydown: this.onPlayBtnKeydown,
      onFullScreenKeydown: this.onFullScreenKeydown,
      onProgressClick: this.progressClick,
      onProgressKeydown: this.onProgressKeydown,
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
      onPipClick: this.togglePip,
    };
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    // Makes the host reachable by keyboard at all — without this, nothing in
    // the player (including the already-wired Space/Escape/Arrow shortcuts in
    // SpaceKeyDown) was ever focusable, so no keyboard user could reach them.
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    bindControllerEvents(this._events, this.getControllerElements(), this.getControllerHandlers());
    if (this._effectDisposers.length === 0) this.setupEffects();
    this.syncPipButtonVisibility();
    this.updatePlayer();
  }
  disconnectedCallback(): void {
    this._events.abort();
    this.disposeEffects();
    this.clearListenerEvent();
    this._hls?.destroy?.();
    this._hls = undefined;
    this.cancelAnimationFrame();
    this.resetTransientState();
    this._isSwitchingSource = false;
    this.setLoadingState(false);
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (k === 'src' && o !== n) {
      this.updatePlayer();
    }
    if (k === 'volume' && o !== n) {
      this.setVolume(Number(n));
    }
    if ((k === 'currentTime' || k === 'currenttime') && o !== n) {
      this.setCurrentTime(Number(n));
    }
    if ((k === 'playbackRate' || k === 'playbackrate') && o !== n) {
      this.setPlaybackRate(Number(n));
    }
    if (k === 'sheet' && o !== n) {
      this.handlerExternalCss();
    }
    if (k === 'poster' && o !== n && this._video) {
      this._video.poster = this.poster;
    }
    if (k === 'autoplay' && o !== n && this._video) {
      this._video.autoplay = this.autoplay;
    }
    if (k === 'loop' && o !== n && this._video) {
      this._video.loop = this.loop;
    }
    if (k === 'muted' && o !== n) {
      this.setVolume(this.muted ? 0 : this._volume || 50);
    }
  }
}

defineSSR('r-player', RanPlayer as unknown as new () => HTMLElement);
export default RanPlayer;
