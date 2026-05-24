#!/bin/bash
set -e

pnpm -F ranuts build
npm run tsc
npm run test:unit
npm run test:ssr
