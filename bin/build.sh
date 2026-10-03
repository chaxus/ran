#!/bin/sh
set -eu
pnpm -F ranuts build
pnpm -F @alixex/ranview build
pnpm -F ranui build
pnpm -F docs build
