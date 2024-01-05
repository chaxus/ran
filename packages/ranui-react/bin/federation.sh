bin=./node_modules/.bin
rm -rf dist
$bin/vite build -c ./build/config.fed.ts
pnpm preview