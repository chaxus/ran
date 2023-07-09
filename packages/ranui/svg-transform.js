export default {
    process() {
      return { code: "module.exports = {};" };
    },
    getCacheKey() {
      return "svgTransform"; // SVG固定返回这个字符串
    },
  };