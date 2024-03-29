#!/bin/bash
bin=./node_modules/.bin
$bin/vitepress build
# 开启调试模式
# set -x
# 指定目录
dir="./.vitepress/dist"
# 使用find命令将文件路径输出到一个临时文件
tmpfile=$(mktemp)
find "$dir" -type f > "$tmpfile"
# 临时缓存文件
output="./.vitepress/dist/sw-file.js"
# 生成的目标文件
target="./.vitepress/dist/sw.js"
# 拼接字符串
echo "const SERVICE_WORK_CACHE_FILE_PATHS = [" > "$output"
# 根路径
ran="/ran"
while read -r file; do
    if [[ $file != *".DS_Store"* ]]; then
        str="${file##./.vitepress/dist}"
        echo "\"$ran$str\"," >> "$output"
    fi
done < "$tmpfile"
# 拼接字符串
echo "];" >> "$output"
# 更新 sw 的版本号
echo "const VERSION = \"$(date +%s)\";" >> "$output"
# 删除临时文件
rm "$tmpfile"

tmpfile=$(mktemp)

cat "$output" >> "$tmpfile"

cat "$target" >> "$tmpfile"

mv "$tmpfile" "$target"

rm "$output"
# # 打印完成消息
echo "service work file paths have been generate for $target"
# 关闭调试模式
# set +x
