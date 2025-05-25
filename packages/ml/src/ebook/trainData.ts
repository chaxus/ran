import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkEncoding } from 'ranuts/utils';
import type { TrainingData } from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 读取指定目录下的所有 txt 文件并生成训练数据
 * @param directory 目录路径
 * @returns 训练数据数组
 */
export async function generateTrainingData(directory: string): Promise<TrainingData[]> {
  const trainingData: TrainingData[] = [];

  try {
    // 读取目录下的所有文件
    const files = fs.readdirSync(directory);

    // 过滤出 txt 文件
    const txtFiles = files.filter((file) => file.toLowerCase().endsWith('.txt'));

    for (const file of txtFiles) {
      const filePath = path.join(directory, file);

      // 读取文件内容为 Uint8Array
      const fileContent = fs.readFileSync(filePath);

      // 检测文件编码
      const encoding = checkEncoding(fileContent);

      // 根据检测到的编码读取文件内容
      const text = new TextDecoder(encoding).decode(fileContent);

      // 创建训练数据对象
      const data: TrainingData = {
        text,
        labels: [], // 初始为空，需要手动标注
      };

      trainingData.push(data);

      console.log(`Processed file: ${file} (Encoding: ${encoding})`);
    }

    console.log(`Total files processed: ${trainingData.length}`);
    return trainingData;
  } catch (error) {
    console.error('Error generating training data:', error);
    throw error;
  }
}

/**
 * 保存训练数据到 JSON 文件
 * @param data 训练数据
 * @param outputPath 输出文件路径
 */
export function saveTrainingData(data: TrainingData[], outputPath: string): void {
  try {
    // 确保输出目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 将数据转换为格式化的 JSON 字符串
    const jsonData = JSON.stringify(data, null, 2);

    // 写入文件
    fs.writeFileSync(outputPath, jsonData, 'utf-8');

    console.log(`Training data saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error saving training data:', error);
    throw error;
  }
}

/**
 * 从 JSON 文件加载训练数据
 * @param filePath JSON 文件路径
 * @returns 训练数据数组
 */
export function loadTrainingData(filePath: string): TrainingData[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData) as TrainingData[];
    console.log(`Loaded training data from: ${filePath}`);
    return data;
  } catch (error) {
    console.error('Error loading training data:', error);
    throw error;
  }
}

// 使用示例
export async function main(): Promise<void> {
  const directory = path.join(process.cwd(), 'ebook/txt');
  const outputPath = path.join(process.cwd(), 'ebook/training_data.json');

  try {
    // 生成训练数据
    const trainingData = await generateTrainingData(directory);

    // 保存训练数据
    saveTrainingData(trainingData, outputPath);

    console.log('Training data generation completed successfully!');
  } catch (error) {
    console.error('Failed to generate training data:', error);
  }
}

// 如果直接运行此文件，则执行 main 函数
// if (require.main === module) {
//     main();
// }

const startGenerateTrainingData = async (): Promise<void> => {
  const ebookPath = path.join(__dirname, '../../assets/ebook/txt');
  const ebookTrainingDataPath = path.join(__dirname, `../../assets/ebook/txt/training_data_${Date.now()}.json`);

  // 确保目录存在
  if (!fs.existsSync(ebookPath)) {
    console.log(`Creating directory: ${ebookPath}`);
    fs.mkdirSync(ebookPath, { recursive: true });
  }

  const ebookTrainingData = await generateTrainingData(ebookPath);
  saveTrainingData(ebookTrainingData, ebookTrainingDataPath);
};

startGenerateTrainingData();
