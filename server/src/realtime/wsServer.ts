import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

type ClientId = string;

interface SignalMessage {
  type: 'offer' | 'answer' | 'ice' | 'hello' | 'bye' | 'control';
  to?: ClientId;
  from?: ClientId;
  payload?: any;
}

const clients = new Map<ClientId, WebSocket>();

export function createWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (socket) => {
    let clientId: ClientId | undefined;

    socket.on('message', (data) => {
      try {
        const msg = JSON.parse(String(data)) as SignalMessage;
        if (msg.type === 'hello') {
          clientId = String(msg.payload?.clientId || cryptoRandomId());
          clients.set(clientId, socket);
          socket.send(JSON.stringify({ type: 'hello', from: 'server', payload: { clientId } }));
          return;
        }

        if (!clientId) return;
        if (msg.to && clients.has(msg.to)) {
          const target = clients.get(msg.to)!;
          target.send(
            JSON.stringify({ ...msg, from: clientId })
          );
        }
      } catch (e) {
        console.error('[ws] parse error', e);
      }
    });

    socket.on('close', () => {
      if (clientId) {
        clients.delete(clientId);
      }
    });
  });

  return wss;
}

function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

