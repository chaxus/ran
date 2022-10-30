
let fs = { status: false, message: 'require is not defined' }
if (typeof require !== 'undefined') {
    fs = require('fs')
}

export default fs