#!/bin/bash
set -e

pnpm -F ranuts build
pnpm -F docs tsc
pnpm -F ranui tsc
pnpm -F ranuts tsc
pnpm -F solidity tsc
pnpm -F ranuts test
