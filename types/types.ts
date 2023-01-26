export type MessageType =
  | "join"
  | "call-offer"
  | "call-answer"
  | "offer"
  | "answer"
  | "disconnect"
  | "toggle-video"
  | "toggle-audio"
  | "change-username"
  | "send-msg";

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

export type WsSendMessageMsg = Pick<WsMessage, "clientId" | "type"> & {
  username: string;
  message: string;
  createdAt: string;
};
