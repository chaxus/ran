#!/bin/bash
set -e

pnpm -F ranuts build
# Type-checking is the lint job's `run-checks.ts tsc`; its result does not depend on the
# OS or Node version, so the four build-test legs no longer repeat it here.

# CI enforces coverage thresholds and used to do it by running `vitest run` here and
# then `vitest run --coverage` in a second step — the same suite twice for one report.
# Asking for coverage up front collapses that into a single pass. Defaults to off so a
# local `pnpm test` stays fast.
if [ "${RANUI_COVERAGE:-0}" = "1" ]; then
  npm run test:unit:coverage
else
  npm run test:unit
fi

npm run test:ssr
