import princekin from '@/assets/books/princekin/princekin.txt?url';
import princekinIcon from '@/assets/books/princekin/image.png?url';

export interface EnBook {
  url: string;
  image?: string;
  author?: string;
  title: string;
}

export const BOOKS_ADD_BY_DEFAULT = 'BOOKS_ADD_BY_DEFAULT';

export const ensampleConfigs: EnBook[] = [
  {
    title: '小王子',
    url: princekin,
    image: princekinIcon,
    author: '[法] 安托万·德·圣埃克苏佩里著',
  },
];
