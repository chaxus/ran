const fs = require("fs");
import readFile from './readFile'

type Error = NodeJS.ErrnoException | null

const appendFile = (path: string, content: string) =>
    new Promise((resolve, reject) => {
        fs.appendFile(path, content, (err: Error) => {
            err ? reject(err) : readFile(path).then(data => {
                resolve({ path, data })
            })
        });
    });

export default appendFile;
