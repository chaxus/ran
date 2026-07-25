import { init } from '@/vnode/init';
import { h } from '@/vnode/h';
// 2. Register the modules
const patch = init();

// 3. Pass the data the modules need as h()'s second argument (an object)
const content = h('div', [
  h('h1', '欢迎使用 vnode'),
  h('p', '掘金博文：'),
  h(
    'a',
    {
      props: {
        href: 'https://juejin.cn/user/2981531263964718',
      },
    },
    'https://juejin.cn/user/2981531263964718',
  ),
  h('p', '源码地址：'),
  h(
    'a',
    {
      props: {
        href: 'https://github.com/chaxus/ran',
      },
    },
    'https://github.com/chaxus/ran',
  ),
]);

const vnode = h(
  'div',
  {
    style: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    },
  },
  [content],
);

const app = document.querySelector('#app');

if (app) {
  patch(app, vnode);
}
