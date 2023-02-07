import { PageProps } from "$fresh/server.ts";
import Head from "../components/Head.tsx";

interface Query {
  error?: Error | null;
}

export default function NotFound(ctx: PageProps<Query>) {
  return (
    <>
      <Head title_="Not found" />
      <div class="text-white flex flex-col justify-center items-center p-10 mx-auto w-screen min-h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black gap-5">
        Not found
      </div>
      <script async defer src="https://scripts.withcabin.com/hello.js" />
    </>
  );
}
