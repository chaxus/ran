import { createScheduler, createWorker } from 'tesseract.js'
import type { BaseReturn } from '@/utils/index'

interface Options {
    images: string[],
    languages: string[]
}

interface OcrReturn extends BaseReturn {
    data: null | Tesseract.RecognizeResult[],
}

export const ocr = async ({ images = [], languages = ['eng', 'chi_sim'] }: Options): Promise<OcrReturn> => {
    if (images.length === 0) return { success: false, data: null, message: 'images must be a array' }
    if (languages.length === 0) return { success: false, data: null, message: 'languages must be a array' }
    const scheduler = createScheduler();
    for (const lan of languages) {
        const worker = await createWorker(lan);
        scheduler.addWorker(worker);
    }
    const results = await Promise.all(images.map((image) => (
        scheduler.addJob('recognize', image)
    )))
    await scheduler.terminate(); // It also terminates all workers.
    return { success: true, data: results, message: 'success' }
}