import { loadScript } from "@/utils/index"
import seoffice from '@/assets/js/seoffice.js?raw'
import { getMimeTypeFromExtension } from '@/utils/index'


export interface EmscriptenFileSystem {
    mkdir(path: string): void
    readdir(path: string): string[]
    readFile(path: string, options?: { encoding: 'binary' }): Uint8Array
    writeFile(path: string, data: Uint8Array | string): void
}

export interface EmscriptenModule {
    FS: EmscriptenFileSystem
    ccall: (funcName: string, returnType: string, argTypes: string[], args: any[]) => number
    onRuntimeInitialized: () => void
}

export type DocumentType = 'word' | 'cell' | 'slide'

export interface ConversionResult {
    fileName: string
    type: DocumentType
    bin: Uint8Array
    media: Record<string, string>
}

export interface BinConversionResult {
    fileName: string
    data: Uint8Array
}

declare global {
    interface Window {
        Module: any
        DocsAPI: any
    }
}

/**
 * X2T 工具类 - 负责文档转换功能
 */
export class X2TConverter {
    private x2tModule: EmscriptenModule | null = null
    private isReady = false
    private initPromise: Promise<EmscriptenModule> | null = null
    private hasScriptLoaded = false

    // 支持的文件类型映射
    private readonly DOCUMENT_TYPE_MAP: Record<string, DocumentType> = {
        docx: 'word',
        doc: 'word',
        odt: 'word',
        rtf: 'word',
        txt: 'word',
        xlsx: 'cell',
        xls: 'cell',
        ods: 'cell',
        csv: 'cell',
        pptx: 'slide',
        ppt: 'slide',
        odp: 'slide',
    }

    private readonly WORKING_DIRS = [
        '/working',
        '/working/media',
        '/working/fonts',
        '/working/themes',
    ]
    private readonly SCRIPT_PATH = '/assets/wasm/x2t/x2t.js'
    private readonly INIT_TIMEOUT = 20000

