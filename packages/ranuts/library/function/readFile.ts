const fs = require("fs");

type Error =  NodeJS.ErrnoException | null

const readFile = (path: string, format: string = "utf-8") =>
  new Promise((resolve, reject) => {
    fs.readFile(path, format, (err: Error, data: string) => {
      err ? reject(err) : resolve(data);
    });
  });

export default readFile;
