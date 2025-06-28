
bin=./node_modules/.bin
$bin/prettier --check --cache .
$bin/eslint --cache . && $bin/prettier --check --cache .
# before lint, make sure all packages are built
# pnpm build
pnpm -F docs tsc
pnpm -F image-process tsc
pnpm -F ml tsc
pnpm -F ranui tsc
pnpm -F ranuts tsc
pnpm -F solidity tsc
# pnpm -F read tsc
# $bin/tsc --noEmit
# npm run lint:es && npm run lint:prettier
