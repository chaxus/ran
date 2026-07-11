#!/bin/bash
set -e

pnpm -F docs tsc
pnpm -F ranuts tsc
pnpm -F solidity tsc
pnpm -F ranuts test
# ranui's test script covers its own tsc + unit + ssr (and rebuilds ranuts first)
pnpm -F ranui test
