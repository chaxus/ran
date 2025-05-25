import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';
import * as tf from '@tensorflow/tfjs';

export interface ChapterInfo {
  title: string;
  startIndex: number;
  endIndex: number;
}

export interface TrainingData {
  text: string;
  labels: ChapterInfo[];
}

export class ChapterDetector {
  private model: tf.Sequential | null = null;
  private readonly maxSequenceLength = 100;
  private readonly embeddingDim = 300;
  private readonly lstmUnits = 256;
  private vocabulary: Set<string> = new Set<string>();
  private wordToIndex: Map<string, number> = new Map<string, number>();
  private indexToWord: Map<number, string> = new Map<number, string>();
  private readonly labelToIndex: Map<string, number> = new Map<string, number>([
    ['O', 0],      // 非章节标题
    ['B-TITLE', 1], // 章节标题开始
    ['I-TITLE', 2], // 章节标题中间
    ['E-TITLE', 3], // 章节标题结束
    ['S-TITLE', 4]  // 单个词的章节标题
  ]);
  private readonly modelDir: string;

  constructor(modelDir: string = 'models') {
    this.modelDir = modelDir;
    // 确保模型目录存在
    if (!existsSync(modelDir)) {
      mkdirSync(modelDir, { recursive: true });
    }
  }

  private buildVocabulary(content: string) {
    // 从文本中构建词汇表
    const words = content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (!this.vocabulary.has(word)) {
        this.vocabulary.add(word);
        this.wordToIndex.set(word, this.vocabulary.size);
        this.indexToWord.set(this.vocabulary.size, word);
      }
    });
  }

  private preprocessText(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const sequence = new Array(this.maxSequenceLength).fill(0);
    
    for (let i = 0; i < Math.min(words.length, this.maxSequenceLength); i++) {
      const word = words[i];
      sequence[i] = this.wordToIndex.get(word) || 0;
    }
    
    return sequence;
  }

  private generateLabels(text: string, chapters: ChapterInfo[]): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const labels: string[] = new Array(words.length).fill('O');
    
    chapters.forEach(chapter => {
      const chapterWords = chapter.title.toLowerCase().split(/\s+/);
      const startIndex = chapter.startIndex;
      
      if (chapterWords.length === 1) {
        // 单个词的章节标题
        labels[startIndex] = 'S-TITLE';
      } else {
        // 多词章节标题
        chapterWords.forEach((_, index) => {
          if (index === 0) {
            labels[startIndex + index] = 'B-TITLE';
          } else if (index === chapterWords.length - 1) {
            labels[startIndex + index] = 'E-TITLE';
          } else {
            labels[startIndex + index] = 'I-TITLE';
          }
        });
      }
    });
    
    return labels;
  }

  private async buildModel() {
    if (!this.model) {
      this.model = tf.sequential();
      
      // 词嵌入层
      this.model.add(tf.layers.embedding({
        inputDim: this.vocabulary.size + 1,
        outputDim: this.embeddingDim,
        inputLength: this.maxSequenceLength,
        maskZero: true,
        trainable: true
      }));

      // 第一个双向 LSTM 层
      this.model.add(tf.layers.bidirectional({
        layer: tf.layers.lstm({
          units: this.lstmUnits,
          returnSequences: true,
          dropout: 0.2,
          recurrentDropout: 0.2
        })
      }));

      // 第二个双向 LSTM 层
      this.model.add(tf.layers.bidirectional({
        layer: tf.layers.lstm({
          units: this.lstmUnits,
          returnSequences: true,
          dropout: 0.2,
          recurrentDropout: 0.2
        })
      }));

      // 时间分布全连接层
      this.model.add(tf.layers.timeDistributed({
        layer: tf.layers.dense({
          units: 5,
          activation: 'softmax'
        })
      }));

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });
    }
  }

  public async saveModel(): Promise<void> {
    if (!this.model) {
      throw new Error('No model to save');
    }

    // 保存模型
    await this.model.save(`file://${path.join(this.modelDir, 'model')}`);

    // 保存词汇表
    const vocabularyData = {
      vocabulary: Array.from(this.vocabulary),
      wordToIndex: Object.fromEntries(this.wordToIndex),
      indexToWord: Object.fromEntries(this.indexToWord)
    };
    writeFileSync(
      path.join(this.modelDir, 'vocabulary.json'),
      JSON.stringify(vocabularyData, null, 2)
    );
  }

  public async loadModel(): Promise<void> {
    const modelPath = path.join(this.modelDir, 'model');
    const vocabPath = path.join(this.modelDir, 'vocabulary.json');

    if (!existsSync(modelPath) || !existsSync(vocabPath)) {
      throw new Error('Model or vocabulary file not found');
    }

    // 加载模型
    this.model = await tf.loadLayersModel(`file://${modelPath}`) as tf.Sequential;

    // 加载词汇表
    const vocabularyData = JSON.parse(readFileSync(vocabPath, 'utf-8'));
    this.vocabulary = new Set(vocabularyData.vocabulary);
    this.wordToIndex = new Map(Object.entries(vocabularyData.wordToIndex));
    this.indexToWord = new Map(
      Object.entries(vocabularyData.indexToWord).map(([key, value]) => [Number(key), value as string])
    );
  }

  public async train(trainingData: TrainingData[], epochs: number = 20, incremental: boolean = false): Promise<void> {
    if (incremental && this.model) {
      // 增量训练：使用现有模型
      console.log('Performing incremental training...');
    } else {
      // 新训练：构建词汇表和模型
      console.log('Building new model...');
      trainingData.forEach(data => {
        this.buildVocabulary(data.text);
      });
      await this.buildModel();
    }
    
    // 准备训练数据
    const sequences: number[][] = [];
    const labels: number[][] = [];
    
    trainingData.forEach(data => {
      const sequence = this.preprocessText(data.text);
      const wordLabels = this.generateLabels(data.text, data.labels);
      
      // 将标签转换为数字
      const numericLabels = wordLabels.map(label => this.labelToIndex.get(label) || 0);
      
      sequences.push(sequence);
      labels.push(numericLabels);
    });

    // 转换为张量
    const xs = tf.tensor2d(sequences);
    const ys = tf.oneHot(tf.tensor2d(labels), 5);

    // 训练模型
    await this.model!.fit(xs, ys, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    });

    // 清理张量
    xs.dispose();
    ys.dispose();

    // 保存模型
    await this.saveModel();
  }

  public async detectChapters(contents: string[]): Promise<ChapterInfo[][]> {
    if (!this.model) {
      throw new Error('Model not trained. Please call train() first or load a saved model.');
    }

    // 处理所有内容
    const results: ChapterInfo[][] = [];
    
    for (const content of contents) {
      // 构建词汇表
      this.buildVocabulary(content);
      
      const lines = content.split('\n');
      const chapters: ChapterInfo[] = [];
      let currentChapter: ChapterInfo | null = null;
      let currentTitleWords: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length === 0) continue;

        const words = line.split(/\s+/);
        for (const word of words) {
          // 预处理文本
          const sequence = this.preprocessText(word);
          const input = tf.tensor2d([sequence]);
          
          // 预测
          const prediction = this.model.predict(input) as tf.Tensor;
          const scores = await prediction.array() as number[][];
          
          // 获取最可能的标签
          const maxScore = Math.max(...scores[0]);
          const predictedLabel = Array.from(this.labelToIndex.entries())
            .find(([_, index]) => scores[0][index] === maxScore)?.[0];

          if (predictedLabel === 'B-TITLE') {
            // 开始新的章节标题
            if (currentChapter) {
              currentChapter.endIndex = i - 1;
              chapters.push(currentChapter);
            }
            currentTitleWords = [word];
            currentChapter = {
              title: word,
              startIndex: i,
              endIndex: -1
            };
          } else if (predictedLabel === 'I-TITLE' && currentChapter) {
            // 继续当前章节标题
            currentTitleWords.push(word);
            currentChapter.title = currentTitleWords.join(' ');
          } else if (predictedLabel === 'E-TITLE' && currentChapter) {
            // 结束当前章节标题
            currentTitleWords.push(word);
            currentChapter.title = currentTitleWords.join(' ');
          } else if (predictedLabel === 'S-TITLE') {
            // 单个词的章节标题
            if (currentChapter) {
              currentChapter.endIndex = i - 1;
              chapters.push(currentChapter);
            }
            currentChapter = {
              title: word,
              startIndex: i,
              endIndex: i
            };
            chapters.push(currentChapter);
            currentChapter = null;
          }

          // 清理张量
          input.dispose();
          prediction.dispose();
        }
      }

      // 处理最后一章
      if (currentChapter) {
        currentChapter.endIndex = lines.length - 1;
        chapters.push(currentChapter);
      }

      results.push(chapters);
    }

    return results;
  }
}

// 使用示例
export async function processEbook(contents: string[], trainingData?: TrainingData[]): Promise<ChapterInfo[][]> {
  const detector = new ChapterDetector();
  
  try {
    // 尝试加载已有模型
    await detector.loadModel();
    console.log('Loaded existing model');
  } catch (_error) {
    // 如果没有已有模型，且提供了训练数据，则训练新模型
    if (trainingData) {
      console.log('Training new model...');
      await detector.train(trainingData);
    } else {
      throw new Error('No model found and no training data provided');
    }
  }
  
  return await detector.detectChapters(contents);
}
