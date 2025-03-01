import type { Context } from '@/app/types/index';

const STR =
  '春江花月夜\n春江潮水连海平，海上明月共潮生。\n滟滟随波千万里，何处春江无月明。\n江流宛转绕芳甸，月照花林皆似霰。\n空里流霜不觉飞，汀上白沙看不见。\n江天一色无纤尘，皎皎空中孤月轮。\n江畔何人初见月？江月何年初照人？\n人生代代无穷已，江月年年望相似。\n不知江月待何人，但见长江送流水。\n白云一片去悠悠，青枫浦上不胜愁。\n谁家今夜扁舟子？何处相思明月楼？\n可怜楼上月裴回，应照离人妆镜台。\n玉户帘中卷不去，捣衣砧上拂还来。\n此时相望不相闻，愿逐月华流照君。\n鸿雁长飞光不度，鱼龙潜跃水成文。\n昨夜闲潭梦落花，可怜春半不还家。\n江水流春去欲尽，江潭落月复西斜。\n斜月沉沉藏海雾，碣石潇湘无限路。\n不知乘月几人归，落月摇情满江树。\n';

export default class IMController {
  dialog(ctx: Context): void {
    try {
      const { res, req } = ctx;
      const { chat_id, question } = ctx.request.body;
      console.log('dialog:', chat_id, question);
      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      };
      // 如果请求 /events 路径，建立 SSE 连接
      res.writeHead(200, headers);
      // 每隔 1 秒发送一条消息
      let id = 0;
      const create_time = Date.now();
      const intervalId = setInterval(() => {
        const answer = STR.slice(0, id);
        const data = { dialog_id: id, create_time, question, answer };
        res.write(JSON.stringify(data));
        id++;
        if (id >= STR.length) {
          clearInterval(intervalId);
          res.end();
        }
      }, 40);
      // 当客户端关闭连接时停止发送消息
      req.on('close', () => {
        clearInterval(intervalId);
        id = 0;
        res.end();
      });
    } catch (error) {
      console.log('dialog:', error);
      // ctx.errorHandler({ error });
    }
  }
}
