#!/bin/sh
set -eu
pnpm -F ranuts build
pnpm -F @alixex/ranview build
pnpm -F ranui build
pnpm -F docs build
# The site is a deployable artifact too. Its build ends in verify.ts, which fails on a
# dead link, a canonical naming another page, or a page missing from the sitemap — all
# things Cloudflare Pages would otherwise accept and publish. Building it here means CI
# finds that before the deploy does.
pnpm -F site build
