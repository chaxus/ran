/**
 * Promise wrappers around FileReader. The native FileReader exposes three callbacks —
 * `onload` / `onerror` / `onabort` — and forgetting `onabort` leaves the promise pending
 * forever when the user cancels; all three exits are wired up here.
 */

type ReadAs = 'arrayBuffer' | 'text' | 'dataURL' | 'binaryString';

const read = <T>(blob: Blob, as: ReadAs, encoding?: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new Error('FileReader is not available'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as T);
    reader.onerror = () => reject(reader.error ?? new Error('read file error'));
    reader.onabort = () => reject(new Error('read file aborted'));
    if (as === 'arrayBuffer') reader.readAsArrayBuffer(blob);
    else if (as === 'text') reader.readAsText(blob, encoding);
    else if (as === 'dataURL') reader.readAsDataURL(blob);
    else reader.readAsBinaryString(blob);
  });
};

/**
 * @description: Read a File / Blob as an ArrayBuffer
 * @param {Blob} blob
 * @return {Promise<ArrayBuffer>}
 */
export const readFileAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => read<ArrayBuffer>(blob, 'arrayBuffer');

/**
 * @description: Read a File / Blob as a Uint8Array (pair with checkEncoding / arrayBufferToString for encoding sniffing)
 * @param {Blob} blob
 * @return {Promise<Uint8Array>}
 */
export const readFileAsUint8Array = async (blob: Blob): Promise<Uint8Array> =>
  new Uint8Array(await readFileAsArrayBuffer(blob));

/**
 * @description: Read a File / Blob as text
 * @param {Blob} blob
 * @param {string} encoding charset, defaults to utf-8; sniff with checkEncoding first when the encoding is unknown
 * @return {Promise<string>}
 */
export const readFileAsText = (blob: Blob, encoding?: string): Promise<string> => read<string>(blob, 'text', encoding);

/**
 * @description: Read a File / Blob as a data: URL (image previews and the like)
 * @param {Blob} blob
 * @return {Promise<string>}
 */
export const readFileAsDataURL = (blob: Blob): Promise<string> => read<string>(blob, 'dataURL');
