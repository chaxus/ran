/**
 * Statistical charset sniffing, backed by jschardet.
 *
 * Kept out of str.ts on purpose: jschardet is CommonJS, so bundlers cannot
 * tree-shake it and treat the import as a side effect. While it lived in
 * str.ts, every consumer of anything there (MessageCodec, getRandomString,
 * slugify ...) shipped the whole detector (~330 KB minified). Here it is only
 * pulled in by the three functions below.
 */
import { detect } from 'jschardet';

export const checkEncoding = (uint8Array: Uint8Array): string => {
  // Turn the Uint8Array into a string
  const asciiString = Array.from(uint8Array)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  const detected = detect(asciiString);
  return detected.encoding || 'utf-8';
};

/**
 * @description: Decode bytes into a string using the sniffed encoding. Required when reading
 * text files of unknown provenance (a user-uploaded txt, content scraped off an old site) —
 * a plain `new TextDecoder().decode()` turns GBK/Big5 into mojibake, and such files are a
 * sizeable share of Chinese-language content.
 * @param {ArrayBuffer | Uint8Array} buffer
 * @return {string}
 */
export const arrayBufferToString = (buffer: ArrayBuffer | Uint8Array): string => {
  const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return new TextDecoder(checkEncoding(uint8Array)).decode(uint8Array);
};

export interface TransformText {
  encoding: string;
  content: string;
}

export const transformText = (content: string | ArrayBuffer): TransformText | undefined => {
  if (content instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(content);
    const asciiString = String.fromCharCode.apply(null, uint8Array as unknown as number[]);
    const detected = detect(asciiString);
    const encoding = detected.encoding || 'utf-8';
    const text = new TextDecoder(encoding).decode(content);
    if (detected.encoding && text) {
      return {
        encoding: detected.encoding,
        content: text,
      };
    }
  } else {
    console.log('Unexpected result type:', typeof content);
  }
};
