bin=./node_modules/.bin

npm run build:client
npm run build:server

node ./bin/build-ssg.js

# rm -rf dist/server
# rm -rf dist/assets
# rm -rf dist/.vite
