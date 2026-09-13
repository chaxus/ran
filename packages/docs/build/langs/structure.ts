import type { SidebarNode } from './types.ts';
import { EDITOR } from '../common/index.ts';

/**
 * The site's navigation, once, without language or locale prefix.
 *
 * Every locale renders this same tree: `build.ts` swaps in that locale's label strings
 * (from `messages/`) and prefixes each link. Before this existed the tree was copy-pasted
 * per language — two ~500-line files that had to be edited in lockstep, which does not
 * survive eight languages.
 *
 * Paths here are locale-agnostic (`/src/ranui/`). Do not hard-code `/cn` or any other
 * prefix; `buildThemeConfig` adds it, and only for locales that actually mirror the page.
 */

/** Shared by `/src/article/` and `/src/note/` — sidebars are matched by path prefix. */
const articleSidebar: SidebarNode[] = [
  {
    items: [
      { kind: 'full', key: 'how_ai_agents_work', link: '/src/article/ai/' },
      { kind: 'full', key: 'article_functional_programming', link: '/src/article/functional_programming' },
      { kind: 'full', key: 'web_document_preview', link: '/src/article/doc_preview' },
      { kind: 'full', key: 'web_video_encryption', link: '/src/article/video' },
      { kind: 'full', key: 'visual_rendering_engine', link: '/src/article/visual' },
      {
        kind: 'full',
        key: 'sorting_algorithm',
        link: '/src/article/sort/',
        collapsed: true,
        items: [
          { kind: 'full', key: 'bubble_sort', link: '/src/article/sort/bubble/' },
          { kind: 'full', key: 'selection_sort', link: '/src/article/sort/select/' },
          { kind: 'full', key: 'insertion_sort', link: '/src/article/sort/insert/' },
          { kind: 'full', key: 'shell_sort', link: '/src/article/sort/shell/' },
          { kind: 'full', key: 'merge_sort', link: '/src/article/sort/merge/' },
          { kind: 'full', key: 'quick_sort', link: '/src/article/sort/quick/' },
          { kind: 'full', key: 'heap_sort', link: '/src/article/sort/heap/' },
          { kind: 'full', key: 'counting_sort', link: '/src/article/sort/count/' },
          { kind: 'full', key: 'bucket_sort', link: '/src/article/sort/bucket/' },
          { kind: 'full', key: 'radix_sort', link: '/src/article/sort/radix/' },
        ],
      },
      {
        kind: 'full',
        key: 'article_math',
        collapsed: true,
        items: [{ kind: 'full', key: 'linear_algebra', link: '/src/article/math/linear_algebra' }],
      },
      {
        kind: 'full',
        key: 'notes',
        collapsed: true,
        items: [
          { kind: 'full', key: 'compiling_libreoffice_to_webassembly', link: '/src/note/libreoffice2wasm' },
          { kind: 'full', key: 'centos', link: '/src/note/centos' },
          { kind: 'full', key: 'docker', link: '/src/note/docker' },
        ],
      },
    ],
  },
];

export const NAV: SidebarNode[] = [
  { kind: 'full', key: 'home', link: '/' },
  { kind: 'full', key: 'ranui', link: '/src/ranui/', activeMatch: '/src/ranui/' },
  { kind: 'full', key: 'ranuts', link: '/src/ranuts/', activeMatch: '/src/ranuts/' },
  { kind: 'full', key: 'articles', link: '/src/article/doc_preview', activeMatch: '/src/(article|note)/' },
  { kind: 'full', key: 'doc_editor', link: EDITOR },
];

