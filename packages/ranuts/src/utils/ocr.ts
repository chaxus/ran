import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createScheduler, createWorker } from 'tesseract.js'
import type { BaseReturn } from '@/utils/index'


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

interface Options {
    images: string[],
    language: string,
    langPath?: string
}

interface OcrReturn extends BaseReturn {
    data: null | Tesseract.RecognizeResult[],
}

export const ocr = async ({ images = [], language = 'eng', langPath = '' }: Options): Promise<OcrReturn> => {
    if (images.length === 0) return { success: false, data: null, message: 'images must be a array' }
    if (!language) return { success: false, data: null, message: 'languages must be a array' }
    // const langs = ['eng', 'chi_sim', 'jpn', 'kor', 'deu', 'fra']
    let options = {}
    if (langPath) {
        options = { langPath }
    }
    const scheduler = createScheduler();
    const worker = await createWorker(language, 3, options);
    scheduler.addWorker(worker);
    const results = await Promise.all(images.map((image) => (
        scheduler.addJob('recognize', image)
    )))
    await scheduler.terminate();
    return { success: true, data: results, message: 'success' }
}