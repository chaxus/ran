import { SyncHook, createRaceGuard } from 'ranuts/utils';
import type { RaceGuard } from 'ranuts/utils';
import type { Progress } from '@/components/progress';
import '@/components/select';
import { SPEED } from './core/constants';
import { bindControllerEvents, type PlayerControllerElements, type PlayerControllerHandlers } from './core/controller';
import { createPlaybackSnapshot, shouldResumePlayback, type PlaybackSnapshot } from './core/playback';
import { bindMediaEvents, loadVideoSource, unbindMediaEvents, type PlayerMediaHandlers } from './core/media';
import type { EngineAdapter, EngineQualityLevel } from './core/adapters/types';
import {
  createDefaultPlayerContext,
  createDefaultRuntimeState,
  resetSourceContextState,
  resetTransientRuntimeState,
  type PlayerRuntimeState,
} from './core/state';
import { createPlayerVisualSignals, type PlayerVisualSignals } from './core/store';
import { createPlaybackVisualEffects, type PlayerVisualEffectRefs } from './core/effects';
import { createErrorModalController, type PlayerErrorModalController, type PlayerErrorModalDeps } from './core/error-modal';
import { createSeekHandlers, type PlayerSeekDeps, type PlayerSeekHandlers } from './core/seek';
import { createChromeHandlers, type PlayerChromeDeps, type PlayerChromeHandlers } from './core/chrome';
import { createMediaEventHandlers, type PlayerMediaDispatchDeps } from './core/media-dispatch';
import { createClarityHandlers, type PlayerClarityDeps, type PlayerClarityHandlers } from './core/clarity';
import { createSubtitleHandlers, type PlayerSubtitleDeps, type PlayerSubtitleHandlers } from './core/subtitles';
import { createMetricsController, type PlayerMetrics, type PlayerMetricsController } from './core/metrics';
import { attachGestureHandlers, type PlayerGestureController, type PlayerGestureDeps } from './core/gestures';
import { findThumbnailCue, loadThumbnailCues, type ThumbnailCue } from './core/thumbnails';
import { type PlayerTrackConfig } from './core/tracks';
import { ensurePlayerView } from './core/view';
import { EventManager, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { registerIcon } from '@/components/icon';
import pipIcon from '@/assets/icons/pip.svg?raw';
import castIcon from '@/assets/icons/cast.svg?raw';
import playIcon from '@/assets/icons/play.svg?raw';
import pauseIcon from '@/assets/icons/pause.svg?raw';
import volumeIcon from '@/assets/icons/volume.svg?raw';
import volumeMuteIcon from '@/assets/icons/volume-mute.svg?raw';
import {
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import playerCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

registerIcon('pip', pipIcon);
registerIcon('cast', castIcon);
registerIcon('play', playIcon);
registerIcon('pause', pauseIcon);
registerIcon('volume', volumeIcon);
registerIcon('volume-mute', volumeMuteIcon);

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

export interface Context {
  action: SyncHook;
  currentState: string;
  duration: number;
  currentTime: number;
  /** 0-100, matches the `volume` attribute and `setVolume`/`getVolume` — not the native `<video>.volume` 0-1 scale. */
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
  levels: EngineQualityLevel[];
  url: string;
  levelMap: Map<string, string>;
  clarity: string;
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
  /** Single source of truth for transient interaction state — see accessors below. */
  _runtimeState!: PlayerRuntimeState<PlaybackSnapshot>;
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
  _playControllerBottomSubtitle: HTMLElement;
  _playControllerBottomPip: HTMLDivElement;
  _playControllerBottomRemote: HTMLDivElement;
  _gestureFlash: HTMLDivElement;
  _playControllerBottomRightFullScreen: HTMLDivElement;
  _playControllerBottomVolume: HTMLDivElement;
  _playControllerBottomSpeedPopover: HTMLElement;
  _playerTip: HTMLDivElement;
  _playerTipThumbnail: HTMLDivElement;
  _playerTipTime: HTMLDivElement;
  _playerTipText: HTMLDivElement;
  _shadowDom: ShadowRoot;
  _volume?: number;
  _video?: HTMLVideoElement;
  _engine?: EngineAdapter;
  /** Set once `connectedCallback` has run for the first time — see its use in
   * `attributeChangedCallback` below for why this exists. */
  _didInitialConnect = false;
  _tracks: PlayerTrackConfig[] = [];
  _thumbnailCues: ThumbnailCue[] = [];
  _thumbnailLoadGuard: RaceGuard = createRaceGuard();
  /** Domain modules — each built once in the constructor from a narrow `getXxxDeps()` slice. */
  _errorModal!: PlayerErrorModalController;
  _mediaHandlers!: PlayerMediaHandlers;
  _seek!: PlayerSeekHandlers;
  _chrome!: PlayerChromeHandlers;
  _clarity!: PlayerClarityHandlers<EngineQualityLevel>;
  _subtitles!: PlayerSubtitleHandlers;
  _metrics!: PlayerMetricsController;
  _gestures?: PlayerGestureController;
  static get observedAttributes(): string[] {
    return [
      'src',
      'format',
      'volume',
      'currentTime',
      'currenttime',
      'playbackRate',
      'playbackrate',
      'debug',
      'sheet',
      'poster',
      'thumbnails',
      'autoplay',
      'loop',
      'muted',
      'disable-error-modal',
      'remember-position',
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
    this._playControllerBottomSubtitle = viewRefs.playControllerBottomSubtitle;
    this._playControllerBottomPip = viewRefs.playControllerBottomPip;
    this._playControllerBottomRemote = viewRefs.playControllerBottomRemote;
    this._gestureFlash = viewRefs.gestureFlash;
    this._playControllerBottomClarity = viewRefs.playControllerBottomClarity;
    this._playControllerBottomRightFullScreen = viewRefs.playControllerBottomRightFullScreen;
    this._playerController = viewRefs.playerController;
    this._playerTip = viewRefs.playerTip;
    this._playerTipThumbnail = viewRefs.playerTipThumbnail;
    this._playerTipTime = viewRefs.playerTipTime;
    this._playerTipText = viewRefs.playerTipText;
    this.ctx = createDefaultPlayerContext<SyncHook, EngineQualityLevel>(new SyncHook());
    this._runtimeState = createDefaultRuntimeState<PlaybackSnapshot>();
    this._visualSignals = createPlayerVisualSignals();
    this._errorModal = createErrorModalController(this.getErrorModalDeps());
    this._mediaHandlers = createMediaEventHandlers(this.getMediaDispatchDeps());
    this._seek = createSeekHandlers(this.getSeekDeps());
    this._chrome = createChromeHandlers(this.getChromeDeps());
    this._clarity = createClarityHandlers<EngineQualityLevel>(this.getClarityDeps());
    this._subtitles = createSubtitleHandlers(this.getSubtitleDeps());
    this._metrics = createMetricsController();
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
  getErrorModalDeps = (): PlayerErrorModalDeps => ({
    isDisabled: () => this.disableErrorModal,
    onRetry: () => this.updatePlayer(),
  });
  getMediaDispatchDeps = (): PlayerMediaDispatchDeps => ({
    refs: {
      playerBtn: this._playerBtn,
      timeDivide: this._playerControllerBottomTimeDivide,
      playerController: this._playerController,
    },
    state: this._runtimeState,
    ctx: this.ctx,
    visualSignals: this._visualSignals,
    getVideo: () => this._video,
    rememberPosition: () => this.rememberPosition,
    getSrc: () => this.src,
    change: (name, value) => this.change(name, value),
    setLoadingState: (loading) => this.setLoadingState(loading),
    resize: () => this.resize(),
    showErrorModal: (message) => this.showErrorModal(message),
    restorePlaybackSnapshot: (snapshot) => this.restorePlaybackSnapshot(snapshot),
    setCurrentTime: (n) => this.setCurrentTime(n),
    getCurrentTime: () => this.getCurrentTime(),
    getTotalTime: () => this.getTotalTime(),
    getVolume: () => this.getVolume(),
    requestAnimationFrame: (fn) => this.requestAnimationFrame(fn),
    cancelAnimationFrame: () => this.cancelAnimationFrame(),
    updateCurrentProgress: () => this.updateCurrentProgress(),
    updateBufferedProgress: () => this.updateBufferedProgress(),
    showControllerBar: (e) => this.showControllerBar(e),
  });
  getSeekDeps = (): PlayerSeekDeps => ({
    refs: {
      progress: this._progress,
      progressWrap: this._progressWrap,
      progressWrapValue: this._progressWrapValue,
      progressDot: this._progressDot,
      playerBtn: this._playerBtn,
      playerTip: this._playerTip,
      playerTipThumbnail: this._playerTipThumbnail,
      playerTipTime: this._playerTipTime,
      playerTipText: this._playerTipText,
    },
    state: this._runtimeState,
    ctx: this.ctx,
    visualSignals: this._visualSignals,
    getVideo: () => this._video,
    getTotalTime: () => this.getTotalTime(),
    getCurrentTime: () => this.getCurrentTime(),
    setCurrentTime: (n) => this.setCurrentTime(n),
    safePlay: (showLoading) => this.safePlay(showLoading),
    pause: () => this.pause(),
    showControllerBar: (e) => this.showControllerBar(e),
    getThumbnailCue: (time) => findThumbnailCue(this._thumbnailCues, time),
    seekToPercentage: (percentage) => this.seekToPercentage(percentage),
    syncProgressByPercentage: (percentage) => this.syncProgressByPercentage(percentage),
    updateCurrentProgress: () => this.updateCurrentProgress(),
    updateBufferedProgress: () => this.updateBufferedProgress(),
    requestAnimationFrame: (fn) => this.requestAnimationFrame(fn),
    cancelAnimationFrame: () => this.cancelAnimationFrame(),
  });
  getChromeDeps = (): PlayerChromeDeps => ({
    refs: {
      player: this._player,
      playerBtn: this._playerBtn,
      playerController: this._playerController,
      playControllerBottomVolume: this._playControllerBottomVolume,
      playControllerBottomPip: this._playControllerBottomPip,
      playControllerBottomRemote: this._playControllerBottomRemote,
    },
    state: this._runtimeState,
    ctx: this.ctx,
    getVideo: () => this._video,
    isDebug: () => !!this.debug,
    play: () => this.play(),
    pause: () => this.pause(),
    setCurrentTime: (n) => this.setCurrentTime(n),
    setPlaybackRate: (n) => this.setPlaybackRate(n),
    setVolume: (n) => this.setVolume(n),
    safePlay: (showLoading) => this.safePlay(showLoading),
    change: (name, value) => this.change(name, value),
    updateCurrentProgress: () => this.updateCurrentProgress(),
    resize: () => this.resize(),
    customRequestFullscreen: () => this.customRequestFullscreen(),
    customExitFullscreen: () => this.customExitFullscreen(),
    getVolumeMemo: () => this._volume,
    setVolumeMemo: (n) => (this._volume = n),
    rememberPosition: () => this.rememberPosition,
    getSrc: () => this.src,
    getCurrentTime: () => this.getCurrentTime(),
  });
  getClarityDeps = (): PlayerClarityDeps<EngineQualityLevel> => ({
    refs: { clarityContainer: this._playControllerBottomClarity, player: this._player },
    state: this._runtimeState,
    ctx: this.ctx,
    getEngine: () => this._engine,
    getVideo: () => this._video,
    getSrc: () => this.src,
    capturePlaybackSnapshot: () => this.capturePlaybackSnapshot(),
    setLoadingState: (loading) => this.setLoadingState(loading),
    change: (name, value) => this.change(name, value),
    showErrorModal: (message) => this.showErrorModal(message),
    createClaritySelect: () => this.createClaritySelect(),
  });
  getGestureDeps = (): PlayerGestureDeps => ({
    refs: { container: this._container, gestureFlash: this._gestureFlash },
    getCurrentTime: () => this.getCurrentTime(),
    getTotalTime: () => this.getTotalTime(),
    setCurrentTime: (n) => this.setCurrentTime(n),
    getVolume: () => this.getVolume(),
    setVolume: (n) => this.setVolume(n),
    change: (name, value) => this.change(name, value),
    onSingleTap: (e) => this.dispatchClickPlayerContainerAction(e),
  });
  getSubtitleDeps = (): PlayerSubtitleDeps => ({
    refs: { subtitleContainer: this._playControllerBottomSubtitle, player: this._player },
    getPlayerId: () => this._player.getAttribute('id'),
    getVideo: () => this._video,
    getTracks: () => this._tracks,
    change: (name, value) => this.change(name, value),
  });
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
  /**
   * URL of a WebVTT sprite-sheet manifest (cues whose text is
   * `spritesheet.jpg#xywh=x,y,w,h`, the YouTube/Video.js convention) — shows a
   * cropped thumbnail above the seek-bar hover tip. Independent of `src`: not
   * reset on a source reload, only refetched when this attribute itself changes.
   */
  get thumbnails(): string {
    return this.getAttribute('thumbnails') || '';
  }
  set thumbnails(value: string) {
    this.setAttribute('thumbnails', value || '');
  }
  /**
   * @description: 强制指定引擎（`hls`/`dash`/`flv`/`webrtc`/`native`），给拿不到扩展名的
   * 加签/无后缀流地址用；缺省时按 `src` 扩展名自动探测（见 `core/adapters/detect.ts`）。
   * `webrtc`（WHEP 端点 URL）没有扩展名可探测，必须显式指定这个值。
   */
  get format(): string {
    return this.getAttribute('format') || '';
  }
  set format(value: string) {
    this.setAttribute('format', value || '');
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
  get disableErrorModal(): boolean {
    return this.hasAttribute('disable-error-modal');
  }
  set disableErrorModal(value: boolean) {
    setBooleanAttribute(this, 'disable-error-modal', value);
  }
  get rememberPosition(): boolean {
    return this.hasAttribute('remember-position');
  }
  set rememberPosition(value: boolean) {
    setBooleanAttribute(this, 'remember-position', value);
  }
  /**
   * @description: 字幕/CC 轨道配置，imperative 属性而不是 attribute——player 会在每次
   * `updatePlayer()` 时清空 light DOM，不能指望用户塞 `<track>` 子标签进去。
   */
  get tracks(): PlayerTrackConfig[] {
    return this._tracks;
  }
  set tracks(value: PlayerTrackConfig[]) {
    this._tracks = value || [];
    this.applyTracks();
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
  get moveProgress(): { percentage: number; mouseDown: boolean } {
    return this._runtimeState.moveProgress;
  }
  get _isSeeking(): boolean {
    return this._runtimeState.isSeeking;
  }
  set _isSeeking(v: boolean) {
    this._runtimeState.isSeeking = v;
  }
  get _wasPlayingBeforeSeek(): boolean {
    return this._runtimeState.wasPlayingBeforeSeek;
  }
  set _wasPlayingBeforeSeek(v: boolean) {
    this._runtimeState.wasPlayingBeforeSeek = v;
  }
  get _isSwitchingSource(): boolean {
    return this._runtimeState.isSwitchingSource;
  }
  set _isSwitchingSource(v: boolean) {
    this._runtimeState.isSwitchingSource = v;
  }
  get _pendingPlaybackRestore(): PlaybackSnapshot | undefined {
    return this._runtimeState.pendingPlaybackRestore;
  }
  set _pendingPlaybackRestore(v: PlaybackSnapshot | undefined) {
    this._runtimeState.pendingPlaybackRestore = v;
  }
  get controllerBarTimeId(): ReturnType<typeof setTimeout> | undefined {
    return this._runtimeState.controllerBarTimeId;
  }
  set controllerBarTimeId(v: ReturnType<typeof setTimeout> | undefined) {
    this._runtimeState.controllerBarTimeId = v;
  }
  get _isShowingErrorModal(): boolean {
    return this._errorModal.isShowing();
  }
  resetTransientState = (): void => {
    resetTransientRuntimeState(this._runtimeState);
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
  changeClarity = (e: Event): void => this._clarity.changeClarity(e);
  createClaritySelect = (): void => this._clarity.createClaritySelect();
  manifestLoaded = (levels: EngineQualityLevel[]): void => this._clarity.manifestLoaded(levels);
  hlsError = (payload: { fatal: boolean; detail: unknown }): void => this._clarity.hlsError(payload);
  applyTracks = (): void => this._subtitles.applyTracks();
  setSubtitleLanguage = (lang: string): void => this._subtitles.setSubtitleLanguage(lang);
  changeSubtitleTrack = (e: Event): void => this._subtitles.changeSubtitleTrack(e);
  createSubtitleSelect = (): void => this._subtitles.createSubtitleSelect();
  /**
   * QoE snapshot derived from the `change()` event stream since the current
   * `src` started loading — see `core/metrics.ts`.
   */
  getMetrics = (): PlayerMetrics => this._metrics.getMetrics();
  /**
   * Guarded by `_thumbnailLoadGuard` (`ranuts/utils`'s `createRaceGuard` —
   * the same bump-and-compare pattern `r-loading`'s async variant loading
   * uses) — if `thumbnails` changes again before this fetch resolves, the
   * stale response is dropped instead of overwriting the newer manifest's cues.
   */
  loadThumbnails = async (): Promise<void> => {
    const token = this._thumbnailLoadGuard.start();
    const url = this.thumbnails;
    const cues = url ? await loadThumbnailCues(url) : [];
    if (!this._thumbnailLoadGuard.isCurrent(token)) return;
    this._thumbnailCues = cues;
  };
  updatePlayer = (): void => {
    // 重置清晰度状态，避免旧数据干扰新视频的 manifest 加载
    resetSourceContextState(this.ctx);
    this._metrics.onLoadStart();
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
      this._engine = loadVideoSource({
        video: this._video,
        src: this.src,
        format: this.format,
        existingEngine: this._engine,
        onLevelsReady: this.manifestLoaded,
        onEngineError: this.hlsError,
      });
      if (!this._container.contains(this._video)) {
        this._container.appendChild(this._video);
      }
      this._video.parentElement?.setAttribute('class', 'ran-player-contain');
      this.listenEvent();
      this.applyTracks();
    } catch (error) {
      if (this.debug) console.warn('r-player update player error:', error);
    }
  };
  showErrorModal = (message: string): void => this._errorModal.show(message);
  change = (name: string, value: unknown): void => {
    const currentTime = this.getCurrentTime();
    const duration = this.getTotalTime();
    this._metrics.record(name, value);
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
  getMediaHandlers = (): PlayerMediaHandlers => this._mediaHandlers;
  clearListenerEvent = (): void => {
    if (!this._video) return;
    if (typeof this._video.removeEventListener !== 'function') return;
    unbindMediaEvents(this._video, this.getMediaHandlers());
  };
  listenEvent = (): void => {
    if (!this._video) return;
    this.clearListenerEvent();
    bindMediaEvents(this._video, this.getMediaHandlers());
  };
  showControllerBar = (e?: MouseEvent): void => this._chrome.showControllerBar(e);
  setLoadingState = (loading: boolean): void => this._chrome.setLoadingState(loading);
  dispatchClickPlayerContainerAction = (e: Event): void => this._chrome.dispatchClickPlayerContainerAction(e);
  SpaceKeyDown = (e: KeyboardEvent): void => this._chrome.SpaceKeyDown(e);
  dispatchClickPlayerBtnAction = (e: Event): void => this._chrome.dispatchClickPlayerBtnAction(e);
  onPlayBtnKeydown = (e: KeyboardEvent): void => this._chrome.onPlayBtnKeydown(e);
  onFullScreenKeydown = (e: KeyboardEvent): void => this._chrome.onFullScreenKeydown(e);
  changeVolumeProgress = (e: Event): void => this._chrome.changeVolumeProgress(e);
  customRequestFullscreen = (): Promise<void> => this._chrome.customRequestFullscreen();
  customExitFullscreen = (): Promise<void> => this._chrome.customExitFullscreen();
  openFullScreen = (): void => this._chrome.openFullScreen();
  syncPipButtonVisibility = (): void => this._chrome.syncPipButtonVisibility();
  togglePip = (): void => this._chrome.togglePip();
  syncRemoteButtonVisibility = (): void => this._chrome.syncRemoteButtonVisibility();
  showRemotePlaybackPicker = (): void => this._chrome.showRemotePlaybackPicker();
  changeSpeed = (e: Event): void => this._chrome.changeSpeed(e);
  changePlayerVolume = (): void => this._chrome.changePlayerVolume();
  resize = (): void => this._chrome.resize();
  onVisibilityChange = (): void => this._chrome.onVisibilityChange();
  fullScreenChange = (): void => this._chrome.fullScreenChange();
  updateBufferedProgress = (): void => this._seek.updateBufferedProgress();
  syncProgressByPercentage = (percentage: number): void => this._seek.syncProgressByPercentage(percentage);
  seekToPercentage = (percentage: number): void => this._seek.seekToPercentage(percentage);
  progressClick = (e: MouseEvent): void => this._seek.progressClick(e);
  onProgressKeydown = (e: KeyboardEvent): void => this._seek.onProgressKeydown(e);
  progressDotMouseDown = (): void => this._seek.progressDotMouseDown();
  progressDotMouseMove = (e: MouseEvent): void => this._seek.progressDotMouseMove(e);
  progressDotMouseMoveDocument = (e: MouseEvent): void => this._seek.progressDotMouseMoveDocument(e);
  progressDotMouseUp = (): void => this._seek.progressDotMouseUp();
  requestAnimationFrame = (fn: Function): void => this._seek.requestAnimationFrame(fn);
  cancelAnimationFrame = (): void => this._seek.cancelAnimationFrame();
  updateCurrentProgress = (): void => this._seek.updateCurrentProgress();
  progressMouseEnter = (e: MouseEvent): void => this._seek.progressMouseEnter(e);
  progressMouseLeave = (e: MouseEvent): void => this._seek.progressMouseLeave(e);
  progressMouseMove = (e: MouseEvent): void => this._seek.progressMouseMove(e);
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
      remoteBtn: this._playControllerBottomRemote,
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
      onRemoteClick: this.showRemotePlaybackPicker,
      onVisibilityChange: this.onVisibilityChange,
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
    this._gestures = attachGestureHandlers(this.getGestureDeps());
    // `updatePlayer()` must run first — it's what creates `this._video`, and
    // `syncRemoteButtonVisibility()` needs a real element to probe
    // `.remote`/`.webkitShowPlaybackTargetPicker` on (unlike `isPipSupported()`,
    // which only reads the document-level `pictureInPictureEnabled` and
    // tolerates an undefined video, calling it before the video existed went
    // unnoticed — but it always fell back to `false`, permanently hiding the
    // cast button even in a fully supporting browser).
    this._didInitialConnect = true;
    this.updatePlayer();
    this.syncPipButtonVisibility();
    this.syncRemoteButtonVisibility();
  }
  disconnectedCallback(): void {
    this._events.abort();
    this.disposeEffects();
    this._gestures?.destroy();
    this._gestures = undefined;
    this.clearListenerEvent();
    this._engine?.destroy();
    this._engine = undefined;
    this.cancelAnimationFrame();
    this.resetTransientState();
    this._isSwitchingSource = false;
    this.setLoadingState(false);
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if ((k === 'src' || k === 'format') && o !== n) {
      // Guarded on having connected at least once already: `src` set
      // *before* the element is inserted (`document.createElement('r-player')`
      // + `el.src = url` + `container.appendChild(el)` — a completely normal
      // way to build one programmatically) fires this callback synchronously
      // while still disconnected, and `connectedCallback` runs right after
      // and calls `updatePlayer()` itself, reading the (already current)
      // attribute. Calling `updatePlayer()` here too for that same initial
      // state fired a second, redundant `engine.load()` a tick before the
      // first in-flight manifest fetch's `destroy()` could reliably cancel
      // it — occasionally racing past the destroy and still resolving, which
      // built the clarity/quality `<r-select>` (and its portaled dropdown
      // panel) twice, leaking one every time. The same double-fire happens
      // for plain parsed HTML too (`<r-player src="...">`), since the Custom
      // Elements upgrade algorithm enqueues attributeChangedCallback for
      // every already-present attribute *and* connectedCallback as part of
      // the same reaction batch, in that order — so this flag (not
      // `isConnected`, which can already be true during that same batch)
      // is what actually distinguishes "the initial connect hasn't run its
      // own updatePlayer() yet" from "src changed on an already-running
      // player," which must still reload immediately.
      if (this._didInitialConnect) this.updatePlayer();
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
    if (k === 'thumbnails' && o !== n) {
      void this.loadThumbnails();
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
