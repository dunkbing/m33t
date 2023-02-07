import { config } from "$std/dotenv/mod.ts";
import { cleanEnv, str } from "envalid";

const RAW_ENV = Object.assign(Deno.env.toObject(), await config());

const ENV = cleanEnv(RAW_ENV, {
  TELE_BOT_TOKEN: str(),
  TELE_CHAT_ID: str(),
});

export const { TELE_BOT_TOKEN, TELE_CHAT_ID } = ENV;

export default ENV;
