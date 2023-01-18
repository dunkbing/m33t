import { useEffect, useRef } from "preact/hooks";

interface Props {
  id: string;
  stream: MediaStream | null;
}

const Video = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  }, [videoRef.current, props.stream]);

  return (
    <div>
      {/* <p class="text-white">{props.id}</p> */}
      <video
        ref={videoRef}
        class="rounded-xl object-cover w-full"
        autoPlay
        playsInline
      />
    </div>
  );
};

export default Video;
