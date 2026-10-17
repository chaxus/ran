set -e
# Without this a failed vite build leaves an incomplete dist/ behind while the
# script runs on and still exits 0, so the breakage surfaces in a downstream package.

bin=./node_modules/.bin
dist=./dist

# build es (split per component, cleans dist/)
$bin/vite build -c ./build/config.es.ts
# build the standalone full IIFE and the CommonJS graph (append to dist/)
$bin/vite build -c ./build/config.bundle.ts
$bin/vite build -c ./build/config.cjs.ts
# build standalone per-component iife bundles (dist/iife/<name>.iife.js)
$bin/tsx ./bin/build-iife.ts

$bin/tsc --declaration --emitDeclarationOnly --outDir ./dist --project tsconfig.build.json

# tsc emits the `@/` aliases verbatim — a declaration file carries no `paths`, so a
# consumer resolving them against their own config finds nothing and every published type
# degrades to `any`. Rewrite them to relative specifiers.

cp tsconfig.json ./dist
cp typings.d.ts ./dist

# ship the self-hosted Geist faces (fonts.css + variable *.woff2 + OFL license)
# as dist/fonts/ — consumed via the "./fonts" package export or by copying the
# directory wholesale (URLs inside fonts.css are relative to it).
mkdir -p $dist/fonts
cp fonts/fonts.css fonts/Geist-Variable.woff2 fonts/GeistMono-Variable.woff2 fonts/OFL-LICENSE.txt $dist/fonts/

# Load public browser augmentations once. Build-only asset declarations stay private.
printf "\nimport './typings.js';\n" >> "$dist/index.d.ts"

# Normalize ESM declarations and emit CommonJS forwarding declarations.
node ../../bin/prepare-declarations.mjs dist .
