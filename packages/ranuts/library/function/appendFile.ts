import { fs } from '@/function/nodeLibrary'
import readFile from '@/function/readFile'

type Error = NodeJS.ErrnoException | null

const appendFile = (path: string, content: string) =>
    new Promise((resolve, reject) => {
        fs.appendFile(path, content, (err: Error) => {
            err ? reject({ status: false, data: err }) : readFile(path).then((content: string) => {
                resolve({ status: true, data: { path, content } })
            })
        });
    });

export default appendFile;
