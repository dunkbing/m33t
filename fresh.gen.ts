// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[room].tsx";
import * as $1 from "./routes/api/connect.ts";
import * as $2 from "./routes/api/ice-candidate.ts";
import * as $3 from "./routes/api/joke.ts";
import * as $4 from "./routes/api/send.ts";
import * as $5 from "./routes/index.tsx";
import * as $$0 from "./islands/Counter.tsx";
import * as $$1 from "./islands/Options.tsx";
import * as $$2 from "./islands/Video.tsx";
import * as $$3 from "./islands/Videos.tsx";

const manifest = {
  routes: {
    "./routes/[room].tsx": $0,
    "./routes/api/connect.ts": $1,
    "./routes/api/ice-candidate.ts": $2,
    "./routes/api/joke.ts": $3,
    "./routes/api/send.ts": $4,
    "./routes/index.tsx": $5,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
    "./islands/Options.tsx": $$1,
    "./islands/Video.tsx": $$2,
    "./islands/Videos.tsx": $$3,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
