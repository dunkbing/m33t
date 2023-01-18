import { useContext, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconMicrophoneOff from "ticons/tsx/microphone-off.tsx";
import IconVideo from "ticons/tsx/video.tsx";
import IconVideoOff from "ticons/tsx/video-off.tsx";
import IconMessage from "ticons/tsx/message.tsx";
import IconScreenShare from "ticons/tsx/screen-share.tsx";

function OptionWrap(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class="bg-gray-700 py-2 px-3 rounded-lg text-white cursor-pointer	hover:bg-gray-900 hover:text-gray-400 border border-b-4 border-r-4 border-purple-600 rounded-lg shadow-lg hover:shadow-sm hover:border-b-2 hover:border-r-2"
    />
  );
}

interface MediaButtonProps {
  type: "audio" | "video";
  onToggle?: () => void;
}

function MediaButton(props: MediaButtonProps) {
  const [enabled, setEnabled] = useState(true);
  return (
    <>
      {props.type === "audio" && (
        <OptionWrap onClick={() => setEnabled(!enabled)}>
          {enabled
            ? <IconMicrophone size={36} />
            : <IconMicrophoneOff size={36} />}
        </OptionWrap>
      )}
      {props.type === "video" && (
        <OptionWrap onClick={() => setEnabled(!enabled)}>
          {enabled ? <IconVideo size={36} /> : <IconVideoOff size={36} />}
        </OptionWrap>
      )}
    </>
  );
}

export default function Options() {
  return (
    <div class="flex flex-row w-full md:w-1/2 lg:w-1/5 gap-2 items-center">
      <MediaButton type="audio" />
      <MediaButton type="video" />
      <OptionWrap>
        <IconMessage size={36} />
      </OptionWrap>
      <OptionWrap>
        <IconScreenShare size={36} />
      </OptionWrap>
      <button class="px-4 py-3.5 bg-red-400 font-bold text-white border border-b-4 border-r-4 border-red-600 rounded-lg shadow-lg hover:bg-red-500 hover:shadow-sm hover:border-b-2 hover:border-r-2">
        Leave
      </button>
    </div>
  );
}
