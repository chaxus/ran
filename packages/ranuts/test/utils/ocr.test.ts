import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ocr } from '@/ml/ocr';
// https://cdn.jsdelivr.net/npm/@tesseract.js-data/fra/4.0.0_best_int/fra.traineddata.gz

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

describe('ocr文字识别', () => {
  it('英文识别', async () => {
    const options = {
      images: [resolve(__dirname, '../../assets/img/ocr/eng.png')],
      language: 'eng',
      langPath: resolve(__dirname, '../../assets/ocr'),
    };
    const result = `Mild Splendour of the various-vested Night!
Mother of wildly-working visions! hail
I watch thy gliding, while with watery light
Thy weak eye glimmers through a fleecy veil;
And when thou lovest thy pale orb to shroud
Behind the gather’d blackness lost on high;
And when thou dartest from the wind-rent cloud
Thy placid lightning o’er the awaken’d sky.`;
    ocr(options).then((res) => {
      expect(res.data?.[0].data.text).to.be.equal(result);
    });
  });
  it('中文识别', async () => {
    const options = {
      images: [resolve(__dirname, '../../assets/img/ocr/chi_sim.png')],
      language: 'chi_sim',
      langPath: resolve(__dirname, '../../assets/ocr'),
    };
    const result = `冬日 平 泉 路 晚 归
        山路 难 行 日 易 斜
        烟 村 霜 树 欲 栖 鸦
        夜 归 不 到 应 闲 事
        热饮 三 杯 即 是 家`;
    ocr(options).then((res) => {
      expect(res.data?.[0].data.text).to.be.equal(result);
    });
  });
});
