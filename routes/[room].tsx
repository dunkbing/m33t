import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Options from "@/islands/Options.tsx";
import Videos from "@/islands/Videos.tsx";

export default function Room(props: PageProps) {
  const roomId = props.url.pathname.substring(1);
  return (
    <>
      <Head>
        <title>M33t</title>
      </Head>
      <div class="flex flex-col justify-center items-center p-10 mx-auto w-screen h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black gap-5">
        <Videos room={roomId} length={1} />
        <Options />
      </div>
    </>
  );
}
