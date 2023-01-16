import { HandlerContext } from "$fresh/server.ts";
import { RoomChannel } from "@/signaling/room-channel.ts";
import { IceCandidateMessage } from "@/signaling/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const data = (await req.json()) as IceCandidateMessage;
  console.log(data);
  const channel = new RoomChannel(data.clientId);

  channel.joinRoom({
    room: data.room,
    clientId: data.clientId,
  });
  channel.close();

  return new Response("OK");
}
