module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: ['@babel/plugin-transform-nullish-coalescing-operator'],
  // 大于 500KB 的文件不进行压缩
  compact: false,
};
