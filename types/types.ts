export interface WsMessage {
  clientId: string;
  type:
    | "join"
    | "call-offer"
    | "call-answer"
    | "offer"
    | "answer"
    | "disconnect";
  // deno-lint-ignore no-explicit-any
  data: any;
}