    /**
     * 加载 X2T 脚本文件
     */
    async loadScript(): Promise<void> {
        if (this.hasScriptLoaded) return

        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = this.SCRIPT_PATH
            script.onload = () => {
                this.hasScriptLoaded = true
                console.log('X2T WASM script loaded successfully')
                resolve()
            }

            script.onerror = (error) => {
                const errorMsg = 'Failed to load X2T WASM script'
                console.error(errorMsg, error)
                reject(new Error(errorMsg))
            }

            document.head.appendChild(script)
        })
    }

    /**
     * 初始化 X2T 模块
     */
    async initialize(): Promise<EmscriptenModule> {
        if (this.isReady && this.x2tModule) {
            return this.x2tModule
        }

        // 防止重复初始化
        if (this.initPromise) {
            return this.initPromise
        }

        this.initPromise = this.doInitialize()
        return this.initPromise
    }

    private async doInitialize(): Promise<EmscriptenModule> {
        try {
            // 确保脚本已加载
            await this.loadScript()

            return new Promise((resolve, reject) => {
                const x2t = window.Module
                if (!x2t) {
                    reject(new Error('X2T module not found after script loading'))
                    return
                }

                // 设置超时处理
                const timeoutId = setTimeout(() => {
                    if (!this.isReady) {
                        reject(new Error(`X2T initialization timeout after ${this.INIT_TIMEOUT}ms`))
                    }
                }, this.INIT_TIMEOUT)

                x2t.onRuntimeInitialized = () => {
                    try {
                        clearTimeout(timeoutId)
                        this.createWorkingDirectories(x2t)
                        this.x2tModule = x2t
                        this.isReady = true
                        console.log('X2T module initialized successfully')
                        resolve(x2t)
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        } catch (error) {
            this.initPromise = null // 重置以允许重试
            throw error
        }
    }

    /**
     * 创建工作目录
     */
    private createWorkingDirectories(x2t: EmscriptenModule): void {
        this.WORKING_DIRS.forEach((dir) => {
            try {
                x2t.FS.mkdir(dir)
            } catch (error) {
                // 目录可能已存在，忽略错误
                console.warn(`Directory ${dir} may already exist:`, error)
            }
        })
    }

    /**
     * 获取文档类型
     */
    private getDocumentType(extension: string): DocumentType {
        const docType = this.DOCUMENT_TYPE_MAP[extension.toLowerCase()]
        if (!docType) {
            throw new Error(`Unsupported file format: ${extension}`)
        }
        return docType
    }

    /**
     * 清理文件名
     */
    private sanitizeFileName(input: string): string {
        if (typeof input !== 'string' || !input.trim()) {
            return 'file.bin'
        }

        const parts = input.split('.')
        const ext = parts.pop() || 'bin'
        const name = parts.join('.')

        const illegalChars = /[/?<>\\:*|"]/g
        const controlChars = /[\x00-\x1f\x80-\x9f]/g
        const reservedPattern = /^\.+$/
        const unsafeChars = /[&'%!"{}[\]]/g

        let sanitized = name
            .replace(illegalChars, '')
            .replace(controlChars, '')
            .replace(reservedPattern, '')
            .replace(unsafeChars, '')

        sanitized = sanitized.trim() || 'file'
        return `${sanitized.slice(0, 200)}.${ext}` // 限制长度
    }

    /**
     * 执行文档转换
     */
    private executeConversion(paramsPath: string): void {
        if (!this.x2tModule) {
            throw new Error('X2T module not initialized')
        }

        const result = this.x2tModule.ccall('main1', 'number', ['string'], [paramsPath])
        if (result !== 0) {
            throw new Error(`Conversion failed with code: ${result}`)
        }
    }

    /**
     * 创建转换参数 XML
     */
    private createConversionParams(
        fromPath: string,
        toPath: string,
        additionalParams = '',
    ): string {
        return `<?xml version="1.0" encoding="utf-8"?>
<TaskQueueDataConvert xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <m_sFileFrom>${fromPath}</m_sFileFrom>
  <m_sThemeDir>/working/themes</m_sThemeDir>
  <m_sFileTo>${toPath}</m_sFileTo>
  <m_bIsNoBase64>false</m_bIsNoBase64>
  ${additionalParams}
</TaskQueueDataConvert>`
    }

    /**
     * 读取媒体文件
     */
    private readMediaFiles(): Record<string, string> {
        if (!this.x2tModule) return {}

        const media: Record<string, string> = {}

        try {
            const files = this.x2tModule.FS.readdir('/working/media/')

            files
                .filter((file) => file !== '.' && file !== '..')
                .forEach((file) => {
                    try {
                        const fileData = this.x2tModule!.FS.readFile(`/working/media/${file}`, {
                            encoding: 'binary',
                        })

                        const blob = new Blob([fileData])
                        // eslint-disable-next-line n/no-unsupported-features/node-builtins
                        const mediaUrl = URL.createObjectURL(blob)
                        media[`media/${file}`] = mediaUrl
                    } catch (error) {
                        console.warn(`Failed to read media file ${file}:`, error)
                    }
                })
        } catch (error) {
            console.warn('Failed to read media directory:', error)
        }

        return media
    }

    /**
     * 将文档转换为 bin 格式
     */
    async convertDocument(file: File): Promise<ConversionResult> {
        await this.initialize()

        const fileName = file.name
        const fileExt = fileName.split('.').pop()?.toLowerCase() || ''
        const documentType = this.getDocumentType(fileExt)

        try {
            // 读取文件内容
            const arrayBuffer = await file.arrayBuffer()
            const data = new Uint8Array(arrayBuffer)

            // 生成安全的文件名
            const sanitizedName = this.sanitizeFileName(fileName)
            const inputPath = `/working/${sanitizedName}`
            const outputPath = `${inputPath}.bin`

            // 写入文件到虚拟文件系统
            this.x2tModule!.FS.writeFile(inputPath, data)

            // 创建转换参数
            const params = this.createConversionParams(inputPath, outputPath)
            this.x2tModule!.FS.writeFile('/working/params.xml', params)

            // 执行转换
            this.executeConversion('/working/params.xml')

            // 读取转换结果
            const result = this.x2tModule!.FS.readFile(outputPath)
            const media = this.readMediaFiles()

            return {
                fileName: sanitizedName,
                type: documentType,
                bin: result,
                media,
            }
        } catch (error) {
            throw new Error(
                `Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }

    /**
     * 将 bin 格式转换为指定格式并下载
     */
    async convertBinToDocumentAndDownload(
        bin: Uint8Array,
        originalFileName: string,
        targetExt = 'DOCX',
    ): Promise<BinConversionResult> {
        await this.initialize()

        const sanitizedBase = this.sanitizeFileName(originalFileName).replace(/\.[^/.]+$/, '')
        const binFileName = `${sanitizedBase}.bin`
        const outputFileName = `${sanitizedBase}.${targetExt.toLowerCase()}`

        try {
            // 写入 bin 文件
            this.x2tModule!.FS.writeFile(`/working/${binFileName}`, bin)

            // 创建转换参数
            let additionalParams = ''
            if (targetExt === 'PDF') {
                additionalParams = '<m_sFontDir>/working/fonts/</m_sFontDir>'
            }

            const params = this.createConversionParams(
                `/working/${binFileName}`,
                `/working/${outputFileName}`,
                additionalParams,
            )

            this.x2tModule!.FS.writeFile('/working/params.xml', params)

            // 执行转换
            this.executeConversion('/working/params.xml')

            // 读取生成的文档
            const result = this.x2tModule!.FS.readFile(`/working/${outputFileName}`)

            // 下载文件
            // TODO: 完善打印功能
            this.saveWithFileSystemAPI(result, outputFileName)

            return {
                fileName: outputFileName,
                data: result,
            }
        } catch (error) {
            throw new Error(
                `Bin to document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }

    /**
     * 下载文件
     */
    private downloadFile(data: Uint8Array, fileName: string): void {
        const blob = new Blob([data])
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = fileName
        link.style.display = 'none'

        document.body.appendChild(link)
        link.click()

        // 清理资源
        setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }, 100)
    }

    /**
     * 获取文件 MIME 类型
     */
    private getMimeTypeFromExtension(extension: string): string {
        const mimeTypes: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        }
        return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
    }

    /**
     * 获取文件类型描述
     */
    private getFileDescription(extension: string): string {
        const descriptionMap: Record<string, string> = {
            docx: 'Word Document',
            doc: 'Word 97-2003 Document',
            odt: 'OpenDocument Text',
            pdf: 'PDF Document',
            xlsx: 'Excel Workbook',
            xls: 'Excel 97-2003 Workbook',
            ods: 'OpenDocument Spreadsheet',
            pptx: 'PowerPoint Presentation',
            ppt: 'PowerPoint 97-2003 Presentation',
            odp: 'OpenDocument Presentation',
            txt: 'Text Document',
            rtf: 'Rich Text Format',
            csv: 'CSV File',
        }

        return descriptionMap[extension.toLowerCase()] || 'Document'
    }

    /**
     * 使用现代文件系统 API 保存文件
     */
    private async saveWithFileSystemAPI(
        data: Uint8Array,
        fileName: string,
        mimeType?: string,
    ): Promise<void> {
        if (!(window as any).showSaveFilePicker) {
            this.downloadFile(data, fileName)
            return
        }
        try {
            // 获取文件扩展名并确定 MIME 类型
            const extension = fileName.split('.').pop()?.toLowerCase() || ''
            const detectedMimeType = mimeType || this.getMimeTypeFromExtension(extension)

            // 显示文件保存对话框
            const fileHandle = await (window as any).showSaveFilePicker({
                suggestedName: fileName,
                types: [
                    {
                        description: this.getFileDescription(extension),
                        accept: {
                            [detectedMimeType]: [`.${extension}`],
                        },
                    },
                ],
            })

            // 创建可写流并写入数据
            const writable = await fileHandle.createWritable()
            await writable.write(data)
            await writable.close()

            console.log('File saved successfully:', fileName)
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                console.log('User cancelled the save operation')
                return
            }
            throw error
        }
    }

    /**
     * 销毁实例，清理资源
     */
    destroy(): void {
        this.x2tModule = null
        this.isReady = false
        this.initPromise = null
        console.log('X2T converter destroyed')
    }
}

// 单例实例
const x2tConverter = new X2TConverter()

// 导出的公共 API
export const initX2TScript = (): Promise<void> => x2tConverter.loadScript()
export const initX2T = (): Promise<EmscriptenModule> => x2tConverter.initialize()
export const convertDocument = (file: File): Promise<ConversionResult> =>
    x2tConverter.convertDocument(file)
export const convertBinToDocumentAndDownload = (
    bin: Uint8Array,
    fileName: string,
    targetExt?: string,
): Promise<BinConversionResult> =>
    x2tConverter.convertBinToDocumentAndDownload(bin, fileName, targetExt)

// 文件类型常量
export const oAscFileType = {
    UNKNOWN: 0,
    PDF: 513,
    PDFA: 521,
    DJVU: 515,
    XPS: 516,
    DOCX: 65,
    DOC: 66,
    ODT: 67,
    RTF: 68,
    TXT: 69,
    HTML: 70,
    MHT: 71,
    EPUB: 72,
    FB2: 73,
    MOBI: 74,
    DOCM: 75,
    DOTX: 76,
    DOTM: 77,
    FODT: 78,
    OTT: 79,
    DOC_FLAT: 80,
    DOCX_FLAT: 81,
    HTML_IN_CONTAINER: 82,
    DOCX_PACKAGE: 84,
    OFORM: 85,
    DOCXF: 86,
    DOCY: 4097,
    CANVAS_WORD: 8193,
    JSON: 2056,
    XLSX: 257,
    XLS: 258,
    ODS: 259,
    CSV: 260,
    XLSM: 261,
    XLTX: 262,
    XLTM: 263,
    XLSB: 264,
    FODS: 265,
    OTS: 266,
    XLSX_FLAT: 267,
    XLSX_PACKAGE: 268,
    XLSY: 4098,
    PPTX: 129,
    PPT: 130,
    ODP: 131,
    PPSX: 132,
    PPTM: 133,
    PPSM: 134,
    POTX: 135,
    POTM: 136,
    FODP: 137,
    OTP: 138,
    PPTX_PACKAGE: 139,
    IMG: 1024,
    JPG: 1025,
    TIFF: 1026,
    TGA: 1027,
    GIF: 1028,
    PNG: 1029,
    EMF: 1030,
    WMF: 1031,
    BMP: 1032,
    CR2: 1033,
    PCX: 1034,
    RAS: 1035,
    PSD: 1036,
    ICO: 1037,
} as const

export const c_oAscFileType2 = Object.fromEntries(
    Object.entries(oAscFileType).map(([key, value]) => [value, key]),
) as Record<number, keyof typeof oAscFileType>


// 编辑器实例
let editor: { value: any } = { value: null };
// 媒体资源映射
let media: Record<string, string> = {};
// 当前文件属性
let props: { file: { fileName: string } } = { file: { fileName: '' } };

export const loadEditorApi = async (): Promise<void> => {
    // 检查是否已加载
    if (window.DocsAPI) {
        return
    }
    // 加载编辑器 API
    loadScript({
        type: 'content',
        content: seoffice,
    })
}

interface SaveEvent {
    data: {
        data: string
        option: any
    }
}

async function handleSaveDocument(event: SaveEvent) {
    console.log('Save document event:', event)

    if (event.data && event.data.data) {
        const { data, option } = event.data
        console.log(data, 'data')
        // 创建下载
        await convertBinToDocumentAndDownload(
            new Uint8Array(data.split(',').map(Number)),
            props.file.fileName,
            c_oAscFileType2[option.outputformat],
        )
    }

    // 告知编辑器保存完成
    editor.value.sendCommand({
        command: 'asc_onSaveCallback',
        data: { err_code: 0 },
    })
}

/**
 * 处理文件写入请求（主要用于处理粘贴的图片）
 * @param event - OnlyOffice 编辑器的文件写入事件
 */
function handleWriteFile(event: any) {
    try {
        console.log('Write file event:', event)

        const { data: eventData } = event
        if (!eventData) {
            console.warn('No data provided in writeFile event')
            return
        }

        const {
            data: imageData, // Uint8Array 图片数据
            file: fileName, // 文件名，如 "display8image-174799443357-0.png"
            _target, // 目标对象，包含 frameOrigin 等信息
        } = eventData

        // 验证数据
        if (!imageData || !(imageData instanceof Uint8Array)) {
            throw new Error('Invalid image data: expected Uint8Array')
        }

        if (!fileName || typeof fileName !== 'string') {
            throw new Error('Invalid file name')
        }

        // 从文件名中提取扩展名
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'png'
        const mimeType = getMimeTypeFromExtension(fileExtension)

        // 创建 Blob 对象
        const blob = new Blob([new Uint8Array(imageData.buffer)], { type: mimeType })

        // 创建对象 URL
        const objectUrl = URL.createObjectURL(blob)
        
        // 将图片 URL 添加到媒体映射中，使用原始文件名作为 key
        media[`media/${fileName}`] = objectUrl
        editor.value.sendCommand({
            command: 'asc_setImageUrls',
            data: {
                urls: media,
            },
        })

        editor.value.sendCommand({
            command: 'asc_writeFileCallback',
            data: {
                path: objectUrl,
                imgName: fileName,
            },
        })
        console.log(`Successfully processed image: ${fileName}, URL: ${objectUrl}`)
    } catch (error) {
        console.error('Error handling writeFile:', error)

        // 通知编辑器文件处理失败
        if (editor.value && typeof editor.value.sendCommand === 'function') {
            editor.value.sendCommand({
                command: 'asc_writeFileCallback',
                data: {
                    success: false,
                    error: error.message,
                },
            })
        }

        if (event.callback && typeof event.callback === 'function') {
            event.callback({
                success: false,
                error: error.message,
            })
        }
    }
}

// 公共编辑器创建方法
export const createEditorInstance = (config: {
    fileName: string
    fileType: string
    binData: ArrayBuffer
    media?: Record<string, string>
}): void => {
    // 清理旧编辑器实例
    if (editor.value) {
        editor.value.destroyEditor()
        editor.value = null
    }

    const { fileName, fileType, binData, media: mediaFiles } = config
    props.file.fileName = fileName
    media = mediaFiles || {}

    const editorInstance = new window.DocsAPI.DocEditor('iframe', {
        document: {
            title: fileName,
            url: fileName, // 使用文件名作为标识
            fileType: fileType,
            permissions: {
                edit: true,
                chat: false,
                protect: false,
            },
        },
        editorConfig: {
            lang: 'zh',
            customization: {
                help: false,
                about: false,
                hideRightMenu: true,
                features: {
                    spellcheck: {
                        change: false,
                    },
                },
                anonymous: {
                    request: false,
                    label: 'Guest',
                },
            },
        },
        events: {
            onAppReady: () => {
                // 设置媒体资源
                if (media) {
                    editorInstance.sendCommand({
                        command: 'asc_setImageUrls',
                        data: { urls: media },
                    })
                }

                // 加载文档内容
                editorInstance.sendCommand({
                    command: 'asc_openDocument',
                    data: { buf: binData },
                })
            },
            onDocumentReady: () => {
                console.log('文档加载完成：', fileName)
            },
            onSave: handleSaveDocument,
            writeFile: handleWriteFile,
        },
    })

    editor.value = editorInstance
}