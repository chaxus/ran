import * as tf from '@tensorflow/tfjs';

declare global {
    interface Window {
      URL: {
        createObjectURL(blob: Blob): string;
        revokeObjectURL(url: string): void;
      };
    }
  } 

export interface ChapterInfo {
  title: string;
  startIndex: number;
  endIndex: number;
}

export interface TrainingData {
  text: string;
  labels: ChapterInfo[];
}

export interface ModelData {
  model: tf.Sequential;
  vocabulary: string[];
  wordToIndex: Record<string, number>;
  indexToWord: Record<number, string>;
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

  private readonly dbName = 'ChapterDetectorDB';
  private readonly storeName = 'models';
  private readonly modelKey = 'latest';

  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
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

  public async saveModel(): Promise<ModelData> {
    if (!this.model) {
      throw new Error('No model to save');
    }

    const modelData: ModelData = {
      model: this.model,
      vocabulary: Array.from(this.vocabulary),
      wordToIndex: Object.fromEntries(this.wordToIndex),
      indexToWord: Object.fromEntries(this.indexToWord)
    };

    // 序列化模型
    const modelJSON = await this.model.toJSON();
    const serializedModelData = {
      ...modelData,
      model: modelJSON
    };

    // 创建下载链接
    const blob = new Blob([JSON.stringify(serializedModelData, null, 2)], { type: 'application/json' });
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chapter_detector_model_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    URL.revokeObjectURL(url);

    return modelData;
  }

  public async loadModel(file: File): Promise<void> {
    try {
      const text = await file.text();
      const serializedModelData = JSON.parse(text);

      // 从 JSON 加载模型
      this.model = await tf.models.modelFromJSON(serializedModelData.model) as tf.Sequential;
      this.vocabulary = new Set(serializedModelData.vocabulary);
      this.wordToIndex = new Map(Object.entries(serializedModelData.wordToIndex));
      this.indexToWord = new Map(
        Object.entries(serializedModelData.indexToWord).map(([key, value]) => [Number(key), value as string])
      );
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  public async train(
    trainingData: TrainingData[], 
    epochs: number = 20, 
    incremental: boolean = false,
    onProgress?: (progress: {
      epoch: number;
      loss: number;
      accuracy: number;
      validationLoss?: number;
      validationAccuracy?: number;
    }) => void
  ): Promise<void> {
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
        onEpochBegin: (epoch) => {
          console.log(`\nEpoch ${epoch + 1}/${epochs} starting...`);
        },
        onEpochEnd: (epoch, logs) => {
          if (logs) {
            const progress = {
              epoch: epoch + 1,
              loss: logs.loss,
              accuracy: logs.acc,
              validationLoss: logs.val_loss,
              validationAccuracy: logs.val_acc
            };
            
            // 输出详细的训练信息
            console.log(`
Epoch ${epoch + 1}/${epochs} completed:
- Training Loss: ${logs.loss.toFixed(4)}
- Training Accuracy: ${(logs.acc * 100).toFixed(2)}%
- Validation Loss: ${logs.val_loss?.toFixed(4) || 'N/A'}
- Validation Accuracy: ${logs.val_acc ? (logs.val_acc * 100).toFixed(2) + '%' : 'N/A'}
            `);

            // 调用进度回调
            onProgress?.(progress);
          }
        },
        onTrainBegin: () => {
          console.log('\nTraining started...');
          console.log(`Total epochs: ${epochs}`);
          console.log(`Batch size: 32`);
          console.log(`Validation split: 20%`);
        },
        onTrainEnd: () => {
          console.log('\nTraining completed!');
        }
      }
    });

    // 清理张量
    xs.dispose();
    ys.dispose();

    // 训练完成后保存模型
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
export async function processEbook(contents: string[], modelFile?: File): Promise<ChapterInfo[][]> {
  const detector = new ChapterDetector();
  
  if (modelFile) {
    // 加载已有模型
    await detector.loadModel(modelFile);
    console.log('Loaded existing model');
  } else {
    throw new Error('No model file provided. Please provide a model file or train a new model.');
  }
  
  return await detector.detectChapters(contents);
}
