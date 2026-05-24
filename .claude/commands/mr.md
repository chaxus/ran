请帮我创建一个 PR 到 main 分支，按以下步骤执行：

1. **Rebase**: 按以下步骤执行，自动处理 `pnpm-lock.yaml` 冲突：
   ```bash
   git fetch origin
   git config merge.lockfile.driver true
   echo 'pnpm-lock.yaml merge=lockfile' >> .git/info/attributes
   git rebase origin/main
   git config --unset merge.lockfile.driver
   grep -v 'pnpm-lock.yaml merge=lockfile' .git/info/attributes > /tmp/attrs_tmp && mv /tmp/attrs_tmp .git/info/attributes
   ```
   说明：`merge.lockfile.driver true` 使 pnpm-lock.yaml 冲突时自动保留 origin/main 的版本（lockfile 是自动生成的，rebase 后重新生成即可）。若有其他文件冲突则中止并告知我。

2. **更新 lockfile**: rebase 完成后执行 `pnpm install --prefer-frozen-lockfile`，再 `git add pnpm-lock.yaml && git commit -m "chore: update pnpm-lock.yaml after rebase"`
   说明：必须用 `--prefer-frozen-lockfile` 而不是裸 `pnpm install`。裸 install 会重新解析所有 semver range 并拉取最新版，可能引入当天刚发布的包，触发 pnpm v11 的 `minimumReleaseAge` 安全策略拦截。`--prefer-frozen-lockfile` 只补充 lockfile 中真正缺失的条目（分支新增的依赖），其余沿用固定版本。

3. **Pre-flight checks**: 推送前在本地验证，发现问题立即修复再继续：
   - `pnpm run build` — 确认整体构建通过（会依次构建 ranuts → ranui → docs）
   - 检查 `.github/workflows/` 中所有 workflow 文件，确认：
     - CI 使用的 Node 版本与根目录 `package.json` 的 `engines.node` 字段兼容
     - workflow 中涉及 workspace 包构建的步骤，依赖包（如 ranuts）是否在被依赖包（如 ranui）之前构建
     - `pnpm/action-setup` 等 action 版本是否存在（当前最新为 v4）
   - 若发现问题，修复后补一个 fix commit，再继续下一步

4. **Push**: 执行 `git push --force-with-lease`

5. **分析改动**: 通过 `git log origin/main..HEAD --oneline` 和 `git diff origin/main...HEAD --stat` 了解本次所有改动

6. **Generate PR description**: Based on the changes, write the PR body in **English** with the following sections:
   - **What's changed**: bullet points of main features / fixes
   - **Risks**: table with Risk / Description / Mitigation columns
   - **Test plan**: checkbox list of verification steps

7. **创建 PR**: 使用 `/opt/homebrew/bin/gh pr create --base main` 创建 PR，title 使用英文 conventional commit 格式，body 使用第 6 步生成的描述

注意：gh CLI 路径为 `/opt/homebrew/bin/gh`
