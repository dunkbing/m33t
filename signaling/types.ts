export type Message = {
  type: ServerEventEmit | ClientEventEmit;
  data: JoinRoomMessage | IceCandidateMessage | SessionDescMessage;
};

export type JoinRoomMessage = {
  room: string;
  clientId: string;
  createOffer?: boolean;
};

export type IceCandidateMessage = JoinRoomMessage & {
  iceCandidate: {
    sdpMLineIndex: number | null;
    candidate: string;
  };
};

export type SessionDescMessage = JoinRoomMessage & {
  sessionDescription: RTCSessionDescriptionInit;
};

export type ServerEventEmit =
  | "add-peer"
  | "remove-peer"
  | "ice-candidate"
  | "session-desc";

export type ClientEventEmit =
  | "join"
  | "disconnect"
  | "relay-ice-candidate"
  | "relay-session-desc";
