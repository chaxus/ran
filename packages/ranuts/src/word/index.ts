import init, {
  TokenizeMode,
  addWord,
  cut,
  tokenize,
} from '../../assets/wasm/word/wasmjieba-web';
import type { InitOutput } from '../../assets/wasm/word/wasmjieba-web';

interface TokenWord {
  word: string;
  start: number;
  end: number;
}

interface Word {
  success: boolean;
  data: InitOutput;
  methods: {
    tokenize: (str: string) => TokenWord[];
    cut: (str: string) => string[];
    addWord: (word: string, freq?: number, tag?: string) => number;
  };
}

const token = (str: string) => {
  return tokenize(str, TokenizeMode.Default, false);
};

const cutWord = (str: string) => {
  return cut(str, true);
};

const word = (): Promise<Word> => {
  return new Promise((resolve, reject) => {
    init()
      .then((result) => {
        resolve({
          success: true,
          data: result,
          methods: { tokenize: token, cut: cutWord, addWord },
        });
      })
      .catch((error) => {
        reject({ success: false, data: error });
      });
  });
};

// init().then(() => {
//     testCut("Wasm initialized.");
//     // loadDict(customDict);
//     // testCut("Custom dict loaded.");
//     addWord("中出", undefined, undefined);
//     testCut("Custom word added.");
//     console.log(tokenize("中华人民共和国武汉市长江大桥", TokenizeMode.Default, false));
// });

// function testCut(message: string): void {
//     console.log(message)
//     const testSentences = [
//         "我们中出了一个叛徒",
//         "我来到北京清华大学",
//         "他来到了网易杭研大厦",
//         "小明硕士毕业于中国科学院计算所，后在日本京都大学深造",
//         "实变函数论与泛函分析",
//         "實變函數論與泛函分析",
//         "梅竹錦標對抗賽",
//         "小明畢業於國立交通大學資訊科學與工程研究所",
//         "新竹的交通大學要在2021年2月1日與台北的陽明大學合併"
//     ]
//     for (const sentence of testSentences) {
//         console.log(sentence)
//         console.log(cut(sentence, true))
//     }
// }

export default word;
