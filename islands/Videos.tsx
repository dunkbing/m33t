import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { ICE_SERVERS } from "@/utils/constants.ts";
import Video from "@/islands/Video.tsx";
import { useUserMedia } from "@/hooks/index.ts";
import { WsMediaMessage, WsMessage } from "@/types/types.ts";
import Options from "@/islands/Options.tsx";

interface Props {
  room: string;
}

type RemoteStream = {
  stream: MediaStream;
  clientId: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
};

export default function Videos(props: Props) {
  const id = useMemo(() => {
    const res = Math.random().toString(36).substring(2, 9);
    console.log("clientId", res);
    return res;
  }, []);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const peers = useMemo<Record<string, RTCPeerConnection>>(() => ({}), []);
  const localStream = useUserMedia({ video: true, audio: true });
  const [remoteStreams, setRemoteStreams] = useState<Array<RemoteStream>>([]);
  const length = remoteStreams.length + 1 > 3 ? 3 : remoteStreams.length + 1;
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const toggleAudio = useCallback(() => {
    const enabled = !audioEnabled;
    setAudioEnabled(enabled);
    ws?.send(
      JSON.stringify({
        type: "toggle-audio",
        clientId: id,
        enabled,
      } as WsMediaMessage),
    );
  }, [ws, audioEnabled]);

  const toggleVideo = useCallback(() => {
    const enabled = !videoEnabled;
    setVideoEnabled(enabled);
    ws?.send(
      JSON.stringify({
        type: "toggle-video",
        clientId: id,
        enabled,
      } as WsMediaMessage),
    );
  }, [ws, videoEnabled]);

  useEffect(() => {
    if (!localStream) return;

    localStream.getAudioTracks()[0].enabled = audioEnabled;
    localStream.getVideoTracks()[0].enabled = videoEnabled;
  }, [localStream, audioEnabled, videoEnabled]);

  useEffect(() => {
    if (!localStream) return;

    const { protocol, host } = location;
    let wsProtocol = "ws";
    if (protocol.includes("https")) {
      wsProtocol = "wss";
    }
    const url =
      `${wsProtocol}://${host}/api/ws?clientId=${id}&room=${props.room}`;
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join" }));
    };
    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data) as WsMessage;
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
          const rs = remoteStreams.find((r) => r.clientId === data.clientId);
          if (!rs) {
            remoteStreams.push({
              clientId: data.clientId,
              stream: remoteStream,
              videoEnabled: remoteStream.getVideoTracks()[0]?.enabled,
              audioEnabled: remoteStream.getAudioTracks()[0]?.enabled,
            });
            setRemoteStreams([...remoteStreams]);
          }
        };

        peers[data.clientId] = pc;
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
        await pc.setRemoteDescription(offerDescription);

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
          pc.setRemoteDescription(answerDescription);
        }
      } else if (data.type === "offer" && data.data) {
        const candidate = new RTCIceCandidate(data.data);
        pc.addIceCandidate(candidate);
      } else if (data.type === "answer" && data.data) {
        const candidate = new RTCIceCandidate(data.data);
        pc.addIceCandidate(candidate);
      } else if (data.type === "toggle-video") {
        const d = data as unknown as WsMediaMessage;
        const rs = remoteStreams.find((r) => r.clientId === d.clientId);
        if (rs) {
          rs.stream.getVideoTracks()[0].enabled = d.enabled;
          rs.videoEnabled = d.enabled;
          setRemoteStreams([...remoteStreams]);
        }
      } else if (data.type === "toggle-audio") {
        const d = data as unknown as WsMediaMessage;
        const rs = remoteStreams.find((r) => r.clientId === d.clientId);
        if (rs) {
          rs.stream.getAudioTracks()[0].enabled = d.enabled;
          rs.audioEnabled = d.enabled;
          setRemoteStreams([...remoteStreams]);
        }
      } else if (data.type === "disconnect") {
        delete peers[data.clientId];
      }
      const keys = Object.keys(peers);
      if (keys.length !== remoteStreams.length) {
        const streams = remoteStreams.filter((rs) =>
          keys.includes(rs.clientId)
        );
        setRemoteStreams([...streams]);
      }
    };
    setWs(ws);
  }, [localStream]);

  return (
    <div class="flex flex-col justify-center items-center p-10 mx-auto w-screen min-h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black gap-5">
      <div
        class={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${length} w-7/8 gap-3 mt-5`}
      >
        <Video
          muted
          stream={localStream}
          id={id}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
        />
        {remoteStreams.map((rs) => (
          <Video
            key={rs.clientId}
            id={rs.clientId}
            stream={rs.stream}
            videoEnabled={rs.videoEnabled}
            audioEnabled={rs.audioEnabled}
          />
        ))}
      </div>
      <div class="fixed bottom-0">
        <Options onToggleAudio={toggleAudio} onToggleVideo={toggleVideo} />
      </div>
    </div>
  );
}
