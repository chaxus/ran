import { blue, green } from "picocolors";
import { optimize } from "./optimizer/index";

const http = require("http");
const url = require("url");

const startDevServer = () => {
  const startTime = Date.now();
  const server = http.createServer((req, res) => {
    const { pathname } = url.parse(`http://${req.headers.host}${req.url}`);
    if (pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Hello world</h1>");
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>Not Found</h1>");
    }
  });

  server.on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });

  server.listen(8080, async () => {
    const { port } = server.address(); // { address: '::', family: 'IPv6', port: 8080 }
    const root = process.cwd();
    await optimize(root);
    console.log(
      green("🚀 No-Bundle 服务已经成功启动!"),
      `耗时: ${Date.now() - startTime}ms`
    );
    console.log(`> 本地访问路径: ${blue(`http://localhost:${port}`)}`);
  });
};

export { startDevServer };
