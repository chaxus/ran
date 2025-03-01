1. 需要一个工具将 jsx 或者 tsx 转换成 AST
2. 再将 AST 构建成 SSG 进行部署。
3. 运行过程中需要进行水合

bookList 例子

```ts
// const bookList = [
//   {
//     id: 1,
//     title: '金字塔原理（麦肯锡 40 年经典培训教材）',
//     // image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
//     // author: '[美] 芭芭拉·明托'
//   },
//   {
//     id: 2,
//     title: '金字塔原理（麦肯锡 40 年经典培训教材）',
//     image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
//     author: '[美] 芭芭拉·明托'
//   },
//   {
//     id: 3,
//     title: '金字塔原理（麦肯锡 40 年经典培训教材）',
//     image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
//     author: '[美] 芭芭拉·明托'
//   },
// ]
```
