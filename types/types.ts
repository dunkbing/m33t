export type MessageType =
  | "join"
  | "call-offer"
  | "call-answer"
  | "offer"
  | "answer"
  | "disconnect"
  | "toggle-video"
  | "toggle-audio"
  | "change-username";

export interface WsMessage {
  clientId: string;
  type: MessageType;
  // deno-lint-ignore no-explicit-any
  data: any;
}

export type WsMediaMessage = Pick<WsMessage, "clientId" | "type"> & {
  enabled: boolean;
};

export type WsChangeUsernameMsg = Pick<WsMessage, "clientId" | "type"> & {
  username: string;
};
