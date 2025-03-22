// 小王子
import princekin from '@/assets/books/princekin/princekin.txt?url';
import princekinIcon from '@/assets/books/princekin/image.png?url';
// 骆驼祥子
import camelXiangzi from '@/assets/books/camelXiangzi/camelXiangzi.txt?url';
// 三国演义
import threeKingdoms from '@/assets/books/theThreeKingdoms/theThreeKingdoms.txt?url';
// 国富论
import theWealthOfNations from '@/assets/books/theWealthOfNations/theWealthOfNations.txt?url';

export interface EnBook {
  url: string;
  image?: string;
  author?: string;
  title: string;
  authorDate?: string;
}

export const BOOKS_ADD_BY_DEFAULT = 'BOOKS_ADD_BY_DEFAULT';

export const ensampleConfigs: EnBook[] = [
  {
    title: '小王子',
    url: princekin,
    image: princekinIcon,
    author: '[法] 安托万·德·圣埃克苏佩里',
    authorDate: '1900-1944',
  },
  {
    title: '骆驼祥子',
    url: camelXiangzi,
    image: '',
    author: '老舍（舒庆春）',
    authorDate: '1899-1966',
  },
  {
    title: '三国演义',
    url: threeKingdoms,
    image: '',
    author: '罗贯中',
    authorDate: '1330-1400',
  },
  {
    title: '国富论',
    url: theWealthOfNations,
    image: '',
    author: '亚当·斯密',
    authorDate: '1723-1790',
  },
];
