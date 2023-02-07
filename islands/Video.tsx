import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { memo } from "preact/compat";
import IconVideoOff from "ticons/tsx/video-off.tsx";
import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconMicrophoneOff from "ticons/tsx/microphone-off.tsx";

interface Props {
  id: string;
  username?: string;
  stream: MediaStream | null;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

const ZoomIcon = () => {
  return (
    <>
      <svg
        height="20px"
        version="1.1"
        viewBox="0 0 14 14"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title />
        <desc />
        <defs />
        <g
          fill="none"
          fill-rule="evenodd"
          id="Page-1"
          stroke="none"
          stroke-width="1"
        >
          <g
            fill="#ffffff"
            id="Core"
            transform="translate(-215.000000, -257.000000)"
          >
            <g id="fullscreen" transform="translate(215.000000, 257.000000)">
              <path
                d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z"
                id="Shape"
              />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

const Video = (props: Props & JSX.HTMLAttributes<HTMLVideoElement>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
  }, [videoRef.current, props.stream]);

  return (
    <div
      ref={containerRef}
      class="relative aspect-video bg-black rounded-xl flex items-center justify-center"
    >
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
      {props.username && (
        <div class="absolute flex z-10 left-0 top-0 ml-1 mt-1 bg-gray-800 bg-opacity-60 text-white p-1 rounded-md">
          {props.username}
        </div>
      )}
      <div class="absolute flex z-10 left-0 bottom-0 ml-1 mb-1 bg-gray-800 bg-opacity-60 p-1 rounded-md">
        {props.audioEnabled
          ? <IconMicrophone size={25} color="white" />
          : <IconMicrophoneOff size={25} color="white" />}
      </div>
      <div
        onClick={() =>
          containerRef.current?.requestFullscreen().catch(console.log)}
        class="absolute flex z-10 right-0 bottom-0 mr-1 mb-1 bg-gray-800 bg-opacity-60 p-1 rounded-md cursor-pointer"
      >
        <ZoomIcon />
      </div>
    </div>
  );
};

export default memo(Video);
