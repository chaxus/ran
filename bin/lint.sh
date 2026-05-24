#!/bin/bash
set -e

bin=./node_modules/.bin
$bin/prettier --check --cache .
$bin/oxlint --config .oxlintrc.json . && $bin/prettier --check --cache .
# build ranuts first so its type declarations are available for dependent packages
pnpm -F ranuts build
pnpm -F docs tsc
pnpm -F image-process tsc
pnpm -F ranui tsc
pnpm -F ranuts tsc
pnpm -F solidity tsc
