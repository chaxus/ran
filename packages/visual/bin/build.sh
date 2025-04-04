bin=./node_modules/.bin
$bin/vite build -c ./build/build.es.ts
$bin/vite build -c ./build/build.umd.ts
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json