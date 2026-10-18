# 优化审计 · 2026-10-18

## 结论

第一版审计跑在 `codex/floating-exit-direction` 上。那个分支落后 `origin/main` 1060 个文件，因此其中相当一部分结论在 main 上已经不成立：CJS 产物、覆盖率门禁、`im` 的 E2E 触发路径、README 的开发命令、`clean.sh` 删除全局 store，都已经在 main 上修好了。

以 `origin/main` 重新核对后，本分支修掉 9 项，并记录 4 项**有意不改**的决定，避免下一次审计再把它们当成待办。其中第 8、9 项不是审计发现的，是 CI 跑起来之后暴露的：把 site 构建放进 Windows 矩阵，等于第一次真正在 CRLF 工作树上跑它。

## 本分支已修

| #   | 问题                                                                                                                                                        | 修法                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | `packages/site` 从未被构建。`tsc` 与 `verify:design` 会跑，生成器不会，而它的 `verify.ts` 负责死链、canonical、sitemap 校验——这些只在 Cloudflare 部署时执行 | `bin/build.sh` 增加 `pnpm -F site build`                   |
| 2   | `docs check:langs` 被 5 处源码注释称为强制门禁，唯一调用方是手动触发的 `release.yml`                                                                        | 并入根 `verify:docs`，随 PR 的 lint job 运行               |
| 3   | Dependabot 只覆盖 `github-actions`，npm 依赖无人看管                                                                                                        | 增加 `npm` ecosystem，minor/patch 分组，major 忽略         |
| 4   | 根目录 `index.html` 是 2024 年的 Sankey canvas 实验；`bin/install.sh` 是无 shebang 的笔记；`pre` 不是 npm 生命周期钩子（npm 只跑 `pre<script>`），从未执行  | 三个文件/条目删除                                          |
| 5   | 没有版本管理器能读的 Node 版本文件，而 `engines` 要求 ≥24                                                                                                   | 增加 `.nvmrc`（24）                                        |
| 6   | 6 个包的 tsconfig 各自重复 9 个相同选项，漂移无人发现                                                                                                       | 抽出 `tsconfig.base.json`，各包只保留本地差异              |
| 7   | `ranuts` 在普通代码路径上向消费者控制台写调试日志                                                                                                           | 删除 3 处；`getUserMedia` 失败保留并改为 `console.error`   |
| 8   | 视觉回归容器的 Dockerfile 白名单里没有 `tsconfig.base.json`，第 6 项之后容器内构建报 `Tsconfig not found`                                                   | `Dockerfile` 增加 COPY，`Dockerfile.dockerignore` 增加例外 |
| 9   | `ranpress` 的 frontmatter 按 `\n` 切行，Windows（core.autocrlf）下分隔符带 `\r`，整块 frontmatter 被当成正文，报 `missing required "title"`                 | 改为 `/\r?\n/`，补 CRLF 回归测试                           |

## 核对后确认健康，无需改动

- **发布包**：`ranui` 已是 ESM-only，`exports` 无 `require` 条件；`verify:consumers` 会解包真实 tarball，断言不含 `.cjs`、不含 `require`，并对组件 bundle 做体积预算。
- **覆盖率**：`vitest.config.ts` 的 80/70/85/80 阈值确实在 CI 里执行（`test:unit:coverage`）。
- **E2E 触发**：`e2e.yml` 的 `paths` 已包含 `packages/ranui`、`ranuts`、`ranview`、`im`。
- **clean**：`bin/clean.sh` 已改为 `clean.mjs`，按 manifest 逐个包删除生成物，不再碰全局 pnpm store，也不再删 lockfile。
- **README**：已写明 Node 24+ / pnpm 11.6.0，开发命令是 `pnpm -F docs dev`，不是不存在的根 `dev`。

## 有意不改

1. **`sideEffects: false`（publint 建议）**：`ranui` 的组件入口在模块求值时注册 custom element，这是副作用。设成 `false` 会让打包器把 `import 'ranui/button'` 整条摇掉，正好破坏文档里的用法。publint 无法知道这一点，这条建议是错的。

2. **npm 包体积**：tarball 9.58 MB，解压 36.6 MB，其中约 28 MB 是 IIFE（`index.iife.js` 11.2 MB + `dist/iife/` 17 MB）。这不是冗余——它们服务于 `<script src>` 和 jsDelivr 的按组件引入。真要压，得把 IIFE 拆成独立 CDN 包，那是产品决策，不是构建修正。

3. **`lint:prettier` 全仓扫描**：本机一次超过 120 秒被 SIGTERM。CI 有 pnpm/actions cache，按改动文件过滤会让本地与 CI 的判定不一致，收益不明确。

4. **多版本依赖**：锁文件里 27 个包名有多个版本（31 个多余版本），主要是 `undici`、`commander` 的 major 差异和 `overrides` 的结果。用 overrides 强行收敛的回归风险大于安装体积收益。

## 验证记录

