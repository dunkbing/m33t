import Head from "@/components/Head.tsx";

export default function () {
  return (
    <>
      <Head />
      <div class="flex flex-col justify-center items-center p-10 mx-auto w-screen min-h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black gap-5">
        <div class="min-h-screen flex items-center justify-center">
          <div class="max-w-xl p-6 text-center text-white">
            <p class="text-lg">
              M33t is purely peer-to-peer, which means the user's video & audio
              is not sent to our server at all. We also use Cabin Analytics to
              track aggregated usage statistics in order to improve our service,
              which can be seen here in this{" "}
              <a
                class="underline text-green-500"
                href="https://withcabin.com/public/LT8F6bLEigzi"
                target="_blank"
              >
                public dashboard
              </a>
              .
            </p>
            <p class="text-lg">
              We have no intention of using personally or selling any of the
              above-mentioned data.
            </p>
          </div>
        </div>
      </div>
      <script async defer src="https://scripts.withcabin.com/hello.js" />
    </>
  );
}
