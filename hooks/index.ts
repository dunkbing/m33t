import { useEffect, useState } from "preact/hooks";

export function useUserMedia(constraints: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream);
      } catch (err) {
        console.log("getUserMediaError", err);
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream]);

  return mediaStream;
}
