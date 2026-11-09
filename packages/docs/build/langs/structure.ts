import type { SidebarNode } from './types.ts';
import { EDITOR, GITHUB } from '../common/index.ts';
import { DESIGN_REFERENCE, DESIGN_REFERENCE_LINKS } from './design-pages.ts';

/**
 * The site's navigation, once, without language or locale prefix.
 *
 * Every locale renders this same tree: `build.ts` swaps in that locale's label strings
 * (from `messages/`) and prefixes each link. Before this existed the tree was copy-pasted
 * per language — two ~500-line files that had to be edited in lockstep, which does not
 * survive eight languages.
 *
 * Paths here are locale-agnostic public URLs (`/ranui/`). Do not hard-code `/cn` or any
 * other prefix; `nav.ts` adds it via `localeHref` + `publicUrl`, and only for locales that
 * actually mirror the page. Source files still live under `src/` (see `locales.ts` mirrors).
 */

/** The product: the three pillars and the agent workflow. */
export const NAV: SidebarNode[] = [
  { kind: 'full', key: 'ran_design', link: '/design/', activeMatch: '/design/' },
  { kind: 'full', key: 'ranui', link: '/ranui/', activeMatch: '/ranui/' },
  { kind: 'full', key: 'ranuts', link: '/ranuts/', activeMatch: '/ranuts/' },
  { kind: 'full', key: 'agents', link: '/agents/', activeMatch: '/agents/' },
];

/** Reachable from every page, but not part of the product: the page footer and the drawer's end. */
export const SECONDARY_NAV: SidebarNode[] = [
  { kind: 'full', key: 'examples', link: '/examples/' },
  { kind: 'full', key: 'doc_editor', link: EDITOR },
  { kind: 'full', key: 'github', link: GITHUB },
];

