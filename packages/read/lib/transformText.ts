import jschardet from 'jschardet';
import { Locales, t } from '@/locales';

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

// 根据不同的语言计算不同的字体大小
export const getFontSize = (): number => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const language = navigator?.language || Locales.en;
  if (language === Locales['zh-CN']) {
    return 1.125;
  }
  return 1.125;
};
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
    if (clientHeight < 30 || clientWidth < 30) {
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
    }
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

    // 辅助函数：检查是否是英文单词的一部分（包括连字符和半角字符）
    const isWordPart = (char: string): boolean => {
      // 匹配英文字母、数字、连字符、下划线、点号、逗号、感叹号、问号、分号、冒号、引号、括号等半角字符
      return /[\w\-.,!?;:'"()[\]{}]/.test(char);
    };

    // 辅助函数：查找下一个单词的结束位置
    const findNextWordEnd = (start: number): number => {
      let pos = start;
      let lastWordEnd = start;

      while (pos < total) {
        const char = text[pos];
        if (isWordPart(char)) {
          pos++;
        } else if (char === ' ') {
          // 如果遇到空格且正在处理单词，结束当前单词
          lastWordEnd = pos;
          pos++;
          break;
        } else {
          pos++;
        }
      }
      return lastWordEnd;
    };

    // 辅助函数：查找当前单词的开始位置
    const findWordStart = (end: number): number => {
      let pos = end;
      let lastWordStart = end;

      while (pos > 0) {
        const char = text[pos - 1];
        if (isWordPart(char)) {
          lastWordStart = pos - 1;
          pos--;
        } else if (char === ' ') {
          // 如果遇到空格且正在处理单词，结束当前单词
          break;
        } else {
          pos--;
        }
      }
      return lastWordStart;
    };

    while (total > useChar) {
      let currentLine = 0;
      let currentChart = 0;
      let currentText = '';
      const pageStart = useChar;
      let remainingChars = pageTotalChar;

      while (currentLine < totalLine && currentChart < pageTotalChar && useChar < total) {
        const char = text[useChar];

        if (char === '\n' || char === '\r') {
          currentLine++;
          currentChart = 0;
          currentText += char;
          useChar++;
          remainingChars--;
          continue;
        }

        // 检查当前字符是否是单词的一部分
        const isWordPartChar = isWordPart(char);

        // 如果当前行已满
        if (currentChart >= charsPerLine) {
          // 如果当前正在处理一个单词
          if (isWordPartChar) {
            // 找到当前单词的开始位置
            const wordStart = findWordStart(useChar);
            // 找到当前单词的结束位置
            const wordEnd = findNextWordEnd(useChar);
            // 如果单词太长，无法在当前行放下，将整个单词移到下一行
            if (wordEnd - wordStart > charsPerLine) {
              currentLine++;
              currentChart = 0;
              continue;
            }
          }
          currentLine++;
          currentChart = 0;
          continue;
        }

        currentText += char;
        useChar++;
        if (isWordPart(char)) {
          currentChart += 0.5625;
        } else {
          currentChart++;
        }
        remainingChars--;
      }

      // 检查是否在单词中间结束页面
      if (useChar < total) {
        const nextChar = text[useChar];
        if (isWordPart(nextChar)) {
          // 找到当前单词的开始位置
          const wordStart = findWordStart(useChar);
          // 找到当前单词的结束位置
          const wordEnd = findNextWordEnd(useChar);
          const wordLength = wordEnd - wordStart;

          // 如果单词无法在当前页放下，将整个单词移到下一页
          if (wordLength > remainingChars) {
            // 回退到单词开始位置
            currentText = currentText.slice(0, wordStart - pageStart);
            useChar = wordStart;
          }
        }
      }

      const size = result.length;
      result.push({
        text: currentText,
        start: pageStart,
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
export const transformTextToExpectedFormat = ({
  content,
  container,
  title,
}: {
  content: ArrayBuffer | Uint8Array<ArrayBuffer>;
  container: HTMLElement;
  title: string;
}): TextSyntaxTree => {
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
      sections.push({ title: t('preface'), section });
    }
    const section = text.slice(start, end);
    sections.push({ title, section });
  });
  if (extractedChapters.length === 0) {
    sections.push({ title, section: text });
  }
  if (container?.clientWidth < 30 || container?.clientHeight < 30) {
    return {
      sequences: [],
      totalPage: 0,
      pageText: [],
      pageTitleId: [],
      titleIdTitle: [],
      titleIdPage: {},
    };
  }
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
