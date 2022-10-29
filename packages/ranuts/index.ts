import writeFile from "@/functions/writeFile";
import readFile from '@/functions/readFile'
import watchFile from "@/functions/watchFile";
import EventEmitter from "@/model/EventEmitter";
import queryFileInfo from "@/functions/fileInfo";
import filterObj from "@/functions/filterObj";
import str2Xml from '@/functions/str2Xml'

export default {
    writeFile,
    readFile,
    watchFile,
    EventEmitter,
    queryFileInfo,
    filterObj,
    str2Xml
}