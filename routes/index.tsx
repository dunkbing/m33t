import { Handlers } from "$fresh/server.ts";
import { redirect } from "@/utils/redirect.ts";

export const handler: Handlers = {
  GET(_req, _) {
    const room = Math.random().toString(36).substring(2, 10);
    return redirect(room);
  },
};
