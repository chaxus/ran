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

export interface PagingText {
  total: number;
  totalLine: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  charWidth: number;
  charsPerLine: number;
  pageTotalChar: number;
}

export interface PagingTextItem extends PagingText {
  text: string;
  start: number;
  end: number;
  index: number;
}

export interface PagingTextResult extends PagingText {
  program: PagingTextItem[];
}

export const CHAPTER_TITLE_START = '<caption-title>';

export const CHAPTER_TITLE_END = '</caption-title>';

export const CHAPTER_TITLE_CONTENT = '*';
/**
 * @description: 将文本转换成语法树
 * @param {string} content 文本内容
 * @param {HTMLElement} container 容器
 * @param {ChapterItem} extractedChapters 目录
 * @return {PagingTextResult}
 */
export const pagingText = (content: string, container: HTMLElement): PagingTextResult => {
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
    const totalLine = Math.floor(clientHeight / lineHeight); // 总行数
    const pageTotalChar = charsPerLine * totalLine; // 每页总字符数
    let useChar = 0;
    const result: PagingTextItem[] = [];
    while (total > useChar) {
      let currentLine = 0;
      let currentChart = 0;
      let currentText = '';
      while (currentLine < totalLine && currentChart < pageTotalChar && useChar < total) {
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
      const size = result.length;
      result.push({
        text: currentText,
        start: useChar - currentText.length,
        end: useChar,
        index: size,
        total,
        totalLine,
        fontSize,
        lineHeight,
        letterSpacing,
        charWidth,
        charsPerLine,
        pageTotalChar,
      });
    }
    result.forEach((item, index) => {
      if (index === 0) {
        item.start = 0;
      }
      item.start = result[index - 1]?.end || 0;
    });
    return {
      program: result,
      total,
      totalLine,
      fontSize,
      lineHeight,
      letterSpacing,
      charWidth,
      charsPerLine,
      pageTotalChar,
    };
  }
  return {
    program: [],
    total,
    totalLine: 0,
    fontSize: 0,
    lineHeight: 0,
    letterSpacing: 0,
    charWidth: 0,
    charsPerLine: 0,
    pageTotalChar: 0,
  };
};

export const extractChapters = (text: string): { title: string; startIndex: number }[] => {
  const chapterRegex = /(?:第 [一二三四五六七八九十百千万]+章|Chapter\s+\d+|CHAPTER\s+\d+|第\d+ 章)\s*.+/g;
  const chapters = [];
  let match;
  while ((match = chapterRegex.exec(text)) != null) {
    chapters.push({ title: match[0], startIndex: match.index });
  }
  return chapters;
};

export interface ChapterItem {
  title: string;
  start: number;
  end?: number;
  pageNum?: number;
}

export const extractRomanChapters = (text: string): ChapterItem[] => {
  const romanRegex = /(?:\s|^)(I{1,3}|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)(?:\s|$)/g;
  const chapters: ChapterItem[] = [];
  let match;
  while ((match = romanRegex.exec(text)) != null) {
    chapters.push({ title: match[1], start: match.index });
  }
  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    chapter.end = nextChapter ? nextChapter.start : text.length;
  });
  return chapters;
};
/**
 * @description: 罗马数字转阿拉伯数字
 * @param {string} roman
 * @return {number}
 */
export const romanToArabic = (roman: string): number => {
  const romanNumeralMap: Record<string, number> = {
    I: 1,
    IV: 4,
    V: 5,
    IX: 9,
    X: 10,
    XL: 40,
    L: 50,
    XC: 90,
    C: 100,
    CD: 400,
    D: 500,
    CM: 900,
    M: 1000,
  };

  let arabic = 0;
  let i = 0;

  while (i < roman.length) {
    const twoChar = roman[i] + (roman[i + 1] || '');
    if (romanNumeralMap[twoChar]) {
      arabic += romanNumeralMap[twoChar];
      i += 2;
    } else {
      arabic += romanNumeralMap[roman[i]];
      i += 1;
    }
  }

  return arabic;
};

export const toString = (value: unknown): string => {
  return value == null ? '' : String(value);
};

export const trim = (value: string): string => {
  return toString(value).trim();
};

export const extractCaptionTitleChapters = (text: string): ChapterItem[] => {
  const captionTitleRegex = /<caption-title>([\s\S]*?)<\/caption-title>/g;
  const chapters: ChapterItem[] = [];
  let match;

  while ((match = captionTitleRegex.exec(text)) != null) {
    chapters.push({ title: trim(match[1]), start: match.index });
  }

  // 设置每个章节的结束位置
  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    chapter.end = nextChapter ? nextChapter.start : text.length;
  });

  return chapters;
};

export interface Section {
  title: string;
  section: string;
}

export interface Sequence {
  title: string;
  result: PagingTextResult;
  titleId: number;
}

export interface TextSyntaxTree {
  sequences: Sequence[];
  totalPage: number;
  pageText: PagingTextItem[];
  pageTitleId: number[];
  titleIdTitle: string[];
  titleIdPage: Record<string, number>;
}

// 处理文本成期望的格式：
export const transformTextToExpectedFormat = (
  content: ArrayBuffer | Uint8Array<ArrayBuffer>,
  container: HTMLElement,
): TextSyntaxTree => {
  // 1. 过滤空格换行
  const text = arrayBufferToString(content).replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
  // 2. 提取章节标题
  const extractedChapters = extractCaptionTitleChapters(text);
  // 3. 把文本按章节划分
  const sections: Section[] = [];
  extractedChapters.forEach((item, index) => {
    const { start, end, title } = item;
    if (index === 0) {
      const section = text.slice(0, start);
      sections.push({ title: '前言', section });
    }
    const section = text.slice(start, end);
    sections.push({ title, section });
  });
  // 4. 把章节按页划分
  const sequences: Sequence[] = [];
  sections.forEach((item, index) => {
    const { title, section } = item;
    if (container) {
      const result = pagingText(section.replace(CHAPTER_TITLE_START, '').replace(CHAPTER_TITLE_END, ''), container);
      sequences.push({ title, result, titleId: index });
    }
  });

  // 5. 输出文本语法树
  let totalPage = 0;
  // 通过空间换时间，构建 page -> text 的映射
  const pageText: PagingTextItem[] = [];
  // page -> titleId 的映射
  const pageTitleId: number[] = [];
  // titleId -> title 的映射
  const titleIdTitle: string[] = [];
  // titleId -> page 的映射
  const titleIdPage: Record<string, number> = {};

  sequences.forEach((item) => {
    totalPage += item.result.program.length;
    item.result.program.forEach((page) => {
      if (!titleIdPage[item.titleId]) {
        titleIdPage[item.titleId] = pageText.length;
      }
      pageTitleId.push(item.titleId);
      pageText.push(page);
    });
    titleIdTitle.push(item.title);
  });

  return {
    sequences,
    totalPage,
    pageText,
    pageTitleId,
    titleIdTitle,
    titleIdPage,
  };
};
