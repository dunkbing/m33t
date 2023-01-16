import { IceCandidateMessage, JoinRoomMessage, Message } from "./types.ts";

const server = {
  subscribe: (room: string, onMessage: (message: Message) => void) => {
    const events = new EventSource(`/api/connect/${room}`);
    const listener = (e: MessageEvent) => {
      console.log(e);
      const msg = JSON.parse(e.data);
      onMessage(msg);
    };
    events.addEventListener("message", listener);
    console.log(events);
    return {
      unsubscribe() {
        console.log("unsubscribe");
        events.removeEventListener("message", listener);
      },
    };
  },
  send: (data: Message) => {
    fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export default server;
