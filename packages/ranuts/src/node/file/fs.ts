/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-restricted-globals */



// async function loadFileSystem() {
//   const fs = await import('fs')
//   let fileSystem: any
//   if (typeof require !== 'undefined') {
//     fileSystem = require('fs')
//     fileSystem._identification = true
//   } else if (typeof fs.Stats === 'function') {
//     fileSystem = fs
//     fileSystem._identification = true
//   } else {
//     fileSystem = { _identification: false, message: 'require is not defined' }
//   }
//   return fileSystem
// }

// const file = await loadFileSystem()
const fs = {}
let fileSystem: any = fs
if (typeof fileSystem.Stats === 'function') {
    fileSystem._identification = true
} else {
    fileSystem = { _identification: false, message: 'require is not defined' }
}

export default fileSystem
