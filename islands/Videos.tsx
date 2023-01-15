import { useEffect, useMemo, useState } from 'preact/hooks';
import { ICE_SERVERS } from '@/utils/constants.ts';
import Video from '@/islands/Video.tsx';

interface Props {
  room: string;
}

const peers: Record<string, RTCPeerConnection> = {};

export default function Videos(props: Props) {
  const clientId = useMemo(
    () => Math.random().toString(36).substring(2, 9),
    []
  );
  console.log('clientId', clientId);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const length = remoteStreams.length + 1 > 3 ? 3 : 2;

  useEffect(() => {
    const ws_ = new WebSocket(
      `ws://localhost:8000/api/ws?clientId=${clientId}&room=${props.room}`
    );
    const pc_ = new RTCPeerConnection(ICE_SERVERS);
    setWs(ws_);
    setPc(pc_);
  }, []);

  useEffect(() => {
    async function getMediaStream() {
      if (!navigator.mediaDevices.getUserMedia) return;

      if (pc) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const remoteStream_ = new MediaStream();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        pc.ontrack = (event) => {
          event.streams[0]
            .getTracks()
            .forEach((track) => remoteStream_.addTrack(track));
          setRemoteStream(remoteStream_);
        };
        setLocalStream(stream);
      }
    }

    void getMediaStream();
  }, [pc]);

  useEffect(() => {
    if (!ws || !pc || !localStream) return;

    (function () {
      ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        console.log(data);
        if (data.type === 'call-offer') {
          pc.onicecandidate = (event) => {
            event.candidate &&
              ws.send(
                JSON.stringify({
                  type: 'answer',
                  data: event.candidate.toJSON(),
                })
              );
          };
          const offerDescription = data.data;
          await pc.setRemoteDescription(
            new RTCSessionDescription(offerDescription)
          );

          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(answerDescription);

          const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
          };

          ws.send(JSON.stringify({ type: 'call-answer', data: answer }));
        }
        if (data.type === 'call-answer') {
          if (!pc.currentRemoteDescription && data.data) {
            const answerDescription = new RTCSessionDescription(data.data);
            pc.setRemoteDescription(answerDescription);
          }
        }
        if (data.type === 'offer') {
          pc.addIceCandidate(new RTCIceCandidate(data.data));
        }
        if (data.type === 'answer') {
          const candidate = new RTCIceCandidate(data.data);
          pc.addIceCandidate(candidate);
        }
      };
    })();

    (async function () {
      pc.onicecandidate = (event) => {
        const data = event.candidate?.toJSON();
        event.candidate && ws.send(JSON.stringify({ type: 'offer', data }));
      };
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };
      ws.send(JSON.stringify({ type: 'call-offer', data: offer }));
    })();
  }, [ws, pc, localStream, remoteStream]);

  return (
    <div class={`grid grid-cols-2 content-center justify-center w-5/6 gap-3`}>
      <Video stream={localStream} />
      <Video stream={remoteStream} />
      {/* {remoteStreams.map((stream, i) => (
        <Video key={i} stream={stream} />
      ))} */}
    </div>
  );
}
