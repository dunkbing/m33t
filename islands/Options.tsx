import IconMicrophone from "ticons/tsx/microphone.tsx";
import IconVideo from "ticons/tsx/video.tsx";
import IconMessage from "ticons/tsx/message.tsx";
import IconScreenShare from "ticons/tsx/screen-share.tsx";
import { Slider } from "../components/Slider.tsx";
import { JSX } from "preact/jsx-runtime";

function OptionWrap(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class="bg-gray-700 p-3 rounded-lg text-white cursor-pointer	hover:bg-gray-900 hover:text-gray-400"
    />
  );
}

interface Props {
  onToggleVideo?: () => void;
}

export default function Options(props: Props) {
  return (
    <div class="flex flex-row gap-2 items-center">
      <OptionWrap>
        <IconMicrophone size={36} />
      </OptionWrap>
      <OptionWrap onClick={props.onToggleVideo}>
        <IconVideo size={36} />
      </OptionWrap>
      <OptionWrap>
        <IconMessage size={36} />
      </OptionWrap>
      <OptionWrap>
        <IconScreenShare size={36} />
      </OptionWrap>
      <button class="bg-red-500 hover:bg-red-700 text-white text-xl font-bold py-3.5 px-4 border border-red-700 rounded-md">
        Leave
      </button>
    </div>
  );
}
