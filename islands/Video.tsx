import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { memo } from "preact/compat";
import IconVideoOff from "ticons/tsx/video-off.tsx";
import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconMicrophoneOff from "ticons/tsx/microphone-off.tsx";

interface Props {
  id: string;
  stream: MediaStream | null;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
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
      {!props.videoEnabled && (
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
      />
      <div class="absolute inset-0 flex z-10 ml-1 mt-1">
        {props.audioEnabled
          ? <IconMicrophone size={25} color="white" />
          : <IconMicrophoneOff size={25} color="white" />}
      </div>
    </div>
  );
};

export default memo(Video);