- `pnpm -F {docs,im,ranpress,ranuts,ranview,site} tsc`：全部通过
- `pnpm -F ranuts test`：952 个用例通过
- `pnpm run verify:docs`（含 `check:langs`）：通过
- `pnpm run verify:links`：通过
- `pnpm run verify:scripts`：30/30（Node 26；Node 22 下 release 工具会按设计拒绝运行）
- `pnpm -F ranui build`：通过，产物 38 MB / tarball 9.58 MB
- `pnpm -F site build`：通过，8 页 + 4 个生成文件，链接/canonical/sitemap 校验通过
- `node packages/ranui/bin/visual.mjs check`：容器内 148 张截图全部通过
- `pnpm -F ranpress test`：81 个用例通过（含新增 CRLF 用例）
- PR 的 14 项 CI 检查全部通过，含 Linux / macOS / Windows 三平台构建、三浏览器 E2E 与 Cloudflare Pages

## 第二轮：门禁缺口与 CI 成本

第一轮修的是「已经坏了的地方」。第二轮看的是「没人看着、正在慢慢变坏的地方」：哪条门禁只挂在发版流程上，哪段流水线在重复做同一件事。

| #   | 问题                                                                                                                                                | 修法                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 10  | `verify:links` 只在 `release.yml` 里跑。改个文件名，散文里的相对链接就断，而所有 PR 一直是绿的，直到有人切版本——和 `check:langs` 当初的处境完全一样 | 加进 `ci.yml` 的 lint job                                           |
| 11  | `ci.yml`、`e2e.yml`、`semantic-pull-request.yml` 都没有 `concurrency`。同一个 PR 连推三次会起三套完整流水线，而且三套都跑完                         | 按 `workflow + ref` 分组，`cancel-in-progress: true`                |
| 12  | `pages-build-site.yml` 每次 push main 都往 gh-pages 发布。两个合并挨得近时两个 publish 竞争，旧的可能后结束，把分支写回上一个提交的内容             | 按 `pages-redirect` 串行，**不**取消（写一半更糟）                  |
| 13  | lint job 没有 `timeout-minutes`，默认 360 分钟。挂住的步骤要烧六小时才有人知道                                                                      | 设 20 分钟                                                          |
| 14  | ubuntu/node-24 这一条矩阵腿上，ranui 单测跑两遍：`pnpm run test` 已经 `vitest run`，随后 `test:unit:coverage` 再跑一次同样的套件只为拿一份报告      | 包脚本接受 `RANUI_COVERAGE=1`，一次运行同时产出测试结果与覆盖率门禁 |
| 15  | E2E 三个浏览器 job 都用 `fetch-depth: 0`。仓库历史数百 MB，而 spec、两个 Playwright 配置、ranui 构建全部只读工作树                                  | 改浅克隆（`build-test` 保留，它要跑 `release:prepare`）             |

## 第二轮：看了但没改

1. **`compaction-cancel.spec.ts` 每个浏览器跑 6 遍**：`--repeat-each=5` 一次，随后的全量 `--project` 又一次。想去掉重复只能按标题 `--grep-invert`，而这个 spec 的标题是模板拼出来的（`stopping ${mode} compaction …`）。一旦以后有人在别处加了带 "compaction" 的用例，会被静默跳过——省下的那 1/6 不值得换一个静默失效的开关。

2. **`pnpm -F ranuts build` 在同一个 job 里跑三次**（`pnpm run build`、`bin/test.sh`、`ranui/bin/test.sh`）。实测单次 4.3 秒，两次冗余约 9 秒/job。要用环境变量传「已经构建过」的标记，复杂度换不回这点时间。

3. **`cpd` 从未接入任何 workflow**，且 `.jscpd.json` 的 `threshold: 10` 相对实测的 2.40% 形同虚设。接入要先把阈值调到 3.0 形成棘轮，属于新增门禁，不是修正，单独排期。

4. **全仓没有任何无障碍断言**：没装 `axe-core` / `vitest-axe`，`packages/ranui/test` 与 `packages/im/test` 里 0 处 `toHaveNoViolations`。ranui 是 60+ 个自定义元素的组件库，这是它最大的一块无覆盖回归面，但它是新能力线，不是流水线修补。

5. **`packages/docs` 声明了 `ranuts` 却没有任何 `.ts` 源码 import 它**，只有 200+ 个 `.md` 里的示例代码写着 `import … from 'ranuts'`。需要先确认 docs 构建是否真的消费它，再决定降级还是移除。

6. **`packages/docs/public/hls` 8.6 MB 的 HLS 分片提交在仓库里**，`dist` 累计 117 MB。分片属于产物不属于源码，但迁到 CDN 是部署决策。

## 第二轮验证记录

- `pnpm run verify:links`：通过
- `packages/ranui/bin/test.sh` 分支选择：用桩程序确认 `RANUI_COVERAGE=1` → `test:unit:coverage`，未设/`=0` → `test:unit`
- 四个 workflow 的 `concurrency` 块：位置在 `jobs:` 之前，缩进 2 空格，`prettier --check` 通过
- `bash -n packages/ranui/bin/test.sh`：通过
