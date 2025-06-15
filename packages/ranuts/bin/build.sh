bin=./node_modules/.bin
$bin/vite build -c ./build/build.es.ts
$bin/vite build -c ./build/build.umd.ts
$bin/vite build -c ./build/build.umd.node.ts
$bin/vite build -c ./build/build.umd.react.ts
$bin/vite build -c ./build/build.umd.utils.ts
$bin/vite build -c ./build/build.umd.wasm.ts
$bin/vite build -c ./build/build.umd.ml.ts
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json
