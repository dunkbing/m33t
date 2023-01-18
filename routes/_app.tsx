import { AppProps, PageProps } from "$fresh/server.ts";

export default function App({ Component, ...props }: AppProps & PageProps) {
  return <Component {...props} />;
}
