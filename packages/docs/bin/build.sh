#!/bin/sh
# 本脚本必须是 POSIX sh 兼容的。
#
# package.json 里是 `sh ./bin/build.sh`，而用 sh 调用会**忽略 shebang** —— 真正的解释器
# 是系统的 /bin/sh。macOS 上它是 bash，Cloudflare 构建镜像上它是 dash。所以 `set -euo
# pipefail` 在本机跑得好好的，到 CF 上直接 `set: Illegal option -o pipefail` 退出 2。
# 别在这个文件里用 bashism，也别加 pipefail —— 需要管道首个命令的退出码时，把中间结果
# 写文件再遍历。
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
# Precache only the entry's static imports, shared styles and brand icons.
# Remaining assets and current-language pages/search are prepared later in idle batches.
node --input-type=module - "$dir/offline-manifest.json" > "$tmpfile" <<'NODE'
import { readFileSync } from 'node:fs';
const { shared } = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const url of shared) console.log(url);
NODE

SERVICE_WORK_VARABLE="$dir/sw-file.js"
echo "const SERVICE_WORK_CACHE_FILE_PATHS = [" > "$SERVICE_WORK_VARABLE"
while read -r file; do
  echo "\"$file\"," >> "$SERVICE_WORK_VARABLE"
done < "$tmpfile"
echo "];" >> "$SERVICE_WORK_VARABLE"
echo "const VERSION = \"$version\";" >> "$SERVICE_WORK_VARABLE"
rm "$tmpfile"

tmpfile=$(mktemp)
cat "$SERVICE_WORK_VARABLE" >> "$tmpfile"
printf 'const OFFLINE_MANIFEST = ' >> "$tmpfile"
cat "$dir/offline-manifest.json" >> "$tmpfile"
printf ';\n' >> "$tmpfile"
cat "$target" >> "$tmpfile"
cat "$dir/offline-worker.js" >> "$tmpfile"
mv "$tmpfile" "$target"
rm "$SERVICE_WORK_VARABLE" "$dir/offline-manifest.json" "$dir/offline-worker.js"

echo "service work file paths have been generate for $target"
