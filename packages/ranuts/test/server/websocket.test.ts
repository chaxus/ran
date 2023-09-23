import { describe, expect, it } from 'vitest';
import type { Client } from '@/server/websocket';
import WSS from '@/server/websocket';

// const ws = new WSS({ port: 500 })
// ws.on('connect', (cli: Client) => {
//   console.log('一个客户端连接了')
//   ws.broadcast('Hello! every client!')
//   cli.send('Welcome, a user')
//   cli.ping()
//   cli.connectTime = Date.now()
//   console.log('clients:', ws.clients)
//   cli.on('data', (data: Buffer) => {
//     console.log(data.toString())
//   })
//   cli.on('close', () => {
//     console.log('a client closed')
//   })
//   cli.on('error', (err: Error) => {
//     console.log(err.message)
//   })
// })

describe('astParser', () => {
  it('websocket', () => {
    expect(1).toEqual(1);
  });
});
