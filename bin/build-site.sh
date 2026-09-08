#!/bin/sh
# Build chaxus.com (packages/site). POSIX sh — see packages/docs/bin/build.sh for why.
#
# This is the Cloudflare Pages build command for the personal site, and it mirrors
# bin/build.sh (which builds the documentation site). The site imports ranui's built
# output, so ranui — and ranuts underneath it — have to exist first.
set -eu
npx pnpm -F ranuts build
pnpm -F ranui build
pnpm -F site build
