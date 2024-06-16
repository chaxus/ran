
bin=./node_modules/.bin
$bin/eslint --cache . && $bin/prettier --check --cache .
# npm run lint:es && npm run lint:prettier
