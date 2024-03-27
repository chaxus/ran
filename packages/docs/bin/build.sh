#!/bin/bash 
bin=./node_modules/.bin

$bin/vitepress build

# 指定目录  
dir=".vitepress/dist"  

output=".vitepress/dist/sw-file.js"

target=".vitepress/dist/sw.js"

# 使用find命令将文件路径输出到一个临时文件  
tmpfile=$(mktemp)  
find "$dir" -type f > "$tmpfile"  
  
# 从临时文件中读取文件路径并存储到数组中  
while IFS= read -r file; do  
    file_paths+=("$file")  
done < "$tmpfile"  
  
# 删除临时文件  
rm "$tmpfile"  


echo "const serviceWorkCacheFilePaths = [" > "$output"  
  
ran="/ran"
# 打印数组中的文件路径  
for path in "${file_paths[@]}"; do
    str="${path##.vitepress/dist}"  
    echo "\"$ran$str\"," >> "$output"  
done

echo "];" >> "$output"

tmpfile=$(mktemp)  

cat "$output" >> "$tmpfile"  

cat "$target" >> "$tmpfile"

mv "$tmpfile" "$target" 

rm "$output"  

# 打印完成消息  
echo "service work file paths have been generate for $target"
