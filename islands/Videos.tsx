import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { tw } from "twind";
import Video from "./Video.tsx";

interface Props {
  length: number;
}

export default function Videos(props: Props) {
  const style = tw``;
  const length = props.length > 3 ? 3 : props.length;
  return (
    <div class={`grid grid-cols-${length} content-center w-full gap-3`}>
      <Video />
      <Video />
      <Video />
      {
        /* <Video />
      <Video />
      <Video />
      <Video /> */
      }
    </div>
  );
}
