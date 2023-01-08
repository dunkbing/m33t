import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

type Props = {
  label?: string;
};

export function Slider(props: Props) {
  return (
    <div class="flex flex-row">
      {props.label && (
        <label
          for="default-range"
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          {props.label}
        </label>
      )}
      <input
        id="default-range"
        type="range"
        value="20"
        class="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
