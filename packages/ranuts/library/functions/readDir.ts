import { resolve } from "path";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Options {
    dirPath: string,
    ignores?: Array<string>
}

const readDir = async (options: Options) => {
    const { dirPath, ignores } = options
    try {
        const result: Record<string, any> = {}
        const fileList = fs.readdirSync(dirPath);
        for (const file of fileList) {
            // 过滤隐藏文件
            if (file.length > 0 && file[0] === ".") continue;
            // 过滤忽视的文件
            if (ignores?.includes(file)) continue
            const serve = await import(`${dirPath}/${file}`);
            // const type = Reflect.toString.call(serve);
            const [key, _] = file.split(".");
            result[key] = serve.default ? serve.default : serve
        }
        return result
    } catch (error) {
        throw error
    }

}


export default readDir;
