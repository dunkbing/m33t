import { Head } from "$fresh/runtime.ts";
import { JSX } from "preact";

export default function (props: JSX.HTMLAttributes<HTMLHeadElement>) {
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
        key="viewport"
      />
      <meta charSet="utf-8" />
      <meta name="google" content="notranslate" />
      <meta
        name="google-site-verification"
        content="EvBTnaMX5a54coVLUMXi9_87myajTYR_KF5j8T_Ag-E"
      />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <meta
        name="description"
        content="A free, peer-to-peer group video calling web application. No signups. No downloads"
      />
      <meta
        name="keywords"
        content="group video chat, video communication, multiparty video chat, video chat, webrtc, peer to peer, p2p"
      />
      <meta name="application-name" content="M33t" />
      <meta property="og:site_name" content="M33t" />
      <meta property="og:url" content="https://m33t.fun" />
      <meta property="og:image" content="https://m33t.fun/og-img.jpg" />
      <meta
        property="og:title"
        content="M33t - Free group video call for the web"
      />
      <meta
        property="og:description"
        content="A free, peer-to-peer group video calling web application. No signups. No downloads"
      />
      <meta property="article:author" content="https://github.com/dunkbing" />
      <title>M33t - Free group video call for the web</title>
    </Head>
  );
}
