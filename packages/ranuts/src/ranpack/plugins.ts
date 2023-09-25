interface PluginItem {
  name: string;
  exec: Function;
}

// pre-alias
// alias
// modulepreload-polyfill
// optimized-deps
// resolve

interface Plugin {
  [x: string]: (() => void) | undefined | string;
  name: string;
  // input
  options?: () => void;
  buildStart?: () => void;
  resolvedId?: () => void;
  load?: () => void;
  transform?: () => void;
  moduleParsed?: () => void;
  resolveDynamicImport?: () => void;
  watchChange?: () => void;
  closeWatcher?: () => void;
  buildEnd?: () => void;
  // output
  renderStart?: () => void;
  generateBundle?: () => void;
  closeBundle?: () => void;
}

class PluginHooks {
  [x: string]: Array<PluginItem>;
  constructor() {
    // input
    this.option = [];
    this.buildStart = [];
    this.resolvedId = [];
    this.load = [];
    this.transform = [];
    this.moduleParsed = [];
    this.resolveDynamicImport = [];
    this.watchChange = [];
    this.closeWatcher = [];
    this.buildEnd = [];
    // output
    this.renderStart = [];
    this.generateBundle = [];
    this.closeBundle = [];
  }
}

class Plugins {
  pluginHooks: PluginHooks;
  constructor(plugins = []) {
    this.pluginHooks = new PluginHooks();
    plugins.forEach((plugin) => this.register(plugin));
  }
  register = (plugin: Plugin): void => {
    const { name, ...hooks } = plugin;
    Object.keys(hooks).forEach((hook) => {
      const exec = plugin[hook];
      if (exec instanceof Function) {
        this.pluginHooks[hook]?.push({ name, exec });
      }
    });
  };
}

export default Plugins;
