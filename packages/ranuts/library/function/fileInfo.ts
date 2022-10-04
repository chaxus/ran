import fs from '@/node/fs'

type Error = NodeJS.ErrnoException | null

const queryFileInfo = (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err: Error, data: string) => {
      err ? reject({ status: false, data: err }) : resolve({ status: true, data });
    });
  });

export default queryFileInfo;