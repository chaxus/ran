#!/bin/bash
# 更新 service work的版本号
version=$(date +%s)
# 将版本号写入 variable 目录下 SERVICE_WORK_VERSION.ts
SERVICE_WORK_VERSION="./variable/SERVICE_WORK_VERSION.ts"

echo "export const SERVICE_WORK_VERSION = \"$version\"" > $SERVICE_WORK_VERSION
# 执行 ssg 构建命令
bin=./node_modules/.bin
$bin/vitepress build
# 生成 llms-full.txt:把所有文档 markdown 全文拼成一个纯文本,供 LLM 一次性摄取(GEO)。
# 精编的入口地图见 public/llms.txt;这个是全文语料。
llms_full="./.vitepress/dist/llms-full.txt"
{
  echo "# ran — full documentation corpus"
  echo "# https://ran.chaxus.com  •  auto-generated at build time"
  echo
  find ./src -name "*.md" | sort | while read -r f; do
    rel="${f#./src/}"
    echo "================================================================"
    echo "# https://ran.chaxus.com/src/${rel%.md}.html"
    echo "================================================================"
    echo
    cat "$f"
    echo
    echo
  done
} > "$llms_full"
echo "llms-full.txt generated: $llms_full"
# 开启调试模式
# set -x
# 指定输出的目录
dir="./.vitepress/dist"
# 生成的目标文件
target="./.vitepress/dist/sw.js"
# 改名
mv "$target" "./.vitepress/dist/sw$version.js"

target="./.vitepress/dist/sw$version.js"
# 创建一个临时文件
tmpfile=$(mktemp)
# 将目录 dir 下的文件名追加到临时文件中(只预缓存 app shell,排除大体积媒体:
# HLS 视频分片、GIF/视频、以及其它二进制媒体,避免 Service Worker 安装时
# 强行下载整个 dist(约 76MB)撑爆离线缓存配额)。媒体交给运行时按需缓存。
find "$dir" -type f \
  -not -path "*/hls/*" \
  -not -name "*.ts" \
  -not -name "*.gif" \
  -not -name "*.mp4" \
  -not -name "*.webm" \
  -not -name "*.m3u8" \
  -not -name "*.jpg" \
  -not -name "*.jpeg" \
  -not -name "*.txt" \
  -not -name "*.DS_Store" \
  > "$tmpfile"
# service worker中生成
# SERVICE_WORK_CACHE_FILE_PATHS（根据打包后生成的文件来生成）
# VERSION （时间戳）
# 的临时文件
SERVICE_WORK_VARABLE="./.vitepress/dist/sw-file.js"

# 拼接字符串
echo "const SERVICE_WORK_CACHE_FILE_PATHS = [" > "$SERVICE_WORK_VARABLE"
# 根路径(部署在 ran.chaxus.com 根域名,不再有 /ran 前缀)
ran=""
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

# # 打印完成消息
echo "service work file paths have been generate for $target"
# 关闭调试模式
# set +x
