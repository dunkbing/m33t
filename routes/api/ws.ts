import {
  WsChangeUsernameMsg,
  WsMediaMessage,
  WsMessage,
  WsSendMessageMsg,
} from "@/types/types.ts";

const clients: Record<string, Map<string, WebSocket>> = {};

function wsHandleFunc(ws: WebSocket, room: string, clientId: string) {
  ws.onmessage = (e) => {
    const evtData = JSON.parse(e.data) as WsMessage;
    const data = evtData.data;
    if (!clients[room]) {
      clients[room] = new Map();
    }
    clients[room].set(clientId, ws);
    switch (evtData.type) {
      case "join":
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
        break;
      case "call-offer":
        for (const [k, v] of clients[room]) {
          if (k !== evtData.clientId) continue;
          if (v.readyState !== v.OPEN) continue;
          v.send(
            JSON.stringify({
              type: "call-offer",
              data,
              clientId,
            }),
          );
        }
        break;
      case "call-answer":
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
        break;
      case "answer":
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
        break;
      case "offer":
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
        break;
      case "toggle-video":
        for (const [k, v] of clients[room]) {
          if (k === evtData.clientId) continue;
          if (v.readyState !== v.OPEN) continue;
          v.send(
            JSON.stringify({
              type: "toggle-video",
              clientId: evtData.clientId,
              enabled: (evtData as unknown as WsMediaMessage).enabled,
            } as WsMediaMessage),
          );
        }
        break;
      case "toggle-audio":
        for (const [k, v] of clients[room]) {
          if (k === evtData.clientId) continue;
          if (v.readyState !== v.OPEN) continue;
          v.send(
            JSON.stringify({
              type: "toggle-audio",
              clientId: evtData.clientId,
              enabled: (evtData as unknown as WsMediaMessage).enabled,
            } as WsMediaMessage),
          );
        }
        break;
      case "change-username":
        for (const [k, v] of clients[room]) {
          if (k === evtData.clientId) continue;
          if (v.readyState !== v.OPEN) continue;
          v.send(
            JSON.stringify({
              type: "change-username",
              clientId: evtData.clientId,
              username: (evtData as unknown as WsChangeUsernameMsg).username,
            } as WsChangeUsernameMsg),
          );
        }
        break;
      case "send-msg":
        for (const [k, v] of clients[room]) {
          if (k === evtData.clientId) continue;
          if (v.readyState !== v.OPEN) continue;
          const msgData = evtData as unknown as WsSendMessageMsg;
          v.send(
            JSON.stringify({
              type: "send-msg",
              clientId: evtData.clientId,
              username: msgData.username,
              message: msgData.message,
              createdAt: msgData.createdAt,
            } as WsSendMessageMsg),
          );
        }
        break;
      default:
        break;
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
