set -e
# Without this a failed vite build leaves an incomplete dist/ behind while the
# script runs on and still exits 0, so the breakage surfaces in a downstream package.

bin=./node_modules/.bin
$bin/vite build -c ./build/build.es.ts
$bin/vite build -c ./build/build.iife.ts
$bin/vite build -c ./build/build.iife.utils.ts
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.build.json
node ../../bin/prepare-declarations.mjs dist src
