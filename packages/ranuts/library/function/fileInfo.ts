import { fs } from '@/function/nodeLibrary'

type Error = NodeJS.ErrnoException | null

const getFileInfo = (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err: Error, data: string) => {
      err ? reject({ status: false, data: err }) : resolve({ status: true, data });
    });
  });

export default getFileInfo;