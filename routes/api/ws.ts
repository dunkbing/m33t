import {
  IceCandidateMessage,
  JoinRoomMessage,
  SessionDescMessage,
} from '@/signaling/types.ts';

const clients: Record<string, Map<string, WebSocket>> = {};

function wsHandleFunc(ws: WebSocket, room: string, clientId: string) {
  ws.onopen = () => {
    ws.send(JSON.stringify({ clientId }));
  };

  ws.onmessage = (e) => {
    const evtData = JSON.parse(e.data);
    if (evtData.type === 'join') {
      const data = evtData.data as JoinRoomMessage;
      if (!Object.keys(clients).includes(room)) {
        clients[room] = new Map();
      }
      if (data.clientId in clients[data.room].keys()) return;

      for (const id in clients[room]) {
        clients[room].get(id)?.send(
          JSON.stringify({
            type: 'add-peer',
            data: {
              room: data.room,
              clientId,
              createOffer: false,
            },
          })
        );
        ws.send(
          JSON.stringify({
            type: 'add-peer',
            data: {
              room: data.room,
              clientId: id,
              createOffer: true,
            },
          })
        );
      }
      clients[room].set(clientId, ws);
    } else if (evtData.type === 'relay-ice-candidate') {
      const data = evtData.data as IceCandidateMessage;
      const clientId = data.clientId;
      const iceCandidate = data.iceCandidate;

      if (clientId in clients[room].keys()) {
        clients[room].get(clientId)?.send(
          JSON.stringify({
            type: 'ice-candidate',
            data: iceCandidate,
            clientId,
          })
        );
      }
    } else if (evtData.type === 'relay-session-desc') {
      const data = evtData.data as SessionDescMessage;
      const clientId = data.clientId;
      const sessionDescription = data.sessionDescription;

      if (clientId in clients[room].keys()) {
        clients[room].get(clientId)?.send(
          JSON.stringify({
            type: 'session-desc',
            data: { clientId, sessionDescription },
          })
        );
      }
    }
  };

  ws.onclose = () => {
    clients[room]?.delete(clientId);
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  const url = new URL(req.url);
  const room = url.searchParams.get('room') || '';
  const clientId = url.searchParams.get('clientId') || '';
  wsHandleFunc(socket, room, clientId);
  return response;
};