export const SIDEBAR: Record<string, SidebarNode[]> = {
  '/src/ranuts/': [
    { kind: 'full', key: 'overview', link: '/src/ranuts/' },
    { kind: 'full', key: 'api_reference_all_454_exports', link: '/src/ranuts/api' },
    { kind: 'full', key: 'choosing_a_utility', link: '/src/ranuts/choosing/' },
    {
      kind: 'full',
      key: 'utility_functions',
      link: '/src/ranuts/utils/',
      collapsed: false,
      items: [
        {
          kind: 'full',
          key: 'functional_programming',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'debounce', name: 'debounce', link: '/src/ranuts/utils/debounce' },
            { kind: 'dash', key: 'throttle', name: 'throttle', link: '/src/ranuts/utils/throttle' },
            { kind: 'dash', key: 'once_singleflight', name: 'once / singleFlight', link: '/src/ranuts/utils/memoize' },
            { kind: 'dash', key: 'questqueue', name: 'QuestQueue', link: '/src/ranuts/utils/quest_queue' },
            {
              kind: 'dash',
              key: 'withtimeout_deferred',
              name: 'withTimeout / deferred',
              link: '/src/ranuts/utils/with_timeout',
            },
            { kind: 'dash', key: 'noop', name: 'noop', link: '/src/ranuts/utils/noop' },
            { kind: 'dash', key: 'compose', name: 'compose', link: '/src/ranuts/utils/compose' },
          ],
        },
        {
          kind: 'full',
          key: 'string_processing',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'md5', name: 'md5', link: '/src/ranuts/utils/md5' },
            {
              kind: 'dash',
              key: 'randomstring_getrandomstring',
              name: 'randomString / getRandomString',
              link: '/src/ranuts/utils/random_string',
            },
            { kind: 'dash', key: 'clearbr', name: 'clearBr', link: '/src/ranuts/utils/clear_br' },
            { kind: 'dash', key: 'clearstr', name: 'clearStr', link: '/src/ranuts/utils/clear_str' },
            { kind: 'dash', key: 'truncate', name: 'truncate', link: '/src/ranuts/utils/truncate' },
            { kind: 'dash', key: 'strparse', name: 'strParse', link: '/src/ranuts/utils/str_parse' },
            { kind: 'dash', key: 'tostring', name: 'toString', link: '/src/ranuts/utils/to_string' },
            { kind: 'dash', key: 'transformtext', name: 'transformText', link: '/src/ranuts/utils/transform_text' },
            { kind: 'dash', key: 'checkencoding', name: 'checkEncoding', link: '/src/ranuts/utils/check_encoding' },
            {
              kind: 'dash',
              key: 'getmatchingsentences',
              name: 'getMatchingSentences',
              link: '/src/ranuts/utils/get_matching_sentences',
            },
            { kind: 'dash', key: 'isstring', name: 'isString', link: '/src/ranuts/utils/is_string' },
            { kind: 'dash', key: 'detectlanguage', name: 'detectLanguage', link: '/src/ranuts/utils/detect_language' },
            { kind: 'dash', key: 'resolvelocale', name: 'resolveLocale', link: '/src/ranuts/utils/resolve_locale' },
            { kind: 'dash', key: 'segmentbyranges', name: 'segmentByRanges', link: '/src/ranuts/utils/segment' },
          ],
        },
        {
          kind: 'full',
          key: 'object_processing',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'merge_mergeexports', name: 'merge / mergeExports', link: '/src/ranuts/utils/merge' },
            { kind: 'dash', key: 'isequal', name: 'isEqual', link: '/src/ranuts/utils/is_equal' },
            { kind: 'dash', key: 'clonedeep', name: 'cloneDeep', link: '/src/ranuts/utils/clone_deep' },
            { kind: 'dash', key: 'querystring', name: 'querystring', link: '/src/ranuts/utils/querystring' },
            { kind: 'dash', key: 'filterobj', name: 'filterObj', link: '/src/ranuts/utils/filter_obj' },
            { kind: 'dash', key: 'formatjson', name: 'formatJson', link: '/src/ranuts/utils/format_json' },
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
              link: '/src/ranuts/utils/range',
            },
            { kind: 'dash', key: 'mathjs', name: 'mathjs', link: '/src/ranuts/utils/mathjs' },
            { kind: 'dash', key: 'pertonum', name: 'perToNum', link: '/src/ranuts/utils/per_to_num' },
            {
              kind: 'dash',
              key: 'transformnumber',
              name: 'transformNumber',
              link: '/src/ranuts/utils/transform_number',
            },
            { kind: 'dash', key: 'addnumsym', name: 'addNumSym', link: '/src/ranuts/utils/add_num_sym' },
            {
              kind: 'dash',
              key: 'parsechinesenumber',
              name: 'parseChineseNumber',
              link: '/src/ranuts/utils/parse_number',
            },
          ],
        },
        {
          kind: 'full',
          key: 'color_processing',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'hextorgb', name: 'hexToRgb', link: '/src/ranuts/utils/hex_to_rgb' },
            { kind: 'dash', key: 'rgbtohex', name: 'rgbToHex', link: '/src/ranuts/utils/rgb_to_hex' },
            { kind: 'dash', key: 'randomcolor', name: 'randomColor', link: '/src/ranuts/utils/random_color' },
            { kind: 'dash', key: 'color', name: 'Color', link: '/src/ranuts/utils/color' },
            {
              kind: 'dash',
              key: 'hextoalpha_rgbatorgb',
              name: 'hexToAlpha / rgbaToRgb',
              link: '/src/ranuts/utils/color',
            },
            {
              kind: 'dash',
              key: 'blendscreen_luma_cosinepalette',
              name: 'blendScreen / luma / cosinePalette',
              link: '/src/ranuts/utils/color',
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
              link: '/src/ranuts/utils/time_format',
            },
            {
              kind: 'dash',
              key: 'parsevtttimestamp_parsevttcuetiming',
              name: 'parseVttTimestamp / parseVttCueTiming',
              link: '/src/ranuts/utils/time_format',
            },
            { kind: 'dash', key: 'formatdate', name: 'formatDate', link: '/src/ranuts/utils/timestamp_to_time' },
            {
              kind: 'dash',
              key: 'performancetime',
              name: 'performanceTime',
              link: '/src/ranuts/utils/performance_time',
            },
          ],
        },
        {
          kind: 'full',
          key: 'device_detection',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'ismobile', name: 'isMobile', link: '/src/ranuts/utils/is_mobile' },
            { kind: 'dash', key: 'isweixin', name: 'isWeiXin', link: '/src/ranuts/utils/is_weixin' },
            { kind: 'dash', key: 'isclient', name: 'isClient', link: '/src/ranuts/utils/is_client' },
            { kind: 'dash', key: 'issafari', name: 'isSafari', link: '/src/ranuts/utils/is_safari' },
            { kind: 'dash', key: 'currentdevice', name: 'currentDevice', link: '/src/ranuts/utils/current_device' },
            {
              kind: 'dash',
              key: 'watchmediaquery',
              name: 'watchMediaQuery',
              link: '/src/ranuts/utils/watch_media_query',
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
              link: '/src/ranuts/utils/add_class_to_element',
            },
            {
              kind: 'dash',
              key: 'removeclasstoelement',
              name: 'removeClassToElement',
              link: '/src/ranuts/utils/remove_class_to_element',
            },
            {
              kind: 'dash',
              key: 'createdocumentfragment',
              name: 'createDocumentFragment',
              link: '/src/ranuts/utils/create_document_fragment',
            },
            { kind: 'dash', key: 'escapehtml', name: 'escapeHtml', link: '/src/ranuts/utils/escape_html' },
            { kind: 'dash', key: 'chain', name: 'Chain', link: '/src/ranuts/utils/chain' },
            { kind: 'dash', key: 'create', name: 'create', link: '/src/ranuts/utils/create' },
            {
              kind: 'dash',
              key: 'eventmanager_createdoubletapdetector',
              name: 'EventManager / createDoubleTapDetector',
              link: '/src/ranuts/utils/event_manager',
            },
            { kind: 'dash', key: 'adoptstyles', name: 'adoptStyles', link: '/src/ranuts/utils/adopt_styles' },
            { kind: 'dash', key: 'computeplacement', name: 'computePlacement', link: '/src/ranuts/utils/placement' },
            {
              kind: 'dash',
              key: 'setfontsize2html',
              name: 'setFontSize2html',
              link: '/src/ranuts/utils/set_font_size',
            },
          ],
        },
        {
          kind: 'full',
          key: 'storage',
          collapsed: true,
          items: [
            { kind: 'full', key: 'localstorage_helpers_safe_storage', link: '/src/ranuts/utils/local_storage' },
            { kind: 'dash', key: 'createstore', name: 'createStore', link: '/src/ranuts/utils/local_storage' },
            { kind: 'dash', key: 'webdb', name: 'WebDB', link: '/src/ranuts/utils/web_db' },
            { kind: 'dash', key: 'createhandoff', name: 'createHandoff', link: '/src/ranuts/utils/create_handoff' },
            { kind: 'dash', key: 'readfileas', name: 'readFileAs*', link: '/src/ranuts/utils/read_file' },
            { kind: 'dash', key: 'zip', name: 'zip', link: '/src/ranuts/utils/zip' },
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
              link: '/src/ranuts/utils/get_all_query_string',
            },
            {
              kind: 'dash',
              key: 'queryflag_isiniframe',
              name: 'queryFlag / isInIframe',
              link: '/src/ranuts/utils/query_flag',
            },
            { kind: 'dash', key: 'encodeurl', name: 'encodeUrl', link: '/src/ranuts/utils/encode_url' },
            { kind: 'dash', key: 'appendurl', name: 'appendUrl', link: '/src/ranuts/utils/append_url' },
            { kind: 'dash', key: 'createlocalepath', name: 'createLocalePath', link: '/src/ranuts/utils/locale_path' },
          ],
        },
        {
          kind: 'full',
          key: 'cookie',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getcookie', name: 'getCookie', link: '/src/ranuts/utils/get_cookie' },
            {
              kind: 'dash',
              key: 'getcookiebyname',
              name: 'getCookieByName',
              link: '/src/ranuts/utils/get_cookie_by_name',
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
              link: '/src/ranuts/utils/convert_image_to_base64',
            },
            { kind: 'dash', key: 'isimagesize', name: 'isImageSize', link: '/src/ranuts/utils/is_image_size' },
            {
              kind: 'dash',
              key: 'getimage_cutround_opacity',
              name: 'getImage / cutRound / opacity',
              link: '/src/ranuts/utils/image_process',
            },
          ],
        },
        {
          kind: 'full',
          key: 'media',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'audiorecorder', name: 'AudioRecorder', link: '/src/ranuts/utils/audio_recorder' },
            {
              kind: 'dash',
              key: 'createspeechrecognizer',
              name: 'createSpeechRecognizer',
              link: '/src/ranuts/utils/speech',
            },
          ],
        },
        {
          kind: 'full',
          key: 'performance',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getperformance', name: 'getPerformance', link: '/src/ranuts/utils/get_performance' },
            { kind: 'dash', key: 'getframe', name: 'getFrame', link: '/src/ranuts/utils/get_frame' },
            { kind: 'dash', key: 'getpixelratio', name: 'getPixelRatio', link: '/src/ranuts/utils/get_pixel_ratio' },
          ],
        },
        {
          kind: 'full',
          key: 'network',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'imagerequest', name: 'imageRequest', link: '/src/ranuts/utils/image_request' },
            { kind: 'dash', key: 'networkspeed', name: 'networkSpeed', link: '/src/ranuts/utils/network_speed' },
            { kind: 'dash', key: 'connection', name: 'connection', link: '/src/ranuts/utils/connection' },
            { kind: 'dash', key: 'getstatus_status', name: 'getStatus / status', link: '/src/ranuts/utils/status' },
            { kind: 'dash', key: 'prefetch', name: 'prefetch', link: '/src/ranuts/utils/prefetch' },
            { kind: 'dash', key: 'workerclient', name: 'WorkerClient', link: '/src/ranuts/utils/worker_client' },
            { kind: 'dash', key: 'paginatetext', name: 'paginateText', link: '/src/ranuts/utils/paginate' },
          ],
        },
        {
          kind: 'full',
          key: 'browser',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'getwindow', name: 'getWindow', link: '/src/ranuts/utils/get_window' },
            { kind: 'dash', key: 'report', name: 'report', link: '/src/ranuts/utils/report' },
            { kind: 'dash', key: 'handleconsole', name: 'handleConsole', link: '/src/ranuts/utils/handle_console' },
            {
              kind: 'dash',
              key: 'createobjecturl_requesturltobuffer',
              name: 'createObjectURL / requestUrlToBuffer',
              link: '/src/ranuts/utils/create_object_url',
            },
          ],
        },
        {
          kind: 'full',
          key: 'script_loading',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'scriptonload', name: 'scriptOnLoad', link: '/src/ranuts/utils/script_on_load' },
            { kind: 'dash', key: 'loadscript', name: 'loadScript', link: '/src/ranuts/utils/load_script' },
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
              link: '/src/ranuts/utils/handle_console',
            },
            { kind: 'dash', key: 'handleerror', name: 'handleError', link: '/src/ranuts/utils/handle_error' },
            {
              kind: 'dash',
              key: 'handlefetchhook',
              name: 'handleFetchHook',
              link: '/src/ranuts/utils/handle_fetch_hook',
            },
          ],
        },
        {
          kind: 'full',
          key: 'others',
          collapsed: true,
          items: [
            { kind: 'dash', key: 'totp', name: 'TOTP', link: '/src/ranuts/utils/totp' },
            { kind: 'dash', key: 'createsignal', name: 'createSignal', link: '/src/ranuts/utils/create_signal' },
            { kind: 'dash', key: 'setmime_mimetype', name: 'setMime / MimeType', link: '/src/ranuts/utils/set_mime' },
            { kind: 'dash', key: 'getextensions', name: 'getExtensions', link: '/src/ranuts/utils/get_extensions' },
            { kind: 'dash', key: 'synchook', name: 'SyncHook', link: '/src/ranuts/utils/sync_hook' },
            {
              kind: 'dash',
              key: 'durationhandler',
              name: 'durationHandler',
              link: '/src/ranuts/utils/duration_handler',
            },
            { kind: 'dash', key: 'task', name: 'task', link: '/src/ranuts/utils/task' },
          ],
        },
      ],
    },
    {
      kind: 'full',
      key: 'file_operations',
      collapsed: true,
      items: [
        { kind: 'dash', key: 'writefile', name: 'writeFile', link: '/src/ranuts/file/write_file' },
        { kind: 'dash', key: 'readfile', name: 'readFile', link: '/src/ranuts/file/read_file' },
        { kind: 'dash', key: 'readdir', name: 'readDir', link: '/src/ranuts/file/read_dir' },
        { kind: 'dash', key: 'watchfile', name: 'watchFile', link: '/src/ranuts/file/watch_file' },
        { kind: 'dash', key: 'queryfileinfo', name: 'queryFileInfo', link: '/src/ranuts/file/file_info' },
        { kind: 'dash', key: 'appendfile', name: 'appendFile', link: '/src/ranuts/file/append_file' },
      ],
    },
    {
      kind: 'full',
      key: 'mime_type',
      collapsed: true,
      items: [{ kind: 'dash', key: 'getmime', name: 'getMime', link: '/src/ranuts/mime_type/mime_type' }],
    },
    {
      kind: 'full',
      key: 'canvas_animation',
      collapsed: true,
      items: [
        { kind: 'full', key: 'canvas_2d_geometry_paths_gradients', link: '/src/ranuts/utils/canvas' },
        { kind: 'dash', key: 'tween', name: 'tween', link: '/src/ranuts/utils/tween' },
      ],
    },
    {
      kind: 'full',
      key: 'i18n',
      collapsed: true,
      items: [{ kind: 'full', key: 'internationalisation_engine', link: '/src/ranuts/i18n/' }],
    },
    {
      kind: 'full',
      key: '2d_rendering_visual',
      collapsed: true,
      items: [{ kind: 'full', key: 'rendering_engine', link: '/src/ranuts/visual/' }],
    },
    {
      kind: 'full',
      key: 'virtual_dom_vnode',
      collapsed: true,
      items: [{ kind: 'full', key: 'virtual_dom', link: '/src/ranuts/vnode/' }],
    },
    {
      kind: 'full',
      key: 'streaming_stream',
      collapsed: true,
      items: [{ kind: 'full', key: 'streaming_model_responses', link: '/src/ranuts/stream/' }],
    },
    {
      kind: 'full',
      key: 'conversation_conversation',
      collapsed: true,
      items: [{ kind: 'full', key: 'event_log_to_nodes', link: '/src/ranuts/conversation/' }],
    },
    {
      kind: 'full',
      key: 'service_worker_sw',
      collapsed: true,
      items: [{ kind: 'full', key: 'caching_precache', link: '/src/ranuts/sw/' }],
    },
    {
      kind: 'full',
      key: 'node_server',
      collapsed: true,
      items: [{ kind: 'full', key: 'http_server_router', link: '/src/ranuts/node/' }],
    },
    {
      kind: 'full',
      key: 'bridge_postmessage',
      collapsed: true,
      items: [{ kind: 'full', key: 'cross_context_messaging', link: '/src/ranuts/bridge/' }],
    },
  ],
  '/src/ranui/': [
    { kind: 'suffix', key: 'ranui_overview', name: 'Overview', link: '/src/ranui/' },
    { kind: 'full', key: 'element_api_all_40_elements', link: '/src/ranui/api' },
    { kind: 'full', key: 'style_tokens_parts', link: '/src/ranui/style-tokens' },
    { kind: 'suffix', key: 'changelog', name: 'Changelog', link: '/src/ranui/changelog' },
    {
      kind: 'full',
      key: 'foundations',
      items: [
        { kind: 'suffix', key: 'design_system', name: 'Design system', link: '/src/ranui/design-system/' },
        { kind: 'suffix', key: 'design_guidelines', name: 'Design guidelines', link: '/src/ranui/design-guides/' },
        {
          kind: 'suffix',
          key: 'information_architecture',
          name: 'Information architecture',
          link: '/src/ranui/information-architecture/',
        },
        { kind: 'suffix', key: 'coding_guidelines', name: 'Coding guidelines', link: '/src/ranui/coding-guides/' },
        { kind: 'full', key: 'theming', link: '/src/ranui/theme/' },
        { kind: 'suffix', key: 'themeswitch', name: 'ThemeSwitch', link: '/src/ranui/theme-switch/' },
        { kind: 'suffix', key: 'ranui_i18n_foundation', name: 'i18n', link: '/src/ranui/i18n/' },
        { kind: 'suffix', key: 'builder', name: 'Builder', link: '/src/ranui/builder/' },
        { kind: 'full', key: 'server_rendering', link: '/src/ranui/ssr/' },
      ],
    },
    {
      kind: 'full',
      key: 'common',
      items: [
        { kind: 'suffix', key: 'button', name: 'Button', link: '/src/ranui/button/' },
        { kind: 'suffix', key: 'icon', name: 'Icon', link: '/src/ranui/icon/' },
        { kind: 'suffix', key: 'loading', name: 'Loading', link: '/src/ranui/loading/' },
      ],
    },
    {
      kind: 'full',
      key: 'data_presentation',
      items: [
        { kind: 'suffix', key: 'image', name: 'Image', link: '/src/ranui/image/' },
        { kind: 'suffix', key: 'math', name: 'Math', link: '/src/ranui/math/' },
        { kind: 'suffix', key: 'mermaid', name: 'Mermaid', link: '/src/ranui/mermaid/' },
        { kind: 'suffix', key: 'markdown', name: 'Markdown', link: '/src/ranui/markdown/' },
        { kind: 'suffix', key: 'conversation', name: 'Conversation', link: '/src/ranui/conversation/' },
        { kind: 'suffix', key: 'toolcard', name: 'ToolCard', link: '/src/ranui/tool-card/' },
        { kind: 'suffix', key: 'reasoning', name: 'Reasoning', link: '/src/ranui/reasoning/' },
        { kind: 'suffix', key: 'statedot', name: 'StateDot', link: '/src/ranui/state-dot/' },
        { kind: 'suffix', key: 'disclosurerow', name: 'DisclosureRow', link: '/src/ranui/disclosure-row/' },
        { kind: 'suffix', key: 'tokenmeter', name: 'TokenMeter', link: '/src/ranui/token-meter/' },
        { kind: 'suffix', key: 'checkbox', name: 'CheckBox', link: '/src/ranui/checkbox/' },
        { kind: 'suffix', key: 'tabs', name: 'Tabs', link: '/src/ranui/tab/' },
        { kind: 'suffix', key: 'preview', name: 'Preview', link: '/src/ranui/preview/' },
        { kind: 'suffix', key: 'radar', name: 'Radar', link: '/src/ranui/radar/' },
        { kind: 'suffix', key: 'select', name: 'Select', link: '/src/ranui/select/' },
        { kind: 'suffix', key: 'player', name: 'Player', link: '/src/ranui/player/' },
        { kind: 'suffix', key: 'progress', name: 'Progress', link: '/src/ranui/progress/' },
        { kind: 'suffix', key: 'popover', name: 'Popover', link: '/src/ranui/popover/' },
        { kind: 'suffix', key: 'dropdown', name: 'Dropdown', link: '/src/ranui/dropdown/' },
        { kind: 'suffix', key: 'card', name: 'Card', link: '/src/ranui/card/' },
        { kind: 'suffix', key: 'glass', name: 'Glass', link: '/src/ranui/glass/' },
        { kind: 'suffix', key: 'section', name: 'Section', link: '/src/ranui/section/' },
        { kind: 'suffix', key: 'scratch', name: 'Scratch', link: '/src/ranui/scratch/' },
      ],
    },
    {
      kind: 'full',
      key: 'data_entry',
      items: [
        { kind: 'suffix', key: 'input', name: 'Input', link: '/src/ranui/input/' },
        { kind: 'suffix', key: 'voicebutton', name: 'VoiceButton', link: '/src/ranui/voice-button/' },
        { kind: 'suffix', key: 'attachments', name: 'Attachments', link: '/src/ranui/attachments/' },
        { kind: 'suffix', key: 'form', name: 'Form', link: '/src/ranui/form/' },
        { kind: 'suffix', key: 'colorpicker', name: 'ColorPicker', link: '/src/ranui/colorpicker/' },
      ],
    },
    {
      kind: 'full',
      key: 'feedback',
      items: [
        { kind: 'suffix', key: 'message', name: 'Message', link: '/src/ranui/message/' },
        { kind: 'suffix', key: 'skeleton', name: 'Skeleton', link: '/src/ranui/skeleton/' },
        { kind: 'suffix', key: 'modal', name: 'Modal', link: '/src/ranui/modal/' },
      ],
    },
    {
      kind: 'full',
      key: 'navigation',
      items: [
        { kind: 'suffix', key: 'router', name: 'Router', link: '/src/ranui/router/' },
        { kind: 'suffix', key: 'route', name: 'Route', link: '/src/ranui/route/' },
        { kind: 'suffix', key: 'link', name: 'Link', link: '/src/ranui/link/' },
      ],
    },
  ],
  '/src/article/': articleSidebar,
  '/src/note/': articleSidebar,
};
