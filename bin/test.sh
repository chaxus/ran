#!/bin/bash
set -e

# ranui and im resolve ranuts through its build output, so it has to exist first.
pnpm -F ranuts build

# Every package declaring the `test` check in packages/manifest.json.
node bin/run-checks.mjs test
