import http from 'node:http';
import crypto from 'node:crypto';
import type internal from 'node:stream';
import EventEmitter from 'node:events';

interface FrameMeta {
  fin: boolean;
  opcode: number;
  mask: boolean;
  maskKey: Buffer | null;
  payloadSize: number;
  size: number;
  metaSize: number;
}

const sixteenBitsMax = 65535; // 65536 is the max of 16 bits

const opcodeMap = {
  text: 129, // 129 = 10000001, opcode = 0x1
};

export class Client extends EventEmitter {
  socket: internal.Duplex;
  connectTime: number;
  constructor(socket: internal.Duplex) {
    super();
    this.socket = socket;
    this.connectTime = Date.now();
  }
  createFrame(content: string, options?: { opcode: number }): Buffer {
    const size = Buffer.byteLength(content);
    let buf;
    if (size > sixteenBitsMax) {
      buf = Buffer.alloc(10 + size);
      buf[1] = 127;
      buf.writeUInt32BE(size, 6);
      buf.write(content, 10);
    } else if (size > 125) {
      buf = Buffer.alloc(4 + size);
      buf[1] = 126;
      buf.writeUInt16BE(size, 2);
      buf.write(content, 4);
    } else {
      buf = Buffer.alloc(2 + size);
      buf[1] = size;
      buf.write(content, 2);
    }
    if (options) {
      const { opcode } = options;
      if (opcode && opcode < 15 && opcode >= 0) buf[0] = 128 | opcode;
    } else buf[0] = opcodeMap.text;
    return buf;
  }
  send(data: string, options?: { opcode: number }): void {
    this.socket.write(this.createFrame(data, options));
  }
  ping(): void {
    this.socket.write(this.createFrame('', { opcode: 9 }));
  }
  pong(): void {
    this.socket.write(this.createFrame('', { opcode: 10 }));
  }
  close(): void {
    this.socket.write(this.createFrame('', { opcode: 8 }));
    this.socket.destroy();
    this.emit('close');
  }
}

class WebSocket extends EventEmitter {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  clients: Array<Client>;
  constructor({ port = 30104 }: { port: number }) {
    super();
    this.server = http.createServer();
    this.server.listen(port);
    this.clients = [];
    this.server.on('upgrade', (req, socket) => this.create(req, socket));
  }
  /**
   * @description: 向所有 client 广播
   * @param {string} data
   */
  broadcast(data: string): void {
    this.clients.forEach((client) => client.send(data));
  }
  /**
   * @description: 创建client
   * @param {http} req
   * @param {internal} socket
   */
  create(req: http.IncomingMessage, socket: internal.Duplex): void {
    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' +
          crypto
            .createHash('sha1')
            .update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
            .digest('base64'),
      ].join('\n') + '\n\n',
    );
    const client = new Client(socket);
    this.addListenCloseClient(client);
    this.clients.push(client);
    this.emit('connect', client);

    let buf = Buffer.allocUnsafe(0);
    let data = Buffer.allocUnsafe(0);
    /**
     * @description: 处理帧meta
     * @param {FrameMeta} meta
     */
    const handleFrameMeta = (meta: FrameMeta) => {
      const metaLength = meta.metaSize;
      buf.subarray(0, metaLength);
      buf = buf.subarray(metaLength);
      return buf;
    };
    /**
     * @description: 处理帧内容
     * @param {FrameMeta} meta
     */
    const handleFrameContent = (meta: FrameMeta) => {
      const size = meta.size;
      const buffer = buf.subarray(0, size);
      data = Buffer.concat([data, this.iMask(buffer, meta.maskKey)]);
      if (meta.fin) {
        if (meta.opcode === 8) return client.close();
        if (meta.opcode === 9) return client.pong();
        client.emit('data', data);
        data = Buffer.allocUnsafe(0);
      }
      buf = buf.subarray(size);
    };
    socket.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const meta = this.parseFrameMeta(buf);
      handleFrameMeta(meta);
      handleFrameContent(meta);
    });

    socket.on('end', () => {
      client.close();
    });

    socket.on('error', (err) => {
      client.emit('error', err);
      client.close();
    });
  }
  /**
   * @description: 增加 client 监听关闭事件
   * @param {Client} client
   */
  addListenCloseClient(client: Client): void {
    client.on('close', () => {
      const index = this.clients.indexOf(client);
      if (index === -1) return false;
      this.clients.splice(index, 1);
    });
  }
  /**
   * @description: 解析帧meta
   * @param {Buffer} source
   * @return {FrameMeta}
   */
  parseFrameMeta(source: Buffer): FrameMeta {
    const src = Buffer.from(source);
    const payloadSize = src[1] & 127;
    let size = 0;
    let metaSize = 0;
    const masked = src[1] >= 128;
    if (payloadSize === 127) {
      size = src.readUInt32BE(6);
      metaSize = 10;
    } else if (payloadSize === 126) {
      size = src.readUInt16BE(2);
      metaSize = 4;
    } else {
      size = payloadSize;
      metaSize = 2;
    }
    return {
      fin: src[0] >= 128,
      opcode: src[0] & 15,
      mask: masked,
      maskKey: masked ? src.subarray(metaSize, metaSize + (masked ? 4 : 0)) : null,
      payloadSize,
      size,
      metaSize: metaSize + (masked ? 4 : 0),
    };
  }
  iMask(data: Buffer, key: Buffer | null): Buffer {
    if (!key) return data;
    const buffer = Buffer.from(data);
    for (let i = 0; i < buffer.length; ++i) buffer[i] = buffer[i] ^ key[i % 4];
    return buffer;
  }
}

export default WebSocket;
