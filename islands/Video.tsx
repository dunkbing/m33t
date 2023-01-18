import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface Props {
  id: string;
  stream: MediaStream | null;
}

const Video = (props: Props & JSX.HTMLAttributes<HTMLVideoElement>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  }, [videoRef.current, props.stream]);

  return (
    <div class="aspect-video">
      <video
        {...props}
        ref={videoRef}
        class="rounded-xl object-cover w-full aspect-video"
        autoPlay
        playsInline
      />
    </div>
  );
};

export default Video;
