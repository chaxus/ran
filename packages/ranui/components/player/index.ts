import { Player } from './player';

// 导出类型
export * from './types';

// 导出主类
export { Player };

// 自动注册组件
function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-player')) {
    customElements.define('r-player', Player);
    return Player;
  }
}

export default Custom();
