import { useEffect, useState } from 'preact/hooks';
import server from '@/signaling/server.ts';
import { ICE_SERVERS } from '@/utils/constants.ts';
import Video from '@/islands/Video.tsx';
import { IceCandidateMessage, SessionDescMessage } from '../signaling/types.ts';

interface Props {
  room: string;
  length: number;
}

const peers: Record<string, RTCPeerConnection> = {};

export default function Videos(props: Props) {
  const [clientId, setClientId] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    ReadonlyArray<MediaStream>
  >([]);
  // const [peers, setPeers] = useState<string[]>([]);
  console.log(remoteStreams);
  const length = remoteStreams.length + 1 > 3 ? 3 : 2;

  useEffect(() => {
    if (!navigator.mediaDevices.getUserMedia) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        setLocalStream(stream);
      })
      .catch(function (error) {
        console.log('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    const existedClientId =
      localStorage.getItem('clientId') ||
      Math.random().toString(36).substring(2, 8);
    localStorage.setItem('clientId', existedClientId);
    setClientId(existedClientId);

    const sub = server.subscribe(props.room, (message) => {
      console.log('onjoinroom', message);
      const clientId = message.data.clientId;

      if (message.type === 'add-peer') {
        const peerConnection = new RTCPeerConnection({
          iceServers: ICE_SERVERS,
        });
        peers[clientId] = peerConnection;

        peerConnection.onicecandidate = function (event) {
          console.log('onicecandidate');
          if (event.candidate) {
            server.send({
              type: 'relay-ice-candidate',
              data: {
                room: props.room,
                clientId: existedClientId,
                iceCandidate: {
                  sdpMLineIndex: event.candidate.sdpMLineIndex,
                  candidate: event.candidate.candidate,
                },
              },
            });
          }
        };

        // peerConnection.ontrack = (event) => {
        //   console.log('ontrack');
        //   setRemoteStreams(event.streams);
        // };
        peerConnection.onaddstream = function (event) {
          setRemoteStreams([...remoteStreams, event.stream]);
        };

        peerConnection.ondatachannel = function (event) {
          console.log('datachannel event' + clientId, event);
          event.channel.onmessage = (msg) => {
            let dataMessage = {};
            try {
              dataMessage = JSON.parse(msg.data);
            } catch (err) {
              console.log(err);
            }
          };
        };

        /* Add our local stream */
        console.log('localStream addtrack', localStream);
        peerConnection.addStream(localStream);
        // localStream?.getTracks().forEach((track) => {
        //   console.log('addtrack');
        //   peerConnection.addTrack(track, localStream);
        // });

        if (
          message.data.createOffer &&
          existedClientId === message.data.clientId
        ) {
          peerConnection.onnegotiationneeded = () => {
            peerConnection
              .createOffer()
              .then((localDescription) => {
                peerConnection
                  .setLocalDescription(localDescription)
                  .then(() => {
                    server.send({
                      type: 'relay-session-desc',
                      data: {
                        room: props.room,
                        clientId: existedClientId,
                        sessionDescription: localDescription,
                      },
                    });
                  })
                  .catch(() => {
                    alert('Offer setLocalDescription failed!');
                  });
              })
              .catch((error) => {
                console.log('Error sending offer: ', error);
              });
          };
        }
      } else if (message.type === 'session-desc') {
        const data = message.data as SessionDescMessage;
        const clientId = data.clientId;
        const peer = peers[clientId];
        const remoteDescription = data.sessionDescription;

        const desc = new RTCSessionDescription(remoteDescription);
        peer.setRemoteDescription(
          desc,
          () => {
            if (remoteDescription.type == 'offer') {
              peer.createAnswer(
                (localDescription) => {
                  peer.setLocalDescription(
                    localDescription,
                    () => {
                      server.send({
                        type: 'relay-session-desc',
                        data: {
                          room: props.room,
                          clientId: existedClientId,
                          sessionDescription: localDescription,
                        },
                      });
                    },
                    () => alert('Answer setLocalDescription failed!')
                  );
                },
                (error) => console.log('Error creating answer: ', error)
              );
            }
          },
          (error) => console.log('setRemoteDescription error: ', error)
        );
      } else if (message.type === 'ice-candidate') {
        const data = message.data as IceCandidateMessage;
        const peer = peers[message.data.clientId];
        const iceCandidate = data.iceCandidate;
        peer
          .addIceCandidate(new RTCIceCandidate(iceCandidate))
          .catch((error) => {
            console.log('Error addIceCandidate', error, iceCandidate);
          });
      }
    });

    server.send({
      type: 'join',
      data: { room: props.room, clientId: existedClientId },
    });

    return () => sub.unsubscribe();
  }, [localStream]);

  return (
    <div
      class={`grid grid-cols-${length} content-center justify-center w-5/6 gap-3`}
    >
      <Video stream={localStream} />
      {remoteStreams.map((stream, i) => (
        <Video key={i} stream={stream} />
      ))}
    </div>
  );
}
