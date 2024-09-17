
bin=./node_modules/.bin
$bin/prettier --check --cache .
$bin/eslint --cache . && $bin/prettier --check --cache .
# npm run lint:es && npm run lint:prettier
