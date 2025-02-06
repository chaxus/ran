import jschardet from 'jschardet';

export interface TransformText {
  encoding: string;
  content: string;
}

export const transformText = (content: string | ArrayBuffer): TransformText | undefined => {
  if (content instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(content);
    const asciiString = String.fromCharCode.apply(null, uint8Array as unknown as number[]);
    const detected = jschardet.detect(asciiString);
    const encoding = detected.encoding || 'utf-8';
    const text = new TextDecoder(encoding).decode(content);
    if (detected.encoding && text) {
      return {
        encoding: detected.encoding,
        content: text,
      };
    }
  } else {
    console.error('Unexpected result type:', typeof content);
  }
}

export const arrayBufferToString = (arrayBuffer: ArrayBuffer | Uint8Array<ArrayBuffer>): string => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  const textDecoder = new TextDecoder(encoding);
  return textDecoder.decode(uint8Array);
};

export const checkEncoding = (uint8Array: Uint8Array): string => {
  // 将 Uint8Array 转换为字符串
  const asciiString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
  const detected = jschardet.detect(asciiString);
  return detected.encoding || 'utf-8';
};


export const createReader = (file: File): Promise<Uint8Array<ArrayBuffer>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result) {
        const uint8Array = new Uint8Array(reader.result as ArrayBuffer);
        resolve(uint8Array);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.onabort = (abort) => {
      reject(abort);
    };
  });
};
