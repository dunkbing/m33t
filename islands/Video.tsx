import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

export default function Video() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!navigator.mediaDevices.getUserMedia) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        if (video.current) {
          video.current.srcObject = stream;
        }
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }, [video.current]);

  return (
    <div>
      <video
        class="rounded-lg"
        ref={video}
        autoPlay
        width="100%"
        height="100%"
      />
    </div>
  );
}
