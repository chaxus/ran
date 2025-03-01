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
};

export const arrayBufferToString = (arrayBuffer: ArrayBuffer | Uint8Array<ArrayBuffer>): string => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  const textDecoder = new TextDecoder(encoding);
  return textDecoder.decode(uint8Array);
};

export const checkEncoding = (uint8Array: Uint8Array): string => {
  // 将 Uint8Array 转换为字符串
  const asciiString = Array.from(uint8Array)
    .map((byte) => String.fromCharCode(byte))
    .join('');
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

export const pagingText = (content: string, container: HTMLElement): { text: string; h2: string }[] => {
  const text = content.replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
  const total = text.length;
  if (container) {
    const { clientHeight, clientWidth } = container;
    // 字体大小，字体行高，字体间距，字体宽度
    const rootFontSize = 16;
    const fontSize = 1.125 * rootFontSize; // 字体大小 text-lg
    const lineHeight = 0.25 * 10 * rootFontSize; // 行高（倍数）leading-10
    const letterSpacing = 0.025 * rootFontSize; // 字符间距（em）tracking-wide
    const charWidth = fontSize + letterSpacing; // 每个字符的宽度（px）
    const charsPerLine = Math.floor(clientWidth / charWidth); // 每行能容纳的字符数
    const lines = Math.floor(clientHeight / lineHeight); // 总行数
    const pageTotalChar = charsPerLine * lines; // 每页总字符数
    let useChar = 0;
    const result: { text: string; h2: string }[] = [];
    let h2 = '';
    while (total > useChar) {
      let currentLine = 0;
      let currentChart = 0;
      let currentText = '';
      while (currentLine < lines && currentChart < pageTotalChar) {
        if (text[useChar] === '<' && text[useChar + 1] === 'h' && text[useChar + 2] === '2') {
          const end = text.indexOf('</h2>', useChar);
          if (end > 0) {
            h2 = text.substring(useChar, end + 5);
          }
        }
        if (text[useChar] === '\n') {
          currentLine++;
          currentChart = 0;
        }
        if (text[useChar] === '\r') {
          currentLine++;
          currentChart = 0;
        }
        if (currentChart >= charsPerLine) {
          currentLine++;
          currentChart = 0;
        }
        currentText += text[useChar];
        useChar++;
        currentChart++;
      }
      result.push({
        text: currentText,
        h2,
      });
    }
    return result;
  }
  return [{ text: '', h2: '' }];
};

export const extractChapters = (text: string): { title: string; startIndex: number }[] => {
  const chapterRegex = /(?:第[一二三四五六七八九十百千万]+章|Chapter\s+\d+|CHAPTER\s+\d+|第\d+章)\s*.+/g;
  const chapters = [];
  let match;
  while ((match = chapterRegex.exec(text)) != null) {
    chapters.push({ title: match[0], startIndex: match.index });
  }
  return chapters;
};
