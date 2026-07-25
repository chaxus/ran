#!/bin/sh
# 本脚本必须是 POSIX sh 兼容的。
#
# package.json 里是 `sh ./bin/build.sh`，而用 sh 调用会**忽略 shebang** —— 真正的解释器
# 是系统的 /bin/sh。macOS 上它是 bash，Cloudflare 构建镜像上它是 dash。所以这里写
# `set -euo pipefail` 在本机跑得好好的，到 CF 上直接
# `set: Illegal option -o pipefail` 退出 2。别在这个文件里用 bashism。
#
# 任何一步失败都必须让整个脚本失败：此前没有 set -e，而脚本最后一条语句是 echo ——
# 于是 vitepress 编译失败时，后续的 mv/cat 接着报错，脚本仍以退出码 0 结束，还打印
# 一句像成功的话。CF Pages 会把这种"失败"当成构建成功并发布上一次的残留产物。
set -eu

# Service Worker 的版本号。只注入到 sw.js 的**内容**里（CACHE_NAME 用它），
# 不再写进任何被 git 跟踪的源文件，也不再进文件名 —— 理由见下方 sw.js 处理段。
version=$(date +%s)

# 执行 ssg 构建命令
bin=./node_modules/.bin
$bin/vitepress build
# 生成 llms-full.txt:把所有文档 markdown 全文拼成一个纯文本,供 LLM 一次性摄取(GEO)。
# 精编的入口地图见 public/llms.txt;这个是全文语料。
llms_full="./.vitepress/dist/llms-full.txt"
# 先把清单落到临时文件再遍历，而不是 `find | sort | while`。POSIX sh 没有 pipefail，
# 管道的退出码只看最后一个命令 —— find 失败时 sort 照样成功，循环拿到空输入，
# 结果是静默产出一个空的 llms-full.txt。分成两步后 set -e 才能拦住 find 的失败。
md_list=$(mktemp)
find ./src ./cn/src -name "*.md" > "$md_list"
sort -o "$md_list" "$md_list"
{
  echo "# ran — full documentation corpus"
  echo "# https://ran.chaxus.com  •  auto-generated at build time"
  echo
  while read -r f; do
    # keep the src/ or cn/src/ prefix; drop .md; map /index to the clean
    # directory URL so links match cleanUrls + canonical (no .html suffix).
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
# 指定输出的目录
dir="./.vitepress/dist"
# Service Worker 保持在**固定 URL** /sw.js。
#
# 此前每次构建都把它改名成 sw<时间戳>.js。这恰好废掉了 SW 自带的更新机制:浏览器靠
# 重新抓取**同一个** URL 并逐字节比对来判断要不要更新,而旧客户端注册的
# sw<旧时间戳>.js 在新部署里已经不存在,更新检查只会一直 404。于是唯一的更新途径变成
# "用户打开页面 → 内联脚本注册新文件名"。
#
# 版本号写在文件内容里(下面注入的 VERSION)就足够触发更新:内容变了,字节比对就会发现。
# 而且浏览器抓 SW 主脚本时默认绕过 HTTP 缓存(updateViaCache 默认 'imports'),
# 不存在"URL 不变就拿到旧文件"的问题。
target="$dir/sw.js"
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
