import { Buffer } from 'node:buffer'
import type http from 'node:http'
import crypto from 'node:crypto'

/**
 * Create a text Frame for ws server
 * see Frame format in readme.md
 * @param { String | Buffer } content content of frame
 * @param { Object } options options
 * @param { Number } options.opcode
 * @returns { Buffer } frame buffer
 */
function createFrame(content: string, options: { opcode: any }) {
  const len = Buffer.byteLength(content) // length of the content

  let buf = null
  if (len > 65535) {
    // 65536 is the max of 16 bits

    buf = Buffer.alloc(10 + len)
    buf[1] = 127 // 127 = 01111111 means using more 64 bits to save the length, using no masks. `len7` is this byte.
    buf.writeUInt32BE(len, 6) // skip the 127 and 4 bytes to write the content length in 32 bits (32 bits = 4 bytes)
    buf.write(content, 10) // write content here, 10 = 6 + 4
  } else if (len > 125) {
    buf = Buffer.alloc(4 + len)
    buf[1] = 126 // 126 = 01111110 means using more 16 bit
    buf.writeUInt16BE(len, 2) // skip the 126 and write length in 16 bits (16 bits = 2 bytes)
    buf.write(content, 4)
  } else {
    buf = Buffer.alloc(2 + len)
    buf[1] = len // if len7 !== 126 or len7 !== 127, len7 is the content length.
    buf.write(content, 2)
  }

  if (options) {
    const opcode = options.opcode
    if (opcode && opcode < 15 && opcode >= 0) buf[0] = 128 | opcode // 128 = 10000000, opcode is of the last 4 bits
  } else buf[0] = 129 // 129 = 10000001, opcode = 0x1

  return buf
}

/**
 * Parse meta of a frame from client
 * @param {Buffer} source client buffer Source
 * @returns { Object }
 */
function parseFrameMeta(source: Buffer) {
  const src = Buffer.from(source)

  const len7 = src[1] & 127 // 127 = 01111111, len7 is of the last 7 bits from the second byte.
  let len = 0 // content length
  let lenMeta = 0 // total length of the frame without the content
  const masked = src[1] >= 128 // 128 = 10000000, the first bit is `masked`, if true it is >= 128
  if (len7 === 127) {
    len = src.readUInt32BE(6)
    lenMeta = 10
  } else if (len7 === 126) {
    len = src.readUInt16BE(2)
    lenMeta = 4
  } else {
    len = len7
    lenMeta = 2
  }

  return {
    fin: src[0] >= 128,
    opcode: src[0] & 15,
    mask: masked,
    maskKey: masked ? src.subarray(lenMeta, lenMeta + (masked ? 4 : 0)) : null,
    len7: len7,
    len: len,
    lenMeta: lenMeta + (masked ? 4 : 0),
  }
}

/**
 * ws inverse mask
 * @param {String} data source data
 * @param {Buffer|Array} key 4 bytes masking key
 * @returns {String}
 */
function iMask(data: Uint8Array, key: Buffer | null) {
  if (!key) return data

  const d = Buffer.from(data)
  for (let i = 0; i < d.length; ++i) d[i] = d[i] ^ key[i % 4] // 4 in a group to run XOR
  return d
}

/**
 * rewrited EventEmitter
 * @constructor
 */
function Event(this: any) {
  const listeners: any = {}
  this.on = (event: string | number, callback: any) => {
    if (listeners[event]) listeners[event].push(callback)
    else listeners[event] = [callback]
  }
  this.off = (event: string | number, callback: any) => {
    const e = listeners[event]
    const i = e.indexOf(callback)
    if (e && i !== -1) e.splice(i, 1)
  }
  this.emit = (event: string | number, param: any) => {
    if (listeners[event])
      listeners[event].forEach((callback: (arg0: any) => any) =>
        callback(param),
      )
  }
}
interface DateList {
  l: number
  f: (d: Uint8Array) => false | void
}
/**
 * Create a WebSocket Server
 * @constructor
 * @param { http.Server } server server from http(s).createServer()
 */
function WSS(this: any, server: http.Server) {
  Event.call(this) // bind WSS to Event to get event feature

  const clients: {
    send: any
    ping: any
    pong: any
    close: any
    socket: any
  }[] = []

  this.server = server
  this.clients = clients

  this.broadcast = (data: any) => {
    clients.forEach((v) => {
      v.send(data)
    })
  }

  server.on('upgrade', (req, socket) => {
    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' +
          crypto
            .createHash('sha1')
            .update(
              req.headers['sec-websocket-key'] +
                '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
            )
            .digest('base64'),
      ].join('\n') + '\n\n',
    )

    const cli: any = {
      // this is the `cli` parameter  when you `connect`
      send(data: string, options: any) {
        socket.write(createFrame(data, options))
      },
      ping() {
        socket.write(createFrame('', { opcode: 9 }))
      },
      pong() {
        socket.write(createFrame('', { opcode: 10 }))
      },
      close() {
        const cliI = clients.indexOf(cli)
        if (cliI === -1) return false
        clients.splice(clients.indexOf(cli), 1) // remove client from clients' list
        socket.write(createFrame('', { opcode: 8 })) // send close message to client
        cli.emit('close')
        socket.destroy()
      },
      socket: socket, // you can use `cli.socket` to get the socket object
    }
    Event.call(cli)

    this.emit('connect', cli) // trigger `connect` event in ws
    clients.push(cli) // push client to clients' list

    let buf = Buffer.allocUnsafe(0) // unprocessed buffer data
    let messageData = Buffer.allocUnsafe(0) // when a `fin(al)` frame processes, the processed data sends to `message` event
    const dataList: Array<DateList> = [] // unprocessed data list for consuming `buf`
    let frameEnd = true
    function nextFrame() {
      const meta = parseFrameMeta(buf)
      dataList.push({
        l: meta.lenMeta,
        f: () => {
          // consume `meta.lenMeta` bytes

          frameEnd = false // means it is processing meta data, this frame is not completely processed
          dataList.push({
            l: meta.len,
            f: (d: Uint8Array) => {
              // consume `meta.len` bytes

              messageData = Buffer.concat([messageData, iMask(d, meta.maskKey)]) // message += inverse masked data
              frameEnd = true // set true to start processing a new frame when next `data` comes
              if (meta.fin) {
                // sometimes you get fragments, before `fin(al)` is true, the message is not completely processed.

                if (meta.opcode === 8) return cli.close()
                if (meta.opcode === 9) return cli.pong()
                cli.emit('message', messageData) // trigger message event, you finally get this message
                messageData = Buffer.allocUnsafe(0)
              }
            },
          })
        },
      })
    }

    socket.on('data', (chunk) => {
      // chunk is the unprocessed data

      buf = Buffer.concat([buf, chunk]) // buf += chunk
      if (frameEnd) nextFrame()
      while (dataList[0] && buf.byteLength >= dataList[0].l) {
        // consume `buf` by `dataList`

        const l = dataList[0].l // consuming length
        dataList[0].f(buf.subarray(0, l)) // run callback before consuming
        buf = buf.subarray(l) // consume `buf`
        dataList.splice(0, 1) // remove this consume data
      }
    })

    socket.on('end', () => {
      cli.close()
    })

    socket.on('error', (err) => {
      cli.emit('error', err)
      cli.close()
    })
  })
}

module.exports = WSS
