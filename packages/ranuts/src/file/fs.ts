const fs = {};
let fileSystem: any = fs;
if (typeof process !== 'undefined' && typeof fileSystem.Stats === 'function') {
  fileSystem._identification = true;
} else {
  fileSystem = { _identification: false, message: 'require is not defined' };
}

export default fileSystem;
