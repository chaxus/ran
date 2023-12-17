import type { Plugin } from 'esbuild';
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from '../constants';
/**
 * @description: 根据BARE_IMPORT_RE，和EXTERNAL_TYPES，将一些文件添加进依赖组deps，同时不让esbuild去处理
 * @param {Set} deps
 */
export function scanPlugin(deps: Set<string>): Plugin {
  return {
    name: 'esbuild:scan-deps',
    setup(build) {
      // 忽略的文件类型
      build.onResolve({ filter: new RegExp(`\\.(${EXTERNAL_TYPES.join('|')})$`) }, (resolveInfo) => {
        return {
          // 模块路径
          path: resolveInfo.path,
          // 不让esbuild去处理
          external: true,
        };
      });
      // 记录依赖
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          const { path: id } = resolveInfo;
          deps.add(id);
          return {
            // 模块路径
            path: id,
            // 不让esbuild去处理
            external: true,
          };
        },
      );
    },
  };
}
