module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  "plugins": [
    "@babel/plugin-transform-nullish-coalescing-operator" // 处理 ?? 运算符
  ]
};
