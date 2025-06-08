import { loadScript } from '@/utils/index';

// OnlyOffice 资源路径配置
const RESOURCE_PATHS = {
  // 核心资源
  core: {
    js: '/assets/js/seoffice.js',
    css: '/assets/css/onlyoffice.css',
  },
  // 编辑器资源
  editor: {
    js: '/assets/js/editor.js',
    css: '/assets/css/editor.css',
  },
  // 字体资源
  fonts: '/assets/fonts/',
  // 主题资源
  themes: '/assets/themes/',
};

// 资源加载状态
const loadedResources = new Set<string>();

/**
 * 加载 CSS 文件
 */
async function loadCSS(url: string): Promise<void> {
  if (loadedResources.has(url)) return;

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => {
      loadedResources.add(url);
      resolve();
    };
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * 加载 JS 文件
 */
async function loadJS(url: string): Promise<void> {
  if (loadedResources.has(url)) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      loadedResources.add(url);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 加载所有必要的资源
 */
export async function loadResources(): Promise<void> {
  try {
    // 加载核心资源
    await Promise.all([loadCSS(RESOURCE_PATHS.core.css), loadJS(RESOURCE_PATHS.core.js)]);

    // 加载编辑器资源
    await Promise.all([loadCSS(RESOURCE_PATHS.editor.css), loadJS(RESOURCE_PATHS.editor.js)]);

    console.log('All OnlyOffice resources loaded successfully');
  } catch (error) {
    console.error('Failed to load OnlyOffice resources:', error);
    throw error;
  }
}

/**
 * 获取资源路径
 */
export function getResourcePath(type: keyof typeof RESOURCE_PATHS): string {
  return RESOURCE_PATHS[type];
}
