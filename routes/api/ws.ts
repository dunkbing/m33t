const clients: Record<string, Map<string, WebSocket>> = {};

function wsHandleFunc(ws: WebSocket, room: string, clientId: string) {
  ws.onopen = () => {
    ws.send(JSON.stringify({ clientId }));
  };

  ws.onmessage = (e) => {
    const evtData = JSON.parse(e.data);
    const data = evtData.data;
    if (!clients[room]) {
      clients[room] = new Map();
    }
    clients[room].set(clientId, ws);
    if (evtData.type === 'call-offer') {
      for (const [k, v] of clients[room]) {
        if (k === clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: 'call-offer',
            data,
            clientId,
          })
        );
      }
    } else if (evtData.type === 'call-answer') {
      for (const [k, v] of clients[room]) {
        if (k === clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: 'call-answer',
            data,
            clientId,
          })
        );
      }
    } else if (evtData.type === 'answer') {
      for (const [k, v] of clients[room]) {
        if (k === clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: 'answer',
            data,
            clientId,
          })
        );
      }
    } else if (evtData.type === 'offer') {
      for (const [k, v] of clients[room]) {
        if (k === clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: 'offer',
            data,
            clientId,
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
