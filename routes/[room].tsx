import { PageProps } from "$fresh/server.ts";
import Videos from "@/islands/Videos.tsx";
import Head from "@/components/Head.tsx";

export default function Room(props: PageProps) {
  const roomId = props.url.pathname.substring(1);

  return (
    <>
      <Head />
      <Videos room={roomId} />
      <script async defer src="https://scripts.withcabin.com/hello.js" />
    </>
  );
}
