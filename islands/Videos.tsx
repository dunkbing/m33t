import { useEffect, useMemo, useState } from "preact/hooks";
import { ICE_SERVERS } from "@/utils/constants.ts";
import Video from "@/islands/Video.tsx";

interface Props {
  room: string;
}

type RemoteStream = {
  stream: MediaStream;
  clientId: string;
};

export default function Videos(props: Props) {
  const id = useMemo(() => {
    const res = Math.random().toString(36).substring(2, 9);
    console.log("clientId", res);
    return res;
  }, []);
  // const arr = useMemo<Array<RemoteStream>>(() => [], []);
  const peers = useMemo<Record<string, RTCPeerConnection>>(() => ({}), []);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Array<RemoteStream>>([]);
  const length = remoteStreams.length + 1 > 3 ? 3 : 2;

  useEffect(() => {
    async function getMediaStream() {
      if (!navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    }

    void getMediaStream();
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const ws = new WebSocket(
      `ws://localhost:8000/api/ws?clientId=${id}&room=${props.room}`,
    );
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join" }));
    };
    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);
      let pc = peers[data.clientId];
      if (!pc) {
        pc = new RTCPeerConnection(ICE_SERVERS);
        for (const track of localStream.getTracks()) {
          pc.addTrack(track, localStream);
        }
        const remoteStream = new MediaStream();
        pc.ontrack = (event) => {
          for (const track of event.streams[0].getTracks()) {
            remoteStream.addTrack(track);
          }
        };

        remoteStreams.push({ clientId: data.clientId, stream: remoteStream });
        setRemoteStreams([...remoteStreams]);
        peers[data.clientId] = pc;
        console.log(peers);
      }
      if (data.type === "join") {
        pc.onicecandidate = (event) => {
          event.candidate &&
            ws.send(
              JSON.stringify({
                type: "offer",
                data: event.candidate?.toJSON(),
                clientId: data.clientId,
              }),
            );
        };
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };
        ws.send(
          JSON.stringify({
            type: "call-offer",
            data: offer,
            clientId: data.clientId,
          }),
        );
      } else if (data.type === "call-offer") {
        pc.onicecandidate = (event) => {
          event.candidate &&
            ws.send(
              JSON.stringify({
                type: "answer",
                data: event.candidate.toJSON(),
                clientId: data.clientId,
              }),
            );
        };
        const offerDescription = new RTCSessionDescription(data.data);
        await pc.setRemoteDescription(offerDescription).catch(console.log);

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };

        ws.send(
          JSON.stringify({
            type: "call-answer",
            data: answer,
            clientId: data.clientId,
          }),
        );
      } else if (data.type === "call-answer") {
        if (!pc.currentRemoteDescription && data.data) {
          const answerDescription = new RTCSessionDescription(data.data);
          pc.setRemoteDescription(answerDescription).catch(() =>
            console.log("set remote call answer")
          );
        }
      } else if (data.type === "offer" && data.data) {
        const candidate = new RTCIceCandidate(data.data);
        pc.addIceCandidate(candidate).catch((err) => {
          console.log("offer", data.clientId, err);
        });
      } else if (data.type === "answer" && data.data) {
        const candidate = new RTCIceCandidate(data.data);
        pc.addIceCandidate(candidate).catch((err) => {
          console.log("candidate", data.clientId, err);
        });
      } else if (data.type === "disconnect") {
        delete peers[data.clientId];
      }
      const keys = Object.keys(peers);
      if (keys.length !== remoteStreams.length) {
        console.log("disconnect-bf", data.clientId, remoteStreams);
        const streams = remoteStreams.filter((rs) => {
          console.log(
            "filter",
            rs.clientId,
            data.clientId,
            rs.clientId !== data.clientId,
          );
          return keys.includes(rs.clientId);
        });
        console.log("disconnect-af", streams);
        setRemoteStreams([...streams]);
      }
    };
  }, [localStream]);

  return (
    <div
      class={`grid grid-cols-${length} content-center justify-center w-7/8 gap-3`}
    >
      <Video stream={localStream} id={id} />
      {remoteStreams.map((rs) => (
        <Video key={rs.clientId} id={rs.clientId} stream={rs.stream} />
      ))}
    </div>
  );
}
