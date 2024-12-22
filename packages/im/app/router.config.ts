/**
 * 路由配置： '${method}=>${path}: ${controller}#${controllerMethod}#${env}'
 * method: 请求方法 GET｜POST
 * path: 请求链接 /api/index
 * controller: 本次请求对应的处理 controller
 * controllerMethod: 本次请求对应的 controller 中的具体的处理方法
 * env: 该路由在什么环境中生效 local|test|staging|prod 不同环境的路由可以放到一起
 */
const serverRender = {
  // 获取 client 端页面
  'get=>#^(?!/api).*$#': 'home#index',
  // 'get=>/home': 'home#index',
  // 用户
  'post=>#/api/user/login#': 'user#login',
  // IM 消息通信
  'post=>#/api/im/dialog#': 'im#dialog',
};

export default {
  ...serverRender,
};
