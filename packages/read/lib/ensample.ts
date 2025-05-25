// 小王子
import princekin from '@/assets/books/princekin/princekin.txt?url';
import princekinIcon from '@/assets/books/princekin/image.png?url';
// 骆驼祥子
import camelXiangzi from '@/assets/books/camelXiangzi/camelXiangzi.txt?url';
// 三国演义
import threeKingdoms from '@/assets/books/theThreeKingdoms/theThreeKingdoms.txt?url';
// 国富论
import theWealthOfNations from '@/assets/books/theWealthOfNations/theWealthOfNations.txt?url';
// 巴黎圣母院
import theHunchbackOfNotreDame from '@/assets/books/TheHunchbackofNotre-Dame/TheHunchbackofNotre-Dame.txt?url';
// 简爱
import janeEyre from '@/assets/books/JaneEyre/JaneEyre.txt?url';
// 瓦尔登湖
import walden from '@/assets/books/walden/walden.txt?url';
// 白雪公主
import snowWhite from '@/assets/books/snowWhite/snowWhite.txt?url';
import { t } from '@/locales';
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
    title: t('books-princekin'),
    url: princekin,
    image: princekinIcon,
    author: t('books-princekin-author'),
    authorDate: '1900-1944',
  },
  {
    title: t('books-camelXiangzi'),
    url: camelXiangzi,
    image: '',
    author: t('books-camelXiangzi-author'),
    authorDate: '1899-1966',
  },
  {
    title: t('books-theThreeKingdoms'),
    url: threeKingdoms,
    image: '',
    author: t('books-theThreeKingdoms-author'),
    authorDate: '1330-1400',
  },
  {
    title: t('books-theWealthOfNations'),
    url: theWealthOfNations,
    image: '',
    author: t('books-theWealthOfNations-author'),
    authorDate: '1723-1790',
  },
  {
    title: t('books-theHunchbackOfNotreDame'),
    url: theHunchbackOfNotreDame,
    image: '',
    author: t('books-theHunchbackOfNotreDame-author'),
    authorDate: '1802-1885',
  },
  {
    title: t('books-janeEyre'),
    url: janeEyre,
    image: '',
    author: t('books-janeEyre-author'),
    authorDate: '1816-1855',
  },
  {
    title: t('books-walden'),
    url: walden,
    image: '',
    author: t('books-walden-author'),
    authorDate: '1817-1862',
  },
  {
    title: t('books-snowWhite'),
    url: snowWhite,
    image: '',
    author: t('books-snowWhite-author'),
    authorDate: '1789-1863',
  },
];
