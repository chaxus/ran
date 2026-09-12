#!/bin/sh
# 本脚本必须是 POSIX sh 兼容的。
#
# package.json 里是 `sh ./bin/build.sh`，而用 sh 调用会**忽略 shebang** —— 真正的解释器
# 是系统的 /bin/sh。macOS 上它是 bash，Cloudflare 构建镜像上它是 dash。所以 `set -euo
# pipefail` 在本机跑得好好的，到 CF 上直接 `set: Illegal option -o pipefail` 退出 2。
# 别在这个文件里用 bashism，也别加 pipefail —— 需要管道首个命令的退出码时，把中间结果
# 写文件再遍历（下面 llms-full.txt 的清单就是这么做的）。
#
# 任何一步失败都必须让整个脚本失败：此前没有 set -e，而脚本最后一条语句是 echo ——
# 于是编译失败时后续的 mv/cat 接着报错，脚本仍以退出码 0 结束，还打印一句像成功的话。
# CF Pages 会把这种"失败"当成构建成功并发布上一次的残留产物。
set -eu

# Service Worker 的版本号。只注入到 sw.js 的**内容**里（CACHE_NAME 用它），不进文件名。
version=$(date +%s)

bin=./node_modules/.bin
dir="./dist"

# 生成静态站点。构建期校验（死链、锚点、canonical 自指、sitemap 双向一致）跟在后面，
# 任何一条不过就让构建失败，而不是把自相矛盾的产物发出去。
$bin/tsx build/build.ts
$bin/tsx build/verify.ts

# llms-full.txt：把所有文档 markdown 全文拼成一个纯文本，供 LLM 一次性摄取（GEO）。
# 精编的入口地图见 public/llms.txt；这个是全文语料。
llms_full="$dir/llms-full.txt"
# 先把清单落到临时文件再遍历，而不是 `find | sort | while`。POSIX sh 没有 pipefail，
# 管道的退出码只看最后一个命令 —— find 失败时 sort 照样成功，循环拿到空输入，结果是
# 静默产出一个空的 llms-full.txt。分成两步后 set -e 才能拦住 find 的失败。
md_list=$(mktemp)
# 每种语言一个内容目录：英文在 ./src，其余在 ./<语言>/src（见 .vitepress/langs/locales.ts）。
# 用通配符而不是写死列表 —— 加一门语言就该只改 locales.ts，忘了改这里的后果是静默的：
# llms-full.txt 少掉整整一门语言，而构建照常成功。
md_dirs="./src"
for d in ./*/src; do
  [ -d "$d" ] && md_dirs="$md_dirs $d"
done
# shellcheck disable=SC2086 # md_dirs 是有意按空格拆成多个路径参数的
find $md_dirs -name "*.md" > "$md_list"
sort -o "$md_list" "$md_list"
{
  echo "# ran — full documentation corpus"
  echo "# https://ran.chaxus.com  •  auto-generated at build time"
  echo
  while read -r f; do
    # 保留 src/ 或 cn/src/ 前缀；去掉 .md；/index 映射成干净的目录 URL，
    # 与 canonical、sitemap 一致（都不带 .html）。
    path="${f#./}"
    path="${path%.md}"
    case "$path" in
      */index) path="${path%index}" ;;
    esac
    echo "================================================================"
    echo "# https://ran.chaxus.com/${path}"
    echo "================================================================"
    echo
    cat "$f"
    echo
    echo
  done < "$md_list"
} > "$llms_full"
rm "$md_list"
echo "llms-full.txt generated: $llms_full"

# Service Worker 保持在**固定 URL** /sw.js。
#
# 此前每次构建都把它改名成 sw<时间戳>.js，这恰好废掉了 SW 自带的更新机制：浏览器靠重新
# 抓取**同一个** URL 并逐字节比对来判断要不要更新，而旧客户端注册的 sw<旧时间戳>.js 在新
# 部署里已经不存在，更新检查只会一直 404。
#
# 版本号写在文件内容里就足够触发更新：内容变了，字节比对就会发现。而且浏览器抓 SW 主脚本
# 时默认绕过 HTTP 缓存（updateViaCache 默认 'imports'）。
target="$dir/sw.js"
tmpfile=$(mktemp)
# 只预缓存 app shell，排除大体积媒体（HLS 分片、GIF/视频、其它二进制），避免 SW 安装时
# 强行下载整个 dist 撑爆离线缓存配额。媒体交给运行时按需缓存。
#
# 搜索索引（search/*.json）同样排除：每种语言约 1 MB，而读者只会用到自己那一门，
# 它本来就是按需 fetch 的。
find "$dir" -type f \
  -not -path "*/hls/*" \
  -not -path "*/search/*" \
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

SERVICE_WORK_VARABLE="$dir/sw-file.js"
echo "const SERVICE_WORK_CACHE_FILE_PATHS = [" > "$SERVICE_WORK_VARABLE"
# 根路径（部署在 ran.chaxus.com 根域名，没有 /ran 前缀）
ran=""
while read -r file; do
  str="${file##./dist}"
  echo "\"$ran$str\"," >> "$SERVICE_WORK_VARABLE"
done < "$tmpfile"
echo "];" >> "$SERVICE_WORK_VARABLE"
echo "const VERSION = \"$version\";" >> "$SERVICE_WORK_VARABLE"
rm "$tmpfile"

tmpfile=$(mktemp)
cat "$SERVICE_WORK_VARABLE" >> "$tmpfile"
cat "$target" >> "$tmpfile"
mv "$tmpfile" "$target"
rm "$SERVICE_WORK_VARABLE"

echo "service work file paths have been generate for $target"
