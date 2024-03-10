bin=./node_modules/.bin

MODE=''
ENV=''

while getopts "m:e:p:s:" arg
do
    case $arg in
        m)
            MODE=$OPTARG
            ;;
        e)
            ENV=$OPTARG
            ;;
        ?)
            echo "unknown argument"
    esac
done

# build es and splite bundle
$bin/vite build -c ./build/config.es.ts
# build umd
# TODO: splite bundle
$bin/vite build -c ./build/config.umd.ts
$bin/vite build -c ./build/config.sha.ts
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json
cp tsconfig.json ./dist