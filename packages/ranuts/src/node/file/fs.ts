/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-restricted-globals */
let fileSystem: any
if (typeof require !== 'undefined') {
  fileSystem = require('fs')
  fileSystem._identification = true
} else {
  fileSystem = { _identification: false, message: 'require is not defined' }
}

export default fileSystem
