import type {
  IceCandidateMessage,
  JoinRoomMessage,
  Message,
  SessionDescMessage,
} from './types.ts';

export class RoomChannel {
  private channel: BroadcastChannel;

  constructor(room: string) {
    this.channel = new BroadcastChannel(room);
  }

  onJoinRoom(handleFunc: (message: JoinRoomMessage) => void) {
    console.log('onJoinRoom');
    const listener = (e: MessageEvent) => {
      handleFunc(e.data);
    };
    this.channel.addEventListener('message', listener);

    return {
      unsubscribe: () => {
        this.channel.removeEventListener('message', listener);
      },
    };
  }

  joinRoom(message: JoinRoomMessage) {
    this.channel.postMessage({
      type: 'add-peer',
      data: message,
    } as Message);
  }

  iceCandidate(message: IceCandidateMessage) {
    this.channel.postMessage({
      type: 'ice-candidate',
      data: message,
    } as Message);
  }

  sessionDescription(message: SessionDescMessage) {
    this.channel.postMessage({
      type: 'session-desc',
      data: message,
    } as Message);
  }

  close() {
    console.log('close channel');
    this.channel.close();
  }
}
