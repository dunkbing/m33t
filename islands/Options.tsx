import { useCallback, useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconMicrophoneOff from "ticons/tsx/microphone-off.tsx";
import IconVideo from "ticons/tsx/video.tsx";
import IconVideoOff from "ticons/tsx/video-off.tsx";
import IconMessage from "ticons/tsx/message.tsx";
import IconScreenShare from "ticons/tsx/screen-share.tsx";
import IconScreenShareOff from "ticons/tsx/screen-share-off.tsx";
import IconInfoCircle from "ticons/tsx/info-circle.tsx";

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
  const toggle = () => {
    props.onToggle?.();
    setEnabled(!enabled);
  };
  return (
    <>
      {props.type === "audio" && (
        <OptionWrap onClick={toggle}>
          {enabled
            ? <IconMicrophone size={36} />
            : <IconMicrophoneOff size={36} />}
        </OptionWrap>
      )}
      {props.type === "video" && (
        <OptionWrap onClick={toggle}>
          {enabled ? <IconVideo size={36} /> : <IconVideoOff size={36} />}
        </OptionWrap>
      )}
    </>
  );
}

function Info() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location) {
      setLink(window.location.href);
    }
  }, [window.location]);

  const copy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(console.error);
    }
  }, [navigator.clipboard, link]);

  return (
    <div class="flex flex-col items-center bg-white rounded-md p-1.5 mb-1.5">
      <p class="italic">Share this link to start talking.</p>
      <div class="flex flex-row gap-2">
        <p class="text-blue-600">{link}</p>
        <p class="font-bold cursor-pointer" onClick={copy}>
          {copied ? "Copied ✅" : "Copy"}
        </p>
      </div>
    </div>
  );
}

type OptionsProps = {
  screenSharing?: boolean;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  onToggleScreenShare?: () => void;
};

export default function Options(props: OptionsProps) {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div class="flex flex-col items-center">
      {showInfo && <Info />}
      <div class="flex flex-row gap-2 items-center">
        <OptionWrap onClick={() => setShowInfo(!showInfo)}>
          <IconInfoCircle size={36} />
        </OptionWrap>
        <MediaButton type="audio" onToggle={props.onToggleAudio} />
        <MediaButton type="video" onToggle={props.onToggleVideo} />
        <OptionWrap>
          <IconMessage size={36} />
        </OptionWrap>
        <OptionWrap onClick={props.onToggleScreenShare}>
          {props.screenSharing
            ? <IconScreenShareOff class="text-red-300" size={36} />
            : <IconScreenShare size={36} />}
        </OptionWrap>
        <button
          class="px-4 py-3.5 bg-red-400 font-bold text-white border border-b-4 border-r-4 border-red-600 rounded-lg shadow-lg hover:bg-red-500 hover:shadow-sm hover:border-b-2 hover:border-r-2"
          onClick={() => close?.()}
        >
          Leave
        </button>
      </div>
    </div>
  );
}
