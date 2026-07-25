import fs from '@/node/fs';

type Error = NodeJS.ErrnoException | null;

/**
 * @description: Write a file at the given path, truncating it if it exists and creating it if it does not
 * @param {string} path file path
 * @param {string} content file content
 * @return {Promise}
 */

const writeFile = (path: string, content: string): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      content,
      {
        mode: 438, // read/write for everyone — 0666 octal, 438 decimal
        flag: 'w+', // r+ appends into the existing content; w+ truncates first
        encoding: 'utf-8',
      },
      (err: Error) => {
        if (err) {
          reject({ success: false, _identification: false, data: err });
          throw err;
        } else {
          resolve({
            success: true,
            _identification: false,
            data: { path, content },
          });
        }
      },
    );
  });

export default writeFile;
