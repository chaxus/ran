# 子package安装
pnpm i vue -r --filter smarty-ui-vite
# 或者 直接在 docs-vite 目录下
pnpm i vue
# 安装 workspace 中
pnpm i vite -w
# 检查只能用pnpm安装，用于workspace
`"preinstall": "npx only-allow pnpm"`
# Monorepo