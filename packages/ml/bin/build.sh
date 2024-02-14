bin=./node_modules/.bin
cnpm install @tensorflow/tfjs-node
# build es and splite bundle
$bin/vite build -c ./config/build.es.ts
# build umd
$bin/vite build -c ./config/build.umd.ts
