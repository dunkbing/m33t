import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import IconVideoOff from "ticons/tsx/video-off.tsx";

interface Props {
  id: string;
  stream: MediaStream | null;
  videoDisabled?: boolean;
}

const Video = (props: Props & JSX.HTMLAttributes<HTMLVideoElement>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  }, [videoRef.current, props.stream]);

  return (
    <div class="relative aspect-video bg-black rounded-xl flex items-center justify-center">
      {props.videoDisabled && (
        <div class="absolute inset-0 flex justify-center items-center z-10">
          <IconVideoOff size={80} color="white" />
        </div>
      )}
      <video
        {...props}
        ref={videoRef}
        class="rounded-xl object-cover w-full aspect-video z-0"
        autoPlay
        playsInline
      >
      </video>
    </div>
  );
};

export default Video;
