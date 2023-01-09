import { HandlerContext } from '$fresh/server.ts';
import { RoomChannel } from '@/signaling/room-channel.ts';
import {
  IceCandidateMessage,
  JoinRoomMessage,
  Message,
  SessionDescMessage,
} from '@/signaling/types.ts';

const clients: Record<string, string[]> = {};

export async function handler(
  req: Request,
  _ctx: HandlerContext
): Promise<Response> {
  const body = (await req.json()) as Message;
  const channel = new RoomChannel(body.data.room);

  console.log(body.type);
  switch (body.type) {
    case 'join': {
      const data = body.data as JoinRoomMessage;
      if (!clients[data.room]) {
        clients[data.room] = [];
      }
      if (data.clientId in clients[data.room]) return new Response('OK');

      for (const c of clients[data.room]) {
        channel.joinRoom({
          room: data.room,
          clientId: c,
          createOffer: false,
        });
      }
      clients[data.room].push(data.clientId);
      channel.joinRoom({
        room: data.room,
        clientId: data.clientId,
        createOffer: true,
      });
      break;
    }
    case 'relay-ice-candidate': {
      const data = body.data as IceCandidateMessage;
      channel.iceCandidate(data);
      break;
    }
    case 'relay-session-desc': {
      const data = body.data as SessionDescMessage;
      if (data.clientId in clients[data.room]) {
        channel.sessionDescription(data);
      }
      break;
    }
  }

  channel.close();

  return new Response('OK');
}
