import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconMicrophoneOff from "ticons/tsx/microphone-off.tsx";
import IconVideo from "ticons/tsx/video.tsx";
import IconVideoOff from "ticons/tsx/video-off.tsx";
import IconMessage from "ticons/tsx/message.tsx";
import IconScreenShare from "ticons/tsx/screen-share.tsx";
import IconScreenShareOff from "ticons/tsx/screen-share-off.tsx";
import IconInfoCircle from "ticons/tsx/info-circle.tsx";
import Chat, { ChatMessageProps } from "./Chat.tsx";

function debounce<T extends unknown[], U>(
  wait: number,
  callback: (...args: T) => PromiseLike<U> | U,
) {
  let timer: number;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

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
          {enabled ? <IconMicrophone /> : <IconMicrophoneOff />}
        </OptionWrap>
      )}
      {props.type === "video" && (
        <OptionWrap onClick={toggle}>
          {enabled ? <IconVideo /> : <IconVideoOff />}
        </OptionWrap>
      )}
    </>
  );
}

function Info(props: {
  username?: string;
  onChangeName?: (name: string) => void;
}) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location) {
      setLink(window.location.href);
    }
  }, [window.location]);

  useEffect(() => {
    if (props.username && inputRef.current) {
      inputRef.current.defaultValue = props.username;
    }
  }, [props.username, inputRef.current]);

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

  const searchDebounce = useCallback(
    debounce(1000, (text: string) => {
      props.onChangeName?.(text);
    }),
    [props.onChangeName],
  );

  const handleChange: JSX.GenericEventHandler<HTMLInputElement> = (e) => {
    void searchDebounce(e.currentTarget.value);
  };

  return (
    <div class="flex flex-col bg-white rounded-md p-1.5 mb-1.5">
      <div class="flex flex-row gap-1 items-center">
        <label class="font-semibold" htmlFor="name">
          Name
        </label>
        <input
          ref={inputRef}
          onChange={handleChange}
          id="name"
          type="text"
          class="px-1 bg-white rounded border(gray-500 2)"
        />
      </div>
      <p class="italic">Share this link to start talking.</p>
      <div class="flex flex-row gap-2">
        <p class="text-blue-600">{link}</p>
        <p class="font-bold cursor-pointer" onClick={copy}>
          {copied ? "Copied ✅" : "Copy"}
        </p>
      </div>
      <div class="flex flex-row">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=dunkbing&repo=m33t&type=star&count=true"
          frameBorder="0"
          scrolling="0"
          width="150"
          height="20"
          title="GitHub"
        />
        <a href="https://fresh.deno.dev">
          <img
            width="130"
            height="20"
            src="https://fresh.deno.dev/fresh-badge-dark.svg"
            alt="Made with Fresh"
          />
        </a>
      </div>
      <div class="flex flex-row gap-2">
        <a
          class="italic text-sm underline"
          target="_blank"
          href="https://withcabin.com/public/LT8F6bLEigzi"
        >
          Stats
        </a>
        <a class="italic text-sm underline" href="/feedback">
          Feedback
        </a>
      </div>
    </div>
  );
}

type OptionsProps = {
  screenSharing?: boolean;
  username?: string;
  messages: ChatMessageProps[];
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  onToggleScreenShare?: () => void;
  onChangeName?: (name: string) => void;
  onSendMessage?: (msg: string) => void;
};

export default function Options(props: OptionsProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [showChat, setShowChat] = useState(false);

  return (
    <div class="flex flex-col items-center">
      {showInfo && (
        <Info username={props.username} onChangeName={props.onChangeName} />
      )}
      {showChat && (
        <Chat onSendMsg={props.onSendMessage} messages={props.messages} />
      )}
      <div class="flex flex-row gap-2 items-center">
        <OptionWrap
          onClick={() => {
            setShowInfo(!showInfo);
            setShowChat(false);
          }}
        >
          <IconInfoCircle />
        </OptionWrap>
        <MediaButton type="audio" onToggle={props.onToggleAudio} />
        {!props.screenSharing && (
          <MediaButton type="video" onToggle={props.onToggleVideo} />
        )}
        <OptionWrap
          onClick={() => {
            setShowInfo(false);
            setShowChat(!showChat);
          }}
        >
          <IconMessage />
        </OptionWrap>
        <OptionWrap onClick={props.onToggleScreenShare}>
          {props.screenSharing
            ? <IconScreenShareOff class="text-red-300" />
            : <IconScreenShare />}
        </OptionWrap>
        <button
          class="p-2 bg-red-400 font-bold text-white border border-b-4 border-r-4 border-red-600 rounded-lg shadow-lg hover:bg-red-500 hover:shadow-sm hover:border-b-2 hover:border-r-2"
          onClick={() => close?.()}
        >
          Leave
        </button>
      </div>
    </div>
  );
}
