export const redirect = (location: string, body?: BodyInit | null) =>
  new Response(body, {
    status: 301,
    headers: new Headers({
      location,
    }),
  });
