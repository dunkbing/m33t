import { memo } from "preact/compat";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import twas from "twas";

export type ChatMessageProps = {
  username: string;
  createdAt: string;
  message: string;
};

const ChatMessage = memo((props: ChatMessageProps) => {
  return (
    <div class="flex mb-2">
      <div>
        <p class="flex items-baseline">
          <span class="mr-2 font-bold text-sm">{props.username}</span>
          <span class="text-xs text-gray-400 font-extralight">
            {twas(new Date(props.createdAt).getTime())}
          </span>
        </p>
        <p class="text-sm text-gray-800">{props.message}</p>
      </div>
    </div>
  );
});

export default function Chat(props: {
  onSendMsg?: (msg: string) => void;
  messages: ChatMessageProps[];
}) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const sendMessage: JSX.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        props.onSendMsg?.(e.currentTarget.value);
        e.currentTarget.value = "";
      }
    },
    [],
  );

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesRef, props.messages.length]);

  return (
    <div class="flex flex-col justify-evenly items-center bg-white w-72 rounded-md mb-1.5">
      {props.messages.length
        ? (
          <div
            ref={messagesRef}
            class="flex-auto w-full h-4/5 overflow-y-scroll mt-2 px-3 h-56"
          >
            {props.messages.map((msg) => (
              <ChatMessage
                key={msg.createdAt}
                username={msg.username}
                createdAt={msg.createdAt}
                message={msg.message}
              />
            ))}
          </div>
        )
        : null}
      <input
        type="text"
        class="w-5/6 px-1 mt-1.5 bg-white rounded border(gray-500 2)"
        placeholder="Type message..."
        onKeyDown={sendMessage}
      />
      <span class="italic text-sm text-gray-600">Press enter to send</span>
    </div>
  );
}
