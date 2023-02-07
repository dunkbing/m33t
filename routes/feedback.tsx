import Head from "@/components/Head.tsx";
import FeedbackForm from "@/islands/FeedbackForm.tsx";

export default function () {
  return (
    <>
      <Head title_="Feedback" />
      <div class="flex flex-col justify-center items-center p-10 mx-auto w-screen min-h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black gap-5">
        <div class="min-h-screen flex items-center justify-center">
          <FeedbackForm />
        </div>
      </div>
      <script async defer src="https://scripts.withcabin.com/hello.js" />
    </>
  );
}
