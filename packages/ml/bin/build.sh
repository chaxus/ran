bin=./node_modules/.bin
# build es and splite bundle
$bin/vite build -c ./config/build.es.ts
# build umd
# TODO: splite bundle
$bin/vite build -c ./config/build.umd.ts
