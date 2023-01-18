const clients: Record<string, Map<string, WebSocket>> = {};

function wsHandleFunc(ws: WebSocket, room: string, clientId: string) {
  ws.onmessage = (e) => {
    const evtData = JSON.parse(e.data);
    const data = evtData.data;
    if (!clients[room]) {
      clients[room] = new Map();
    }
    clients[room].set(clientId, ws);
    if (evtData.type === "call-offer") {
      for (const [k, v] of clients[room]) {
        if (k !== evtData.clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        console.log("send call-offer", data);
        v.send(
          JSON.stringify({
            type: "call-offer",
            data,
            clientId,
          }),
        );
      }
    } else if (evtData.type === "call-answer") {
      for (const [k, v] of clients[room]) {
        if (k !== evtData.clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: "call-answer",
            data,
            clientId,
          }),
        );
      }
    } else if (evtData.type === "answer") {
      for (const [k, v] of clients[room]) {
        if (k !== evtData.clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: "answer",
            data,
            clientId,
          }),
        );
      }
    } else if (evtData.type === "offer") {
      for (const [k, v] of clients[room]) {
        if (k !== evtData.clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: "offer",
            data,
            clientId,
          }),
        );
      }
    } else if (evtData.type === "join") {
      for (const [k, v] of clients[room]) {
        if (k === clientId) continue;
        if (v.readyState !== v.OPEN) continue;
        v.send(
          JSON.stringify({
            type: "join",
            clientId,
          }),
        );
      }
    }
  };

  ws.onclose = () => {
    const client = clients[room];
    if (!client) return;
    for (const [k, v] of client) {
      if (k === clientId) continue;
      if (v.readyState !== v.OPEN) continue;
      v.send(
        JSON.stringify({
          type: "disconnect",
          clientId,
        }),
      );
    }
    client.delete(clientId);
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  const url = new URL(req.url);
  const room = url.searchParams.get("room") || "";
  const clientId = url.searchParams.get("clientId") || "";
  wsHandleFunc(socket, room, clientId);
  return response;
};
