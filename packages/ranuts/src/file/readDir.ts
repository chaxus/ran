import fs from '@/node/fs'


interface Options {
    dirPath: string,
    ignores?: Array<string>
}

const readDir = async (options: Options) => {
    const { dirPath } = options
    try {
        return fs.readdirSync(dirPath);
    } catch (error) {
        throw error
    }

}


export default readDir;
