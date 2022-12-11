
bin=./node_modules/.bin
pnpm run format && $bin/eslint --cache . && $bin/prettier --check --cache .
