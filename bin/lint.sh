#!/bin/bash
set -e

bin=./node_modules/.bin
$bin/oxlint --config .oxlintrc.json .
$bin/prettier --check --cache .

pnpm typecheck:tooling

# The manifest decides which packages are checked; keep it honest before acting on it.
node bin/verify-packages.ts
node bin/verify-md-links.ts
node bin/verify-local-paths.ts

# build ranuts and ranui first so their type declarations are available for dependent packages
pnpm -F ranuts build
pnpm -F ranui build

# Every package declaring the `tsc` check in packages/manifest.json. Reading the list from
# there rather than repeating it here is the point: a package that falls out of a
# hand-maintained list is invisible, because nothing runs it any more.
node bin/run-checks.ts tsc
