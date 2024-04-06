#!/bin/bash
# 更新 service work的版本号
version=$(date +%s)
# 将版本号写入 variable 目录下 SERVICE_WORK_VERSION.ts
SERVICE_WORK_VERSION="./variable/SERVICE_WORK_VERSION.ts"

echo "export const SERVICE_WORK_VERSION = \"$version\"" > $SERVICE_WORK_VERSION
# 执行 ssg 构建命令
bin=./node_modules/.bin
$bin/vitepress build
# 开启调试模式
# set -x
# 指定输出的目录
dir="./.vitepress/dist"
# 创建一个临时文件
tmpfile=$(mktemp)
# 将目录 dir 下的文件名追加到临时文件中
find "$dir" -type f > "$tmpfile"
# service worker中生成
# SERVICE_WORK_CACHE_FILE_PATHS（根据打包后生成的文件来生成）
# VERSION （时间戳）
# 的临时文件
SERVICE_WORK_VARABLE="./.vitepress/dist/sw-file.js"
# 生成的目标文件
target="./.vitepress/dist/sw.js"
# 拼接字符串
echo "const SERVICE_WORK_CACHE_FILE_PATHS = [" > "$SERVICE_WORK_VARABLE"
# 根路径
ran="/ran"
while read -r file; do
  # if [[ $file != *".DS_Store"* ]]; then
  str="${file##./.vitepress/dist}"
  echo "\"$ran$str\"," >> "$SERVICE_WORK_VARABLE"
  # fi
done < "$tmpfile"
# 拼接字符串
echo "];" >> "$SERVICE_WORK_VARABLE"
# 更新 sw 的版本号
echo "const VERSION = \"$version\";" >> "$SERVICE_WORK_VARABLE"
# 删除临时文件
rm "$tmpfile"

tmpfile=$(mktemp)

cat "$SERVICE_WORK_VARABLE" >> "$tmpfile"

cat "$target" >> "$tmpfile"

mv "$tmpfile" "$target"

rm "$SERVICE_WORK_VARABLE"

# 改名
mv "$target" "./.vitepress/dist/sw$version.js"

# # 打印完成消息
echo "service work file paths have been generate for $target"
# 关闭调试模式
# set +x
