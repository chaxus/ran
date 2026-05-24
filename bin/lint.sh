#!/bin/bash
set -e

bin=./node_modules/.bin
$bin/prettier --check --cache .
$bin/oxlint --config .oxlintrc.json . && $bin/prettier --check --cache .
# build ranuts and ranui first so their type declarations are available for dependent packages
pnpm -F ranuts build
pnpm -F ranui build
pnpm -F docs tsc
pnpm -F ranui tsc
pnpm -F ranuts tsc
pnpm -F solidity tsc
