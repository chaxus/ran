bin=./node_modules/.bin
$bin/vite build
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json
