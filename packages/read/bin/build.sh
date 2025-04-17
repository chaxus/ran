#!/bin/bash
# 更新 service work的版本号
version=$(date +%s)
# 将版本号写入 variable 目录下 SERVICE_WORK_VERSION.ts
SERVICE_WORK_VERSION="./variable/SERVICE_WORK_VERSION.ts"

echo "export const SERVICE_WORK_VERSION = \"$version\"" > $SERVICE_WORK_VERSION

bin=./node_modules/.bin

npm run build:server

node ./bin/build-ssg.js

rm -rf dist/server
rm -rf dist/client
