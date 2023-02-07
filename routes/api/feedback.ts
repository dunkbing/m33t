import { HandlerContext } from "$fresh/server.ts";
import { TelegramBot } from "telegram";
import { TELE_BOT_TOKEN, TELE_CHAT_ID } from "@/utils/config.ts";

const bot = new TelegramBot(TELE_BOT_TOKEN);

type FeedbackData = {
  subject: string;
  message: string;
};

export const handler = {
  async POST(req: Request, _ctx: HandlerContext): Promise<Response> {
    const { subject, message } = (await req.json()) as FeedbackData;
    const text = [subject, "---------------", message].join("\n");
    void bot
      .sendMessage({
        chat_id: TELE_CHAT_ID,
        text,
      })
      .catch((err) => console.error("Send tele message error:", err));

    return new Response(JSON.stringify({ message: "ok" }));
  },
};
