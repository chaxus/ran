# 子package安装
pnpm i [package] -r --filter smarty-ui-vite
# 或者 直接在 ranui 目录下
pnpm i [package]
# 安装 workspace 中
pnpm i [package] -w
# 检查只能用pnpm安装，用于workspace
`"preinstall": "npx only-allow pnpm"`
# Monorepo
