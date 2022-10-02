const fs = require("fs");

type Error =  NodeJS.ErrnoException | null

const getFileInfo = (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err: Error, data: string) => {
      err ? reject(err) : resolve(data);
    });
  });

export default getFileInfo;