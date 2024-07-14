bin=./node_modules/.bin
dist=./dist

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
cp typings.d.ts ./dist

$source_file="$dist/typings.d.ts"

$target_file="$dist/index.d.ts"

# 追加源文件内容到目标文件
cat "$source_file" >> "$target_file"
