#!/bin/sh
# POSIX sh only — see packages/docs/bin/build.sh for the full account of why.
#
# Short version: package.json invokes this with `sh ./bin/build.sh`, and calling a
# script through `sh` IGNORES its shebang. The real interpreter is the system /bin/sh,
# which is bash on macOS and dash on the Cloudflare build image. Anything bash-only
# passes locally and fails only in CI. There is no `pipefail` here for that reason.
#
# `set -eu` is not optional. Without it this script's exit code is whatever the last
# command returns, so a failed generation followed by a successful echo exits 0 — and
# Cloudflare Pages reads that as a success and republishes the previous deploy.
set -eu

bin=./node_modules/.bin

# Generate, then check. verify.ts exits non-zero on a dead link, a canonical that names
# a different page, a missing description or a page absent from the sitemap — all
# things that look perfectly fine in a browser and would otherwise ship.
$bin/tsx build/build.ts
$bin/tsx build/verify.ts
