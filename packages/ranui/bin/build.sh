bin=./node_modules/.bin
# build es and splite bundle
$bin/vite build -c ./build/config.es.ts
# build umd
# TODO: splite bundle
$bin/vite build -c ./build/config.umd.ts
