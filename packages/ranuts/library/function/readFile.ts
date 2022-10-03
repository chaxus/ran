import fs from '@/node/fs'



type Error = NodeJS.ErrnoException | null

const readFile = (path: string, format: string = "utf-8") =>
  new Promise((resolve, reject) => {
    fs.readFile(path, format, (err: Error, data: string) => {
      err ? reject({ status: false, data: err }) : resolve({ status: true, data });
    });
  });

export default readFile;
