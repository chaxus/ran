bin=./node_modules/.bin
rm -rf dist
# build es and splite bundle
$bin/vite build -c ./build/config.es.ts
# build umd
# TODO: splite bundle
$bin/vite build -c ./build/config.umd.ts
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json

