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
$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.json

cp tsconfig.json ./dist
cp typings.d.ts ./dist

# 获取脚本所在的目录
SCRIPT_DIR=$(cd $(dirname $0) && pwd)

# 定义源文件和目标文件的绝对路径
source_file="$SCRIPT_DIR/../dist/typings.d.ts"
target_file="$SCRIPT_DIR/../dist/index.d.ts"

# 检查源文件是否存在且路径正确
if [ ! -f "$source_file" ]; then
    echo "Error: Source file '$source_file' does not exist or path is incorrect."
    exit 1
fi

# 检查目标文件目录是否存在
target_dir=$(dirname "$target_file")
if [ ! -d "$target_dir" ]; then
    echo "Error: Target directory '$target_dir' does not exist."
    exit 1
fi

# 追加源文件内容到目标文件
cat "$source_file" >> "$target_file"