export const SIDEBAR: Record<string, SidebarNode[]> = {
  '/design/': [
    { kind: 'full', key: 'overview', link: '/design/' },
    ...DESIGN_REFERENCE.map(({ key }, i) => ({ kind: 'full' as const, key, link: DESIGN_REFERENCE_LINKS[i] })),
    /* Method pages that apply beyond a single library — not ranui Foundations. */
    { kind: 'suffix', key: 'design_system', name: 'Design system', link: '/design/design-system/' },
    { kind: 'suffix', key: 'design_guidelines', name: 'Design guidelines', link: '/design/design-guides/' },
    {
      kind: 'suffix',
      key: 'information_architecture',
      name: 'Information architecture',
      link: '/design/information-architecture/',
    },
  ],
  '/ranuts/': [
    { kind: 'full', key: 'overview', link: '/ranuts/' },
    { kind: 'full', key: 'api_reference', link: '/ranuts/api' },
    { kind: 'full', key: 'choosing_a_utility', link: '/ranuts/choosing/' },
    {
      kind: 'full',
      key: 'utility_functions',
      link: '/ranuts/utils/',
      collapsed: false,
      items: [
        {
          kind: 'full',
          key: 'functional_programming',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'debounce', name: 'debounce', link: '/ranuts/utils/debounce' },
            { kind: 'dash', key: 'throttle', name: 'throttle', link: '/ranuts/utils/throttle' },
            { kind: 'dash', key: 'once_singleflight', name: 'once / singleFlight', link: '/ranuts/utils/memoize' },
            { kind: 'dash', key: 'questqueue', name: 'QuestQueue', link: '/ranuts/utils/quest_queue' },
            {
              kind: 'dash',
              key: 'withtimeout_deferred',
              name: 'withTimeout / deferred',
              link: '/ranuts/utils/with_timeout',
            },
            { kind: 'dash', key: 'noop', name: 'noop', link: '/ranuts/utils/noop' },
            { kind: 'dash', key: 'compose', name: 'compose', link: '/ranuts/utils/compose' },
          ],
        },
        {
          kind: 'full',
          key: 'string_processing',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'randomstring_getrandomstring',
              name: 'randomString / getRandomString',
              link: '/ranuts/utils/random_string',
            },
            { kind: 'dash', key: 'clearbr', name: 'clearBr', link: '/ranuts/utils/clear_br' },
            { kind: 'dash', key: 'clearstr', name: 'clearStr', link: '/ranuts/utils/clear_str' },
            { kind: 'dash', key: 'truncate', name: 'truncate', link: '/ranuts/utils/truncate' },
            { kind: 'dash', key: 'strparse', name: 'strParse', link: '/ranuts/utils/str_parse' },
            { kind: 'dash', key: 'tostring', name: 'toString', link: '/ranuts/utils/to_string' },
            { kind: 'dash', key: 'transformtext', name: 'transformText', link: '/ranuts/utils/transform_text' },
            { kind: 'dash', key: 'checkencoding', name: 'checkEncoding', link: '/ranuts/utils/check_encoding' },
            {
              kind: 'dash',
              key: 'getmatchingsentences',
              name: 'getMatchingSentences',
              link: '/ranuts/utils/get_matching_sentences',
            },
            { kind: 'dash', key: 'isstring', name: 'isString', link: '/ranuts/utils/is_string' },
            { kind: 'dash', key: 'detectlanguage', name: 'detectLanguage', link: '/ranuts/utils/detect_language' },
            { kind: 'dash', key: 'resolvelocale', name: 'resolveLocale', link: '/ranuts/utils/resolve_locale' },
            { kind: 'dash', key: 'segmentbyranges', name: 'segmentByRanges', link: '/ranuts/utils/segment' },
          ],
        },
        {
          kind: 'full',
          key: 'object_processing',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'merge_mergeexports', name: 'merge / mergeExports', link: '/ranuts/utils/merge' },
            { kind: 'dash', key: 'isequal', name: 'isEqual', link: '/ranuts/utils/is_equal' },
            { kind: 'dash', key: 'clonedeep', name: 'cloneDeep', link: '/ranuts/utils/clone_deep' },
            { kind: 'dash', key: 'querystring', name: 'querystring', link: '/ranuts/utils/querystring' },
            { kind: 'dash', key: 'filterobj', name: 'filterObj', link: '/ranuts/utils/filter_obj' },
            { kind: 'dash', key: 'formatjson', name: 'formatJson', link: '/ranuts/utils/format_json' },
          ],
        },
        {
          kind: 'full',
          key: 'number_processing',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'range_clamp_lerp_remap_smoothstep',
              name: 'range / clamp / lerp / remap / smoothstep',
              link: '/ranuts/utils/range',
            },
            { kind: 'dash', key: 'mathjs', name: 'mathjs', link: '/ranuts/utils/mathjs' },
            { kind: 'dash', key: 'pertonum', name: 'perToNum', link: '/ranuts/utils/per_to_num' },
            {
              kind: 'dash',
              key: 'transformnumber',
              name: 'transformNumber',
              link: '/ranuts/utils/transform_number',
            },
            { kind: 'dash', key: 'addnumsym', name: 'addNumSym', link: '/ranuts/utils/add_num_sym' },
            {
              kind: 'dash',
              key: 'parsechinesenumber',
              name: 'parseChineseNumber',
              link: '/ranuts/utils/parse_number',
            },
          ],
        },
        {
          kind: 'full',
          key: 'color_processing',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'hextorgb', name: 'hexToRgb', link: '/ranuts/utils/hex_to_rgb' },
            { kind: 'dash', key: 'rgbtohex', name: 'rgbToHex', link: '/ranuts/utils/rgb_to_hex' },
            { kind: 'dash', key: 'randomcolor', name: 'randomColor', link: '/ranuts/utils/random_color' },
            { kind: 'dash', key: 'color', name: 'Color', link: '/ranuts/utils/color' },
            {
              kind: 'dash',
              key: 'hextoalpha_rgbatorgb',
              name: 'hexToAlpha / rgbaToRgb',
              link: '/ranuts/utils/color',
            },
            {
              kind: 'dash',
              key: 'blendscreen_luma_cosinepalette',
              name: 'blendScreen / luma / cosinePalette',
              link: '/ranuts/utils/color',
            },
          ],
        },
        {
          kind: 'full',
          key: 'time_processing',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'formatduration_formatrelative',
              name: 'formatDuration / formatRelative',
              link: '/ranuts/utils/time_format',
            },
            {
              kind: 'dash',
              key: 'parsevtttimestamp_parsevttcuetiming',
              name: 'parseVttTimestamp / parseVttCueTiming',
              link: '/ranuts/utils/time_format',
            },
            { kind: 'dash', key: 'formatdate', name: 'formatDate', link: '/ranuts/utils/timestamp_to_time' },
            {
              kind: 'dash',
              key: 'performancetime',
              name: 'performanceTime',
              link: '/ranuts/utils/performance_time',
            },
          ],
        },
        {
          kind: 'full',
          key: 'device_detection',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'ismobile', name: 'isMobile', link: '/ranuts/utils/is_mobile' },
            { kind: 'dash', key: 'isweixin', name: 'isWeiXin', link: '/ranuts/utils/is_weixin' },
            { kind: 'dash', key: 'issafari', name: 'isSafari', link: '/ranuts/utils/is_safari' },
            { kind: 'dash', key: 'currentdevice', name: 'currentDevice', link: '/ranuts/utils/current_device' },
            {
              kind: 'dash',
              key: 'watchmediaquery',
              name: 'watchMediaQuery',
              link: '/ranuts/utils/watch_media_query',
            },
          ],
        },
        {
          kind: 'full',
          key: 'dom_manipulation',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'addclasstoelement',
              name: 'addClassToElement',
              link: '/ranuts/utils/add_class_to_element',
            },
            {
              kind: 'dash',
              key: 'removeclasstoelement',
              name: 'removeClassToElement',
              link: '/ranuts/utils/remove_class_to_element',
            },
            {
              kind: 'dash',
              key: 'createdocumentfragment',
              name: 'createDocumentFragment',
              link: '/ranuts/utils/create_document_fragment',
            },
            { kind: 'dash', key: 'escapehtml', name: 'escapeHtml', link: '/ranuts/utils/escape_html' },
            { kind: 'dash', key: 'chain', name: 'Chain', link: '/ranuts/utils/chain' },
            { kind: 'dash', key: 'create', name: 'create', link: '/ranuts/utils/create' },
            {
              kind: 'dash',
              key: 'eventmanager_createdoubletapdetector',
              name: 'EventManager / createDoubleTapDetector',
              link: '/ranuts/utils/event_manager',
            },
            { kind: 'dash', key: 'adoptstyles', name: 'adoptStyles', link: '/ranuts/utils/adopt_styles' },
            { kind: 'dash', key: 'computeplacement', name: 'computePlacement', link: '/ranuts/utils/placement' },
            {
              kind: 'dash',
              key: 'setfontsize2html',
              name: 'setFontSize2html',
              link: '/ranuts/utils/set_font_size',
            },
          ],
        },
        {
          kind: 'full',
          key: 'storage',
          collapsed: true,
          items: [
            { kind: 'full', key: 'localstorage_helpers_safe_storage', link: '/ranuts/utils/local_storage' },
            { kind: 'dash', key: 'createstore', name: 'createStore', link: '/ranuts/utils/local_storage' },
            { kind: 'dash', key: 'webdb', name: 'WebDB', link: '/ranuts/utils/web_db' },
            { kind: 'dash', key: 'createhandoff', name: 'createHandoff', link: '/ranuts/utils/create_handoff' },
            { kind: 'dash', key: 'readfileas', name: 'readFileAs*', link: '/ranuts/utils/read_file' },
            { kind: 'dash', key: 'zip', name: 'zip', link: '/ranuts/utils/zip' },
          ],
        },
        {
          kind: 'full',
          key: 'url_query',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'getallquerystring',
              name: 'getAllQueryString',
              link: '/ranuts/utils/get_all_query_string',
            },
            {
              kind: 'dash',
              key: 'queryflag_isiniframe',
              name: 'queryFlag / isInIframe',
              link: '/ranuts/utils/query_flag',
            },
            { kind: 'dash', key: 'encodeurl', name: 'encodeUrl', link: '/ranuts/utils/encode_url' },
            { kind: 'dash', key: 'appendurl', name: 'appendUrl', link: '/ranuts/utils/append_url' },
            { kind: 'dash', key: 'createlocalepath', name: 'createLocalePath', link: '/ranuts/utils/locale_path' },
          ],
        },
        {
          kind: 'full',
          key: 'cookie',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getcookie', name: 'getCookie', link: '/ranuts/utils/get_cookie' },
            {
              kind: 'dash',
              key: 'getcookiebyname',
              name: 'getCookieByName',
              link: '/ranuts/utils/get_cookie_by_name',
            },
          ],
        },
        {
          kind: 'full',
          key: 'image_processing',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'convertimagetobase64',
              name: 'convertImageToBase64',
              link: '/ranuts/utils/convert_image_to_base64',
            },
            { kind: 'dash', key: 'isimagesize', name: 'isImageSize', link: '/ranuts/utils/is_image_size' },
            {
              kind: 'dash',
              key: 'getimage_cutround_opacity',
              name: 'getImage / cutRound / opacity',
              link: '/ranuts/utils/image_process',
            },
          ],
        },
        {
          kind: 'full',
          key: 'media',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'audiorecorder', name: 'AudioRecorder', link: '/ranuts/utils/audio_recorder' },
            {
              kind: 'dash',
              key: 'createspeechrecognizer',
              name: 'createSpeechRecognizer',
              link: '/ranuts/utils/speech',
            },
          ],
        },
        {
          kind: 'full',
          key: 'performance',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getperformance', name: 'getPerformance', link: '/ranuts/utils/get_performance' },
            { kind: 'dash', key: 'getframe', name: 'getFrame', link: '/ranuts/utils/get_frame' },
            { kind: 'dash', key: 'getpixelratio', name: 'getPixelRatio', link: '/ranuts/utils/get_pixel_ratio' },
          ],
        },
        {
          kind: 'full',
          key: 'network',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'imagerequest', name: 'imageRequest', link: '/ranuts/utils/image_request' },
            { kind: 'dash', key: 'networkspeed', name: 'networkSpeed', link: '/ranuts/utils/network_speed' },
            { kind: 'dash', key: 'connection', name: 'connection', link: '/ranuts/utils/connection' },
            { kind: 'dash', key: 'getstatus_status', name: 'getStatus / status', link: '/ranuts/utils/status' },
            { kind: 'dash', key: 'prefetch', name: 'prefetch', link: '/ranuts/utils/prefetch' },
            { kind: 'dash', key: 'workerclient', name: 'WorkerClient', link: '/ranuts/utils/worker_client' },
            { kind: 'dash', key: 'paginatetext', name: 'paginateText', link: '/ranuts/utils/paginate' },
          ],
        },
        {
          kind: 'full',
          key: 'browser',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getwindow', name: 'getWindow', link: '/ranuts/utils/get_window' },
            { kind: 'dash', key: 'report', name: 'report', link: '/ranuts/utils/report' },
            { kind: 'dash', key: 'handleconsole', name: 'handleConsole', link: '/ranuts/utils/handle_console' },
            {
              kind: 'dash',
              key: 'createobjecturl_requesturltobuffer',
              name: 'createObjectURL / requestUrlToBuffer',
              link: '/ranuts/utils/create_object_url',
            },
          ],
        },
        {
          kind: 'full',
          key: 'script_loading',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'scriptonload', name: 'scriptOnLoad', link: '/ranuts/utils/script_on_load' },
            { kind: 'dash', key: 'loadscript', name: 'loadScript', link: '/ranuts/utils/load_script' },
          ],
        },
        {
          kind: 'full',
          key: 'error_handling',
          collapsed: true,
          items: [
            {
              kind: 'dash',
              key: 'handleconsole_intercept',
              name: 'handleConsole',
              link: '/ranuts/utils/handle_console',
            },
            { kind: 'dash', key: 'handleerror', name: 'handleError', link: '/ranuts/utils/handle_error' },
            {
              kind: 'dash',
              key: 'handlefetchhook',
              name: 'handleFetchHook',
              link: '/ranuts/utils/handle_fetch_hook',
            },
          ],
        },
        {
          kind: 'full',
          key: 'others',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'totp', name: 'TOTP', link: '/ranuts/utils/totp' },
            { kind: 'dash', key: 'createsignal', name: 'createSignal', link: '/ranuts/utils/create_signal' },
            { kind: 'dash', key: 'setmime_mimetype', name: 'setMime / MimeType', link: '/ranuts/utils/set_mime' },
            { kind: 'dash', key: 'getextensions', name: 'getExtensions', link: '/ranuts/utils/get_extensions' },
            { kind: 'dash', key: 'synchook', name: 'SyncHook', link: '/ranuts/utils/sync_hook' },
            {
              kind: 'dash',
              key: 'durationhandler',
              name: 'durationHandler',
              link: '/ranuts/utils/duration_handler',
            },
          ],
        },
      ],
    },
    {
      kind: 'full',
      key: 'mime_type',
      collapsed: true,
      items: [{ kind: 'dash', key: 'getmime', name: 'getMime', link: '/ranuts/mime_type/mime_type' }],
    },
    {
      kind: 'full',
      key: 'canvas_animation',
      collapsed: true,
      items: [
        { kind: 'full', key: 'canvas_2d_geometry_paths_gradients', link: '/ranuts/utils/canvas' },
        { kind: 'dash', key: 'tween', name: 'tween', link: '/ranuts/utils/tween' },
        { kind: 'dash', key: 'motion', name: 'spring / stagger / observeEntry', link: '/ranuts/utils/motion' },
      ],
    },
    {
      kind: 'full',
      key: 'i18n',
      collapsed: true,
      items: [{ kind: 'full', key: 'internationalisation_engine', link: '/ranuts/i18n/' }],
    },
    {
      kind: 'full',
      key: '2d_rendering_visual',
      collapsed: true,
      items: [{ kind: 'full', key: 'rendering_engine', link: '/ranuts/visual/' }],
    },
    {
      kind: 'full',
      key: 'virtual_dom_vnode',
      collapsed: true,
      items: [{ kind: 'full', key: 'virtual_dom', link: '/ranuts/vnode/' }],
    },
    {
      kind: 'full',
      key: 'streaming_stream',
      collapsed: true,
      items: [{ kind: 'full', key: 'streaming_model_responses', link: '/ranuts/stream/' }],
    },
    {
      kind: 'full',
      key: 'conversation_conversation',
      collapsed: true,
      items: [{ kind: 'full', key: 'event_log_to_nodes', link: '/ranuts/conversation/' }],
    },
    {
      kind: 'full',
      key: 'service_worker_sw',
      collapsed: true,
      items: [{ kind: 'full', key: 'caching_precache', link: '/ranuts/sw/' }],
    },
    {
      kind: 'full',
      key: 'bridge_postmessage',
      collapsed: true,
      items: [{ kind: 'full', key: 'cross_context_messaging', link: '/ranuts/bridge/' }],
    },
  ],
  '/examples/': [
    { kind: 'full', key: 'overview', link: '/examples/' },
    { kind: 'full', key: 'chat_composer', link: '/examples/chat-composer' },
    { kind: 'full', key: 'overlay_form', link: '/examples/overlay-form' },
    { kind: 'full', key: 'content_render', link: '/examples/content-render' },
    { kind: 'full', key: 'build_ai_chat', link: '/ranui/ai-chat/' },
  ],
  '/ranui/': [
    { kind: 'suffix', key: 'ranui_overview', name: 'Overview', link: '/ranui/' },
    { kind: 'full', key: 'examples', link: '/examples/' },
    { kind: 'full', key: 'element_api_all_43_elements', link: '/ranui/api' },
    { kind: 'full', key: 'style_tokens_parts', link: '/ranui/style-tokens' },
    { kind: 'suffix', key: 'changelog', name: 'Changelog', link: '/ranui/changelog' },
    {
      kind: 'full',
      key: 'foundations',
      items: [
        { kind: 'suffix', key: 'coding_guidelines', name: 'Coding guidelines', link: '/ranui/coding-guides/' },
        { kind: 'full', key: 'theming', link: '/ranui/theme/' },
        { kind: 'suffix', key: 'themeswitch', name: 'ThemeSwitch', link: '/ranui/theme-switch/' },
        { kind: 'suffix', key: 'surfaceswitch', name: 'SurfaceSwitch', link: '/ranui/surface-switch/' },
        { kind: 'suffix', key: 'menubar', name: 'Menubar', link: '/ranui/menubar/' },
        { kind: 'suffix', key: 'ranui_i18n_foundation', name: 'i18n', link: '/ranui/i18n/' },
        { kind: 'suffix', key: 'builder', name: 'Builder', link: '/ranui/builder/' },
        { kind: 'full', key: 'server_rendering', link: '/ranui/ssr/' },
      ],
    },
    {
      kind: 'full',
      key: 'common',
      items: [
        { kind: 'suffix', key: 'button', name: 'Button', link: '/ranui/button/' },
        { kind: 'suffix', key: 'icon', name: 'Icon', link: '/ranui/icon/' },
        { kind: 'suffix', key: 'loading', name: 'Loading', link: '/ranui/loading/' },
      ],
    },
    {
      kind: 'full',
      key: 'data_presentation',
      items: [
        { kind: 'suffix', key: 'image', name: 'Image', link: '/ranui/image/' },
        { kind: 'suffix', key: 'math', name: 'Math', link: '/ranui/math/' },
        { kind: 'suffix', key: 'mermaid', name: 'Mermaid', link: '/ranui/mermaid/' },
        { kind: 'suffix', key: 'markdown', name: 'Markdown', link: '/ranui/markdown/' },
        { kind: 'suffix', key: 'conversation', name: 'Conversation', link: '/ranui/conversation/' },
        { kind: 'full', key: 'build_ai_chat', link: '/ranui/ai-chat/' },
        { kind: 'suffix', key: 'toolcard', name: 'ToolCard', link: '/ranui/tool-card/' },
        { kind: 'suffix', key: 'reasoning', name: 'Reasoning', link: '/ranui/reasoning/' },
        { kind: 'suffix', key: 'statedot', name: 'StateDot', link: '/ranui/state-dot/' },
        { kind: 'suffix', key: 'disclosurerow', name: 'DisclosureRow', link: '/ranui/disclosure-row/' },
        { kind: 'suffix', key: 'tokenmeter', name: 'TokenMeter', link: '/ranui/token-meter/' },
        { kind: 'suffix', key: 'checkbox', name: 'CheckBox', link: '/ranui/checkbox/' },
        { kind: 'suffix', key: 'tabs', name: 'Tabs', link: '/ranui/tab/' },
        { kind: 'suffix', key: 'preview', name: 'Preview', link: '/ranui/preview/' },
        { kind: 'suffix', key: 'radar', name: 'Radar', link: '/ranui/radar/' },
        { kind: 'suffix', key: 'select', name: 'Select', link: '/ranui/select/' },
        { kind: 'suffix', key: 'player', name: 'Player', link: '/ranui/player/' },
        { kind: 'suffix', key: 'progress', name: 'Progress', link: '/ranui/progress/' },
        { kind: 'suffix', key: 'popover', name: 'Popover', link: '/ranui/popover/' },
        { kind: 'suffix', key: 'dropdown', name: 'Dropdown', link: '/ranui/dropdown/' },
        { kind: 'suffix', key: 'card', name: 'Card', link: '/ranui/card/' },
        { kind: 'suffix', key: 'glass', name: 'Glass', link: '/ranui/glass/' },
        { kind: 'suffix', key: 'fangallery', name: 'FanGallery', link: '/ranui/fan-gallery/' },
        { kind: 'suffix', key: 'section', name: 'Section', link: '/ranui/section/' },
        { kind: 'suffix', key: 'scratch', name: 'Scratch', link: '/ranui/scratch/' },
      ],
    },
    {
      kind: 'full',
      key: 'data_entry',
      items: [
        { kind: 'suffix', key: 'input', name: 'Input', link: '/ranui/input/' },
        { kind: 'suffix', key: 'voicebutton', name: 'VoiceButton', link: '/ranui/voice-button/' },
        { kind: 'suffix', key: 'attachments', name: 'Attachments', link: '/ranui/attachments/' },
        { kind: 'suffix', key: 'form', name: 'Form', link: '/ranui/form/' },
        { kind: 'suffix', key: 'colorpicker', name: 'ColorPicker', link: '/ranui/colorpicker/' },
      ],
    },
    {
      kind: 'full',
      key: 'feedback',
      items: [
        { kind: 'suffix', key: 'message', name: 'Message', link: '/ranui/message/' },
        { kind: 'suffix', key: 'skeleton', name: 'Skeleton', link: '/ranui/skeleton/' },
        { kind: 'suffix', key: 'modal', name: 'Modal', link: '/ranui/modal/' },
      ],
    },
    {
      kind: 'full',
      key: 'navigation',
      items: [
        { kind: 'suffix', key: 'router', name: 'Router', link: '/ranui/router/' },
        { kind: 'suffix', key: 'route', name: 'Route', link: '/ranui/route/' },
        { kind: 'suffix', key: 'link', name: 'Link', link: '/ranui/link/' },
      ],
    },
  ],
};
