bin=./node_modules/.bin
npm run test:tsc
$bin/playwright install
$bin/playwright install-deps
$bin/playwright test
