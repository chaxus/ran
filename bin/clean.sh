
rm -rf $(pnpm store path)
rm -rf node_modules
rm -rf packages/ranui/node_modules/
rm -rf packages/ranuts/node_modules/
rm -rf packages/docs/node_modules/
rm -rf packages/ranite/node_modules/
rm -rf packages/ml/node_modules/
npm cache clean --force
rm -rf pnpm-lock.yaml