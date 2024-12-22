import type { Context } from "@/app/types/index";

export default class IMController {
  dialog(ctx: Context): void {
    try {
      const { res, req, request } = ctx;
      const { chat_id, question } = request.body;
      console.log('dialog:', chat_id, question);
      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
      // 如果请求 /events 路径，建立 SSE 连接
      res.writeHead(200, headers)
      // 每隔 1 秒发送一条消息
      let id = 0
      const intervalId = setInterval(() => {
        res.write(`event: customEvent\n`)
        res.write(`id: ${id}\n`)
        res.write(`retry: 30000\n`)
        const data = { id, time: new Date().toISOString(), question }
        res.write(`data: ${JSON.stringify(data)}\n\n`)
        id++
        if (id >= 10) {
          clearInterval(intervalId)
          res.end()
        }
      }, 1000)
      // 当客户端关闭连接时停止发送消息
      req.on('close', () => {
        clearInterval(intervalId)
        id = 0
        res.end()
      })
    } catch (error) {
      console.log('dialog:', error);
      // ctx.errorHandler({ error });
    }
  }
}
