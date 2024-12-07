import { red } from 'picocolors';
import { WebSocket, WebSocketServer } from 'ws';
import { HMR_PORT } from './constants';

export function createWebSocketServer(): {
  send: (msg: string) => void;
  close: () => void;
} {
  const wss: WebSocketServer = new WebSocketServer({ port: HMR_PORT });
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }));
  });

  wss.on('error', (e: Error & { code: string }) => {
    if (e.code !== 'EADDRINUSE') {
      console.error(red(`WebSocket server error:\n${e.stack || e.message}`));
    }
  });

  return {
    send(payload: string) {
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified);
        }
      });
    },

    close() {
      wss.close();
    },
  };
}
